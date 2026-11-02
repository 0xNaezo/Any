#!/usr/bin/env python3
"""Скоринг кандидатов ресерча.

Примеры:
  python3 research/scripts/score.py                      # все research/streams/*/candidates.csv
  python3 research/scripts/score.py FILE [FILE ...]      # конкретные файлы
  python3 research/scripts/score.py FILE --out ranking.md --csv-out ranked.csv --top 30

Проверяет строки по схеме research/schema/candidates.csv, считает score по весам
из research/config/scoring.json (формула — research/brief/scoring.md) и выводит
рейтинг в markdown. Если есть ошибки валидации, код выхода — 2.
"""
import argparse
import csv
import glob
import json
import os
import sys
from datetime import date

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCHEMA = os.path.join(ROOT, "research", "schema", "candidates.csv")
CONFIG = os.path.join(ROOT, "research", "config", "scoring.json")
DEFAULT_GLOB = os.path.join(ROOT, "research", "streams", "*", "candidates.csv")
SHORT = {
    "traffic": "Трф", "demand": "Спр", "competition": "Кнк", "time_to_10k": "10k",
    "maintenance": "Под", "crypto_monet": "₿", "synergy": "Син", "constraints": "Огр",
}


def load_schema():
    with open(SCHEMA, newline="", encoding="utf-8") as f:
        return next(csv.reader(f))


def parse_score(value):
    try:
        x = float(str(value).strip().replace(",", "."))
    except ValueError:
        return None
    return x if 1 <= x <= 5 else None


def split_multi(value):
    return [p.strip() for p in str(value or "").replace(",", ";").split(";") if p.strip()]


def score_row(row, cfg):
    weights = cfg["weights"]
    problems = []
    gate = (row.get("gate") or "").strip().lower()
    if gate not in ("pass", "fail"):
        problems.append(f"gate должен быть pass|fail, получено {row.get('gate')!r}")
    conf = (row.get("confidence") or "").strip().upper()
    if conf not in ("H", "M", "L"):
        problems.append(f"confidence должен быть H|M|L, получено {row.get('confidence')!r}")
    if not (row.get("traffic_mechanism") or "").strip():
        problems.append("пустой traffic_mechanism")
    scores = {}
    for key in weights:
        s = parse_score(row.get(key))
        if s is None and gate != "fail":
            problems.append(f"{key}: нужна оценка 1–5, получено {row.get(key)!r}")
        scores[key] = s
    if problems or gate == "fail":
        return None, problems
    base = sum(w * (scores[k] - 1) / 4 for k, w in weights.items()) * 100 / sum(weights.values())
    streams = set(split_multi(row.get("streams"))) | set(split_multi(row.get("stream")))
    bonus = min(cfg["multi_stream_bonus_per_stream"] * max(len(streams) - 1, 0),
                cfg["multi_stream_bonus_max"])
    return {"base": round(base, 1), "bonus": bonus, "score": round(base + bonus, 1),
            "n_streams": len(streams)}, problems


def cell(value, limit=60):
    text = " ".join(str(value or "").split()).replace("|", "\\|")
    return text if len(text) <= limit else text[: limit - 1] + "…"


def fmt(x):
    return "" if x is None else (str(int(x)) if float(x).is_integer() else str(x))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*", help="CSV-файлы кандидатов (по умолчанию все потоки)")
    ap.add_argument("--config", default=CONFIG)
    ap.add_argument("--out", help="куда записать markdown (по умолчанию stdout)")
    ap.add_argument("--csv-out", help="куда записать отсортированный CSV со score")
    ap.add_argument("--top", type=int, default=0, help="сколько строк показать (0 = все)")
    args = ap.parse_args()

    with open(args.config, encoding="utf-8") as f:
        cfg = json.load(f)
    schema = load_schema()
    files = args.files or sorted(glob.glob(DEFAULT_GLOB))
    if not files:
        print("Нет файлов candidates.csv — нечего считать.")
        return 0

    ranked, failed, errors, seen = [], [], [], {}
    for path in files:
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            missing = [c for c in schema if c not in (reader.fieldnames or [])]
            if missing:
                errors.append(f"{path}: нет колонок {', '.join(missing)}")
                continue
            for line_no, row in enumerate(reader, start=2):
                rid = (row.get("id") or "").strip()
                where = f"{os.path.relpath(path, ROOT)}:{line_no} {rid or '<без id>'}"
                if not rid:
                    errors.append(f"{where}: пустой id")
                elif rid in seen:
                    errors.append(f"{where}: id уже встречался в {seen[rid]}")
                else:
                    seen[rid] = where
                result, problems = score_row(row, cfg)
                errors.extend(f"{where}: {p}" for p in problems)
                if problems:
                    continue
                if result is None:
                    failed.append(row)
                else:
                    ranked.append({**row, **result})

    ranked.sort(key=lambda r: (-r["score"], {"H": 0, "M": 1, "L": 2}.get(r["confidence"].strip().upper(), 3)))
    shown = ranked[: args.top] if args.top else ranked
    keys = list(cfg["weights"])

    out = [
        "# Рейтинг кандидатов", "",
        f"Сгенерировано {date.today().isoformat()} · файлов: {len(files)} · "
        f"в рейтинге: {len(ranked)} · отсеяно гейтом: {len(failed)} · ошибок: {len(errors)}", "",
        "Веса: " + ", ".join(f"{k} {w}" for k, w in cfg["weights"].items())
        + f" · бонус за потоки: +{cfg['multi_stream_bonus_per_stream']} за каждый доп. поток, макс +{cfg['multi_stream_bonus_max']}", "",
        "| # | id | Кандидат | Платформа | Механизм трафика | Score | " + " | ".join(SHORT[k] for k in keys) + " | Conf | Потоки |",
        "|---|---|---|---|---|---|" + "---|" * len(keys) + "---|---|",
    ]
    for i, r in enumerate(shown, 1):
        streams = r.get("streams") or r.get("stream")
        out.append(
            f"| {i} | {cell(r['id'], 20)} | {cell(r['name'])} | {cell(r['platform'], 20)} | "
            f"{cell(r['traffic_mechanism'], 40)} | **{r['score']}** | "
            + " | ".join(fmt(parse_score(r[k])) for k in keys)
            + f" | {cell(r['confidence'], 3)} | {cell(streams, 30)} |"
        )
    if failed:
        out += ["", "## Отсеяны гейтом", "", "| id | Кандидат | Гейт | Механизм |", "|---|---|---|---|"]
        out += [f"| {cell(r['id'], 20)} | {cell(r['name'])} | {cell(r['gate_reason'], 20)} | "
                f"{cell(r['traffic_mechanism'], 40)} |" for r in failed]
    if errors:
        out += ["", "## Ошибки валидации", ""] + [f"- {e}" for e in errors]
    text = "\n".join(out) + "\n"

    if args.out:
        os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Записано: {args.out} (в рейтинге {len(ranked)}, отсеяно {len(failed)}, ошибок {len(errors)})")
        if errors:
            print("\n".join(f"- {e}" for e in errors))
    else:
        sys.stdout.write(text)

    if args.csv_out:
        os.makedirs(os.path.dirname(os.path.abspath(args.csv_out)), exist_ok=True)
        with open(args.csv_out, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=["rank", "score", "base", "bonus"] + schema, extrasaction="ignore")
            w.writeheader()
            for i, r in enumerate(ranked, 1):
                w.writerow({"rank": i, **r})

    return 2 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
