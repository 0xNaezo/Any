# Топ-15 после синтеза фазы 1

Дата: 2026-11-02. Вход: `candidates.csv` семи потоков (S1, S2a, S2b, S4, S5, S6, S7 — 109 кандидатов). S3 ещё не запускался. `findings.md` потоки не записали (харнесс запретил субагентам .md-отчёты), поэтому выводы потоков взяты из их итогов оркестратору, а для S2a — из черновика findings в транскрипте агента.

- Мастер-таблица: [`candidates_master.csv`](candidates_master.csv) — 81 строка после дедупа (67 в рейтинге, 14 отсеяны гейтами).
- Полный рейтинг: [`ranking.md`](ranking.md).
- Все 8 оценок выставлены заново одним проходом по шкалам `research/brief/scoring.md`. Score = база + бонус за потоки (+3 за каждый доп. поток, максимум +6).

## Таблица

| # | id | Кандидат | Score | Механизм | Conf | Потоки |
|---|---|---|---|---|---|---|
| 1 | C-012 | Usage-метр AI coding-агентов (VS Code + Open VSX + CLI) | 70.5 | store-search;seo | M | S2a;S4 |
| 2 | C-021 | Газ-трекер: купить Ethereum Gas Price Extension (40k) + мультичейн | 69.2 | bought-audience;store-search | L | S2a;S7 |
| 3 | C-048 | [seasonal-dec] Hyperliquid Year Card 2026 → Verified PnL | 67.5 | ugc-sharing;seo;embed-backlinks | M | S6 |
| 4 | C-001 | Групповой TG-бот проверки токенов (+ /roast) | 66.8 | community;ugc-sharing | M | S1;S6 |
| 5 | C-005 | Airdrop eligibility checker: страница на TGE + TMA + ChatGPT | 66.8 | seo;ugc-sharing;store-search;ai-answers | M | S1;S2b |
| 6 | C-017 | Пак n8n-шаблонов «крипто-мониторинг → Telegram» | 65.5 | store-browse;seo | M | S2a;S4 |
| 7 | C-003 | Crypto Safety Check: чекер как MCP → плагин ChatGPT | 65.5 | store-search;store-browse;ai-answers | L | S1;S2b |
| 8 | C-014 | Paper trading overlay (Hyperliquid perps + Axiom), Chrome/Firefox | 65.0 | store-search;ugc-sharing | M | S2a |
| 9 | C-049 | [seasonal-dec] «Fed the Bots 2026» (комиссии Solana-терминалам) | 65.0 | ugc-sharing;seo | M | S6 |
| 10 | C-050 | [seasonal-dec] Бот «Итоги года» для Telegram-каналов | 65.0 | ugc-sharing;community | M | S6 |
| 11 | C-022 | Selector/XPath: купить SelectorGadget (100k) или преемник | 64.2 | bought-audience;store-search;community | L | S2a;S7 |
| 12 | C-016 | Telegram Gifts: оценка портфеля и floor-алерты | 63.8 | ugc-sharing;store-browse;community | M | S2a |
| 13 | C-024 | Cookie editor / экспорт (Netscape, Playwright, curl) | 62.5 | store-search | M | S2a |
| 14 | C-043 | DeFi Frontend Security Leaderboard (A–F, NS/CAA, бейджи) | 62.5 | citations;embed-backlinks;ai-answers;seo | M | S5 |
| 15 | C-004 | Seeker Safety Scanner — Solana dApp Store | 62.5 | store-browse;store-search;community | L | S2b |

**Порядок проверки в S3.** По правилу `scoring.md` первыми идут кандидаты с confidence L: C-021, C-003, C-022, C-004. Сезонные C-048, C-049 и C-050 S3 не ждут — они уходят в fast-track (см. [`fast-track.md`](fast-track.md)). S3 нужен им только для быстрой проверки декабрьской сезонности.

**Покупки.** C-021 и C-022 (а также C-023 на 16-м месте) — это решение о покупке off-market актива, а не MVP-сборка. Цена не выставлена, владельцам никто не писал. Score держится на том, что аудиторию не построить: новички в старых категориях CWS растут на 12–650 users/мес. Перед любым шагом нужно решение команды о контакте.

## Механизмы трафика: перекос в сторы

