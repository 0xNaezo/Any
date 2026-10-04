# Ось 2 — Смежные launch-площадки: дистиллят

> Проверено вживую: **2026-10-04**. Полный дамп с цитатами robots.txt/ToS, URL и методикой измерений — `research2/raw/2-launch-platforms.md` (ссылки вида «raw §N»).
> Правила: каждое число — с источником (raw §) либо `[ОЦЕНКА]`; «нет данных» = не нашёл/не мог проверить; цифры самих площадок — «самоотчёт, источник заинтересован»; документы старше 2025 — «устарело (до 2025)». Это фактическая база, не проект системы и не юридическая консультация.

---

## 1. Короткий ответ

**Топ-3 источника для кейса (свежие dev/AI/SaaS-запуски, бесплатно, без нарушения ToS):**

1. **Hacker News — Show HN через Algolia HN Search API** (+ Firebase API для профилей). Бесплатно, без ключа, ~**124 запуска/день** (измерено), 97% с URL, самая «дев»-аудитория; единственный из топа, где API официально открыт и ToS-чист (HTML-скрейп — нет). raw §1.
2. **Uneed — официальный бесплатный REST/MCP (`mcp.uneed.best`)**. Без ключа, ~**17–39 запусков/день**, в каждой записи **URL сайта + соцссылки** (X 32%, LinkedIn 26%, GitHub 18% в выборке 50), 49/50 — на собственных доменах; в ToS нет запрета скрейпинга. raw §4.
3. **TinyLaunch — недельные архивы + страницы запусков (HTML/JSON-LD)**. Самый большой бесплатный поток indie-досок: **280–365 запусков/нед** (~46/день), URL сайта лежит в JSON-LD `sameAs`, у ~37% есть X-хэндл мейкера; ToS молчит про скрейпинг, robots разрешает страницы запусков. Минус: нет read-API (только HTML). raw §9.
   - *Если нужен нулевой риск по ToS вместо HTML-скрейпа:* заменить №3 на **Smol Launch** (официальный API, 120 req/мин, ~99 запусков/нед, имя мейкера + сайт). raw §18.1.

**Главная оговорка для гипотезы «no-code/AI-билдер → слабый бэкенд»:** по хосту URL билдер почти не виден. Show HN за 90 дней: 0 из 11 168 URL на `lovable.*`, `bolt.*`, `v0.*`, `base44.app`, `bubbleapps.io` (1 — replit; vercel.app 1.4%); Uneed: 49/50 на собственных доменах; BetaList вообще не принимает бесплатные субдомены (vercel.app, netlify.app, herokuapp.com). Определять билдер придётся по содержимому/заголовкам сайта (ось 3), а не по списку запусков. Упоминания Lovable/Replit/Bolt в title+тексте Show HN за 30 дней — единицы (≈0–0.1%); «Claude Code» — 4.7%, «vibe coding» — 1.5%. raw §1.3.

**Ориентир объёма топ-3** `[ОЦЕНКА: арифметическая сумма измеренных средних до дедупликации и фильтров]`: 123.7 (HN) + 25.6 (Uneed, среднее 09-29…10-03) + 45.8 (TinyLaunch, 320.75/нед ÷ 7) ≈ **195 кандидатов/день**. При цели 2-5 писем/день узкое место — квалификация, а не объём.

---

## 2. Сравнительная таблица (все площадки)

Шкала ToS-риска (по тексту ToS/robots на 2026-10-04): **Низкий** — публичный API/фид, запрета в ToS нет; **Средний** — ToS молчит/страницы ToS нет/частичные ограничения/антибот-защита; **Высокий** — ToS прямо запрещает скрейпинг или коммерческое использование материалов; **Блокирующий** — для нашего типа использования нужен договор/одобрение. Приоритет: P1 — брать; P2 — резерв/ниша; P3 — позже/вручную; Skip — не использовать.

