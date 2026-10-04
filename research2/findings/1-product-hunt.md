# Ось 1. Product Hunt как источник данных — дистиллят

Дата проверок: **2026-10-04**. Детали, дословные цитаты и сырые данные — `research2/raw/1-product-hunt.md` (параграфы вида §N ниже ссылаются на него).
Правила: числа — с источником или [ОЦЕНКА]; «нет данных» — не удалось получить; «устарело (до 2025)» — источник старше 2025.

---

## 0. Короткий итог

1. **Без токена и без браузера доступен ровно один машинный канал со списком запусков — публичный Atom-фид** `https://www.producthunt.com/feed` (+ неофициальные тематические `?category=<slug>`). 50 записей на запрос: название, tagline, ссылка на страницу продукта, редирект на сайт, дата создания поста, имя автора поста. Мейкеров, топиков, голосов, e-mail в нём нет.
2. **Официальный API v2 (GraphQL) бесплатен, но документация прямо запрещает коммерческое использование**; данные о людях (мейкеры, хантеры, комментаторы) в API **замаскированы** («[REDACTED]») — контактов мейкеров API не даёт.
3. **Сайт продукта легально и без токена достаётся так:** ссылка «Link» из фида `https://www.producthunt.com/r/p/{postId}?app_id=339` → HTTP 301 на сайт продукта; robots.txt этот путь **явно разрешает** (остальные `/r/*` — запрещает).
4. **ToS (редакция 2014 г., действует)** разрешает использование «only … for your own internal, personal, non-commercial use» и запрещает «Crawls, scrapes, or spiders any page, data…». Наш кейс (поиск лидов для платной услуги) — коммерческий [интерпретация, не юр. заключение]. Единственный документированный легальный путь — письмо на **hello@producthunt.com**; тарифов/сроков/условий — нет данных.
5. **Объём:** запусков всего ≈ 485–793 в сутки (сентябрь–начало октября 2026, сторонний трекер), featured — в среднем ≈ 25 в сутки (сентябрь 2026; по месяцам 2025–2026: 12–27), доля featured ≈ 2,5–3,8 %. Среди top-10 дня 67 % с тегом AI, 34 % — Developer Tools (77 % — хотя бы один из двух).

---

## 1. ЧТО можно получить и ОТКУДА

