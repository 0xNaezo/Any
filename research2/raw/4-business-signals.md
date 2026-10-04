# Ось 4 — «Реальный бизнес с деньгами»: публичные сигналы (RAW-дамп)

> Дата прогона и всех «живых» проверок: **2026-10-04 (UTC)**. Cutoff знаний — январь 2026.
> Шаг воронки: после нахождения запуска — проверить, что это не хобби-проект, чтобы тратить ручную персонализацию только на платёжеспособных.
> Исполнитель: малая команда, 2–5 писем/день. Бюджет: приоритет бесплатному.
> Это сырой дамп: источники, цены, лимиты, цитаты ToS, живые проверки. Дистиллят — `../findings/4-business-signals.md`.

## 0. Метод, пометки, ограничения

**Пометки достоверности (по правилам прогона).**
- Число — с URL либо `[ОЦЕНКА]` + обоснование. «нет данных» — нормальный результат.
- «**источник заинтересован**» — цифры продавца/конкурента/агрегатора, продающего подписки.
- «**устарело (до 2025)**» — материал старше 2025 г.
- Способ получения: `[raw]` — читал сырой текст страницы/ответ API; `[WebFetch]` — пересказ малой моделью (цитаты в нём могут быть неточны, ключевые — перепроверял); `[curl]` — прямой запрос из песочницы; `[поиск]` — выдача поисковика (только как указатель, не как доказательство).

**Что делал.** 27 WebSearch (+2 Exa-поиска), ~75 WebFetch/Exa-fetch, десятки прямых `curl`-проверок (Tranco API, RDAP, iTunes API, CertSpotter, Majestic/CrUX-файлы, TrustMRR docs и т.д.) + **малая калибровочная выборка** (45 свежих запусков Show HN; §6) для оценки охвата сигналов на «свежих» доменах.

**Ограничения (честно).**
1. **Headless-рендеринг не выполнен.** Попытка прогнать выборку через headless Chromium упёрлась в TLS-перехват прокси песочницы; обход (игнор ошибок сертификата) был отклонён политикой окружения как ослабление TLS — я его не повторял и не обходил. Поэтому детект «платёжных маркёров/ссылок» в калибровке — **только статический** (HTML + до 6 same-origin JS + pricing-страница). Для SPA на React/Vite/Next (типично для Lovable/Bolt/v0) охват (recall) **занижен** — см. §6.
2. Калибровочная выборка — **Show HN, а не Product Hunt**, n=45, без ground-truth по выручке: считаются частоты сигналов, а не их точность. Сайты из выборки не проверялись на no-code/AI-билдер (это ось 3).
3. Часть сайтов отдаёт 403/429 для WebFetch (Similarweb support, SEC, Capterra, Crunchbase support-статьи) — для них использован Exa-fetch/curl или записано «нет данных».
4. Ни одна платная подписка не оформлялась; платные цифры — только из публичных страниц и агрегаторов (помечены).

---

## 1. ТРАФИК / АУДИТОРИЯ

### 1.1 Similarweb

**Платформа / цены.**
- Страница пакетов `https://www.similarweb.com/packages/web/` и `https://www.similarweb.com/corp/pricing/` `[raw/WebFetch]`: цифр цен **нет** (quote-only). Цитата: «If you're interested in our solutions for businesses and enterprises, please contact our sales team to discuss a custom package…».
- Агрегаторы (costbench, joinsecret, getspike — `[поиск]`, **источник не первичный / не подтверждено**): Starter $149/мес ($125 при годовой оплате), Professional $399/мес ($333/год), Enterprise «от ~$16 000/год». Первичная страница 2026-10-04 этих цифр не показывает.
- **Бесплатный тариф** — источники противоречат друг другу: «5 lookups/мес и 1 мес истории» (агрегатор, `[поиск]`), «100 monthly data credits» (агрегатор, `[поиск]`), «5 results per metric, 3 месяца веба» (Databox, 2022-04 — **устарело (до 2025)**). Первичного подтверждения нет.
- Блог Similarweb (2024-06-13, **устарело (до 2025)**; `https://www.similarweb.com/blog/marketing/marketing-strategy/similarweb-free/`): бесплатный аккаунт — «unlimited website queries for free using our tool (but up to 15 per day)»; 7-дневный триал — 15 действий/день.
- **Живая проверка (2026-10-04) `[WebFetch]`:** на бесплатных страницах `similarweb.com/website/<домен>/` для анонима отображается счётчик «You have 3 of 3 daily searches remaining» (т.е. **3 поиска/день без логина**), тот же сервис для части доменов отдал данные (producthunt.com, devhunt.org, tinylaunch.com), для других — страницу-поиск.

**Порог данных для малых сайтов.**
- `[raw/Exa]` `https://support.similarweb.com/hc/en-us/articles/207698639`: «When the traffic volume to a website is too low to support accurate estimations, Similarweb will display the message “Not enough data” or “N/A”…».
- `[raw/Exa]` `https://support.similarweb.com/hc/en-us/articles/360002219177`: «If the last snapshot … is less than 5000 visits then we won't display any data.»; «In 2024, we released new functionality … that helped us bring more reliable data to sites with relatively little traffic».
- `[WebFetch]` `https://developers.similarweb.com/docs/why-does-the-api-return-exact-values-for-small-sites`: платформа не показывает значения при <5 000 оценочных визитов, **API возвращает значение независимо от порога** («In the API however, we do return a value so you can aggregate it»).
- **Живые данные (free web, 2026-10-04):** producthunt.com — Global Rank #16 323, ~3.3M визитов за 3 мес; devhunt.org — #357 598, ~121K за 3 мес; tinylaunch.com — #459 077, ~77.6K за 3 мес; **medicalhistory.app** (свежий домен из выборки) — «No Data Available» в Global/Country/Category Rank.

**API.** `https://developers.similarweb.com/`: Website Traffic, Rank, Keywords, Mobile Apps, Company, Technologies API; кредитная модель («data credits»); упомянут «API Lite … Returns the exact data set as found in our free tool». Цена/доступ — `https://www.similarweb.com/packages/web/` `[raw]`: «API is available as part of our customized packages for Businesses. You can also purchase the Similarweb API as a standalone product … contact the sales team». Публичной цены **нет**. Лимиты «10 req/s на аккаунт, Batch API до 20 pending» — только из `[поиск]` (pipeline.zoominfo.com, **источник не первичный**).