8 из 15 кандидатов держатся на витрине или поиске стора:
- CWS и VS Code: C-012, C-021, C-014, C-022, C-024;
- n8n: C-017;
- ChatGPT: C-003;
- Solana dApp Store: C-004.

Ещё 5 — UGC-шеринг: C-048, C-049, C-050, C-016, C-001; из них три сезонные. Только C-043 держится на цитатах, а C-005 — частично на SEO. Чистого SEO в топ-15 нет: на новом домене оно даёт 10k за 4–6 мес, а крипто-SEO забито AI-клонами (S1, S5).

**Резерв с другими механизмами** — добавить к топ-15, чтобы тесты проверили не только сторы:

| id | Кандидат | Score | Механизм | Почему в резерве |
|---|---|---|---|---|
| C-059 | Канал on-chain алертов для недообслуженной сети | 61.2 | ugc-sharing;citations;community | Почти нулевая поддержка; проверяет пересылки и цитаты в Telegram |
| C-020 | Каталог крипто-агентских тулз (x402, MCP, agent wallets) | 58.8 | community;seo;ugc-sharing | Каталоги на волне примитива дают 10k быстрее всех типов (медиана 0.1 мес, S1); x402 уже не свеж, но механика переиспользуется на следующем примитиве |
| C-009 | LLM API Radar: «is X down» по моделям + цены + MCP Claude | 58.5 | seo;ai-answers;citations;store-browse | Всплыл в трёх потоках; единственный сильный SEO/AI-answers-кандидат; тестируется на домене чекера |

---

## Карточки кандидатов

### 1. C-012 — Usage-метр AI coding-агентов · 70.5 · store-search;seo
**Почему в топе.** Сильнейшая сходимость спроса во всём ресерче:
- S2a — сторы: Claude Code Usage 75.5k установок (VSM) + 60.9k (Open VSX), fact; мульти-агентных решений меньше 600 установок;
- S4 — боль: 18 сигналов, 100% явный WTP, ~255k просмотров тредов про лимиты Cursor и Codex.

Одна сборка уходит в два стора, а новички в новой категории набирают 1.8–4.9k users/мес.

**Что проверить в S3:**
- объёмы и тренд: «claude code usage», «claude code usage limit», «codex usage limit», «codex rate limit», «cursor usage», «gemini cli usage», «copilot premium requests»;
- гипотеза: запрос «одним видом по нескольким агентам» существует — ищут вместе «claude code codex usage», а не только по одному инструменту;
- позиции в поиске VSM и Open VSX по «usage», «limit», «rate limit»: сколько exact-match новичков в топ-10;
- всплески после изменений цен и лимитов (Cursor 2025-07, Codex 2026-08).

**Риски:**
- вендоры показывают лимиты сами (Claude Code /usage);
- лидер Claude Code Usage может добавить Codex и Gemini;
- неофициальные usage-эндпоинты ломаются и могут нарушать ToS;
- монетизация слабая (crypto_monet 2): это двигатель трафика для мониторинга AI-API, а не деньги.

### 2. C-021 — Газ-трекер: купить Ethereum Gas Price Extension (40k) · 69.2 · bought-audience;store-search
**Почему в топе.** Пример сходимости S2a и S7.
- S2a: новички в старой категории газ-трекеров набирают 240–380 users/мес, то есть 40k не построить.
- S7: заброшенная утилита (обновлялась 2025-03) с 40k users и 4.75★ — аудитория, которую можно только купить.

Пользователи ETH — это пользователи чекера (synergy 5). Бейдж со ссылкой на чекер — готовый канал перелива.

**Что проверить в S3:**
- объёмы «eth gas tracker», «gas price extension», «gwei tracker», «base gas fee»;
- гипотеза: спрос на газ-трекеры в 2026 падает вслед за комиссиями — нужен тренд за 24 мес;
- позиция актива в поиске CWS по «gas».

**Риски:**
- соотношение users/ratings 1000:1 — реальных активных может быть в разы меньше;
- цена не выставлена (оценка $10k–48k, вероятно выше бюджета), владелец может не продавать;
- нужен контакт с владельцем — это решение команды, а не агента.