| Площадка | API / RSS / скрейп | Бесплатно / цена | Поля (URL сайта + контакт) | Объём запусков | ToS-риск | Релевантность dev/AI/SaaS | Вердикт |
|---|---|---|---|---|---|---|---|
| **Hacker News — Show HN** (raw §1) | Официальные JSON API: Algolia `search_by_date?tags=show_hn` (без ключа) и Firebase `/v0/item`, `/v0/user`; RSS-обёртка hnrss.org (3-я сторона, 502 при проверке) | Бесплатно. Algolia: 10 000 req/ч/IP; Firebase: «no rate limit» | title, **url** (97% постов, но 35.5% = github.com), author, points, comments, story_text (41%), время. Контакт: только HN-профиль (`about`: email у 5%, любая ссылка у 15% из выборки 300 авторов) | **~124/день** за 30 дн. (будни ~139, выходные ~87); ≥10 очков ≈ 10/день [измерено] | API: **Низкий**; HTML-скрейп: **Высокий** (YC ToU + Crawl-delay 30) | Очень высокая: AI-термины в 32% заголовков, dev ~19% (regex `[ОЦЕНКА]`); но no-code-билдеров почти нет | **P1 — топ-1** |
| **Hacker News — Launch HN** (raw §1.4) | Тот же Algolia (`query="Launch HN"` по title), HN `/launches`, hnrss.org/launches | Бесплатно | url (если есть), YC-батч в title (S26, W26…) | ~2-3/нед (33 за 90 дн.; 103 за 365 дн.) [измерено] | Низкий (API) | Высокая (YC, AI/infra), только YC-компании | P2 (подмножество HN) |
| **Uneed** (raw §4) | Официальный REST + MCP `mcp.uneed.best` (без ключа), llms.txt, sitemap | Бесплатно; лимит «per-IP» (числа не опубликованы). Подача: free-очередь / $14.99 / $29.99 | name, description, **url сайта**, category, pricing, launch_date, twitter/linkedin/github, repo_url; мейкера и email нет | **17–39/день** (09-29…10-04) [измерено]; каталог 10k+ (самоотчёт) | **Низкий** (ToS 2025-07-31 без запрета скрейпинга; запрещена автоматизация голосов/комментов) | Средне-высокая: Development 14%, Business 38%, Marketing 22% (50 посл.) | **P1 — топ-2** |
| **TinyLaunch** (raw §9) | Read-API нет (агентский API — только подача); HTML: недельные архивы + `/launch/{id}`; sitemap 17.3k | Бесплатно (Premium $39/launch) | name, tagline, категория, **сайт в JSON-LD `sameAs`**, datePublished; мейкер: имя + X-хэндл (~37%) | **280-365/нед** (≈46/день) [измерено, 4 нед.] | Низкий–средний (ToS 2024-12-30 без запретов; robots закрывает /api, /dashboard) | Средне-высокая: SaaS&Tools 20%, AI 11%, Dev 10% (≈41% за нед. 09-28) | **P1 — топ-3** |
| **Smol Launch** (raw §18.1) | Официальный REST (`/api/v1/products`, `/launch_periods`), RSS `/feed`, MCP, OpenAPI | Бесплатно; **120 req/мин/IP**; кэш 1 ч | name, tagline, категории, maker (display name), сайт — в `/products/{slug}.md` | median 99/нед (посл.: 50/48/73/79/120) [самоотчёт] | **Низкий** (официально приглашает агентов: «не краулить интерактивные страницы») | Средне-высокая (Dev 281, AI 920, SaaS 1 336 из 2 592) | P2 — чистый по ToS запас (замена №3) |
| **DevHunt** (raw §6) | Нет API/RSS; HTML + sitemap 6 991 `/tool/…` + JSON-LD | Листинг бесплатно; запуск $19/$49 (на сайте расхождение: llms.txt «$49») | name, description, **сайт `sameAs`**, категории, maker-профиль (GitHub/Twitter) | ≈15/день новых заявок (450/30 дн.) [самоотчёт /stats 2026-09-29] | Низкий–средний (robots разрешает; ToS-страницы нет) | Очень высокая (только dev-tools, MCP/agents) | P2 (ниша dev) |
| **BetaList** (raw §2) | Atom-фид `betalist.com/startups/feed_original` (25 посл. ≈ 1,5 сут.); API по заявке (токен); HTML | Фид бесплатно; **подача только платная** (цена видна лишь в форме — нет данных); Boost от $99/нед [самоотчёт] | В фиде: name, tagline, описание, ссылка на BetaList; **сайт — 301 `/startups/{slug}/visit`**; maker — имя/профиль BetaList, email не публикуется | ~16-17/день (10-02, 10-03) [малая выборка] | **Высокий** (ToS: «personal, non-commercial transitory viewing only»; API Don'ts: не скрейпить без одобрения) | Средне-высокая (AI-термины 56% из 25 записей); обязателен собственный домен | P2 (фид как сигнал; для коммерч. — запросить API-доступ) |
| **dev.to — тег #showdev** (raw §18.3) | Официальный Forem API v1, GET без ключа | Бесплатно (лимит не найден — нет данных) | title, url статьи, автор: name, username, website_url (34%), github (39%), twitter (10%); URL продукта — в тексте поста | **~72/день** (2 166 за 30 дн.) [измерено] | Низкий–средний (ToS-шаблон «non-commercial viewing»; API публичный) | Высокая (dev), но это блог-посты, не карточки | P2 |
| **PeerPush** (raw §18.2) | REST (OpenAPI) `/api/v1/launches?days≤30`, MCP; **нужен бесплатный ключ** | Бесплатно (ключ); часовая квота не опубликована | `websiteUrl`, `social.twitterUsername/linkedinUrl`, publishedAt, категории | нет данных (нужен ключ) | Средний (ToS 2026-09-10: «commercial purpose other than product promotion» запрещено) | Высокая (dev/AI/MCP) | P2 (проверить ToS и квоту) |
| **Peerlist Launchpad** (raw §5) | Нет API/RSS; **Cloudflare 403** для curl; robots `Allow: /` | Бесплатно | карточка: name, tagline, категории, upvotes; maker — верифицированный индивидуальный профиль (реальное имя); email нет | ~40-50/нед (самоотчёт 2025-02-11, **возраст ≈20 мес.**); 2026 — нет данных | Средний (ToS 2024-11-27 без явного запрета; антибот) | Высокая (dev/design, «v0/Lovable-эра») | P3 (только вручную/браузер) |
| **Microlaunch** (raw §7) | Нет API/RSS; sitemap 18.6k; HTML | Бесплатно; Premium — цена не найдена | name, tagline, категории, maker (полное имя), **«Visit Website» с прямым href** (`?ref=microlaunch`) | ~138 в октябрьской когорте `[ОЦЕНКА: счётчик главной, месячный цикл]` | Средний–высокий (ToS 04/03/2023: non-commercial — **устарело (до 2025)**) | Средняя | P3 |
| **Fazier** (raw §8) | Нет API/RSS; sitemap `/launches/` 7 975; HTML | Подача бесплатно | name, tagline, pricing, категории, **«Visit» с прямым href** (`?ref=fazier`), имя мейкера (в комментариях) | ~10-40/день (5/11/17/11/42 за 5 дней по главной) | Средний–высокий (ToS: «no harvest user data without consent», «no copy/mirror») | Средняя (SaaS/AI) | P3 |
| **Launching Next** (raw §10) | Нет API/RSS; HTML | Листинг; Express от $149 [самоотчёт] | name, tagline, «Visit Website»; мейкера нет | ~5/день `[ОЦЕНКА по 21 новой карточке за 4 дня]`; 45 669 всего (самоотчёт) | Средний (ToS нет; JS-проверка на ботов) | Средняя | P3 |
| **Indie Hackers** (raw §3) | Нет RSS/публичного API; **Cloudflare 403** | Просмотр бесплатно | `/products`: name, tagline, «Visit website», **выручка (self-reported/verified)**; email нет | нет данных | **Высокий** (ToS: запрет crawl/scrape/copy; «personal, non-commercial use») | Средняя (SaaS/indie; выручка → ось 4) | Skip (только ручное чтение) |
| **SaaSHub** (raw §11) | API (2 эндпоинта, бесплатный `api_key`) — только alternatives/product; `/new` HTML; Cloudflare | API бесплатно (обязательна атрибуция) | name, tagline, saashubUrl; **списка новых нет** | 241 661 всего; поток — нет данных | Средний (списки/статы CC BY-SA 4.0; ToS 2023-10-13 — **устарело (до 2025)**) | Средняя | P3 |
| **TAAFT** (raw §12) | Нет API/RSS; **Cloudflare 403** | Листинг платный/free — нет данных | «Open website», категория, цена, «Released Nd ago» | 50k+ (самоотчёт); поток — нет данных | **Высокий** (ToS 2026-03-19 §2.20: прямой запрет scrape/crawl) | Высокая (AI) | Skip |
| **Futurepedia** (raw §13) | Нет API/RSS; sitemap 1 332 инструмента | — | нет | нет данных | Средний (ToS-страницы нет) | Высокая (AI), но каталог | Skip |
| **Reddit** r/SideProject, r/startups, r/SaaS (raw §14) | Data API (OAuth + **одобрение**); robots `Disallow: /` | Free tier 100 QPM — **только некоммерческое**; коммерч. — договор (цена не публикуется; «$0.24/1k» — 2023, **устарело (до 2025)**) | посты, автор u/, ссылки | нет данных (подписчики — блоги, источник заинтересован) | **Блокирующий** (Developer Terms §4.1: «on behalf of a business / monetized» → договор) | Высокая (SideProject) | Skip |
| **Startup Stash** (raw §15) | WP-RSS пустой; sitemap; каталог ресурсов | — | каталог инструментов | n/a (не поток запусков) | Средний (ToS-шаблон non-commercial) | Низкая | Skip |
| **AlternativeTo** (raw §16) | Публичного API нет; Cloudflare 403 | — | — | нет данных | нет данных | Средняя | Skip |
| **G2** (raw §17) | API по токену + подписки; `GET /api/v2/products` | Платно/entitlements — нет данных | name, domain, product_url… | зрелые продукты, не запуски | **Высокий** (ToU §9: запрет автоматического сбора, «whether or not publicly accessible») | Низкая | Skip |
| **Launch YC** `ycombinator.com/launches` (raw §18.4) | Недокументированный JSON (при не-браузерном запросе); HTML | — | company.url, batch, tags, tagline | ~4/день (20 за 5 дн.) | **Высокий** (YC ToU: no scraping) | Высокая (YC) | Skip (брать Launch HN через API) |
| **Made with Lovable** (+ Lovable Launched) (raw §18.7) | HTML + sitemap 533; JSON-LD `url` + `author` (X) | Бесплатно | сайт, автор (X-ссылка), дата | ≈5/нед `[ОЦЕНКА]` | Средний (ToS нет) | Целевая для гипотезы (проекты на Lovable), но ниша мала | P3 |
| **Tiny Startups** (raw §18.5) | Нет API/RSS; sitemap | Бесплатно; апгрейды $99-$299 | revenue-лидерборд, профили | 3 797+ за всё время (самоотчёт) | Низкий–средний `[ОЦЕНКА]` | Средняя | P3 |
| **StartupBase / Open Launch / Lobsters** (raw §18.5-18.6) | StartupBase RSS = только блог; Open Launch — нет; Lobsters — robots `Disallow: /` для не-поисковых ботов | — | — | — | Lobsters: Высокий | — | Skip |

---

## 3. Топ-3: факты для использования

### 3.1 Hacker News — Show HN (raw §1)

**Эндпоинты и лимиты (проверено live):**
- Алголия: `https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&numericFilters=created_at_i>=S,created_at_i<E&hitsPerPage=1000&page=N`. Без ключа. Лимит из доки: «10,000 per hour» с одного IP. `hitsPerPage` режется до 1000, глубина выдачи — 1000 хитов на запрос → для выгрузок резать по `created_at_i` (суточные окна ≤162 хитов — проблемы нет). Фильтры по `points`/`num_comments` — `numericFilters` (по доке).
- Поля hit: `title, url, author, points, story_text, num_comments, created_at, created_at_i, objectID, _tags, children`.
- Firebase: `https://hacker-news.firebaseio.com/v0/item/{id}.json`, `/v0/user/{id}.json` («There is currently no rate limit»). Поле `user.about` — единственный публичный след контакта.
- **Ловушка:** `/v0/showstories` — это страница `/show` с порогом по очкам, а не весь поток: 147 id, из них 16 за последние 24 ч (при ~124 Show HN/сутки); `/v0/newstories` (500) покрывает 19.1 ч, из 62 Show HN там лишь 12 есть в `showstories`. Полный поток = Algolia (или `maxitem` назад + фильтр по title).

**Объём и качество (Algolia, 2026-10-04):** 30 дн.: 3 710 постов (123.7/день; мин 71 в субботу 09-19, макс 162 во вторник 09-29); стабильно 122-137/день за три месяца. 90 дн.: 11 482; с URL 97.3%; github.com 35.5%; собственный/кастомный домен ≈57% (≈71/день); медиана очков 2; ≥5 очков 18.9% (≈24/день), ≥10 — 8.7% (≈11/день), ≥50 — 2.9% (≈3.7/день).

**Контакт:** выборка 300 авторов за 30 дн.: `about` непустой 31%, email-подобная строка 5%, любая ссылка 15% (github 4%, X 2%, LinkedIn 0.7%). 35.5% постов ведут на GitHub-репозиторий (профиль/стек — отдельные оси).

**ToS/robots:** `news.ycombinator.com/robots.txt` — `Crawl-delay: 30`, закрыты только интерактивные пути. YC Terms of Use (Site = ycombinator.com **со всеми поддоменами**): «you will not engage in or use any data mining, robots, scraping or similar data gathering or extraction methods» → HTML-скрейп HN запрещён; официальные API (Firebase/Algolia) опубликованы для публичного использования.

**Правила Show HN** (цитата): «Don't post quickly-generated one-offs; anybody can do that now» — сообщество само отсекает вайб-кодинг-однодневки; поток смещён к инженерам.

**Launch HN:** ~2-3/нед (33 за 90 дн.), все YC-компании — высококачественный, но маленький сегмент; фид `hnrss.org/launches` (3-я сторона) и страница `news.ycombinator.com/launches`.

### 3.2 Uneed (raw §4)

- Базовый URL: `https://mcp.uneed.best/v1/…` (без ключа; «per-IP rate limits apply», числа не опубликованы). MCP: `https://mcp.uneed.best/mcp`. OpenAPI: `https://mcp.uneed.best/openapi.json`.
- Свежие запуски: `GET /v1/launches?limit=50[&category=Development][&tag=…]` (newest first, макс. 50, пагинации в спеке нет — окно ≈ 1-2 суток). Рейтинг дня: `GET /v1/trending?period=daily&date=YYYY-MM-DD&limit=50`. Карточка: `GET /v1/products/{slug}`.
- Поля: `name, slug, description, rich_description, url, uneed_url, category, pricing, launch_date, created_at, twitter, bluesky, linkedin, github, instagram, facebook, youtube, open_source, repo_url, domain_rating, on_sale, ttm_revenue/ttm_profit (только для продаваемых)`. Запуски дня публикуются пачкой (~07:01 UTC по `created_at`).
- Объём: 30 / 26 / 34 / 21 / 17 за 09-29…10-03; 39 за 10-04 (на момент проверки).
- ToS (2025-07-31, право Франции): запрещены автоматизированные комментарии/сообщения и накрутка голосов; запрета скрейпинга/коммерческого использования данных нет. Площадка сама продаёт доступ как «free, read-only, official».
- Ограничения: нет имени мейкера и email; соцссылки заполнены у 18-32% карточек; лимиты неизвестны.

### 3.3 TinyLaunch (raw §9)

- Список недели: `https://www.tinylaunch.com/launch-archive/{YYYY}/{M}/{D}` (понедельники: 2026/9/7, 9/14, 9/21, 9/28 → 303, 335, 280, 365 запусков; страница ~2-2.5 МБ HTML). Карточка: `https://www.tinylaunch.com/launch/{id}-{slug}` с JSON-LD `SoftwareApplication` (`name, description, url, sameAs=сайт продукта, applicationCategory, datePublished`). Sitemap: `https://www.tinylaunch.com/sitemap.xml` (17 346 `/launch/…`, 138 недельных архивов).
- Использовать хост `www.` (apex `tinylaunch.com` при проверке рвал TLS-соединение).
- robots: запрещены `/admin`, `/dashboard`, `/api`, `/auth`; страницы запусков и архива разрешены. ToS (2024-12-30, оператор Christopher Woggon, право Германии) запретов скрейпинга/коммерческого использования данных не содержит. «Agent API» (`/api/v1`, OpenAPI) — только для подачи запусков; `GET /startups` отдаёт лишь собственные записи (401 без токена).
- Категории: SaaS & Tools, AI & ML, Developer Tools суммарно ≈41% недели 09-28 (149 из 365).
- Мотивация запусков на досках во многом SEO: TinyLaunch на главной продаёт «Badge & 72+ DR Backlink», Uneed — «75 DR backlink», DevHunt/BetaList — do-follow ссылку (их же маркетинг) → доля «лёгких» AI-обёрток и backlink-проектов в потоке высокая (наблюдение по названиям; доля не измерялась).

---

## 4. Откуда брать URL сайта и контакт (по площадкам)

| Площадка | URL сайта | Сигналы контакта (email нигде не публикуется) |
|---|---|---|
| HN | поле `url` (35.5% — GitHub-репозиторий) | HN `about`: email 5%, ссылки 15%; GitHub-профиль через URL репозитория |
| Uneed | поле `url` | X 32%, LinkedIn 26%, GitHub 18% (выборка 50) |
| TinyLaunch | JSON-LD `sameAs` | имя мейкера (имя без фамилии), X-хэндл ~37% |
| Smol Launch | `/products/{slug}.md` → Website | display name мейкера + профиль на площадке |
| DevHunt | JSON-LD `sameAs` | профиль maker (`/@user`: GitHub/Twitter) |
| BetaList | 301 `/startups/{slug}/visit` → сайт (`?ref=betalist`) | имя/профиль BetaList; площадка прямо пишет, что email не публикуются и что лидген-скрейп каталогов — «common practice» |
| Microlaunch | прямой href «Visit Website» | полное имя мейкера |
| Fazier | прямой href «Visit» | имя автора в комментарии (+ должность) |
| PeerPush | `websiteUrl` (нужен API-ключ) | `twitterUsername`, `linkedinUrl` |
| dev.to | в тексте поста | `website_url` 34%, GitHub 39%, X 10% (поля автора) |
| Made with Lovable | JSON-LD `url` | `author` (X-ссылка) |
| Peerlist | в карточке (кнопка «Visit»), без браузера не проверено | верифицированный профиль с реальным именем (GitHub/LinkedIn/сайт) |
| Indie Hackers | «Visit website» в `/products` | профиль основателя; **выручка** (self-reported/verified) |

Нюансы: параметры `?ref=` / `utm_*` отбрасывать при сравнении доменов; платформы пересекаются слабо (40 совпавших названий в снимках из 6 площадок, в основном пары TinyLaunch∩Smol=11, Uneed∩Fazier=5), но дедупликация по каноническому домену всё равно нужна (raw §19).

---

## 5. robots.txt — что разрешено (сводка)

| Площадка | robots.txt (2026-10-04) |
|---|---|
| news.ycombinator.com | `Crawl-delay: 30`; закрыты только `/collapse? /context? /fave? /flag? /hide? /login /logout /r? /reply? /submitlink? /vote? /x?` |
| hn.algolia.com | robots.txt → 404 (директив нет) |
| betalist.com | директив нет (пустой, только комментарий) |
| indiehackers.com | всем `Disallow:` пусто (разрешено); перечисленные AI-боты (ClaudeBot, GPTBot, anthropic-ai, CCBot…) — `Disallow: /` |
| uneed.best | закрыты только `/*?*sortBy=`, `/*?*orderBy=` |
| peerlist.io | `Allow: /` (но Cloudflare-challenge) |
| devhunt.org | `Allow: /`; закрыты `/private/`, `/account/`, `/api/` (кроме `/api/og/`) |
| microlaunch.net | `Allow: /` |
| fazier.com | закрыты `/admin/ /embeds/ /launch/ /launch-new/ /page/` (`/launches/` разрешён) |
| tinylaunch.com | закрыты `/admin /dashboard /api /auth` (кроме `/api/og`); в комментарии — приглашение AI-агентам к `/api/v1` (для подачи) |
| launchingnext.com | закрыт `/try/`; Baidu/Yandex блокированы; Crawl-Delay 500 для Ahrefs/Semrush/Bytespider |
| saashub.com | MJ12bot закрыт; Amazonbot — `/do-not-crawl/` (читал через Exa; для curl — Cloudflare 403) |
| theresanaiforthat.com | всем `Allow: /`, `Content-Signal: ai-train=no`; закрыты `/api/ /verify/ /cgi-bin/`; десятки AI/SEO-ботов блокированы |
| futurepedia.io | `Allow: /`; закрыты служебные параметры и `/profile` |
| reddit.com | `User-agent: * / Disallow: /` |
| g2.com | много `Disallow` (в т.ч. `/*.rss`, `/search/*`, `/products/*/leads*`) |
| lobste.rs | не-поисковым ботам `Disallow: /` |
| smollaunch.com / peerpush.net / tinystartups.com / open-launch.com | разрешено (кроме служебных путей); Smol и PeerPush явно приглашают AI-агентов |
| alternativeto.net | не прочитан (Cloudflare 403) — нет данных |

---

## 6. Цены доступа к данным (что платное)

| Что | Цена | Источник |
|---|---|---|
| HN Firebase / Algolia API | 0 | raw §1 |
| Uneed REST/MCP, Smol Launch API, dev.to API | 0 | raw §4, §18 |
| PeerPush API | 0 (нужен ключ) | raw §18.2 |
| BetaList: фид | 0; API — по заявке (условия/цена — нет данных); подача стартапа — только платная (цена в форме — нет данных); Boost от $99/нед, спонсорство $4,999/мес (самоотчёт) | raw §2 |
| Reddit Data API | free-tier 100 QPM только некоммерч.; коммерческое — договор, цена не публикуется (блоги: «$0.24/1k» из 2023 — устарело (до 2025); источник заинтересован) | raw §14 |
| G2 API | подписка/entitlements — цена нет данных | raw §17 |
| Платные размещения самих площадок (для справки) | Uneed $14.99/$29.99; TinyLaunch $39; DevHunt $19/$49; Tiny Startups $99-$299; StartupBase $39-$299; Launching Next от $149 (самоотчёты) | raw §4, §6, §9, §10, §18 |

Для воронки платить за доступ к данным не требуется: топ-3 бесплатны.

---

## 7. Ловушки и оговорки (факты)

1. **Firebase `showstories` ≠ все Show HN** (147 id, 16 за сутки против ~124/сутки) — использовать Algolia.
2. **Algolia**: глубина 1000 хитов/запрос и потолок `hitsPerPage=1000`; лимит 10 000 req/ч/IP; rate-limit-заголовков нет.
3. **Окна источников короткие**: BetaList-фид — 25 записей (≈1,5 суток); Uneed `/v1/launches` — максимум 50 новейших; hnrss.org кэширует ~55 мин и временами отдаёт 502.
4. **Cloudflare-стены** для датацентрового IP: Indie Hackers, Peerlist, TAAFT, SaaSHub, AlternativeTo, Lovable Launched — программный доступ не получен; обходов не пробовал.
5. **ToS-шаблон «personal, non-commercial transitory viewing only»** (BetaList, Microlaunch, Startup Stash, dev.to) относится к материалам сайта; для BetaList API-доступ выдаётся «case-by-case» по заявке с описанием цели. Формулировки у площадок разные — перед включением источника перечитывать актуальный ToS.
6. **BetaList**: платная подача + обязательный собственный домен = отбор по усилию основателя; но ToS и «Don'ts» самые жёсткие среди площадок с открытым фидом.
7. **Reddit** для нашего (коммерческого) использования закрыт без договора; **IH, TAAFT, G2, Lobsters, Launch YC-JSON** — ToS/robots прямо запрещают автоматизированный сбор.
8. **Peerlist** — потенциально лучшее качество (верифицированные индивидуальные профили с реальными именами), но без браузера недоступен; актуального объёма за 2026 нет.
9. Данные о размерах площадок (DevHunt `/stats`, Uneed «10 000+», TAAFT «90M+», Launching Next «45 000+», Tiny Startups «3 797+», Smol Launch «State of Indie Launches») — **самоотчёт, источник заинтересован**.
10. Часть ToS старше 2025: Microlaunch (04/03/2023), SaaSHub (2023-10-13), Peerlist (2024-11-27), TinyLaunch (2024-12-30) — **устарело (до 2025)** / на границе; проверить актуальность перед использованием.

---

## 8. Что передать другим осям (только факты)

- **Ось 3 (признаки слабого бэкенда):** хост запуска не выдаёт билдер (см. §1); часть запусков HN — репозитории GitHub (35.5%), где виден стек; BetaList исключает бесплатные субдомены; Made with Lovable — каталог, где билдер известен по определению (533 проекта).
- **Ось 4 (реальный бизнес/деньги):** выручка видна на Indie Hackers (self-reported/verified, но ToS запрещает автоматизацию) и в «Revenue leaderboard» Tiny Startups; `ttm_revenue/ttm_profit` у Uneed — только для листингов «на продажу»; BetaList — платная подача как слабый сигнал.
- **Ось 5 (контакты):** ни одна площадка не публикует email (BetaList: «We don't include email addresses in your public listing»); доступны соцсcылки/профили (см. §4); HN `about` даёт прямой email у ~5% авторов.
- **Ось 6 (cold-email):** BetaList прямо признаёт, что «service providers scrape startup directories (including BetaList) for leads» — но это не разрешение; ToS площадок не регулируют письма вне платформ.

---

## 9. Источники (URL)

- HN: https://github.com/HackerNews/API · https://hacker-news.firebaseio.com/v0/ · https://hn.algolia.com/api · https://news.ycombinator.com/robots.txt · https://news.ycombinator.com/showhn.html · https://news.ycombinator.com/launches · https://www.ycombinator.com/legal/ · https://hnrss.org/
- BetaList: https://betalist.com/faq · https://betalist.com/terms · https://betalist.com/startups/feed_original · https://gist.github.com/marckohlbrugge/5a29bf1ba628bb4ca960 · https://betalist.com/advertise
- Indie Hackers: https://www.indiehackers.com/robots.txt · https://www.indiehackers.com/terms · https://www.indiehackers.com/products
- Uneed: https://www.uneed.best/llms.txt · https://mcp.uneed.best/openapi.json · https://www.uneed.best/terms-of-use · https://www.uneed.best/launch.txt · https://www.uneed.best/robots.txt
- Peerlist: https://peerlist.io/robots.txt · https://peerlist.io/blog/commentary/peerlist-launchpad-the-path-forward · https://help.peerlist.io/individual/launchpad/frequently-asked-questions-about-spotlight-by-peerlist · https://help.peerlist.io/legal/terms-and-conditions.md
- DevHunt: https://devhunt.org/robots.txt · https://devhunt.org/llms.txt · https://devhunt.org/faq · https://devhunt.org/stats · https://devhunt.org/sitemaps/tools.xml
- Microlaunch: https://microlaunch.net/robots.txt · https://microlaunch.net/terms
- Fazier: https://fazier.com/robots.txt · https://fazier.com/terms-of-service
- TinyLaunch: https://tinylaunch.com/robots.txt · https://www.tinylaunch.com/openapi.json · https://www.tinylaunch.com/llms.txt · https://www.tinylaunch.com/tos · https://www.tinylaunch.com/pricing · https://www.tinylaunch.com/sitemap.xml
- Launching Next: https://www.launchingnext.com/llm-info.html · https://launchingnext.com/robots.txt
- SaaSHub: https://www.saashub.com/site/api · https://www.saashub.com/site/terms · https://www.saashub.com/new
- TAAFT: https://theresanaiforthat.com/terms/ · https://theresanaiforthat.com/robots.txt
- Futurepedia: https://www.futurepedia.io/robots.txt · https://www.futurepedia.io/sitemap_tools.xml
- Reddit: https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki · https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy · https://redditinc.com/policies/developer-terms · https://support.reddithelp.com/hc/en-us/articles/26410290525844-Public-Content-Policy · https://www.reddit.com/robots.txt
- G2: https://data.g2.com/api/v2/docs/index.html · https://legal.g2.com/terms-of-use · https://www.g2.com/robots.txt
- Smol Launch: https://smollaunch.com/openapi.json · https://smollaunch.com/llms.txt · https://smollaunch.com/state-of-indie-launches/data.json
- PeerPush: https://peerpush.com/api-reference · https://peerpush.com/api/v1/openapi.json · https://peerpush.com/terms
- dev.to: https://developers.forem.com/api/v1 · https://dev.to/api/articles?tag=showdev · https://dev.to/terms
- Прочее: https://www.ycombinator.com/launches · https://madewithlovable.com/ · https://www.tinystartups.com/llms.txt · https://www.startupbase.io/llms.txt · https://lobste.rs/robots.txt · https://startupstash.com/terms-of-service
