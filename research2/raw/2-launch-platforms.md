# Ось 2 — Смежные launch-площадки: RAW-дамп

> Дата проверок: **2026-10-04** (UTC, ~13:15-13:50). Все «живые» проверки сделаны в этот день, если не указано иное.
> Назначение файла: полный дамп фактов (URL, ответы, цитаты robots.txt/ToS, измерения). Дистиллят и сравнительная таблица — в `research2/findings/2-launch-platforms.md`.
> Правило достоверности: каждое число — с URL-источником либо `[ОЦЕНКА]` + обоснование; нет данных — «нет данных»; цифры самих площадок (самоотчёт) помечены «источник заинтересован»; документы старше 2025 — «устарело (до 2025)».

---

## 0. Методика и ограничения (честно)

**Инструменты**
- `curl` через агентский прокси (датацентровый IP, UA вида `Mozilla/5.0 (compatible; research-probe/1.0)`): robots.txt, фиды, sitemap, JSON-API, HTML-страницы. Основной источник «сырых» ответов.
- Python (urllib) + `jq`: измерения объёмов (Algolia HN, Firebase HN, dev.to, Uneed, Smol Launch, TinyLaunch-архив).
- `WebFetch` (суммаризатор на малой модели): только для первичного обзора; цитаты ToS/robots перепроверялись сырым curl там, где возможно.
- `Exa web_fetch/web_search` (сторонний краулер/кэш Exa): использовался **только для чтения публичных юридических текстов и страниц, закрытых Cloudflare для моего IP** (Indie Hackers, Peerlist, TAAFT, SaaSHub, Reddit-help, G2-legal). Такие места помечены `[Exa]` — содержимое может быть кэшем, а не live.
- `WebSearch` — для обзорных вопросов; факты из выдачи помечены как «со слов третьих сторон».

**Что НЕ делалось**
- Обход Cloudflare/антибот-защит не пытался. Где curl получил `HTTP 403 "Just a moment..."` — так и записано.
- Регистрации/ключи нигде не создавались (PeerPush API-ключ, BetaList API-токен, Reddit OAuth — не получены → поля/квоты, которые видны только с ключом, помечены «нет данных»).
- Нагрузка на источники была минимальной: ≤10 запросов на хост, кроме Algolia HN (~130 запросов, лимит 10 000/ч), Firebase HN (~1 000 запросов, «no rate limit»), dev.to (5 запросов), TinyLaunch-архивы (4 страницы по ~2 МБ).

**Окна измерений**
- «30 дней» = 2026-09-04 … 2026-10-03 (полные сутки UTC, 30 дней). «90 дней» = 2026-07-06 … 2026-10-03.
- Сутки 2026-10-04 неполные (проверки шли днём UTC) — в средние не включались.

---

## 1. Hacker News — Show HN / Launch HN (КРИТИЧНО)

### 1.1 Официальный Firebase API
- Базовый URL: `https://hacker-news.firebaseio.com/v0/` · доки: https://github.com/HackerNews/API (raw README получен curl 2026-10-04).
- Цитата README (стр. 13): «We hope to improve the API over time. The changes won't always be backward compatible, so we're going to use versioning. This first iteration will have URIs prefixed with `https://hacker-news.firebaseio.com/v0/` ... **There is currently no rate limit.**»
- Цитата README (стр. 19): «The newest page? Starts at item maxid and walks backward, keeping only the top level stories. Same for Ask, Show, etc.»
- Цитата README (стр. 189): «Up to 200 of the latest Ask HN, Show HN, and Job stories are at `/v0/askstories`, `/v0/showstories`, and `/v0/jobstories`.»
- Цитата README (стр. 5): «we're making the public Hacker News data available in near real time.»
- Эндпоинты (все проверены live, HTTP 200, `access-control-allow-origin: *`, `Cache-Control: no-cache`):
  - `/v0/item/<id>.json`, `/v0/user/<id>.json`, `/v0/maxitem.json` (на момент проверки 49953668 → 49953691), `/v0/topstories.json` (500), `/v0/newstories.json` (500), `/v0/beststories.json` (200), `/v0/askstories.json` (12), `/v0/showstories.json` (**147**), `/v0/jobstories.json` (31), `/v0/updates.json` (items 49, profiles 19).
- Поля `item` (live, пример Show HN `49953441`): `id, type, by, time, title, url, score, descendants, text, kids` (+ по README: `parent, deleted, dead, poll, parts`).
- Поля `user` (live): `id, karma, created, about, submitted`. Поле `about` — публичный свободный текст (HTML), email-поля нет.
- **Критическая находка (измерено live):** `/v0/showstories` — это НЕ все Show HN, а список страницы `/show` (с порогом по очкам):
  - в списке 147 id; возраст самого старого — 162.6 ч, самого нового — 3.3 ч;
  - постов за последние 24 ч в списке — **16**, при том что по Algolia Show HN публикуется ~124/сутки;
  - медиана score в списке = 5, мин = 2, макс = 406;
  - `/v0/newstories` (500 id) покрывает только **19.1 ч**; среди них 62 Show HN (по префиксу «Show HN» в title), и лишь **12** из этих 62 есть в `showstories`.
  - Вывод: полный поток Show HN через Firebase = ходить по `maxitem` назад / `newstories` и фильтровать по `title`; либо брать Algolia (ниже).
- SSE/стриминг: README (стр. 165) — «The coolest part of Firebase is its support for change notifications». Проверка `curl -H "Accept: text/event-stream" .../maxitem.json` за 8 с через агентский прокси событий не дала (прокси мог буферизовать) → **не подтверждено в этой среде**.

### 1.2 Algolia HN Search API (hn.algolia.com/api)
- Базовый URL: `https://hn.algolia.com/api/v1/` · **без ключа**. Страница доки — JS-рендер; текст доки извлечён из бандла `https://hn.algolia.com/public/main-6e634771f729331a3c3c.js` (2026-10-04).
- Цитата доки (раздел «Rate limits»): «We are limiting the number of API requests from a single IP to **10,000 per hour**. If you or your application has been blacklisted and you think there has been an error, please contact us (support@algolia.com).»
- Эндпоинты: `/items/:id`, `/users/:username`, `/search` (релевантность → очки → комментарии), `/search_by_date` (новые сверху).
- Параметры (цитата доки): `query=`, `tags=` (`story`, `comment`, `poll`, `pollopt`, **`show_hn`**, **`ask_hn`**, `front_page`, `author_:USERNAME`, `story_:ID`), `numericFilters=` (поля `created_at_i`, `points`, `num_comments`), `page=`, `hitsPerPage=`. «Tags are ANDed by default, can be ORed if between parenthesis».
- Пример из доки: `search_by_date?tags=story&numericFilters=created_at_i>X,created_at_i<Y` — «Stories between timestamp X and timestamp Y (in second)».
- **Как отфильтровать Show HN (проверено live):** `https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=3` → HTTP 200, `nbHits: 537851` (all-time, `exhaustiveNbHits:false`).
- Поля hit (live): `title, url, author, points, story_text, num_comments, created_at, created_at_i, updated_at, objectID, story_id, _tags` (содержит `show_hn`), `children` (id комментариев, если есть), `_highlightResult`.
- **Лимиты пагинации (проверено live):** `hitsPerPage=2000` молча режется до 1000; `hitsPerPage=1000&page=1` для `tags=show_hn` без окна → `nbPages:1`, 0 результатов (глубина выдачи ограничена 1000 хитами на запрос) → для выгрузок > 1000 нужно резать по `created_at_i` (мои суточные окна ≤ 162 хитов — проблемы нет).
- Заголовков rate-limit в ответе нет (только `x-cloud-trace-context`); лимит — только документальный (10 000/ч/IP).
- Свежесть: пост 12:43:17Z был в выдаче при проверке ~13:16Z; `updated_at` 12:47Z → индексация близка к реальному времени (точная задержка не измерялась).
- `https://hn.algolia.com/robots.txt` → HTTP 404 (директив нет).
- Прочее: `https://hn.algolia.com/rss` (front page) и `https://hn.algolia.com/latest.atom` указаны в `<link rel=alternate>` главной страницы документации.

### 1.3 Объём Show HN (измерено через Algolia, 2026-10-04)
Метод: `search_by_date?tags=show_hn&numericFilters=created_at_i>=S,created_at_i<E&hitsPerPage=1000` по суткам UTC.

