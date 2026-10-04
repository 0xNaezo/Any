# Прогресс research-прогона

Дата старта: **2026-10-04**. Легенда статусов: `pending` → `in_progress` → `done` / `blocked`.

| # | Ось | Статус | Файлы (raw / findings) | Время (UTC) |
|---|-----|--------|------------------------|-------------|
| 1 | Product Hunt как источник данных | **done** | `raw/1-product-hunt.md` · `findings/1-product-hunt.md` | готово 13:36 |
| 2 | Смежные launch-площадки | in_progress | `raw/2-launch-platforms.md` · `findings/2-launch-platforms.md` | старт 13:11 |
| 3 | Детект слабого бэкенда (публичные признаки) | in_progress | `raw/3-backend-signals.md` · `findings/3-backend-signals.md` | старт 13:11 |
| 4 | Квалификация «реальный бизнес с деньгами» | in_progress | `raw/4-business-signals.md` · `findings/4-business-signals.md` | старт 13:11 |
| 5 | Поиск контакта основателя/мейкера | in_progress | `raw/5-contact-finding.md` · `findings/5-contact-finding.md` | старт 13:11 |
| 6 | Доставляемость + легальность cold email | in_progress | `raw/6-email-delivery.md` · `findings/6-email-delivery.md` | старт 13:11 |
| 7 | Ожидаемая отдача / бенчмарки / юнит-экономика | **done** | `raw/7-roi-benchmarks.md` · `findings/7-roi-benchmarks.md` | готово 13:34 |

## Журнал
- 2026-10-04 13:09 UTC — создан скаффолдинг (`plan.md`, `progress.md`, `FINAL.md`, `raw/`, `findings/`). Оси 3–7 реконструированы из механики воронки (см. `plan.md` §2).
- 2026-10-04 13:11 UTC — запущены 7 сабагентов-исследователей (по одному на ось, параллельно). Статусы → `in_progress`. Жду завершения, затем синтез `FINAL.md`.
- 2026-10-04 13:34 UTC — **ось 7 done** (бенчмарки cold email — все вендорские, помечены; параметрическая воронка; стоимость стека снята вживую 2026-10-04). Остальные 6 осей ещё в работе.
- 2026-10-04 13:36 UTC — **ось 1 done** (Product Hunt). Главное: единственный машинный канал со списком запусков без токена — Atom-фид `/feed` (50 записей, без пагинации); API v2 бесплатен, но ToS прямо запрещает коммерческое использование и скрейпинг, контакты мейкеров в API [REDACTED]; легальный путь — письмо на hello@producthunt.com (цены нет данных). Осталось 5 осей.