**Точность (малые сайты).**
- SparkToro, 2022-11-22 (**устарело (до 2025)**), `https://sparktoro.com/blog/which-3rd-party-traffic-estimate-best-matches-google-analytics/` `[WebFetch]`: выборка 641 сайт; у Similarweb на сайтах <5 000 визитов/мес по GA оценки «the worst of the bunch»; «no 3rd-party estimate today is consistently accurate enough to place high confidence»; корреляции 0.504–0.790, ошибки часто >±100%; Ahrefs меряет только органику.
- Omniconvert (вендор CRO; впервые 2017-11-22, обновлено 2026-06-05) `https://www.omniconvert.com/blog/we-analyzed-1787-ecommerce-websites-similarweb-google-analytics-thats-we-learned/` `[WebFetch]`: 1 787 e-commerce сайтов; Similarweb завышает сессии ≈ на 94 %; на сайтах <10 000 сессий/мес — наименее точен. Выборка e-commerce, не SaaS.
- Сам Similarweb ссылается на SparkToro как на «самый точный» — **источник заинтересован**.

### 1.2 Tranco (tranco-list.eu)

`[WebFetch]` + `[curl]`, 2026-10-04.
- Что это: исследовательский ранкинг; **5 провайдеров** (в конфиге последнего списка `providers: crux, farsight, majestic, radar, umbrella`), комбинация Dowdall, окно **30 дней** (последний список: 2026-09-04…2026-10-03), `filterPLD: on`, ежедневный список к 00:00 UTC. Скачивание: `https://tranco-list.eu/top-1m.csv.zip` (редирект 307 на `/download/daily/top-1m.csv.zip`), метаданные `https://tranco-list.eu/api/lists/date/latest`.
- API `https://tranco-list.eu/api_documentation`: `GET /ranks/domain/{domain}` (ранги за ~30+ дней), без авторизации; **лимит 1 запрос/сек** («429: Rate limit exceeded (1 query/second)»); аутентификация нужна только для `/lists/create`. Явных условий использования в доке API нет.
- **Лицензии источников** (`https://tranco-list.eu/`, raw): Umbrella — free of charge; Majestic — CC BY 3.0; Farsight — только для дефолтного списка; CrUX — CC BY-SA 4.0; **Cloudflare Radar — CC BY-NC 4.0**. Лицензия самого Tranco-вывода — **нет данных**. Вывод: из-за NC-компонента (Radar) коммерческое использование Tranco — потенциально спорное `[ОЦЕНКА]` (юр. консультация не проводилась).
- **Живые ранги (последний список 2026-10-03):** producthunt.com — **4 414**; lovable.dev — 3 070; uneed.best — 357 483; fazier.com — 209 596; devhunt.org — **1 002 833**; tinylaunch.com — **1 071 525**; nightloom.dev (свежий домен, зарегистрирован 2026-02-15) — **нет рангов** (`"ranks": []`).
- **Наблюдение:** API отдаёт ранги **за пределами 1 000 000** (devhunt.org 1 002 833; один домен из выборки — 4 441 684), т.е. полный ранжированный набор длиннее скачиваемого top-1M; ограничение «1M» относится к файлу.
- **Охват свежих доменов (калибровка §6): 0 из 45 в top-1M; 1 из 45 имеет хоть какой-то ранг (4.4M).** Структурное объяснение: попадание требует накопленного трафика/ссылок в 30-дневном окне.

### 1.3 Cloudflare Radar

- Документация `https://developers.cloudflare.com/radar/` `[WebFetch]`: «Radar's API is free…»; данные «made available under the CC BY-NC 4.0» (**некоммерческая** лицензия).
- Домен-ранги `https://developers.cloudflare.com/radar/investigate/domain-ranking-datasets/` `[WebFetch]`: упорядоченный **top 100** (обновляется ежедневно, окно 24 ч) + неупорядоченные **bucket-датасеты** 200 / 500 / 1 000 / 2 000 / 5 000 / 10 000 / 20 000 / 50 000 / 100 000 / 200 000 / 500 000 / 1 000 000 (обновляются еженедельно, окно 7 дней). Метод вычисления в доке не описан.
- Эндпоинт `GET /radar/ranking/domain/{domain}` (`https://developers.cloudflare.com/api/resources/radar/subresources/ranking/subresources/domain/methods/get`): поля `rank`, `categories`, `top_locations`; параметры `rankingType` (POPULAR/TRENDING_RISE/TRENDING_STEADY), `limit`, `date`. **Что возвращается для нераскрученного домена — в доке не описано (нет данных).** Максимальный bucket = 1M ⇒ ниже топ-1M рангов нет `[ОЦЕНКА по структуре датасета]`.
- Доступ: нужен API-токен (Custom Token, «Account > Radar > Read» — `https://developers.cloudflare.com/radar/get-started/first-request/`); в референсе метода указана иная формулировка прав («User Details Read/Write») — расхождение в доке. Общий лимит Cloudflare API «1,200 requests per five minute period per user» (`https://developers.cloudflare.com/fundamentals/api/reference/limits/`); отдельного лимита для Radar на проверенных страницах нет (нет данных).
- Веб-страницы radar.cloudflare.com для домена: 403 для Exa-fetch (не проверено).

### 1.4 Chrome UX Report (CrUX), Majestic Million, Open PageRank

**CrUX API** `https://developer.chrome.com/docs/crux/api` `[raw]`: бесплатно; нужен ключ Google Cloud; **«limited to 150 queries per minute per Google Cloud project … not possible to pay for an increased quota»**; данные — 28-дневное скользящее окно. Критерии включения origin (`https://developer.chrome.com/docs/crux/methodology` `[WebFetch]`): «publicly discoverable» (HTTP 200, без noindex) и «sufficiently popular» — «An exact number is not disclosed». Выборка ограничена пользователями Chrome с включённой статистикой/синхронизацией истории. Семантика ответа для origin вне датасета на странице API не описана (в моих знаниях — 404; **не проверено**). Живой вызов API не делался (нужен ключ).
**CrUX Top Lists** `https://github.com/zakird/crux-top-lists` `[WebFetch]` + `[curl]`: файл `current.csv.gz` (8.7 MB) = **1 000 000 origins** в бакетах рангов 1 000 / 5 000 / 10 000 / 50 000 / 100 000 / 500 000 / 1 000 000 (фактические размеры бакетов в файле: 1 000 / 4 000 / 5 000 / 40 000 / 50 000 / 400 000 / 500 000); README: полный датасет Chrome ≈ **15 млн** сайтов, топ-1M ≈ >95 % пользовательского трафика; обновление ежемесячно. Лицензия списка в README не указана (источник — публичный CrUX, CC BY-SA 4.0 по заявлению Tranco). Живые примеры: `https://www.producthunt.com` — бакет 100 000; `https://lovable.dev` — 10 000; `https://bolt.new` — 50 000; peerlist.io — 1 000 000; betalist.com — 500 000; **devhunt.org, tinylaunch.com, uneed.best, fazier.com — отсутствуют**. BigQuery: `chrome-ux-report` бесплатно в пределах 1 TB запросов/мес (`https://developer.chrome.com/docs/crux/bigquery/`).
**Вывод для разных метрик:** ранг producthunt.com различается на порядки — Tranco 4 414, Majestic #1 264, Similarweb #16 323, CrUX-бакет 100 000 ⇒ **ранги из разных списков несопоставимы**.

