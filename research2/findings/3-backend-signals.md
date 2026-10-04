# Ось 3 — Детект слабого бэкенда по публичным признакам (FINDINGS)

> Дата прогона: **2026-10-04** (UTC). Статус: **done**. Полный дамп с цитатами, URL и живыми проверками — `research2/raw/3-backend-signals.md` (номера разделов в скобках ниже — оттуда).
> Рамка: только **пассивные, публично наблюдаемые** признаки («на чём построено» + публичная гигиена заголовков). Не взлом и не аудит. Не юридическая консультация.
> Пометки: **[ВЖИВУЮ]** — проверено 2026-10-04 по первичному источнику; **[ОЦЕНКА]** — мой вывод с обоснованием; **[источник заинтересован]** — цифра вендора/продавца; **[устарело (до 2025)]**; «нет данных» — искал, не нашёл.

## TL;DR

1. **Пассивно определяется архитектура, а не дыра.** Видно билдер, хостинг и факт «браузер напрямую ходит в BaaS» (Supabase/Firebase). Состояние RLS/Security Rules, серверная валидация, лимиты, секреты на сервере пассивно **не проверяются** — любая такая проверка требует запроса к API цели, то есть активного зондирования.
2. **Самые надёжные маркеры:** платформенный домен по умолчанию (`*.lovable.app`, `*.bubbleapps.io`, `*.replit.app`, `*.bolt.host`, `*.base44.app`, `*.glide.page`, `*.flutterflow.app`, `*.softr.app`), платформенные заголовки (Bubble `x-bubble-*`, Framer `server: Framer/…`), `meta generator` (Webflow, Framer, v0), бейджи (Lovable «Edit with Lovable», Bolt «Made in Bolt»), адрес проекта BaaS в публичном бандле (`<ref>.supabase.co`, `firebaseConfig`). Все они **убираются** на платных планах и кастомных доменах.
3. **Поправки к брифу:** `lovable-tagger` — только dev-сборка, не признак продакшна; `supabase.in` — не подтверждён (везде только `supabase.co`); API securityheaders.com закрыт; SSL Labs запрещён ToS для чужих сайтов и коммерции; `wappalyzer-core` на npm заброшен (2023-08-23).
4. **Публичный ключ Supabase (`anon`/`sb_publishable_…`) и `firebaseConfig.apiKey` публичны по дизайну** — это не уязвимость. Дыра = выключенный RLS/«Test mode» правил, чего пассивно не видно. Исключение: секретный ключ (`service_role`, `sb_secret_…`) в публичном бандле — утечка; **использовать нельзя**.
5. **Доля свежих запусков с билдером [ОЦЕНКА + измерение третьей стороной]:** по замеру StackScope (апрель–июль 2026, 17–20 тыс. запусков в месяц, ≈83% с Product Hunt) **7.3–8.6%** несут отпечаток именованного AI-билдера (Lovable ≈ половина); с классическим no-code и «клиент→BaaS» без билдера **≈10–18%** [ОЦЕНКА]; это ≈2–5 запусков в день из ≈26 (официальный счёт PH) — **узкое место не детект, а следующие шаги воронки**.
6. **Надёжность fingerprint:** точность жёстких маркеров высока, **полнота не измерена**; трекеры расходятся на 2–3 порядка (Supabase: от ≈300 до ≈19,000 и выше); правила гниют (IP Webflow и Framer, формат ключей Supabase); ≈10% сайтов закрыты ботзащитой. Практика: для уровня «высокая» нужны ≥2 независимых класса сигналов.
7. **Инструменты:** бесплатно и достаточно — открытые движки на одном ответе (wappalyzergo, httpx `-td`, WhatWeb `-a 1`) с правилами enthec (GPL-3.0). Платно: Wappalyzer lookup-API только с планом Business ($450/мес), BuiltWith ($99 за 2,000 кредитов), TechnologyChecker ($89 за 10,000), StackScope (£15 за 3,000 запусков). Security-чекеры: SSL Labs — нельзя; securityheaders — API нет; Observatory — «active-light» (шлёт OPTIONS с чужим Origin).
8. **Граница:** один `GET /` с подресурсами из HTML + DNS + сертификат + публичные базы третьих лиц — допустимо; перебор путей, вызовы найденных API (даже с публичным ключом), CORS-пробы, обход ботзащиты, использование найденных секретов — недопустимо. В письме формулировать как архитектурное наблюдение, не как «ваша база открыта».

---

## 1. Билдеры: признак детекта → что говорит о бэкенде → надёжность

Шкала надёжности: **Высокая** — несколько независимых жёстких маркеров, подтверждены вживую; **Средняя** — один-два маркера или доменный признак; **Низкая** — маркеры легко убрать или правил нет. Релевантность для гипотезы «слабый бэкенд» указана отдельно.

