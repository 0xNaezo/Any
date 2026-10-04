# Ось 4 — «Реальный бизнес с деньгами»: что можно проверить публично (дистиллят)

> Проверено живьём: **2026-10-04**. Полный дамп, цитаты ToS и методика — `../raw/4-business-signals.md`.
> Пометки: `[ОЦЕНКА]` — моё суждение с обоснованием; «источник заинтересован» — цифры продавца/конкурента; «устарело (до 2025)»; `[S#]` — ссылка на источник внизу. Нет данных → «нет данных».
> Контекст: поиск запуска уже сделан; нужно решить, на кого тратить ручную персонализацию (2–5 писем/день, бюджет — приоритет бесплатному). Систему не проектирую.

## 1. Главные выводы

1. **Прямых бесплатных данных о деньгах свежего инди-запуска почти нет.** Единственное исключение — **TrustMRR** (выручка верифицирована через API платёжного провайдера; ключ выдаётся в dashboard, плата в docs/FAQ не упоминается; 10 запросов/мин) [S25], но база — только добровольцы («over 15,000 startups» — по их собственному llms.txt, источник заинтересован) и по домену искать нельзя.
2. **Все трафик-рейтинги на свежих запусках пусты.** В калибровочной выборке (45 свежих Show HN-доменов, 2026-10-04): **0/45** в Tranco top-1M, **0/45** в CrUX top-1M, **0/45** в Majestic Million [S33]. Similarweb не показывает данные при <5 000 визитов/мес [S2]; на свежем домене из выборки — «No Data Available». Эти рейтинги годятся только как «плюс» для уже заметных продуктов.
3. **Лучший дешёвый косвенный признак — собственные публичные страницы продукта:** pricing-страница с ценами (12/44 = 27 %), и «pricing + login/signup + Terms/Privacy» одновременно (9/44 = 20 %) [S33]. Paddle официально требует похожий набор (описание, цены — допускается скриншот, если на сайте их нет; ToS/Refund/Privacy; юр. название в ToS; живой HTTPS-сайт) для апрува домена [S21] — т.е. это не придуманная эвристика, а критерии мерчант-ревью.
4. **Платёжный провайдер в публичном коде — сильный, но редкий сигнал.** Живой Paddle/Lemon Squeezy-чекаут означает пройденное ревью/KYC [S21][S22]; но статически найден только у 1/44 (Lemon Squeezy), **Stripe — 0/44** даже на 12 сайтах с ценами [S33]. Headless-проход не выполнен (окружение не позволило), поэтому 1/44 — **нижняя граница**. Ловушка: `pk_live_` — не только Stripe (Clerk тоже) [S23], 2 из 2 «pk_live_»-совпадений в выборке оказались не-Stripe.
5. **Фандинг-базы не подходят для этой популяции.** Crunchbase API — платный, через продажи, медиана контракта $20 000/год [S14]; PitchBook/Tracxn — десятки тысяч $ [S15, сторонние данные]; OpenVC — база инвесторов, не компаний [S16]. Бесплатно и легально только узкое: SEC Form D (США, Reg D) [S17] и список YC [S18]. Для bootstrapped indie-запусков фандинга «обычно нет» — это нормальный результат, не красный флаг [ОЦЕНКА].
6. **ToS-риски — главное ограничение автоматизации:** Crunchbase, LinkedIn, Trustpilot, X прямо запрещают автоматический сбор [S14][S19][S28][S32]; TrustMRR AUP запрещает «target a startup/founder» и «facilitate spam» [S25]; Radar (и производный Tranco) — лицензия CC BY-NC [S6][S7].
7. **Объём 2–5 писем/день вмещается во все бесплатные лимиты с запасом** (TrustMRR 10 req/мин [S25]; iTunes ≈20 req/мин [S26]; Tranco 1 req/с [S6]; EDGAR 10 req/с [S17]; CrUX API 150 QPM [S8]) — арифметика `[ОЦЕНКА]`: даже 20–30 кандидатов на скрининг в день × ≤10 запросов = <300 запросов/день.
8. **Слепые зоны:** нет ground-truth по выручке (измерены частоты сигналов, не их точность); выборка — Show HN (dev-ориентирован), не PH и не no-code-популяция; SPA-сайты (React/Vite — типично для Lovable/Bolt) статически «пусты» → без рендеринга охват занижен.

