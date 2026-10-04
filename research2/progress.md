# Прогресс research-прогона

Дата старта: **2026-10-04**. Легенда статусов: `pending` → `in_progress` → `done` / `blocked`.

| # | Ось | Статус | Файлы (raw / findings) | Время (UTC) |
|---|-----|--------|------------------------|-------------|
| 1 | Product Hunt как источник данных | **done** | `raw/1-product-hunt.md` · `findings/1-product-hunt.md` | готово 13:36 |
| 2 | Смежные launch-площадки | **done** | `raw/2-launch-platforms.md` · `findings/2-launch-platforms.md` | готово 13:45 |
| 3 | Детект слабого бэкенда (публичные признаки) | **done** | `raw/3-backend-signals.md` · `findings/3-backend-signals.md` | готово 13:55 |
| 4 | Квалификация «реальный бизнес с деньгами» | **done** | `raw/4-business-signals.md` · `findings/4-business-signals.md` | готово 13:41 |
| 5 | Поиск контакта основателя/мейкера | in_progress | `raw/5-contact-finding.md` · `findings/5-contact-finding.md` | старт 13:11 |
| 6 | Доставляемость + легальность cold email | **done** | `raw/6-email-delivery.md` · `findings/6-email-delivery.md` | готово 13:50 |
| 7 | Ожидаемая отдача / бенчмарки / юнит-экономика | **done** | `raw/7-roi-benchmarks.md` · `findings/7-roi-benchmarks.md` | готово 13:34 |

## Журнал
- 2026-10-04 13:09 UTC — создан скаффолдинг (`plan.md`, `progress.md`, `FINAL.md`, `raw/`, `findings/`). Оси 3–7 реконструированы из механики воронки (см. `plan.md` §2).
- 2026-10-04 13:11 UTC — запущены 7 сабагентов-исследователей (по одному на ось, параллельно). Статусы → `in_progress`. Жду завершения, затем синтез `FINAL.md`.
- 2026-10-04 13:34 UTC — **ось 7 done** (бенчмарки cold email — все вендорские, помечены; параметрическая воронка; стоимость стека снята вживую 2026-10-04). Остальные 6 осей ещё в работе.
- 2026-10-04 13:36 UTC — **ось 1 done** (Product Hunt). Главное: единственный машинный канал со списком запусков без токена — Atom-фид `/feed` (50 записей, без пагинации); API v2 бесплатен, но ToS прямо запрещает коммерческое использование и скрейпинг, контакты мейкеров в API [REDACTED]; легальный путь — письмо на hello@producthunt.com (цены нет данных). Осталось 5 осей.
- 2026-10-04 13:55 UTC — **ось 3 done** (детект бэкенда). Сигнатуры билдеров по пассивным признакам (домен/заголовки/meta/JS): Lovable, Bubble (`x-bubble-*`), Replit, Bolt, v0, Webflow, Framer, Supabase, Firebase — но все маркеры исчезают на платных планах/кастомных доменах. Supabase anon / firebaseConfig публичны ПО ДИЗАЙНУ (архитектура «клиент→BaaS», а не дыра); любой вызов с ключом = уже активное зондирование (запрещено). Инструменты: SSL Labs ToS запрещает чужие сайты/коммерцию, securityheaders API закрыт (апр.2026), MDN Observatory «active-light», Wappalyzer lookup только $450/мес; бесплатно — wappalyzergo/httpx/WhatWeb (GPL). [ОЦЕНКА] доля с отпечатком AI-билдера 7–9%, с no-code+BaaS ≈10–18%.
- 2026-10-04 13:50 UTC — **ось 6 done** (доставляемость/легальность). При 2–5/день нужны SPF+DKIM+DMARC p=none (иначе спам/5.7.26), жалобы <0,3%, прогрев-сервис НЕ нужен (только естественный рэмп). ⚠️ ESP с прямым запретом cold в AUP: Resend, Postmark, Amazon SES, Mailgun, SendGrid, Brevo → рабочий вариант обычный ящик Google Workspace/Microsoft 365 (~$7/мес). Право: US ok (opt-out), DE/AT нельзя без согласия даже B2B, часть ЕС — нужен юрист. В письме обязательны честные From/тема, физадрес, рабочий отказ, для EU — GDPR Art.14/21. Inbox placement ≈80–90% [ОЦЕНКА].
- 2026-10-04 13:45 UTC — **ось 2 done** (смежные площадки). Топ-3 бесплатных источника: Show HN через Algolia HN API (~124 запуска/день, 97% с URL), Uneed официальный REST/MCP (17–39/день), TinyLaunch HTML+JSON-LD (280–365/нед). Запрет автосбора/платно: Indie Hackers, TAAFT, G2, Reddit, Launch YC. Важно для оси 3: AI-билдеры почти не видны по хосту URL (0 из 11168 Show HN) → детект только по содержимому страницы. Узкое место — квалификация, не объём.
- 2026-10-04 13:41 UTC — **ось 4 done** (бизнес-сигналы). Главное: лучшие дешёвые пассивные сигналы денег — pricing-страница (≈27% выборки), платёжный маркёр Paddle/Lemon/Stripe (редко виден статически), login/signup. На свежих мелких доменах Tranco/Similarweb/Crunchbase не работают (нет данных/платно); ToS Crunchbase/LinkedIn/Trustpilot/X запрещают автосбор. ⚠️ К проверке при синтезе: упомянутый «TrustMRR API» — сверить первоисточник в raw. Осталось 4 оси.