| Билдер | Публичный признак детекта | Что это говорит о бэкенде | Надёжность |
|---|---|---|---|
| Lovable | Хост `*.lovable.app` (кастомный домен — на платных планах; тогда A `185.158.133.1` и TXT `_lovable` со значением `lovable_verify=`); бейдж «Edit with Lovable» (`#lovable-badge`, скрывается на Pro и выше); дефолтные мета `og:image` `lovable.dev/opengraph-image…` и `@lovable_dev`; ассеты `/lovable-uploads/`; legacy-скрипт `cdn.gpteng.co/gptengineer.js`. **Не признак продакшна:** `lovable-tagger` (только dev-сборка) | Фронт Vite+React; Lovable Cloud (БД, auth, storage, функции) «utilizes Supabase's open-source foundation» → браузер ходит в `*.supabase.co` напрямую, доступ держится на RLS-политиках; своего серверного слоя по умолчанию нет | **Высокая** при ≥2 маркерах; полнота средняя (бейдж и домен убираются) |
| Bubble | Заголовки `x-bubble-capacity-limit`, `x-bubble-capacity-used`, `x-bubble-perf`, `x-powered-by: Express`; JS `_bubble_page_load_data`, `bubble_environment`; ассеты `cdn.bubble.io`; хост `*.bubbleapps.io` (dev-ветка `/version-test/`). IP кастомного домена неспецифичны (Cloudflare) | Приложение и БД живут на серверах Bubble: слабость — лимиты платформы (workload units), экспорт данных, кастомная логика; это **не** «браузер→БД». `x-bubble-capacity-*` — не индикатор «упёрся в лимит» | **Высокая** для заголовков (подтверждено на bubble.io); на клиентских сайтах не измерено |
| Replit | Хост `*.replit.app` (деплой) и `*.replit.dev` (dev-URL, публичный по умолчанию); кастомный домен: A-запись и TXT `replit-verify=`; заголовок `replit-cluster` (в форках, для 2026 не подтверждён) | У Agent-приложений есть серверный бэкенд (Autoscale или Reserved VM) и встроенный PostgreSQL с `DATABASE_URL` на сервере. Слабость — качество сгенерированного монолита, секреты, масштабирование; иная гипотеза, чем у Lovable | **Высокая** по домену; **низкая** при кастомном домене |
| Bolt (StackBlitz) | Хост `*.bolt.host` (free: 10 GB трафика и 333,333 запросов в месяц), бейдж «Made in Bolt» (убирается платным планом), деплой на Netlify (`*.netlify.app`, `Server: Netlify`). Правил в форках Wappalyzer нет | Статический фронт + Bolt Cloud на Supabase («every project in Bolt Cloud that needs a backend is powered by Supabase») → как у Lovable: клиент→Supabase | **Низкая–средняя**; при кастомном домене остаётся только факт Supabase |
| v0 (Vercel) | `<meta name="generator" content="v0.dev">` (позже `v0.app`), «Created with v0» (дефолт `metadata` Next.js), `*.vercel.app`, заголовки Vercel (`server: Vercel`, `x-vercel-id`). Правил в форках нет | Next.js (серверные компоненты и route handlers) на Vercel + внешние сервисы; какие именно — по `supabase.co`/`firebase*` в бандле. Сам по себе неотличим от любого Next.js на Vercel | **Низкая** (мета правится одной строкой); при наличии `generator: v0.*` — точность высокая, полнота низкая |
| Base44 и др. AI-билдеры | Base44: `*.base44.app`, CNAME кастомного домена на `base44.onrender.com`, `meta apple-mobile-web-app-title=base44`; Emergent: `assets.emergent.sh`; Hostinger Horizons: `X-Powered-By` и `meta generator` «Hostinger Horizons» | Base44 — собственный BaaS (данные, auth, backend-функции); у остальных — по докам платформ | **Средняя–высокая** по домену и заголовкам (по определениям форка enthec и докам Base44) |
| Supabase (как признак BaaS) | В публичном бандле или сетевых запросах `https://<20 символов>.supabase.co`; ключи: legacy JWT (начало `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIs`, роль `anon`) или `sb_publishable_…`; кастомный домен API — CNAME на `<ref>.supabase.co` | Браузер ходит в Postgres через PostgREST, Auth, Storage, Functions без собственного серверного слоя; авторизация живёт в RLS-политиках и функциях БД. Подробно — раздел 2 | **Высокая** для факта использования; состояние RLS пассивно не определяется. Форк HTTP Archive прямой URL не ловит |
| Firebase | Объект `firebaseConfig` (apiKey `AIza…`, `authDomain` `<id>.firebaseapp.com`, `projectId`…); хосты `PROJECT_ID.web.app`, `*.firebaseapp.com`, `*-default-rtdb.firebaseio.com`, `*.appspot.com`; заголовок `vary: x-fh-requested-host` (Hosting) | Клиент→BaaS напрямую; защита — Security Rules и App Check; видимый `apiKey` не секрет. Раздел 2 | **Высокая** для факта использования; Rules пассивно не видны |
| Webflow | `meta generator=Webflow`, атрибуты `data-wf-site`, `data-wf-page`, `data-wf-domain`, ресурсы `cdn.prod.website-files.com`, хост `*.webflow.io`; заголовки `x-wf-region`, `x-wf-page-id` (наблюдались на сайте вендора). DNS: A `198.202.211.1`, CNAME `cdn.webflow.com`; старые IP с 2026-01-13 не принимаются | Маркетинговый сайт или CMS без прикладного бэкенда; прикладное, если есть, — внешнее (Xano, Wized) | **Высокая**; релевантность для «слабого бэкенда» низкая |
| Framer | `server: Framer/<hash>`, `meta generator="Framer <hash>"`, ресурсы `framerusercontent.com`, хосты `framer.app`, `framer.website`. DNS: A `31.43.160.6` и `31.43.161.6`; старые IP закончились 2025-07-01 | Статический сайт или CMS без прикладного бэкенда | **Высокая**; релевантность низкая |
| Carrd | Хост `*.carrd.co` (Pro: `*.crd.co`), слабые правила Wappalyzer; DNS-значения — нет данных | Одностраничник, формы на Pro; прикладного бэкенда нет | **Низкая–средняя**; релевантность низкая |
| Softr | Хост `*.softr.app` (прежний `*.softr.io`), ассеты `softr-files.com` и `softr-prod.imgix.net`, A `35.158.87.123`. Ложное срабатывание: маркетинговый `softr.io` (собран на Webflow) грузит `softr-files.com` | Конструктор фронта над внешней БД (Airtable, Google Sheets; Supabase — на Professional и выше через Postgres-подключение): слабость — лимиты внешней БД и отсутствие кастомной логики | **Средняя** |
| Glide | Хост `*.glide.page` (прежний `*.glideapp.io`); HTML-маркеров и правил в форках нет | Данные Glide (Tables, Sheets) и workflows платформы | **Средняя** по домену; **низкая** на кастомном |
| Adalo | `assets.adalo.com`, `link[href*='.adalo.com/static/']`; кастомные домены — только поддомены | Собственная БД Adalo | **Средняя** |
| FlutterFlow | Хост `*.flutterflow.app`, водяной знак «Built in FlutterFlow» (снимается на платных); Flutter web: `flutterCanvasKit`, `_flutter.loader`, `main.dart.js`, `meta id="flutterweb-theme"`. Правил FlutterFlow в форках нет | Ориентирован на Firebase (Auth, Storage, функции); иные бэкенды — вне доки публикации | **Высокая** по дефолт-домену или знаку; иначе неотличим от любого Flutter-приложения |

