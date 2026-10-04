# Ось 3 — Детект слабого бэкенда по публичным признакам (RAW-дамп)

> Дата прогона: **2026-10-04** (UTC). Статус оси: **done**. Все проверки «вживую» датированы этой датой.
> Файл — полный дамп: сигнатуры с источниками, доки/цены инструментов, цитаты лицензий/ToS, живые проверки.
> Дистиллят (таблицы, граница, вердикты) — `research2/findings/3-backend-signals.md`.

## Легенда пометок

| Пометка | Значение |
|---|---|
| [ВЖИВУЮ 2026-10-04] | проверено сегодня по первичному источнику (официальная дока, исходник, реальный HTTP-ответ, публичный индекс кода) |
| [ВТОРИЧНЫЙ] | пересказ третьей стороны или поисковая выдача; первичка не открыта |
| [НЕ ПОДТВЕРЖДЕНО] | искал, подтверждения нет (или опровергнуто) |
| [источник заинтересован] | цифра продавца / сервиса, который продаёт услугу или конкурирующий продукт |
| [устарело (до 2025)] | дата источника раньше 2025 года |
| [ОЦЕНКА] | мой вывод с обоснованием; на выборке не измерялось |
| нет данных | искал, данных нет |

## 0. Как собиралось и чего НЕ делалось (честно)

**Методы:** WebFetch/WebSearch, Exa (web_fetch / web_search), `curl` к публичным raw-файлам GitHub (определения сигнатур, LICENSE, README, исходники сканеров), публичный поиск кода GitHub (MCP `search_code`), public CVE JSON API (`cveawg.mitre.org`), два десятка одиночных запросов к страницам **самих вендоров** (см. раздел 2.Х «Живые проверки»).

**Чего не делалось:** ни одного запроса к сайтам потенциальных лидов; ни одного обращения к API Supabase/Firebase/Bubble и т.п.; никаких сканов (SSL Labs / Observatory / securityheaders) чужих доменов; обход бот-защиты не пытался.

**Ограничения среды (влияют на полноту):**
- GitHub REST API через прокси сессии закрыт («GitHub access to this repository is not enabled for this session») → лицензии брались из raw-файлов `LICENSE`/`README`, свежесть коммитов — из кэша страниц Exa (дата кэша неизвестна; актуальность на 2026-10-04 **не подтверждена**).
- `securityheaders.com`, `probely.com` отдали HTTP 403 на WebFetch (бот-защита) → содержимое получено через Exa-кэш. `lovable.dev` отдал HTTP 403 (Cloudflare challenge) на одиночный GET с нейтральным UA — **обход не предпринимался**. `justice.gov` — блок Akamai; `nvd.nist.gov` — пустая страница (JS).
- Счётчики `total_count` в поиске кода GitHub — приблизительные (оценка самого GitHub), использовать как порядок величины.
- Определения Wappalyzer-форков — это «что ловит детектор», а не доказательство, что маркер присутствует на живых сайтах. Живая проверка одиночным GET сделана только на сайтах вендоров (webflow.com, framer.com, bubble.io, softr.io, app.flutterflow.io).
- Разделы 3–5 (цены, ToS, security-чекеры, оценка доли) написаны после повторной проверки первичных страниц **2026-10-04** (вторая половина дня, UTC); где вместо полного текста есть только выжимка WebFetch — это помечено. Данные о долях билдеров среди запусков — единственный найденный независимый от меня замер (StackScope, источник заинтересован), см. раздел 5.

---

## 1. ЭТИКО-ПРАВОВАЯ РАМКА (граница пассивного и активного)

### 1.1 Рабочее определение

**Пассивная классификация** = только то, что обычный посетитель/браузер получает при открытии главной страницы сайта, плюс публичные записи DNS, плюс сертификат из того же TLS-соединения, плюс публичные базы третьих лиц (без обращения к цели).
Принцип «браузерной эквивалентности»: один `GET /` (с редиректами), подресурсы, на которые ссылается сам HTML (JS/CSS/иконки/manifest), `favicon`; чтение (не использование) значений, лежащих в этих публичных файлах.

**Активное зондирование** = всё, что делает запрос, которого обычный посетитель не делает: перебор путей, вызов найденных API-эндпоинтов (даже с публичным ключом), OPTIONS/CORS-пробы с чужим Origin, переборы TLS-handshake, регистрация аккаунтов/отправка форм, подбор параметров, порт-сканы, обход бот-защиты/логин-стен.

Подробная таблица «допустимо / недопустимо» — в findings, раздел «ГРАНИЦА».

### 1.2 Правовые опоры (цитаты)

**(а) США: CFAA, политика Минюста от 19 мая 2022** [ВТОРИЧНЫЙ: юр. фирма цитирует политику; первичный justice.gov закрыт Akamai]
Источник: https://www.mofo.com/resources/insights/220525-cyber-crime-charging-policy (25.05.2022).
Цитата политики: «“good-faith security research” means accessing a computer solely for purposes of good-faith testing, investigation, and/or correction of a security flaw or vulnerability, where such activity is carried out in a manner designed to avoid any harm to individuals or the public, and where the information derived from the activity is used primarily to promote the security or safety [of similar devices, services, and their users]».
Там же: политика опирается на Van Buren v. United States (2021); «the same “research” for other purposes ... would not be considered “good-faith”».
Дополнительно (поисковая выдача по Mondaq/Jenner & Block, [ВТОРИЧНЫЙ]): политика не влияет на гражданскую ответственность по CFAA и на законы штатов.
**Вывод [ОЦЕНКА / не юр. консультация]:** лид-квалификация для продаж не является «good-faith security research» (цель — коммерческая, а не безопасность целевого класса систем) → safe harbor на наш канал рассчитывать нельзя.

**(б) Украина: ст. 361 КК «Несанкціоноване втручання в роботу інформаційних (автоматизованих), електронних комунікаційних, інформаційно-комунікаційних систем...»**
Источник (текст ст. 361): https://protocol.ua/ua/kriminalniy_kodeks_ukraini_stattya_361/ — редакция Закона № 2149-IX от 24.03.2022, изменения Закона № 3342-IX от 23.08.2023.
- ч.1: штраф от 1000 до 3000 неоподатковуваних мінімумів доходів громадян, або пробаційний нагляд до 3 років, або обмеження волі на той самий строк.
- ч.3 (если привело к витоку, втраті, підробці, блокуванню інформації...): позбавлення волі 3–8 років.
- **ч.6:** «Дії, передбачені частинами першою — четвертою цієї статті, не вважаються несанкціонованим втручанням ..., якщо вони були вчинені відповідно до порядку пошуку та виявлення потенційних вразливостей таких систем чи мереж».
Порядок: Постанова КМУ № 497 від 16.05.2023 (PDF текста открыт и прочитан): https://cybersecurity.khpi.edu.ua/wp-content/uploads/2023/09/Постанова-Кабінету-Міністрів-України-від-16.05.2023-р.-№-497.pdf ; новость КМУ: https://www.kmu.gov.ua/news/uriad-ukhvalyv-rozroblenyi-fakhivtsiamy-derzhspetszviazku-poriadok-provedennia-bug-bounty
Ключевые пункты Порядка (дословно по PDF):
- п.3: «Організація пошуку потенційної вразливості системи здійснюється її власником.»
- п.4: «Пошук потенційної вразливості системи здійснюється на підставі публічної пропозиції. Публічна пропозиція оприлюднюється власником системи на власному офіційному веб-сайті.»
- п.6: в публічній пропозиції визначаються, зокрема, «дії дослідника щодо системи, які йому заборонено проводити».
**Вывод [ОЦЕНКА / не юр. консультация]:** исключение ч.6 ст. 361 привязано к поиску уязвимостей **по публичной оферте владельца** (bug bounty/VDP). Для стартапа, который такой оферты не публиковал, активное зондирование исключением не покрыто. Другие юрисдикции (UK Computer Misuse Act, директива ЕС 2013/40/EU и др.) — **нет данных** (не проверялись).

**(в) Условия сервисов (цитаты — в разделах 3 и 4):** SSL Labs ToS v2.2 (только сайты, владельцы которых разрешили; коммерческое использование запрещено), BuiltWith ToS (06.03.2026), Wappalyzer ToS.

