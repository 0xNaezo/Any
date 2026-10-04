# Ось 5. Поиск контакта основателя/мейкера — RAW-дамп

Дата прогона: **2026-10-04** (UTC). Шаг воронки: найти ПЕРСОНАЛЬНЫЙ email основателя/мейкера свежезапущенного продукта, легально. Объём: 2–5 писем/день. Бюджет: приоритет бесплатному.
Это полный дамп: источники, лимиты/цены, живые проверки с датой, цитаты ToS и правовых текстов, методика и сырые цифры собственного мини-замера. Дистиллят — в `research2/findings/5-contact-finding.md`.

---

## 0. Метки, метод, что НЕ удалось

**Метки.** `[ОЦЕНКА]` — моя оценка с обоснованием (не факт). «источник заинтересован» — цифра/утверждение вендора или его конкурента. «устарело (до 2025)» — источник старше 2025. «нет данных» — не нашёл/не смог проверить.

**Инструменты.** WebFetch, WebSearch, Exa (поиск и fetch «сырого» текста), а также curl/python из песочницы через прокси сессии (публичные API, DNS-over-HTTPS, RDAP). Все проверки датированы 2026-10-04, если не сказано иное. WebSearch-бюджет сессии (200 вызовов) закончился в процессе; последующие проверки сделаны через WebFetch/Exa.

**Чего не удалось проверить (и почему):**
- `api.github.com` из песочницы — блок прокси: HTTP 403 «This GitHub API path is not available: sessions are bound to their configured repositories» (и для `gh api`, и для неавторизованного curl); WebFetch на `api.github.com` — тоже HTTP 403. Поэтому **живой замер доли GitHub-профилей/коммитов с открытым email НЕ выполнен**; вместо него — литература и [ОЦЕНКА]. Обходить блок я не пытался.
- Прямой fetch `x.com/en/tos` — HTTP 402; формулировка X ToS взята из TechCrunch (2023-09-08).
- Официальные страницы цен Apollo и Prospeo — JS-рендер: WebFetch и Exa вернули пустую таблицу/только `<title>`. Цифры Apollo взяты с официальной страницы `apollo.io/email-finder` (FAQ) и из help-центра Prospeo; цены в USD для Prospeo и для платных планов Apollo — только из сторонних обзоров.
- `/r/p/<id>` (редирект Product Hunt на сайт продукта из фида) — Cloudflare challenge (HTTP 403, `cf-mitigated: challenge`); сайт продукта по PH-фиду без обхода защиты получить нельзя (подробности — ось 1). Обходить я не пытался.
- Исходящий SMTP (порт 25) из песочницы: DNS-резолв `aspmx.l.google.com` проходит, TCP:25 — timeout 8 с (2026-10-04). Следовательно, самостоятельная SMTP-проверка адресов здесь не проверена.
- Прямой fetch ряда страниц (NeverBounce pricing, HubSpot Community) через WebFetch давал 403; открыты через Exa.
- Страница privacy-policy Prospeo не отдала текст (только `<title>`); privacy-пассажи Snov (основание, срок хранения) — только через поисковую выдачу, `snov.io/gdpr` открыт напрямую; Hunter ToS/Privacy, Apollo Privacy, Findymail GDPR, Anymail `/about` открыты напрямую (WebFetch). Где источник — выдача, это помечено в тексте.

---

## 1. Бесплатные публичные источники email мейкера

### 1.1. Сайт продукта (главная, /contact, /about, /privacy, /terms, mailto, футер) — мини-замер на 2026-10-04

**Зачем замер.** Нужна оценка, «какая доля свежих запусков показывает email на собственном сайте». PH-выборку собрать автоматически нельзя (см. п. 0 про `/r/p/`), поэтому использована **ближайшая публичная проксия — Show HN** (HN Algolia API, публичный, без ключа).

**Методика (параметры замера):**
- Выборка: 900 новейших постов `tags=show_hn` с `points>=2` (период 2026-09-22 … 2026-10-04, ≈12 дней; медиана очков 3, т.е. типичные «свежие» запуски без большой тяги). Из них 502 уникальных домена не-код-хостингов (github/gitlab/youtube/npm/pypi/medium/substack и т.п. исключены) и 281 GitHub-репозиторий.
- Случайная подвыборка 100 доменов (seed 20261004); отвечало 98 (2 — HTTP 4xx/5xx).
- Для каждого сайта: robots.txt проверен (ни один из 100 не запретил главную), главная + до 5 внутренних кандидатов (ссылки по шаблону contact/about/team/company/imprint/impressum/privacy/legal/terms/support/security/press + `/contact` + `/about`), в среднем 3,1 страницы на сайт. Только «сырой» HTML (без JS-рендера), размер ≤1,5 МБ, UA с пояснением «one-off research». Дешифровка Cloudflare email-protection и простых обфускаций `[at]`/`(at)` включена.
- Адреса НЕ сохранялись и не выводились: только булевы признаки/категории. Классификатор «role-based vs person-like» — эвристика (список ролей info/hello/support/contact/team/sales/security/…, имя-продукта-как-локальная-часть = role, плейсхолдеры you@/jane@/name@ отброшены). Первый прогон вручную сверен по локальным частям (27 сайтов): найдены плейсхолдеры и артефакты `u003c`; фильтры добавлены, финальные цифры — из второго прогона (без повторной ручной сверки).

**Результаты (n=98 сайтов, 95% доверительный интервал Уилсона):**

| Показатель | k/n | % | 95% ДИ |
|---|---|---|---|
| Любой email (не placeholder) на просмотренных страницах | 52/98 | 53% | 43–63% |
| Только role-based (info@/hello@/support@…) | 34/98 | 35% | 26–45% |
| Person-like (похож на личный; любой домен) | 18/98 | 18% | 12–27% |
| — из них на собственном домене продукта | 9/98 | 9% | 5–17% |
| — из них freemail (gmail и т.п.) | 2/98 | 2% | 1–7% |
| Есть контактная форма | 15/98 | 15% | 10–24% |
| Ни email, ни формы | 44/98 | 45% | 35–55% |
| Ссылка на GitHub (user/org) | 9/98 | 9% | 5–17% |
| Ссылка на X/Twitter | 21/98 | 21% | 15–31% |
| Ссылка на LinkedIn | 12/98 | 12% | 7–20% |
| Любая из ссылок GitHub/X/LinkedIn | 28/98 | 29% | 21–38% |
| `/.well-known/security.txt` с `Contact:` | 8/98 | 8% | 4–15% |

**Ограничения замера (важно):**
1. Show HN — это технарская аудитория; для no-code/AI-билдер-аудитории (целевая гипотеза канала) доли, вероятно, ниже. Прямых данных нет.
2. Без JS-рендера — SPA-сайты занижены (но «JS-оболочек» <3 КБ HTML в выборке было 2 из 98).
3. «Person-like» ≠ «валидный личный адрес основателя»: адрес мог принадлежать другому человеку/команде, быть неактуальным; SMTP-валидность не проверялась (порт 25 недоступен, см. п. 0).
4. n≈100 → ДИ широкие (±8–10 п.п.).

### 1.2. Product Hunt (профиль мейкера, API, ToS)