**Majestic Million** `https://majestic.com/reports/majestic-million` `[WebFetch]` + `[curl]`: CC BY 3.0 (атрибуция, коммерческое использование допустимо по лицензии), CSV ~81 MB (`https://downloads.majestic.com/majestic_million.csv`, **1 000 000 строк**, сгенерирован 2026-10-04), поля `GlobalRank, TldRank, Domain, RefSubNets, RefIPs…`. Ранжирует по ссылающимся подсетям (backlinks), **не по трафику**. Живые: producthunt.com #1 264 (RefSubNets 13 048); lovable.dev #1 363; fazier.com #83 406 (975); uneed.best #172 589 (689); devhunt.org #267 948 (531); tinylaunch.com #469 891 (386). Свежие домены из выборки — отсутствуют.

**Open PageRank** (`https://openpagerank.keywordseverywhere.com/`, `[WebFetch]` 2026-10-04): оценка 0–10 по графу Common Crawl; free API — «30,000 domains every month on the free plan»; до 100 доменов в вызове; платные планы — через Keywords Everywhere. (Сторонние выдачи называли «1 000 запросов/мес» — расходится, считаю устаревшим.) Ссылочный граф — для новых доменов без бэклинков значения нет `[ОЦЕНКА]`.

### 1.5 Ahrefs

- Цены `https://ahrefs.com/pricing` `[WebFetch]`, 2026-10-04: Lite **$129/мес**, Standard **$249**, Advanced **$449**, Enterprise **$1 499/мес** (годовой контракт), Starter $29/мес; «All main plans include API and MCP access»; Ahrefs Free — «data on your site» (только свои верифицированные сайты).
- API v3, `https://help.ahrefs.com/en/articles/6559232-about-api-v3` `[WebFetch]`: «possible for Lite and higher subscription plans»; «The minimum cost for any request is 50 units»; лимиты units/мес: Lite 200 000 / Standard 800 000 / Advanced 2 000 000 / Enterprise custom; часть эндпоинтов бесплатна (0 units). Страница «различия планов» (`https://help.ahrefs.com/en/articles/6117209…`): Lite 200 000 units (макс. 100 строк на запрос), Standard 800 000 (250), Advanced 2 000 000 (500), Enterprise 4 000 000+ (без лимита строк), но в тексте: «Standard and higher plans include Direct access to API v3» — **расхождение внутри официальной документации** (Lite vs Standard). Сторонний агрегатор называл Lite = 100 000 units — не подтверждено. Докупка units — только Enterprise (`[поиск]`).
- Бесплатно для чужого домена: `https://ahrefs.com/traffic-checker` `[WebFetch]` — оценка поискового трафика «for any website or webpage», без логина для базовых проверок (SparkToro: Ahrefs оценивает **только органику**).

### 1.6 Semrush

- `https://www.semrush.com/pricing/` `[WebFetch]` 2026-10-04: SEO $139/мес ($117.33 при годовой), Starter $199 ($165.17), Pro+ $299 ($248.17), Advanced $549 ($455.67); бесплатно — «10 reports per day across all vital tools»; «API data integration» упомянут в Advanced.
- Dev-док `https://developer.semrush.com/api/basics/introduction/` `[WebFetch]`: «This API is available on paid Semrush plans»; Standard API — «available as an add-on to a Business subscription»; units «are purchased separately»; цена units на проверенных страницах — **нет данных** (названия тарифов в доке и на странице цен расходятся — вероятно, устаревшая терминология).

### 1.7 Google Trends

- Официальный Trends API — **alpha по заявке** (анонс 2025-07-24: `https://developers.google.com/search/blog/2025/07/trends-api`; текст статьи через WebFetch не получен; детали — `[поиск]`: 5 лет данных, нет публичной цены/квот/GA-срока). `pytrends` — **архивирован в апреле 2025** (`[поиск]`, dev.to), неофициальный доступ ненадёжен.
- Для брендового запроса свежего продукта объёмы поиска пренебрежимо малы `[ОЦЕНКА]` — сигнал практически пуст; ToS-риск неофициального скрейпинга Trends — не оценивал.

---

## 2. ФАНДИНГ / КОМПАНИЯ

### 2.1 Crunchbase

- Официально (Knowledge Center, обновлено **2026-07-16**) `[raw/Exa]` `https://support.crunchbase.com/hc/en-us/articles/360062989313…`: «Crunchbase API: This paid offering is for organizations that want to extend … into their own systems … Learn more … by booking time with our sales team». Free — «for individuals who want to quickly learn about a company with rich firmographics at no cost».
- Pro: вводное предложение **$588 за 1-й год** (38 % скидка) `https://support.crunchbase.com/hc/en-us/articles/360052830214` `[Exa-выдержка]`; экспорт: Pro 2k строк/мес, Business 5k/мес, «API with unlimited exports» (`https://support.crunchbase.com/hc/en-us/articles/115010610787`). Без цены Business.
- API-доки `https://data.crunchbase.com/docs/using-the-api` `[WebFetch]`: «Both Enterprise and Applications licensees have access to the full Crunchbase API. Those with Crunchbase Basic plans are restricted to basic endpoints only.»; «rate limit of 200 calls per minute»; «You may not license, sublicense, sell … any of the Crunchbase data to any third parties»; обязательная ссылка-атрибуция «plainly visible». Пакеты API: Fundamentals, Insights, Predictions; интеграция — Data Enrichment / Data Licensing; цены — «contact sales» (`https://data.crunchbase.com/docs/welcome-to-crunchbase-data`).
- **Противоречие:** документация упоминает «Basic» с ограниченными эндпоинтами (Organization Search / Entity Lookup / Autocomplete — по `[поиск]`), но Knowledge Center называет API платным; сторонние источники пишут, что бесплатный API-уровень убран (2025) и Basic — платный. Бесплатного API-ключа «на пробу» я не подтвердил.
- Цены (Vendr, закупочная платформа, `https://www.vendr.com/marketplace/crunchbase` `[WebFetch]`, данные за 12 мес на февраль 2026): **медианный контракт $20 000/год**, диапазон $4 440–$51 377, 71 покупка. Сторонний: enterprise-доступ «$50 000+» (`[поиск]`, pipeline.zoominfo.com — конкурент Crunchbase, **источник заинтересован**).
- Охват: «4M+ private companies» (`https://about.crunchbase.com/pricing/` `[WebFetch]`) — это компании, интересные инвесторам; bootstrapped indie-запуски там редки `[ОЦЕНКА]` (нет цифр охвата).
- **ToS** (`https://about.crunchbase.com/terms-of-service/` `[WebFetch]`): запрещено «“Crawls,” “scrapes,” or “spiders” any page, data, or portion of or relating to the Service or Content»; «attempting to access, download, export, or otherwise use or exploit any Content using any automated means or tools»; «Uses or allows the Content to be used to train models (including generative artificial intelligence technologies)»; право — Калифорния, арбитраж в округе Сан-Франциско.