**(г) Как действуют исследователи безопасности (контрпримеры — это ЗА границей нашего канала):**
- Wiz / Moltbook, 2026-02-02 (https://wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys): ключ `sb_publishable_...` найден в публичном JS-чанке (пассивный шаг); затем выполнены `curl .../rest/v1/agents?select=name,api_key`, GraphQL-интроспекция, и `PATCH .../rest/v1/posts?...` (запись) — доступ к данным третьих лиц и модификация, под responsible disclosure.
- Matt Palmer / CVE-2025-48757 (https://mattpalmer.io/posts/statement-on-CVE-2025-48757/): скрипт «visited homepages of Lovable-built sites, captured network requests, and attempted to modify queries to execute SELECT *».
- Escape.tech (https://escape.tech/blog/methodology-how-we-discovered-vulnerabilities-apps-built-with-vibe-coding/): «We also performed API discovery by brute-forcing API paths»; «Safe live validation: ... exposed tokens were tested against non-destructive requests»; сами исключили домены образования и здравоохранения как «typical users are not authorized to probe such systems».
- Wiz / Base44 (https://thehackernews.com/2025/07/wiz-uncovers-critical-access-bypass.html): недокументированные `api/apps/{app_id}/auth/register` и `.../verify-otp` без авторизации.
**Это исследования с раскрытием и целью безопасности, не лидогенерация.** Для нашего канала любой из этих приёмов — недопустим.

**(д) Бот-защита как контроль доступа:** `GET https://lovable.dev/` с нейтральным UA → HTTP 403, `server: cloudflare`, CSP `script-src ... https://challenges.cloudflare.com` (2026-10-04). Это явный барьер; обход (смена UA, headless-эмуляция человека, ротация IP) — за границей.

---

## 2. СИГНАТУРЫ БИЛДЕРОВ (публичные, пассивные)

### 2.0 Базы сигнатур: что есть в открытых форках Wappalyzer (на 2026-10-04)

Скачаны `src/technologies/*.json` двух открытых форков и проверено наличие записей:

| Форк | Технологий (подсчёт мой) | Есть | Нет |
|---|---|---|---|
| HTTPArchive/wappalyzer (`main`) | 4003 | Bubble, Lovable, Replit, Supabase, Firebase, Webflow, Framer Sites, Carrd, Softr, Base44, Emergent, Flutter, Vercel, Netlify | Bolt, v0, Glide (app builder), Adalo, FlutterFlow, StackBlitz |
| enthec/webappanalyzer (`main`) | 7628 | то же + Adalo, Xano, Wized, Retool, StackerHQ, Hostinger Horizons, Durable, Dorik AI | Bolt (есть лишь несвязанные Bolt CMS/Bolt Payments), v0, Glide (есть лишь библиотека Glide.js), FlutterFlow |

Вывод: для **Bolt, v0, Glide, FlutterFlow** готовых правил в открытых базах нет → нужны собственные правила (опираться на домены/бейджи/дефолты ниже).

Контекст о форках:
- HTTPArchive/wappalyzer README (raw, 2026-10-04): «Wappalyzer is now closed source. This is a fork from the last open-source version and is used for the monthly HTTP Archive crawl. This repo is **not** used for the Wappalyzer website, nor the Wappalyzer browser extension, which is now also closed source.» Лицензия: GNU GPL v3 (файл LICENSE).
- enthec/webappanalyzer README: «This project is a continuation of the iconic Wappalyzer ... that went private in August 2023. ... Enthec is committed not to set this repo private at any moment». Лицензия: GNU GPL v3.
- Свежесть (по кэшу Exa, актуальность на сегодня не подтверждена): enthec — коммиты до 2026-04-17; HTTPArchive — коммиты до 2026-05-08.
- Стадия «правила гниют»: разные форки/даты дают разные правила; пример расхождения — TXT-проверка Lovable: в enthec `lovable_verification=`, а в официальной доке Lovable `lovable_verify=` (см. 2.1).

### 2.1 Lovable

**Домены / DNS**
- Публикация по умолчанию: `xxx.lovable.app` — «A custom domain lets you use your own domain or subdomain for your Lovable project instead of the default `xxx.lovable.app` URL» [ВЖИВУЮ] https://docs.lovable.dev/features/custom-domain
- Кастомный домен (платные планы): A-запись на `185.158.133.1`; TXT-верификация на хосте `_lovable` (или `_lovable.<prefix>`), значение начинается с `lovable_verify=` [ВЖИВУЮ, там же].
- **Расхождение:** форк enthec ищет TXT `lovable_verification=`; официальная дока — `lovable_verify=` → правило форка может быть неверным/устаревшим.
- Кастомный домен только на платных планах (там же) → у бесплатных проектов остаётся `*.lovable.app` и бейдж.

**HTML / мета / бейдж** [ВЖИВУЮ: публичный индекс кода GitHub, 2026-10-04; счётчики приблизительные]
- Бейдж на опубликованных проектах: `<aside id="lovable-badge" ... aria-label="Edit with Lovable"><a id="lovable-badge-cta" href="https://lovable.dev/projects/<uuid>?utm_source=lovable-badge">` (найдено в `index.html` репозиториев; 188 файлов по запросу).
- Официальная дока: бейдж «Edit with Lovable» скрывается на платных планах (Pro и выше), настройка на проект — https://docs.lovable.dev/features/projects/settings ; https://docs.lovable.dev/introduction/faq.md ; https://docs.lovable.dev/introduction/subscription-plans
- Дефолтные мета в `index.html` скаффолда: `<meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />`, `<meta name="twitter:site" content="@lovable_dev" />` (≈57.7k файлов по запросу `"lovable.dev/opengraph-image" filename:index.html`).
- Legacy-скрипт эпохи GPT Engineer: `<script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>` рядом с комментарием «IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT!» (≈35.2k файлов `index.html`; сколько таких живых сайтов в 2026 — **нет данных**).
- Wappalyzer-форки (enthec): `dom link[href*='/lovable-uploads/']`, `meta author = lovable`, `scriptSrc \.lovable\.app/`, JS-глобал `LOV_SELECTOR_SCRIPT_VERSION`, cookie `lovable-preview-mode`, DNS TXT `lovable_verification=`. HTTPArchive-форк: `dom link[href*='/lovable-uploads/']`, `meta author = Lovable`.
- **`lovable-tagger` НЕ является признаком продакшн-сайта:** шаблон `vite.config.ts` подключает его как `plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean)` (найдено в публичных репозиториях, ≈2.8k файлов) → в production-сборку тег-плагин не попадает; виден только в публичном репозитории (`package.json`, ≈76k файлов) или в dev-/preview-сборке. Аналогично `data-lov-id` — атрибут dev-сборки (по описанию сторонних детекторов, [ВТОРИЧНЫЙ]).

**Стек и модель бэкенда**
- Lovable Cloud: «a built-in backend service ... database, authentication, storage, and serverless functions»; «utilizes Supabase's open-source foundation» [ВЖИВУЮ] https://docs.lovable.dev/integrations/cloud . Lovable-фронт (Vite + React + shadcn/ui + Tailwind — по описанию сторонних детекторов [ВТОРИЧНЫЙ]) обращается к Supabase напрямую из браузера: Escape.tech: «anonymous JWT tokens were exposed in the JavaScript bundles of the Lovable front end. These tokens were linked to PostgREST APIs as part of the Supabase backend integration».
- Следовательно признак «Lovable + `*.supabase.co` в бандле» = «клиент говорит с БД напрямую; авторизация держится на RLS-политиках» (см. 2.6).

**Надёжность:** маркеры дефолтные и редактируемые; бейдж пропадает на платных; домен пропадает на кастомном. При ≥2 совпадающих признаках точность высокая; полнота средняя [ОЦЕНКА].
**Escape.tech** сообщил, что «derived three independent fingerprinting methods for detecting Lovable-based web apps» — детали (на картинках) в тексте недоступны. Публичный каталог Lovable `launched.lovable.dev` — Escape: «over 4,000 applications built with Lovable are publicly listed» [источник заинтересован]; прямой GET на `launched.lovable.dev` 2026-10-04 вернул 301 (редирект не прослеживался).

### 2.2 Bubble

**Домены / DNS** [ВЖИВУЮ] https://manual.bubble.io/help-guides/getting-started/navigating-the-bubble-editor/tabs-and-sections/settings-tab/web-app/custom-domain-and-dns
- Live: `https://<app>.bubbleapps.io`; dev-ветка: `https://<app>.bubbleapps.io/version-test/`.
- Кастомный домен: «Bubble will show you the DNS records»; пример — четыре A-записи на Cloudflare-адреса (`104.16.36.105`, `104.16.42.105`, `104.19.240.93`, `104.19.241.93`), но с пометкой «Do not use the IP addresses below – they are only meant as an illustration». Следовательно **IP-сигнатура у Bubble неспецифична** (общий Cloudflare).
- Сертификат кастомного домена в FAQ описан как «of the form `ssl123456.cloudflare.net`».
- Кастомный домен — на платных планах; домен, содержащий слово `bubble`, запрещён ToS.

**Заголовки и HTML** [Wappalyzer-форки + ВЖИВУЮ на bubble.io]
- Определение форков: headers `x-bubble-capacity-limit`, `x-bubble-capacity-used`, `x-bubble-perf`; JS-глобалы `_bubble_page_load_data`, `bubble_environment`, `bubble_hostname_modifier`, `bubble_version`; implies Node.js.
- **Живая проверка** (одиночный `GET https://bubble.io/`, 2026-10-04, HTTP/2 200): `server: cloudflare`, `x-bubble-capacity-limit: 0 ms slower`, `x-bubble-capacity-used: 0.679 unit-seconds used`, `x-bubble-perf: {"total":75.8,"percents":{"top":{"bubble_cpu":58.2,"block":31.3,"capacity_rl":0,"other_pause":0,"pre_fiber":1.1},...` , `x-powered-by: Express`, `x-content-type-options: nosniff`, HSTS. В статическом HTML: `_bubble_page_load_data` (42 вхождения), `cdn.bubble.io` (20), `d1muf25xaso8hp.cloudfront.net` (1). То есть **заголовки `x-bubble-*` видны без исполнения JS**.
- Что значат `x-bubble-capacity-*`: форум Bubble (2022-10-14, [устарело (до 2025)]) — автор «haven't figured it out yet - what exactly do these numbers mean»; значения вида «1.588 unit-seconds used» относятся к запросу. Дока Bubble: capacity — legacy-метрика, заменена на workload units (WU) в апреле 2023 (https://manual.bubble.io/help-guides/workload.md). **Вывод:** `x-bubble-capacity-*` — не документированный индикатор «упёрся в лимит»; как сигнал нагрузки использовать нельзя. Поле `capacity_rl` внутри `x-bubble-perf` не документировано — **нет данных** о смысле.

**Модель бэкенда:** приложение и БД размещены на серверах Bubble («Since Bubble apps are hosted on Bubble's server, you don't need to purchase hosting» — дока) → «слабый бэкенд» здесь = ограничения платформы (workload/стоимость, экспорт данных, кастомная логика), а не прямой доступ к БД из браузера. Файлы загружаются в S3 (дока).

**Надёжность:** высокая для платформенных заголовков (подтверждено на bubble.io) — верно только для Bubble-приложений, отдающих эти заголовки; на пользовательских приложениях живой проверки нет.
**Разброс счётчиков у трекеров** (показатель зависимости полноты от краулера): Bubble-сайтов — 283 (wmtips, 3.3M+ проанализированных сайтов, стр. от 2026-04-28), 2,319 (WebTechSurvey), 8,790 (Ful.io), 9,096 (Aguko, обновл. 2026-08-30), 14,169 (PoweredBy/KeywordsEverywhere; в ежемесячном HTTP Archive пик 3,387 в апр. 2025), W3Techs — «less than 0.1%» среди сайтов с известной CMS; BuiltWith — страница по Bubble по моему слагу не найдена.

### 2.3 Replit

**Домены / DNS** [ВЖИВУЮ]
- Опубликованное приложение: «a free subdomain in the format `<your-live-app-subdomain-name>.replit.app`» https://docs.replit.com/cloud-services/deployments/custom-domains
- Dev-URL: `UUID.servername.replit.dev` — «only live while you actively work on a Replit App», **публичный по умолчанию** («Anyone with the URL can view your app») https://docs.replit.com/core-concepts/workspace/app-setup/development-urls
- Кастомный домен: A-запись (IP в доке не указан) + TXT `replit-verify=...`, который «must stay in your DNS for the full lifetime of the domain»; CNAME для аутентификации не нужен.
- `*.repl.co` — прежний домен [ВТОРИЧНЫЙ].

**Заголовки:** Wappalyzer-форки: `replit-cluster` (любое значение) и `expect-ct` с `\.repl\.it/` — возможно устарело (домен repl.it до ребрендинга); для деплоев 2026 — **нет данных**.

**Модель бэкенда** [ВЖИВУЮ] https://docs.replit.com/features/publishing/deployment-types
- «Agent builds full-stack apps that need a backend server»; Static-деплой для Agent-приложений несовместим. Типы: Autoscale (по умолчанию), Static, Reserved VM, Scheduled.
- БД: встроенная PostgreSQL; `DATABASE_URL` — переменная окружения на сервере (не в клиентском коде). До 4 дек. 2025 dev-БД была на Neon; новые — на собственной инфраструктуре Replit (Helium); prod-БД отдельная (https://docs.replit.com/features/data-and-storage/development-and-production, https://docs.replit.com/features/data-and-storage/sql-database).
**Вывод:** у Replit-приложений бэкенд **есть** (AI-написанный монолит на одном рантайме); «слабость» — качество/эксплуатация сгенерированного кода, масштабирование, секреты, а не «фронт напрямую в БД». Это иная гипотеза лида, чем Lovable+Supabase.

**Надёжность:** по домену `*.replit.app` — высокая; при кастомном домене — низкая (A-запись без публичного IP, заголовки — нет данных).

### 2.4 Bolt (bolt.new, StackBlitz)

- Публикация: «free `bolt.host` URL, with up to 10 GB of bandwidth and 333,333 web requests per month»; free-проекты показывают бейдж **Made in Bolt**, платный план его убирает [ВЖИВУЮ] https://support.bolt.new/concepts/faq
- Публикация на Netlify (Netlify runs Bolt apps natively; «more than one million Bolt sites on Netlify in the five months after the integration launched») [ВТОРИЧНЫЙ: netlify.com knowledge-base, [источник заинтересован]] → заголовки Netlify: `Server: Netlify`, `X-NF-Request-ID`, URL `*.netlify.app` (определение Netlify в форках Wappalyzer).
- Bolt Cloud (запуск 2025-09-30): «every project in Bolt Cloud that needs a backend is powered by Supabase»; «Bolt has already connected their apps to over 600,000 Supabase backends» [ВЖИВУЮ, **источник заинтересован** — блог Supabase] https://supabase.com/blog/bolt-cloud-launch ; Supabase-интеграция требует Pro/Teams (support.bolt.new FAQ).
- Превью StackBlitz/WebContainers эфемерны и в продакшн-детекте не используются; надёжной сигнатуры домена превью не нашёл [НЕ ПОДТВЕРЖДЕНО: `webcontainer-api.io`/`local-credentialless`; вторичный источник упоминает `stackblitz.io`].
- Правил в Wappalyzer-форках нет.
**Вывод:** признак слабый (домен `bolt.host`/`netlify.app` + бейдж на free); модель бэкенда: статический фронт (Netlify/Bolt Hosting) + Supabase (Bolt Cloud) → «клиент ↔ Supabase напрямую», как у Lovable.
**Надёжность:** низкая–средняя; после кастомного домена и снятия бейджа — почти нулевая, остаётся только факт использования Supabase.

### 2.5 v0 (Vercel)

- Деплой: «v0 deploys projects to Vercel»; «Confirm the provided `vercel.app` domain, select a connected custom domain» [ВЖИВУЮ] https://v0.app/docs/deployments
- Заголовки Vercel (определение в форках): `server: ^now|Vercel$`, `x-vercel-id`, `x-vercel-cache`, `x-now-trace`; DNS SOA `.vercel-dns.com`. Vercel сам ставит HSTS: `.vercel.app` — `max-age=63072000; includeSubDomains; preload`; кастомные домены — `max-age=63072000` [ВЖИВУЮ] https://vercel.com/docs/cdn-security/encryption ; CSP/X-Frame-Options по умолчанию не ставит (доска описывает как настраиваемые) https://vercel.com/docs/cdn-security .
- **Наиболее специфичный дефолт v0** — шаблон `app/layout.tsx`: `title: 'v0 App'`, `description: 'Created with v0'`, `generator: 'v0.dev'` (позже `'v0.app'`). В Next.js поле `generator` рендерится как `<meta name="generator" content="..." />` [ВЖИВУЮ] https://nextjs.org/docs/app/api-reference/functions/generate-metadata . Найдено в публичных репозиториях (поиск кода GitHub 2026-10-04): `generator: 'v0.dev'` в `layout.tsx` — ≈18.8k файлов; `"Created with v0"` — ≈4.0k; пример `generator: 'v0.app'` присутствует. Отдельный пример: в одном репозитории скопирован `description: 'Created with v0'`, но `generator: 'Supernova Business'` — т.е. поле легко меняется.
- Правил в Wappalyzer-форках нет.
**Вывод:** сам по себе v0-проект неотличим от любого Next.js на Vercel, пока не остались дефолты; бэкенд — серверные компоненты/route handlers Next.js на Vercel + внешние сервисы (какие именно — по сигнатурам `supabase.co`/`firebase*` в бандле).
**Надёжность:** низкая (дефолт-мета удаляется одной правкой); при наличии `generator: v0.*` — высокая точность, низкая полнота [ОЦЕНКА].

### 2.6 Supabase (и корректное объяснение «публичного ключа»)

**Сигнатуры в клиентском коде** (публичный JS/HTML, которые сайт отдаёт каждому посетителю)
- Базовый URL: `https://<project-ref>.supabase.co` (ref — 20 символов a–z0–9: пример из доки `abcdefghijklmnopqrst`; «ровно 20» подтверждено вторичным источником weweb.io) — [ВЖИВУЮ] https://supabase.com/docs/guides/platform/custom-domains
- Кастомный домен API: только CNAME на `<ref>.supabase.co` + TXT `_acme-challenge...`; один домен на проект; поддерживаются только субдомены (`api.example.com`) (там же) → **DNS-сигнатура**: CNAME, ведущий на `*.supabase.co`.
- Ключи: legacy-JWT `anon`/`service_role` или новые `sb_publishable_...` / `sb_secret_...` [ВЖИВУЮ] https://supabase.com/docs/guides/api/api-keys : «Supabase is deprecating the `anon` and `service_role` keys by the end of 2026» (повторно подтверждено https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys через выдачу поиска) → правила детекта должны учитывать оба формата.
- Legacy-JWT начинается с `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs` (base64url от `{"alg":"HS256","typ":"JWT"}` и `{"iss":"supabase",`; payload содержит `ref`, `role`: `anon`/`service_role`). Префикс `eyJpc3MiOiJzdXBhYmFzZSIs` найден в публичном коде (≈380k файлов; GitHub-оценка); комбинация заголовок+payload — ≈48k файлов. Локальное base64-декодирование уже опубликованной строки — пассивно; **использование** ключа — нет.
- Эндпоинты, видимые в коде/сетевых запросах: `/rest/v1/` (PostgREST — Wiz/Moltbook), `/auth/v1` (issuer в JWT — дока https://supabase.com/docs/guides/auth/jwts), `/functions/v1/` и `/graphql/v1` — по описанию сторонних детекторов [ВТОРИЧНЫЙ].
- Wappalyzer-форки (enthec): `scripts \.supabase\.co/`, `cdn.jsdelivr.net/npm/@supabase`, `unpkg.com/@supabase`, `scriptSrc cdn\.supabase\.com`, JS `createClient` ~ `supabase\.`, `supabase.AuthAdminApi`, `supabase.storageKey`. В HTTPArchive-форке для Supabase — только Nuxt-конфиг (`__NUXT__.config.public.SUPABASE_URL`) → **форк HTTP Archive прямой URL `*.supabase.co` в бандле не ловит**.
- Домен `supabase.in` из брифа — **[НЕ ПОДТВЕРЖДЕНО]**: во всех найденных первичных/вторичных источниках фигурирует только `supabase.co` (Supabase-блог о региональных блокировках, февраль 2026, Индия: https://supabase.com/blog/navigating-regional-network-blocks ; https://www.techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order/ ).

**Что это БЫЛО БЫ: «публичный ключ» — by design, а не уязвимость** (цитаты)
- «Safe to expose online: web page, mobile or desktop app, GitHub actions, CLIs, source code.» (про publishable-ключ) — https://supabase.com/docs/guides/api/api-keys [ВЖИВУЮ]
- «Row Level Security decides what this client can reach, so enable it on every table before you deploy.» (там же)
- «Danger: A secret key bypasses every Row Level Security policy you have. Never put one in a browser, a shipped application, or source control.» (там же)
- RLS-дока https://supabase.com/docs/guides/database/postgres/row-level-security [ВЖИВУЮ]: «Once RLS is enabled, no data is accessible through the API when using a publishable key, until you create policies.»; «A table in an exposed schema without RLS is readable and writable by any role with a grant on it.»; «On existing projects, a new table in public starts with every privilege already granted to all three roles.»; `service_role` — «Full access. It bypasses RLS, so keep it server-side.»
- Wiz о Moltbook: «The discovery of these credentials does not automatically indicate a security failure, as Supabase is designed to operate with certain keys exposed to the client - the real danger lies in the configuration of the backend they point to.»; «When properly configured with Row Level Security (RLS), the public API key is safe to expose - it acts like a project identifier.»
- Matt Palmer: «Supabase provides public `anon` keys by design» — проблема в отсутствии RLS, не в видимом ключе.

**Что видимый ключ/URL в бандле говорит на самом деле (без мифов):**
1. Это **архитектурный факт**: браузер ходит в Postgres (через PostgREST/Auth/Storage/Edge Functions) без собственного серверного слоя («BFF/бэкенда»); логика авторизации живёт в RLS-политиках и функциях БД.
2. Это **не** доказательство дыры. Уязвимость возникает при: выключенном RLS / слишком широких политиках / унаследованных grant'ах на таблицах `public`, публичных бакетах Storage, Edge Functions без проверки токена, **секретном ключе в клиенте** (роль `service_role` или `sb_secret_...`). Всё это **пассивно не проверяется** — любая проверка требует обращения к API цели.
3. Исключение, видимое пассивно: если в публичном бандле лежит JWT с payload `"role":"service_role"` или строка `sb_secret_...` — это утечка секрета (критическая). Действие по правилам границы: **не использовать ключ**, не пробовать запросы; передавать как раскрытие (другой процесс, вне оси 3).
4. Практический смысл для канала: «Supabase-в-клиенте без видимого собственного API» = кандидат на «довести бэкенд до продакшена» (серверная валидация, вебхуки платежей, лимиты, аудит RLS), но доказательство «слабости» нужно из другого источника, не из зондирования.

**Свежие факты о распространённости проблемы с RLS** (не измеряется нами пассивно; все данные получены активными методами исследователей):
- CVE-2025-48757 (запись в CVE JSON API, 2026-10-04): «An insufficient database Row-Level Security policy in Lovable through 2025-04-15 allows remote unauthenticated attackers to read or write to arbitrary database tables of generated sites. NOTE: this is disputed by the Supplier because each individual customer of the Lovable platform accepts a responsibility over protecting the data of their application.»; CVSS 3.1 = 9.3 (CRITICAL), `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N`; опубликовано 2025-05-30. https://cveawg.mitre.org/api/cve/CVE-2025-48757
- Исследователь (https://mattpalmer.io/posts/statement-on-CVE-2025-48757/): проанализировано 1,645 проектов, 170 с неадекватным RLS (≈10.3%), 303 эндпоинта; даты: 2025-03-20 первая находка, 2025-04-14 независимое раскрытие, 2025-05-29 CVE. Lovable выпустил «Lovable 2.0» со «security scanner», проверявшим наличие RLS, но не корректность («a false sense of security» — оценка автора).
- Moltbook (Wiz, 2026-02-02): 1.5M API-токенов, ~35k email, личные сообщения агентов; закрыто «within hours». https://wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys
- Escape.tech (2025-10-29, **источник заинтересован** — продаёт сканеры): 5,600+ публичных vibe-coded приложений; «nearly 60%» с критическими уязвимостями; 34,232 уязвимости (≈2,000 высокой важности), 400+ секретов, 175 случаев PII; основная причина — права доступа/RLS, а не инъекции; выборка смещена: ≈4,000 из ≈5,600 — Lovable (из каталога launched.lovable.dev), Base44 ≈159, Create.xyz ≈449. https://escape.tech/blog/methodology-how-we-discovered-vulnerabilities-apps-built-with-vibe-coding/ ; https://escape.tech/state-of-security-of-vibe-coded-apps
- vibewrench.dev (2026-03-17, **источник заинтересован**, n=100, методика неизвестна): RLS disabled — Lovable 28% (n=29), Bolt 13% (n=30), v0 19% (n=16), Cursor 4% (n=25), всего 14%; отсутствуют заголовки — Lovable 28%, Bolt 47%, v0 38%, Cursor 24%, всего 34%. https://vibewrench.dev/blog/we-scanned-100-vibe-coded-apps

### 2.7 Firebase

**Сигнатуры в клиентском коде/DNS**
- Объект `firebaseConfig` (apiKey `AIza...`, `authDomain` `<id>.firebaseapp.com`, `projectId`, `storageBucket`, `appId`...) — по официальной инструкции подключения Web SDK: «you'll get a Firebase configuration object that you'll use to connect your app with your Firebase project resources» [ВЖИВУЮ] https://firebase.google.com/docs/web/setup
- Домены по умолчанию [ВЖИВУЮ] https://firebase.google.com/docs/hosting , https://firebase.google.com/docs/projects/learn-more : Hosting — `PROJECT_ID.web.app` и `PROJECT_ID.firebaseapp.com`; Realtime DB — `PROJECT_ID-default-rtdb.firebaseio.com` или `...REGION_CODE.firebasedatabase.app`; Cloud Storage — `PROJECT_ID.appspot.com`.
- Кастомный домен Hosting: A-запись `199.36.158.100` (по выдаче доки https://firebase.google.com/docs/hosting/custom-domain [ВТОРИЧНЫЙ по этой цифре — открытый текст доки значение показывает в консоли]); TXT-верификация должна «keep continually present».
- Wappalyzer-форки: `scripts firebase(?:Config|io\.com)`, `scriptSrc /firebasejs/...`, `scripts \.gstatic\.com/firebasejs/`, JS `firebase.SDK_VERSION`, `dom iframe[src*='.firebaseapp.com/']`, header `vary: x-fh-requested-host` (Firebase Hosting), `xhr fire(?:base|store)\.googleapis\.com|\.firebaseio\.com` (enthec).
- Служебные URL Firebase Hosting вида `/__/firebase/init.json` не из HTML — **не использовать** (запрос непрослеженного пути; см. серую зону в findings).

**Официально о ключах** [ВЖИВУЮ, стр. обновлена 2026-10-01 UTC] https://firebase.google.com/docs/projects/api-keys
- «API keys for Firebase services are not used to control access to backend resources; that can only be done with Firebase Security Rules (to control which end users can access resources) and Firebase App Check (to control which apps can access resources).»
- «If your app's setup follows the above guidelines, then API keys restricted to Firebase services do not need to be treated as secrets, and it's safe to include them in your code or configuration files.»
- «Secure your Realtime Database, Cloud Firestore, and Cloud Storage data by using Firebase Security Rules. Don't rely only on restricting and/or obscuring your API keys.»
**О правилах** [ВЖИВУЮ, стр. обновлена 2026-08-24 UTC] https://firebase.google.com/docs/rules/insecure-rules : при создании БД выбирают «Locked mode» или «Test mode (grant access to all users)»; «Warning: NEVER use this ruleset in production; it allows anyone to overwrite your entire database.» Также https://firebase.google.com/docs/firestore/quickstart : test mode «allows anyone to read and overwrite your data».
**Модель бэкенда:** как у Supabase — «клиент ↔ BaaS напрямую»; защита = Security Rules + App Check. Видимый `firebaseConfig` — не утечка.
**Надёжность:** присутствие Firebase в клиентском коде определяется с высокой точностью (конфиг обязан быть в клиентском коде, если SDK используется на клиенте); состояние Rules пассивно не определяется.

### 2.8 Webflow

- Дефолтный поддомен: «By default, your site comes with a subdomain (e.g., `yoursite.webflow.io`) that you can use as a development or staging environment» [ВЖИВУЮ] https://help.webflow.com/hc/en-us/articles/33961351954579-Publishing-overview
- Wappalyzer-форки: `dom html[data-wf-site]`, JS `Webflow` (и `Webflow._.VERSION`), `meta generator = Webflow`.
- **Живая проверка** (`GET https://webflow.com/`, 2026-10-04, HTTP/2 200, сайт самого вендора): `<meta content="Webflow" name="generator"/>`; `data-wf-domain="webflowmarketingmain.com"`, `data-wf-page="..."`, `data-wf-site="..."`; ресурсы с `cdn.prod.website-files.com` (158 вхождений); заголовки: `cf-ray`, `cf-cache-status: HIT`, `x-wf-region: us-east-1`, `x-wf-page-id: ...`, `x-lambda-id`, HSTS, X-Frame-Options, CSP (+ report-only). Заголовки `x-wf-region`/`x-wf-page-id` в Wappalyzer-форках **отсутствуют** — наблюдение на одном вендорском сайте, на пользовательских не проверено.
- DNS кастомных доменов (**сменились**): новые A `198.202.211.1`, CNAME `cdn.webflow.com`, TXT `_webflow` со значением `one-time-verification=...`; прежние A `75.2.70.75` / `99.83.190.102` и CNAME `proxy-ssl.webflow.com` — legacy: «As of January 13, 2026, you can’t publish to a custom domain that points to Webflow’s legacy DNS records» [ВЖИВУЮ] https://help.webflow.com/hc/en-us/articles/42394305646611-How-do-I-manually-migrate-my-DNS-records ; https://help.webflow.com/hc/en-us/articles/33961341714835-Troubleshoot-your-DNS-settings . **IP-сигнатуры Webflow гниют** — обновлять.
- Модель бэкенда: сайт/CMS без прикладного бэкенда (формы, CMS). Прикладной бэкенд, если есть, — внешний (Wized — `requires Webflow`, Xano и т.п. — определения в enthec).
- Масштаб (BuiltWith, 2026-10-04, WebFetch): **664,513** live-сайтов Webflow; всего за всё время 1,402,145; в топ-1M — 12,096 https://trends.builtwith.com/websitebuilder/Webflow
**Надёжность:** высокая (несколько независимых маркеров: meta + `data-wf-*` + CDN-домен + заголовки) [ОЦЕНКА по живой проверке на 1 сайте]. Релевантность для «слабого бэкенда» — низкая (маркетинговый сайт).

### 2.9 Framer

- Wappalyzer (HTTPArchive-форк): `headers server ^Framer/`, `meta generator ^Framer`, `scriptSrc framerusercontent\.com`, JS `__framer_importFromPackage`; implies React.
- **Живая проверка** (`GET https://www.framer.com/`, 2026-10-04, HTTP/2 200): `server: Framer/26fa766`; `<meta name="generator" content="Framer 715c8ea">`; `framerusercontent.com` — 886 вхождений; `server-timing: region;desc="us-east-1", cache;desc="cached", ssg-status;desc="optimized", version;desc="26fa766", ...`; HSTS, `x-content-type-options: nosniff`, `x-frame-options: DENY`.
- Домены: «Your site will automatically generate a framer.app domain»; бесплатные поддомены `framer.website`, `framer.photos`, `framer.media`, `framer.wiki` [ВЖИВУЮ] https://www.framer.com/help/articles/how-to-connect-a-custom-domain/ , https://www.framer.com/help/articles/publishing-your-framer-website/
- DNS кастомных доменов: A `31.43.160.6` и `31.43.161.6`, CNAME (`www`) `sites.framer.app`; прежние A `52.223.52.2`, `35.71.142.77` — поддержка старых IP закончилась 2025-07-01 [ВЖИВУЮ] https://www.framer.com/help/articles/connect-to-our-new-and-improved-hosting
- Масштаб: **302,747** live-сайта Framer Sites (BuiltWith 2026-10-04; всего 459,816; топ-1M — 2,360) https://trends.builtwith.com/websitebuilder/Framer-Sites
- Модель бэкенда: статический/CMS-сайт, прикладного бэкенда нет.
**Надёжность:** высокая (header + meta + CDN) [ОЦЕНКА по живой проверке]; релевантность для «слабого бэкенда» — низкая.

### 2.10 Carrd

- Wappalyzer (enthec): `dom link[href*='.carrd.co'][rel='canonical']`, `requires Apache HTTP Server`, `scripts` — характерный фрагмент JS `(!section || section.tagName != 'SECTION')` (confidence 90); HTTPArchive-форк — только JS-фрагмент.
- Домены: поддомены `*.carrd.co` (по правилу форка); Pro: «Publish sites to unbranded URLs (like .crd.co) and punycode URLs» и кастомные домены с SSL Let's Encrypt [ВЖИВУЮ] https://carrd.co/docs/pro/features . DNS-значения Carrd — **нет данных** (вторичные источники: «two A records and one CNAME»).
- `GET https://carrd.co/` 2026-10-04 → HTTP 301, `server: cloudflare` (цель редиректа не прослеживалась).
- Модель бэкенда: одностраничник; формы (Pro). Прикладного бэкенда нет.
**Надёжность:** низкая–средняя (слабые правила). Релевантность для «слабого бэкенда» — низкая.

### 2.11 Softr

- Домены: «unlimited subdomains for your apps on our `softr.app` TLD, for example: `myportal.softr.app`»; в других страницах доки — `*.softr.io` (прежний формат) [ВЖИВУЮ] https://docs.softr.io/publishing/add-a-custom-domain-to-your-app , https://docs.softr.io/publishing/publishing-your-softr-app
- Кастомный домен: A-запись на IP `35.158.87.123` (в доке; IP дополнительно показывается в Softr Studio) (там же).
- Wappalyzer: `link[href*='softr']` с `href` на `softr-files.com/` или `softr-prod.imgix.net/`. Живая проверка `GET https://www.softr.io/` (2026-10-04): страница **собрана на Webflow** (`data-wf-site`, `data-wf-domain="v2.softr.io"`, `x-wf-region`, `cdn.prod.website-files.com`), но подгружает ресурсы с `assets.softr-files.com` → правило `softr-files.com` срабатывает и на маркетинговом сайте (не приложении) — пример потенциального ложного срабатывания.
- Бэкенд: данные во внешних источниках — Airtable, Google Sheets и др.; «Supabase is available on Professional and higher plans» (подключение по реквизитам Postgres: host/db/port/user/password; Softr советует ограничить доступ по IP: `3.120.79.212`, `3.123.159.186`, `52.58.246.121`) [ВЖИВУЮ] https://docs.softr.io/data-sources/supabase → ключ `anon` в клиенте Softr-приложения не требуется.
**Надёжность:** средняя (домены + ресурсы `softr-files.com`). Модель: фронт-конструктор над внешней БД → «слабый бэкенд» = лимиты внешней БД/Airtable и отсутствие кастомной логики.

### 2.12 Glide

- Опубликованное приложение: «When you publish your app, your app automatically gets hosted at a “glide.page” address» (пример `d0sda.glide.page`); кастомные домены — на платных тарифах [ВЖИВУЮ] https://www.glideapps.com/docs/custom-domains
- Прежний домен `*.glideapp.io` — «new apps cannot reuse the .glideapp.io subdomain and will move over to the new .glide.page» [ВТОРИЧНЫЙ: форум сообщества].
- HTML/заголовочные сигнатуры — **нет данных** (в форках Wappalyzer правила отсутствуют).
- Бэкенд: данные Glide (Glide Tables/Google Sheets), логика — Glide-workflows.
**Надёжность:** только по домену → средняя при `*.glide.page`, низкая на кастомном.

### 2.13 Adalo

- Wappalyzer (enthec): `dom link[href*='.adalo.com/static/'][rel='stylesheet']`, `scriptSrc assets\.adalo\.com/`.
- Кастомный домен: только поддомен (в т.ч. `www`), «Adalo does not support Root Domains»; кастомный домен не должен содержать «adalo»; требуется тариф Starter и выше [ВЖИВУЮ] https://help.adalo.com/publishing-apps/publishing-to-the-web/publish-to-custom-domain . Формат дефолтного адреса веб-приложения в этой доке не указан — **нет данных**; CNAME-значение `hosting.adalo.com` — по пересказу в поиске [ВТОРИЧНЫЙ, не подтверждено первичкой].
- Бэкенд: собственная БД Adalo.
**Надёжность:** средняя (ассеты на `*.adalo.com`).

### 2.14 FlutterFlow

- Дефолтный адрес веб-приложения: `your-project-id-1234.flutterflow.app`; кастомный поддомен можно задать (только часть перед `flutterflow.app`, до 2 на Free, до 20 на платных); по умолчанию внизу справа кнопка-водяной знак «Built in FlutterFlow» (отключается на платных тарифах); кастомный домен — по записям из UI [ВЖИВУЮ] https://docs.flutterflow.io/deployment/web-publishing/
- Flutter web (определение форков): JS `_flutter.loader`, `_flutter_web_set_location_strategy`, `flutterCanvasKit`, `meta id="flutterweb-theme"`. **Живая проверка** (`GET https://app.flutterflow.io/`, редактор FlutterFlow — Flutter web, 2026-10-04): в статическом HTML `flutterCanvasKit` (6), `_flutter.loader` (4), `main.dart.js` (3); `x-served-by: cache-iad-...` (Fastly).
- Бэкенд: в доке — Firebase (Storage, Authentication, Dynamic Links, CORS-прокси через Firebase-функцию); прочие бэкенды — вне этой страницы.
- Правил FlutterFlow в Wappalyzer-форках нет → детект = «Flutter web» + домен `*.flutterflow.app` + водяной знак.
**Надёжность:** по домену/знаку — высокая при дефолтах; иначе неотличим от любого Flutter-приложения.

### 2.15 Другие AI-билдеры из определений форков (для полноты)

| Билдер | Признак (по форкам/докам) | Источник |
|---|---|---|
| Base44 | `*.base44.app` (напр. `myapp.base44.app`); CNAME кастомного домена на `base44.onrender.com`; `meta apple-mobile-web-app-title = base44`; свой BaaS (данные, auth, backend-функции) | https://docs.base44.com/Setting-up-your-app/Setting-up-your-custom-domain ; https://docs.base44.com/Setting-up-your-app/Buying-a-domain-with-Wix ; https://docs.base44.com/developers/backend/overview/backend-service-basics [ВЖИВУЮ] |
| Emergent | `scriptSrc assets\.emergent\.sh` | enthec/HTTPArchive |
| Hostinger Horizons | `X-Powered-By: Hostinger Horizons`; `meta generator = Hostinger Horizons` | enthec |
| Durable | `scripts cdn\.durable\.co` | enthec |
| Dorik AI | `link[href*='cdn.dorik.com']` | enthec |
| Xano / Wized (внешний бэкенд/логика для Webflow) | JS `XanoClient`, `XanoBaseStorage`...; `Wized.data`, `wized_config` | enthec |

### 2.16 Слой хостинга (общий для многих билдеров)

- Vercel: заголовки `server: Vercel`, `x-vercel-id`, `x-vercel-cache`; HSTS по умолчанию (см. 2.5).
- Netlify: `Server: Netlify`, `X-NF-Request-ID`, URL `.netlify.app`; HSTS: в блоге Netlify 2018 заявлено добавление HSTS-заголовка для поддоменов Netlify [устарело (до 2025)]; на форуме (2020-12, [устарело (до 2025)]) — для кастомного домена по умолчанию `strict-transport-security: max-age=31536000`; актуальная дока описывает HSTS-preload и `_headers`/`netlify.toml` https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/ ; https://docs.netlify.com/manage/routing/headers .
- Cloudflare: `server: cloudflare`, `cf-ray` — наблюдается на Bubble, Webflow, Softr (проксирование перед платформой) → «server: cloudflare» ничего не говорит о билдере.
- Render: CNAME Base44 ведёт на `base44.onrender.com` (хостинг Base44 на Render, по их доке).

### 2.17 Живые проверки сегодня (одиночный GET страницы самого вендора; 2026-10-04 13:28–13:30 UTC; нейтральный UA `Mozilla/5.0 (compatible; passive-signal-check/1.0)`, без контактных данных)

| URL | Результат | Подтверждённые маркеры |
|---|---|---|
| https://webflow.com/ | HTTP/2 200 | `meta generator=Webflow`, `data-wf-domain/page/site`, `cdn.prod.website-files.com` ×158, заголовки `x-wf-region`, `x-wf-page-id`, `cf-ray` |
| https://www.framer.com/ | HTTP/2 200 | `server: Framer/26fa766`, `meta generator="Framer 715c8ea"`, `framerusercontent.com` ×886 |
| https://bubble.io/ | HTTP/2 200 | `x-bubble-capacity-limit`, `x-bubble-capacity-used`, `x-bubble-perf`, `x-powered-by: Express`, `_bubble_page_load_data` ×42, `cdn.bubble.io` ×20 |
| https://www.softr.io/ | HTTP/2 200 | сайт на Webflow (`data-wf-*`, `x-wf-region`), ресурсы `assets.softr-files.com` |
| https://app.flutterflow.io/ | HTTP/2 200 | Flutter web: `flutterCanvasKit`, `_flutter.loader`, `main.dart.js` |
| https://carrd.co/ | HTTP/2 301 | редирект (не прослеживался), `server: cloudflare` |
| https://launched.lovable.dev/ | HTTP/2 301 | редирект (не прослеживался), `server: cloudflare` |
| https://lovable.dev/ | HTTP/2 **403** | Cloudflare challenge — **не обходилось** |

Замечание: это сайты вендоров (в т.ч. маркетинговые на другой платформе); для сайтов-клиентов вероятность наличия тех же маркеров [ОЦЕНКА] высокая, но не измерена.


---

## 3. ИНСТРУМЕНТЫ ДЕТЕКТА ТЕХНОЛОГИЙ (цены, API, лицензии, ToS)

> Страницы вендоров открыты повторно **2026-10-04 (UTC)**, после написания разделов 1–2. Метки источников: «Exa-текст» = полный текст страницы, «выжимка WebFetch» = пересказ суммаризатора (цифры сверять с первичкой), «curl» = мой прямой запрос к публичному файлу. Цифры о собственных возможностях вендора — **[источник заинтересован]**.

### 3.1 Wappalyzer (SaaS; код закрыт с августа 2023)

**Статус кода/лицензии**
- README форка HTTPArchive: «Wappalyzer is now closed source. This is a fork from the last open-source version and is used for the monthly HTTP Archive crawl. This repo is **not** used for the Wappalyzer website, nor the Wappalyzer browser extension, which is now also closed source.» README форка enthec: проект — «continuation of the iconic Wappalyzer … that went private in August 2023». Оба форка — GNU GPL v3 (файлы LICENSE).
- npm (curl `registry.npmjs.org`, 2026-10-04): пакеты `wappalyzer-core` и `wappalyzer`, последняя версия **7.0.3, опубликована 2023-08-23**; поле deprecated: «Package no longer supported»; description: «This package is no longer being maintained. Please use the API at wappalyzer.com/api instead.» Поле `license` в реестре пустое → лицензия пакета по реестру **нет данных**. Вывод: `wappalyzer-core` из брифа — **заброшен**, в 2026 использовать нельзя.

**Цены** (https://www.wappalyzer.com/pricing/ — Exa-текст + выжимка WebFetch, 2026-10-04; валюта USD; годовая оплата −17%)

| План | Цена в месяц | Что включено (по выжимке; колонки в тексте страницы слиплись) |
|---|---|---|
| Free | 0 | 50 technology lookups в месяц, 50 email-верификаций, 5 алертов (выжимка WebFetch) |
| Pro | 250 (годовой тариф 207.50) | 1 пользователь, 2 цели для списков, 5,000 верификаций, 5,000 API-кредитов |
| Business | 450 (годовой тариф 373.50) | 5 пользователей, любые комбинации технологий, 20,000 верификаций, 20,000 API-кредитов |
| Enterprise | от 850 | 25+ пользователей, 200,000+ верификаций, 200,000+ API-кредитов |

Дословно со страницы: «API credits included in plans expire after 60 days.» «You need a plan to access lead lists, APIs, and CRM integrations.» «Credits are pre-paid usage units for API requests, typically 1 credit per website.»

**API** (https://www.wappalyzer.com/docs/api/v2/lookup/ — Exa-текст)
- Дословно: «A Business plan is required to use this feature.» (про Technology lookup) → для lookup-API нужен план **Business ($450/мес)**, несмотря на то что кредиты начисляются и на Pro.
- `GET https://api.wappalyzer.com/v2/lookup/`, заголовок `x-api-key`; «Rate limit: 10 requests per second (up to 10 URLs per request)»; «Request timeout: 30 seconds»; цена: «1 credit per URL», «5 credits per URL when using `live=true` with `recursive=true`».
- По умолчанию отдаются кэшированные результаты (`max_age` по умолчанию 2 месяца; `denoise=true` отбрасывает низкую уверенность). Если записи нет, автоматически включается `live=true`; при `recursive=true` обход «follows internal website links», выполняется асинхронно (до 15 минут) и сообщает результат на `callback_url`. То есть для нового домена **краулинг цели делают серверы Wappalyzer** (в том числе многостраничный) по нашему запросу.
- Моя арифметика: Business 450 USD / 20,000 кредитов = **22.5 USD за 1,000 URL** (при полном использовании квоты; кредиты сгорают через 60 дней).

**ToS** (https://www.wappalyzer.com/terms/ — Exa-текст, 2026-10-04), дословные фрагменты:
- «You will only access (or attempt to access) our Services, including any API, by the means described in the applicable documentation.»
- «Wappalyzer sets and enforces limits on your use of the Services, including rate limits, monthly quotas, seat limits, API credits… You agree to, and will not attempt to circumvent, those limitations.»
- «Our detections, lookups, enrichments, verifications, exports, and other outputs may be incomplete, inferred, delayed, inaccurate, or unavailable.»
- «The data provided to you as part of our commercial Services is licensed, not sold. You may not sublicense, resell, publish, embed in a customer-facing product, or otherwise share the data without explicit permission in writing from Wappalyzer.»
- «Do not use contact details included in the data to send spam or other unlawful marketing communications.» «To comply with the Spam Act 2003, we do not supply email addresses and phone numbers if you are in Australia…» Право: Австралия.
- Явного запрета «scraping» в прочитанном тексте нет; ограничение — «only by the means described in the documentation». Оценка риска для внутреннего использования API в квалификации лидов: **низкий** при соблюдении лимитов; для перепродажи/публикации данных — **запрещено**.

**Конкурентное сравнение (источник заинтересован — продаёт конкурента):** страница TechnologyChecker (чтение 2026-09-01/02 по её же тексту) утверждает, что у Wappalyzer «8,125 technologies published», вход по API/CRM «at $450» — это согласуется с требованием плана Business в самой доке Wappalyzer.

### 3.2 BuiltWith

**ToS** (https://builtwith.com/terms — Exa-текст, «Last Updated: 6th March 2026»), дословные фрагменты:
- «BuiltWith grants Customers a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service **solely for internal business purposes**.»
- «You must not: republish material from this website; reproduce or distribute BuiltWith data publicly; store the entire database…; use automated systems or software to extract data from the Service except through authorized APIs; attempt to replicate the BuiltWith database; resell, redistribute, sublicense, or commercially exploit BuiltWith data.»
- «(6) API AND AUTOMATED ACCESS … API access is restricted to licensed Customers; automated requests must respect published rate limits; attempts to circumvent technical limits … are prohibited; bulk database extraction is prohibited unless explicitly licensed through BuiltWith datasets.»
- «(8) … BuiltWith data may not be used to create, train, enhance, validate, or distribute any artificial intelligence system, dataset, or automated analytics product that replicates, competes with, or substitutes for the BuiltWith Service.» (внутреннее использование данных как входа в собственные модели допускается.)
- «(10) … distributes spam or unsolicited commercial messages»; «Telephone numbers provided by the Service must not be used for marketing purposes. Users located in Australia are not permitted to access email lists through the Service.»
- «(12) Technology detections are based on signature evidence and may not be 100% accurate. False positives may occur if: websites include unused technology code; technology signatures remain after removal; indexing delays occur.»
- «(15) … Users agree to indemnify … from … unlawful communications, marketing, or outreach conducted using BuiltWith data.» Право: Австралия, суды Нового Южного Уэльса.

**Планы** (https://builtwith.com/plans — выжимка WebFetch, 2026-10-04; даты на странице нет; различие месячной/годовой цены в выжимке неясно): Basic **295 USD/мес** (2 технологии, 2 ключевых слова), Pro **495 USD/мес** (без лимита технологий), Team **995 USD/мес**. Все планы: «491.9 million domains», «127,700 tracked technologies», «18+ years technology history» (**[источник заинтересован]**; страница TechnologyChecker цитирует у BuiltWith «95K+ technologies, 670M+ domains» — цифры вендоров между собой не сходятся).

**API** (https://api.builtwith.com/ — выжимка WebFetch): ≈20 API (Domain API v26, Change, Relationships, Lists, Ask, MCP, VAT, Live Feed, Free, Company-to-URL, Financial, Tags, Recommendations, Redirects, Keywords, Keyword Search, Vector Search, Trends, Product, Trust).
- Free API: «Free API is rate limited to 1 request per second»; возвращает «last updated and counts for technology groups and categories»; ключ в каждом запросе; «You cannot resell the data as-is or provide duplicate functionality to builtwith.com» — то есть **список технологий конкретного домена Free API не отдаёт**.
- Domain API: endpoint вида `https://api.builtwith.com/v26/api.json`; «up to 16» доменов на запрос, для high-throughput «64 Root Domains or Subdomains Only Per Lookup»; rate limit в открытой доке — **нет данных**; «You need to login or signup to use the BuiltWith API».
- Кредиты (https://builtwith.com/all-products — выжимка; https://api.builtwith.com/agent-payment-api — Exa-текст): «$99 for 2000 credits», «1 API Credit for 1 Domain returns», «Does not use API credits on failure», кредиты не сгорают; в примере API докупки `cost_per_2000_credits_usd: 99.00`, покупка фиксированными блоками по 2,000. Моя арифметика: **≈0.0495 USD за домен** (≈49.5 USD за 1,000). Отдельный продукт LeadsEye (проверка списка сайтов): 1,000 кредитов — 55 USD … 1,000,000 — 1,960 USD (https://leadseye.builtwith.com/credits, Exa-текст).
- Счётчики трендов (выжимка WebFetch, 2026-10-04): Webflow — **664,513** live (всего 1,402,145; топ-1M 12,096); Framer Sites — **302,747** live (всего 459,816); Lovable — **301,457** live (всего 383,627; топ-1M 205; топ-100k 23); страницы без даты.
- Свежесть для только что запущенных сайтов — **нет данных**. Конкурент StackScope утверждает «by the time something shows up there [BuiltWith/Wappalyzer] it isn't new any more» (https://www.producthunt.com/products/stackscope-dev) — **[источник заинтересован]**, не проверено.

### 3.3 WhatRuns

- Главная (Exa-текст): «A free browser extension that helps you identify technologies used on any website at the click of a button.»; «450k+ happy active users.»; «No sign-up required.»; «Our in-house magicians add anywhere between 50-100 new web apps every day.» — всё **[источник заинтересован]**.
- ToS (https://www.whatruns.com/terms — Exa-текст, прочитано ≈9,000 знаков; оператор — Owned it Limited): общие условия, «The company holds and reserves the right to change/update/revise these terms at any time with or without any prior notice»; в прочитанной части **нет** пунктов про скрейпинг, API или коммерческое использование; полный текст до конца не прочитан.
- Официального публичного API/цен на сайте не найдено — **нет данных**. Сторонние скрипты (GitHub gist) и Apify-акторы используют недокументированный эндпоинт расширения `https://www.whatruns.com/api/v1/get_site_apps`; это **неофициальный** доступ без явного разрешения → в канал не брать (риск ToS/доступа).

### 3.4 TechnologyChecker.io

- Цены (https://technologychecker.io/pricing — Exa-текст, 2026-10-04): Free **100 lookups/мес** без карты; Pro **89 USD/мес** (890 USD/год) — 10,000 lookups, API, bulk, CRM; Scale **249 USD/мес** (2,490 USD/год) — 50,000+; «Detection breadth does not change as you move up the ladder»; «40,000+ technologies across the 29.9M live domains in our crawl» **[источник заинтересован]**.
- API (https://technologychecker.io/technographic-data-api, сниппет Exa): ключ в `Authorization: Bearer`; «Most endpoints cost one credit, live detection costs five»; stored-lookup кэшируется на 24 часа; «Live detection renders the page in a real browser»; бесплатные `/free`-эндпоинты (компания/домен) — общий бакет 60 запросов в минуту на всех.
- ToS (https://technologychecker.io/terms-of-use, сниппет Exa): лицензия «for your internal business purposes»; запрещены перепродажа/передача данных и создание конкурирующей базы; «You may integrate API data into your internal business applications, CRM systems, and workflows»; запрещено использование контактных данных вразрез с законами о защите данных. Opt-out для владельцев доменов — 48 часов (https://technologychecker.io/docs/features/our-data).
- Собственный бенчмарк точности (https://technologychecker.io/compare/technologychecker-vs-wappalyzer — Exa-текст, обновлено 2026-09-02): выборка 100 технологий, проверка вручную, **precision 86% (95% CI 77.9–91.5) против 64% у Wappalyzer (54.2–72.7)**; сами оговаривают «This measures false positives, not coverage» и «it is our own benchmark» → **[источник заинтересован], независимым доказательством не является.** Там же заявлена «Hybrid: headless browser + multi-signal fingerprinting» и «95%+ overall accuracy» (не подтверждено).
- Что делает вендор на стороне цели: в сравнении упомянуты «headless rendering, HTTP/DNS/TLS analysis, and infrastructure probing»; что именно означает «infrastructure probing» — **нет данных** (возможна активная составляющая).

### 3.5 StackScope (готовый поток запусков со стеком; платный)

Не входил в бриф, найден при поиске данных для оценки доли (раздел 5). Оператор — DATAFREAK LTD (Англия и Уэльс, company no. 17328826) по тексту лицензии.
- Что это: краулер, который берёт запуски из Product Hunt (через API), Show HN и PeerPush, а также «ordinary new web» («StackScope Discovery»), и публикует стек каждого сайта. Методика (https://stackscope.dev/methodology): заголовки, **рендеренный DOM через Playwright**, CSP, cookies, DNS (MX/NS/TXT/CNAME), TLS, RDAP, «well-known files»; собственный каталог fingerprint, «not based on Wappalyzer». Из HN-поста автора (кэш 2026-06-12, зеркало https://bittide.aicompass.dev/article/bea21e96-88c2-48dc-a54b-805e9c4fbc06): «robots.txt is honoured, and the bot identifies itself»; «waiting for verified bot status from Cloudflare and currently that knocks out about 10% of all sites».
- Цены (https://stackscope.dev/data, Exa-текст, 2026-10-04): **Indie £15 ($19) в мес** — 3,000 launches/мес, 1 watch (1 технология + 1 ключевое слово); **Pro £49 ($59)** — 50,000 launches, 5 watches, «published contact details» (role-адреса и страницы контактов, «never a named person»); **Firehose £159 ($199)** — каждый запуск webhook/Slack. Бесплатно: просмотр сайта.
- Лицензия (https://stackscope.dev/data-licence, Exa-текст, «Last updated: 29 September 2026»): «business use only»; можно хранить и использовать данные «inside your own business»; нельзя перепродавать/передавать данные и «No model development» (нельзя обучать/валидировать модели, в т.ч. «a model for scoring, classification or technology detection»); «Do not use the data to break the law, including data protection law and the rules on unsolicited direct marketing»; «A record is an observation made when we crawled a site, usually at launch time. It is not a statement about what that site runs today.»; «Detection is automated and imperfect. We do not warrant that any particular technology attribution is correct.»
- Оценка: вендор молодой (отслеживает с апреля 2026), страницы `/bot`, `/terms`, `/pricing` закрыты JS-проверкой («One quick check») и не прочитаны — **нет данных**; все цифры — **[источник заинтересован]**. Но это единственный найденный источник, который уже считает именно «свежие запуски» (раздел 5).

### 3.6 Открытые движки и базы правил (лицензия, поведение, дефолты)

Все LICENSE/README — raw-файлы публичных репозиториев, curl, 2026-10-04 (REST API GitHub в сессии закрыт).

| Инструмент | Лицензия | Что делает / дефолты (из README) | Заметки |
|---|---|---|---|
| enthec/webappanalyzer | GPL-3.0 | База правил Wappalyzer-формата, 7,628 технологий (мой подсчёт файлов `src/technologies/*.json`); обещание «not to set this repo private» | Свежесть: коммиты до 2026-04-17 по кэшу Exa — на сегодня не подтверждено |
| HTTPArchive/wappalyzer | GPL-3.0 | 4,003 технологии (мой подсчёт); используется ежемесячным краулом HTTP Archive; в Web Almanac 2025: «fork of the last open source version of Wappalyzer (v6.10.65)», 3,984 технологий | Коммиты до 2026-05-08 по кэшу Exa — не подтверждено |
| projectdiscovery/wappalyzergo | MIT | Go-библиотека; «Uses data from enthec/webappanalyzer, HTTPArchive/wappalyzer»; `Fingerprint` использует **только заголовки и тело ответа**; `FingerprintWithRuntime` добавляет JS-свойства/DOM через заранее загруженную вызывающим страницу headless-браузера | Код MIT, а данные правил происходят из GPL-3.0 репозиториев — лицензионная неоднозначность данных [ОЦЕНКА / не юр. консультация] |
| rverton/webanalyze | MIT | Порт Wappalyzer на Go; определения грузит из enthec (`-update`); дефолты: `-crawl 0` (ссылки не обходятся), `-worker 4`, `-search true` (при обходе включает поддомены той же базы); `-header` для своего User-Agent | Режим `-crawl` >0 — обход ссылок (за границей, см. findings) |
| projectdiscovery/httpx | MIT | HTTP-зонд; `-td/-tech-detect` «display technology in use based on wappalyzer dataset»; дефолты: `-threads 50`, `-rate-limit 150` запросов/с, `-timeout 10`, **`-random-agent` включён по умолчанию** (ротация User-Agent — расходится с принципом честного UA); README: «Running it as a service may pose security risks»; флаги `-ports -path -vhost -screenshot -csp-probe -tls-probe -favicon -http2 -pipeline -tls-impersonate` «should be used for specific use cases instead of running them as default with other probes» | Для нашей границы: только `-td` на одном хосте, низкий `-rl`, свой UA; пути/порты/CSP-/TLS-пробы — активные |
| WhatWeb | GPLv2 | 1,800+ плагинов; `--aggression` по умолчанию **1 «Stealthy: Makes one HTTP request per target. Also follows redirects.»**; 3 «Aggressive» — «additional requests will be made»; 4 «Heavy» — «a lot of HTTP requests per target»; потоки по умолчанию 25; User-Agent по умолчанию «WhatWeb/0.6.3» | Дословно README: «Level 3 aggressive plugins will guess more URLs and perform actions that are potentially unsuitable without permission. WhatWeb currently does not support any intrusion/exploit level tests in plugins.» |
| wappalyzer-core / wappalyzer (npm) | в реестре не указана | 7.0.3, 2023-08-23, deprecated | Не использовать |

**Копилефт (не юр. консультация) [ОЦЕНКА]:** GPL-3.0/GPLv2 накладывают обязательства при **распространении** производных работ; чисто внутреннее использование правил в собственном процессе без передачи третьим лицам обычно раскрытия исходников не требует; если правила/движок отдаются клиентам или публикуются — требуется юридическая проверка.

**Чего эти движки не видят:** `wappalyzergo.Fingerprint`/`webanalyze -crawl 0`/`WhatWeb -a 1` анализируют единственный ответ; правила на JS-глобалы и часть DOM-правил срабатывают только в браузерном рантайме (см. 5.3).

### 3.7 Данные без обращения к цели: HTTP Archive и BigQuery

- Источник списка: «The URLs come from the Chrome User Experience Report» (https://httparchive.org/faq); краул стартует во вторник после выхода набора CrUX, дата записи округляется до 1-го числа месяца; каждый URL открывается один раз (холодный кэш) (https://har.fyi/guides/release-cycle/). Объём: июльский краул 2025 — **16,213,084 сайта** (Web Almanac 2025, https://almanac.httparchive.org/en/2025/methodology), тестируется главная + одна вторичная страница; детектор — форк Wappalyzer v6.10.65 «with some extra detections».
- Таблица `httparchive.crawl.pages`, поле `technologies` (массив; детектор Wappalyzer) (https://har.fyi/reference/tables/pages/). Размер: ≈30 TB на месячный снимок (на Oct 2024; https://httparchive.org/docs/guides/getting-started/).
- Стоимость запросов: BigQuery on-demand — «The first 1 TiB of query data processed per month is free»; далее **6.25 USD за TiB** (https://cloud.google.com/bigquery/pricing, выдача Exa 2026-10-04). Предупреждение HTTP Archive: полный скан больших таблиц «can easily eat up your quota».
- Ограничение для нашей задачи: список строится по CrUX (сайты с достаточным реальным Chrome-трафиком) → **только что запущенные продукты представлены слабо** и с лагом ≈ месяц [ОЦЕНКА по описанной методике]; подходит для базовых оценок (base rates), не для поиска свежих лидов.

### 3.8 Кто фактически делает запрос к цели (классификация «пассивности»)

| Способ | Запрос к цели выполняет | Класс |
|---|---|---|
| Wappalyzer API (если домен уже есть в базе) / BuiltWith API / TechnologyChecker stored-lookup / StackScope / HTTP Archive | никто (ответ из базы, собранной ранее) | пассивно относительно цели |
| Wappalyzer `live=true` (+`recursive`) и **автоматический live, если записи о домене нет** (по доке; для только что запущенного сайта это типичный случай), TechnologyChecker live detection | серверы вендора, по нашему запросу (рендер в браузере, при `recursive` — обход ссылок) | запрос третьей стороны от нашего имени — серая зона |
| wappalyzergo/webanalyze `-crawl 0`/httpx `-td`/WhatWeb `-a 1` | мы, один GET главной | пассивно по принципу «браузерной эквивалентности» |
| securityheaders.com, MDN Observatory, SSL Labs | их серверы по нашему инициирующему запросу | сканирование по поручению; не лазейка — отнесено к активному/серому (раздел 4) |

---

## 4. ПУБЛИЧНЫЕ SECURITY-ЧЕКЕРЫ И ГИГИЕНА

### 4.1 securityheaders.com

- Статус API (https://securityheaders.com/api/ — Exa-текст, 2026-10-04): «This service has been discontinued. We are no longer providing new subscriptions or renewing existing subscriptions.» Датировка: «In April 2025, Probely announced that the Security Headers API will discontinued in April 2026» (https://joetiedeman.uk/2026/01/22/snyk-is-shutting-down-the-securityheaders-com-api/, автор — конкурирующий сервис Cybaa, **[источник заинтересован]**); «The free web UI at securityheaders.com is still live» (https://dev.to/guardr/securityheaderscom-api-is-gone-heres-the-migration-4461, 2026-04-24, [источник заинтересован]). Хронология владельцев: Scott Helme → Probely (2023) → Snyk; в блогах «Snyk acquired Probely in June 2025», но **первичный пресс-релиз Snyk датирован 2024-11-12** (https://snyk.io/news/snyk-acquires-developer-first-dast-provider-probely/) — расхождение дат; верить первичке.
- Веб-сканер бесплатный, интерфейс HTML; ToS на странице не найден — **нет данных**; автоматизация веб-интерфейса («scraping») без API — вне разрешённого.
- Статистика на главной (Exa-текст; дата кэша не подтверждена, «Grand Totals» = 396,511,446 проверок): A+ 9,146,628 (2.3%), A 44,100,980 (11.1%), B 19,707,871 (5.0%), C 18,978,482 (4.8%), D 54,190,073 (13.7%), E 9,819,569 (2.5%), F 178,204,943 (**44.9%**), R 62,362,900 (15.7%, редирект). Суммарно **D+E+F ≈ 61.1%**, A/A+ ≈ 13.4% (мой расчёт). Смещение: проверяют сайты те, кто сам решил проверить [ОЦЕНКА] → но вывод «отсутствие большинства заголовков — норма, а не признак слабого бэкенда» устойчив.

### 4.2 MDN HTTP Observatory (бывший Mozilla Observatory)

- Запуск на MDN: 2024-07-02; старый Mozilla Observatory закрыт (v1 API закрыт 2024-10-31) (https://developer.mozilla.org/en-US/observatory/docs/faq ; https://developer.mozilla.org/en-US/blog/mdn-http-observatory-launch). Лицензия кода: **Mozilla Public License 2.0** (README репозитория mdn/mdn-http-observatory).
- API v2: `POST https://observatory-api.mdn.mozilla.net/api/v2/scan?host=<host>`; «The request rate is limited to one scan per host per `api.cooldown` (default: One minute) seconds. If exceeded, a cached result will be returned.»; недоступные/некорректные хосты → `422`; ключ и регистрация в README не упомянуты; в ответе только grade/score/счётчики тестов, полный набор — по ссылке `details_url`.
- ToS/приватность (FAQ дословно): «Anyone can choose to scan any domain, and the scan history for each domain is public. However, HTTP Observatory does not store user data related to each scan.» Отдельной «политики сканирования чужих хостов» в FAQ нет — **нет данных**.
- **Какие запросы реально шлёт сканер** (исходник `src/retriever/retriever.js`, `src/config.js`, `src/retriever/session.js` из ветки main, 2026-10-04): одновременно `GET http://host/` и `GET https://host/` (до 10 редиректов), затем `GET /robots.txt` (для сбора cookies), затем **`OPTIONS` с заголовками `Access-Control-Request-Method: GET` и `Origin: https://http-observatory.security.mozilla.org`** (CORS-preflight). User-Agent по умолчанию: «Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0 Observatory/129.0» (маскируется под Firefox с суффиксом Observatory). Таймаут запроса 10 с. **Вывод:** сканер — не «один GET»; OPTIONS с чужим Origin выходит за «браузерную эквивалентность» → класс **active-light**.
- Тесты: в исходнике 12 (CSP, cookies, COEP, COOP, CORS, redirection, referrer-policy, HSTS, SRI, X-Content-Type-Options, X-Frame-Options, CORP), `ALGORITHM_VERSION = 6`; примеры README/FAQ показывают algorithm_version 4 и 10 тестов — документация отстаёт от кода. Оговорка FAQ: «it does not test for outdated software versions, SQL injection vulnerabilities, vulnerable content management system plugins, improper creation or storage of passwords».
- Все эти заголовки и cookie-флаги присутствуют **в самом ответе на GET главной**, то есть для их чтения внешний сервис не нужен (исключение — тест redirection, которому нужен HTTP-запрос на порт 80).

### 4.3 Qualys SSL Labs

- **ToS v2.2** (https://www.ssllabs.com/downloads/Qualys_SSL_Labs_Terms_of_Use.pdf — Exa-текст, 2026-10-04), дословно:
  - «You are allowed to: (i) use the API only to inspect only sites and servers whose owners have given you permission to do so; (ii) integrate the API with freely-downloadable non-commercial client and server tools and libraries released under an OSI-approved open source license…»
  - «You are not allowed, without our express permission, to: (i) use the API for commercial purposes; (ii) use the API on a public web site; (iii) publish any information received from us via the APIs without the owner's express permission; (iv) distribute, proxy, or otherwise make the API available for access or use by any person or entity other than your authorized employees…»
  - «Using automation to request site assessments and/or extract assessment results from HTML pages (“scraping”) is expressly forbidden.»
  - «If you're using our APIs to automate web site assessments, your IP address information will be forwarded to the tested servers. For example, for HTTP, we embed the IP address in the User-Agent request header.»
- Документация API v4 (https://github.com/ssllabs/ssllabs-scan, `ssllabs-api-docs-v4.md`): «The spirit of the license is that the APIs are made available so that system operators can test their own infrastructure.» «Commercial use is generally not allowed, except with an explicit permission from Qualys.» Регистрация обязательна (имя, организация, организационный email; «We do not allow the use of email services such as Gmail, Yahoo, or Hotmail»); заголовок `email` в каждом запросе; ответы содержат `X-Max-Assessments`/`X-Current-Assessments`; «Server assessments usually take at least 60 seconds. (They are intentionally slow, to avoid harming servers.)»; при превышении — `429`, при перегрузке `529`.
- **Вердикт:** для канала (чужие сайты без разрешения владельцев + коммерческая цель) использование **запрещено по ToS**; кроме того, тест — серия TLS-рукопожатий (активное зондирование). Пассивно доступна лишь информация из сертификата в том же соединении (издатель, срок, SAN).

### 4.4 Платформенные дефолты заголовков (что «слабые заголовки» значат для билдера)

- Vercel: `.vercel.app` — HSTS `max-age=63072000; includeSubDomains; preload` по умолчанию; CSP/X-Frame-Options по умолчанию не ставятся (https://vercel.com/docs/cdn-security/encryption ; https://vercel.com/docs/cdn-security) [ВЖИВУЮ, из раздела 2.5].
- Netlify: HSTS — по актуальной доке через `_headers`/`netlify.toml` и настройки HTTPS (https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/ ; https://docs.netlify.com/manage/routing/headers); ранние упоминания «по умолчанию» — [устарело (до 2025)].
- Наблюдалось на вендорских сайтах (раздел 2.17): у Bubble, Webflow, Framer заголовки безопасности ставит платформа (HSTS, `x-content-type-options`, у Framer `x-frame-options: DENY`) — то есть **отсутствие заголовков у проекта на билдере чаще отражает дефолты платформы, а не «качество бэкенда» владельца** [ОЦЕНКА по 3 вендорским сайтам].
- Отчёт vibewrench (2026-03-17, n=100, методика неизвестна, **[источник заинтересован]**): нет заголовков — Lovable 28%, Bolt 47%, v0 38%, Cursor 24%, всего 34% (см. 2.6).

### 4.5 Что заголовки и TLS показывают, а что нет (без мифов)

- Показывают: наличие HSTS/CSP/XFO/XCTO/Referrer-Policy/COOP/COEP/CORP, флаги cookie, редирект HTTP→HTTPS, издателя и срок сертификата.
- Не показывают: корректность авторизации, RLS/Security Rules, валидацию на сервере, лимиты, устойчивость под нагрузкой, секреты на сервере, качество кода. MDN про свой A+: «there are a lot of security considerations that we can't test».
- Следствие для квалификации: гигиена заголовков — **слабый дискриминатор** (≈61% проверок на securityheaders.com получают D/E/F); использовать только как вторичный признак зрелости, но не как «находку про слабый бэкенд».

---

## 5. НАДЁЖНОСТЬ ПАССИВНОГО FINGERPRINT И [ОЦЕНКА] ДОЛИ БИЛДЕРОВ

### 5.1 Что реально измерено третьей стороной на свежих запусках (StackScope, апрель–июль 2026)

Единственный найденный источник, который публикует долю билдеров именно среди запусков (Product Hunt ≈82–85% выборки, остальное Show HN и PeerPush). **[источник заинтересован]** — продаёт доступ к этим данным (от £15/мес); методика — собственная, не рецензируемая; выборка — сайты, которые удалось скачать и классифицировать. Первичные страницы: https://stackscope.dev/blog/state-of-indie-launches-april-2026 , …-may-2026 , …-june-2026 , …-july-2026 (Exa-тексты, 2026-10-04); https://stackscope.dev/methodology .

| Месяц 2026 | Запусков в выборке | Из них Product Hunt | Доля «named AI-builder» | Состав (доля от всех запусков) |
|---|---|---|---|---|
| апрель | 17,196 | 14,114 (82.1%) | **8.1%** (1,396) | Lovable 4.3% (746), Replit 1.3% (228), Base44 0.8% (134), Bolt 0.5% (92), v0 0.4% (73), Manus 0.3% (53), Emergent 0.2% (26), Cursor 0.1% (23), прочие 0.1% (21) |
| май | 17,652 | 14,913 (84.5%) | **8.5%** | Lovable 4.4% (≈51.9% «именованных»); Replit 239 запусков (≈1.35%), Base44 165 (≈0.93%), Bolt 122 (≈0.69%), v0 76 (≈0.43%) — проценты мои, от 17,652 |
| июнь | 18,130 | 15,393 (84.9%) | **8.6%** | Lovable ≈50.2% «именованных»; сопоставление Bolt «tightened … to remove a few false positives» |
| июль | 19,772 | 16,549 (83.7%) | **7.3%** | Lovable ≈49.4% «именованных»; автор: «a fall could be the market or could be us losing a fingerprint» |

Определение (апрельский отчёт): «1,396 launches (8.1%) contain unambiguous references to a named AI-builder product. They're direct fingerprint hits: distinctive markers that only a specific generator produces.» Отдельно: «Another 19.6% of the cohort scored above 40 on stylistic Vibe Score signals» — это **эвристика «похоже на LLM»**, сам автор методики: «This is a pattern match, not a verdict» (https://stackscope.dev/methodology) → как доказательство не использовать.

Платформенные субдомены (июльский отчёт): 7,013 из 72,923 запусков корпуса (65,910 на своём домене + 7,013 на субдомене; **9.6%**) «ship on a subdomain of the thing that built or hosts them»: vercel.app 2,861 (3.9% корпуса), github.io 1,154 (1.6%), netlify.app 885 (1.2%), **lovable.app 596 (0.82%)**, pages.dev 300 (0.41%), **base44.app 181 (0.25%)**, web.app 180 (0.25%), onrender.com 139 (0.19%) — проценты от корпуса мои. Для таких запусков средний StackScope-score 3.72 против 6.58 на своём домене («Launch Readiness» 67.9 против 87.7). Хостинги (Vercel/Netlify/GitHub Pages/Render) — не билдеры; билдеры из списка — lovable.app и base44.app.

Прочие измеренные там же факты о стеке когорты (по месяцам апрель–июль): Vercel хостит 30.4–33.2% запусков; Next.js ≈34–36%; React ≈35–37%; Tailwind ≈51–58%; HSTS ≈61–62% (https://stackscope.dev/blog/state-of-indie-launches-april-2026 и далее). Для Firebase/Framer страницы вендора (кумулятивно с апреля 2026, на 2026-09-26): Firebase 48,789 запусков, из них через площадки-запуска 4,555 (Product Hunt 3,739); Framer 14,044, через площадки 774 (Product Hunt 649); Lovable 12,369, через площадки 4,054 (Product Hunt 3,535) (https://stackscope.dev/tech/firebase , /tech/framer , /tech/lovable). Знаменатель PH-запусков за весь период у меня не подтверждён → процентов не вывожу; **порядок величины: на PH накоплено сопоставимо Firebase и Lovable, Framer ≈ в 5 раз меньше**. Страницы `/tech/supabase`, `/tech/webflow`, `/tech/bubble` на момент проверки не открылись (CRAWL_UNKNOWN_ERROR) → доля Supabase/Webflow/Bubble среди запусков — **нет данных**.

**Ограничения этих измерений (из их же текстов):**
- ≈10% сайтов недоступны краулеру из-за Cloudflare без статуса verified bot (автор в HN-посте, кэш 2026-06-12).
- Апрельский конвейер: баг DNS-резолвера, терявший ≈15% запросов (исправлен 2026-05-21), и баг wildcard-DKIM (исправлен 2026-05-08); в майском отчёте апрельские значения пересчитаны.
- Число правил менялось: «Tech detection runs against 15,759 fingerprints, up from 5,676 in June» (июльский отчёт); на странице методики — «2308 technology fingerprints with 5803 detection rules» (дата снимка внутри страницы — апрель).
- С 2026-07-08 вендор краулит ещё и «wider web», а с 2026-09-10 индексирует сайты раньше (иногда в день запуска): «Sites found that early often haven't finished setting up, so anything usually added after launch reads lower from that date.» (https://stackscope.dev/tech/lovable) → **доля по маркерам зависит от момента проверки**: чем раньше после запуска, тем меньше маркеров.
- Выборка: фильтруются «major platforms … and marketplace listings», нужен собственный сайт (методика).

### 5.2 Расхождение трекеров как мера ненадёжности fingerprint

| Технология | Значения у разных источников (число сайтов) | Что видно |
|---|---|---|
| Bubble | 283 (wmtips); 2,319 (WebTechSurvey); 8,790 (Ful.io); 9,096 (Aguko, 2026-08-30); 14,169 (PoweredBy); в HTTP Archive пик 3,387 (апрель 2025) | разброс **≈50 раз** (из раздела 2.2) |
| Supabase | 299 (wmtips, 3.8M сайтов, пересчёт 2026-10-03); 317 (Aguko, 2026-09-06); 463 (пик HTTP Archive, июль 2025); 1,112 (PoweredBy); 2,169 (Site Stats Database, 2026-09-01); 19,361 (TechnologyChecker, август 2026; до пересмотра покрытия 5,720); у BuiltWith только по странам Ассамблеи европейских регионов — «all 68,839 current Supabase customers» (сниппет выдачи) | разброс **≈2–3 порядка** |
| Lovable | 301,457 live (BuiltWith); 12,369 запусков за 6 месяцев (StackScope) | разные вселенные и определения |

Пояснения вендоров: TechnologyChecker о Supabase — рост 5,720 → 19,361 «Nothing about Supabase changed to produce that; our coverage of the signals that identify it widened»; «2,977 domains dropped a detection since we began tracking in March 2026, roughly 15% of the current base … Supabase's clearest signals are JavaScript globals that exist only once a page has loaded and executed its client bundle … Treat the drop count as detection flicker» (https://technologychecker.io/technology/supabase). В форке HTTP Archive правило Supabase — только Nuxt-конфиг (раздел 2.6), поэтому «463» — артефакт правила, а не рынка.
**Вывод:** абсолютные счётчики у трекеров несопоставимы; полнота зависит от списка сайтов, набора правил, исполнения JS и даты снимка. Для квалификации использовать **собственную проверку одного сайта**, а не «широкие» базы как доказательство.

### 5.3 Откуда берутся ошибки (сводка по источникам)

**Ложноотрицательные (пропуски):**
- Маркеры убираются: бейдж Lovable скрывается на Pro+ (https://docs.lovable.dev/features/projects/settings), «Made in Bolt» убирается платным планом (https://support.bolt.new/concepts/faq), `*.lovable.app` исчезает при кастомном домене (платные планы), `lovable-tagger` есть только в dev-сборке, мета `generator` v0 редактируется одной правкой.
- JS-глобалы и часть DOM-правил Wappalyzer требуют рантайма; `wappalyzergo.Fingerprint`, `webanalyze` и `WhatWeb -a 1` читают только один ответ.
- Бот-защита: `GET https://lovable.dev/` с нейтральным UA вернул HTTP 403 (Cloudflare challenge; раздел 1.2д); USENIX Security 2024 (Kondracki, Nikiforakis, https://www.usenix.org/conference/usenixsecurity24/presentation/kondracki, **[устарело (до 2025)]**, версия-фингерпринтинг открытых веб-приложений, не билдеров): «being redirected to a CAPTCHA page can completely neutralize any fingerprinting possibility»; точность инструментов в реальных сайтах на **20–80% ниже** лабораторной (Wappalyzer деградировал меньше всех, но «double-digit accuracy decreases»).
- Время: ранний краул видит недозагруженный сайт (см. 5.1).

**Ложноположительные:**
- Неиспользуемый код/остаточные сигнатуры — прямо в ToS BuiltWith (п. 12): «websites include unused technology code; technology signatures remain after removal; indexing delays occur».
- Маркетинг вендора ≠ приложение клиента: `softr.io` (маркетинговый сайт на Webflow) подгружает `assets.softr-files.com` и срабатывает на правило Softr (раздел 2.11).
- Скопированные дефолты: в одном репозитории скопирован `description: 'Created with v0'`, но `generator: 'Supernova Business'` (раздел 2.5).
- Качество правил: единственный найденный бенчмарк точности — собственный у TechnologyChecker (precision 86% против 64% у Wappalyzer на 100 технологиях; **[источник заинтересован]**; сами пишут «measures false positives, not coverage») → оценкой надёжности не пользоваться.

**Гниение правил:** IP Webflow (с 2026-01-13 старые не принимаются), IP Framer (старые закончились 2025-07-01), формат ключей Supabase (legacy `anon`/`service_role` устаревают к концу 2026), расхождение TXT Lovable (`lovable_verify=` в доке против `lovable_verification=` в форке enthec), нестабильность чужих баз правил (5,676 → 15,759 за месяц у StackScope).

### 5.4 [ОЦЕНКА] доля свежих запусков, которые пассивный fingerprint отнесёт к билдеру или «клиент→BaaS»

Все числа ниже, кроме шага A, — **[ОЦЕНКА]**; обоснование — в одной строке на шаг. Это **не измерение на запусках из PH** (запросов к сайтам лидов я не делал).

| Шаг | Что считаем | Значение | Обоснование |
|---|---|---|---|
| A | Именованные AI-билдеры (Lovable, Replit, Base44, Bolt, v0, Manus, Emergent, Cursor) в PH-доминируемой когорте | **7.3–8.6%** (медиана ≈8.3%) | **Измерено** StackScope, апрель–июль 2026, n=17–20 тыс./мес; [источник заинтересован]; нижняя граница (см. 5.1) |
| B | Из шага A убрать Cursor, Manus, Emergent как не «хостящие бэкенд» | −0.6 пп | Cursor 0.13%, Manus 0.31%, Emergent 0.15% по апрельской таблице (мой расчёт); получаем A′ ≈ 6.7–8.0% |
| C | Прибавить классические no-code с ограничениями платформы (Bubble, Softr, Glide, Adalo, FlutterFlow) | +0.5…+2 пп | Данных по PH-когорте нет; в StackScope Framer на PH ≈1/5 Lovable, Webflow/Framer «far less visible»; такие приложения часто за логином и на кастомном домене |
| D | Прибавить «клиент→BaaS» без отпечатка билдера (Supabase/Firebase в публичном бандле) | +3…+8 пп | Firebase на PH сопоставим по числу с Lovable (3,739 против 3,535 с апреля по сентябрь); Supabase — нет данных по запускам; часть BaaS-находок уже посчитана в A (Lovable/Bolt Cloud ведут в Supabase) → беру только неперекрывающуюся долю |
| **Итого, детектируется** | A′ + C + D | **≈10–18%** (центр ≈14%) | практический диапазон для планирования шире: 6–25% (неопределённость шагов C и D велика) |
| Истинная доля использования билдеров | A / полнота | ≈10–17% только по A | при полноте fingerprint 50–75% (см. 5.3: бейдж, домен и ассеты убираются, ≈10% сайтов закрыты ботзащитой); полнота **не измерена** [нет данных] |

**Перевод в штуки в день.** Объём PH: официальный отчёт Product Hunt даёт «2,345 [launches], up from 1,508 in Q2 of 2025» (+55.5%), то есть ≈**25.8 запуска в день**; в комментариях к посту прямо спрашивают «is that featured launches only?» — ответа нет → охват **неясен** (https://www.producthunt.com/p/general/product-hunt-s-state-of-tech-discovery-q2-2026). Косвенно: помесячные числа из анализа leaderboards (anysite: 434 в январе, пик 900 в апреле, 521 в июне; 3,869 за полугодие) по порядку величины согласуются с 2,345 за второй квартал → вероятно, это запуски из лидербордов/featured [ОЦЕНКА]. Выборка StackScope по PH — 14,913 (май), 15,393 (июнь), 16,549 (июль), то есть ≈481, 513, 534 запуска в день (после их фильтров) — на порядок больше. При доле 7.3–8.6%: ≈2 запуска в день из 26 и ≈35–46 из ≈480–534; при 10–18%: ≈2.6–4.7 из 26 и ≈48–96 из ≈480–534. Узкое место канала — не детект билдера, а дальнейшие шаги (оси 4–6).

**Контекст объёма платформ [источник заинтересован]:** Lovable заявляет ≈1 млн новых проектов в неделю и 60+ млн всего (по пересказу https://inferya.com/guides/how-many-apps-built-with-vibe-coding/ со ссылкой на Series C от 2026-08-12 и TechCrunch 2026-06-09); «проект» ≠ запуск: «A project counter increments when someone types a prompt» (тот же источник). Для оценки доли среди PH-запусков эти цифры не используются.

### 5.5 Как измерить долю и полноту самим (чтобы заменить [ОЦЕНКА] измерением)

Доверительные интервалы Уилсона 95% (мой расчёт) для наблюдаемой доли p при размере пилотной выборки n:

| n | при p=8% | при p=12% | при p=20% |
|---|---|---|---|
| 50 | 3.2–18.8% | 5.6–23.8% | 11.2–33.0% |
| 100 | 4.1–15.0% | 7.0–19.8% | 13.3–28.9% |
| 200 | 5.0–12.6% | 8.2–17.2% | 15.0–26.1% |
| 400 | 5.7–11.1% | 9.2–15.6% | 16.4–24.2% |
| 1000 | 6.5–9.8% | 10.1–14.2% | 17.6–22.6% |

Практический вывод: выборка n≈200 даёт половину-ширину интервала ≈4–5 пп; n=50 — ≈8–11 пп (почти ничего не различает между 8% и 20%). **Полноту (recall)** без эталона не измерить: возможный эталон для Lovable — публичный каталог `launched.lovable.dev` («over 4,000 applications built with Lovable are publicly listed» — Escape.tech, [источник заинтересован]): доля сайтов каталога, у которых срабатывает хотя бы один пассивный маркер; я этого не измерял (запросов к чужим сайтам не делал) — **нет данных**.

### 5.6 Связь с «слабым бэкендом»: что пассивно НЕ доказывается

Распространённость проблем RLS/доступа получена **только активными методами исследователей** (см. 1.2г, 2.6): Matt Palmer — 170 из 1,645 проектов Lovable ≈10.3% с неадекватным RLS (весна 2025); vibewrench (2026-03-17, n=100, **[источник заинтересован]**) — RLS отключён у Lovable 28% (n=29), Bolt 13% (n=30), v0 19% (n=16), всего 14%; Escape.tech (2025-10-29, **[источник заинтересован]**) — «nearly 60%» из 5,600+ приложений с критическими уязвимостями; CVE-2025-48757 (CVSS 3.1 = 9.3, оспаривается вендором). **[ОЦЕНКА]**: среди пассивно найденных «клиент→Supabase» проектов доля с реальной проблемой RLS ≈10–30% (диапазон из выборок выше; смещённые и малые), но **пассивно её подтвердить нельзя**. Следовательно доказуемая «находка» для письма — архитектурный факт («браузер ходит в БД напрямую; защита держится на RLS-политиках; мы их не проверяли»), а не уязвимость.

---

## 6. ЖУРНАЛ ИСТОЧНИКОВ ДЛЯ РАЗДЕЛОВ 3–5 (проверено 2026-10-04, UTC)

**Wappalyzer:** https://www.wappalyzer.com/pricing/ (Exa + WebFetch) · https://www.wappalyzer.com/docs/api/v2/lookup/ (Exa) · https://www.wappalyzer.com/terms/ (Exa) · https://registry.npmjs.org/wappalyzer-core и /wappalyzer (curl) · README форков HTTPArchive/wappalyzer и enthec/webappanalyzer (raw).
**BuiltWith:** https://builtwith.com/terms (Exa, «Last Updated: 6th March 2026») · https://builtwith.com/plans , https://api.builtwith.com/ , /free-api , /domain-api , https://builtwith.com/all-products (WebFetch-выжимки) · https://api.builtwith.com/agent-payment-api , https://leadseye.builtwith.com/credits (Exa) · https://trends.builtwith.com/websitebuilder/Webflow , /Framer-Sites , /Lovable (WebFetch).
**WhatRuns:** https://www.whatruns.com/ , https://www.whatruns.com/terms (Exa, частично); неофициальные клиенты: https://gist.github.com/faroucksc/7dddb4bb8f4a786aacd1e1f7d90303c7 , https://apify.com/canadesk/whatruns (упомянуты, не использованы).
**TechnologyChecker:** https://technologychecker.io/pricing , /compare/technologychecker-vs-wappalyzer , /docs/features/comparison , /terms-of-use , /technographic-data-api , /technology/supabase , /docs/features/our-data (Exa).
**StackScope:** https://stackscope.dev/blog/state-of-indie-launches-april-2026 , …-may-2026 , …-june-2026 , …-july-2026 · https://stackscope.dev/methodology · https://stackscope.dev/data · https://stackscope.dev/data-licence · https://stackscope.dev/tech/lovable , /tech/framer , /tech/firebase · https://www.producthunt.com/products/stackscope-dev · HN-пост автора (зеркало) https://bittide.aicompass.dev/article/bea21e96-88c2-48dc-a54b-805e9c4fbc06 (Exa).
**Открытые инструменты:** репозитории github.com/projectdiscovery/httpx , projectdiscovery/wappalyzergo , rverton/webanalyze , urbanadventurer/whatweb , enthec/webappanalyzer , HTTPArchive/wappalyzer — LICENSE и README (raw, curl).
**HTTP Archive и BigQuery:** https://httparchive.org/faq · https://har.fyi/guides/release-cycle/ · https://har.fyi/reference/tables/pages/ · https://har.fyi/reference/structs/technology/ · https://httparchive.org/docs/guides/getting-started/ · https://almanac.httparchive.org/en/2025/methodology · https://cloud.google.com/bigquery/pricing (выдача Exa).
**Security-чекеры:** https://securityheaders.com/ , https://securityheaders.com/api/ (Exa) · https://joetiedeman.uk/2026/01/22/snyk-is-shutting-down-the-securityheaders-com-api/ · https://dev.to/guardr/securityheaderscom-api-is-gone-heres-the-migration-4461 · https://snyk.io/news/snyk-acquires-developer-first-dast-provider-probely/ · https://developer.mozilla.org/en-US/observatory/docs/faq · https://developer.mozilla.org/en-US/blog/mdn-http-observatory-launch · github.com/mdn/mdn-http-observatory (README, `src/retriever/retriever.js`, `src/config.js`, `src/retriever/session.js`, `src/constants.js`, `src/scanner/index.js`; raw) · https://www.ssllabs.com/downloads/Qualys_SSL_Labs_Terms_of_Use.pdf (Exa) · github.com/ssllabs/ssllabs-scan (README, `ssllabs-api-docs-v4.md`).
**Объёмы и доли запусков:** https://www.producthunt.com/p/general/product-hunt-s-state-of-tech-discovery-q2-2026 · https://anysite.io/blog/who-actually-launched-on-product-hunt-in-2026/ (3,869 запусков за 1 полугодие 2026, «49% of launches are AI», Exa) · https://www.findsimilarstartups.com/en/blog/product-hunt-weekly-launch-analysis-2026-w19 (3,913 запусков за неделю 4–10 мая 2026) · https://asanchez.dev/blog/ais-real-impact-on-software-launches-evidence-from-product-hunt/ (267k запусков, AI-доля ≈38.4% в последнем месяце, [сниппет]) · https://inferya.com/guides/how-many-apps-built-with-vibe-coding/ ([источник заинтересован]) .
**Академический контекст:** https://www.usenix.org/conference/usenixsecurity24/presentation/kondracki ([устарело (до 2025)]).

---

## 7. ПРОБЕЛЫ, «НЕТ ДАННЫХ» И ПОПРАВКИ К БРИФУ

**Поправки к брифу (важно для проектирования):**
1. `lovable-tagger` — **не признак продакшн-сайта**: в шаблоне подключается только `mode === 'development'`; виден в публичном репозитории (`package.json`) или dev-сборке. Для продакшна надёжнее `*.lovable.app`, бейдж «Edit with Lovable», дефолтные OG-мета, `/lovable-uploads/`.
2. `gpteng.co` — устаревший скрипт эпохи GPT Engineer (`cdn.gpteng.co/gptengineer.js`); актуальность в 2026 — нет данных.
3. `supabase.in` — **не подтверждён**: во всех источниках фигурирует только `supabase.co` (региональные блокировки в Индии — блог Supabase, февраль 2026).
4. `securityheaders.com` API **прекращён** (страница API: «discontinued»; по сторонним источникам — апрель 2026); остался бесплатный веб-сканер.
5. SSL Labs API по ToS v2.2 **нельзя** использовать для чужих сайтов без разрешения владельцев и в коммерческих целях.
6. Wappalyzer: код закрыт с 2023-08; lookup-API требует план **Business ($450/мес)**; `wappalyzer-core` на npm не поддерживается с 2023-08-23.
7. Публичный ключ Supabase (`anon`/`sb_publishable_…`) и `firebaseConfig.apiKey` — публичны **по дизайну**; это не уязвимость сам по себе (раздел 2.6–2.7). Legacy-ключи Supabase устаревают к концу 2026.
8. Домены/IP билдеров меняются (Webflow, Framer) и значение TXT-проверки Lovable расходится между докой и форком — правила нужно периодически перепроверять.
9. `x-bubble-capacity-*` — не индикатор «упёрся в лимит» (раздел 2.2).
10. Для Bolt, v0, Glide, FlutterFlow готовых правил в открытых форках Wappalyzer нет.

**«Нет данных» (искал, не нашёл или не проверял):**
- Полнота (recall) пассивных маркеров билдеров на реальных запусках — не измерена ни мной, ни найденными источниками.
- Доля Supabase, Webflow, Bubble и классических no-code среди PH-запусков (страницы StackScope не открылись); доля PH-запусков с BaaS без отпечатка билдера.
- Охват «2,345 launches» в отчёте Product Hunt (featured или все) — вопрос в комментариях без ответа.
- Полный текст ToS WhatRuns и политика автоматизации; ToS страниц StackScope `/terms` и `/bot` (закрыты JS-проверкой).
- Rate limit Domain API BuiltWith; различие месячной и годовой цены планов BuiltWith.
- Что означает «infrastructure probing» у TechnologyChecker.
- Формат дефолтного адреса веб-приложения Adalo; значения DNS Carrd; HTML-маркеры Glide.
- Право других юрисдикций (UK Computer Misuse Act, директива ЕС 2013/40/EU) — не проверялось.
- Фактическая точность правил на сайтах-лидах: запросов к сайтам лидов в этой оси не делалось.
- Свежесть коммитов в форках Wappalyzer на сегодня (API GitHub закрыт; данные — кэш Exa).
- Стоимость и условия коммерческого использования данных HTTP Archive помимо тарифа BigQuery.