- **Профиль мейкера** (Exa fetch `https://www.producthunt.com/@rrhoover`, 2026-10-04): блок «Links: Website, Twitter» + bio + «Maker History»; **email нет**. Один пример (самый заметный пользователь) — вывод «PH даёт Twitter/X и сайт, email нет» подтверждён лишь на нём плюс сторонними описаниями API.
- **API v2** (`https://api.producthunt.com/v2/docs`, fetch 2026-10-04): GraphQL; доступ по токену; цитата: «The Product Hunt API must not be used for commercial purposes. If you would like to use it for your business, please contact us at hello@producthunt.com.» Поля пользователя `twitter_username`, `website_url`… — по **сторонним** описаниям (Apify/publicapi.dev), страница схемы пользователя не открылась (CRAWL_UNKNOWN_ERROR); `email` в публичной схеме по тем же описаниям не отдаётся. Подробности API — ось 1.
- **ToS** (живая страница `https://www.producthunt.com/legal`, Terms «Effective date: August 17th 2014», Privacy «Effective date: January 1, 2020» — **устарело (до 2025)** по дате, но это действующий текст на 2026-10-04). Цитаты: «You will only use the Services for your own internal, personal, non-commercial use, and not on behalf of or for the benefit of any third party…»; п. (g) запрет «Runs Maillist, Listserv, any form of auto-responder or “spam” on the Services…»; п. (h) «“Crawls,” “scrapes,” or “spiders” any page, data, or portion of or relating to the Services or Content (through use of manual or automated means)»; п. (i) «Copies or stores any significant portion of the Content».
- **Фид** `https://www.producthunt.com/feed` (HTTP 200, Atom, 50 записей на 2026-10-04): поля `title`, ссылка на пост, `published/updated`, `author/name`, короткий tagline; ссылка «Link» = `https://www.producthunt.com/r/p/<postId>?app_id=339` → при запросе из песочницы Cloudflare challenge (HTTP 403). Email мейкера в фиде нет.
- Страница продукта (Exa fetch, пример `/products/corespeed`) показывает «Company Info: corespeed.io» и «Launch Team», но PH ToS запрещает scraping (см. выше) — легальный путь получить URL сайта: ось 1.

### 1.3. GitHub (email в профиле и в git-коммитах)

**Что говорит ToS (WebFetch-извлечение 2026-10-04; дата редакции на страницах не показана):**
- GitHub Acceptable Use Policies, раздел «Information Usage Restrictions» (нумерация разделов — по извлечению WebFetch: п. 7): «You may not use information from the Service (whether scraped, collected through our API, or obtained otherwise) for spamming purposes, including for the purposes of sending unsolicited emails to users or selling personal information, such as to recruiters, headhunters, and job boards.»
- Там же, п. 4 «Spam and Inauthentic Activity on GitHub»: запрещены «automated excessive bulk activity and coordinated inauthentic activity, such as spamming» и «bulk distribution of promotions and advertising prohibited by GitHub terms and policies».
- AUP: «Scraping refers to extracting information from our Service via an automated process, such as a bot or webcrawler. Scraping does not refer to the collection of information through our API.»
- GitHub Terms of Service, раздел H (API Terms): «You may not use the API to download data or Content from GitHub for spamming purposes, including for the purposes of selling GitHub users' personal information, such as to recruiters, headhunters, and job boards.» и «Abuse or excessively frequent requests to GitHub via the API may result in the temporary or permanent suspension of your Account's access to the API.»
- Вывод по букве: письмо «unsolicited email to users» с адресом, добытым с GitHub, формально подпадает под запрет AUP, даже если оно персональное и единичное; санкция — на аккаунт GitHub (блок), а не уголовная/гражданская. Грань «персональное 1:1 релевантное письмо» vs «spam» GitHub в тексте не проводит. [ОЦЕНКА: риск блока для 2–5 писем/день с чужого аккаунта низкий, но не нулевой; GitHub-аккаунт, с которого идёт добыча, лучше не связывать с рабочим.]

**Публичность адресов:**
- Docs «Setting your commit email address» (fetch 2026-10-04): «To keep your email address private when performing web-based Git operations, select Keep my email addresses private.»; при включённой приватности адрес автора = no-reply; «Any commits you made prior to changing your commit email address are still associated with your previous email address».
- Docs «Email addresses reference»: для аккаунтов, созданных после июля 2017, noreply = `<ID+USERNAME@users.noreply.github.com>`.
- Docs «Blocking command line pushes that expose your personal email address»: «If the author email on that commit is a private email on your GitHub account, we will block the push and warn you about exposing your private email.» (опция «Block command line pushes that expose my email» — отдельная и включается пользователем).
- GitHub Community Discussion #170510 (2025-08-21): просьба сделать «Keep my email addresses private» значением по умолчанию; подтверждения изменения от GitHub нет, переключатель остаётся opt-in. По состоянию на 2025-08 приватность — не по умолчанию; на новом аккаунте 2026 года я это не проверял.
- Docs/Privacy Statement: отдельной фразы «email в git-коммитах публичен» в открытых фрагментах не нашёл (WebFetch: «could not find any specific statement…»); публичность коммит-email — следствие устройства git, подтверждена исследованиями ниже.

**Исследования о доступности email (литература):**
- arXiv 1908.05354 «Large-Scale-Exploit of GitHub Repository Metadata and Preventive Measures» (2019, **устарело (до 2025)**): аннотация — инструмент дал «access to millions of email addresses in very little time»; по пересказу поисковой выдачи: у выборки noreply включён примерно у 11,7–13,9% пользователей, т.е. у ~86–88% адрес в коммитах открыт (цифры из вторичного пересказа, оригинал полностью не читал).
- arXiv 2601.14034 «Analyzing the Availability of E-Mail Addresses for PyPI Libraries» (Tsakpinis, Pretschner; данные собраны с 2025-12-07). v1 (2026-01-20): 686 034 библиотек; 81,6% имеют ≥1 валидный email (PyPI-метаданные 79,5%); email на GitHub (профиль владельца репозитория) — только 22,1% библиотек (2,1% «только GitHub» + 20,0% «и там и там»); 18,4% — без email; из 698 141 «невалидных» записей 79,9% — с GitHub, 95,1% невалидных — «пустое поле». v2/v3 (2026-04-30 / 2026-05-01): 754 413 библиотек, 79,1% с валидным email, PyPI 76,5% (по аннотации arXiv). Для индивидуальных (не организационных) проектов контакт указывают реже (в статье: «individually developed libraries tend to lack contact information more often»). **Это библиотеки Python, а не SaaS-стартапы;** используется как слабая проксия для «публичный email в GitHub-профиле ≈ 1 из 5 разработчиков».
- Замер доли профилей/коммитов в моей выборке — не выполнен (блок, п. 0).

### 1.4. Реестры пакетов (npm, PyPI)

- **npm registry** (curl 2026-10-04, `registry.npmjs.org/<pkg>`; проверялись только булевы поля): `express`, `zod`, `left-pad`, `vite` — у всех 4 в `maintainers[]` есть поле `email` и в `_npmUser` есть `email`; `author.email` в последней версии присутствует у 2 из 4. n=4 — только подтверждение механизма, не доля.
- **npm Open-Source Terms** (fetch 2026-10-04; «Last Modified Date: March 10, 2022» — **устарело (до 2025)**): «You will not use npm Services' ability to send e-mail to send advertisements, chain letters, or other solicitations.» (это про отправку писем средствами npm, не про использование адресов из реестра); «You may replicate data from the Public Registry using the Public APIs per this Agreement.»; «You will not automate access to, use, or monitor the Website, such as with a web crawler, browser plug-in or add-on, or other computer program that is not a web browser.» Явного запрета связываться с мейнтейнерами по адресам из реестра в тексте не найдено.
- **PyPI**: по arXiv 2601.14034 — 76,5–79,5% библиотек публикуют email в метаданных PyPI (см. 1.3). Условия использования PyPI на предмет рассылок — нет данных.
- Применимость: только для запусков, у которых есть публикуемый пакет/CLI/SDK (dev-tools).

### 1.5. Hacker News: поле `about` профиля автора Show HN

Замер 2026-10-04 (публичный Firebase API `hacker-news.firebaseio.com/v0/user/<id>.json`, 176 уникальных авторов из той же выборки Show HN): `about` непустой — 65/176 (37%; ДИ 30–44%); содержит email (в т.ч. обфусцированный) — **5/176 (2,8%; ДИ 1,2–6,5%)**; содержит URL — 26/176 (15%); ссылку на GitHub/X/LinkedIn — 12/176 (7%). Email в профиле HN (скрытое поле) API не отдаёт.

### 1.6. X/Twitter (bio)