### 3. C-048 — [seasonal-dec] Hyperliquid Year Card 2026 → Verified PnL · 67.5 · ugc-sharing;seo;embed-backlinks
**Почему в топе.**
- У HL 2.91M адресов (fact) и нет официального годового итога.
- Карточка считается в браузере по публичному адресу, без коннекта кошелька.
- После сезона страница остаётся как evergreen «Hyperliquid PnL card» с проверкой по чейну.

Fast-track-кандидат — план в [`fast-track.md`](fast-track.md).

**Что проверить в S3** (быстро, не блокирует запуск):
- «hyperliquid pnl card», «hyperliquid pnl calculator», «hyperliquid wrapped», «hyperliquid year in review», «hyperliquid leaderboard»;
- гипотеза S6: декабрьский пик «wrapped»-запросов в 5–20 раз выше базового уровня.

**Риски:**
- userFillsByTime отдаёт только 10k последних сделок, и год у активных трейдеров обрежется;
- 58% трейдеров в минусе — share rate может упасть ниже 3%;
- HL может выпустить официальный recap.

### 4. C-001 — Групповой TG-бот проверки токенов (+ /roast) · 66.8 · community;ugc-sharing
**Почему в топе.** Групповой бот — самая сильная встроенная петля в нашей зоне: каждую карточку видит весь чат. Он всплыл в двух потоках:
- S1: Rick 58.5k MAU, Phanes 57.4k, Safeguard 202k — всё fact;
- S6: /roast как групповая механика.

Платят команды токенов, в крипте (crypto_monet 5). Это и есть чекер (synergy 5).

**Что проверить в S3:**
- «<new chain> token scanner», «robinhood chain honeypot check» — есть ли окно 2–6 недель после запуска сети;
- календарь ближайших мейннетов (Q4 2026 – Q1 2027) — выбрать сеть для входа;
- TG-поиск и чаты на RU/TR/FA: «проверка токена», «token kontrol» — гипотеза языковой дыры;
- гипотеза: на новой сети лидеры добавляют security-проверки позже, чем через 2 недели.

**Риски:**
- рынок плотный (Proficy в 105K групп): лидеры подключают сеть за дни;
- /roast выгорает за 2 недели;
- нужна постоянная поддержка индексаторов (maintenance 2).

### 5. C-005 — Airdrop eligibility checker · 66.8 · seo;ugc-sharing;store-search;ai-answers
**Почему в топе.**
- Событийный спрос: каждый TGE даёт всплеск tool-intent.
- Drops: 80k users, 421 airdrop (claim).
- В каталоге ChatGPT airdrop-плагинов 0 (fact, S2b), и тот же движок даёт второй канал.

S5 предлагает кормить его данными Airdrop Outcomes Index (C-006, score 55.0); S6 — сезонной карточкой Airdrop Haul (C-056).

**Что проверить в S3:**
- «<project> airdrop checker» по 3–5 недавним TGE: размер всплеска и скорость затухания;
- «airdrop checker», «am I eligible for airdrop», «<project> airdrop eligibility»;
- гипотеза: один крупный TGE даёт ≥10k запросов за неделю TGE.

**Риски:**
- Drops покрывает каждый TGE раньше и держит API;
- тема ассоциируется с дрейнерами (доверие, бан-листы);
- под каждый airdrop нужен свой парсер (maintenance 2);
- OpenAI может отклонить плагин как speculative crypto.

### 6. C-017 — Пак n8n-шаблонов «крипто-мониторинг → Telegram» · 65.5 · store-browse;seo
**Почему в топе.**
- Библиотека n8n индексируется поисковиками и встроена в редактор.
- Крипто-запросы в ней пусты: rpc — 0 шаблонов, whale — 2, dexscreener — 2 (fact).
- Лучшие крипто-шаблоны набирают 11.9–13.1k просмотров.

Аудитория — покупатели автоматизации (synergy 5). Всплыл в S2a и S4.

**Что проверить в S3:**
- «n8n crypto template», «n8n telegram crypto alert», «n8n wallet monitor», «n8n whale alert», «n8n solana»;
- гипотеза: крипто-шаблон набирает ≥1k просмотров за первый месяц.

**Риски:**
- просмотры на n8n.io не конвертируются в наши визиты и лиды (time_to_10k 2);
- модерация n8n может отклонять крипто-шаблоны: по форумному отзыву, 2 из 3 шаблонов отклонили;
- правила purchaseUrl не найдены.