### 1.1 Atom-фид (бесплатно, без токена) — §2 raw
- **URL:** `https://www.producthunt.com/feed`; тематические — `https://www.producthunt.com/feed?category=<slug топика>` (проверены 12 slug: developer-tools, artificial-intelligence, saas, vibe-coding, no-code, productivity, web-app, tech, fintech, marketing, design-tools, open-source; неизвестный slug отдаёт обычный фид). `?category=` **нигде не документирован** — найден экспериментом, может измениться.
- **Формат:** Atom 1.0, `application/atom+xml`. Кэш `Cache-Control: public, max-age=30`; `ETag` и `Last-Modified` работают (условные запросы → HTTP 304).
- **Поля записи (все 50 записей, подсчёт):** `id` (`tag:www.producthunt.com,2005:Post/{postId}`), `published`, `updated`, `link` (→ `/products/{slug}`), `title`, `content` (tagline + ссылки «Discussion» и «Link»), `author/name` (отображаемое имя).
- **Чего нет:** описания, голосов/комментариев, топиков, мейкеров, username/соцсетей, e-mail, прямого URL сайта.
- **Размер/пагинация:** всегда 50 записей; `?page=`, `?limit=`, `?per_page=` игнорируются.
- **Особенности (эмпирика, официального описания нет):**
  - Выборка — это скорее рейтинг текущих/последних суток, а не поток всех запусков: в фиде было 9 из 10 продуктов top-10 за 2026-10-03 и 0 из 10 за каждый из предыдущих дней (2026-09-29 … 10-02). Состав меняется (7 из 50 записей новые за 19 минут); порядок не хронологический → для разбора нужен дедуп по Post ID.
  - `published` = дата **создания** поста, не день запуска («Monospace from Directus»: `published` 2026-09-15, запуск/ранг #1 — 2026-10-01).
  - `author` = автор поста (хантер/сабмиттер), не обязательно мейкер; 11 из 50 записей принадлежат 4 авторам с 2–5 постами.
  - Тематические фиды дают «бесплатный» признак топика (запись есть в `category=developer-tools` → у поста этот тег), глубина по времени разная: `vibe-coding` — 50 записей за ~6,5 мес., `no-code` — за ~20 мес.

### 1.2 Официальный API v2, GraphQL — §6 raw
- **Endpoint:** `https://api.producthunt.com/v2/api/graphql`, `Authorization: Bearer {token}`. Без токена — HTTP 401 (проверено).
- **Как получить токен (первоисточник):** developer token из API dashboard («does not expire, linked to your account»; страница https://www.producthunt.com/v2/oauth/applications — нужен логин PH, не открывал); OAuth user; OAuth client-only (`client_credentials`, scope `public`); PKCE для публичных клиентов. По умолчанию «all apps are read-only i.e they have public scope».
- **Лимиты:** **6 250 complexity-очков / 15 минут** на `/v2/api/graphql` и **450 запросов / 15 минут** на остальные `/v2/*`; на каждый ответ заголовки `X-Rate-Limit-Limit/Remaining/Reset`; при превышении HTTP 429. «We may on occasion adjust the rate limit… If your application requires a higher rate limit. Please contact us.» Формула сложности и максимум `first` — **нет данных**.
- **Доступные поля `Post`** (docs-сайт `api-v2-docs.producthunt.com`): id, slug, name, tagline, description (plain text), url, **website** («URL that redirects to the Post's website»), productLinks[{type,url}], votesCount, commentsCount, reviewsCount, reviewsRating, dailyRank/weeklyRank/monthlyRank/yearlyRank, createdAt, featuredAt, scheduledAt, thumbnail, media[], topics (name, slug, postsCount…), comments (body, createdAt, votesCount), votes, collections, makers, user.
- **Фильтры `posts(...)`:** `featured`, `order` (FEATURED_AT / NEWEST / RANKING / VOTES), `postedAfter`, `postedBefore`, `topic` (slug), `twitterUrl`, `url`, пагинация `first/after`. Текстового поиска нет.
- **Данные о людях замаскированы.** Тип `User`: «Most fields are only available for the currently-accessing user, otherwise they are redacted to protect users' privacy.» Подтверждение: GitHub-issue #342 (открыт 2025-12-23): для чужого мейкера `name`, `url`, `username` = `"[REDACTED]"`; PyPI `producthunt-sdk` v0.2.0 (2026-01-04): «Other users' profiles, posts, votes, followers: Redacted»; изменение введено ~24–25.02.2023 (Indie Hackers 2023-03-01, устарело (до 2025)). Поля e-mail у `User` в схеме нет. **Живой вызов с токеном не делал** → актуальное содержимое `makers{…}` проверено косвенно.
- В доках: ссылка «API Explorer» мертва (HTTP 404 «No such app»); GitHub `schema.graphql` устарела относительно docs-сайта; API v1 deprecated (2023) — устарело (до 2025).

### 1.3 HTML-страницы, LLM-представление, sitemaps — §4, §5, §7.5, §9.6 raw
- **Страница продукта `/products/{slug}`:** внешний URL («Visit website», напр. `https://wikifix.ai/?ref=producthunt`), список мейкеров (имя + ссылка `/@username`), топики, ранг дня (WebFetch). **Профиль `/@username`** показывает секцию «Links» (GitHub, Twitter/X и др.) — но это HTML.
- **Лидерборды `/leaderboard/daily|weekly|monthly|yearly/…`** (дни — по тихоокеанскому времени, `llms.txt`). Через Exa (не наш клиент) отдаётся «LLM-представление» top-10 дня: название, tagline, описание, «External URL», «Launch tags», «Categories», score, comments.
- **`https://www.producthunt.com/llms.txt`** — описание структуры для AI-агентов + условия оформления: «Always list name and tagline before additional information when discussing products»; «Data sourced from Product Hunt (https://www.producthunt.com/)». О коммерческом использовании и scraping — ничего.
- **Sitemaps** (`robots.txt`: `Allow: /sitemaps_v3/*`; фактически 301 на CloudFront, доступны curl-ом): `product_about_sitemap` — **21 482** URL `/products/{slug}`, `lastmod` от 2025-10-27; 2 958 записей с `lastmod` ≥ 2026-10-03 → это дата правки страницы, а не признак нового запуска. Мейкеров/сайтов/тегов в sitemap нет.
- **Технический барьер:** с curl из песочницы (датацентровый IP) все HTML-страницы PH (включая `/robots.txt`, `/products/…`, `/leaderboard/…`, `/llms.txt`, `/r/p/…`, sitemaps на www) отдают **Cloudflare managed challenge** (HTTP 403, `cf-mitigated: challenge`). Без challenge отвечают: `/feed*`, API, документация, CloudFront-sitemaps. Поведение с других IP — **не проверено**.

### 1.4 Чего PH не даёт ни одним проверенным легальным каналом
- **E-mail мейкеров** — нет ни в фиде, ни в API-схеме, ни в описаниях сторонних скраперов («no private maker info, maker email, or contact details»).
- **Идентичность мейкеров через API** — замаскирована (см. 1.2); в HTML видна, но её сбор = scraping (ToS (h)), `/@*/*` закрыт robots.txt.
- **Метрики бизнеса** (выручка, трафик, финансирование) — нет данных в PH (кроме голосов/отзывов).

---

## 2. Как легально получить URL САЙТА продукта

| Путь | Что проверено | Статус |
|---|---|---|
| **A. Фид → «Link» `/r/p/{postId}?app_id=339`** | HTTP **301 → `https://wikifix.ai/?ref=producthunt`** (WebFetch 2026-10-04); robots.txt: `Allow: /r/p/*` (перекрывает `Disallow: /r/*`) | единственный путь, который одновременно разрешён robots.txt и отдаётся публичным фидом без токена. 1 запрос на продукт; curl из песочницы получил Cloudflare 403 (с других IP — не проверено) |
| B. API `Post.website` | по схеме — «URL that redirects to the Post's website» (т. е. редирект через PH, не прямой URL); формат значения — нет данных (токена нет) | если формат `/r/<токен>`, он под `Disallow: /r/*`; плюс коммерческий запрет API |
| C. API `Post.productLinks[{type,url}]` | значения не проверены — нет данных | возможны ссылки на соцсети/сайт (сторонние описания, не первоисточник) |
| D. Страница продукта, «Visit website» | `https://wikifix.ai/?ref=producthunt`, `https://iwouldpay.dev/?ref=producthunt` (WebFetch) | HTML: ToS (h); Cloudflare |
| E. «External URL» в LLM-представлении лидерборда | через Exa: `https://directus.io`, `https://polylane.com` и т. д. | только top-10 дня; условия доступа для своего клиента не проверены |

Итог: «прямого» URL в публичном фиде нет — только редирект, который нужно развернуть (UTM-хвост `?ref=producthunt` добавляет PH).

---

## 3. НА КАКИХ УСЛОВИЯХ

### 3.1 API: прямой запрет коммерции (первоисточник https://api.producthunt.com/v2/docs, дословно, два места)
- «The Product Hunt API must not be used for commercial purposes. If you would like to use it for your business, please contact us at hello@producthunt.com.»
- «May I use the API for my business? By default the Product Hunt API must not be used for commercial purposes. If you would like to use it for your business, please contact us at hello@producthunt.com.»
- Отдельного документа API Terms нет; лимита на срок/объём хранения данных API в доках нет — нет данных. Просьба об атрибуции: «We kindly ask that you include attribution in your project, linking back to Product Hunt.»

### 3.2 Terms of Service (https://www.producthunt.com/legal; «Effective date: August 17th 2014» — устарело (до 2025), но действующая версия; PRODUCT HUNT, INC.)
- «You will only use the Services for your own internal, personal, non-commercial use, and not on behalf of or for the benefit of any third party».
- «(h) "Crawls," "scrapes," or "spiders" any page, data, or portion of or relating to the Services or Content (through use of manual or automated means);»
- «(i) Copies or stores any significant portion of the Content;» (лимит на хранение — качественный, без числа)
- «(g) Runs Maillist, Listserv, any form of auto-responder or "spam" on the Services …»
- Согласие: «Your using the Services in any way means that you agree to all of these Terms». Нарушение — «grounds for termination of your right to use or access the Services». Право Калифорнии, споры — арбитраж JAMS (Сан-Франциско).
- Отдельной оговорки для публичного фида или API в ToS нет.
- Privacy & Cookies Policy («Effective date: January 1, 2020», устарело (до 2025)): в списке получателей данных есть «API Users — Certain third parties have API access … to enable businesses and startups to build affiliated services and products» (PH сам признаёт коммерческих API-партнёров).

### 3.3 robots.txt (дословно в raw §3)
Запрещено: `/r/*` (кроме `/r/p/*`), `/@*/*`, `/search*`, `/auth/*`, `/my/*`, `/yours*`, `/notifications`, URL с `comment=`/`review=`. Разрешено явно: `/sitemaps_v3/*`, `/r/p/*`. `/feed`, `/products/*`, `/leaderboard/*` не запрещены. `Crawl-delay` только для SemrushBot и SiteAuditBot (1 с), для остальных — нет данных. Правил для AI-краулеров нет.

### 3.4 Правила сообщества (первоисточники, help.producthunt.com)
- Community Guidelines (updated 2025-04-11): «Mass messaging users, asking for upvotes, using bots, incentivizing upvotes, and any other form of artificially increasing activity on your contribution is not acceptable.»; «Self-promoting in comments will also be removed.»
- Launch-гайд для мейкеров: «Sending hundreds of people the same tweet or scraping and sending unsolicited emails has the opposite effect of what you're hoping for» (совет, не правило ToS).
- [Интерпретация] Письма вне PH под эти правила не подпадают, но питчить услугу через PH-аккаунт/комментарии нельзя.

### 3.5 Легальный путь на коммерческое использование
- Документированный — один: **hello@producthunt.com** («If you would like to use it for your business, please contact us»; «If you require faster access without rate limit please contact us»). Публичных тарифов, enterprise-плана или лицензионной формы — **нет данных**. Примеров одобрения/отказа другим компаниям — не найдено. Мы PH не писали.

### 3.6 Моя интерпретация [ОЦЕНКА — не юридическая консультация]
- API: коммерческий запрет в тексте прямой → B2B-лидогенерация под него попадает; без письменного разрешения PH использовать API для нашего кейса нельзя.
- Фид: формально покрыт общим ToS (non-commercial; запрет «crawls/scrapes»), но (а) это публичный синдикационный канал (utm-параметры в самих ссылках: `producthunt-atom-posts-feed`, `rss-feed`), (б) robots.txt его не запрещает, (в) нагрузка — единицы запросов в час при `max-age=30`. Практический риск принудительных мер к малому пользователю фида — низкий (случаев enforcement не найдено), но юридически «чистым» путь становится только после разрешения PH.
- HTML-скрейпинг: ToS (h),(i) прямо против; плюс Cloudflare — обход challenge (headless-браузеры, резидентные прокси) усилит риск (нарушение технической меры защиты); не проверял и не рекомендую.

---

## 4. ОЖИДАЕМЫЙ ОБЪЁМ

| Показатель | Значение | Источник |
|---|---|---|
| Все запуски за сутки (featured + остальные), сентябрь–начало октября 2026 | **485–793**, среднее ≈ 633, медиана 611 (n=11 дней) | hunted.space «All launches» (сторонний трекер), мой расчёт, raw §9.3 |
| Рекордные сутки по заявлению автора ветки на форуме PH (Chris Messina; статус автора в PH не проверялся) | ≈600 (≈февр. 2026) → 1 000 (апрель 2026) → **1 100** (июнь 2026) | https://www.producthunt.com/p/producthunt/1-100-products-launched-in-a-single-24-hour-period (2026-06-09) |
| Рост ID постов (верхняя граница создаваемых постов, включая черновики) | ≈ 950–1 016 в сутки [ОЦЕНКА] | регрессия ID↔дата по 133 постам фида (26.09–03.10.2026); ID последовательны |
| Featured в сутки, сентябрь 2026 (26 дней) | среднее **25,5**, медиана 20,5; будни 30,5 / выходные 11,9; выбросы 67 и 91 | hunted.space/stats, мой расчёт |
| Featured в сутки по месяцам (среднее) | 2025-03: 13,6 · 2025-06: 16,9 · 2025-09: 13,8 · 2025-12: 12,4 · 2026-01: 14,1 · 2026-03: 22,0 · 2026-05: 26,9 · 2026-07: 17,2 · 2026-08: 17,9 | hunted.space/product-hunt-launch-history/… |
| Доля featured | ≈ **3,8 %** (267 из 6 962, 11 дней сент.–окт. 2026) и 2,5 % (28 из 1 100, комментарий в ветке PH, июнь 2026); 10 % — сентябрь 2024, вторичный источник, устарело (до 2025) | raw §9.3, §9.5 |
| Доля AI-запусков среди top-10 дня (7 дней, n=70) | **67 %** (47/70) с тегом «Artificial Intelligence» [ОЦЕНКА: выборка top-10, смещена к популярным] | лидерборды PH через Exa, raw §9.6 |
| Доля Developer Tools среди top-10 (n=70) | **34 %** (24/70) [ОЦЕНКА] | то же |
| AI или Developer Tools среди top-10 | **77 %** (54/70) [ОЦЕНКА] | то же |
| Нижняя граница по главному фиду (50 записей, 3 снимка) | AI ≥ 36–42 %; Dev Tools ≥ 30–40 %; AI∪Dev ≥ 50–58 % [ОЦЕНКА: пересечение с category-фидами, ограниченными 50 записями] | raw §9.6(б) |
| Теги «Vibe coding» / «No-Code» среди top-10 (n=70) | 1 / 0 — целевую когорту no-code/AI-билдеров по тегам PH не выделить | raw §9.6(а) |
| Доля запусков крупных компаний/организаций в top-10 (шум для воронки) | ≈ 11 из 70 (≈16 %) [ОЦЕНКА по названиям] | raw §9.6(а) |
| Официально от PH (рассылка 2025-12-28) | «Of the top 15 launches on Product Hunt, thirteen were tagged "Artificial Intelligence"» (за 2025) | https://www.producthunt.com/newsletters/archive/46593-all-the-ai-that-launched-in-2025 |
| Доля AI/dev среди ВСЕХ запусков (не только featured) | **нет данных** | — |

Для объёма 2–5 писем/день [ОЦЕНКА]: при ≈25 featured/день и доле AI∪Dev 50–77 % выходит ≈ 13–20 AI/dev-кандидатов в день ещё до фильтров по бэкенду/бизнесу; фид отдаёт ≤ 50 записей за запрос → поток кандидатов заметно превышает потребность.

---

## 5. Таблица: способ доступа → цена → лимит → ToS-риск → вердикт для нашего кейса

| Способ доступа | Бесплатно / цена | Лимит | ToS-риск | Вердикт для нашего кейса |
|---|---|---|---|---|
| **Atom-фид `/feed` (+ `?category=`)** | бесплатно | 50 записей на запрос; кэш 30 с (поллинг в разумных пределах + ETag/304); пагинации нет | формально средний: ToS 2014 («non-commercial», запрет «crawls/scrapes»), но публичный синдикационный канал, robots не запрещает; enforcement против малых пользователей не найден [ОЦЕНКА] | **Единственный машинный источник списка запусков без токена и без Cloudflare-блока (из песочницы).** Даёт название, tagline, редирект на сайт (`/r/p/{id}`, разрешён robots), автора поста. Не даёт мейкеров/топиков/голосов/e-mail. Для юридической чистоты — запросить разрешение PH |
| **API v2, developer token** | бесплатно | 6 250 complexity / 15 мин (GraphQL), 450 запросов / 15 мин (прочие `/v2/*`), 429 при превышении | **высокий**: «must not be used for commercial purposes» (прямой запрет в доках) | Технически богаче (votes, topics, featuredAt, ранги), но мейкеры замаскированы; **не использовать для лидогенерации без разрешения PH** |
| **API v2 + письменное разрешение PH** (hello@producthunt.com) | цена и условия — нет данных (публичных тарифов нет) | «contact us» для повышения лимита; условия — нет данных | низкий после согласия | Единственный полностью чистый путь; срок, цена, ответ — нет данных; стоимость попытки — одно письмо |
| **Sitemaps (CloudFront)** | бесплатно | нет заявленных | низкий (robots явно разрешает `/sitemaps_v3/*`) | Вспомогательный: 21 482 URL продуктов + `lastmod` (≈3 тыс. в сутки правок); **не источник «новых запусков»**, мейкеров и сайтов нет |
| **Прямой скрейпинг HTML** (лидерборды, страницы продуктов/профилей) | бесплатно по ПО; прокси/браузер — платно, цена не оценивалась | Cloudflare managed challenge (curl → 403) | **высокий**: ToS (h) «manual or automated means», (i) «stores any significant portion»; `/@*/*` закрыт robots | Не использовать; обход challenge усугубляет риск. Исключение — разовый ручной просмотр человеком (граница с (h) размыта) |
| **Сторонние скраперы (Apify)** | `thirdwatch/…-launches-scraper` от $1,60 / 1 000 результатов; `philzx/ph-launch-intelligence` $0,45 / 1 000; `memo23/producthunt-scraper` $0,80 / 1 000 (+ платное e-mail-обогащение, цена — нет данных); Apify Free: $5/мес включено — источник заинтересован | по тарифу Apify | переносится на пользователя (в описании memo23: «Users are responsible for ensuring their use complies with Product Hunt's Terms of Service… (GDPR, CCPA, etc.)»); `philzx` скрейпит HTML/внутренний GraphQL и ищет e-mail на сайтах | Легальности не добавляют. `thirdwatch` читает тот же публичный Atom-фид (платить не за что); остальные — скрейпинг + сбор e-mail → выше ToS/GDPR-риск. Не рекомендуется |
| **LLM-представление страниц (`llms.txt`, лидерборд с «External URL»)** | бесплатно (через Exa-подобные краулеры) | показывает top-10 дня | неясный: требуется атрибуция «Data sourced from Product Hunt»; об использовании в коммерции ничего нет | Удобно содержит прямой «External URL» и теги, но доступность для собственного клиента не проверена (curl → challenge) |
| **Ручной просмотр человеком / рассылка PH** | бесплатно | — | минимальный для просмотра; commercial-clause ToS формально остаётся | Резервный/контрольный канал для проверки отдельных продуктов; не масштабируется |

---

## 6. Подводные камни и противоречия (для синтеза)

1. **Контакты мейкеров из PH API не получить** — поля `makers{…}` замаскированы с февраля 2023 (подтверждено ещё issue от 2025-12-23); в HTML они видны, но это скрейпинг, запрещённый ToS.
2. **`published` в фиде — не день запуска.** «Свежесть» нужно мерить по `featuredAt` (API) или по позиции/составу фида.
3. **Фид — рейтинг, а не журнал:** состав меняется (≈7 из 50 за 19 мин), порядок не хронологический, глубины нет → кандидат может появиться и уйти между опросами.
4. **Сайт продукта — только через редирект.** Путь `/r/p/{id}` разрешён robots.txt; прочие `/r/*` — нет. Если API `Post.website` имеет формат `/r/<токен>`, он попадает под запрет (не проверено).
5. **Cloudflare:** HTML-страницы PH (включая `/robots.txt`, `/products/…`, `/leaderboard/…`, `/r/p/…`) закрыты challenge для curl из датацентра, открыты только `/feed*`, API и документация; WebFetch/Exa challenge проходят — это не гарантия для нашего клиента.
6. **Объём растёт и шумит:** до 1 100 запусков в сутки (рекорд июня 2026), доля featured упала с «60–98 % (2020–2023)» и «10 % (сент. 2024)» (вторичный источник) до ≈2,5–3,8 % (2026). PH-кураторы публично: вероятность featured выше у AI-продуктов (Gabe Perez, 2025-03-20).
7. **Шум в top-10:** ≈16 % — продукты крупных компаний/организаций (OpenAI, Anthropic, Microsoft, Amazon, Meta, Cloudflare и др.); теги «Vibe coding»/«No-Code» почти не встречаются — целевую когорту по тегам PH не выделить.
8. **Юридические документы PH давние** (ToS 2014, Privacy 2020): PH может ужесточить условия; в API-доках — устаревшие артефакты (мёртвый API Explorer, старая GitHub-схема).
9. **Сторонние числа не совпадают с первоисточником:** «~900 запросов/15 мин, лимит сложности 1000» из community-skill vs 6 250 / 450 в официальных доках — верить доками. «September 2024 … over 4,000 product launches … averaging 11 daily» (shno.co) внутренне противоречиво — не использовать.

---

## 7. Нет данных / не проверено

- Вызовы API с токеном (содержимое `makers`, `website`, `productLinks` в 2026; формула complexity; максимум `first`) — токена нет; получение требует логина PH, а API запрещён для коммерции.
- Условия в API dashboard при создании приложения; ответ PH на запрос коммерческого разрешения (срок/цена/условия).
- Поведение Cloudflare для `/r/p/…` и HTML с не-датацентровых IP (в т. ч. из Украины).
- Официальная семантика отбора 50 записей `/feed` и поддержка `?category=`.
- Доля AI/dev среди ВСЕХ запусков (не featured); официальные данные PH о числе запусков в сутки (есть только пост автора ветки на форуме PH о рекордах и сторонний трекер).
- Даты кэша Exa-копий (ToS, llms.txt, лидерборды, форум) и точность WebFetch-пересказов (помечено в raw).
- Фактическая работа и легальность Apify-actor-ов (не запускались).