## 2. Таблицы сигналов

Условные уровни надёжности «для нашего кейса» (свежий запуск, малая команда; вопрос — «похоже ли, что готовы платить за backend-услугу»): **В**ысокая / **С**редняя / **Н**изкая / **0** — не работает. Все уровни — `[ОЦЕНКА]` (ground-truth нет), основания — в колонке и в raw §7.

### 2.A Платежи и выручка (самое важное)

| Сигнал / источник | Что показывает | Бесплатно / цена | Лимит | Надёжность для нашего кейса | ToS-риск |
|---|---|---|---|---|---|
| **TrustMRR** — проверенная выручка (API, публичные страницы `/startup/{slug}.md`) [S25] | MRR, выручка 30 дн., клиенты, подписки, рост, страна, дата основания, X-handle; `visitorsLast30Days` (из GA/DataFast/GSC, если подключены) | Ключ из developer dashboard; плата за API в docs/FAQ не упоминается (платные условия — нет данных); листинг стартапа бесплатный | Standard 10 req/мин, Premium 60 req/мин; 10 записей на страницу; **поиска по домену нет** (фильтры: category, xHandle, teamSize, fundingStatus, диапазоны revenue/MRR) | **В для попавших** (данные из API провайдера); охват — самоотбор: для случайного свежего запуска вероятность найти запись мала `[ОЦЕНКА]` (охват относительно запусков — нет данных) | **Средний.** AUP: внутренняя оценка допустима, но запрещены «target a startup, founder», «facilitate spam», перепродажа, обучение ИИ; для писем основателям — запросить письменное разрешение `[ОЦЕНКА]` |
| **Pricing-страница с ценами** (сайт продукта) | Намерение монетизации, платные планы | 0 (HTTP GET) | robots.txt; API нет | **С**: 12/44 (27 %) выборки; на всех 12 есть цены [S33]; не доказывает клиентов | Низкий (публичные страницы, соблюдать robots) |
| **Платёжный провайдер в публичном коде/чекауте** — Stripe (`js.stripe.com`, `<stripe-pricing-table>`, `<stripe-buy-button>`, `pk_live_`), Paddle (`cdn.paddle.com`, токен `live_`), Lemon Squeezy (`lemon.js`), Polar (`@polar-sh/checkout`) [S20][S21][S22] | Подключён платёжный провайдер. Paddle: домен одобрен Paddle («only … domain(s) that have been approved»); LS: live-режим после анкеты и проверки личности; Stripe: для live-режима нужна верификация бизнеса («verify your business and complete its activation requirements») | 0 (чтение публичного HTML/JS); платно: BuiltWith от $295/мес, Wappalyzer от $250/мес [S24]; бесплатно: 50 lookups/мес Wappalyzer, OSS-фингерпринты (wappalyzergo — MIT) | Нет лимитов на чтение; **статический детект виден у 1/44** (LS), Stripe 0/44 [S33] | **В по точности, Н по охвату.** Нахождение — сильный плюс; отсутствие ничего не значит. `js.stripe.com` Stripe рекомендует грузить на каждой странице [S20] — это интеграция, не продажи. `pk_live_` без контекста «stripe» — ложные (Clerk) [S23] | Низкий (публичные скрипты) |
| **Login/signup + Terms/Privacy** (продукт, не лендинг) | «Реальный продукт» + юридическая обвязка; для Paddle — условие апрува [S21] | 0 | — | **С/Н**: login/signup 16/44 (36 %), Terms/Privacy 26/44 (59 %) [S33]; сам по себе не про деньги; для SPA статически часто не виден | Низкий |
| **Метрики Apple App Store** — iTunes Search/Lookup API [S26] | `userRatingCount`, `averageUserRating`, `releaseDate`, `currentVersionReleaseDate`, `sellerName`, `sellerUrl`, `price` (живой запрос 2026-10-04) | Бесплатно, без ключа | «≈20 calls per minute (subject to change)» | **В для приложений** (реальный трекшн), но применимо к малой доле web-SaaS `[ОЦЕНКА]` | Низкий (официальный API) |
| **Chrome Web Store / Google Play** (публичные листинги) | CWS: «users», рейтинг, число оценок, «Last updated» (живо: «21,000,000 users», «3.6K ratings»); Play: рейтинг/диапазон установок | 0 (страница); официального API чтения чужих метрик не найдено | robots.txt CWS запрещает `/detail/*/reviews`, `/support`, `/search` и др., карточки — нет [S27] | **В для расширений/приложений**, редко применимо | **Средний/серый:** Google ToS запрещает автоматический доступ «in violation of … robots.txt» [S27]; в Play ToS явного запрета не нашёл (нет данных) |
| **Отзывы** G2 / Capterra / Trustpilot [S28][S29] | Число и рейтинг отзывов | Trustpilot Business Units API — бесплатный ключ, поиск по домену; G2 — токен (условия доступа не найдены); Capterra — нет данных | Trustpilot: лимиты не опубликованы | **Н**: у свежих запусков отзывов практически нет `[ОЦЕНКА]` | **Высокий** для scrape: Trustpilot ToS запрещает «web scraping … without our express permission» [S28] |
| **Product Hunt: голоса/комментарии** [S30] | Активность в день запуска | (ось 1) | — | **Н** как сигнал денег `[ОЦЕНКА]` | API: «must not be used for commercial purposes» без разрешения [S30] |