- X Terms (через TechCrunch, 2023-09-08; прямой fetch 402): «NOTE: crawling or scraping the Services in any form, for any purpose without our prior written consent is expressly prohibited.» Вступило в силу 2023-09-29; прежняя редакция допускала crawling по robots.txt, но запрещала scraping без согласия — **устарело (до 2025)** как дата, актуальную редакцию на 2026-10-04 не смог открыть.
- Доля био с email у indie/dev-основателей: **нет данных**. Цена/условия платного API X в 2026: **нет данных** (не проверял).
- Ссылка на X есть на 21% (15–31%) сайтов в моей выборке (п. 1.1), т.е. маршрут «сайт → X → bio» применим примерно в каждом пятом случае, но автоматический сбор запрещён ToS; ручной просмотр — вне запрета (ToS говорит про crawl/scrape).

### 1.7. LinkedIn

- User Agreement, раздел 8.2 «Don’ts» (пересказ поисковой выдачи по `linkedin.com/legal/user-agreement`): запрещено «develop, support or use software, devices, scripts, robots or any other means or processes (including crawlers, browser plugins and add-ons or any other technology) to scrape the Services or otherwise copy profiles and other data from the Services»; страница помощи «Prohibited software and extensions» подтверждает риск ограничения аккаунта.
- Видимость email (LinkedIn Help «Manage who can see your email address…», выдача 2026-10-04): основной email по умолчанию виден только контактам 1-й степени; пользователь может выбрать «Only visible to me», «1st-degree connections» или «Anyone on LinkedIn». Для холодного контакта (не 1-я степень) email, как правило, недоступен легально.
- Регуляторный риск: CNIL оштрафовала KASPR на 240 000 евро именно за сбор контактов LinkedIn, включая данные, видимость которых пользователи ограничили (п. 4.4).

### 1.8. WHOIS / RDAP (насколько «живой» источник)

**Политика (ICANN):**
- WHOIS (порт 43 и веб-WHOIS) для gTLD: обязательство прекращено с 28 января 2025 (18 месяцев после вступления Global Amendment 2023-08-07); авторитетный источник — RDAP (announcement `icann.org/.../icann-update-launching-rdap-sunsetting-whois-27-01-2025-en`, выдача 2026-10-04).
- Registration Data Policy вступила в силу 21 августа 2025 (`icann.org/en/contracted-parties/consensus-policies/registration-data-policy`): значения контактов могут быть заменены на «REDACTED», а email — «with an anonymized email or web form»; регистратор обязан публиковать адрес или ссылку на веб-форму, которые «MUST NOT identify the contact email address or the contact itself» (цитата из выдачи по политике/FAQ). ICANN Advisory «Registrars' Use of Communication Web Forms in RDDS» датирована 2026-05-25.
- Побочный факт: CNIL в деле KASPR отметила, что база строилась из LinkedIn и «других сайтов, таких как каталоги доменных имён» (domain name registries) — регуляторы смотрят на WHOIS-сбор как на обработку персональных данных.

**Замер RDAP 2026-10-04** (97 регистрируемых доменов из выборки 1.1; исключён 1 домен на `*.pages.dev`; запросы через `rdap.org` → RDAP регистратора, 1 запрос/с, повторы при 429):
- Ответ регистратора («thick») получен для 83; только реестровый («thin») — 4; RDAP недоступен через bootstrap — 10 (`.io` ×5, `.sh` ×2, `.me`, `.ie`, `.eu` — WHOIS-порт 43 из песочницы не проверялся).
- У 86 из 87 тестируемых доменов в ответе есть контактное поле registrant (у 1 домена полей нет вовсе); в 85 из этих 86 это **веб-форма регистратора или прокси-адрес** (в т.ч. 1 домен `.gov` с адресом реестра), в 1 — похоже на реальный адрес. Формы: URI (Cloudflare Registrar `domaincontact.registrar.cloudflare.com` ×20, GoDaddy ×9, Name.com ×7, Spaceship ×7, Porkbun ×5, Squarespace ×3, Hostinger ×3…); приватные email-прокси: Namecheap `withheldforprivacy.com` ×19 и др.
- **Похоже на реальный email владельца — 1 из 97 (1,0%; ДИ 0,2–5,6%)**; «анонимизированный/прокси/форма» — 85/97 (88%); не тестируемо — 10/97 (10%).
- Вывод: как источник личного email основателя WHOIS/RDAP в 2026 фактически мёртв (≈1%). Прокси-адреса («withheldforprivacy» и т.п.) пересылают почту владельцу, но использовать их для продающего письма — серая зона, не рекомендуется.

### 1.9. security.txt и контактные формы

- `/.well-known/security.txt` с полем `Contact:` — 8/98 (8%; ДИ 4–15%). Это канал для отчётов об уязвимостях (RFC 9116), не для продаж.
- Контактная форма без email — 2/98; формы есть на 15/98.

### 1.10. DNS/MX домена (можно ли вообще писать на домен)

DNS-over-HTTPS (Cloudflare/Google), 97 регистрируемых доменов (2026-10-04):

| MX-провайдер | k/97 | % |
|---|---|---|
| MX отсутствует (есть только A; почта по MX не принимается) | 23 | 24% (ДИ 16–33%) |
| Google Workspace (`*.google.com`) | 20 | 21% (14–30%) |
| Cloudflare Email Routing (`mx.cloudflare.net`) | 18 | 19% (12–27%) |
| Microsoft 365 | 2 | 2% |
| Registrar-/форвард-почта (Namecheap registrar-servers 3, Porkbun 2, Hostinger 2, ImprovMX 2, ForwardEmail 1, GoDaddy 1…) | ≈11 | ≈11% |
| Proton 2, Zoho 2, прочее/самохост | остальное | — |

Для всех 23 доменов без MX повторная проверка через Google DoH подтвердила: MX нет, A-запись есть. Один из 23 показывает email на собственном домене — адрес, вероятно, мёртв. Формально при отсутствии MX MTA пробует A/AAAA как implicit MX; веб-хостинг SMTP, как правило, не принимает [ОЦЕНКА, SMTP не проверял].
Cloudflare Email Routing (docs, `developers.cloudflare.com/email-routing/setup/email-routing-addresses/`): catch-all по умолчанию не включён; при включении «forwards every email sent to your domain, including misspelled local parts»; действие «Drop» — письмо молча уничтожается («can be useful if you want to make an email address appear valid for privacy reasons»). Сообщение сообщества: при незаданном адресе — `550 5.1.1 Address does not exist` на RCPT TO. Т.е. форвардер без catch-all поддаётся SMTP-проверке, с catch-all (и Drop) — нет.

---

## 2. Email-finding сервисы (все проверено 2026-10-04, если не указано иное)

Расчётная «цена за 1 кредит» ниже — моя арифметика от списка цен (не заявление вендора).

### 2.1. Hunter.io
- Источники: `hunter.io/pricing`, `hunter.io/email-finder`, `hunter.io/data-platform`, `hunter.io/privacy-policy`, `hunter.io/terms-of-service`, `hunter.io/blog/cold-email-legal-regulations/`.
- **Free:** $0, 50 кредитов/мес. «With a free account, you can use up to 50 searches/month.» «If the Email Finder fails to provide a result, it is free.» 1 кредит = 1 найденный email (Email Finder/Domain Search); 0,5 кредита = 1 верификация.
- **Платно:** Starter $49/мес (2 000 кредитов/мес; годовая — $34/мес, $408/год), Growth $149 (10 000; $104 годовая), Scale $299 (25 000; $209 годовая); Enterprise — по запросу. Data Platform (API): пример «1 000 Search + 200 000 Verification credits = $6 500», кредиты живут 12 мес. Расчёт: Starter ≈ $0,0245 за кредит.
- **Что отдаёт:** email по имени+домену (Email Finder), список адресов домена (Domain Search), вердикт верификации + confidence score; для найденных «в вебе» — публичные источники с датами обнаружения; для не найденных публично — «наиболее вероятная перестановка имени» с верификацией. Reverse Email Lookup.
- **Заявленное:** «Hunter has one of the most extensive databases of more than one hundred million professional email addresses»; Data Platform: «30M web pages crawled every day, 650M public sources, 150M professional email addresses indexed» — **источник заинтересован**. Числовой % точности на страницах нет.
- **Независимо-ish:** бенчмарк Anymail Finder (п. 2.9; конкурент): Hunter coverage 57,6%, accuracy 86,1%, est. bounce ≈13,9% — **источник заинтересован**, выборка не про стартапы.
- **ToS/GDPR:** Terms (last updated 2024-05-23; WebFetch-цитата): «For any personal data, such as names, professional email addresses, job titles, social networks URLs, or professional phone numbers that you access or obtain when using the Services, (i) you will remain an independent Controller as defined under the EU General Data Protection Regulation, 2016; (ii) will individually determine the purposes and means of its processing; and (c) will comply with the obligations applicable to it under applicable data protection law…». «You must not, in the use of the Services, violate any laws in your jurisdiction and in the United States…». Privacy policy (WebFetch): Profile Data — «Legal Basis: Legitimate business interest»; сбор: «Hunter crawls public web pages… Only public web pages and publicly available content are processed.»; адреса могут быть **сгенерированы** «using pattern analysis»; retention «As long as information is available on public sources or until removal request. Profiles are removed within 3 months if no longer on source pages.»; передача данных пользователям — «Controller-to-Controller transfer»; «We have conducted a Legitimate Interest Assessment and a Data Protection Impact Assessment…» (по запросу privacy@hunter.io); опт-аут — `hunter.io/claim`. Дата-центры в Бельгии, компания зарегистрирована в США (блог Hunter). Блог «Is Cold Email Legal?» (published 2024-06-25, modified 2026-01-15; **источник заинтересован**): «cold emailing is legal, provided you follow the rules…»; разбирает GDPR через legitimate interest, CAN-SPAM, CASL, CCPA; **национальные режимы согласия ePrivacy (Германия/Австрия) и PECR в тексте не упомянуты**; рекомендует писать получателю, откуда взят адрес («I found your contact information on your Contact Us page…»).

