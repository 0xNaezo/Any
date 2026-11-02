# S3 — Поиск и AI-ответы: проверка спроса (фаза 2)

Код: `S3` · Папка: `research/streams/s3-search/`

Поток запускается после синтеза фазы 1. Вход: `research/synthesis/top15.md` и `research/synthesis/candidates_master.csv`.

## Задачи
- **A.** Проверить спрос по топ-15 кандидатам через поиск и AI-ответы.
- **B.** Найти 30–50 идей tool-запросов в наших нишах, где в топе выдачи форумы и слабые сайты, плюс языковой арбитраж.

## Объёмы: источники
- **Основной** — Manifold (объём, KD, CPC, выдача, AI Overviews, видимость в AI-ответах). Найди его инструменты через `ToolSearch` по ключевым словам `manifold`, `keyword`, `serp`.
- **Если Manifold недоступен:**
  - Google autocomplete;
  - Google Trends (относительный интерес);
  - разбор выдачи через WebSearch;
  - бесплатные keyword-тулзы без логина.

  Все объёмы тогда помечай `estimate`, давай диапазон и **в начале `findings.md` крупно напиши, что точных объёмов нет**.

## A. Проверка топ-15
Для каждого кандидата:
1. Семантическое ядро: 5–20 запросов (head и long-tail) на EN и основных языках ниши.
2. Объём, KD, интент, тренд за 12–24 месяца.
3. Топ-10 выдачи по трём главным запросам. Каждый результат помечай типом:
   - `forum` — Reddit, Quora, форумы;
   - `weak` — маленький, старый или кривой сайт без нужной функции;
   - `strong` — сильный бренд, высокий DR, хорошая тулза;
   - `video`;
   - `other`.

   Доля `forum` + `weak` — это и есть окно возможностей.
4. AI-ответы:
   - есть ли AI Overview и кого он цитирует;
   - что ChatGPT и Perplexity отвечают на 3 вопроса вида «best tool for X» (через Manifold, если доступен; иначе пометь «не проверено»).
5. Вердикт `confirmed` / `weak` / `rejected` и обновлённые оценки `demand` и `competition`.

## B. 30–50 идей
1. **Сгенерируй шаблоны запросов** в наших нишах: `<объект> checker | calculator | converter | decoder | generator | validator | tracker | lookup | explorer | simulator | estimator`, плюс модификаторы `online`, `free`, `no signup`.

   Затравка (проверить, не принимать на веру):
   - transaction/calldata decoder;
   - gas и fee calculator по сетям;
   - airdrop eligibility checker;
   - wallet age checker;
   - token approval checker;
   - liquidation price calculator;
   - impermanent loss calculator;
   - RPC latency checker;
   - ENS/SNS lookup;
   - API rate-limit calculator;
   - cron/webhook тестеры.
2. **Отфильтруй.** Оставь идею, если:
   - у кластера ~500+ запросов в месяц (или эквивалент для не-EN рынка);
   - в топ-10 не меньше 3 результатов `forum` или `weak`;
   - тулзу можно собрать меньше чем за 2 недели.
3. **Языковой арбитраж.** Возьми EN-запросы с сильным спросом и проверь те же запросы на ES, PT-BR, DE, FR, TR, ID, VI, JA, KO, RU, UK, PL, IT: есть ли там локальные тулзы, или в топе EN-сайты и форумы. Записывай только пары с реальным объёмом.

## Схема `raw.csv`
```
ref_id,keyword,lang,country,volume,volume_type,kd,cpc,intent,trend_12m,serp_top10_types,forum_weak_share,ai_overview,ai_cited_sources,existing_tools,gap,tool_ideas,source
```
- `ref_id` — id кандидата из топ-15 или `IDEA-NNN`;
- `serp_top10_types` — например `forum;weak;strong;…`.

## Выход
- `validation.csv`:
  ```
  candidate_id,verdict,demand_new,competition_new,key_keywords,total_volume,volume_type,forum_weak_share,ai_overview,notes
  ```
- `candidates.csv`: идеи из части B, прошедшие фильтр, как новые кандидаты с `stream=S3`.
- `findings.md`:
  - вердикты по топ-15;
  - 30–50 идей с объёмом, KD и долей слабых результатов, отсортированные по убыванию;
  - лучшие пары языкового арбитража.