### 7. C-003 — Crypto Safety Check: чекер как MCP → плагин ChatGPT · 65.5 · store-search;store-browse;ai-answers
**Почему в топе.**
- В ChatGPT нет потребительского multichain-сканера: около 7 слабых листингов, TON — 0 (fact, S2b).
- Окно 1–3 мес: 2026-12-11 Custom GPTs переезжают в плагины и забьют каталог.
- Тот же MCP-сервер дёшево публикуется в реестрах — S1 и S2b, бонус +3.

**Что проверить в S3:**
- «is this token a scam», «token scanner», «rug checker», «honeypot checker» против «chatgpt crypto plugin» — гипотеза S2b: интент про скам сильнее;
- 20 промтов в ChatGPT: подсказывает ли он уже существующие плагины на «is this token safe».

**Риски:**
- подсказки в чате достаются брендам — для инди их подтверждает один кейс;
- ревью может отклонить как speculative crypto;
- внутри плагина денег нет (crypto_monet 2);
- страна KYC для individual verification неизвестна.

### 8. C-014 — Paper trading overlay (Hyperliquid perps + Axiom) · 65.0 · store-search;ugc-sharing
**Почему в топе.**
- Сильнейший крипто-сигнал в сторах: DryFlip 40k за 9 мес, MockApe 20k (fact).
- По «hyperliquid» paper-trading расширений в CWS нет, в Firefox один игрок.
- Аудитория платит в SOL.

**Что проверить в S3:**
- «memecoin paper trading», «hyperliquid paper trading», «axiom paper trading», «paper trading crypto extension»;
- гипотеза: спрос на paper-трейдинг для perps существует отдельно от мемкоинов.

**Риски:**
- ошибка выжившего: медиана категории — 75 users;
- DOM терминалов ломается при редизайнах;
- терминалы могут встроить нативный paper-режим.

### 9. C-049 — [seasonal-dec] «Fed the Bots 2026» · 65.0 · ugc-sharing;seo
**Почему в топе.**
- Шок-цифра «я отдал ботам $12k» — сильный мотив шера.
- Комиссии Axiom $493K за сутки (fact, DefiLlama).
- У fee-трекеров (Donooor) нет годовой карточки.

Резерв fast-track.

**Что проверить в S3:** «axiom fees», «how much fees did i pay axiom», «gmgn fees», «solana wallet pnl», «solana wrapped».

**Риски:**
- неверный маппинг fee-кошельков даст тред «цифры врут»;
- Axiom или GMGN могут выпустить официальный recap.

### 10. C-050 — [seasonal-dec] Бот «Итоги года» для Telegram-каналов · 65.0 · ugc-sharing;community
**Почему в топе.**
- Единственная петля, где шер автоматически видит вся аудитория: админ публикует пост в канал.
- Лучший time_to_10k среди сезонных (4): аналог @yearreviewbot — 14.6K MAU при слабом оффере.
- RU-аудитория — наше языковое преимущество.

**Что проверить в S3:** «итоги года телеграм канал», «статистика телеграм канала за год», «бот итоги года канала» (RU-поиск, декабрьский пик).

**Риски:**
- Tribute (@NYSummaryBot) может запуститься раньше и громче;
- админы обрезают кредит бота;
- t.me/s отдаёт мало истории у больших каналов и режет частоту запросов.

### 11. C-022 — Selector/XPath: купить SelectorGadget (100k) или преемник · 64.2 · bought-audience;store-search;community
**Почему в топе.** Аудитория — ровно покупатели наших парсеров (synergy 5). Лидеры заброшены: SelectorGadget не обновлялся с 2022-08, остальные ≤3.4★.

**Что проверить в S3:** «selectorgadget», «selectorgadget alternative», «css selector extension», «xpath finder», «xpath helper»; гипотеза — evergreen dev-спрос без сезонности.

**Риски:**
- оценка $25k–120k вне бюджета (constraints 1);
- open-source проект — владелец бренда неясен;
- свой преемник растёт на 300–400 users/мес.