### 2.2. Snov.io
- Источники: `snov.io/pricing`, `snov.io/gdpr` (WebFetch), выдача по `snov.io/privacy-policy`.
- **Free:** «Free Trial Plan»: 50 кредитов, 100 получателей, 25 enrichment tokens, 1 слот прогрева; «50 database searches и 50 email searches». Обновляется ли ежемесячно — на странице не сказано.
- **Платно:** Starter $39/мес (1 000 кредитов; $468/год), Pro S $99 (5 000), Pro M $189 (число кредитов на странице распарсилось неоднозначно — как у Pro S), Pro L $369 (20 000), Ultra $738 (50 000). «Each email verification and each prospect costs 1 credit.» Расчёт: Starter ≈ $0,039 за кредит.
- **Заявленное:** «7-tier email verification», без числа. Бенчмарк Anymail Finder: coverage 46,1%, accuracy 75,3%, est. bounce ≈24,7% — **источник заинтересован**.
- **GDPR/ToS (WebFetch `snov.io/gdpr`):** «Snovio also has developed a dedicated Clear From List feature specifically for prospects, allowing you to easily remove your email address from our database.»; «Also, we can act as a joint controller together with our clients when we jointly process personal data of prospects.» Через выдачу по privacy policy (не открывал напрямую): Prospect Data обрабатываются по ст. 6(1)(f) в интересах Snov, клиента и потенциального партнёра; данные из «GDPR-compliant public sources, proprietary databases and trusted partners»; хранение — весь срок использования клиентом + 3 месяца. **Следствие:** пользователь может оказаться совместным контролёром (ст. 26 GDPR) — отдельный риск по сравнению с чисто «независимым контролёром» у Hunter.

### 2.3. Apollo.io
- Источники: `apollo.io/pricing` (JS: таблица не отдалась), `apollo.io/email-finder` (FAQ), `apollo.io/pricing/about-credits`, `apollo.io/privacy-policy` (WebFetch), `docs.apollo.io/docs/api-pricing`.
- **Free (официально, `/email-finder` FAQ):** «Apollo's free plans offer emails with 50 email credits per month (600 per year). The free plan includes access to the Chrome extension, basic search filters, CSV export for bulk lookup, buying intent signals, company lookalikes, and AI research…»; экспорт «up to 25 contacts at a time»; «The free plan includes limited API access.» Из pricing FAQ: «unlimited email addresses» (маркетинг; «Unlimited» регулируется Fair Use Policy).
- **Расхождение источников:** сторонние обзоры (Alex Berman 2026-03-24; HeroHunt 2026-08-04; они ссылаются на Cognism/Prospeo) утверждают: «unlimited» email-кредитов с fair-use потолком 10 000/мес для аккаунтов с корпоративным доменом и 100/мес для личного домена; 5 mobile, 10 export credits, ~75 «общих» кредитов/мес, ~250 отправок/день. **Реальный лимит нового аккаунта не установлен** (нужна регистрация) — для планирования брать официальный минимум 50/мес.
- **Платно (сторонний обзор Glozo 2026-07-09; официально не подтверждено):** Basic $49, Professional $79, Organization $119 за пользователя/мес при годовой оплате; месячная — на 15–25% дороже. Кредиты не переносятся (официальная страница about-credits: «Your credits expire at the end of each billing cycle»). API: People Enrichment 1–9 кредитов («1 credit for demographics/email; +8 credits if mobile phone is returned»).
- **Что отдаёт:** бизнес-email (B2B), Chrome-расширение, бд «240M contacts» (заявление вендора); «Our platform does not support business to consumer “B2C” communications» — личные/потребительские адреса не цель.
- **Точность:** бенчмарк Anymail (конкурент): coverage 68,1%, accuracy 91,3%, est. bounce ≈8,7% — **источник заинтересован**; обзор HeroHunt (2026-08-04): «verified» emails бонсятся «15 to 35 percent in the wild» — сторонний, без методики; считать анекдотом.
- **ToS/GDPR:** Pricing FAQ: «The plans on this page are for internal business use only. Using Apollo data to power external products, share with customers, or resell is not permitted under standard terms». Privacy policy (last updated 2026-08-10; WebFetch): источники — «publicly accessible websites, professional directories, public regulatory and government sources» + данные, переданные клиентами; «When Customers submit data through the Service, they acknowledge that Apollo may use it to grow, enrich, and verify its Contributor Database, which is made available to other Customers.»; основание — «Legitimate interests… create, verify, enrich, and maintain business contact and firmographic information»; удаление: Removal Page / privacy@apollo.io. Т.е. часть базы — контакты из почтовых ящиков/адресных книг пользователей Apollo, о чём субъекты не информировались при сборе (прямой регуляторный вопрос; специальных санкций против Apollo в проверенных источниках не нашёл — **нет данных**).

### 2.4. Prospeo
- Источники: help-центр `help.prospeo.io` (статья «How Prospeo Credits Work», updated 04/06/2026 — формат даты неоднозначен; «Plans and Pricing Overview»), страница pricing не отрендерилась.
- **Free:** 100 кредитов/мес («Free: 100 credits per month»), «Limited API access»; кредиты не переносятся. (В ряде вторичных источников — 75; по help-центру 100 — принимаю 100.)
- **Кредиты:** 1 = верифицированный email; 10 = мобильный (с бесплатным email); 1 = enrichment компании; повторный enrichment той же записи в течение 90 дней — 0; «No result found — 0».
- **Платно:** на seat: Starter 2 000, Growth 5 000, Pro 15 000 кредитов/мес (help-центр). **Цены в USD — нет данных с официальной страницы**; сторонние (блог Prospeo/выдача): Starter $39, Growth $99, Pro $199 при иных объёмах (1 000/5 000/20 000) — противоречит help-центру; считать устаревшим.
- **Точность:** вендор заявляет «98% email accuracy» (из своих блогов; **источник заинтересован**); бенчмарк Anymail: coverage 45,2%, accuracy 92,5%, est. bounce ≈7,5%.
- **GDPR/ToS:** есть форма opt-out (help-центр «How Do I Opt Out My Data From Prospeo?» — удаление по work email/мобильному/URL соцпрофиля); вендор в блогах заявляет LI-основание, DPA «по запросу». Страница privacy-policy не отдала текст — **нет данных** по источникам и срокам хранения.

