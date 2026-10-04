# Ось 1. Product Hunt как источник данных — RAW-дамп

Дата проверок: **2026-10-04** (время UTC 13:15–13:40). Исполнитель: исследователь оси 1.
Правила: каждое число — с URL-источником либо пометкой [ОЦЕНКА] + обоснование; «нет данных» = не удалось получить; всё, что старше 2025, помечено «устарело (до 2025)»; цифры продавцов помечены «источник заинтересован».

---

## 0. Методика, инструменты, ограничения

| Инструмент | Что давал | Оговорка |
|---|---|---|
| curl (исходящий трафик песочницы идёт через прокси, датацентровый IP) | сырые ответы: `/feed`, заголовки, sitemaps на CloudFront, hunted.space | PH закрывает почти все HTML-страницы Cloudflare-challenge (см. §5), поэтому curl там не прошёл |
| WebFetch | страницы PH, help-center, GitHub-issues, Apify | страница прогоняется через малую модель-суммаризатор: пометка «(WebFetch)» = возможен пересказ, не дословная цитата |
| Exa fetch (`web_fetch_exa`) | очищенный markdown: API-доки, ToS, llms.txt, leaderboard, форум | возможно из кэша Exa (дата кэша неизвестна): пометка «(Exa)» |
| WebSearch | поиск первичных URL | только для навигации; вывод из поисковых «резюме» не использовался без проверки первоисточника |

**Чего НЕ делал (намеренно):** вызовов API с токеном (токена нет; его получение = логин в аккаунт PH, а API запрещён для коммерции, см. §7); обхода Cloudflare challenge; массового обхода страниц PH. К страницам PH (не `/feed`) обращался единицами исследовательских запросов; к `/feed` — около 20 запросов за ~20 минут (ответ кэшируется 30 с).

---

## 1. Журнал живых проверок (дата 2026-10-04)

| # | URL | Метод | Результат |
|---|---|---|---|
| 1 | https://www.producthunt.com/feed | curl 13:18 UTC | HTTP 200, `application/atom+xml; charset=utf-8`, 43 850 байт, 50 записей |
| 2 | https://www.producthunt.com/feed?category=<slug> (12 slug-ов) | curl | HTTP 200, Atom, по 50 записей; неизвестный slug отдаёт обычный фид |
| 3 | https://www.producthunt.com/robots.txt | WebFetch + Exa (curl: 403 challenge) | дословный текст — см. §3 |
| 4 | https://api.producthunt.com/v2/docs | Exa + WebFetch | дословные цитаты — §6, §7 |
| 5 | https://api-v2-docs.producthunt.com/object/post/ (и user, topic, media, productlink, comment, vote, enum/postsorder) | Exa | схема полей — §6.3 |
| 6 | https://raw.githubusercontent.com/producthunt/producthunt-api/master/schema.graphql | Exa | старая схема (расходится с docs-сайтом) — §6.3 |
| 7 | POST https://api.producthunt.com/v2/api/graphql без токена | curl 13:19 | HTTP 401, JSON `invalid_oauth_token` — §6.5 |
| 8 | POST https://api.producthunt.com/v2/oauth/token без параметров | curl | HTTP 400 `Missing required parameter: grant_type.` (эндпоинт жив) |
| 9 | https://www.producthunt.com/legal (ToS + Privacy) | Exa + WebFetch | ToS «Effective date: August 17th 2014», Privacy «Effective date: January 1, 2020», страница жива (200) |
| 10 | https://www.producthunt.com/r/p/1217369?app_id=339 | WebFetch | HTTP 301 → `https://wikifix.ai/?ref=producthunt` (curl: 403 challenge) |
| 11 | https://www.producthunt.com/products/wikifix | WebFetch | страница открылась; внешний сайт `https://wikifix.ai/?ref=producthunt`, мейкеры перечислены (curl: 403 challenge) |
| 12 | https://www.producthunt.com/llms.txt | Exa (curl: 403 challenge) | текст — §7.5 |
| 13 | https://www.producthunt.com/leaderboard/daily/2026/10/1 (и ещё 6 дат) | Exa | «LLM-представление»: External URL, теги, счёт — §9.6 |
| 14 | https://www.producthunt.com/sitemaps_v3/*.xml.gz | WebFetch: 301 → CloudFront; curl на CloudFront | HTTP 200 — §4 |
| 15 | https://hunted.space/stats, /history, /product-hunt-launch-history/<год>/<месяц>, /all-products/<год>/<месяц>/<день> | curl | сторонний трекер, счётчики запусков — §9 |
| 16 | https://www.producthunt.com/p/producthunt/1-100-products-launched-in-a-single-24-hour-period | Exa | пост форума PH, 2026-06-09 — §9.1 |
| 17 | https://ph-graph-api-explorer.herokuapp.com/ (ссылка «API Explorer» из доков) | curl | HTTP 404 «No such app» — ссылка мёртвая |
| 18 | https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines и др. help-статьи | WebFetch | §7.4 |
| 19 | https://github.com/producthunt/producthunt-api/issues/342, /286, /279 | WebFetch | §6.4 |
| 20 | https://apify.com/... (3 actor-а), https://apify.com/pricing | Exa / WebFetch | цены — §10 |

---

## 2. Публичный Atom-фид https://www.producthunt.com/feed

### 2.1 Заголовки ответа (curl, 2026-10-04 13:18:39 GMT)
```
HTTP/2 200
content-type: application/atom+xml; charset=utf-8
content-length: 43850
etag: W/"2e8a87cce056c171ea6f00bf1bdb7c6b"
last-modified: Sun, 04 Oct 2026 13:18:16 GMT
cache-control: public, max-age=30
cf-cache-status: HIT
server: cloudflare
```
- Условные запросы работают: `If-None-Match` → HTTP 304; `If-Modified-Since` → HTTP 304 (проверено 13:31 UTC).
- Пагинация не найдена: параметры `?page=2`, `?limit=100`, `?per_page=100` игнорируются (всегда те же 50 записей).
- Формат — **Atom 1.0** (не RSS 2.0). `/feed.xml` и `/feed.rss` — HTTP 404.