### 12. C-016 — Telegram Gifts: оценка портфеля · 63.8 · ugc-sharing;store-browse;community
**Почему в топе.**
- Рынки подарков ≈930k MAU, а аналитика только ≈120k (NFT GIFT Calculator 82.7k, fact).
- TON-нативные деньги (crypto_monet 5).
- Карточки «мой профиль стоит N TON» расходятся по чатам.

**Что проверить в S3:** «telegram gift price», «telegram gifts portfolio value», «telegram gift floor», TG-поиск «gift calculator»; гипотеза — хайп подарков не затухает (тренд за 6 мес).

**Риски:**
- цикличность хайпа;
- неофициальные API рынков (maintenance 2);
- соседство с гемблинг-«кейсами»;
- KYC Fragment при выводе.

### 13. C-024 — Cookie editor / экспорт · 62.5 · store-search
**Почему в топе.**
- Массовый поиск в CWS: Cookie-Editor 2M users, не обновлялся с 2024-02.
- Скрейпер-аудитория (synergy 4).

**Что проверить в S3:** «cookie editor», «export cookies netscape», «cookies.txt», «yt-dlp cookies», «playwright storage state»; позиции exact-match названий в CWS.

**Риски:**
- перехватчики уже растут на 6–17k/мес;
- строгое ревью разрешений cookies;
- монетизации нет (crypto_monet 1).

### 14. C-043 — DeFi Frontend Security Leaderboard · 62.5 · citations;embed-backlinks;ai-answers;seo
**Почему в топе.**
- Единственный data-актив в топе.
- Пассивный скан (maintenance 5).
- Живого независимого лидерборда нет (fact, S5).
- Платят протоколы, в крипте.
- Повод для цитаты — каждый DNS-hijack.

**Что проверить в S3:**
- «defi dns hijack», «dnssec defi», «is <protocol> safe», «frontend hijack crypto»;
- гипотеза: запросы всплескивают после инцидентов (Predict.fun, Bloom — 2026-10).

**Риски:**
- BlockSec или SEAL выпустят свой публичный лидерборд;
- узкая аудитория, трафик эпизодический.

### 15. C-004 — Seeker Safety Scanner · 62.5 · store-browse;store-search;community
**Почему в топе.**
- Единственный стор с нативной крипто-монетизацией без комиссии.
- Сканера токенов там не найдено.
- Seeker Season засчитывает exploration в награды.
- Сборка дешёвая (6 дней): PWA поверх чекера.

**Что проверить в S3:**
- «seeker dapp store apps», «solana seeker security», «seeker season rewards», «solana token scanner mobile»;
- категорию Security и топ стора — только с устройства (нужно команде).

**Риски:**
- потолок аудитории ~9k DAU на весь стор (demand 2);
- установки ради наград не удерживаются;
- Solana Mobile может встроить проверки в Seed Vault;
- KYC издателя.

---

## Что изменил синтез по сравнению с потоками

- **Дедуп.** 109 кандидатов → 81 строка. Слияния с бонусом за несколько потоков:
  - C-009 LLM API Radar — S1 + S2b + S4, +6;
  - C-010 статус крипто-инфры и Chain Halt Log — S1 + S2b + S4 + S5, +6;
  - C-032 монитор изменений страниц — S2a + S2b + S4, +6;
  - +3 у C-001, C-003, C-005, C-007, C-008, C-011, C-012, C-017, C-019, C-021, C-022, C-023, C-039, C-061.

  Карта слияний — в колонке `score_notes` («Источники: …»).
- **Строже, чем в потоках:**
  - SEO на новом домене — `time_to_10k` = 2 (C-002: 63.8 → 53.8);
  - каталоги на уже не свежем примитиве — `competition` = 2 (C-020: 66.2 → 58.8), потому что S5 и S2b нашли 8 x402-дашбордов и Bazaar;
  - категории CWS, где новички не растут, — `traffic` = 3 (C-025);
  - аудитория Seeker — `demand` = 2.
- **Гейт.** C-068 (Cardano token builder, S7-009) переведён в G4: минт токенов за пользователя — не read-only, плюс риск скам-токенов.
- **На решение команды:**
  - C-052 Polymarket — рядом с исключённым гемблингом, оставлен pass с `constraints` = 2;
  - покупки C-021, C-022, C-023 — нужен контакт с владельцами.