### 2.5. Findymail
- Источники: `findymail.com/pricing` (WebFetch), `findymail.com/gdpr` (WebFetch; «Last Updated: 06 Jan. 2023» — **устарело (до 2025)**).
- **Free:** «Sign up for a free account and get 10 credits to test Findymail. No credit card required.»
- **Платно:** Starter $99/мес (≈$83/мес при годовой оплате): 5 000 Finder-кредитов + 5 000 Verifier-кредитов; Enterprise — по запросу; «1 email = 1 credit», «1 phone = 10 credits». «You only pay for verified results. No charge if we can't find it.» Расчёт: ≈$0,0198 за найденный email. Datacare (обогащение CRM) от $500/мес.
- **Заявленное:** «guarantees a <5% bounce rate. If your bounce rate is higher, we refund your credits» — **источник заинтересован**. Бенчмарк Anymail: coverage 70,9%, accuracy 95,6%, est. bounce ≈4,4%.
- **GDPR (WebFetch):** «Our users have a legitimate interest in having easier access to already public data regarding other businesses and in reaching out to other businesses.»; «As a Findymail user, you are the controller of this data. It means you must set the purpose and legal basis for the processing.»; серверы Hetzner в Финляндии, «We store and process all our data exclusively in the EU.»; «We process only available online data for informational purposes»; опт-аут `app.findymail.com/optout`.

### 2.6. Anymail Finder
- Источники: `anymailfinder.com/pricing`, `/about`, `/email-finder-benchmark` (WebFetch).
- **Free:** «100 free credits to try Anymail Finder - no commitment.» Нужна карта: «only verified, not charged». (Одноразовый trial.)
- **Платно:** 400 кредитов $29/мес ($0,073); 1k $49; 2k $89; 5k $149; 10k $199; 25k $299; 50k $499; 100k $799. «No verified email found? You don't pay.» Для catch-all — «extra verification… rather than flagging them as risky and skipping them».
- **Заявленное (собственный бенчмарк, п. 2.9):** «86.4% verified coverage at 98.9% accuracy»; «97%+ delivery guarantee» с возвратом кредитов при баунсе — **источник заинтересован** (публикует и выигрывает собственный бенчмарк).
- **Как работает/ToS:** «Live checks replace stored databases», «Every address is checked live before it is returned» (WebFetch `/about`); «We are GDPR-compliant and provide a Data Processing Agreement for teams that need one»; «we never sell your lists or share your searches with other customers»; «You can delete any search from your account at any time.» Утверждение «lookup data deleted after 30 days» встретилось в выдаче, но на `/about` не подтверждено — не использовать. Компания: AMF Internet Services Limited, UK (reg. no. 10586048).

### 2.7. Dropcontact (EU/GDPR-ориентированный)
- Источник: `dropcontact.com/pricing` (WebFetch + Exa, 2026-10-04).
- **Free:** «50 free credits» при регистрации (trial).
- **Платно:** Starter €79/мес (500 кредитов/мес; 6 000/год при годовой оплате, −20%); Growth €120/мес (+ carryover, LinkedIn enrichment и др.); Enterprise «from 200,000 credits / month». Модель «pay on success»; ненайденный email возвращается в кредиты. Расчёт: Starter ≈ €0,158 за кредит — самый дорогой в этом списке. Формулировки страницы про «500 emails/month» и одинаковые 500 кредитов у Growth неоднозначны — детали тарифов проверять в кабинете.
- **Заявленное:** «more valid and accurate emails than 20+ providers combined», «99% validity of the data provided», «operates exclusively with algorithms and does not use any contact databases», «Audited against Europe's strictest data protection standards (CNIL)» — **источник заинтересован**; собственный бенчмарк «on 20 000 contact's emails». Бенчмарк Anymail: coverage 69,4%, accuracy 93,1%, est. bounce ≈6,9%.
- **Статус:** новостей о поглощении/переименовании не найдено (выдача: bootstrapped, основана 2016); версия V2 с waterfall; доступны API и MCP.

### 2.8. Clearbit / HubSpot Breeze Intelligence — что стало после покупки
- Хронология (HubSpot Community, пост сотрудника от 2025-02-13, Exa fetch): HubSpot приобрёл Clearbit в декабре 2023; Breeze Intelligence представлен на INBOUND 2024. «On April 30, 2025, the following will be sunset: Free Clearbit Platform; Clearbit Weekly Visitor Report; Clearbit TAM Calculator; **Clearbit Connect**; Clearbit Free Slack Integration. On December 1, 2025, the Clearbit Logo API will be sunset.»
- Ответ сотрудника HubSpot в том же треде (2025-02-15/24): «There is not an equivalent Chrome plugin to replace Clearbit Connect because HubSpot does not provide contact email addresses.»; «Clearbit Connect provided contact information, like contact emails - the HubSpot Google Chrome extension will not do that.»
- HubSpot KB «Get started with data enrichment» (WebFetch 2026-10-04): data enrichment **обогащает существующие** записи, а не ищет email: «For contacts, "HubSpot uses first name, last name, and work email address." For companies, "HubSpot uses company domain."»; «Data enrichment does not consume HubSpot Credits.»; доступно в Starter/Pro/Enterprise хабов.
- Кредиты HubSpot (по поисковой выдаче страниц HubSpot, не открывал напрямую): $0,010 за кредит ($10 за 1 000); включено в месяц: Starter 500, Professional 3 000, Enterprise 5 000. Сторонние обзоры: цена Breeze Intelligence $0,45 за кредит (в рамках HubSpot-подписки) — **источник заинтересован** (блоги конкурентов), не принимать как факт.
- **Вывод:** Clearbit/Breeze больше не email-finder и требует платной подписки HubSpot; для задачи «найти email основателя» непригоден.

### 2.9. Бенчмарк Anymail Finder (единственный найденный публичный сравнительный; **источник заинтересован**)
Публикатор: Anymail Finder, 2026-06-23 (`anymailfinder.com/email-finder-benchmark`). Выборка: 5 000 B2B decision-makers из LinkedIn Sales Navigator, США 2 570 / Великобритания 810 / Франция 810 / Германия 810, junior исключены; «ground truth» — консенсус 2 из 3 верификаторов (BounceBan, ZeroBounce, MillionVerifier), каждый catch-all-домен оценивал BounceBan; «Not a live send-test due to legal constraints».

| Инструмент | Coverage | False positives | Accuracy | Est. bounce |
|---|---|---|---|---|
| Anymail Finder | 86,4% | 0,9% | 98,9% | ≈1,1% |
| FullEnrich (waterfall) | 87,1% | 4,0% | 95,7% | ≈4,3% |
| GetProspect | 71,2% | 3,0% | 96,0% | ≈4,0% |
| Findymail | 70,9% | 3,3% | 95,6% | ≈4,4% |
| Dropcontact | 69,4% | 5,1% | 93,1% | ≈6,9% |
| Apollo | 68,1% | 6,5% | 91,3% | ≈8,7% |
| Hunter | 57,6% | 9,3% | 86,1% | ≈13,9% |
| Snov.io | 46,1% | 15,2% | 75,3% | ≈24,7% |
| Prospeo | 45,2% | 3,7% | 92,5% | ≈7,5% |

**Почему не переносится на нашу задачу:** (1) публикатор — один из участников и победитель; (2) «accuracy» = консенсус верификаторов, не реальные баунсы; (3) выборка — decision-makers из Sales Navigator в 4 странах, а не одиночные основатели свежих запусков на новых доменах; (4) для таких доменов независимых данных **нет данных**. Использовать только как порядок сравнения «кто кого лучше», не как абсолютные числа.

### 2.10. Прочие (не из списка задачи, быстрый срез цен; проверено 2026-10-04 через Exa)
- **Icypeas** (`icypeas.com/pricing`): «Sign Up Today and Get 50 Free Data Enrichment Credits»; Basic $19/мес — 1 000 кредитов (платишь только за найденные верифицированные; catch-all-верификация; кредиты накапливаются), Premium $39 (4 000), Advanced $89 (10 000), Hypergrowth $499 (100 000); email finder = 1 кредит за найденный email, верификация 0,1 кредита. Собственный «price comparator» вендора (Icypeas $4,99 за 1 000 найденных против Hunter/Prospeo/Dropcontact $7–16 и т.д.) — **источник заинтересован** и расходится с официальной ценой Dropcontact (€79/500).
- **Skrapp** (`skrapp.io/pricing`): Free — 50 кредитов (периодичность не указана), Professional от $29/мес (2K кредитов; при годовой оплате), Enterprise от $262/мес (50K); платит только за «Valid»/«Catch-all»; ориентирован на LinkedIn/Sales Navigator.
- **Voila Norbert** (`voilanorbert.com/pricing`): «Yes, I give you 50 free credits once you create an account.»; Valet $49/мес (1 000 лидов; $39 годовая) и выше; «I count only successful email founds».