### 2.2 Уровень канала
`<id>tag:www.producthunt.com,2005:/feed</id>`, `<title>Product Hunt — The best new products, every day</title>`, `<updated>2026-10-04T00:01:00-07:00</updated>` (значение не менялось между моими запросами; совпадает с началом суток по тихоокеанскому времени), две `<link>` (alternate → https://www.producthunt.com, self → https://www.producthunt.com/feed), `xml:lang="en-US"`.

### 2.3 Запись (сырой XML первой записи, дословно)
```xml
<entry>
  <id>tag:www.producthunt.com,2005:Post/1217369</id>
  <published>2026-08-07T06:20:11-07:00</published>
  <updated>2026-10-04T06:18:16-07:00</updated>
  <link rel="alternate" type="text/html" href="https://www.producthunt.com/products/wikifix"/>
  <title>WikiFix for Confluence</title>
  <content type="html">          &lt;p&gt;
            Find and fix issues in your knowledge base
          &lt;/p&gt;
          &lt;p&gt;
            &lt;a href="https://www.producthunt.com/products/wikifix?utm_campaign=producthunt-atom-posts-feed&amp;amp;utm_medium=rss-feed&amp;amp;utm_source=producthunt-atom-posts-feed"&gt;Discussion&lt;/a&gt;
            |
            &lt;a href="https://www.producthunt.com/r/p/1217369?app_id=339"&gt;Link&lt;/a&gt;
          &lt;/p&gt;
</content>
  <author>
    <name>fmerian</name>
  </author>
</entry>
```
Набор тегов внутри `<entry>` (подсчёт по всем 50 записям, python): `id`, `published`, `updated`, `link`, `title`, `content`, `author` — по 50 каждого. Других полей нет.

| Что есть в записи | Что НЕТ в записи |
|---|---|
| Post ID (в `<id>`), название (`title`), tagline (первый `<p>` в `content`), `published`, `updated`, ссылка на страницу продукта (`/products/{slug}`), ссылка «Discussion» (то же + utm), ссылка «Link» = `https://www.producthunt.com/r/p/{postId}?app_id=339`, `author/name` (отображаемое имя, без username) | описание, голоса, комментарии, топики/теги, сайт продукта напрямую, мейкеры (список), username/соцсети/e-mail, миниатюра, рейтинг |

### 2.4 Объём и поведение выборки (эмпирика; официального описания логики нет — «нет данных»)
- **50 записей на запрос** (главный фид, 12 category-фидов и fallback — все ровно 50).
- Состав динамический: 2 запроса главного фида с интервалом ~40 с → 49 из 50 общих; 13:18 → 13:28 UTC (10 мин) → 44 из 50 общих (6 вышло, 6 вошло); 13:18 → 13:37 UTC (19 мин) → 43 из 50 общих (7 новых). Порядок не хронологический (проверено: не сортирован ни по `published`, ни по `updated`); позиции записей между запросами меняются.
- `published` — это **дата создания поста (черновика), а не день запуска**: «Monospace from Directus» имеет `published` 2026-09-15 (feed `category=developer-tools`), но в лидерборде занял #1 за 2026-10-01 (https://www.producthunt.com/leaderboard/daily/2026/10/1); «WikiFix for Confluence»: `published` 2026-08-07, на странице продукта «Launching today» и Day Rank #8 (WebFetch). Диапазон `published` главного фида: 2026-07-17 … 2026-10-03.
- `updated` у всех записей — в пределах последних ~1,5 часа (05:03–06:18 PDT 2026-10-04) — отражает не дату запуска.
- Приблизительная семантика (вывод из сопоставления с лидербордами, [ОЦЕНКА]): в фиде 9 из 10 продуктов top-10 лидерборда за 2026-10-03 и 0 из 10 за 2026-10-02, 2026-10-01, 2026-09-30, 2026-09-29 → главный фид ≈ «рейтинг текущих/последних суток», а не поток всех новых запусков. Состав выборки (первый снимок 13:18 UTC) см. §2.7.
- `author` = пользователь, создавший пост (в API-схеме `Post.user` — «User who created the Post»), то есть **хантер/сабмиттер, а не обязательно мейкер**. В выборке 11 из 50 записей принадлежат 4 авторам с 2–5 постами (fmerian ×5, Justin Jincaid ×2, Rohan Chaubey ×2, Zac Zuo ×2). Профиль fmerian показывает 462 hunted products (WebFetch 2026-10-04).

### 2.5 Тематические фиды: `?category=<slug-топика>` (в документации не описаны; найдено экспериментом)
| slug | HTTP | записей | диапазон `published` |
|---|---|---|---|
| (без параметра) | 200 | 50 | 2026-07-17 … 2026-10-03 |
| developer-tools | 200 | 50 | 2026-08-11 … 2026-10-03 |
| artificial-intelligence | 200 | 50 | 2026-09-12 … 2026-10-03 |
| saas | 200 | 50 | 2026-06-09 … 2026-10-01 |
| vibe-coding | 200 | 50 | 2026-03-10 … 2026-09-30 |
| no-code | 200 | 50 | 2025-01-05 … 2026-09-24 |
| productivity | 200 | 50 | 2026-08-07 … 2026-10-03 |
| web-app | 200 | 50 | 2025-10-01 … 2026-10-03 |
| tech | 200 | 50 | 2026-04-25 … 2026-10-03 |
| fintech | 200 | 50 | 2026-03-20 … 2026-10-01 |
| marketing | 200 | 50 | 2026-02-11 … 2026-10-03 |
| design-tools | 200 | 50 | 2026-06-15 … 2026-10-03 |
| open-source | 200 | 50 | 2026-08-11 … 2026-10-03 |
| nonexistent-topic-xyz | 200 | 50 | = главный фид (50/50 общих записей) |

- Проверка, что фильтр реальный: `developer-tools` ∩ главный фид = 15–20 из 50; `artificial-intelligence` ∩ главный фид = 18–21 из 50 (3 снимка), множества заметно различаются.
- Глубина по времени зависит от топика (для `vibe-coding` 50 записей охватывают ~6,5 мес., для `no-code` ~20 мес.) → в таких топиках в фиде лежат записи, возраст которых — месяцы.
- Адреса вида `/topics/<slug>/feed`, `/posts/feed`, `/products.atom`, `/leaderboard/daily/…/feed` вернули HTTP 403 (страница Cloudflare challenge — не 404, поэтому о существовании ничего сказать нельзя).
- Поведение `?category=` не документировано → может измениться без уведомления.

### 2.6 Как из фида получить сайт продукта
Ссылка «Link» в `content` = `https://www.producthunt.com/r/p/{postId}?app_id=339` (postId берётся из `<id>`). Проверено WebFetch 2026-10-04: **HTTP 301 Moved Permanently → `https://wikifix.ai/?ref=producthunt`**. robots.txt явно разрешает этот путь (`Allow: /r/p/*`, см. §3). Из песочницы curl на этот URL получает Cloudflare challenge (HTTP 403, `cf-mitigated: challenge`) — доступность для собственного HTTP-клиента с других IP **не проверена**.

### 2.7 Состав первого снимка главного фида (13:18 UTC; id · дата `published` (мм-дд) · название; имена авторов опущены — минимизация персональных данных)
1217369·08-07·WikiFix for Confluence | 1257247·09-21·Octri.dev | 1266122·09-30·opensend.cc | 1206370·07-25·Art4 | 1259946·09-24·CoreSpeed | 1264719·09-29·DocsAlot MCP Connector | 1251848·09-15·Sente | 1262134·09-26·Rival Workshop | 1266517·10-01·Cursor Remote Lite | 1261363·09-25·Blume 2.0 | 1267919·10-02·qarunbook | 1266069·09-30·Clair | 1268847·10-03·NotchMate | 1268851·10-03·Aperture | 1266545·10-01·Angebotsmeister | 1264913·09-29·ChatGPT Space | 1268954·10-03·Sellio | 1268339·10-03·Thinking Orbs | 1268204·10-02·Pass Designer | 1266015·09-30·Gemini 4 Argon | 1268802·10-03·Smooth Recorder | 1263814·09-28·Control My Mac | 1268042·10-02·TinyFolder | 1266191·09-30·Snapset | 1264054·09-28·Calnio | 1264350·09-29·JOGAK | 1269060·10-03·Poddle | 1264536·09-29·Cupola | 1268520·10-03·FlexChords | 1262155·09-26·Translate Like Me | 1248704·09-12·Sorcrr | 1268906·10-03·LaunchReel | 1267809·10-02·Blenny | 1264825·09-29·Quven | 1267801·10-02·Pixel Soup | 1268853·10-03·Capybara Court | 1268362·10-03·Eat Train Feel | 1268160·10-02·Muse Gadgets | 1267818·10-02·Kindle 2026 | 1264658·09-29·Prefer | 1254817·09-18·miso.com | 1259794·09-23·ZooWork | 1263873·09-28·FeelMyMac | 1262057·09-26·Notchware | 1267705·10-02·eu/jev | 1257580·09-21·SCMD | 1198913·07-17·Deskcord.chat | 1260956·09-25·WattMate | 1266347·10-01·Crowny! | 1260944·09-25·MacCam

Авторы с несколькими записями в снимке: fmerian ×5, Justin Jincaid ×2, Rohan Chaubey ×2, Zac Zuo ×2 (остальные 39 авторов — по одной записи).

---

## 3. robots.txt (https://www.producthunt.com/robots.txt) — дословно (WebFetch и Exa дали идентичный текст, 2026-10-04)

```
User-agent: *

Allow: /sitemaps_v3/*

Disallow: /auth/*

Disallow: /search*
Disallow: /*?*comment=*
Disallow: /*?*review=*

Disallow: /my/*
Disallow: /yours*
Disallow: /notifications
Disallow: /@*/*

# Auth-gated and redirect-only endpoints — no indexable content.
# `$` anchors the match so post/discussion/forum slugs starting with
# "new" (e.g. /p/news) remain crawlable.
Disallow: /login$
Disallow: /p/new$
Disallow: /discussions/new$
Disallow: /forums/new$

# Disable short links leading to external websites
# ========================
Disallow: /r/*

# Explicitly allow shortlink to posts
Allow: /r/p/*

# Disable indexing of search
Disallow: /search*

Sitemap: https://www.producthunt.com/sitemaps_v3/root_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/stories_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/topics_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/newsletters_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/forums_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/discussions_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/product_about_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/product_alternatives_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/product_reviews_sitemap.xml.gz
Sitemap: https://www.producthunt.com/sitemaps_v3/products_categories_sitemap.xml.gz

User-agent: SemrushBot
Crawl-delay: 1

User-agent: SiteAuditBot
Crawl-delay: 1
```

Разбор по путям (моё прочтение, по правилу «самое длинное совпадение побеждает»):
| Путь | Статус по robots.txt |
|---|---|
| `/feed`, `/feed?category=…` | не запрещён |
| `/products/{slug}`, `/leaderboard/…`, `/topics/…`, `/categories/…` | не запрещены |
| `/r/p/{id}` (редирект на сайт продукта из фида) | **разрешён** (`Allow: /r/p/*` длиннее, чем `Disallow: /r/*`) |
| прочие `/r/*` (короткие ссылки на внешние сайты) | **запрещены** (комментарий в файле: «Disable short links leading to external websites») |
| `/@username` (корень профиля) | не запрещён; подпути `/@username/…` — запрещены (`/@*/*`) |
| `/search*`, `/auth/*`, `/my/*`, `/yours*`, `/notifications`, `/login`, URL с `comment=`/`review=` | запрещены |
| `/sitemaps_v3/*` | явно разрешены |
| `Crawl-delay` | только для SemrushBot и SiteAuditBot (1 с); для `*` не задан — «нет данных» о рекомендованной частоте |

Отдельно: правил для AI-краулеров (GPTBot и т. п.) в файле нет. robots.txt на хосте API (api.producthunt.com/robots.txt) — не получен (Cloudflare challenge 403).

---

## 4. Sitemaps (проверено curl 2026-10-04)

`https://www.producthunt.com/sitemaps_v3/*.xml.gz` → HTTP 301 на `https://d29lzieai721mu.cloudfront.net/sitemaps_v3/*.xml.gz` (Location из ответа WebFetch). С CloudFront curl получает HTTP 200 (`application/x-gzip`).

| Файл | URL-ов | Размер gz | Last-Modified | lastmod min … max |
|---|---|---|---|---|
| root_sitemap | 13 (3 015 байт XML; /about, /apps, /sponsor и 10 страниц golden-kitty-awards/hall-of-fame) | 499 Б | 2026-10-04 13:01:29 GMT | — |
| product_about_sitemap | **21 482** (`/products/{slug}`) | 284 309 Б | 2026-10-04 13:02:12 GMT | 2025-10-27 … 2026-10-04T06:01:42-07:00 |
| product_alternatives_sitemap | 21 040 | 280 316 Б | 2026-10-04 05:02:22 GMT | 2026-01-20 … 2026-10-03 |
| product_reviews_sitemap | 5 337 | 72 216 Б | 2026-10-04 05:02:23 GMT | 2025-10-27 … 2026-10-03 |
| products_categories_sitemap | 250 | 3 977 Б | 2026-10-04 05:02:23 GMT | 2026-03-18 … 2026-10-03 |
| topics_sitemap | 424 | 5 391 Б | 2026-10-04 05:01:35 GMT | 2026-09-23 … 2026-10-03 |
Остальные (stories, newsletters, forums, discussions) не открывал.

- В product_about_sitemap записей с `lastmod` ≥ 2026-10-03: **2 958** → `lastmod` обновляется при любых изменениях страницы продукта, это **не признак нового запуска**. Новых запусков в sitemap по дате не выделить («нет данных»).
- В sitemap нет ни мейкеров, ни сайтов продуктов, ни тегов — только URL страниц PH.

---

## 5. Cloudflare challenge — что отдаёт curl (песочница, датацентровый IP)

Признак: HTTP 403, `content-type: text/html`, тело «Just a moment...», заголовок `cf-mitigated: challenge`.
| URL | curl | Другие клиенты |
|---|---|---|
| /feed, /feed?category=… | **200** (Atom) | — |
| /feed.xml, /feed.rss | 404 (настоящая страница 404) | — |
| /robots.txt | 403 challenge | WebFetch, Exa: 200 |
| /products/wikifix | 403 challenge | WebFetch: открыл |
| /r/p/1217369?app_id=339 | 403 challenge | WebFetch: 301 → сайт продукта |
| /llms.txt | 403 challenge | Exa: открыл |
| /leaderboard/daily/2026/10/1 (в т. ч. с `Accept: text/markdown`) | 403 challenge | Exa: «LLM-представление» |
| /sitemaps_v3/root_sitemap.xml.gz | 403 challenge | WebFetch: 301 на CloudFront; CloudFront: 200 |
| api.producthunt.com/v1/posts, api.producthunt.com/robots.txt | 403 challenge | — |
| api.producthunt.com/v2/api/graphql (POST без токена) | 401 JSON (не challenge) | — |
| api.producthunt.com/v2/docs | 200 | — |

Вывод по факту: с этой сети без браузерного движка доступны только `/feed*`, API и документация; HTML-страницы PH закрыты managed-challenge. Поведение с других IP (например, из Украины/резидентных) — **не проверено**.

---

## 6. Официальный API v2 (GraphQL)

Источник: https://api.producthunt.com/v2/docs (Exa, дословно; WebFetch подтвердил ключевые фразы).

### 6.1 Эндпоинты и авторизация
- Endpoint: `https://api.producthunt.com/v2/api/graphql` (POST, `Authorization: Bearer {token}`).
- Цитаты:
  - «The API is reachable at https://api.producthunt.com/v2/api/graphql»
  - «Currently the API is only accessible with a provided access_token.»
  - «By default all apps are read-only i.e they have `public` scope.»
  - Три scope: Public («Access public information on Product Hunt»), Private, Write. Про write: «As part of API 2.0 we have decided to give partial write access to third party applications depending on the use-case. If your application needs it feel free to get in touch with us at hello@producthunt.com.»
- Способы получить токен:
  1. **OAuth user** — `https://api.producthunt.com/v2/oauth/authorize` → `POST https://api.producthunt.com/v2/oauth/token`.
  2. **OAuth client-only (client_credentials)** — `POST /v2/oauth/token` с `client_id`, `client_secret`, `grant_type=client_credentials`; в примере ответ `{"access_token": ..., "token_type": "bearer", "scope": "public"}`; «Please remember that this tokens limit you to public endpoints that don't require user context.» Срок жизни токена в доках не указан — «нет данных».
  3. **Developer token** — «We provide a developer_token (does not expire, linked to your account) in the API dashboard». Для «simple scripts»: «The oauth2 flow is a bit of a overkill if you just want to run a few scripts». URL dashboard (по сторонним источникам: PyPI producthunt-sdk, api-evangelist): https://www.producthunt.com/v2/oauth/applications — **не открывал** (нужен логин PH).
  4. **PKCE** для публичных клиентов (только S256, без client_secret).
- Живая проверка 2026-10-04: POST на graphql без токена → HTTP 401 `{"data":null,"errors":[{"error":"invalid_oauth_token","error_description":"Please supply a valid access token. Refer to our api documentation about how to authorize an api request. Please also make sure you require the correct scopes. Eg \"private public\" for to access private endpoints."}]}`.
- API v1 — deprecated: Indie Hackers 2023-03-01 (https://www.indiehackers.com/post/rip-product-hunt-api-what-it-means-for-developers-f212f20779): «V1 API is deprecated … seems to be fully shut down later this year» — **устарело (до 2025)**; `api.producthunt.com/v1/posts` сейчас отдаёт challenge 403.

### 6.2 Лимиты (первоисточник: https://api.producthunt.com/v2/docs/rate_limits/headers, Exa дословно)
- «Rate limiting is applied per application. There are two types of rate limits for API V2 based on the endpoint being accessed.»
- «1. Complexity based(applicable to '/v2/api/graphql' endpoint): The application has quota of **6250 complexity points for every 15 minutes**. Complexity of each request is calculated based on the fields requested.»
- «2. Request based(applicable to all other '/v2/*' endpoints): The application can make up to **450 requests every 15 minutes**.»
- «Once the rate limit is reached, the API will return status 429 (Too Many Requests) until the rate limiting period is reset.»
- Заголовки ответа: `X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, `X-Rate-Limit-Reset` (секунд до сброса).
- «We may on occasion adjust the rate limit depending on API traffic. If your application requires a higher rate limit. Please contact us.»
- Общий документ: «We reserve the right to rate-limit any application if we feel you are not following fair-use.» / «If you require faster access without rate limit please contact us.»
- «нет данных»: формула стоимости полей/connections (сколько очков стоит `posts(first:N)` с вложенными `makers`/`topics`); максимальный `first`. Сторонний skill (agentskills.so, 2026-02-19) называет «~900 requests per 15 minutes, complexity limit of 1000 per query» — **расходится с первоисточником, не подтверждено**; «900» встречается в доках только как значение `X-Rate-Limit-Limit` в примере для GET /v2/oauth/token.

### 6.3 Схема данных (docs-сайт https://api-v2-docs.producthunt.com — актуальнее GitHub-схемы)
Query root (WebFetch страницы /operation/query/): `collection, collections, comment, post, posts, topic, topics, user, viewer`.
Аргументы `posts` (WebFetch: «featured, order, postedAfter, postedBefore, topic, twitterUrl, url»; по GitHub-схеме ещё `after, before, first, last`): `featured: Boolean` («Select Posts that have been featured or not featured»), `order: PostsOrder` (по умолчанию RANKING; значения FEATURED_AT, NEWEST, RANKING, VOTES), `postedAfter/postedBefore: DateTime`, `topic: String` (slug), `twitterUrl: String`. Текстового поиска по постам нет.

**Post** (https://api-v2-docs.producthunt.com/object/post/, Exa дословно по полям):
| Поле | Тип | Описание из доки |
|---|---|---|
| id, slug | ID!, String! | ID; «URL friendly slug of the Post» |
| name | String! | «Name of the Post» |
| tagline | String! | «Tagline of the Post» |
| description | String | «Description of the Post in plain text» |
| url | String! | «URL of the Post on Product Hunt» |
| website | String! | **«URL that redirects to the Post's website»** |
| productLinks | [ProductLink!]! | у ProductLink два поля: `type: String!`, `url: String!` (описаний нет) |
| votesCount, commentsCount | Int! | «Number of votes that the object has currently» / «Number of comments made on the Post» |
| reviewsCount, reviewsRating | Int!, Float! | отзывы |
| dailyRank, weeklyRank, monthlyRank, yearlyRank | Int | ранги |
| createdAt, featuredAt, scheduledAt | DateTime | создан / «when the Post was featured» / запланирован |
| thumbnail, media | Media, [Media!]! | `Media`: `type`, `url(height,width)`, `videoUrl` |
| topics | TopicConnection! | `Topic`: id, name, slug, description, postsCount, followersCount, url, image, createdAt |
| makers | [User!]! | «Users who are marked as makers of the Post» |
| user, userId | User!, ID! | «User who created the Post» |
| comments, votes, collections | connections | `Comment`: body, createdAt, votesCount, url, user, parent…; `Vote`: createdAt, user |
| isVoted, isCollected | Boolean! | признаки «viewer» |

Поля `dailyRank…yearlyRank`, `productLinks`, `reviewsCount`, `scheduledAt` и аргумент `posts(url:…)` есть на docs-сайте, но **отсутствуют** в `schema.graphql` из GitHub-репозитория (который ещё содержит удалённые `goals`/`makerGroups`) → GitHub-схема устарела.

**User** (https://api-v2-docs.producthunt.com/object/user/): описание типа дословно — «A user. **Most fields are only available for the currently-accessing user, otherwise they are redacted to protect users' privacy.**» Поля: id, name, username, headline, twitterUsername, websiteUrl, profileImage, coverImage, url, createdAt, followersCount, followingCount, isMaker, isFollowing, isViewer; connections madePosts, submittedPosts, votedPosts, followers, following, followedCollections. Поля e-mail у User **нет**.

### 6.4 Редакция данных о людях (мейкеры, хантеры, комментаторы)
- Docs-сайт (цитата выше): поля других пользователей «redacted».
- GitHub-issue #342 «Trying to fetch another maker data» (producthunt/producthunt-api, **открыт 2025-12-23**, статус Open, ответа нет; WebFetch): API вернул для чужого мейкера `"name"`, `"url"`, `"username"` = `"[REDACTED]"`, остальные поля null/пусто.
- Issue #286 (2023-03-13, closed): `"user": {"id": "0", "name": "[REDACTED]"}`; #279 (2023-02-27): «it doesn't return the Makers anymore … (only "Redacted" for all)»; #288, #284 (март 2023, open) — **устарело (до 2025)**, но подтверждает давность политики.
- Indie Hackers 2023-03-01: изменение произошло ~24–25 февраля 2023, `twitter_username` стал `None`, имена/юзернеймы — «redacted»; ответ поддержки о «permanent change» процитирован автором скриншотом (текст не извлечён) — **устарело (до 2025)**.
- PyPI producthunt-sdk v0.2.0 (загружен 2026-01-04, https://pypi.org/project/producthunt-sdk/): таблица «Data Access Limitations» — «Comments on posts: Text only (commenter info redacted)»; «Other users' profiles, posts, votes, followers: Redacted»; «For extended access to user data, contact Product Hunt at hello@producthunt.com.»
- Живой вызов с токеном **не выполнен** → актуальное (октябрь 2026) содержимое `makers {…}` проверено только косвенно (docs 2026-10-04, issue 2025-12-23, SDK 2026-01-04).
- В веб-интерфейсе та же информация видна: страница продукта перечисляет мейкеров (display name + ссылка `/@username`, WebFetch на /products/wikifix), профиль `/@username` показывает секцию «Links» (GitHub, Twitter/X, свои ссылки как href; WebFetch на публичный профиль). Но это HTML-страницы: ToS (h) запрещает crawl/scrape, ссылки закрыты Cloudflare (см. §5, §7).

### 6.5 Прочее по API
- Ссылка «API Explorer» из доков (https://ph-graph-api-explorer.herokuapp.com/) → HTTP 404 «No such app» (мёртвая).
- Пример запроса из доков (дословно): `{"query": "query { posts(first: 1) { edges { node { id, name } } } }"}`; в примере ответа `X-Rate-Limit-Limit: 6250`.
- Атрибуция (доки): «We kindly ask that you include attribution in your project, linking back to Product Hunt. We'd also appreciate those that include a Product Hunt logo».
- Официального MCP/SDK от PH не найдено (WebSearch): есть сообщественные (напр. jaipandya/producthunt-mcp-server, PyPI producthunt-sdk).
- Changelog/анонсы изменений API 2025–2026 — «нет данных».

---

## 7. ToS и условия использования

### 7.1 Документация API (https://api.producthunt.com/v2/docs, Exa дословно, 2026-10-04) — **два места**
1. В разделе Privileges: «The Product Hunt API must not be used for commercial purposes. If you would like to use it for your business, please contact us at hello@producthunt.com.»
2. Раздел «May I use the API for my business?»: «By default the Product Hunt API must not be used for commercial purposes. If you would like to use it for your business, please contact us at hello@producthunt.com.»
- Отдельного документа «API Terms/Developer Terms» не найдено (поиск 2026-10-04; в /legal раздела про API-условия нет — WebFetch). Условия при создании приложения в dashboard — **нет данных** (нужен логин).
- Лимита на хранение/срок хранения данных API в доках **нет** — «нет данных».

### 7.2 Terms of Service (https://www.producthunt.com/legal; «Effective date: August 17th 2014» — формально **устарело (до 2025)**, но это действующая версия: страница жива 2026-10-04; контрагент — PRODUCT HUNT, INC., 720 York St #116, San Francisco)
Дословно (Exa):
- «These Terms include the provisions in this document, as well as those in the Privacy & Cookies Policy and Copyright Dispute Policy.»
- «Your using the Services in any way means that you agree to all of these Terms»
- «**You will only use the Services for your own internal, personal, non-commercial use, and not on behalf of or for the benefit of any third party**, and only in a manner that complies with all laws that apply to you.»
- Пункты запретов («you will not … otherwise use the Services or interact with the Services in a manner that»):
  - «(g) Runs Maillist, Listserv, any form of auto-responder or "spam" on the Services, or any processes that run or are activated while you are not logged into the Services, or that otherwise interfere with the proper working of the Services (including by placing an unreasonable load on the Services' infrastructure);»
  - «(h) "Crawls," "scrapes," or "spiders" any page, data, or portion of or relating to the Services or Content (through use of manual or automated means);»
  - «(i) Copies or stores any significant portion of the Content;»
  - «(j) Decompiles, reverse engineers, or otherwise attempts to obtain the source code or underlying ideas or information of or relating to the Services.»
- «A violation of any of the foregoing is grounds for termination of your right to use or access the Services.»
- «The Services may allow you to copy or download certain Content; please remember that just because this functionality exists, doesn't mean that all the restrictions above don't apply – they do!»
- Choice of Law; Arbitration: право штата Калифорния; споры — арбитраж JAMS в San Francisco County, на английском; «class arbitrations and class actions are not permitted».
- Отдельного исключения для публичного Atom-фида или для API в ToS **нет** («нет данных»).

### 7.3 Privacy & Cookies Policy (тот же URL; «Effective date: January 1, 2020» — **устарело (до 2025)**, но действует)
- «In addition, your Personal Data you choose to add to your profile as well as most Content you choose to post will be available for public viewing on the Service.»
- Таблица «Who We Share Your Personal Data With», строка **«API Users — Certain third parties have API access to portions of the Site to enable businesses and startups to build affiliated services and products (either alone or jointly with us).»** (то есть PH сам признаёт «businesses and startups» как API-партнёров).
- Строка «Advertisers and other Businesses — Certain users of the Services may have access to your Personal Data for the purpose of enabling them to interact with you and more effectively offer and provide products and services to you through the Site …»
- «If you request that we remove your Personal Data … we will convey that request to any third party with whom we have shared your data.»

### 7.4 Help-center и руководства (WebFetch, пересказ)
- Product Hunt Featuring Guidelines (https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines), «Last Updated: March 10, 2026»: не фичерятся waitlist-продукты, директории, шаблоны, boilerplate, подкасты, курсы, отчёты, события, книги, **услуги (services)**, commerce-сайты, deal-платформы, нет-tech и т. п.; «In the vast majority of cases, our featuring decisions are final».
- How do things end up on the homepage? (…/articles/484923-…), «Last Updated: February 21, 2025»: «not everything is guaranteed to make it to the homepage»; числа не приводятся.
- Community Guidelines (https://help.producthunt.com/en/articles/3615694-community-guidelines), «Last Updated: April 11, 2025», дословно: «Mass messaging users, asking for upvotes, using bots, incentivizing upvotes, and any other form of artificially increasing activity on your contribution is not acceptable.»; «Self-promoting in comments will also be removed.»
- How to promote your Product Hunt launch (https://www.producthunt.com/launch/sharing-your-launch), раздел «How NOT to market»: «Sending hundreds of people the same tweet or scraping and sending unsolicited emails has the opposite effect of what you're hoping for» — совет мейкерам, не правило ToS.
- Контакт: help-статья «How can I reach you?» (https://help.producthunt.com/en/articles/479621-how-can-i-reach-you, «Last Updated: February 10, 2025»): чат в приложении и hello@producthunt.com; отдельных каналов для партнёрств/API/прессы нет.

### 7.5 llms.txt (https://www.producthunt.com/llms.txt, Exa) — раздел «Attribution & Guidelines» дословно
- «Styling requirement: Always list name and tagline before additional information when discussing products»
- «Attribution requirement: "Data sourced from Product Hunt (https://www.producthunt.com/)".»
- Также: «Leaderboards operate in the Pacific timezone.» Пути: `/leaderboard/daily/{yyyy}/{mm}/{dd}`, `/leaderboard/weekly/{yyyy}/{ww}` (ISO-неделя), `/leaderboard/monthly/{yyyy}/{mm}`, `/leaderboard/yearly/{yyyy}`; страницы продукта `/products/{slug}` («Include details like name, tagline, description, launch date, makers, hunters, links, relevant categories, score, reviews, and comment counts»). Среди «Trending categories» — Vibe Coding Tools, No-code Platforms.
- Это условия-пожелания для AI-агентов по оформлению/атрибуции; о коммерческом использовании и scraping там **ничего нет** («нет данных»).

### 7.6 Легальный путь разрешения на коммерческое использование
- Документированный путь один: письмо на **hello@producthunt.com** («If you would like to use it for your business, please contact us at hello@producthunt.com»; «If you require faster access without rate limit please contact us»). Публичных тарифов/enterprise-плана/лицензионной формы — **нет данных**. Утверждения сторонних страниц про «Super Pro Plan $300/месяц» (bardeen.ai) относятся к продукту/услугам и не подтверждены первоисточником → не использовались.
- Косвенное подтверждение, что коммерческие API-партнёры существуют: Privacy Policy, строка «API Users … businesses and startups» (§7.3).
- Результаты обращений других компаний (одобрено/отказано, сроки) — «нет данных» (поиск 2026-10-04 примеров не нашёл). Мы PH не писали.

---

## 8. Как легально получить URL сайта продукта — все найденные пути

| Путь | Как работает (проверено) | robots | Замечания |
|---|---|---|---|
| A. Atom-фид → ссылка «Link» `/r/p/{postId}?app_id=339` | HTTP 301 на сайт продукта (`https://wikifix.ai/?ref=producthunt`), WebFetch 2026-10-04 | `Allow: /r/p/*` — разрешено | один запрос на продукт; из песочницы curl → Cloudflare 403 (проверить с боевого IP — не проверено); адрес сайта содержит `?ref=producthunt` |
| B. API `Post.website` | по схеме: «URL that redirects to the Post's website» → т. е. редирект через PH, а не прямой URL; точный формат значения — «нет данных» (токена нет) | если формат `/r/<токен>` — попадает под `Disallow: /r/*` (не проверено) | нужен токен; коммерческий запрет API |
| C. API `Post.productLinks[{type,url}]` | типы и значения не проверены — «нет данных» (поле `type` без описания) | — | могут быть ссылки на соцсети/сайт; сторонние описания утверждают «Website/Twitter/LinkedIn/GitHub/Instagram» (не первоисточник) |
| D. Страница продукта `/products/{slug}`: «Visit website» | WebFetch: `https://wikifix.ai/?ref=producthunt`, `https://iwouldpay.dev/?ref=producthunt` | не запрещена | HTML; ToS (h); curl → challenge |
| E. LLM-представление лидерборда: поле «External URL» | Exa: например `External URL: https://directus.io`; также «Launch tags», «Categories», «Score», «Comments» | не запрещён | показаны только top-10 дня; условия доступа для собственного клиента не проверены; curl → challenge |
| F. Product Hunt «Link» в ссылках `/r/…` в общем виде | — | `Disallow: /r/*` (кроме `/r/p/*`) | не использовать для краулера |

Вывод по факту: единственный путь, одновременно (1) явно разрешённый robots.txt и (2) отдаваемый публичным фидом без токена — путь A. Нюанс: сайт продукта получается только редиректом, «прямого» URL в фиде нет.

---

## 9. Объёмы запусков

### 9.1 Первичный (PH) источник: пост форума «1,100 products launched in a single 24 hour period» (https://www.producthunt.com/p/producthunt/1-100-products-launched-in-a-single-24-hour-period; автор Chris Messina; «Published: 2026-06-09», Exa)
Дословно: «The last high watermark was back in April, when we hit 1000 products launched in a single day. Before that, it was 600 products four months ago.» Комментарий в ветке: «1,100 products launched, 28 products featured. Ratio ≈ 2.5%.» (комментарий пользователя, не официальная цифра). То есть рекорды: ≈600 (≈февраль 2026) → 1 000 (апрель 2026) → 1 100 (июнь 2026) за сутки. Это **рекордные**, а не типичные дни.

### 9.2 hunted.space — «Featured Product Hunt launches» в сутки (сторонний трекер; страница «calendar data is updated hourly and might be behind other stats»)
Сентябрь 2026 (curl https://hunted.space/stats, 26 дней; формат «дата: N, день недели»):
2026-09-06: 7 (Вс) · 09-07: 10 · 09-08: 22 · 09-09: 16 · 09-10: 20 · 09-11: 21 · 09-12: 18 (Сб) · 09-13: 12 (Вс) · 09-14: 19 · 09-15: 29 · 09-16: 17 · 09-17: 28 · **09-18: 91** · 09-19: 13 (Сб) · 09-20: 14 (Вс) · 09-21: 27 · 09-22: 41 · 09-23: 16 · 09-24: 21 · **09-25: 67** · 09-26: 11 (Сб) · 09-27: 8 (Вс) · 09-28: 22 · 09-29: 33 · 09-30: 40 · 10-01: 39.
Статистика (мой расчёт): n=26, сумма 662, **среднее 25,5, медиана 20,5**, min 7, max 91; будни (n=19) среднее 30,5 / медиана 22; выходные (n=7) среднее 11,9; без выбросов 67 и 91 (n=24): среднее 21,0 / медиана 19,5. Причина выбросов в пятницы 18 и 25 сентября неизвестна («нет данных»; возможно артефакт трекера).

Помесячно (curl hunted.space/product-hunt-launch-history/<год>/<месяц>; среднее featured в день; min–max):
| Месяц | Дней | Среднее | Медиана | min–max |
|---|---|---|---|---|
| 2025-03 | 31 | 13,6 | 14 | 6–31 |
| 2025-06 | 30 | 16,9 | 16,5 | 5–34 |
| 2025-09 | 30 | 13,8 | 12,5 | 5–36 |
| 2025-12 | 31 | 12,4 | 12 | 5–31 |
| 2026-01 | 31 | 14,1 | 14 | 4–31 |
| 2026-03 | 31 | 22,0 | 21 | 5–71 |
| 2026-05 | 31 | 26,9 | 22 | 5–82 |
| 2026-07 | 31 | 17,2 | 15 | 5–57 |
| 2026-08 | 31 | 17,9 | 18 | 5–28 |
| 2026-09 (до 10-01) | 26 | 25,5 | 20,5 | 7–91 |

### 9.3 hunted.space — ВСЕ запуски в сутки (страницы «All launches», curl; считал уникальные ссылки на дашборды; featured идут первыми с рангом, остальные — без ранга)
| Дата (день) | Всего запусков | Featured (из §9.2) |
|---|---|---|
| 2026-09-07 (Пн) | 701 | 10 |
| 2026-09-10 (Чт) | 793 | 20 |
| 2026-09-14 (Пн) | 725 | 19 |
| 2026-09-17 (Чт) | 761 | 28 |
| 2026-09-21 (Пн) | 679 | 27 |
| 2026-09-24 (Чт) | 607 | 21 |
| 2026-09-27 (Вс) | 485 | 8 |
| 2026-09-28 (Пн) | 611 | 22 |
| 2026-09-29 (Вт) | 503 | 33 |
| 2026-09-30 (Ср) | 552 | 40 |
| 2026-10-01 (Чт) | 545 | 39 |
Расчёт: n=11, сумма 6 962, **среднее ≈633/сутки, медиана 611, min 485, max 793**; сумма featured = 267 → **доля featured ≈ 3,8 %** (267/6 962). Источник — сторонний трекер, полнота охвата не проверялась.

### 9.4 Независимая оценка по росту Post ID [ОЦЕНКА]
По 133 постам из всех снятых фидов, созданным 2026-09-26 … 2026-10-03 (дата `published` ↔ числовой ID из `<id>`): линейная регрессия ≈ **1 016 ID/сутки**; по крайним точкам (ID 1261662 @ 2026-09-26 03:22 PDT → ID 1269060 @ 2026-10-03 21:39 PDT) ≈ **953 ID/сутки**. Обоснование: ID постов последовательны, значит разница ID за время ≈ число созданных постов (включая черновики и отложенные) — это **верхняя граница** числа запусков и согласуется по порядку величины с «1 000–1 100» (§9.1) и ≈633 «All launches» (§9.3; ID включает неопубликованные черновики).

### 9.5 Доля featured: вторичные цифры
- Рабочая цифра 2026: 2,5 % (28/1 100, §9.1, комментарий) и ≈3,8 % (§9.3, расчёт).
- «Only 10 % of product launches on Product Hunt now receive featured status, down from 60 % to 98 % between 2020 and 2023» — Tetriz.io через Awesome Directories (Nov 2025), пересказ shno.co (https://www.shno.co/marketing-statistics/product-hunt-launch-statistics): данные сентября 2024, вторичный источник → **устарело (до 2025)**; в том же материале «September 2024 saw over 4,000 product launches … averaging 11 daily» — **внутренне противоречиво** (4 000/30 ≈ 133), не использовать. Первоисточник Tetriz не найден.
- PH о curated-лидерборде: Gabe Perez (ведущий кураторской работы PH), AMA 2025-03-20 (https://www.producthunt.com/p/producthunt/i-decide-what-s-featured-on-the-leaderboard-ama-w-gabe-from-product-hunt): «I actually try to test every single thing that gets hunted every day... which is A TON»; «AI for example is having a massive boom … the likelihood of a product that has AI will be featured is higher» (Exa, дословно).

### 9.6 Доля AI и dev-tools
**(а) Выборка top-10 лидерборда по 7 дням** (LLM-представление страниц https://www.producthunt.com/leaderboard/daily/2026/9/25, 9/28, 9/29, 9/30, 10/1, 10/2, 10/3; Exa; поле «Launch tags» — до 3 тегов; n=70). Страница за 10/3 имела «Next daily: N/A» (на момент кэша Exa день мог быть неполным). Выборка смещена в сторону самых популярных запусков.
| День | Продукт (ранг 1…10) — теги |
|---|---|
| 09-25 | PixVerse R2 — Developer Tools, Artificial Intelligence, Games; Bleetz Network — Venture Capital, AI, Fundraising; Quiver GTM — Marketing, Developer Tools, AI; 10xJoy — Productivity, AI, Vercel Day; DEV·TV — Open Source, TV, Developer Tools; Designeer — Design Tools, Developer Tools, AI; Wand — Productivity, Developer Tools, AI; Howseen AI — Marketing, SEO, AI; Promptic — SaaS, Developer Tools, AI; SocialGPT — Social Media, AI, Photo & Video |
| 09-28 | MCP Connectors by Databox — Analytics, SaaS, AI; SaleSmartly — Messaging, Sales, Social Media; Statable Analytics — Analytics, AI; Vitals — Mac, Developer Tools, Menu Bar Apps; VibeDefend — Developer Tools, Security, Vibe coding; Okara — Social Media, Marketing, AI; GenCode — Developer Tools, AI, Tech; Shotcandy — Design Tools, Social Media, Marketing; Microsoft Copilot — Windows, SaaS; Dina 4.5 — Design Tools, Productivity, Video |
| 09-29 | iFixAi — API, Developer Tools, AI; LUCI Desktop — Productivity, AI; ZenABM — Advertising, AI, LinkedIn; Claude Sonnet 5.5 — API, Developer Tools, AI; Semos.ai Manager Agents — Meetings, AI, Human Resources; Paste 7 — Mac, Productivity, AI; Hopscotch AI — Developer Tools, AI, Tech; Would you pay? — Marketing, SaaS, Startup Lessons; Timeless Code — Meetings, Developer Tools, AI; Jotform Sign — Productivity, SaaS, AI |
| 09-30 | Pexo — Marketing, AI, Video; Ferndesk — Customer Success, Customer Communication, AI; CrawlRaven MCP — Analytics, Marketing, SEO; NotchDodo — Mac, Productivity, Menu Bar Apps; GitBot — Open Source, AI, GitHub; Autonomyware — Hardware, AI, 3D Modeling; Upsolve Data Models — Analytics, Developer Tools, AI; Datastory — AI, Data & Analytics, Data Visualization; Aktar — Mac, Productivity, Developer Tools; Evlat — Mac, Developer Tools, AI |
| 10-01 | Monospace from Directus — API, Developer Tools, Data; Yedric.ai — SaaS, Developer Tools, AI; Dots by OpenAI — Productivity, Task Management, AI; Omnia Agent — Marketing, SEO, AI; Polylane — Developer Tools, AI, Tech; DSH Desktop — Productivity, Open Source, AI; statusbar — Open Source, GitHub; Chat.sh — Customer Success, SaaS, AI; Bracket — Productivity, SaaS, AI; America.gov — Bots |
| 10-02 | Gauth Unlimited Digital Canvas — Education, AI, Online Learning; Veltrix AI for E-commerce — AI, E-Commerce, Business; Teachoo — Education, AI, Online Learning; Famulor — Android, Email, Messaging; Eleven v4 — API, AI, Audio; Mintlify Desktop — Writing, SaaS, Developer Tools; ShipHQ — Productivity, Analytics, Games; Bambu Lab R1 — Hardware, Maker Tools; Clef — Open Source, AI; Open Inspector — Chrome Extensions, Open Source, Developer Tools |
| 10-03 | ZooWork — Productivity, Developer Tools, AI; miso.com — Messaging, AI, iMessage Apps; Prefer — Marketing, SEO, Search; Muse Gadgets — Open Source, Hardware, AI; Kindle 2026 — eBook Reader, Hardware, Books; Cubicle — Open Source, Developer Tools, AI; SCMD — Open Source, Developer Tools, AI; FoundrRadio — Music, Radio, Community; Notchware — Mac, Productivity, AI; FeelMyMac — Mac, User Experience, Touch Bar Apps |
Подсчёт (python): тег «Artificial Intelligence» — **47 из 70 (67 %)**; «Developer Tools» — **24 из 70 (34 %)**; AI или Dev Tools — **54 из 70 (77 %)**; оба — 17; «SaaS» — 9; «Open Source» — 9; «Vibe coding» — 1; «No-Code» как launch-тег — 0 (но у Datastory в Categories «No-Code App Builder»). По дням AI/Dev/объединение: 9-25: 9/6/10; 9-28: 4/3/6; 9-29: 9/4/9; 9-30: 7/3/8; 10-01: 7/3/8; 10-02: 5/2/7; 10-03: 6/3/6. Наблюдение [ОЦЕНКА]: около 11 из 70 (≈16 %) — запуски крупных компаний/организаций (OpenAI, Anthropic, Microsoft, Amazon, Meta, Cloudflare, DeepSeek, ElevenLabs, Bambu Lab, Jotform, правительство США) — не целевая аудитория воронки.

**(б) Нижние границы по главному фиду** (/feed, 50 записей; пересечение с `?category=artificial-intelligence` и `?category=developer-tools`, 3 снимка 13:18–13:28 UTC): AI — **18, 19, 21 из 50 (36–42 %)**; Dev Tools — 15, 16, 20 из 50 (30–40 %); AI∪Dev — 25, 26, 29 из 50 (**50–58 %**). Это нижние границы: category-фиды ограничены 50 записями. Пересечение с `saas` 2–3, `vibe-coding` 1, `no-code` 0 из 50.

**(в) Грубая эвристика по тексту** (регулярка по названию + tagline 50 записей; ненадёжно): «AI-подобных» 23 из 50 (46 %), «dev-подобных» 11 из 50 (22 %), объединение 24 из 50 (48 %).

**(г) Официально от PH:** в рассылке Product Hunt (https://www.producthunt.com/newsletters/archive/46593-all-the-ai-that-launched-in-2025, 2025-12-28): «Of the top 15 launches on Product Hunt, thirteen were tagged "Artificial Intelligence"» (за 2025 год; 13/15 ≈ 87 %).

**Доля AI/dev среди ВСЕХ запусков (не только featured/top):** «нет данных» (топики по всем ~600 запускам/сутки без API-токена и без скрейпинга не получить).

---

## 10. Сторонние сервисы доступа к данным PH (источник заинтересован; цены с их страниц 2026-10-04)

| Сервис | Цена | Что делает | Оговорки |
|---|---|---|---|
| Apify actor `thirdwatch/product-hunt-launches-scraper` (https://apify.com/thirdwatch/product-hunt-launches-scraper.md) | «from $1.60 / 1,000 results», pay-per-event | читает **публичный Atom-фид PH** («source: Product Hunt public Atom feed»); поля: post_id, name, tagline, maker_name (=author фида), published_at, updated_at, launch_date, product_hunt_url, discussion_url, outbound_reference_url (`/r/p/{id}?app_id=339`) | «Public launch data only — no private maker info, maker email, or contact details»; 2 пользователя; `launch_date` у них = дата `published` (см. §2.4: это не день запуска) |
| Apify actor `philzx/ph-launch-intelligence` (https://apify.com/philzx/ph-launch-intelligence.md) | «$0.45 / 1,000 enriched product launches» | HTTP-скрейпинг страниц PH и внутреннего GraphQL «no Playwright, no Product Hunt API token»; комментарии, мейкеры, `websiteUrl`, опция «extractEmails» (поиск e-mail на сайтах продуктов) | 2 пользователя, без рейтингов; выходит за рамки публичного фида |
| Apify actor `memo23/producthunt-scraper` (https://apify.com/memo23/producthunt-scraper) | «$0.80 / 1,000 results»; e-mail-обогащение оплачивается отдельно «only when contacts are found» (цена не указана — «нет данных») | 50+ полей: websiteUrl, ранги, makersEnriched[], hunter (LinkedIn), harvestedEmails[] и др. | 155 пользователей, 28 активных в месяц, оценка 5.00 (WebFetch); в описании: «Users are responsible for ensuring their use complies with Product Hunt's Terms of Service, applicable data-protection law (GDPR, CCPA, etc.)» |
| Apify (платформа) https://apify.com/pricing | Free: $0/мес, «$5» включённого использования; Starter: $19/мес, «$19» включено (WebFetch) | — | — |
Арифметика (мой расчёт): 50 записей/день × 30 = 1 500 результатов/мес → $0,68 (0,45) / $1,20 (0,80) / $2,40 (1,60) в мес. при тарификации за результаты (не считая платформы).
Юридическая справка (не юридическая консультация; пересказ WebSearch-резюме, не первоисточников судов): hiQ v. LinkedIn (9th Cir.) — доступ к публичным данным без авторизации не нарушает CFAA, но возможны иски по контракту/авторскому праву (https://www.fbm.com/data-analytics/publications/hiqs-groundbreaking-injunction-against-linkedin-reaffirmed-scraping-of-publicly-available-data-likely-does-not-violate-cfaa/); Meta v. Bright Data (N.D. Cal., январь 2024) — ToS Meta не применены к логаут-скрейперу публичных данных (https://techcrunch.com/2024/01/24/court-rules-in-favor-of-a-web-scraper-bright-data-which-meta-had-used-and-then-sued). Оговорки: ToS PH сформулирован шире («Your using the Services in any way means that you agree», §7.2), право — Калифорния, споры — арбитраж JAMS в Сан-Франциско, а исполнитель — украинская команда; исход спора по ToS PH — «нет данных». Случаев принудительного применения ToS PH к малым пользователям публичного фида не найдено (поиск 2026-10-04) — «нет данных».

---

## 11. Что проверено / что НЕ проверено

**Проверено вживую 2026-10-04:** /feed (структура, заголовки, 304, churn, категории, 12 slug-ов, fallback); robots.txt; API-доки и схема; ответ API без токена (401) и OAuth-эндпоинта без параметров (400); ToS/Privacy (/legal); редирект `/r/p/{id}` (301); sitemaps на CloudFront; Cloudflare-поведение (таблица §5); hunted.space (26+11 дней + 8 месяцев); PH-форум (1 100); help-center; GitHub-issues; Apify-страницы и pricing.
**НЕ проверено / нет данных:**
1. Вызов API с токеном: фактическое содержимое `Post.website`, `productLinks`, `makers{…}` в 2026 — нет токена (получение требует логина PH; коммерческий запрет).
2. Формула «complexity» запроса; максимум `first` — нет данных.
3. Содержимое dashboard (условия при создании приложения) — нужен логин.
4. Ответ PH на запрос коммерческого разрешения (срок, цена, условия) — не запрашивали; публичных тарифов нет.
5. Поведение Cloudflare для `/r/p/…` и HTML-страниц с не-датацентровых IP (из Украины и т. п.).
6. Официальная семантика отбора 50 записей /feed и поддержка `?category=` (не документированы).
7. Доля AI/dev среди всех (не featured) запусков; доля featured по официальным данным PH.
8. Дата кэша у Exa-страниц (ToS, llms.txt, лидерборды, форум); результаты WebFetch — пересказ малой моделью.
9. Фактическое качество/легальность Apify-actor-ов (не запускали).
10. Stories/newsletters/forums/discussions sitemaps — не открывал.

---

## 12. Все использованные URL
Первичные (PH): https://www.producthunt.com/feed · https://www.producthunt.com/robots.txt · https://api.producthunt.com/v2/docs · https://api.producthunt.com/v2/docs/rate_limits/headers · https://api.producthunt.com/v2/docs/oauth_client_only_authentication/oauth_token_ask_for_client_level_token · https://api-v2-docs.producthunt.com/ (object/post, user, topic, media, productlink, comment, vote; enum/postsorder; operation/query) · https://github.com/producthunt/producthunt-api (schema.graphql; issues 279, 286, 342) · https://www.producthunt.com/legal · https://www.producthunt.com/llms.txt · https://www.producthunt.com/leaderboard/daily/2026/9/25 … 10/3 · https://www.producthunt.com/products/wikifix · https://www.producthunt.com/products/would-you-pay · https://www.producthunt.com/@fmerian · https://www.producthunt.com/r/p/1217369?app_id=339 · https://d29lzieai721mu.cloudfront.net/sitemaps_v3/*.xml.gz · https://www.producthunt.com/p/producthunt/1-100-products-launched-in-a-single-24-hour-period · https://www.producthunt.com/p/producthunt/i-decide-what-s-featured-on-the-leaderboard-ama-w-gabe-from-product-hunt · https://www.producthunt.com/newsletters/archive/46593-all-the-ai-that-launched-in-2025 · https://www.producthunt.com/launch/sharing-your-launch · https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines · https://help.producthunt.com/en/articles/484923-how-do-things-end-up-on-the-homepage · https://help.producthunt.com/en/articles/3615694-community-guidelines · https://help.producthunt.com/en/articles/479621-how-can-i-reach-you
Сторонние: https://hunted.space/stats · https://hunted.space/history · https://hunted.space/product-hunt-launch-history/2026/August (и др. месяцы) · https://hunted.space/all-products/2026/October/01 (и др. дни) · https://pypi.org/project/producthunt-sdk/ · https://www.indiehackers.com/post/rip-product-hunt-api-what-it-means-for-developers-f212f20779 · https://www.shno.co/marketing-statistics/product-hunt-launch-statistics · https://agentskills.so/skills/dylanfeltus-skills-producthunt · https://github.com/api-evangelist/producthunt · https://apify.com/thirdwatch/product-hunt-launches-scraper · https://apify.com/philzx/ph-launch-intelligence · https://apify.com/memo23/producthunt-scraper · https://apify.com/pricing
