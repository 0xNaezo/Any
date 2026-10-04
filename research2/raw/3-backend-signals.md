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