### 2.11. Расчёт: покрывают ли бесплатные пулы объём 2–5 писем/день
Потребность: 2–5 писем × ~22 рабочих дня = 44–110 писем/мес. Операций поиска/проверки на 1 письмо — 2–3 [ОЦЕНКА: на одного основателя 1–2 кандидата адреса + проверка; не все находки валидны] → ≈100–330 операций/мес.
Ежемесячно обновляемые бесплатные пулы: Hunter 50 + Apollo 50 (официальный минимум) + Prospeo 100 (+Skrapp 50, если обновляется) ≈ 200–250 поисков/мес; верификация: Reoon до 600/мес + ZeroBounce 100/мес. Одноразовые: Snov 50, Findymail 10, Anymail Finder 100, Dropcontact 50, Icypeas 50, Voila Norbert 50, MillionVerifier 500 (бизнес-email), Bouncer 100.
Вывод: по объёму бесплатных пулов хватает; ограничивает не квота, а доля адресов, которые вообще находятся (п. 5).

---

## 3. Верификация email

Цены/лимиты — страницы вендоров (2026-10-04); точность — **источник заинтересован** у всех.

| Сервис | Бесплатно | Платно | Заявленная точность | Заметки |
|---|---|---|---|---|
| ZeroBounce (`zerobounce.net/pricing/`) | $0/мес: 100 validation credits, «refill every month» + 10 Email Finder credits + мини-инструменты | PAYG от $39 за 2 000 адресов (≈$19,5/1 000); подписка ZeroBounce ONE $99/мес (мин. 10 000, −20% годовая); Email Finder: 20 кредитов за успешный запрос; «unknown» бесплатно | «99.6% Validation Accuracy» | кредиты PAYG: условия истечения зависят от даты/акции |
| NeverBounce (`neverbounce.com/pricing`, Exa) | «Get started for free… verify your first email list» (размер на странице не указан; в сторонних обзорах — 1 000 кредитов, не подтверждено) | PAYG $8 за 1 000, кредиты истекают через 12 мес; Growth $49/мес | числа нет | принадлежит ZoomInfo (по выдаче: поглощение 2019, **устарело (до 2025)**); после поглощения вводилось 12-мес. истечение кредитов |
| Reoon (`emailverifier.reoon.com`, `reoon.com/email-verifier/`, Exa) | Free: 20 кредитов/день (до 600/мес) + 100 бонусных при регистрации, все функции включая API | Instant credits $11,90 за 10 000 (не истекают; крупные пакеты от $0,001 за адрес); Daily Credits от $9/мес за 500/день; «Unknown results are never charged» | «99% accuracy»; про spam-trap: «we do not provide any guarantee on detecting spamtraps» | Quick (<0,5 c) и Power (глубокий SMTP) режимы; bulk API до 50 000; загруженные списки удаляются через 15 дней |
| MillionVerifier (`millionverifier.com`, `help.millionverifier.com/.../free-trial-credits`) | Триал: 500 кредитов при регистрации с бизнес-email (до 3 аккаунтов на домен) ИЛИ интеграция ESP (до 10 000 кредитов = 5% контактов) ИЛИ 2 000 кредитов за $4,90 (разово); разовая проверка адреса бесплатно | $89 за 50 000 (≈$0,00178/шт); 1 000 000 — $449; кредиты не истекают | «99%+ Accuracy», «100% money-back guarantee for risky emails» | DPA «на каждом плане, включая бесплатный» |
| Bouncer (`usebouncer.com/pricing/`) | 100 бесплатных кредитов, без карты | PAYG: $8 за 1 000, $35 за 5 000, $60 за 10 000, $400 за 100 000; подписки $25–$250/мес; кредиты не истекают | числовой точности на странице нет | «EU» хостинг — заявление вендора |

**Бесплатная SMTP/MX-проверка самостоятельно.**
- Три уровня: синтаксис → DNS MX (бесплатно, HTTPS/DoH; п. 1.10 показал: у 24% доменов выборки MX нет — адреса вида `имя@домен` заведомо мёртвые) → SMTP `RCPT TO` без отправки письма.
- Открытый инструмент: Reacher / check-if-email-exists (`github.com/reacherhq/check-if-email-exists`; выдача): лицензия AGPL-3.0 (для проприетарного использования нужна коммерческая лицензия); чтобы SMTP-проверка работала при self-host, нужен открытый исходящий порт 25; по выдаче: Google Cloud блокирует исходящий 25 безусловно, AWS EC2 ограничивает по умолчанию, Azure блокирует на большинстве новых подписок, DigitalOcean/Oracle — ограничивают; для Yahoo/Hotmail прямые SMTP-проверки ненадёжны. Из этой песочницы TCP:25 к Google MX — timeout (п. 0). Сторонние верификаторы делают SMTP со своей инфраструктуры, поэтому порт 25 на нашей стороне им не нужен.
- Ограничения SMTP-проверки, видимые в моей выборке: Google Workspace (21% доменов) и M365 (2%) в целом проверяемы; Cloudflare Email Routing (19%) проверяем только без catch-all; «catch-all/accept-all» домены дают лишь «risky/unknown» (Reoon: catch-all «are risky because they might eventually bounce»; Anymail Finder заявляет углублённые проверки catch-all — **источник заинтересован**).

---

## 4. Правовая рамка (основание обработки контакта; сама отправка — ось 6)

Не юридическая консультация. Тексты закона — «сырые» (EUR-Lex/gesetze-im-internet/RIS через Exa); пересказы помечены.

### 4.1. Персональный email основателя = персональные данные
- ICO (fetch 2026-10-04): GDPR применяется, если «the email address you are using to communicate with the business identifies an individual» (пример john.smith@company.com); у физлица сохраняется право возразить против прямого маркетинга.
- CNIL (страница «La prospection commerciale par courrier électronique», дата страницы 10 июня 2026): персональные («nominatives», prenom.nom@) адреса подпадают под правила; «Les adresses génériques de type info[@]nomsociete.fr… qui concernent de personnes morales, ne sont pas soumises aux principes rappelés ci-dessus.»
- Вывод: «личный» адрес основателя — персональные данные; ролевой `hello@` юрлица — нет (в соло-проектах граница размыта).

### 4.2. Основание: legitimate interest (ст. 6(1)(f)) — и его пределы
- Recital 47: «The processing of personal data for direct marketing purposes may be regarded as carried out for a legitimate interest.»; «The existence of a legitimate interest would need careful assessment including whether a data subject can reasonably expect at the time and in the context of the collection of the personal data that processing for that purpose may take place.» (gdpr-info.eu).
- EDPB Guidelines 1/2024 (Version 1.0, принята 2024-10-08 для публичной консультации; финальная версия — нет данных): три кумулятивных условия (законный интерес; необходимость; баланс); «Article 6(1)(f) GDPR cannot be considered as a legal basis “by default”.»; «The fact that personal data have been manifestly made public does not automatically mean that they may be processed under Article 6(1)(f) GDPR» (сноска 52 со ссылками на CJEU) и Example 6 (фото, опубликованные самими людьми: разумных ожиданий нет). CJEU C-621/22 (2024-10-04): коммерческий интерес может быть «законным» (пересказ выдачи; EDPB прямо учёл решение).
- **Ключевая оговорка EDPB (§4.2, п. 114):** «under the ePrivacy Directive, the sending of unsolicited communications for purposes of direct marketing by email, SMS, MMS and other kinds of similar applications can only take place with the prior consent of the individual recipient… Therefore, in this context, the processing for direct marketing purposes may not be based on Article 6(1)(f) GDPR.» П. 117: ePrivacy — lex specialis; «controllers should also assess the scope of application of the national rules implementing the ePrivacy Directive at Member State level, which may occasionally impose consent requirements that go beyond those laid down in that Directive (e.g., with respect to direct marketing towards professionals).»
- Следовательно: LI годится как основание для **поиска/хранения/использования контакта**, но не отменяет требований ePrivacy к самой отправке письма (ось 6).