Примечания: (1) AI-ассистенты кода (Cursor, Claude Code, Copilot) платформенных маркеров не оставляют; «vibe»-эвристики вроде Vibe Score StackScope — автор сам называет «pattern match, not a verdict» → как доказательство не использовать. (2) Правила в открытых форках Wappalyzer есть для Bubble, Lovable, Replit, Supabase, Firebase, Webflow, Framer, Carrd, Softr, Base44, Adalo (enthec); **нет** для Bolt, v0, Glide, FlutterFlow — нужны свои правила по доменам и дефолтам. (3) Подробности, живые проверки на сайтах вендоров и цитаты — raw, разделы 2.1–2.17.

---

## 2. Supabase и Firebase без мифов

**Что это такое [ВЖИВУЮ].**
- Supabase, публикуемый ключ: «Safe to expose online: web page, mobile or desktop app, GitHub actions, CLIs, source code.» «Row Level Security decides what this client can reach, so enable it on every table before you deploy.» «Danger: A secret key bypasses every Row Level Security policy you have. Never put one in a browser, a shipped application, or source control.» (https://supabase.com/docs/guides/api/api-keys). Форматы: legacy `anon`/`service_role` (JWT) и новые `sb_publishable_…`/`sb_secret_…`; «Supabase is deprecating the `anon` and `service_role` keys by the end of 2026» → правила детекта обязаны понимать оба формата.
- Wiz о Moltbook: «The discovery of these credentials does not automatically indicate a security failure, as Supabase is designed to operate with certain keys exposed to the client - the real danger lies in the configuration of the backend they point to.» «When properly configured with Row Level Security (RLS), the public API key is safe to expose - it acts like a project identifier.»
- Firebase: «API keys for Firebase services are not used to control access to backend resources; that can only be done with Firebase Security Rules (to control which end users can access resources) and Firebase App Check (to control which apps can access resources).» (https://firebase.google.com/docs/projects/api-keys). Правила в «Test mode (grant access to all users)»: «NEVER use this ruleset in production; it allows anyone to overwrite your entire database.» (https://firebase.google.com/docs/rules/insecure-rules).

**Что видимый ключ или URL в бандле означает на самом деле.**
1. Это **архитектурный факт**: у проекта нет собственного серверного слоя между браузером и БД; логика доступа живёт в RLS-политиках (Supabase) или Security Rules (Firebase). Для гипотезы канала — кандидат на «довести бэкенд до продакшена» (серверная валидация, платежные вебхуки, лимиты, аудит политик).
2. Это **не** доказательство дыры и не «утечка ключа». Дыра возникает при выключенном RLS, слишком широких политиках или грантах, публичных бакетах Storage, функциях без проверки токена, правилах Firebase в «Test mode», секретном ключе в клиенте — **всё это пассивно не проверяется**.
3. **Исключение, видимое пассивно:** в публичном бандле JWT с `"role":"service_role"` или строка `sb_secret_…`. Локальное декодирование уже опубликованной строки допустимо; **использование** ключа и любые запросы с ним — недопустимы. Фиксировать факт; раскрытие владельцу — отдельный процесс вне этой оси.
4. Распространённость проблем RLS известна только из **активных** исследований: CVE-2025-48757 (запись CVE: «insufficient database Row-Level Security policy in Lovable through 2025-04-15…», CVSS 9.3, оспаривается вендором); Matt Palmer — 170 из 1,645 проектов Lovable (≈10.3%) с неадекватным RLS (весна 2025); vibewrench (2026-03, n=100, **[источник заинтересован]**) — RLS выключен у Lovable 28% (n=29), Bolt 13% (n=30), v0 19% (n=16); Escape.tech (2025-10, **[источник заинтересован]**) — «nearly 60%» из 5,600+ приложений с критическими уязвимостями. Эти методы — за границей нашего канала (раздел 4).

---

## 3. Инструменты детекта и security-чекеры

Цены и лимиты сняты со страниц вендоров **2026-10-04**. Цифры о собственных возможностях вендоров — **[источник заинтересован]**. Подробности, цитаты ToS, дословные дефолты — raw, разделы 3–4.

| Инструмент | Бесплатно / цена | API-лимит | Лицензия / ToS-риск | Вердикт |
|---|---|---|---|---|
| Wappalyzer (SaaS) | Free: 50 lookups в месяц (по выжимке WebFetch). Pro $250 в месяц, **Business $450** ($373.50 при годовой оплате), Enterprise от $850 | 10 запросов в секунду, до 10 URL в запросе; 1 кредит на URL, **5 при live+recursive**; 20,000 кредитов на Business, сгорают через 60 дней; **lookup-API только с Business** | Код закрыт с 08.2023. ToS (право Австралии): нельзя перепродавать, публиковать, встраивать данные в клиентский продукт; обход лимитов запрещён; доступ только документированными способами. Риск низкий для внутреннего использования | Платный, ≈$22.5 за 1,000 URL. Для 2–5 писем в день не окупается; смысл только при скрининге всех запусков. При `live=true` и для домена, которого нет в базе, краулинг цели делают серверы вендора |
| BuiltWith | Free API отдаёт только счётчики групп и категорий. Планы: Basic $295, Pro $495, Team $995 в месяц; API-кредиты **$99 за 2,000** (≈$0.05 за домен; неудачный запрос не списывает) | Free API: 1 запрос в секунду; Domain API: 16 доменов в запросе (64 в high-throughput); лимиты Domain API — нет данных | ToS от 2026-03-06: только внутренние бизнес-цели; API только лицензированным клиентам; запрет перепродажи, конкурирующей базы, обхода лимитов; нельзя использовать для спама; индемнити за незаконный outreach; право Австралии | Дорого относительно открытых движков; свежесть для новых сайтов — нет данных. Полезен для исторических трендов |
| WhatRuns | Расширение бесплатно (заявлено 450k+ пользователей) | Официального API нет [нет данных]; неофициальный эндпоинт расширения используют сторонние скрипты | ToS (Owned it Limited): в прочитанной части про автоматизацию ничего; неофициальный API — риск | Только ручная проверка; в канал не брать |
| TechnologyChecker | Free 100 lookups в месяц; Pro **$89** за 10,000; Scale $249 за 50,000+ | 1 кредит на stored lookup (кэш 24 ч), 5 на live; бесплатные `/free`-эндпоинты — общий бакет 60 запросов в минуту | ToS: внутренние бизнес-цели, без перепродажи и конкурирующей базы. Бенчмарк «86% против 64% у Wappalyzer» (n=100, только precision) — собственный, **[источник заинтересован]**; смысл «infrastructure probing» — нет данных | Самый дешёвый API (≈$8.9 за 1,000 при полной квоте Pro); вендор молодой, независимой проверки точности нет |
| StackScope | Просмотр бесплатно; Indie **£15** ($19) в месяц — 3,000 запусков; Pro £49 ($59) — 50,000 и контактные страницы сайтов; Firehose £159 ($199) | Квоты по числу запусков в месяц; запросы не метрируются | Data licence (2026-09-29): business use only; нельзя перепродавать и обучать модели; «Do not use the data to break the law, including data protection law and the rules on unsolicited direct marketing»; детекция «automated and imperfect». Вендор с апреля 2026; `/terms`, `/bot` не открылись | Единственный найденный готовый поток «свежие запуски + стек» без запросов к целям; кандидат как платный вариант, но молодой и **[источник заинтересован]** |
| enthec/webappanalyzer | Бесплатно (база правил, 7,628 технологий) | Нет (данные) | GPL-3.0: копилефт при распространении; внутреннее использование обычно без раскрытия [ОЦЕНКА] | Лучшая свободная база правил; нет Bolt, v0, Glide, FlutterFlow; TXT-правило Lovable расходится с докой |
| HTTPArchive/wappalyzer | Бесплатно (4,003 технологии) | Нет | GPL-3.0 | Справочник; для Supabase только Nuxt-конфиг — прямой `*.supabase.co` не ловит |
| projectdiscovery/wappalyzergo | Бесплатно | Задаёт вызывающий | MIT-код, но данные правил из GPL-репозиториев — уточнить при распространении | Годный движок для одного ответа (заголовки и тело); runtime-режим требует собственного headless |
| rverton/webanalyze | Бесплатно | По умолчанию `-crawl 0`, 4 воркера | MIT; правила из enthec | Допустим только с `-crawl 0`; обход ссылок — за границей |
| projectdiscovery/httpx | Бесплатно | По умолчанию 50 потоков и **150 запросов в секунду**; `-random-agent` включён | MIT; README: запуск как сервис рискован | Допустим только `-td` на одном хосте с низким `-rl` и честным User-Agent; `-path`, `-ports`, `-vhost`, `-csp-probe`, `-tls-probe` — активные |
| WhatWeb | Бесплатно | 25 потоков; агрессия 1 = один запрос | GPLv2; уровни 3–4 «potentially unsuitable without permission» (README) | Допустим только `-a 1`; уровни 3 и 4 — недопустимо |
| wappalyzer-core, wappalyzer (npm) | Бесплатно, но мертво | — | 7.0.3 от 2023-08-23, deprecated, лицензия в реестре не указана | **Не использовать** |
| HTTP Archive + BigQuery | Данные бесплатно; запросы: первый 1 TiB в месяц бесплатно, далее $6.25 за TiB | `crawl.pages` ≈30 TB на месячный снимок — запросы нужно сужать | Публичный набор; запросов к целям нет | Для base rates и проверки правил; для свежих лидов не годится (список из CrUX, лаг ≈ месяц) |
| securityheaders.com | Веб-сканер бесплатный; **API закрыт** (по сторонним источникам — апрель 2026) | API нет | ToS не найден [нет данных]; автоматизация интерфейса = скрейпинг | В пайплайн не брать; гигиену заголовков читать из ответа на одном GET |
| MDN HTTP Observatory | Бесплатно; код MPL-2.0 | 1 скан на хост в 60 с, иначе кэш; `POST /api/v2/scan?host=` | История сканов публична; сканер шлёт GET http, GET https, GET `/robots.txt` и **OPTIONS с чужим Origin** → «active-light»; User-Agent маскируется под Firefox | Опционально и вручную для единичных случаев; в пайплайн по умолчанию не включать |
| Qualys SSL Labs | Бесплатно; API v4 с регистрацией (корпоративный email) | Оценка ≥60 с; 429 при превышении | **ToS v2.2:** API только для сайтов, владельцы которых дали разрешение; коммерческое использование без разрешения запрещено; IP клиента передаётся цели; scraping запрещён | **ЗАПРЕЩЕНО для канала** |

Что даёт гигиена заголовков: наличие HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, COOP/COEP/CORP, флагов cookie; чего не даёт — авторизацию, RLS, валидацию, лимиты, качество кода. Все эти заголовки есть в самом ответе на `GET /`; внешний сервис не нужен. **Слабый дискриминатор:** по статистике securityheaders.com (≈396.5 млн проверок) 44.9% получают F, D+E+F ≈ 61%, A и A+ ≈ 13%; у проектов на билдерах заголовки часто ставит платформа (Vercel — HSTS по умолчанию; Framer — `x-frame-options: DENY`) → отсутствие заголовков отражает дефолты платформы, а не качество бэкенда [ОЦЕНКА].

---

## 4. ГРАНИЦА легального (пассивное) vs недопустимого (активное зондирование)

### 4.1 Определение и тест

**Пассивная классификация** = то, что обычный посетитель/браузер получает при открытии сайта, плюс публичные записи DNS, сертификат из того же TLS-соединения и публичные базы третьих лиц. **Тест для любого действия:** (а) сделал бы это обычный браузер при открытии главной страницы? (б) обращаюсь ли я хоть к одному адресу, которого нет в HTML, DNS или самом ответе? Если «нет» на (а) или «да» на (б) — это уже не пассивно.

### 4.2 Обязательные правила поведения

1. Не более одного `GET /` (с редиректами) и загрузки подресурсов, на которые ссылается HTML; без обхода ссылок по сайту.
2. Только чтение: никаких POST/PUT/DELETE, OPTIONS с подменой Origin, fuzzing заголовков.
3. Честный User-Agent с контактом (не имитация браузера или Googlebot; в httpx отключить `-random-agent`); `robots.txt` читать и соблюдать.
4. Низкая скорость: по одному хосту за раз, единицы запросов в минуту на хост.
5. Стоп на 401/403/429/challenge/captcha — **без обхода** (смена User-Agent, ротация IP, стелс-headless против Cloudflare — недопустимо). Пример: `GET https://lovable.dev/` → HTTP 403 (Cloudflare challenge), обход не предпринимался.
6. Найденный секрет (`service_role`, `sb_secret_…`, токены) — не использовать и не проверять на валидность; зафиксировать факт.
7. Сторонний сканер — не лазейка: SSL Labs, Observatory, securityheaders шлют запросы к цели **со своих серверов по нашему поручению**; это наш запрос.
8. Персональные данные из публичных файлов — вне этой оси (оси 5–6, GDPR).

### 4.3 Что допустимо, что серая зона, что недопустимо

| Действие | Класс | Основание |
|---|---|---|
| `GET /` главной с редиректами; чтение заголовков и HTML | ДОПУСТИМО | то же, что делает браузер |
| Загрузка JS, CSS, manifest, иконок, на которые ссылается HTML; поиск в них URL BaaS, `firebaseConfig`, публичных ключей | ДОПУСТИМО | публичные файлы, которые сайт отдаёт каждому посетителю; читаем, не используем |
| Локальное декодирование base64 payload опубликованного JWT (роль `anon` или `service_role`) | ДОПУСТИМО | действие над строкой, не над сервером |
| Favicon по ссылке из HTML (или `/favicon.ico`) | ДОПУСТИМО | запрашивает любой браузер |
| DNS A/AAAA/CNAME/TXT/NS публичных зон; RDAP/WHOIS | ДОПУСТИМО | публичные записи |
| Сертификат из того же TLS-соединения (издатель, срок, SAN) | ДОПУСТИМО | часть соединения, без перебора шифров |
| Чтение `robots.txt` | ДОПУСТИМО | стандартный протокол, нужен для соблюдения правил |
| Платные и открытые базы третьих лиц (BuiltWith, TechnologyChecker stored lookup, StackScope, HTTP Archive; Wappalyzer API — только если домен уже есть в его базе) | ДОПУСТИМО | цель не затрагивается; соблюдать ToS вендора |
| Headless-рендер главной честным User-Agent для JS-глобалов | ДОПУСТИМО с оговоркой | страница сама выполняет свои обращения (в т.ч. к BaaS), как у любого посетителя; без кликов и форм |
| `WhatWeb -a 1`, `httpx -td` на одном хосте | ДОПУСТИМО с оговоркой | один запрос; низкий rate, честный User-Agent |
| `/.well-known/security.txt` | СЕРАЯ ЗОНА | путь опубликован для исследователей (RFC 9116), но не из HTML: только вручную и единично |
| MDN Observatory (GET http, GET https, GET `/robots.txt`, OPTIONS с Origin) | СЕРАЯ ЗОНА | «active-light»: OPTIONS с чужим Origin выходит за браузерную эквивалентность |
| Wappalyzer `live=true` (а также автоматический live для домена, которого нет в его базе — так сказано в доке), TechnologyChecker live detection, `recursive=true` | СЕРАЯ ЗОНА | запрос к цели идёт от вендора по нашему поручению; `recursive` — многостраничный обход. Для только что запущенного сайта база может быть пуста, тогда это и есть live |
| Список поддоменов из CT-логов (публичная база) | СЕРАЯ ЗОНА | база третьей стороны [ОЦЕНКА]; подбор имён поддоменов по словарю — недопустим |
| Перебор путей, файлов, параметров (`/admin`, `/.env`, `/.git`, `/api/*`, `/swagger`, `/graphql` и т.п.) | НЕДОПУСТИМО | активное зондирование |
| Любой запрос к найденному API (`/rest/v1/`, `/auth/v1/`, Firestore и RTDB REST, `/__/firebase/init.json`, Bubble `/api/1.1/…`, Edge Functions) — **даже с публичным ключом** | НЕДОПУСТИМО | проверка RLS/Rules = доступ к данным; ключ публичен, но данные чужие |
| Использование найденного ключа или токена, попытки `service_role` | НЕДОПУСТИМО | несанкционированный доступ |
| Регистрация, логин, отправка форм, подбор паролей; обход логина, paywall, бот-защиты | НЕДОПУСТИМО | обход контроля доступа |
| OPTIONS/CORS-пробы с чужим Origin; проверка методов (PUT, DELETE, TRACE) | НЕДОПУСТИМО | выходит за браузерную эквивалентность |
| `WhatWeb -a 3/4`, `webanalyze -crawl` больше 0, `httpx -path/-ports/-vhost/-csp-probe/-tls-probe`, порт-сканы, брутфорс поддоменов, AXFR | НЕДОПУСТИМО | README WhatWeb: уровень 3 «guess more URLs and perform actions that are potentially unsuitable without permission»; httpx — «specific use cases» |
| SSL Labs на чужие домены; скрейпинг веб-интерфейса securityheaders.com; перебор TLS-шифров | НЕДОПУСТИМО | ToS SSL Labs v2.2; активные рукопожатия |
| Игнорирование `Disallow` в `robots.txt` для пути, который обходит краулер | НЕДОПУСТИМО | нарушение этикета и ToS |

### 4.4 Правовые якоря (не юридическая консультация)

- **США, CFAA.** Политика Минюста от 19.05.2022 защищает «good-faith security research» — доступ «solely for purposes of good-faith testing, investigation, and/or correction of a security flaw», с целью повышения безопасности; та же активность «for other purposes» добросовестной не считается (пересказ MoFo; первичный justice.gov закрыт). **Лид-квалификация для продаж под это определение не подпадает** → safe harbor рассчитывать нельзя [ОЦЕНКА].
- **Украина, ст. 361 КК, ч. 6 и Постановление КМУ № 497 (16.05.2023).** Исключение действует только для поиска уязвимостей по порядку; п. 3: «Організація пошуку потенційної вразливості системи здійснюється її власником»; п. 4: поиск «на підставі публічної пропозиції» владельца на его официальном сайте. Стартап, не публиковавший такой оферты, активное зондирование исключением **не покрывает**. Другие юрисдикции — не проверялись.
- **ToS сервисов:** SSL Labs (разрешение владельца, запрет коммерции), BuiltWith (внутреннее использование, запрет конкурирующей базы), Wappalyzer (доступ документированными способами, запрет перепродажи), StackScope (запрет перепродажи и обучения моделей, «rules on unsolicited direct marketing»).
- **Контрпримеры (за границей канала):** Wiz/Moltbook (запросы к `/rest/v1/…` и запись PATCH), Matt Palmer (сценарий с `SELECT *`), Escape.tech (перебор путей API) — это исследования с раскрытием и целью безопасности, а не лидогенерация.

### 4.5 Как формулировать находку в письме, не заявляя об открытой БД

- **Допустимо:** «В публичном JS вашего сайта виден клиент Supabase (адрес проекта на `*.supabase.co`). Значит, браузер обращается к базе напрямую, и защита данных держится на политиках RLS. Мы ничего не проверяли и к вашему API не обращались».
- **Недопустимо:** «ваша база открыта», «мы смогли прочитать таблицу», числа найденных записей, скриншоты данных, любые утверждения, подтверждаемые только обращением к API цели.
- Если в публичном бандле виден секретный ключ — не использовать и не проверять; отдельное уведомление владельцу о факте со ссылкой на файл.

---

## 5. [ОЦЕНКА] доля свежих запусков с билдером и надёжность fingerprint

### 5.1 Что измерено (третья сторона) и что оценено мной

Единственный найденный замер на запусках — **StackScope** (https://stackscope.dev/blog/state-of-indie-launches-april-2026 и последующие месячные отчёты): отпечаток именованного AI-билдера в разметке/ассетах/DOM после рендера. **[источник заинтересован]** (продаёт данные), методика собственная, нижняя граница по построению.

| Месяц 2026 | Запусков (из них Product Hunt) | Доля «named AI-builder» | Состав |
|---|---|---|---|
| апрель | 17,196 (82.1%) | **8.1%** | Lovable 4.3%, Replit 1.3%, Base44 0.8%, Bolt 0.5%, v0 0.4%, Manus 0.3%, Emergent 0.2%, Cursor 0.1% |
| май | 17,652 (84.5%) | **8.5%** | Lovable 4.4% (≈52% именованных) |
| июнь | 18,130 (84.9%) | **8.6%** | Lovable ≈50% именованных |
| июль | 19,772 (83.7%) | **7.3%** | Lovable ≈49% именованных; автор: падение «could be the market or could be us losing a fingerprint» |

Платформенные субдомены (июль, корпус 72,923): 9.6% запусков живут на субдомене платформы или хостинга: vercel.app 3.9%, github.io 1.6%, netlify.app 1.2%, **lovable.app 0.82%**, pages.dev 0.41%, **base44.app 0.25%**, web.app 0.25%, onrender.com 0.19% (проценты от корпуса — мои).

### 5.2 Цепочка оценки

| Шаг | Что считаем | Значение | Обоснование |
|---|---|---|---|
| A | Именованные AI-билдеры в PH-доминируемой когорте | **7.3–8.6%** (измерено) | StackScope, апрель–июль 2026, n=17–20 тыс. в месяц |
| B | Минус Cursor, Manus, Emergent (не «хостят бэкенд») | −0.6 пп → A′ ≈ 6.7–8.0% | по апрельской таблице, мой расчёт |
| C | Плюс классический no-code с лимитами платформы (Bubble, Softr, Glide, Adalo, FlutterFlow) | +0.5…+2 пп [ОЦЕНКА] | данных по PH-когорте нет; Framer на PH ≈ в 5 раз меньше Lovable; такие приложения чаще за логином и на кастомном домене |
| D | Плюс «клиент→BaaS» без отпечатка билдера (Supabase/Firebase в бандле) | +3…+8 пп [ОЦЕНКА] | Firebase на PH сопоставим по числу с Lovable (3,739 и 3,535 запусков с апреля); Supabase — нет данных; перекрытие с A вычтено |
| **Детектируется** | A′ + C + D | **≈10–18%** (центр ≈14%) [ОЦЕНКА] | практический диапазон для планирования шире: 6–25% |
| Истинная доля использования | A при полноте 50–75% | ≈10–17% [ОЦЕНКА] | бейдж, домен, ассеты убираются; ≈10% сайтов закрыты ботзащитой; **полнота не измерена** |

**В штуках в день.** Официальный счёт Product Hunt: 2,345 запусков во втором квартале 2026 (против 1,508 годом ранее, +55.5%) ≈ **25.8 в день**; охват (featured или все) в отчёте не уточнён. Косвенно (помесячные числа leaderboards у anysite) похоже на featured [ОЦЕНКА]. Выборка StackScope по PH — ≈481–534 запуска в день. При доле 7.3–8.6%: ≈2 из 26 или ≈35–46 из ≈480–534; при 10–18%: ≈2.6–4.7 из 26 или ≈48–96 из ≈480–534. Для 2–5 писем в день **детект не узкое место**.

### 5.3 Надёжность passive fingerprint по классам сигналов [ОЦЕНКА, кроме отмеченного]

| Класс сигнала | Точность | Полнота | Основание |
|---|---|---|---|
| Платформенный домен по умолчанию | очень высокая (≥95%) | низкая–средняя: пока нет кастомного домена; на lovable.app и base44.app вместе ≈1% запусков когорты (измерено StackScope) | домен выдаёт платформа |
| Платформенные заголовки (Bubble `x-bubble-*`, Framer `server`) | высокая | высокая для этих платформ; на клиентских сайтах не измерено | подтверждено на сайтах вендоров [ВЖИВУЮ] |
| `meta generator`, бейдж, дефолтные ассеты | высокая при наличии | средняя: бейдж скрывается на платных планах, мета правится | docs.lovable.dev, support.bolt.new, примеры репозиториев |
| DNS (A, CNAME, TXT) | средняя | средняя | IP меняются (Webflow 2026-01-13, Framer 2025-07-01); у Bubble общие Cloudflare IP |
| JS-глобалы и DOM после рендера | средняя | средняя: «detection flicker» ≈15% у Supabase (TechnologyChecker) | нужен headless-рантайм |
| Адрес BaaS в публичном бандле | высокая для факта использования | зависит от разбора минифицированных бандлов; форк HTTP Archive не ловит | счётчики Supabase у трекеров расходятся на 2–3 порядка |
| Стилистические «vibe»-эвристики | не определена | не определена | «pattern match, not a verdict» — не использовать |

Внешние ориентиры по ошибкам: единственный найденный бенчмарк точности — собственный у TechnologyChecker (86% против 64% у Wappalyzer на 100 технологиях, только precision, **[источник заинтересован]**); USENIX Security 2024 (версионный fingerprinting открытых веб-приложений, **[устарело (до 2025)]**): точность на реальных сайтах на 20–80% ниже лабораторной, CAPTCHA «can completely neutralize any fingerprinting possibility». **Практическое правило:** уровень «высокая» присваивать только при ≥2 независимых классах сигналов (например, домен платформы и адрес BaaS в бандле); один маркер — гипотеза; фиксировать дату проверки (маркеры гниют).

### 5.4 Как заменить оценку измерением: размер пилота (интервалы Уилсона 95%, мой расчёт)

| n | при p=8% | при p=12% | при p=20% |
|---|---|---|---|
| 50 | 3.2–18.8% | 5.6–23.8% | 11.2–33.0% |
| 100 | 4.1–15.0% | 7.0–19.8% | 13.3–28.9% |
| 200 | 5.0–12.6% | 8.2–17.2% | 15.0–26.1% |
| 400 | 5.7–11.1% | 9.2–15.6% | 16.4–24.2% |

n≈200 даёт полуширину интервала ≈4–5 пп; n=50 почти не различает 8% и 20%. Полноту без эталона не измерить; возможный эталон для Lovable — публичный каталог `launched.lovable.dev` («over 4,000 applications», Escape.tech, [источник заинтересован]) — не измерялось, запросов к чужим сайтам не делал.

### 5.5 Что пассивно НЕ доказывается

Доля проектов с реальной проблемой RLS среди найденных «клиент→Supabase» по активным выборкам исследователей ≈10–30% (Palmer ≈10.3%; vibewrench 13–28% по билдерам, малые n) [ОЦЕНКА, выборки смещены], **но подтвердить её пассивно нельзя**. Доказуемая «находка» — архитектурный факт; не уязвимость.

---

## 6. Поправки к брифу и «нет данных»

**Поправки:**
1. `lovable-tagger` — **dev-only** (`mode === 'development' && componentTagger()`); в продакшне не виден. Использовать `*.lovable.app`, бейдж, OG-мета, `/lovable-uploads/`.
2. `gpteng.co` — устаревший скрипт эпохи GPT Engineer; актуальность в 2026 — нет данных.
3. `supabase.in` — не подтверждён; везде только `supabase.co`.
4. API securityheaders.com закрыт; остался бесплатный веб-сканер. Первичный пресс-релиз Snyk о покупке Probely — 2024-11-12 (в блогах встречается «июнь 2025»).
5. SSL Labs API: ToS v2.2 запрещает использование для сайтов без разрешения владельцев и в коммерческих целях.
6. Wappalyzer: код закрыт с 2023-08; lookup-API — только план Business; `wappalyzer-core` не поддерживается.
7. Публичные ключи Supabase и `firebaseConfig.apiKey` — по дизайну; legacy-ключи Supabase устаревают к концу 2026.
8. Домены и IP билдеров меняются; TXT-проверка Lovable расходится между докой (`lovable_verify=`) и форком (`lovable_verification=`).
9. Для Bolt, v0, Glide, FlutterFlow готовых правил в открытых форках Wappalyzer нет.

**Нет данных:** полнота (recall) маркеров билдеров на реальных запусках; доля Supabase, Webflow, Bubble и классических no-code среди PH-запусков; охват «2,345 launches» в отчёте PH; полный текст ToS WhatRuns; rate limit Domain API BuiltWith и разница месячной и годовой цены; смысл «infrastructure probing» у TechnologyChecker; `/terms` и `/bot` у StackScope; право других юрисдикций (UK, ЕС); точность правил на сайтах-лидах (запросов к ним не делалось); свежесть коммитов форков Wappalyzer на сегодня (API GitHub закрыт).

---

## 7. Ключевые источники (проверено 2026-10-04)

- Supabase: https://supabase.com/docs/guides/api/api-keys · https://supabase.com/docs/guides/database/postgres/row-level-security · https://supabase.com/docs/guides/platform/custom-domains
- Firebase: https://firebase.google.com/docs/projects/api-keys · https://firebase.google.com/docs/rules/insecure-rules · https://firebase.google.com/docs/web/setup
- Исследования RLS: https://wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys · https://mattpalmer.io/posts/statement-on-CVE-2025-48757/ · https://cveawg.mitre.org/api/cve/CVE-2025-48757 · https://escape.tech/blog/methodology-how-we-discovered-vulnerabilities-apps-built-with-vibe-coding/ · https://vibewrench.dev/blog/we-scanned-100-vibe-coded-apps
- Билдеры (доки): https://docs.lovable.dev/features/custom-domain · https://docs.lovable.dev/integrations/cloud · https://manual.bubble.io/help-guides/getting-started/navigating-the-bubble-editor/tabs-and-sections/settings-tab/web-app/custom-domain-and-dns · https://docs.replit.com/features/publishing/deployment-types · https://support.bolt.new/concepts/faq · https://supabase.com/blog/bolt-cloud-launch · https://v0.app/docs/deployments · https://help.webflow.com/hc/en-us/articles/42394305646611-How-do-I-manually-migrate-my-DNS-records · https://www.framer.com/help/articles/connect-to-our-new-and-improved-hosting · https://docs.softr.io/publishing/add-a-custom-domain-to-your-app · https://www.glideapps.com/docs/custom-domains · https://docs.flutterflow.io/deployment/web-publishing/ · https://docs.base44.com/Setting-up-your-app/Setting-up-your-custom-domain
- Базы правил: github.com/enthec/webappanalyzer · github.com/HTTPArchive/wappalyzer (README, LICENSE)
- Инструменты и цены: https://www.wappalyzer.com/pricing/ · https://www.wappalyzer.com/docs/api/v2/lookup/ · https://www.wappalyzer.com/terms/ · https://builtwith.com/terms · https://builtwith.com/plans · https://builtwith.com/all-products · https://api.builtwith.com/ · https://technologychecker.io/pricing · https://technologychecker.io/terms-of-use · https://stackscope.dev/data · https://stackscope.dev/data-licence · https://registry.npmjs.org/wappalyzer-core
- Открытые движки: github.com/projectdiscovery/httpx · github.com/projectdiscovery/wappalyzergo · github.com/rverton/webanalyze · github.com/urbanadventurer/whatweb
- HTTP Archive: https://httparchive.org/faq · https://har.fyi/reference/tables/pages/ · https://almanac.httparchive.org/en/2025/methodology · https://cloud.google.com/bigquery/pricing
- Security-чекеры: https://securityheaders.com/api/ · https://developer.mozilla.org/en-US/observatory/docs/faq · github.com/mdn/mdn-http-observatory (README, `src/retriever/retriever.js`) · https://www.ssllabs.com/downloads/Qualys_SSL_Labs_Terms_of_Use.pdf · github.com/ssllabs/ssllabs-scan
- Доли и объёмы: https://stackscope.dev/blog/state-of-indie-launches-april-2026 (и май, июнь, июль) · https://stackscope.dev/methodology · https://www.producthunt.com/p/general/product-hunt-s-state-of-tech-discovery-q2-2026 · https://anysite.io/blog/who-actually-launched-on-product-hunt-in-2026/
- Право: https://www.mofo.com/resources/insights/220525-cyber-crime-charging-policy · https://protocol.ua/ua/kriminalniy_kodeks_ukraini_stattya_361/ · https://www.kmu.gov.ua/news/uriad-ukhvalyv-rozroblenyi-fakhivtsiamy-derzhspetszviazku-poriadok-provedennia-bug-bounty · https://www.usenix.org/conference/usenixsecurity24/presentation/kondracki