| дата | день | Show HN | с URL | ≥5 оч. | ≥10 оч. | AI-слово в title |
|---|---|---|---|---|---|---|
| 2026-09-04 | Fri | 104 | 104 | 21 | 9 | 38 |
| 2026-09-05 | Sat | 80 | 79 | 14 | 7 | 18 |
| 2026-09-06 | Sun | 93 | 92 | 13 | 5 | 19 |
| 2026-09-07 | Mon | 117 | 110 | 20 | 9 | 29 |
| 2026-09-08 | Tue | 155 | 152 | 28 | 11 | 51 |
| 2026-09-09 | Wed | 161 | 155 | 36 | 13 | 60 |
| 2026-09-10 | Thu | 148 | 145 | 27 | 13 | 55 |
| 2026-09-11 | Fri | 140 | 137 | 22 | 14 | 54 |
| 2026-09-12 | Sat | 83 | 82 | 18 | 4 | 28 |
| 2026-09-13 | Sun | 85 | 82 | 22 | 6 | 23 |
| 2026-09-14 | Mon | 130 | 126 | 31 | 17 | 46 |
| 2026-09-15 | Tue | 142 | 138 | 37 | 18 | 47 |
| 2026-09-16 | Wed | 146 | 140 | 22 | 9 | 48 |
| 2026-09-17 | Thu | 157 | 154 | 26 | 14 | 46 |
| 2026-09-18 | Fri | 99 | 95 | 15 | 5 | 27 |
| 2026-09-19 | Sat | 71 | 67 | 19 | 10 | 17 |
| 2026-09-20 | Sun | 90 | 89 | 17 | 7 | 27 |
| 2026-09-21 | Mon | 127 | 126 | 22 | 10 | 38 |
| 2026-09-22 | Tue | 142 | 135 | 18 | 10 | 47 |
| 2026-09-23 | Wed | 141 | 137 | 17 | 8 | 40 |
| 2026-09-24 | Thu | 157 | 153 | 21 | 11 | 52 |
| 2026-09-25 | Fri | 122 | 120 | 20 | 9 | 40 |
| 2026-09-26 | Sat | 88 | 87 | 17 | 6 | 27 |
| 2026-09-27 | Sun | 97 | 95 | 15 | 8 | 27 |
| 2026-09-28 | Mon | 122 | 119 | 25 | 10 | 46 |
| 2026-09-29 | Tue | 162 | 161 | 25 | 12 | 51 |
| 2026-09-30 | Wed | 156 | 152 | 25 | 8 | 57 |
| 2026-10-01 | Thu | 161 | 155 | 23 | 12 | 41 |
| 2026-10-02 | Fri | 138 | 136 | 13 | 8 | 44 |
| 2026-10-03 | Sat | 96 | 96 | 8 | 4 | 29 |