### 4.3. ePrivacy, ст. 13 (Directive 2002/58/EC, EUR-Lex, дословно)
- 13(1): «The use of automated calling systems… facsimile machines (fax) or electronic mail for the purposes of direct marketing may only be allowed in respect of subscribers who have given their prior consent.»
- 13(2): исключение для собственных клиентов (контакты получены при продаже продукта/услуги, схожие собственные продукты, право возразить).
- 13(5): «Paragraphs 1 and 3 shall apply to subscribers who are natural persons. Member States shall also ensure… that the legitimate interests of subscribers other than natural persons with regard to unsolicited communications are sufficiently protected.» → для юрлиц решают страны.

### 4.4. Различия по странам (кратко; детали отправки — ось 6)
- **Германия (строго).** UWG § 7 (gesetze-im-internet.de, актуальная редакция, изм. в силу с 14.05.2024), Abs. 2 Nr. 2: «Eine unzumutbare Belästigung ist stets anzunehmen… bei Werbung unter Verwendung einer automatischen Anrufmaschine, eines Faxgerätes oder elektronischer Post, ohne dass eine vorherige ausdrückliche Einwilligung des Adressaten vorliegt»; Abs. 3 — исключение для клиентов (4 условия). Нет деления на B2B/B2C («Marktteilnehmer»). BGH, Beschluss vom 10.12.2009 – I ZR 201/07 (**устарело (до 2025)**, норма та же): E-Mail-Werbung gegenüber Gewerbetreibenden — «nur durch ein ausdrückliches oder konkludentes Einverständnis gerechtfertigt», «Ein nur mutmaßliches Einverständnis genügt nicht», «Die Angabe einer E-Mail-Adresse auf der Website kann nicht als konkludente Einwilligung… gewertet werden. Dies gilt auch bei Homepages von Gewerbetreibenden». BGH, Beschluss vom 20.05.2009 – I ZR 218/07: уже единичное письмо может быть противоправным вмешательством. IHK Regensburg (выдача): запрет действует «unabhängig davon, ob… Verbraucher (B2C) oder sonstige Marktteilnehmer (B2B)»; под «электронной почтой» подпадают и сообщения в соцсетях (Xing, LinkedIn, WhatsApp, SMS). Для телефонной B2B-рекламы достаточно «mutmaßliche Einwilligung» — для email нет. Кто может иск подать — конкуренты/объединения (Abmahnung) [ОЦЕНКА: для 2–5 писем/день практический риск мал, но юридически он есть].
- **Австрия.** TKG 2021 § 174 Abs. 3 (RIS, консолидированная редакция, версия 12.02.2026 в выдаче): «Die Zusendung einer elektronischen Post – einschließlich SMS – ist ohne vorherige Einwilligung des Empfängers unzulässig, wenn die Zusendung zu Zwecken der Direktwerbung erfolgt.»; исключение для клиентов — Abs. 4 (4 условия); B2B-изъятия в тексте нет.
- **Франция (мягче).** CNIL (страница 2026-06-10): «No prior consent» для B2B-prospection при условии, что предложение связано с профессиональной функцией адресата; организация должна называть себя; человека нужно проинформировать и дать лёгкое право возражения; для «nominatives» адресов правила применяются, для «generic» юрлиц — нет. (Это пересказ WebFetch; формулировка по-французски в п. 4.1.)
- **Великобритания.** ICO (2026-10-04): PECR не требует согласия для email «corporate subscribers»; для «individual subscribers» (sole traders, certain partnerships) — только с согласием или «soft opt-in». Для соло-основателей без юрлица это ключевой нюанс. UK GDPR применяется к именным адресам.
- **Нидерланды.** Решения ACM/OPTA 2011–2014 (**устарело (до 2025)**; выдача по `acm.nl`): ст. 11.7 Telecommunicatiewet — «the prohibition… also applies to unsolicited messages between businesses (legal entities)»; согласие нужно доказывать отправителю. Вендорские блоги (Overloop и др.) утверждают обратное (B2B без opt-in) — расхождение, актуальную редакцию не проверял.
- **Италия, Испания** — «opt-in для B2B» только по вендорским блогам (Overloop/Dealfront/Prospeo/Leadhaste; **источник заинтересован**); первоисточников не нашёл — **нет данных**.

### 4.4a. Территориальное действие для отправителя из Украины
- EDPB Guidelines 3/2018: ключевой критерий ст. 3(2)(a) — «whether the offer of goods or services is directed at a person in the Union, or whether the conduct of the controller demonstrates its intention to offer goods or services to a data subject located in the Union»; Recital 23: «mere accessibility of a website in the Union, an email address, contact details, or use of a language generally used in the third country… is insufficient»; при случайном предложении — вне scope. Целевое холодное письмо конкретному основателю в ЕС (на английском, с предложением услуги) вероятнее считать «targeting» [ОЦЕНКА юридическая; не консультация].
- Украина: закон № 2297-VI «Про захист персональних даних» (текущая редакция от 14.06.2025 по rada.gov.ua; полный текст страницы не загрузился). Ст. 11 ч.1 п. 6 (по копии `protocol.ua`, редакция 2013 — **устарело (до 2025)**): основание «необхідність захисту законних інтересів володільця персональних даних або третьої особи… крім випадків, коли потреби захисту основоположних прав і свобод суб'єкта… переважають такі інтереси». Законопроект № 8153 (новый закон под GDPR/Конвенцию 108+): первое чтение 20.11.2024; по последним найденным материалам (октябрь 2025) второе чтение не состоялось; на 2026-10 — **нет данных**.
- Digital Omnibus ЕС (предложение ноября 2025 по GDPR/ePrivacy) — не проверял; статус неизвестен.

### 4.5. Обязанности при получении данных не от субъекта (раскрытие источника, opt-out)
- GDPR Art. 14 (gdpr-info.eu, дословно): 14(1) — идентичность и контакты контролёра, цели и **правовое основание**, категории данных; 14(2)(b) — «the legitimate interests pursued»; 14(2)(f) — «from which source the personal data originate, and if applicable, whether it came from publicly accessible sources»; 14(3) — «within a reasonable period… at the latest within one month» либо, если данные используются для коммуникации с субъектом, «at the latest at the time of the first communication»; 14(5)(b) — исключение, когда информирование «proves impossible or would involve a disproportionate effort».
- Art. 21(2)–(4): «Where personal data are processed for direct marketing purposes, the data subject shall have the right to object at any time…»; «the personal data shall no longer be processed for such purposes.»; право должно быть «explicitly brought to the attention of the data subject and… presented clearly and separately from any other information» не позднее первого контакта. Для direct marketing возражение абсолютное (EDPB 1/2024: оно «may not be trumped by showing that there are overriding legitimate grounds»).
- Art. 15 (доступ, включая источник): CNIL в деле KASPR указала, что ответ «собрано из общедоступных источников» недостаточен, если компания знает конкретные источники.
- EDPB Guidelines 03/2026 (веб-скрейпинг в контексте генеративного ИИ; v1.0 принята 2026-07-07 для консультации; про email-аутрич напрямую не говорят): при ссылке на 14(5)(b) контролёр «must always» опубликовать уведомление, включающее «a precise indication of the source(s) of the data» — как общий ориентир.
- Практический факт для 2–5 писем/день: Art. 14(3) допускает выполнить уведомление в первом письме.