### 2.B Трафик и аудитория

| Сигнал / источник | Что показывает | Бесплатно / цена | Лимит | Надёжность для нашего кейса | ToS-риск |
|---|---|---|---|---|---|
| **Tranco** (ранг домена в 30-дн. агрегате 5 провайдеров) [S6] | Ранг; `producthunt.com` = 4 414 (2026-10-03) | Бесплатно; `top-1m.csv.zip`, API `/ranks/domain/{d}` | 1 запрос/с | **0 как фильтр** (0/45 в top-1M, 1/45 любой ранг 4.4M); **В как «плюс»** для заметных | **Средний:** в составе Radar (CC BY-NC 4.0); лицензия самого Tranco-вывода — нет данных [S6] |
| **CrUX** — top-list (1M origins, бакеты 1 000…1M), API, BigQuery [S8] | Реальные Chrome-пользователи: попадание = «sufficiently popular» (порог не раскрыт); полный датасет ≈15M origins | Бесплатно; API — ключ Google Cloud; BigQuery — 1 TB запросов/мес бесплатно | **150 QPM на проект, увеличить нельзя**; список обновляется ежемесячно | **0 как фильтр** (0/45 в top-1M); API-проверка origin — не тестировалась (нужен ключ) | Низкий/средний: CC BY-SA 4.0 по заявлению Tranco; лицензия списка в репозитории не указана |
| **Majestic Million** [S9] | Ссылочный авторитет (RefSubNets), не трафик | Бесплатно, CC BY 3.0, CSV ≈81 MB, 1M строк | — | **0 как фильтр** (0/45); у устоявшихся малых сайтов есть (devhunt.org #267 948) | Низкий (CC BY 3.0, атрибуция) |
| **Cloudflare Radar** — domain ranking [S7] | top-100 упорядоченно + бакеты 200…1M (еженедельно) | API бесплатный, нужен токен | общий лимит CF API 1 200 req/5 мин | **0 для свежих** по структуре (нижний бакет 1M) `[ОЦЕНКА]`; поведение для нераскрученного домена в доке не описано | **Средний:** лицензия CC BY-NC 4.0 (некоммерческая) |
| **Similarweb** (free web / API) [S1][S2][S3] | Визиты, ранг, источники трафика | Free web: аноним — «3 of 3 daily searches» (2026-10-04); платформа цены не публикует (агрегаторы: $149–$399/мес — не подтверждено); API — только через продажи | Данные не показываются при <5 000 визитов/мес; API возвращает значения и ниже порога | **Н для свежих** («No Data Available» на свежем домене); на малых сайтах точность плохая (SparkToro 2022, **устарело (до 2025)**: ошибки часто >±100 %; Omniconvert: завышение ≈94 % на e-commerce) [S4][S5] | Средний (автоматизация free-страниц не проверялась на ToS — нет данных) |
| **Ahrefs / Semrush** [S11][S12] | Оценка органического трафика, DR/авторитет | Ahrefs Free Traffic Checker (органика, для любого домена); Semrush Free — «10 reports per day»; платно: Ahrefs от $129/мес (API v3, Lite), Semrush от $139/мес (API — Advanced $549 или add-on к Business) | Ahrefs API: 200 000 units/мес (Lite), мин. 50 units/запрос; расхождения в официальных страницах | **Н** на малых сайтах (оценка только органики; SparkToro 2022 — **устарело (до 2025)**) | Низкий для ручного использования |
| **Google Trends / Open PageRank** [S13][S10] | Поисковый интерес / ссылочный score 0–10 | Trends API — alpha по заявке; OPR — 30 000 доменов/мес бесплатно, до 100 доменов в вызове | — | **0/Н**: брендового интереса к свежему продукту нет `[ОЦЕНКА]`; OPR — граф Common Crawl, у новых доменов пусто | Низкий |

### 2.C Фандинг и компания

| Сигнал / источник | Что показывает | Бесплатно / цена | Лимит | Надёжность для нашего кейса | ToS-риск |
|---|---|---|---|---|---|
| **Crunchbase** [S14] | Раунды, инвесторы, размер | UI Free — «quickly learn about a company»; Pro ≈ $588 за 1-й год (экспорт 2k строк/мес); **API — платный, через продажи**, медиана $20 000/год (Vendr, 71 сделка, до 2026-02) | API 200 req/мин | **Н**: охват «4M+ private companies» — компании, интересные инвесторам; bootstrapped indie редки `[ОЦЕНКА]` | **Высокий:** ToS запрещает «scrapes … any page», автоматический экспорт, обучение моделей [S14] |
| **Tracxn / PitchBook** [S15] | То же, глубже | Tracxn — «от $500/мес, usage based» (Capterra); PitchBook — $12–40 тыс./пользователь/год (агрегатор) — **сторонние, не первичные** | — | **Н** (не для indie) | Договорные условия не изучались (нет данных) |
| **OpenVC** [S16] | Список **инвесторов** (≈16–20 тыс.) | Бесплатно | — | **0**: не база финансирования компаний | — |
| **SEC EDGAR Form D** [S17] | Объявленные раунды в США: «file Form D within 15 days after the first sale» | Бесплатно, без ключа | 10 req/с, обязателен User-Agent с контактом | **В, но очень узко:** только США и Reg D; bootstrapped/неамериканские — нет | Низкий (при соблюдении fair access) |
| **YC OSS API** (неофициальный JSON) [S18] | Компании YC: batch, team_size, статус, сайт | Бесплатно | обновление раз в сутки | **В, но очень узко** (только YC) | Низкий; лицензия не указана |
| **LinkedIn — размер команды** [S19] | Диапазон штата | Официальный API: `staffCountRange` — «Admin Only: True»; публичного пути нет | — | **С**, если смотреть человеком; автоматизировать нельзя | **Высокий:** User Agreement (2025-11-03) запрещает scrape/боты; hiQ — нарушение договора, **$500 000** + запрет (2022, **устарело (до 2025)**, но прецедент действует) |

### 2.D Живость

| Сигнал / источник | Что показывает | Бесплатно / цена | Лимит | Надёжность для нашего кейса | ToS-риск |
|---|---|---|---|---|---|
| **HTTP-доступность** | Сайт работает/удалён (410), парковка | 0 | — | **С как фильтр мусора**: 44/45 живы [S33] | Низкий |
| **RDAP** (`rdap.org`) [S31] — дата регистрации/срок | Возраст домена, срок регистрации | Бесплатно | единичные 429; **нет для .io/.sh/.md** (5/45) | **Н**: медиана возраста в «свежей» воронке 54.5 дня (n=40), 17/40 ≤30 дней — не различает серьёзность [S33] | Низкий |
| **DNS MX/SPF** | Почта на домене | Бесплатно (DoH) | — | **Н**: MX у 29/45 (64 %), корп-тип (Google/Zoho) 9/45 [S33] | Низкий |
| **CT-логи / Wayback** [S31] | Первый сертификат / история | CertSpotter без ключа (`x-ratelimit-limit: 100`); crt.sh и Wayback из песочницы нестабильны (502/429/reset) | см. колонку | **Н**, ненадёжны | Низкий |
| **Соцсети** — GitHub API, Bluesky public API, X [S32] | Активность команды | GitHub: 60 req/ч без токена, 5 000 с токеном; Bluesky — без авторизации; **X — только pay-per-use** («Posts: Read $0.005 per resource»), бесплатного тарифа нет | см. колонку | **Н** для денег (для dev-продуктов GitHub — полезный «жив/активен») `[ОЦЕНКА]` | **Высокий для X:** ToS запрещает scraping без письменного согласия |

## 3. Калибровочная выборка (n=45, Show HN, 2026-10-04) — только частоты, не точность

Источник: HN Algolia API; 1 000 новейших из 1 795 Show HN за 14 дней (≈2026-09-27…10-04); после чистки — 534 домена, из них 423 apex (79 %), 8 (1.5 %) — поддомены хостингов; случайные 45 apex-доменов; robots.txt соблюдён (0 запретов); пассивные запросы, статический разбор [S33]. Медиана HN-очков 2.

| Признак | Частота |
|---|---|
| Сайт жив (HTTP 200) | 44/45 (1 × 410) |
| Tranco top-1M / CrUX top-1M / Majestic | 0 / 0 / 0 из 45 |
| Ссылка «Pricing» с ценами | 12/44 (27 %) |
| Login/signup | 16/44 (36 %) |
| Terms/Privacy | 26/44 (59 %) |
| Pricing + login + Terms | 9/44 (20 %) |
| Платёжный маркёр провайдера (статика) | 1/44 (Lemon Squeezy); PayPal 1; Stripe 0 |
| `pk_live_` без контекста Stripe | 2 совпадения — оба не Stripe (Clerk и др.) |
| Домен зарегистрирован ≤90 дней назад | 22/40 (RDAP ответил у 40/45) |
| MX на домене | 29/45 |

Ограничения: headless-рендеринг не выполнен (окружение отклонило обход TLS-перехвата — я не обходил); SPA-сайты статически почти пусты (10/44 имеют ≤3 ссылок на главной); платёжные маркёры — нижняя граница; Show HN ≠ PH.

## 4. Минимальный бесплатный набор сигналов для квалификации

Порядок — от самого дешёвого/информативного. Всё, кроме п. 4–5, — пассивное чтение публичного сайта продукта.

1. **Жив ли и не мусор:** HTTP 200 (не 410/парковка/«coming soon»); дата регистрации через RDAP (для .io/.sh/.md RDAP нет). Фильтр, не квалификатор.
2. **Pricing-страница с ценами** — основной бесплатный «денежный» признак (27 % выборки). Что именно фиксировать: наличие платных планов, диапазон цен, есть ли «Contact sales».
3. **Это продукт, а не лендинг:** login/signup/app-ссылка + Terms/Privacy с юридическим названием (для Paddle/LS — часть обязательных требований мерчант-ревью [S21]).
4. **Платёжный провайдер, если виден:** Stripe (`js.stripe.com`, `stripe-pricing-table`, `stripe-buy-button`, `pk_live_` **только в контексте Stripe**), Paddle (`cdn.paddle.com`, токен `live_`), Lemon Squeezy (`lemon.js`), Polar. Находка — сильный плюс; отсутствие — нейтрально (статический recall ≈2 % в выборке).
5. **TrustMRR** (бесплатный API-ключ или ручной просмотр): если стартап есть — это лучший публичный сигнал выручки; перед использованием для писем — прочитать AUP и [ОЦЕНКА] запросить письменное разрешение.
6. **Метрики сторов, если есть приложение/расширение:** iTunes API (`userRatingCount`, даты релизов) и страница Chrome Web Store (users/ratings).
7. **Позитивные бонусы (редкие):** присутствие в Tranco/CrUX top-1M/Majestic; GitHub-активность для dev-продуктов.
8. **Ручной взгляд человека** на публичную LinkedIn-страницу компании (размер команды) — **не автоматизировать** (ToS + hiQ).

Бюджет запросов при 2–5 письмах/день укладывается во все бесплатные лимиты (см. вывод 7).

## 5. Что добавить за деньги (с ценой; значимость — `[ОЦЕНКА]`)

| Платный источник | Цена | Что добавляет | Стоит ли для нашего кейса |
|---|---|---|---|
| BuiltWith Basic [S24] | $295/мес (Pro $495, Team $995); лимиты API на странице не указаны | Стек и платёжные провайдеры по домену/спискам | Не окупается при 2–5 письмах/день; лишь если нужен массовый скрининг |
| Wappalyzer Pro [S24] | $250/мес (5 000 API-кредитов, истекают через 60 дней); free — 50 lookups/мес | То же | Free-50 мало: 2–5 писем × 30 дней = 60–150 проверок/мес `[ОЦЕНКА]` |
| Ahrefs Lite [S11] | $129/мес (API v3; 200 000 units/мес по help-странице, расхождения) | Оценка органического трафика, DR | Мало ценности на малых сайтах |
| Semrush [S12] | от $139/мес; API — add-on/Advanced $549 | Оценки трафика/ключей | То же |
| Similarweb API [S1] | цены не публикуются (агрегаторы: ≈$16 тыс./год — **не подтверждено**) | Визиты (в API — и ниже порога 5 000) | Только если цели — компании крупнее; для малых — ошибка >±100 % [S4, устарело (до 2025)] |
| Crunchbase [S14] | Pro ≈$588 (1-й год, UI); API — медиана $20 000/год (Vendr) | Раунды/инвесторы | Нет: у bootstrapped данных нет |
| Tracxn / PitchBook [S15] | ≈$500/мес / $12–40 тыс. за пользователя в год (сторонние данные) | То же | Нет |
| X API [S32] | pay-per-use, $0.005 за прочитанный пост | Активность аккаунтов | Нет (слабый сигнал, ToS запрещает scrape) |
| TrustMRR Premium-ключ [S25] | цена — нет данных | 60 req/мин вместо 10 | Не нужен при текущем объёме |
| Юр. консультация (CC BY-NC для Radar/Tranco; разрешение TrustMRR) | нет данных | Снимает правовую неопределённость | Дёшево по сравнению с риском, но оценок нет |

## 6. Ловушки (проверено)

- **`pk_live_` ≠ Stripe.** Clerk использует тот же префикс для production [S23]; в выборке оба совпадения — не Stripe.
- **`js.stripe.com` на странице ≠ продажи:** Stripe сам рекомендует грузить скрипт на каждой странице ради антифрода [S20].
- **Ранги несопоставимы:** producthunt.com — Tranco 4 414, Majestic #1 264, Similarweb #16 323, CrUX-бакет 100 000 [S6][S9][S1][S8].
- **Tranco API отдаёт ранги >1M** (devhunt.org 1 002 833), тогда как скачиваемый файл — только top-1M [S6, наблюдение].
- **Отсутствие в TrustMRR/топ-списках ≠ «нет денег»:** TrustMRR — самоотбор; топ-списки не видят свежих.
- **Статика не видит SPA и поздно загружаемые скрипты** — частоты платёжных маркёров занижены.
- **Lemon Squeezy → Stripe Managed Payments (2026):** возможны смены маркёров; источники по теме — конкуренты (источник заинтересован) [S22].
- **Лицензии NC:** данные Radar (и Tranco как производное) помечены «non-commercial».

## 7. Нет данных / не подтверждено

- Охват TrustMRR относительно свежих запусков; цена Premium-ключа; наличие разового поиска по домену без перебора каталога.
- Реальный бесплатный/Basic-ключ Crunchbase API (доки и Knowledge Center расходятся); первичные цены Tracxn, PitchBook, Similarweb, G2 Buyer Intent.
- Права токена и ответ Cloudflare Radar для нераскрученного домена; живой вызов CrUX API не делался (нужен ключ).
- Capterra (API/ToS), явный запрет в Google Play ToS, Polar sandbox-маркёры.
- Headless-детект динамических платёжных скриптов; точность любых сигналов относительно реальной выручки (ground-truth отсутствует).

## 8. Источники

[S1] https://www.similarweb.com/packages/web/ · https://www.similarweb.com/corp/pricing/ · [S2] https://support.similarweb.com/hc/en-us/articles/360002219177 · [S3] https://developers.similarweb.com/docs/why-does-the-api-return-exact-values-for-small-sites · [S4] https://sparktoro.com/blog/which-3rd-party-traffic-estimate-best-matches-google-analytics/ (2022-11, устарело (до 2025)) · [S5] https://www.omniconvert.com/blog/we-analyzed-1787-ecommerce-websites-similarweb-google-analytics-thats-we-learned/ · [S6] https://tranco-list.eu/ · https://tranco-list.eu/api_documentation · [S7] https://developers.cloudflare.com/radar/ · https://developers.cloudflare.com/radar/investigate/domain-ranking-datasets/ · [S8] https://developer.chrome.com/docs/crux/api · https://developer.chrome.com/docs/crux/methodology · https://github.com/zakird/crux-top-lists · [S9] https://majestic.com/reports/majestic-million · [S10] https://openpagerank.keywordseverywhere.com/ · [S11] https://ahrefs.com/pricing · https://help.ahrefs.com/en/articles/6559232-about-api-v3 · https://ahrefs.com/traffic-checker · [S12] https://www.semrush.com/pricing/ · https://developer.semrush.com/api/basics/introduction/ · [S13] https://developers.google.com/search/blog/2025/07/trends-api · [S14] https://support.crunchbase.com/hc/en-us/articles/360062989313 · https://data.crunchbase.com/docs/using-the-api · https://about.crunchbase.com/terms-of-service/ · https://www.vendr.com/marketplace/crunchbase · [S15] https://www.capterra.com/p/204090/Tracxn/pricing/ · https://costbench.com/software/financial-data-terminals/pitchbook (сторонние) · [S16] https://openvc.app/about · [S17] https://www.sec.gov/files/form-d-02182026.pdf · https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data · [S18] https://github.com/yc-oss/api · [S19] https://www.linkedin.com/legal/user-agreement · https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-lookup-api · https://newmedialaw.proskauer.com/2022/12/08/hiq-and-linkedin-reach-proposed-settlement-in-landmark-scraping-case/ · [S20] https://docs.stripe.com/js/including · https://docs.stripe.com/keys · https://docs.stripe.com/payments/checkout/pricing-table · https://docs.stripe.com/get-started/account/activate · [S21] https://developer.paddle.com/paddlejs/include-paddlejs · https://www.paddle.com/help/start/account-verification/what-is-domain-approval · https://www.paddle.com/help/start/account-verification/why-has-my-domain-been-rejected · [S22] https://docs.lemonsqueezy.com/help/lemonjs · https://docs.lemonsqueezy.com/help/getting-started/activate-your-store · [S23] https://clerk.com/docs/guides/development/clerk-environment-variables · [S24] https://www.wappalyzer.com/pricing/ · https://builtwith.com/plans · https://github.com/projectdiscovery/wappalyzergo · [S25] https://trustmrr.com/docs/api · https://trustmrr.com/terms · https://trustmrr.com/llms.txt · [S26] https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html · https://itunes.apple.com/search?term=notion&entity=software&limit=1 · [S27] https://policies.google.com/terms · https://play.google.com/robots.txt · https://chromewebstore.google.com/robots.txt · [S28] https://developers.trustpilot.com/business-units-api-(public) · https://corporate.trustpilot.com/legal/for-reviewers/terms-of-use-for-consumers · [S29] https://documentation.g2.com/docs/developer-portal.md · [S30] https://api.producthunt.com/v2/docs · [S31] https://rdap.org/ (живые проверки) · https://api.certspotter.com/v1/issuances · https://archive.org/wayback/available · [S32] https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api · https://docs.x.com/x-api/getting-started/pricing · https://x.com/en/tos · [S33] калибровка: https://hn.algolia.com/api/v1/search_by_date?tags=show_hn (методика и список доменов — raw §6).