### 2.2 Tracxn, PitchBook (дорогие; всё — сторонние цифры)

- **Tracxn:** Capterra-листинг `https://www.capterra.com/p/204090/Tracxn/pricing/` `[WebFetch]`: «Starting Price $500.00 … Usage Based, Per Month», free trial/«Includes Free Version»; отзыв: «no monthly payment option». API «от $30 000/год (limited) и $60 000/год (unlimited)» — только `[поиск]`-снippet, **не подтверждено**; «5M+ companies» — там же. Прямой первичной страницы цен не получено.
- **PitchBook:** агрегатор costbench (`[поиск]`, **не первичный**): «$12K–$40K per user/year»; тарифы Core $12 000 / Pro $24 000 / Pro Plus $39 996 за пользователя/год; «Vendr median $31 750» (диапазон $20 000–$122 500). Прямая страница Vendr вернула 404 → цифры **не подтверждены**.

### 2.3 LinkedIn (размер команды)

- **ToS** (User Agreement, действует с **2025-11-03**, `https://www.linkedin.com/legal/user-agreement` `[WebFetch]`, §8.2): «Develop, support or use software, devices, scripts, robots or any other means or processes (such as crawlers, browser plugins and add-ons or any other technology) to scrape or copy the Services, including profiles and other data from the Services»; «Use bots or other unauthorized automated methods to access the Services…».
- **hiQ v. LinkedIn** (**устарело (до 2025)** по дате, но остаётся ключевым прецедентом) `https://newmedialaw.proskauer.com/2022/12/08/…` `[WebFetch]`: 9-й округ (апрель 2022) — скрейпинг публичных данных «raised at least serious questions» по CFAA; ноябрь 2022 — hiQ нарушил User Agreement; декабрь 2022 — consent judgment: **$500 000**, постоянный запрет, удаление ПО и данных. Вывод: CFAA-риск публичных данных снижен, но **договорный (ToS) риск реален**.
- **Официальный API** `https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-lookup-api` `[raw]` (ms.date 2026-04-28): доступ через 3-legged OAuth, право `rw_organization_admin`; поле `staffCountRange` помечено «Admin Only: True»; без прав администратора возвращаются лишь `id, name, localizedName, localizedWebsite, vanityName, logoV2, locations, primaryOrganizationType`; «API calls with insufficient permissions return 403 Forbidden». **Т.е. размер чужой команды через официальный API недоступен.**

### 2.4 OpenVC

`https://openvc.app/`, `/about` `[raw/Exa]`: база **инвесторов** («16,699 investors» на главной; «20,000+ verified investors» в FAQ), бесплатная для основателей; про финансирование **стартапов** данных нет ⇒ для нашей задачи **неприменима**. API — нет данных.

### 2.5 Бесплатные «фандинговые» источники узкого охвата

- **SEC EDGAR / Form D** `https://www.sec.gov/files/form-d-02182026.pdf` `[raw pdftotext]`: «Companies must file Form D within 15 days after the first sale of securities … After filing, the company's Form D will be publicly available on EDGAR.» Только США, только Reg D-раунды. API (`https://www.sec.gov/search-filings/edgar-application-programming-interfaces`): «These APIs do not require any authentication or API keys»; fair access (`…/accessing-edgar-data`): «Current max request rate: 10 requests/second», обязателен User-Agent с контактом. Привязка «название→CIK» для непубличных компаний — не проверялась (нет данных).
- **YC OSS API** `https://github.com/yc-oss/api` `[WebFetch]`: неофициальный JSON из Algolia-индекса YC, обновляется ежедневно (GitHub Actions); поля name, batch, team_size, status, website, one_liner…; только «publicly launched companies» YC; лицензия в README не указана.
- **Companies House (UK)** `https://developer-specs.company-information.service.gov.uk/guides/rateLimiting` `[WebFetch]`: «up to 600 requests within a five-minute period»; для ключа нужна регистрация; стоимость на проверенных страницах не указана. Юр-лицо как «реальность бизнеса» — только для UK Ltd.

---

## 3. ПРИЗНАКИ ПЛАТЕЖЕЙ / ВЫРУЧКИ

### 3.1 Публичный детект платёжных провайдеров (документированные следы)

**Stripe** (`[raw]` docs.stripe.com, 2026-10-04):
- `https://docs.stripe.com/js/including`: Stripe.js грузится с `https://js.stripe.com`; «To best leverage Stripe's advanced fraud functionality, include this script on every page, not just the checkout page» ⇒ наличие `js.stripe.com` само по себе = интеграция Stripe, **не** доказательство продаж.
- `https://docs.stripe.com/keys`: publishable key `pk_…` — «Safe to expose: Yes … You can include it in front-end code»; «Sandbox keys start with `pk_test_` … live mode keys … start with `pk_live_`».
- Встроенные компоненты: `<script src="https://js.stripe.com/v3/buy-button.js">` + `<stripe-buy-button buy-button-id publishable-key>`; `<script src="https://js.stripe.com/v3/pricing-table.js">` + `<stripe-pricing-table pricing-table-id publishable-key>` («supports subscription business models such as flat-rate, per-seat, tiered pricing, and trials»); Payment Links — «Stripe-hosted page» (`docs.stripe.com/payment-links`).
- Активация: «To use a service in live mode, verify your business and complete its activation requirements» (`https://docs.stripe.com/get-started/account/activate`) ⇒ `pk_live_` в проде — признак подключённого верифицированного мерчанта `[ОЦЕНКА — вывод из документации, не прямое утверждение Stripe о ключах]`.
- **Ловушка (подтверждена живьём):** префикс `pk_live_` **не уникален для Stripe** — Clerk использует его для production-ключей (`https://clerk.com/docs/guides/development/clerk-environment-variables`: «prefixed with `pk_test_` in development instances and `pk_live_` in production instances»). В калибровочной выборке оба «pk_live_»-совпадения оказались **не Stripe** (Clerk и стороннего виджета). Детект `pk_live_` обязан требовать контекст «stripe».