- Итого 30 дней: **3 710** Show HN, среднее **123.7/день**, медиана 128.5, мин 71 (Sat 09-19), макс 162 (Tue 09-29). Будни (n=21): среднее 139.4, медиана 142; выходные (n=9): среднее 87.0, медиана 88.
- Стабильность: блоки по 30 дней — 123.7/день (09-04..10-03), 122.0/день (08-05..09-03), 137.1/день (07-06..08-04). 90 дней: **11 482** поста, 127.6/день.
- Очки у свежих суток незрелые (голоса накапливаются) — для последних дней «≥5/≥10» занижены; ниже 90-дневные доли надёжнее.
- 90 дней: с URL 11 168 (97.3%); с `story_text` 4 765 (41.5%); ≥1 комментарий 4 163 (36.3%); медиана очков 2 (p75=4, p90=8); ≥2 оч. 70.7% (~90/день); **≥5 оч. 18.9% (~24.1/день); ≥10 оч. 8.7% (~11.1/день); ≥20 оч. 5.2% (~6.6/день); ≥50 оч. 2.9% (~3.7/день)**.
- Хосты URL (90 дней, из 11 168): github.com 35.5% (3 965); github.io 2.7% (297); apps.apple.com 0.9%; chromewebstore.google.com 0.8%; youtube 0.4%; twitter.com 0.3%; huggingface.co 0.3%; vercel.app 1.4% (155); pages.dev 0.4% (40); netlify.app 0.2% (26); onrender.com 0.1% (12); fly.dev 0.1% (7); railway.app 4 шт.; web.app/firebaseapp 6 шт.; **lovable.* — 0; bolt.* — 0; v0.app/v0.dev — 0; base44.app — 0; bubbleapps.io — 0; replit.* — 1**. «Собственный/кастомный домен» (не github, не известный PaaS-субдомен, не store/youtube/blog) ≈ **57.3% (≈71/день)** — классификация моя, по списку хостов.
- Доля тематики по регулярным выражениям в title (оценка, грубая): AI-термины (AI/LLM/GPT/agent/Claude/OpenAI/MCP/RAG/Copilot/Gemini/Anthropic/Cursor/vibe) — **32.7% (90 дн.), 31.6% (30 дн., ~39/день)**; dev-термины (CLI/API/SDK/open-source/framework/…/TypeScript/Rust/…) — 19.1%; SaaS-термины (SaaS/startup/platform/dashboard/CRM/B2B/…) — 3.7%. `[ОЦЕНКА]` — regex даёт ложные срабатывания (например, «agent», «Go»).
- Упоминания AI-билдеров (title + story_text, последние 30 дней, n=3 710, из них 1 564 с текстом): «vibe coding» 54 (1.5%); «Claude Code» 176 (4.7%); «Cursor» 41 (1.1%); «v0» 18 (0.5%); «Supabase» 12 (0.3%); «Firebase» 2; **«Lovable» 1; «Replit» 1; «Bolt» 2; «Base44» 0; «Bubble» 0; «no-code/low-code» 4 (0.1%)**. Вывод: Show HN ≈ дев-аудитория, не поле no-code/Lovable-основателей.
- Правила Show HN (https://news.ycombinator.com/showhn.html, curl 2026-10-04): «The project should be non-trivial. Don't post quickly-generated one-offs; anybody can do that now.»; «Off topic: blog posts, sign-up pages, newsletters, lists...»; «Please make it easy for users to try your thing out, ideally without barriers such as signups or emails.»; «Every Show HN appears on shownew. Once it clears a small points threshold, it will appear on the show page in the top bar.»

### 1.4 Launch HN
- Нет отдельного тега в Algolia; метод: `query="Launch HN"&restrictSearchableAttributes=title&tags=story` + фильтр на `title` начинается с «Launch HN».
- Измерено (Algolia): 30 дней — **4**; 90 дней — **33**; 180 дней — **54**; 365 дней — **103** (≈2.0/нед за год, ≈2.6/нед за 90 дней).
- Перекрёстная проверка: `https://news.ycombinator.com/launches` (curl, 30 постов, период 2026-07-16 … 2026-09-30, все с пометкой YC-батча в title: S25, F24, S22, W26, S26, P26, W22, S24 …). Первые: «Launch HN: Magnitude (YC S25) – Self-optimizing inference engine for agents» (2026-09-30, 194 оч.); «Vespper (YC F24) – SOTA Docx MCP» (09-28); «Coverage Cat (YC S22)» (09-22); «Skillsync (YC W26)» (09-17).
- Вывод: Launch HN = только YC-компании, ~2-3/нед, высокий дев/AI-контент, малый объём.

### 1.5 Контакты из HN-профиля (выборка)
- Выборка 300 уникальных авторов Show HN за последние 30 дней (всего 3 165 уникальных авторов на 3 710 постов; Firebase `user/<id>.json`, 2026-10-04): `about` непустой — **31.0%**; в `about` email-подобная строка — **5.0%** (15/300); любой URL/соцссылка — **15.3%**; github — 4.0%; twitter/x — 2.0%; linkedin — 0.7%. Метод — regex, содержимое не сохранялось.
- Дополнительно: 35.5% постов ведут на github.com (репозиторий → профиль GitHub — отдельная ось 5).

### 1.6 robots.txt и ToS
`https://news.ycombinator.com/robots.txt` (curl 2026-10-04, `last-modified: Fri, 11 Sep 2026`):
```
User-Agent: *
Crawl-delay: 30
Disallow: /collapse?
Disallow: /context?
Disallow: /fave?
Disallow: /flag?
Disallow: /hide?
Disallow: /login
Disallow: /logout
Disallow: /r?
Disallow: /reply?
Disallow: /submitlink?
Disallow: /vote?
Disallow: /x?
```
ToS: `https://www.ycombinator.com/legal/` (curl 2026-10-04; в тексте «Last Updated September 2026» стоит у Privacy Policy; у Terms of Use отдельной даты в тексте нет).
- Определение сайта: «Welcome to the Y Combinator website (**including all subdomains**, the "Site")...» → news.ycombinator.com входит.
- «**In connection with your use of the Site you will not engage in or use any data mining, robots, scraping or similar data gathering or extraction methods.**»
- «Except as expressly authorized by Y Combinator, you agree not to modify, copy, frame, scrape, rent, lease, loan, sell, distribute or create derivative works based on the Site or the Site Content...»
- «If you are blocked by Y Combinator from accessing the Site (including by blocking your IP address), you agree not to implement any measures to circumvent such blocking (e.g., by masking your IP address or using a proxy IP address).»
- Вывод (факт, не юр. совет): HTML-скрейп HN запрещён ToS (+ Crawl-delay 30 с); официальный Firebase API и Algolia API явно предложены публично («no rate limit» / «10,000 per hour»). «Except as expressly authorized» — Firebase API это явное разрешение для данных API.
- `https://news.ycombinator.com/newsfaq.html`: упоминает только «All Show HNs on newest and shownew, but there is a small points threshold before a post makes it to show.»; про API/скрейпинг — ничего.

### 1.7 hnrss.org (сторонний RSS-слой)
- `https://hnrss.org/show` → HTTP 200, `application/xml`, 20 items, `x-algolia-url: .../search_by_date?restrictSearchableAttributes=title&tags=show_hn`, `cache-control: max-age=3300` (~55 мин кэш) — то есть это обёртка над Algolia.
- `https://hnrss.org/launches` → HTTP 200, 30 items.
- Документация (https://hnrss.org/): по умолчанию 20 записей, `count=N` до **100**; `points=N`, `comments=N` фильтры; форматы `.atom`/`.jsonfeed`.
- Нестабильность: `https://hnrss.org/shownew` и `https://hnrss.org/show?points=10` вернули **HTTP 502** при двух проверках 2026-10-04 (третья сторона, SLA нет).

---

## 2. BetaList (betalist.com)

- **Публичный фид:** `<link rel="alternate" type="application/atom+xml" title="Startups ATOM Feed" href="https://feeds.feedburner.com/BetaList">` на главной. Прямой URL `https://betalist.com/startups/feed_original` → HTTP 200 `application/atom+xml`, 25 `<entry>`, `etag`, `cache-control: max-age=0, private, must-revalidate`. FeedBurner-копия: `last-modified: Sun, 4 Oct 2026 12:21:29 GMT`.
- Содержимое записи: `id` (URL страницы BetaList), `published/updated`, `link` (со `utm_source=newsfeed`), `title` («Name – tagline»), `content` (HTML: картинка + описание + «View startup»), `author` = «BetaList». **Нет** URL сайта продукта и мейкера.
- Окно фида: 25 записей = 2026-10-03 00:00Z … 2026-10-04 12:00Z; по дням: 10-03 — 16, 10-04 (до 12:00Z) — 9. Публикации «капают» почасово.
- Главная страница (HTML, 2026-10-04): стартапов по дням — 10-04 (частично) 11, 10-03 — **17**, 10-02 — **16**, 10-01 — 8 (хвост списка мог быть обрезан).
- Страница стартапа `/startups/<slug>`: название, tagline, описание, «Visit Site», Makers (имя + `https://betalist.com/@handle`), Topics, дата «Featured». **URL сайта**: `/startups/<slug>/visit` → **HTTP 301** → `https://www.b2btechstacker.com/?ref=betalist` (проверено curl -I; ставит cookie ahoy — трекинг кликов). Следовательно, URL сайта получается 1 запросом/стартап.
- Тематика (25 записей фида, крупная regex по title+описанию): AI-термины 14/25 (56%), SaaS-подобное 16/25 (64%), dev-подобное 5/25 (20%). `[ОЦЕНКА]`, n мал.
- **robots.txt** (curl): 99 байт, только комментарий `# See https://www.robotstxt.org/robotstxt.html ...` — **директив Disallow нет**. Sitemap: `/sitemap.xml` → 404.
- **FAQ** (`https://betalist.com/faq`, curl 2026-10-04) — цитаты:
  - «**How do I get access to the BetaList API?** We offer API access on a case-by-case basis. To request access, please reach out through our contact form and include: (1) what you plan to use the API for, (2) your intended use case, and (3) estimated request volume. We review each request individually to ensure the API is used appropriately. Once approved, you'll receive an API key and access to our API documentation.»
  - «**How much does it cost to submit a startup?** All submissions are paid. There is no free submission option. Current plans and prices are shown at the end of the submission form. If your startup isn't selected, you get a full refund automatically.»
  - «Is there a free submission option? No. BetaList used to offer free submissions, but all submissions now require payment.»
  - «Your startup must have its own domain—we don't accept submissions using free hosting subdomains (like vercel.app, netlify.app, herokuapp.com) or direct links to app stores.»
  - «We don't include email addresses in your public listing. If you receive sales or promotional emails after being featured, it's likely because service providers scrape startup directories (including BetaList) for leads and find publicly available contact information on your own website or social media profiles. ... this is common practice in the industry and there's nothing we can do to prevent third parties from finding information you've made public elsewhere.»
  - «We receive thousands of submissions every month.» (self-report)
- **API-документация** (ссылка из FAQ): gist `https://gist.github.com/marckohlbrugge/5a29bf1ba628bb4ca960` (last active 2026-09-25 по странице gist). Содержимое (raw): базовый `http://api.betalist.com/v1/startups` (`?access_token=`), параметры `per_page` (макс 100), `page`, `region_id`, `market_id`; также `/regions`, `/markets`. Числа в доке («39 pages if per_page=100») — **устарели (до 2025)**. Описаний (`description`) в API нет («not included due to SEO / duplicate content concerns»).
  - «Do's & Don'ts» из gist (цитаты): «Don't make our content available in bulk (CSV/XML download, API, etc)»; «Don't use our content to make a competing 'startup discovery' platform without prior explicit approval»; «**Don't scrape our website to get additional content (e.g. product description) without prior explicit approval**»; «Please include a link to http://betalist.com/ when displaying content received through the API.»; «Do use caching where possible».
  - Live-проверка `https://api.betalist.com/v1/startups?per_page=1` без токена → **HTTP 401** (хост жив, токен нужен).
- **ToS** (`https://betalist.com/terms`, curl): «Permission is granted to temporarily download one copy of the materials (information or software) on BetaList's web site for **personal, non-commercial transitory viewing only**... under this license you may not: modify or copy the materials; **use the materials for any commercial purpose**, or for any public display (commercial or non-commercial); ... or transfer the materials to another person or "mirror" the materials on any other server.» Право — Сингапур. Дата не указана.
- **Реклама/цены** (`https://betalist.com/advertise` [Exa]): Sponsorship $4,999/мес; Boost от $99/нед ($199/мес); «70,000+ newsletter subscribers», «500,000+ pageviews/мес», «24,000+ startups featured» — самоотчёт, **источник заинтересован** (на той же странице в одном месте «60k+ subscribers» — внутреннее расхождение).
- Релевантность: требование собственного домена + платная подача = фильтр качества (есть деньги/усилие у основателя); AI 56% по малой выборке.

---

## 3. Indie Hackers (indiehackers.com)

- **robots.txt** (curl 200): 
```
User-agent: *
Disallow: 
Sitemap: https://storage.googleapis.com/indie-hackers.appspot.com/sitemaps/ih-sitemap-index.xml

User-agent: Amazonbot  ... anthropic-ai ... Applebot-Extended ... Bytespider ... CCBot ... Claude-SearchBot ... ClaudeBot ... cohere-ai ... Diffbot ... GPTBot ... meta-externalagent ... OAI-SearchBot ... PerplexityBot ... YouBot (и др.)
Disallow: /
```
  (для всех прочих агентов — `Disallow:` пусто = разрешено; перечисленные AI-боты — запрещены).
- **Cloudflare:** главная 200, а `/products`, `/feed`, `/terms`, `/api`, `/llms.txt`, `/launches` для curl/WebFetch → **HTTP 403 «Just a moment…»** (2026-10-04). Программный доступ с датацентрового IP заблокирован антиботом.
- **Фид/API:** `<link rel=alternate>` на главной нет; `/feed`, `/rss`, `/products.rss` недоступны (403, не 404 — неясно, существуют ли). Официального публичного API не нашёл. На `apis.io/providers/indie-hackers` карточка утверждает «API по ключу» — **не подтверждено** (агрегатор).
- Сторонние скраперы (Apify: crawlerbros/indie-hackers-scraper и др.) в выдаче описаны как использующие публичный Algolia-поиск и Firebase REST самого сайта — **это обход, ToS это запрещает** (см. ниже); не используется.
- **Sitemaps** (`.../sitemaps/ih-sitemap-1..3.xml`, 50 000 + 50 000 + 7 760 URL, lastmod 2026-10-03): типы URL — `/post/...` 106 646, `/top/week-of-...` 488, служебные; **страниц `/product/...` в sitemap нет** (перечислить продукты через sitemap нельзя).
- **Каталог `/products`** [Exa, 2026-10-04]: список с сортировкой «Recently Updated / Recently Added / Revenue: High to Low / Low to High», фильтры Category / Business Model / Monthly Revenue; у карточки: название, tagline, «Visit X's website», **выручка («$20,000/month self-reported revenue» либо «verified revenue»)**. В выдаче видны спам-карточки (например, «Buy Old Gmail Accounts»). Число продуктов/запусков в день — **нет данных**.
- **ToS** (`https://www.indiehackers.com/terms` [Exa]) — цитаты:
  - «You will only use the Services for your own **internal, personal, non-commercial use**, and not on behalf of or for the benefit of any third party».
  - «(h) "Crawls," "scrapes," or "spiders" any page, data, or portion of or relating to the Services or Content (through use of manual or automated means); (i) Copies or stores any significant portion of the Content».
  - Дата редакции в тексте не указана.
- Релевантность: поле «выручка» полезно для оси 4 (реальный бизнес), но самоотчётное; доступа для автоматизации нет.

---

## 4. Uneed (uneed.best)

- **Официальный бесплатный read-API + MCP** (live, 2026-10-04):
  - `https://www.uneed.best/llms.txt` (810 КБ): «Uneed exposes its product data to AI agents through a **free, read-only remote MCP server and a REST API**. Tools: search_products, get_product, get_alternatives, get_reviews, get_trending, get_recent_launches, list_deals, list_products_for_sale, list_categories.» MCP: `https://mcp.uneed.best/mcp` («Streamable HTTP, no auth required»); REST: `https://mcp.uneed.best/v1/...`; OpenAPI: `https://mcp.uneed.best/openapi.json` (v1.1.0).
  - OpenAPI description (цитата): «Read-only API over uneed.best product data... **No authentication in v1; per-IP rate limits apply.**» Числа лимитов не опубликованы → **нет данных**. 10 последовательных вызовов `/v1/categories` → 10×HTTP 200 (проблем нет).
  - Страница `https://www.uneed.best/mcp`: «Free · No auth required · Read-only · Official»; FAQ «I'm building something on this, can I get higher limits?» — текст ответа в HTML не виден (JS) → нет данных.
- **Эндпоинты** (OpenAPI): `/v1/search`, `/v1/products/{slug}`, `/v1/products/{slug}/alternatives`, `/v1/products/{slug}/reviews`, `/v1/trending` (`period=daily|weekly|monthly|yearly`, `date`, `limit≤50`), `/v1/launches` (`category`, `tag`, `limit` 1…50, по умолчанию 20; newest first), `/v1/deals`, `/v1/for-sale`, `/v1/categories`.
- **Поля `/v1/launches` (live, 5 и 50 записей):** `name, slug, description, rich_description (HTML), url (** собственный сайт продукта **), uneed_url, logo, images, category, pricing, rate, premium, launch_date, created_at, twitter, bluesky, linkedin, github, instagram, facebook, youtube, open_source, repo_url, tiktok, domain_rating, on_sale, sold, sale_price, sale_listed_at, ttm_revenue, ttm_profit`. Имени мейкера и email — **нет**.
- Заполненность в 50 последних запусках: twitter 16 (32%), linkedin 13 (26%), github 9 (18%), repo_url 3 (6%), premium 0.
- Хосты `url` (50 запусков): 49 — собственный домен, 1 — github.io; ни одного vercel.app/lovable/replit/bolt/base44.
- **Объём (измерено):** daily-рейтинги `/v1/trending?period=daily&date=…&limit=50`: 2026-09-29 — 30, 09-30 — 26, 10-01 — 34, 10-02 — 21, 10-03 — 17 запусков; в `/v1/launches?limit=50` за 2026-10-04 (на момент проверки) — 39 (+11 за 10-03). Время `created_at` ≈ 07:01Z (запуски дня публикуются пачкой). Среднее за 5 дней = 25.6/день.
- Каталог: 10 000+ продуктов (самоотчёт llms.txt, **источник заинтересован**); `/v1/categories` (tool_count): Business 3 185; Design 1 380; Development 2 626; Marketing 2 352; Personal Life 3 033.
- Категории 50 последних запусков: Business 19, Marketing 11, Personal Life 9, Development 7, Design 4.
- **robots.txt** (curl, редирект на www): 
```
# START nuxt-robots (indexable)
User-agent: *
Disallow: /*?*sortBy=
Disallow: /*?*orderBy=
Sitemap: https://www.uneed.best/sitemap_index.xml
```
  Sitemap-индекс: tools, tags, content, pages, lists, reviews.
- **ToS** (`https://www.uneed.best/terms-of-use` [Exa], «Last Updated: July 31, 2025»): запрещено «Engaging in any automated use of the system, such as using scripts to send comments or messages», «Using bots, scripts, or automated tools to manipulate votes, rankings, or any other metrics», «Using the Platform in any manner that could disable, overburden, damage, or impair it». **Явного запрета скрейпинга/коммерческого использования данных нет.** Право — Франция.
- **Цены запуска** (`https://www.uneed.best/launch.txt`): подача бесплатна; free waiting line — дата назначается автоматически «30 to 150 days out», на launch-day нужен upvote score 10 (иначе снимается), 20 — для do-follow; Skip-the-Waiting-Line **$29.99**; Fast-track **$14.99** (~2 недели).

---

## 5. Peerlist Launchpad (peerlist.io)

- **robots.txt** (curl 200): `User-Agent: *` / `Allow: /`.
- **Cloudflare:** главная и все пути (`/launchpad`, `/sitemap.xml`, `/api`, `/feed`, `/terms`) для curl → **HTTP 403 «Just a moment…»** (2026-10-04). Обход не пытался.
- **API/фид:** публичного API нет (по выдаче поиска «no public API currently»; официальной доки не нашёл); RSS нет.
- **Launchpad** [Exa; в кэше неделя «Week 30 (Jul 20 - Jul 26)» — устаревшая выдача]: карточка = название, tagline, рейтинг, upvotes/комментарии, категории («DevTool, SaaS, AI»), кнопка «Visit». Запуск открывается **по понедельникам 00:00-23:59 UTC**, голосование идёт неделю.
- **Помощь** (`help.peerlist.io/individual/launchpad/...` [Exa]): «Who can launch on the Launchpad? Anyone with a **Verified Peerlist profile**»; «only individual profiles with a valid name and profile picture are allowed to launch projects»; «Do all projects receive a backlink from Peerlist? No, only the top 5 projects of the week»; ранжирование — upvotes, comments, views, link visits.
- **Объём:** блог «Peerlist Launchpad — The Path Forward» (2025-02-11 [Exa]): «In April 2024 ... made Peerlist Spotlight a weekly launch. Initially, we expected around 20-25 projects per week ... We've doubled the weekly launch numbers. We've now seen total of **1,954 launches** so far!» → ~40-50/нед на февраль 2025 (**самоотчёт, источник заинтересован; возраст ≈ 20 мес.**). Данные за 2026 — **нет данных**. В том же блоге: «With the rise of AI tools like v0 and Lovable, more builders... are creating powerful, polished products».
- **ToS** (`help.peerlist.io/legal/terms-and-conditions.md` [Exa], «Last updated: Nov 27, 2024»): прямого запрета скрейпинга/краулинга **в тексте не найдено**; есть правила аккаунтов («Peerlist individual profiles are strictly for individuals»; «we require all users to use their legal names and real profile pictures»). Право — Индия (Pune).
- Контакты: профили верифицированных индивидуальных пользователей с реальными именами (ссылки на GitHub/LinkedIn/сайт) — детали полей без браузера не проверены.

---

## 6. DevHunt (devhunt.org)

- **robots.txt** (curl 200):
```
User-Agent: *
Allow: /
Disallow: /private/
Disallow: /account/
Disallow: /api/
# Share images (og:image) must be fetchable by X, LinkedIn, Facebook, Slack... crawlers.
Allow: /api/og/
Sitemap: https://devhunt.org/sitemap.xml
Sitemap: https://devhunt.org/blog/sitemap.xml
```
- **Фид/API:** RSS (`/feed`, `/rss`, `/rss.xml`, `/feed.xml`) → 404; публичного API нет. Проект open-source: `https://github.com/MarsX-dev/devhunt` (по `llms.txt`). `https://devhunt.org/llms.txt` (3.4 КБ): «DevHunt is a launchpad for developer tools, built by developers... each week's launches are voted on by signed-in developers (GitHub or Google login)... open-source alternative to Product Hunt focused only on developer tools»; «Free listing: every tool gets a permanent page at /tool/{slug}»; «Paid launch ($49, one time)»; Founder: John Rush.
- **Sitemap:** `https://devhunt.org/sitemaps/tools.xml` — **6 991** URL `/tool/{slug}` (с lastmod; распределение lastmod по месяцам неоднородно, в т.ч. 2026-10 — 201; lastmod ≠ дата создания, надёжно не использовать как дату запуска).
- **Страница `/tool/{slug}`:** JSON-LD `SoftwareApplication` с полями `name, description, url, **sameAs (сайт продукта)**, image, applicationCategory, featureList`; в HTML — «Launched <дата>», «Visit website», upvotes, категории, ссылка на Maker (`/@username`, соцссылки Twitter/GitHub).
- **FAQ** (`/faq` [Exa]): «Listing a tool is free... A paid launch costs **$19** once: you choose any launch week, get a spot in the newsletter, and your link becomes dofollow. For **$49** it is boosted» — расхождение с llms.txt («$49 one time»); внутри сайта цены не согласованы.
- **Объём** (`/stats` [Exa], снимок 2026-09-29, **самоотчёт, источник заинтересован**): «tools_launched 450 (за 30 дней), 9 726 all time»; «+450 in 30 days» tools submitted (≈15/день); на 2026-09-01 «12 tools submitted · 19 launched». Главная страница 2026-10-04 содержит 57 ссылок на `/tool/…` (карточки недели).
- Недельный цикл: выпуски по неделям; победители в рассылке (40 431 подписчик — самоотчёт).
- **ToS/Privacy:** страниц не найдено (`/terms`, `/privacy`, `/terms-of-service`, `/legal`, `/privacy-policy`, `/terms-and-conditions` → 404) → **нет данных**.
- Сравнительная таблица площадок на `/product-hunt-alternatives` («checked 2026-10-01», DevHunt — **конкурент/источник заинтересован**): DevHunt weekly; Uneed daily; Microlaunch «Monthly leaderboard»; BetaList «Paid only (refund if not selected)»; Fazier «Daily launches / Free to submit»; Peerlist «Weekly; launches open Mondays (UTC), limited spots».

---

## 7. Microlaunch (microlaunch.net)

- **robots.txt** (curl 200): `User-agent: * / Allow: /`, `Host: https://microlaunch.net`, 8 sitemap (`/sitemap.xml`, `/server-sitemap.xml`, `/categories-sitemap.xml`, `/howtos-`, `/alts-`, `/blog-`, `/refs-`, `/tags-sitemap.xml`).
- **Фид/API:** `/feed`, `/rss`, `/api` → 404; нет.
- **Sitemap:** `server-sitemap.xml` — **18 656** URL (в основном `/p/{slug}`); lastmod у всех = время сборки (2026-10-04T13:27Z) → для дат не годится.
- **Главная (HTML, 2026-10-04):** шапка «October '26 · **138 products** · 833 daily visitors» — счётчик продуктов октябрьской когорты (интерпретация `[ОЦЕНКА]`: у платформы «Monthly leaderboard», «New startups live every month»). Лидерборд месяц/неделя с «Visit Website», тегами, рейтингами Idea/Product, «Maker: Fraser R.».
- **Страница `/p/{slug}`:** JSON-LD `Product` (name, description, aggregateRating — без URL сайта); в HTML кнопка **«Visit Website» с прямым href** `https://wotsthat.com/?ref=microlaunch`; «Maker: Fraser Richardson» (полное имя); категории, теги, `created_at` в данных страницы.
- **ToS** (`https://microlaunch.net/terms`, «Last updated on 04/03/2023» — **устарело (до 2025)**): «Permission is granted to temporarily download one copy of the materials on our Website for **personal, non-commercial transitory viewing only**... you may not: modify or copy the materials; **use the materials for any commercial purpose or for any public display**... or "mirror" the materials on any other server.» Право — Франция (Stimpack SAS).
- Цена Premium — на публичных страницах не найдена → нет данных (по DevHunt-таблице: «Free launch; paid Pro launches», источник заинтересован).

---

## 8. Fazier (fazier.com)

- **robots.txt** (curl 200, дословно):
```
User-agent: *
Disallow: /admin/
Disallow: /embeds/
Disallow: /launch/
Disallow: /launch-new/
Disallow: /page/

Sitemap: https://fazier.com/sitemap.xml
Sitemap: https://fazier.com/p/sitemap.xml
Sitemap: https://fazier.com/pages/sitemap.xml
Sitemap: https://fazier.com/launches/sitemap.xml
Sitemap: https://fazier.com/topics/sitemap.xml
Sitemap: https://fazier.com/leaderboard/sitemap.xml
```
  (`/launches/…` — множественное число — не запрещено; `/launch/` — запрещено.)
- **Фид/API:** `/feed`, `/rss`, `/api` → 404/пусто; нет.
- **Sitemaps:** `/launches/sitemap.xml` — **7 975** URL; `/p/sitemap.xml` — **36 205** URL (профили/продукты); lastmod — дата генерации (2026-10-04), не дата запуска.
- **Главная:** запуски по дням — Today (10-04, частично) 5; Yesterday (10-03) 11; 10-02 — 17; 10-01 — 11; 09-30 — 42 (счёт по меткам pricing-тегов; последний блок мог быть шире из-за пагинации); на странице 55 уникальных `/launches/<slug>`.
- **Страница `/launches/{slug}`:** название, tagline, pricing (Free/Freemium/Paid/Premium), описание, фичи, категории (SaaS · Analytics · Development Tools), комментарии с именем и должностью автора («Christian Stegmann, Senior Software Engineer»), кнопка **«Visit» с прямым href** `https://uptimeeye.com?ref=fazier`. JSON-LD нет.
- **ToS** (`https://fazier.com/terms-of-service`, curl, дата не указана) — «Limitations of Use»:
  - «1. You will not modify, copy, create derivative works from, decompile or reverse engineer any materials and software on this website. ... 3. You will not transfer the materials to another person or "mirror" the materials on any other server. ... 7. You will not use this website in connection with sending **unauthorized advertising or spam**. 8. You will not **harvest, collect, or gather user data without the consent of the users**. 9. You will not use this website ... in a way that infringes on the privacy, intellectual property rights, or other rights of third parties.»
- Цены/объём рекламы — нет данных.

---

## 9. TinyLaunch (tinylaunch.com)

- **robots.txt** (curl 200; apex `tinylaunch.com` отдаёт редирект на `www.`; прямой TLS к apex падал с `SSL_ERROR_SYSCALL`/`Connection reset` — использовать `www.tinylaunch.com`):
```
User-agent: *
Disallow: /admin
Disallow: /admin/
Disallow: /dashboard
Disallow: /dashboard/
Allow: /api/og
Disallow: /api
Disallow: /api/
Disallow: /auth
Disallow: /auth/

Sitemap: https://tinylaunch.com/sitemap.xml

# AI agents: TinyLaunch exposes a full agent API. See:
#   https://tinylaunch.com/llms.txt  (agent guide)
#   https://tinylaunch.com/.well-known/agents.json  (agent manifest)
#   https://tinylaunch.com/openapi.json  (OpenAPI spec)
```
- **«Agent API» — только для подачи запусков:** `https://www.tinylaunch.com/api/v1` (OTP-авторизация по email → Bearer ~1 ч): `GET /categories` и `GET /launch-dates` (публичные), `POST /auth/*`, `GET/POST/PATCH /maker`, `GET/POST /startups`, `POST /launches`. **`GET /startups` = «List the current user's startups»**, без токена → `401 {"error":"missing_bearer_token"}`. То есть публичного read-фида запусков нет.
- `GET /api/v1/launch-dates` (публично): окна еженедельные (по понедельникам: 2026-10-05, 10-12, 10-19, 10-26 — `status: full, premium_only: true`; с 2026-11-02 — `available_slots: 100, bookable_free: true`) → бесплатных слотов 100 на окно.
- **Sitemap** (`www.tinylaunch.com/sitemap.xml`, 3.1 МБ, 17 538 URL): `/launch/{id}-{slug}` — **17 346** (id от 1 до 23 967), `/launch-archive/{год}/{мес}/{день}` — 138 (еженедельные страницы с 2024-12 по 2026-09-28), `/category/…` 27.
- **Недельный архив** `https://www.tinylaunch.com/launch-archive/2026/9/{7,14,21,28}` (curl): число уникальных ссылок `/launch/…`: **303** (нед. 09-07), **335** (09-14), **280** (09-21), **365** (09-28) → 280-365/нед, среднее 320.75/нед (**~46/день**). Главная 2026-10-04: «Show more launches (350 remaining)» после первых ~17.
- Категории (разбор архивов недель 09-21 / 09-28): SaaS & Tools 56 / 74; AI & Machine Learning 35 / 39; Developer Tools 22 / 36; Marketing & Sales 26 / 35; Productivity 29 / 35 → за неделю 09-28: SaaS+AI+Dev = 149/365 ≈ **41%**.
- Наличие X-хэндла мейкера на карточках архива: 107/280 (38%) и 134/365 (37%).
- **Страница `/launch/{id}-{slug}`:** JSON-LD `SoftwareApplication` — `name, description, url, **sameAs (сайт продукта)**, image, applicationCategory, datePublished`; на странице имя мейкера (имя, без фамилии) и X-хэндл (когда указан).
- **ToS** (`https://www.tinylaunch.com/tos` [Exa], «Effective Date: December 30, 2024»; оператор Christopher Woggon, право — Германия): запретов скрейпинга/автоматического сбора **нет**; «No Trash Mail Accounts», «Fair Competition» (отмена запусков за накрутку), «Communication Consent» (рассылки пользователям), «Founder's Pass». 
- **Цены** (`/pricing` [Exa]): Standard Launch — бесплатно (очередь); Premium Launch — **$39/launch**; Submission Service — $279 (110 каталогов); $15/нед — плейсмент на лендинге. Домашняя страница: «Trusted by 30,000+ users» (самоотчёт).

---

## 10. Launching Next (launchingnext.com)

- **robots.txt** (curl 200): блокирует Baiduspider и Yandex; `User-agent: * / Disallow: /try/`; `Crawl-Delay: 500` для AhrefsBot, SemrushBot-BA, Bytespider; Allow `/llm-info.html` для AI-ботов.
- **Фид/API:** `/feed`, `/rss`, `/sitemap.xml`, `/api` → 404; нет.
- **Главная:** «Submit your startup to be among the **45,669** startups we've featured» (самоотчёт); «Newest Startups» — 21 карточка (название + tagline), ссылки вида `/s/{slug}/{id}/`. Даты публикации на страницах: id 155160 — 2026-10-01; 155498, 153156, 154770 — 2026-10-02; 156237, 156242 — 2026-10-04 → 21 новая карточка за ~4 дня ≈ 5/день `[ОЦЕНКА]` (список «newest» может быть не строго по дате).
- **Страница `/s/{slug}/{id}/`:** название, tagline, «Published <дата>», «Visit Website», теги; email/мейкер — нет.
- `https://www.launchingnext.com/llm-info.html`: «Founded: 2013, Chicago; Network Size: 45,000+ Featured Startups, 25,000+ Social Followers, 18,000+ Newsletter Subscribers»; **Express Approval — от $149 (one-time)** (самоотчёт, источник заинтересован).
- **ToS:** страницы нет (`/terms` → 404); есть `/privacy` (содержит JS-проверку на headless/webdriver — защита от ботов).

---

## 11. SaaSHub (saashub.com)

- **Cloudflare:** `robots.txt` и страницы для curl → 403 «Just a moment…»; прочитано через Exa.
- **robots.txt** [Exa]: `Sitemap: https://www.saashub.com/sitemaps/sitemap.xml.gz`; `User-agent: Amazonbot / Disallow: /do-not-crawl/`; `User-agent: MJ12bot / Disallow: /`; остальным — разрешено.
- **API** (`https://www.saashub.com/site/api` [Exa]): «This is a "beta" version of our API... only two endpoints. JSON API (jsonapi.org)... you need an API key. All SaaSHub users can find their api_key in their profile. **If you are using the API, you have to disclose somewhere on your website that you are using SaaSHub' API.**» Эндпоинты: `/api/alternatives/{query}?api_key=` (первый подходящий продукт + топ-10 альтернатив) и `/api/product/{query}`. Поля: `id, type, attributes{name, saashubUrl, tagline}`. **Списка новых продуктов в API нет.**
- **`/new`** [Exa]: «241,661 products and growing»; блок «SaaSHub Submit» — свежие подачи с пометками «Posted on Product Hunt / PeerPush / CtrlAlt.CC» и числом постов (то есть SaaSHub агрегирует листинги из других площадок). Поток/день — **нет данных**.
- **ToS** (`/site/terms` [Exa], последнее обновление 2023-10-13 — **устарело (до 2025)**): «All lists of product alternatives and stats publicly displayed on SaaSHub are licensed under **Creative Commons: Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** ... Adapt — remix, transform, and build upon the material for any purpose, **even commercially**.» Но: «You may not duplicate, copy, or reuse any portion of the HTML/CSS, Javascript, or visual design elements...» Прямого запрета скрейпинга нет.

---

## 12. There's An AI For That — TAAFT (theresanaiforthat.com)

- **Cloudflare:** все пути кроме главной для curl → 403 «Just a moment…».
- **robots.txt** (curl 200): шапка с Cloudflare Content Signals: `User-agent: * / Content-Signal: search=yes,ai-train=no,use=reference / Allow: /`; блокируются десятки AI-краулеров (ClaudeBot, GPTBot, CCBot, Google-Extended, …) и SEO-боты (AhrefsBot, SemrushBot…); для остальных `Disallow: /cgi-bin/ /cdn-cgi/ /api/ /verify/ /assets/cgi-bin/`.
- **Фид/API:** публичного API/RSS не найдено; `/new/` [Exa] — список «New»: карточки с «Open website», категорией задачи, ценой («Free + from $9/mo»), «Released 1d ago»; также в навигации «APIs» (каталог чужих API), «Submit AI tool», «Get featured».
- **ToS** (`https://theresanaiforthat.com/terms/` [Exa], «Last updated on March 19th, 2026»), §2 «User Conduct», пункт 20: «**Not to scrape, crawl, spider, harvest, mine, or collect any data or content from the Site through any automated means — including bots, scripts, crawlers, AI training pipelines, or any similar technology — without the Company's prior express written consent.**» Также п.5: «Not to engage in spamming, manipulative self-promotion, mass or automated posting».
- Объём: «50 000+ tools» (сторонние статьи; страница сайта: «Used by 90M+ humans» — самоотчёт, **источник заинтересован**); новые в день — **нет данных**.

---

## 13. Futurepedia (futurepedia.io)

- **robots.txt** (curl 200): `User-Agent: * / Allow: /`; `Disallow: /search/`, `/?search=*`, `/api/image-widget*`, `/*?*verified=*`, `/*?*view=*`, `/*?*sort=*`, `/*?*feature=*`, `/*?*pricing=*`, `/profile`, `/*?*signup=*`, `/*?*focus=*`; sitemaps `sitemap.xml`, `sitemap_tools.xml`.
- **Фид/API:** `/feed`, `/rss`, `/api`, `/llms.txt` → 404; нет.
- **Sitemap tools:** `sitemap_tools.xml` — 1 332 `/tool/{slug}` (lastmod: 1 216 в 2026-09, 68 в 2026-08, 48 в 2026-10 — массовая перегенерация, дат запусков нет).
- Главная (JSON-LD Organization): «community of 200,000+», «Join 350,000+ AI Adopters» (самоотчёт); контакт `contact@futurepedia.io`.
- **ToS:** `/terms`, `/privacy` → 404 → **нет данных**.
- Вывод: каталог, а не поток запусков; машиночитаемых «новых» нет.

---

## 14. Reddit (r/SideProject, r/startups, r/SaaS)

- **robots.txt** (curl 200): 
```
# Welcome to Reddit's robots.txt
# Reddit believes in an open internet, but not the misuse of public content.
# See https://support.reddithelp.com/hc/en-us/articles/26410290525844-Public-Content-Policy ...
User-agent: *
Disallow: /
```
- **Data API Wiki** (`support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki` [Exa]): «You can use the Reddit Data API, subject to our Responsible Builder Policy, Developer Terms and Data API Terms. To request, please contact us here. Clients must authenticate with a registered OAuth token... **Our robots.txt is for search engines, not Data API users.**»; лимит бесплатного доступа: «**100 queries per minute (QPM) per OAuth client id**» (усреднение за 10 минут); «Traffic not using OAuth or login credentials will be blocked».
- **Responsible Builder Policy** (`.../articles/42728983564564-Responsible-Builder-Policy` [Exa]): «**Approval is required**: You must request access and get explicit approval before accessing any Reddit data through our API»; «If you'd like to use Reddit data for commercial purposes, you'll need to get **explicit written approval**»; «No Unapproved Commercialization or AI Training — You must not sell, license, share, or otherwise commercialize Reddit data without express written approval. This extends to commercial and non-commercial mining, scraping...».
- **Developer Terms §4.1** (`redditinc.com/policies/developer-terms` [Exa]): без письменного согласия нельзя «access or use any of the Reddit Services and Data **by or on behalf of a business** or as part of a service or product that is monetized»; «Reddit reserves the right to charge fees ... rates to be determined at Reddit's sole discretion»; для коммерческого использования «separate agreement». Developer-Platform page: «commercial purposes include any use ... by a business or on behalf of a business or as part of a monetized product or service».
- **Public Content Policy:** «you can use Reddit content for non-commercial uses, such as learning and community, but talk to us if you have commercial purposes in mind.»
- **Цена:** официальной публичной цены нет. Сторонние блоги-перепродавцы (socialcrawl.dev, xpoz.ai, redditapis.com — **источник заинтересован**) пишут «$0.24 за 1 000 вызовов» и «от ~$12 000/мес» — эта цифра $0.24/1k исходит из анонса 2023 (**устарело (до 2025)**), на официальных страницах 2026-10-04 не подтверждена.
- **Объём подписчиков** (маркетинговые блоги, **источник заинтересован**, дата неизвестна): r/SideProject ~209K, r/startups ~1.7M, r/SaaS ~165K; правила самопродвижения: SideProject — «высокая терпимость», startups — «только в еженедельных тредах», SaaS — «Show and Tell Saturday». Объём постов/день — **нет данных**. Прямой доступ к `reddit.com/r/...` через Exa: `SOURCE_NOT_AVAILABLE`.
- Факт для нашего кейса: использование данных Reddit для лидгена платной услуги = «on behalf of a business / monetized» → требуется договор с Reddit.

---

## 15. Startup Stash (startupstash.com)

- **robots.txt** (curl): Yoast, `User-agent: * / Disallow:` (пусто = разрешено), `Sitemap: https://startupstash.com/sitemap_index.xml`.
- **Фид:** `https://startupstash.com/feed/` → валидный RSS, но **без `<item>`** (lastBuildDate 2026-09-30, «world's largest online directory of tools and resources for startups»). WordPress REST открыт (`/wp-json/wp/v2/types`: `tools, resources, alternative, topstartups, toptools, topvcs, conference, interviews`…).
- Характер: каталог инструментов/ресурсов для стартапов (не поток запусков). Sitemap-индекс: tools (3 файла), alternatives, resources, topstartups…
- **ToS** (`/terms-of-service`, curl): шаблон «Permission is granted to temporarily download one copy of the materials ... for **personal, non-commercial transitory viewing only** ... Use the materials for any commercial purpose».
- Вывод: для воронки «свежие запуски» не подходит.

---

## 16. AlternativeTo (alternativeto.net)

- **Cloudflare:** `robots.txt` и страницы для curl → 403; через Exa `CRAWL_UNKNOWN_ERROR`. robots/ToS — **нет данных**.
- **API:** по Wikipedia/блогу AlternativeTo бета-API (2009) снят; сейчас «not currently offer a public API, but provides partner integration» (поисковая выдача, **устарело (до 2025) для 2009**; актуальное подтверждение отсутствует) → публичного API нет.
- Для воронки: каталог альтернатив, «новые приложения» без фида; вне доступа.

---

## 17. G2 (g2.com)

- **robots.txt** (curl 200, 7.3 КБ): `Disallow: /*.rss`, `/products/*/leads*`, `/search/*`, `/compared_products`, `/comparisons/*`, `/contributor*`, множество UTM-шаблонов, отдельные блоки для GPTBot/ClaudeBot/CCBot, `/products/*/reviews/*` и т.д.; Sitemap: `https://www.g2.com/sitemaps/sitemap_index.xml.gz`.
- **API:** `https://data.g2.com/api/v2/docs/index.html` — JSON:API; `GET /api/v2/products` («Browse list of G2 products»), `/vendors`, `/products/{id}/reviews`; **токен из G2 Developer Portal**, права по эндпоинтам; для части данных нужны подписки/entitlements («Market Intelligence data requires an Enterprise package»). Токены живут 1 год (`api-evangelist` conventions). Цена — **нет данных**.
- **ToU** (`https://legal.g2.com/terms-of-use` [Exa]), §9 «Prohibited Automated Access, Scraping, and Data Extraction»: «you agree that you will not, without G2's express prior written consent: (a) access, collect, copy, scrape, harvest, cache, index, store, archive, or otherwise extract any content or data from the Site, including ... product information, rankings, categories ... through automated, programmatic, or mechanical means ..., **whether or not such content is publicly accessible**; (b) bypass ... robots.txt directives, IP blocking ...; (e) sell, publish, syndicate ... or otherwise commercially exploit any scraped or extracted content». Дата «July 9, 2026» — со слов стороннего блога (Shadow Inbox, 2026-09-10).
- Релевантность для воронки: зрелые продукты, а не свежие запуски.

---

## 18. Дополнительно найденные площадки/источники

### 18.1 Smol Launch (smollaunch.com) — бесплатный официальный API
- **robots.txt** (curl): `User-agent: * / Content-Signal: search=yes, ai-input=yes, ai-train=no / Allow: /`; закрыто `/dashboard/`, `/admin/`, `/cockpit/`, `/login`, `/logout`…; AI-краулеры явно приветствуются.
- **API** (`https://smollaunch.com/openapi.json`, v1.0.0): «Read-only access to Smol Launch's product catalog and weekly launch rankings. **No authentication required.** ... **Rate limit: 120 requests/minute per IP.** Responses are cacheable for 1 hour.» Эндпоинты: `/api/v1/products` (`page` ≤10 000, `per_page` ≤100, по умолчанию 50, **в алфавитном порядке name**), `/api/v1/products/{slug}`, `/api/v1/launch_periods`, `/api/v1/launch_periods/{slug}` (рейтинг недели, 50 мест). Живой заголовок: `ratelimit-policy: "api";q=120;w=60`, `cache-control: public, max-age=14400`.
- Поля `/products`: `name, slug, tagline, categories[], url (страница на Smol), maker (display name)`; всего **1 369** продуктов (`total_count`, 457 страниц по 3). Полная карточка `/products/{slug}.md`: Website, Maker (ссылка на профиль), Pricing, Verification, категории, About; лимит 60 req/мин на Markdown.
- `llms.txt`: «Do not crawl interactive pages to reconstruct the product catalog; use `/api/products`.» Есть MCP (`/mcp`), RSS `https://smollaunch.com/feed` (HTTP 200, `application/rss+xml`), `.well-known/agents.json`.
- **Объём** (свой отчёт `https://smollaunch.com/state-of-indie-launches/data.json`, «data_through 2026-09-27», **самоотчёт, источник заинтересован**): 2 592 продукта / 2 645 запусков за 43 недели; `weekly_volume`: median **99/нед**, busiest 121, quietest 48; недели 08-03 → 50, 08-10 → 48, 08-17 → 73, 08-24 → 79, 08-31 → 120. Топ-категории: SaaS & Tools 1 336; AI & ML 920; Productivity 858; Marketing 379; **Developer Tools 281**.

### 18.2 PeerPush (peerpush.com / peerpush.net)
- `https://peerpush.com/llms.txt`: публичный REST API + MCP; `https://peerpush.com/api-reference`: «Free REST API ... Authenticate with a **free API key** you can create in one click» (`X-PeerPush-Api-Key` или `?api_key=`). Без ключа `GET /api/v1/launches` → **HTTP 401**.
- Эндпоинты (OpenAPI 3.1, `https://peerpush.com/api/v1/openapi.json`): `GET /products`, `/products/{slug}`, `/trending`, `/discover`, `/deals`, **`/launches` (`days` ≤30, `category`, `limit`, `offset`)**, `/awards`, `/categories`…; `POST /products` (создать).
- Поля `Product`: `websiteUrl` (UTM-метки), `social{twitterUsername, linkedinUrl}`, `publishedAt`, `lastUpdatedAt`, `pricing`, `platforms`, `categories`, `community`, `uptime`, `mcpServerUrl`, `apiDocsUrl`… (`contactEmail` при создании — «never published»).
- Квота: «Hourly per-key quota exhausted (code: RATE_LIMITED)» — число **не опубликовано**. Ответы с `X-RateLimit-*` заголовками (в `access-control-expose-headers`).
- **ToS** (`https://peerpush.com/terms` [Exa], «Last updated: September 10, 2026»), §5: «You agree not to: ... Submit products that compete directly with PeerPush; **Use the platform for any commercial purpose other than product promotion**.»
- robots: `Content-Signal: ai-train=yes, search=yes, ai-input=yes`, `Allow: /`.
- Объём запусков — **нет данных** (нужен ключ).

### 18.3 dev.to — тег #showdev (Forem API)
- **Официальный API:** `https://developers.forem.com/api/v1`: публичные GET без ключа; `GET https://dev.to/api/articles?tag=showdev&per_page=1000&page=N` → HTTP 200 (live), `per_page` до 1000, 5 страниц по 1000 получены. Заголовков rate-limit не видел; в доке лимит не найден (**нет данных**).
- Поля статьи: `title, url, published_at, tag_list, description, canonical_url, comments_count, public_reactions_count, user{name, username, twitter_username, github_username, website_url, profile_image}`. В выборке 5 000 постов: у автора `website_url` указан в 34%, `github_username` в 39%, `twitter_username` в 10%.
- **Объём:** 2 166 постов #showdev за 30 дней (2026-09-04…10-03) = **72.2/день** (по дням 55-91). Это обычные статьи («I built X»); URL продукта — в тексте, не в поле.
- **robots.txt** (curl): запрещены служебные пути (`/search?q=*`, `/mod/*`, `/admin/*`, `/reactions?*`…); `/api/` не закрыт.
- **ToS** (`https://dev.to/terms` [Exa]): шаблон «Permission is granted to temporarily download one copy of the materials ... for personal, non-commercial transitory viewing only ... may not: use the materials for any commercial purpose»; Content Policy: «not designed primarily for the purposes of promotion or creating backlinks».

### 18.4 Launch YC (ycombinator.com/launches)
- `https://www.ycombinator.com/robots.txt`: `Allow: /`, `Disallow: /companies?*`, `/library?*` (кроме categories), `/verify/*`.
- Страница `/launches` при запросе не-браузера возвращает **JSON** (`{"hits":[...], "nbHits":3298, "nbPages":..., "hitsPerPage":20}`): `id, title, tagline, created_at, total_vote_count, company{name, **url**, slug, tags, batch, industry, search_path}`. Не документирован.
- Объём (первая страница): 20 лаунчей за 2026-09-28 … 10-02 (≈4/день). 
- ToS — те же условия YC («no data mining, robots, scraping»; см. 1.6) → использовать нельзя; для YC-компаний есть Launch HN через официальные HN API.

### 18.5 StartupBase (startupbase.io), Open Launch, Tiny Startups
- **StartupBase:** robots разрешает; `rss.xml`/`atom.xml` — **только блог** (50 записей: обзоры/рассылка, не запуски); `llms.txt` (16.7 КБ): запуски с 2017, цены (Launch $39, Boost $99, Ultimate $299, Outrank от $15), free-очередь «typically publishes in about 4-5 weeks» / «10+ weeks». API нет.
- **Open Launch** (open-launch.com): robots `Allow: /`, `Disallow: /api/`; фид/API/llms.txt/terms — 404; sitemap есть. Данных по объёму нет.
- **Tiny Startups** (tinystartups.com): robots `Allow: /` (AI-боты явно разрешены), `Disallow: /api/`; `llms.txt`: «**3797+** approved startups have launched here», «941+ curated tools», еженедельный лидерборд Пн-Вс; цены: Skip the queue $99, DR70 backlink $99, Membership $299/год (самоотчёт); sitemap: 1 363 `/startup/…`, 8 362 `/profile/…`; есть «Revenue leaderboard». API/RSS нет; `/terms` существует, ключевых слов scrap/crawl/automat/robot/commercial не нашёл (grep по тексту) → прямого запрета нет `[ОЦЕНКА]`.

### 18.6 Lobsters (lobste.rs)
- robots.txt: для поисковиков (`Applebot, BingBot, DuckDuckBot, GoogleBot, ia_archiver, Kagibot, Slurp`) — Allow; для `User-agent: *` — **`Crawl-delay: 1`, `Disallow: /`**; `Content-Signal: ai-input=no, ai-train=no, search=yes`. → не-поисковые боты запрещены. Вне рассмотрения.

### 18.7 Made with Lovable (madewithlovable.com) и Lovable Launched
- `launched.lovable.dev` для curl → 403 (Cloudflare); через Exa отдаёт маркетинговую страницу Lovable (не каталог) → статус каталога неясен («Lovable Launched» анонсировали в 2025-02 по AlternativeTo-новости).
- **madewithlovable.com** (сторонний каталог проектов, собранных на Lovable): robots `User-agent: * / Disallow: /cp`; sitemap `sitemap_projects.xml` — **533** страницы `/projects/{slug}`; на странице JSON-LD с `url` (сайт продукта), `author{name, url (X)}`, `datePublished`; ToS/Privacy — 404. lastmod 477 из 533 = 2026-06-30 (массовая перегенерация); реально новых за 2026-09 по lastmod ≈ 20 → поток ≈ 5/нед `[ОЦЕНКА]`. Продукты по определению сделаны на Lovable (прямое попадание в гипотезу), но ниша мала.

---

## 19. Кросс-постинг: пересечение по названиям (измерено 2026-10-04)

Сравнивались нормализованные названия из снимков (окна не синхронизированы → нижняя оценка): BetaList (25 последних), Uneed (50 последних + daily-рейтинги 09-29..10-03 = 128), TinyLaunch (недели 09-21 и 09-28 = 644), Smol Launch (топ-50 недель 38-40 = 150), Fazier (главная ≈ 80), Launching Next (21 новый).
- Найдено 40 названий, присутствующих минимум в двух списках. Примеры: CrabTap (BetaList + TinyLaunch + Smol Launch), TinyLaunch∩Smol — 11 названий; Uneed∩Fazier — 5; TinyLaunch∩Fazier — 4; Panzoe (Fazier + Launching Next).
- Вывод: платформы в основном различаются (пересечение единицы процентов на выборках), но дедупликация по каноническому домену нужна. URL сайтов содержат `?ref=…` (BetaList `?ref=betalist`, Microlaunch `?ref=microlaunch`, Fazier `?ref=fazier`, PeerPush `utm_source=peerpush&ref=peerpush`) — для сравнения доменов параметры надо отбрасывать.

---

## 20. Что не удалось проверить / «нет данных»

- Indie Hackers: объём новых продуктов в день, наличие официального API (Cloudflare 403; ToS запрещает).
- Peerlist: актуальный (2026) объём запусков; структура данных страниц без браузера; ToS-текст про скрейпинг — отсутствует (проверена версия 2024-11-27).
- AlternativeTo: robots/ToS (Cloudflare).
- Reddit: объём постов/день в r/SideProject, r/startups; официальная цена коммерческого доступа.
- BetaList API: набор полей ответа, лимиты и условия (нужен токен после одобрения заявки); цена подачи (видна только в форме).
- PeerPush: размер часовой квоты, объём запусков (нужен ключ).
- Uneed: числа per-IP лимитов; ответ на «higher limits».
- Microlaunch: цена Premium; ToS-актуальность (версия 2023).
- DevHunt: ToS/Privacy-страниц нет; точное недельное число запусков (есть только самоотчёт за 30 дней).
- Launching Next: реальный суточный объём (только оценка по 21 новой карточке).
- SaaSHub / TAAFT / Futurepedia: объём новых продуктов в день — нет данных.
- Firebase SSE-стрим через агентский прокси не подтвердился.