### 4.6. Напряжённость «обогатители данных ↔ GDPR» (факты)
- **Вендоры заявляют LI и «GDPR-compliant»** (Hunter: LIA и DPIA «по запросу»; Snov: ст. 6(1)(f); Apollo: LI для Contributor Database; Findymail: «users have a legitimate interest…»; Dropcontact: алгоритмы без базы, «аудит CNIL»; Anymail: live-проверки, DPA) — всё **источник заинтересован**; внешних сертификаций/решений регулятора в их пользу не нашёл.
- **Но пользователь остаётся контролёром:** Hunter ToS — «you will remain an independent Controller»; Findymail — «you are the controller… you must set the purpose and legal basis»; Snov — «we can act as a joint controller together with our clients». Покупка данных у вендора не снимает ст. 14/21 с пользователя.
- **Регулятор:** CNIL, решение 2024-12-05 против KASPR (расширение Chrome с контактами из LinkedIn и «других сайтов, таких как каталоги доменных имён»; база ≈160 млн контактов): штраф **240 000 евро** по решению и по сайту CNIL (EDPB-новость от 2025-01-09 называла 200 000, повторная новость EDPB от 2025-01-23 — 240 000); нарушения: ст. 6 (сбор данных, видимость которых пользователи ограничили LinkedIn-ом, «exceeded what could reasonably be expected»), ст. 5(1)(e) (хранение 5 лет с продлением при каждом обновлении), ст. 12/14 (до 2022 года люди не информировались; потом — только на английском), ст. 15 (ответ «публичные источники»). Предписание: прекратить сбор, удалить данные, информировать на понятном языке, отвечать по источникам. **Закрыто 2026-03-04 (публикация 2026-03-06):** KASPR «chose to delete its database and cease all data collection on LinkedIn». Ссылки: `cnil.fr/en/data-scraping-kaspr-fined-eu240000`, `cnil.fr/en/closure-order-issued-against-kaspr`, EDPB-новость 2025-01-23.
- **Каналы удаления у вендоров:** Hunter `hunter.io/claim` (профили снимаются в течение 3 мес. после исчезновения с источника); Snov «Clear From List»; Findymail `app.findymail.com/optout`; Prospeo — форма opt-out; Apollo — Removal Page/privacy@apollo.io.

---

## 5. Расчёт: для какой доли свежих запусков находится валидный персональный email

Допущения: «свежий запуск» ≈ мои выборки Show HN (2026-09-22…10-04); PH-популяция шире (больше нетехнических/no-code основателей) — прямых данных нет. «Валидный» здесь = «адрес найден и правдоподобно принадлежит основателю»; реальную доставляемость (SMTP) проверить не мог.

**Измерено (n≈98 сайтов):** person-like email на сайте — 18% (12–27%); на собственном домене — 9%; role-only — 35%; любой email — 53%; ссылка на GitHub — 9%, на X — 21%, на LinkedIn — 12%; MX нет — 24%; Google Workspace — 21%; Cloudflare Email Routing — 19%; WHOIS реальный — 1%; HN about — 2,8%.

**Оценки (все — [ОЦЕНКА]; широкие интервалы):**

| Маршрут | dev-аудитория (как Show HN) | no-code/AI-билдер аудитория | Обоснование |
|---|---|---|---|
| Сайт: person-like email | 18% (измерено) | 10–15% | у нетехнических основателей чаще формы/поддомены платформ; прямых данных нет |
| Role-only на сайте (не персональный, но достижимый ящик) | +35% (измерено) | +25–35% | в соло-проектах `hello@` часто = основатель |
| GitHub (профиль/коммиты) сверх сайта | +5–10 п.п. | ≈0–2 п.п. | 9% сайтов ссылаются на GitHub × доля открытого email у активного разработчика 60–85% (2019: у ~86–88% коммиты без noreply; профиль — ≈22% по PyPI-исследованию 2026; приватность в 2025 всё ещё opt-in) минус пересечение с сайтом; живой замер невозможен |
| Угадывание шаблона + MX + бесплатный верификатор | +5–8 п.п. | +3–6 п.п. | 23% доменов на Google/M365 (проверяемы) × доля, где личный ящик основателя существует и шаблон угадан 40–55%, минус пересечения; 24% доменов без MX отсекаются, 19% на CF-форвардерах — только без catch-all |
| HN-профиль/био | +1–2 п.п. | ≈0 | 2,8% профилей HN содержат email; X-био — нет данных |
| **Итого бесплатно (персональный адрес)** | **≈30–40%** | **≈15–25%** | сумма с поправкой на пересечения |
| С платным finder (Hunter/Findymail/Anymail-класс) | ≈45–55% | ≈25–40% | платный сервис улучшает шаг «имя+домен → проверенный адрес» (catch-all, web-база), но не создаёт MX и не находит несуществующий ящик; потолок ограничен долей доменов с MX (≈76%) × вероятность наличия именного ящика (≈60–70%) ≈ 45–55% |

Дополнительно: при любом маршруте после бесплатной верификации ожидаемый hard-bounce ≈2–5% [ОЦЕНКА: вендорские бенчмарки дают 1–25% «до» проверки; verifier-проход срезает основную часть, остаток — catch-all и устаревшие адреса]. Заявленные вендорами «coverage 45–87%» (бенчмарк Anymail) относятся к другой популяции (Sales Navigator decision-makers) и не должны использоваться как оценка для indie-основателей.

---

## 6. Приложение: перечень проверенных URL (2026-10-04, если не указано)

Цены/лимиты сервисов: hunter.io/pricing; hunter.io/email-finder; hunter.io/data-platform; hunter.io/privacy-policy; hunter.io/terms-of-service; hunter.io/blog/cold-email-legal-regulations/; snov.io/pricing; snov.io/gdpr; apollo.io/pricing; apollo.io/email-finder; apollo.io/pricing/about-credits; apollo.io/privacy-policy; docs.apollo.io/docs/api-pricing (выдача); help.prospeo.io (credits, plans, legal); findymail.com/pricing; findymail.com/gdpr; anymailfinder.com/pricing; anymailfinder.com/about; anymailfinder.com/email-finder-benchmark; dropcontact.com/pricing; icypeas.com/pricing; skrapp.io/pricing; voilanorbert.com/pricing; zerobounce.net/pricing/; neverbounce.com/pricing; emailverifier.reoon.com; reoon.com/email-verifier/; millionverifier.com; help.millionverifier.com/millionverifier/free-trial-credits; usebouncer.com/pricing/.
Clearbit/HubSpot: community.hubspot.com/t/the-future-of-clearbit-s-free-tools/125894; knowledge.hubspot.com/ai-tools/get-started-using-breeze-intelligence.
Площадки: producthunt.com/legal; api.producthunt.com/v2/docs; producthunt.com/feed; producthunt.com/@rrhoover; docs.github.com (AUP, ToS, commit email, email-addresses-reference, blocking pushes); github.com/orgs/community/discussions/170510; arxiv.org/abs/2601.14034; arxiv.org/abs/1908.05354; docs.npmjs.com/policies/open-source-terms; registry.npmjs.org; techcrunch.com/2023/09/08/x-updates-its-terms-to-ban-crawling-and-scraping; linkedin.com/legal/user-agreement и linkedin.com/help (выдача); icann.org (registration-data-policy; RDAP/WHOIS sunset); developers.cloudflare.com/email-routing/setup/email-routing-addresses/.
Право: gdpr-info.eu/art-14-gdpr, art-21-gdpr, recitals/no-47; edpb.europa.eu (Guidelines 1/2024 PDF; Guidelines 03/2026 PDF; Guidelines 3/2018; KASPR news); cnil.fr (KASPR fine; closure; B2B e-mail prospecting page); ico.org.uk (B2B marketing); gesetze-im-internet.de/uwg_2004/__7.html; medien-internet-und-recht.de (BGH I ZR 201/07, I ZR 218/07); ihk.de/regensburg (belaestigende-werbung); ris.bka.gv.at (TKG 2021 § 174); eur-lex.europa.eu/eli/dir/2002/58/oj/eng; acm.nl (решения 2011–2014); zakon.rada.gov.ua/laws/show/2297-17; protocol.ua (ст. 11); ombudsman/ligazakon/yur-gazeta (законопроект 8153, выдача).
Данные мини-замера: hn.algolia.com/api/v1/search_by_date; hacker-news.firebaseio.com/v0/user/*; HTTP GET публичных страниц 98 сайтов; cloudflare-dns.com и dns.google (DoH); rdap.org и RDAP регистраторов.