**Paddle** (`[raw/WebFetch]`): скрипт `https://cdn.paddle.com/paddle/v2/paddle.js`, `Paddle.Initialize({token})`; токены: sandbox `test_…`, production `live_…` (`https://developer.paddle.com/paddlejs/include-paddlejs`). **Мерчант проходит ревью домена:** «Be aware that you will only be allowed to sell through the domain(s) that have been approved» (`https://www.paddle.com/help/start/account-verification/what-is-domain-approval`); для апрува на сайте должны быть описание, цены («Pricing details (screenshot acceptable if unavailable)»), ToS/Refund/Privacy, юр. название в ToS, живой HTTPS-сайт (`…/why-has-my-domain-been-rejected`); по `[поиск]` «Login walls and missing public pricing are the most common reasons that domain approval fails». ⇒ **живой Paddle-чекаут = домен прошёл ревью Paddle; публичные цены на сайте при этом — типичное, но не абсолютное условие**.

**Lemon Squeezy** (`[WebFetch]`): `<script src="https://app.lemonsqueezy.com/js/lemon.js" defer>` («Please don't self-host Lemon.js»); кнопки `class="lemonsqueezy-button"`, чекаут `https://<store>.lemonsqueezy.com/checkout/...`. Test→live: «When you first sign up … your store will be in test mode. Before selling any products, you will need to enable live mode» — анкета + проверка личности, 2–3 раб. дня (`https://docs.lemonsqueezy.com/help/getting-started/activate-your-store`); по `[поиск]` реальные сроки 1–4 нед. ⇒ live-магазин = верифицированный мерчант. **Статус платформы:** Stripe купил Lemon Squeezy (2024); Stripe Managed Payments — public preview с 2026-02, LS «continues operating» (`[поиск]`, источники — конкуренты-платёжки dodopayments/fungies.io: **источник заинтересован**).

**Polar** (`https://polar.sh/docs/features/checkout/embed` `[WebFetch]`): `<script defer data-auto-init src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@latest/dist/embed.global.js">`, триггер `data-polar-checkout`. Sandbox/production в доке не различены (нет данных).

**Тулзы детекта стека:**
- **Wappalyzer** `https://www.wappalyzer.com/pricing/` `[WebFetch]`: Pro **$250/мес**, Business **$450**, Enterprise **$850+** (годовая оплата −17 %); API-кредиты 5 000 / 20 000 / 200 000+ в мес; free-аккаунт — **50 lookups/мес**; кредиты плана «expire after 60 days».
- **BuiltWith** `https://builtwith.com/plans` `[WebFetch]`: Basic **$295/мес**, Pro **$495**, Team **$995**; «free to use for individual site lookups forever»; лимиты API на странице не указаны (сторонне: до 16 доменов за вызов, 10 req/s — `[поиск]`, не первичный).
- **Open-source:** `projectdiscovery/wappalyzergo` (MIT; «analyzes only HTTP headers and response body»; опционально runtime через headless-браузер), `enthec/webappanalyzer` (GPL-3.0; «continuation of the iconic Wappalyzer that went private in August 2023»; содержит ли Stripe/Paddle/LS-определения — не проверял).

### 3.2 TrustMRR — проверенная выручка (самый прямой публичный сигнал денег)

`[raw]` `https://trustmrr.com/docs/api`, `/faq`, `/llms.txt`, `/terms` (2026-10-04).
- Что это: база стартапов с выручкой, **верифицированной прямым подключением к платёжному провайдеру** (Stripe, Lemon Squeezy, Polar, Paddle, RevenueCat, Superwall, Dodo, Creem, Whop, Shopify, App Store). Добавить стартап можно **только** подключив провайдера (самоотбор). Размер: «over 15,000 startups listed» (llms.txt — **источник заинтересован**; сторонняя выдача 2026 называла «~7 000+» — старее).
- API: `https://trustmrr.com/api/v1`, Bearer-ключ `tmrr_…` из developer dashboard; **Standard — 10 запросов/мин, Premium — 60/мин**; эндпоинты `GET /startups` (фильтры: category, xHandle, teamSize, fundingStatus (`bootstrapped`/`vc-funded`), min/maxRevenue, min/maxMrr, growth, price; **max 10 на страницу; фильтра по домену нет**) и `GET /startups/{slug}`; поля: `website`, `country`, `foundedDate`, `category`, `paymentProvider`, `targetAudience`, `revenue.last30Days/mrr/total` (в центах USD), `customers`, `activeSubscriptions`, `growth30d`, `visitorsLast30Days` (из DataFast/GA/GSC — верифицированный трафик), `xHandle`… Цена API на проверенных страницах не указана («нет данных о плате»); листинг стартапа бесплатный.
- Публично без ключа: `https://trustmrr.com/startup/{slug}.md`, `https://trustmrr.com/api/ai/discovery` (25 недавних + 25 самых быстрорастущих), публичная лента/лидерборд.
- **AUP (`https://trustmrr.com/terms`, §9)** — цитаты: «The API may only be used for lawful, legitimate, respectful, and good-faith purposes … Examples may include private acquisition research, internal analysis, and internal tools that help an authorized user evaluate startups.»; «An API key does not grant a license to publish, index, sublicense, sell, redistribute…»; запрещено «Ridicule, shame, demean, harass, threaten, defame, impersonate, exploit, or target a startup, founder, customer, buyer, seller, or other person»; «Facilitate spam, phishing, fraud…»; «Scrape, harvest, archive, or systematically reconstruct TrustMRR's database; exceed documented limits…»; «Use API data to train, fine-tune, ground, evaluate, or populate an AI model…» без письменного разрешения; нарушение → пермабан платформы. **Использование данных для таргетированных писем основателям — серая зона `[ОЦЕНКА]`**; безопаснее запросить письменное разрешение.

### 3.3 Мобильные/расширения (трекшн-прокси)

- **Apple iTunes Search/Lookup API:** официальный, бесплатный, «limited to approximately 20 calls per minute (subject to change)» (`https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html` `[WebFetch]`). **Живая проверка `[curl]` 2026-10-04** (`https://itunes.apple.com/search?term=notion&entity=software&limit=1`): возвращаются `userRatingCount` (90 306), `averageUserRating` (4.78), `releaseDate`, `currentVersionReleaseDate`, `sellerName`, `sellerUrl`, `price`, `bundleId`, `primaryGenreName`, `version`. Условия Apple (`performance-partners.apple.com/search-api`) сформулированы вокруг промо-контента; оговорок про использование рейтингов не нашёл (нет данных). Годится только если у продукта есть iOS-приложение. `apps.apple.com/robots.txt` запрещает `/api/*`, `/WebObjects/*`, `/v1/*`, `*/search?*`.
- **Google Play:** официального публичного API для чужих листингов не нашёл (`[поиск]`); `play.google.com/robots.txt` в первых 40 строках не содержит запрета на карточки приложений (полную проверку не делал); общий ToS Google (`https://policies.google.com/terms` `[WebFetch]`): запрещено «using automated means to access content from any of our services in violation of the machine-readable instructions on our web pages (for example, robots.txt files…)»; в Play ToS явного запрета скрейпинга в просмотренном фрагменте нет (нет данных). Серая зона.
- **Chrome Web Store:** публичная страница показывает метрики — живая проверка `[WebFetch]` (uBlock Origin Lite): «21,000,000 users», рейтинг 4.5, «3.6K ratings», версия, «Last updated». Официального API чтения чужих метрик не нашёл (`[поиск]`); `chromewebstore.google.com/robots.txt` запрещает `/detail/*/reviews`, `/support`, `/privacy`, `/related`, `/search`, но не саму карточку `/detail/…`.

### 3.4 Отзывы / социальное доказательство

- **G2:** developer portal `https://documentation.g2.com/docs/developer-portal.md` `[WebFetch]` — создаётся аккаунт и токен (истекает через год), данные: products, reviews и т.д.; условия доступа/лимиты в просмотренном тексте не указаны (нет данных). Buyer Intent у вендоров — «$10 000–$87 000+» (`[поиск]`, не первичный). Для свежих индие-запусков отзывов практически нет `[ОЦЕНКА]`.
- **Capterra:** публичного API/ToS-страницы получить не удалось (404 на guessed URL) — нет данных.
- **Trustpilot:** Business Units API (публичный) — `GET /v1/business-units/find?name=<домен>` с `apikey`, поля `numberOfReviews`, `trustScore`, `stars` (`https://developers.trustpilot.com/business-units-api-(public)` `[WebFetch]`); лимиты не опубликованы (сторонне: ~1 req/s — `[поиск]`). **ToS** (`https://corporate.trustpilot.com/legal/for-reviewers/terms-of-use-for-consumers`, §4): «You must not access, search or collect content from our platform by any means (automated or otherwise) except as provided on our platform or specifically approved by us.» и «…text mining, data mining or web scraping of our platform for any purpose without our express permission.» Свежему продукту Trustpilot-страница нужна редко `[ОЦЕНКА]`.
- **Product Hunt:** `https://api.producthunt.com/v2/docs` `[WebFetch]`: «The Product Hunt API must not be used for commercial purposes. If you would like to use it for your business, please contact us at hello@producthunt.com.» (подробности — ось 1). Голоса/комментарии на PH — прокси «вовлечённости в день запуска», а не денег `[ОЦЕНКА]`.

### 3.5 Сигналы «реальный продукт, не лендинг»
Нет внешних источников/API — это наблюдение собственного сайта; частоты в калибровке (§6): pricing-ссылка 12/44, login/signup 16/44, Terms/Privacy 26/44. Paddle прямо требует эти элементы для апрува домена (§3.1), т.е. набор «pricing + legal pages» — часть официальных критериев мерчант-ревью.

---

## 4. ПРИЗНАКИ ЖИВОСТИ

- **Доступность:** в выборке (n=45) 44 сайта ответили HTTP 200, 1 — 410 Gone `[curl-калибровка]`.
- **Возраст/срок регистрации — RDAP (бесплатно):** `https://rdap.org/domain/<домен>` `[curl]` — события `registration`, `expiration`, `last changed`. Живо: lovable.dev — зарегистрирован 2023-09-19; tinylaunch.com — 2019-08-04; свежий домен nightloom.dev — 2026-02-15. **Покрытие:** `.io`, `.sh`, `.md` вернули 404 (нет RDAP-сервера в bootstrap): 5 из 45 доменов выборки; единичные 429 от rdap.org. Для них нужен WHOIS (не проверялся). В выборке: медиана возраста **54.5 дня** (n=40), ≤30 дней — 17/40, ≤90 — 22/40, ≤365 — 32/40, >2 лет — 5/40; срок регистрации 1 год — 30/40 (75 %).
- **CT-логи:** CertSpotter (SSLMate) без ключа `[curl]`: заголовок `x-ratelimit-limit: 100`; отдаёт выпуски с `not_before` (первый сертификат ≈ «первый раз замечен»). crt.sh в момент проверки отдал **502** (ненадёжен). Wayback `https://archive.org/wayback/available?url=…` — 429 с первой попытки, при повторе (http) ответил; `web.archive.org/cdx` — connection reset: **нестабилен из песочницы**.
- **DNS (калибровка):** MX есть у 29/45, SPF у 27/45; по типу MX: Google Workspace — 7, Zoho — 2, Microsoft 365 — 0, «форвардинг/регистратор» — 12, прочие — 7, только транзакционный (mailgun/sendgrid/ses-тип) — 1; домен без MX — 16/45.
- **Соцсети/активность:** GitHub REST — «60 requests per hour» без авторизации, «5,000 requests per hour» с токеном (`https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api` `[WebFetch]`); Bluesky public AppView API доступен **без авторизации** (живо `[curl]`: `public.api.bsky.app/xrpc/app.bsky.actor.getProfile`); **X API:** нет бесплатного тарифа, pay-per-use: «Posts: Read $0.005 per resource», «User: Read $0.010 per resource», кап «3 million Post reads per monthly billing cycle» (`https://docs.x.com/x-api/getting-started/pricing` `[WebFetch]`); X ToS: «crawling or scraping the Services in any form, for any purpose without our prior written consent is expressly prohibited» (`https://x.com/en/tos`). Соцсети — слабый и дорогой по ToS сигнал `[ОЦЕНКА]`.

---

## 5. Что реально даёт оценку «есть ли пользователи» — сводка по свежим/мелким доменам

| Источник | Порог/механика | Для свежего инди-запуска |
|---|---|---|
| Tranco top-1M | попадание в 30-дневный агрегат провайдеров | **0/45** в выборке; пусто |
| CrUX Top-1M (список) | ≥ неразглашаемого числа Chrome-визитов, бакеты ≥1 000 | **0/45** |
| CrUX API (origin) | тот же порог, 15M origins в датасете | живой вызов не делался (нужен ключ); порог не раскрыт |
| Majestic Million | ссылочный граф (RefSubNets) | **0/45** |
| Cloudflare Radar | top-1M buckets, CC BY-NC | не проверено (нужен токен); структурно ≥ топ-1M |
| Similarweb free | ≥5 000 визитов/мес в последнем снимке | «No Data Available» на свежем домене (medicalhistory.app); 3 поиска/день без логина |
| Ahrefs/Semrush free | оценка органики/трафика | не проверял на выборке; точность на малых сайтах плохая (SparkToro 2022, **устарело (до 2025)**) |
| Verified traffic в TrustMRR | подключённый GA/DataFast/GSC | есть только у добровольно подключённых |

---

## 6. Калибровочная выборка (живые данные, 2026-10-04)

**Цель:** понять, какие дешёвые сигналы вообще «срабатывают» на свежих запусках. **Не** доказывает точность; **не** PH.

**Источник выборки:** Hacker News Algolia API `https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=1000&numericFilters=created_at_i>…` — за последние 14 дней `nbHits=1 795`; взяты 1 000 самых новых (окно ≈ 2026-09-27…2026-10-04). После исключения code-hosting/соцсетей/сторов: **534 уникальных домена**; из них **423 (79 %) — собственный apex-домен**, 8 (1.5 %) — поддомены хостинг/билдер-платформ, 103 — прочие поддомены. Из 423 apex-доменов случайно (seed 20261004) взято **45** (медиана HN-очков 2; ≤2 очков — у 31/45).
Сайты: weiboard.fun, tryrevline.com, outie.link, medicalhistory.app, valutka.app, seven.systems, gatling.chat, paidwen.com, andurel.com, novrl.com, chiph.art, teacherplanner.ai, ledge.sh, socalfoundry.com, gargi.io, domainpuff.com, grist.lol, rhun.app, algomaya.com, past.dev, readmini.com, tegaki.ink, andrewcyuan.com, sharedclipboard.com, gemma.nyc, getisland.app, veludocs.com, thezoomist.com, starskirmish.com, radianui.com, dbsoundmeter.com, largeprintmaker.com, raywu.org, hoaspy.com, rgboo.com, tokentape.io, ariasurf.com, reportr.com, caspian.md, yume.video, readwithgloss.com, arm64js.com, blindflag.com, replaceme.app, secondstrike.io.

**Как проверялись (пассивно):** `robots.txt` (запретов `Disallow: /` для `*` — 0), главная страница, ≤6 same-origin скриптов, pricing-страница (если есть ссылка) и её скрипты; `Tranco API` (1 qps), локальные файлы Majestic/CrUX, `rdap.org`, DoH (Cloudflare) для MX/TXT. Headless-проход **не выполнен** (см. §0).

| Признак | Результат (n=45; достижимо 44) |
|---|---|
| Сайт доступен | 44 × HTTP 200, 1 × 410 |
| Tranco top-1M / любой ранг | **0** / 1 (ранг 4 441 684) |
| Majestic Million / CrUX top-1M | **0 / 0** |
| RDAP ответил | 40/45 (.io/.sh/.md — нет); медиана возраста 54.5 дня |
| Ссылка «Pricing» на главной | **12/44 (27 %)**; на всех 12 pricing-страницах есть цены ($/€/£) |
| Ссылка login/signup/get-started | 16/44 (36 %) |
| Ссылка Terms/Privacy | 26/44 (59 %); среди 12 «pricing»-сайтов — 12/12 |
| «pricing + login + terms» одновременно | 9/44 (20 %) |
| MX-запись у домена | 29/45 (64 %); среди «pricing»-сайтов 7/12; рабочий-почтовый тип (Google/M365/Zoho) — 2/12 |
| **Платёжный маркёр провайдера (статика)** | **1/44** (Lemon Squeezy); PayPal — 1; **Stripe — 0** (ни `js.stripe.com`, ни pricing-table/buy-button, ни `pk_live_` с контекстом Stripe) |
| «pk_live_» без контекста | 2 совпадения — оба **не Stripe** (Clerk; стороннего виджета) — ложные срабатывания |
| «Пустая» SPA-оболочка (id=root/__next при <400 знаков текста) | 3; сайтов с ≤3 ссылками на главной — 10 (23 %) |

**Что это значит (фактура, не выводы по системе):**
1. «Pricing с ценами» встречается в ≈12 раз чаще, чем детектируемый платёжный маркёр (12 vs 1) — на статике Stripe-следов нет даже там, где цены показаны (чекаут/Stripe.js чаще загружаются после логина/на отдельной странице или динамически).
2. Топ-листы (Tranco/CrUX/Majestic) на свежих запусках **пусты** — полезны только как позитивное подтверждение уже заметных продуктов.
3. Домены в выборке — в основном свежие (медиана ≈ 8 недель) → возраст домена в «свежей» воронке не различает серьёзность.
4. Охват, измеренный на dev-ориентированном Show HN, **не переносится** на PH/no-code-популяцию без проверки.

---

## 7. Оценка надёжности сигналов `[ОЦЕНКА]`

Основание: (а) документированные пороги (Similarweb 5 000 визитов; CrUX «not disclosed»; Tranco/Majestic ≈1M), (б) наблюдаемые частоты §6, (в) требования провайдеров (Paddle/LS/Stripe — KYC/ревью домена). **Ground-truth по выручке отсутствует**, поэтому «точность» ниже — логическая, не статистическая.

| Сигнал | Различает «реальный бизнес» vs «хобби» | Комментарий |
|---|---|---|
| Проверенная выручка (TrustMRR) | **очень высокая, но редкая** | прямое подтверждение провайдером; охват — только добровольцы; домен-поиска нет |
| Живой Paddle/LS/Stripe-чекаут (публично виден) | высокая (precision), **низкая охватом** | требуется KYC/ревью; но на статике виден у ~2 % выборки |
| Pricing-страница с ценами + signup + Terms/Privacy | **средняя** | намерение монетизации + юридическая «обвязка»; не гарантирует клиентов; ≈20 % выборки |
| Размер/рейтинги в сторах (iTunes/CWS) | высокая для приложений/расширений | применимо к малой доле web-SaaS |
| Tranco/CrUX/Majestic | высокая как «+», нулевая как фильтр | 0/45 на свежих |
| Similarweb/Ahrefs/Semrush (трафик) | низкая на малых сайтах | порог 5 000; ошибки >±100 % (SparkToro 2022 — **устарело (до 2025)**); Omniconvert +94 % |
| Фандинг-БД (Crunchbase/Tracxn/PitchBook) | низкая охватом | indie/bootstrapped почти не покрыты `[ОЦЕНКА]` (нет цифр охвата) |
| LinkedIn размер команды | средняя, но **юр. риск при автоматизации** | ToS запрещает scrape; API размера недоступен |
| Возраст домена/срок регистрации/MX | слабая | в «свежей» воронке почти все домены новые |
| Соцсети | слабая и дорогая | X платный и ToS запрещает скрейпинг |
| Reviews G2/Capterra/Trustpilot/PH-голоса | низкая на свежих | отзывов нет; PH-голоса = активность дня запуска |

**Самые дешёвые и информативные (0 ₽, пассивно):** pricing-страница с ценами; наличие login/signup; Terms/Privacy с юр. названием; платёжный маркёр (если виден); TrustMRR (если найден); store-метрики (если есть приложение/расширение); Tranco/CrUX-присутствие как бонус.
**Дорогие и малоинформативные для нашей популяции:** Similarweb/Ahrefs/Semrush API, Crunchbase/PitchBook/Tracxn, X API.

---

## 8. Неподтверждённое / противоречия / «нет данных»
- Цены Similarweb, Tracxn (в т.ч. API), PitchBook, G2 Buyer Intent — только сторонние/агрегаторы (**не подтверждены первичными страницами**).
- Ahrefs: Lite vs Standard для API v3 и размер units — официальные страницы расходятся.
- Crunchbase: существует ли реально бесплатный/Basic API-ключ — неясно (доки vs Knowledge Center vs сторонние).
- Cloudflare Radar: поведение для нераскрученных доменов; требуемые права токена — расхождение.
- CrUX API для origin вне датасета — не проверялось (нужен ключ).
- TrustMRR: цена Premium-ключа и возможность «разовой» проверки по домену без перебора — нет данных; охват относительно запусков — нет данных.
- Capterra (API/ToS), Google Play ToS (явный запрет), Polar sandbox-маркёры, Companies House «бесплатность ключа» — нет данных.
- Headless-детект платёжных маркёров (динамически подгружаемые Stripe.js/Paddle/LS) — **не выполнен**; частоты платёжных маркёров в §6 — нижняя граница.
- Юридическая оценка CC BY-NC (Radar/Tranco) для B2B-использования — не проводилась.

---

## 9. Источники (основные URL; все открыты 2026-10-04, если не указано)
Similarweb: https://www.similarweb.com/packages/web/ · https://www.similarweb.com/corp/pricing/ · https://developers.similarweb.com/ · https://developers.similarweb.com/docs/why-does-the-api-return-exact-values-for-small-sites · https://support.similarweb.com/hc/en-us/articles/207698639 · https://support.similarweb.com/hc/en-us/articles/360002219177 · https://www.similarweb.com/blog/marketing/marketing-strategy/similarweb-free/ (2024-06, устарело (до 2025)) · SparkToro https://sparktoro.com/blog/which-3rd-party-traffic-estimate-best-matches-google-analytics/ (2022-11, устарело (до 2025)) · Omniconvert https://www.omniconvert.com/blog/we-analyzed-1787-ecommerce-websites-similarweb-google-analytics-thats-we-learned/
Рейтинги: https://tranco-list.eu/ · https://tranco-list.eu/api_documentation · https://developers.cloudflare.com/radar/ · https://developers.cloudflare.com/radar/investigate/domain-ranking-datasets/ · https://developers.cloudflare.com/api/resources/radar/subresources/ranking/subresources/domain/methods/get · https://developers.cloudflare.com/fundamentals/api/reference/limits/ · https://developer.chrome.com/docs/crux/api · https://developer.chrome.com/docs/crux/methodology · https://developer.chrome.com/docs/crux/bigquery/ · https://github.com/zakird/crux-top-lists · https://majestic.com/reports/majestic-million · https://openpagerank.keywordseverywhere.com/
SEO-вендоры: https://ahrefs.com/pricing · https://help.ahrefs.com/en/articles/6559232-about-api-v3 · https://help.ahrefs.com/en/articles/6117209-what-s-the-difference-between-all-ahrefs-subscription-plans · https://ahrefs.com/traffic-checker · https://www.semrush.com/pricing/ · https://developer.semrush.com/api/basics/introduction/
Фандинг: https://support.crunchbase.com/hc/en-us/articles/360062989313 · https://data.crunchbase.com/docs/using-the-api · https://about.crunchbase.com/terms-of-service/ · https://www.vendr.com/marketplace/crunchbase · https://www.capterra.com/p/204090/Tracxn/pricing/ · https://openvc.app/ · https://www.sec.gov/files/form-d-02182026.pdf · https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data · https://github.com/yc-oss/api · https://www.linkedin.com/legal/user-agreement · https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-lookup-api · https://newmedialaw.proskauer.com/2022/12/08/hiq-and-linkedin-reach-proposed-settlement-in-landmark-scraping-case/
Платежи/стек: https://docs.stripe.com/js/including · https://docs.stripe.com/keys · https://docs.stripe.com/payment-links/buy-button · https://docs.stripe.com/payments/checkout/pricing-table · https://docs.stripe.com/get-started/account/activate · https://developer.paddle.com/paddlejs/include-paddlejs · https://www.paddle.com/help/start/account-verification/what-is-domain-approval · https://www.paddle.com/help/start/account-verification/why-has-my-domain-been-rejected · https://docs.lemonsqueezy.com/help/lemonjs · https://docs.lemonsqueezy.com/help/getting-started/activate-your-store · https://polar.sh/docs/features/checkout/embed · https://clerk.com/docs/guides/development/clerk-environment-variables · https://www.wappalyzer.com/pricing/ · https://builtwith.com/plans · https://github.com/projectdiscovery/wappalyzergo · https://github.com/enthec/webappanalyzer
Выручка/сторы/отзывы: https://trustmrr.com/docs/api · https://trustmrr.com/terms · https://trustmrr.com/faq · https://trustmrr.com/llms.txt · https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html · https://itunes.apple.com/search?term=notion&entity=software&limit=1 · https://play.google.com/robots.txt · https://chromewebstore.google.com/robots.txt · https://policies.google.com/terms · https://developers.trustpilot.com/business-units-api-(public) · https://corporate.trustpilot.com/legal/for-reviewers/terms-of-use-for-consumers · https://documentation.g2.com/docs/developer-portal.md · https://api.producthunt.com/v2/docs
Живость: https://rdap.org/ · https://api.certspotter.com/v1/issuances · https://archive.org/wayback/available · https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api · https://docs.x.com/x-api/getting-started/pricing · https://x.com/en/tos · https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile
