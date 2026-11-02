# S4 — Боль комьюнити: итоги

Дата сбора: 2026-11-02. Сигналов в `raw.csv`: **166**, кластеров: **26**, кандидатов: **18** (15 прошли гейты, 3 отсеяны).

Сигналы по годам: 2026 — 48, 2025 — 69, 2024 — 49. До 2024 года сигналов в выборке нет.

Сигналы по источникам: Stack Exchange — 42, HN — 36, Discourse (форумы Cursor, OpenAI, n8n, Solana) — 28, GitHub issues — 20, Lemmy и Fediverse — 19, новости и вендоры — 8, Stacker News — 6, bitcointalk — 2, Habr Q&A — 2, X через зеркала и дайджесты — 3.

**Главное ограничение: Reddit недоступен полностью** (см. «Что не удалось проверить»). Поэтому выборка смещена к dev-аудитории (SE, HN, GitHub, форумы вендоров), а потребительский крипто-голос недопредставлен.

## TL;DR

1. **Самая громкая и платящая боль — лимиты и цены AI-кодинга** (Cursor, Claude Code, Codex).
   - 18 сигналов от 17 авторов, все 2025–26, у всех explicit WTP: это платящие подписчики.
   - Около 255k просмотров тредов: Cursor pricing megathread — 36k просмотров и 1006 лайков, legacy plan / Max mode — 28k и 1339, Codex limits — 16.5k.
   - Люди сами строят трекеры: ccusage, cursor-stats, codexometer, cursortokens. Спрос подтверждён, но OSS-конкуренция высокая.
2. **Падения LLM-провайдеров — массовая боль с поисковым интентом.** Ask HN «OpenAI/Claude/Grok simultaneously down» набрал 404 пойнта и 705 комментариев (2026-09). Это ложится прямо на чекер (статусы и латентность AI-API).
3. **2024–26 — волна закрытий с осиротевшими аудиториями:**
   - Zapper — 2M MAU на пике (claim);
   - Pocket, Omnivore, Freshping, Flowise;
   - Strava API — 241k разработчиков (claim);
   - X API free, Reddit RSS/API, GummySearch, Blast API, Step Finance, DappRadar, Glitch, Postman free.

   Каждый раз вендоры за 1–4 недели занимают SEO-страницы «<tool> alternative». Окно короткое.
4. **Etherscan V2 и урезанный free-тариф** (Base, BNB, OP, Avalanche, Gnosis — «Free API access is not supported for this chain») ломают dev-тулы и MCP-агентов. Это 7 свежих GitHub-сигналов 2025–26, а workaround один и тот же: fallback на Blockscout.
5. **Алерты по кошелькам — самый частый крипто-запрос** (13 сигналов). Рынок насыщен: Cielo, GMGN, cryptocurrencyalerting, свежие мейкеры с free-тарифом на 3 адреса. Пустых ниш мало, остаются только дифференциаторы: TON, BTC-xpub, приватность, формат дайджеста.
6. **Формат «дайджест вместо дашборда»** повторяется в разных доменах: утренний read-only отчёт по кошелькам «между DeBank и Nansen», n8n-workflow с ночным Telegram-сообщением. Нишу Zapper-сирот в этом формате никто явно не занял.
7. **EIP-7702 — новый класс боли безопасности** (2026). Malicious delegation, sweeper-контракты, «как восстановить EOA» (834 просмотра на SE). Взлом Binance 2026-10-29 предварительно связывают с 7702. Revoke.cash покрывает базу, но мульти-адреса и мониторинга нет.
8. **Доступ к социальным данным (X, Reddit) — крупнейший engagement** (Reddit kills RSS — 932 апвоута и 320 комментариев). Для нас это G4: легального read-only пути нет.
9. **Явный WTP в сигналах редок вне AI-кодинга:** 35 из 166 сигналов, из них 18 — AI-кодинг. В крипто-кластерах WTP в основном implicit, а деньги видны по ценам аналогов (Cielo Pro $59, Whale $199).

## Кластеры (сортировка: ранг = взвешенная частота × WTP)

Как считали:
- Ранг = Σ весов свежести × (1 + 2·доля explicit + доля implicit). Вес свежести: 2026 — 1.5, 2025 — 1.0, 2024 — 0.6.
- Engagement — сумма апвоутов (лайков, пойнтов) и комментариев. Шкалы источников разные, поэтому сравнивать можно только внутри одного источника.
- Число уникальных авторов для GitHub, новостей и Habr приближено числом тредов.

| # | Кластер | Сигн. | Авт. | Период | Апв.;комм. | Просм. (Discourse) | Explicit WTP | Implicit | 2025–26 | Ранг | Существующие решения и их дыры |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ai-coding-usage-limits | 18 | 17 | 2025-02…2026-10 | 5748;3027 | ~255k | 18 (100%) | 0 | 18 | 64.5 | Нативные /usage-страницы непрозрачны (Cursor сменил $ на токены в 2026-07); ccusage, cursor-stats и codexometer — по одному инструменту, без прогноза отсечки |
| 2 | onchain-event-webhooks-dev | 11 | 11 | 2024-05…2025-07 | 15;12 | 12k (SE) | 3 | 8 | 5 | 19.5 | Helius, QuickNode Streams, Bitquery: дорогие лимиты, onLogs теряет транзакции, масштаб в миллионы адресов |
| 3 | wallet-activity-alerts | 13 | 13 | 2024-04…2026-10 | 6;16 (+415 sats) | 3k | 2 | 3 | 8 | 18.5 | Cielo, GMGN, cryptocurrencyalerting: лимит 3–10 адресов, BTC-xpub и приватность не покрыты, нет TON |
| 4 | automation-platform-pricing | 9 | 9 | 2024-02…2026-08 | 261;168 | 6.8k | 3 | 3 | 7 | 18.4 | n8n режет лицензии (6 проектов в Business), Flowise закрывается, Zapier дорог |
| 5 | uptime-cron-ssl-monitoring | 12 | 11 | 2024-01…2026-07 | 107;60 | — | 2 | 2 | 9 | 17.7 | Freshping закрыт, у UptimeRobot менялся free; хотят один лёгкий бандл (uptime, cron, SSL, visual diff) |
| 6 | web-change-price-monitoring | 11 | 11 | 2024-01…2026-08 | 111;56 | 5.6k | 1 | 6 | 5 | 17.4 | Visualping дорог, changedetection не строит график цены; итог — таблицы |
| 7 | llm-pricing-compare | 9 | 9 | 2024-03…2026-04 | 494;255 | 26k | 0 | 6 | 7 | 16.2 | Цены меняются быстрее, чем обновляются таблицы (LiteLLM price map — 39 мёртвых записей) |
| 8 | social-data-access | 12 | 12 | 2024-01…2026-09 | 2379;1273 | — | 2 | 1 | 6 | 15.0 | Nitter мёртв, Reddit режет RSS и API, GummySearch закрыт (G4 для нас) |
| 9 | explorer-api-free-access | 7 | 7 | 2025-04…2026-10 | 7;56 | — | 1 | 3 | 7 | 14.6 | Etherscan V2: платно для части сетей; Blockscout разрознен |
| 10 | multiwallet-portfolio-pnl | 8 | 8 | 2024-04…2026-09 | 11;5 | 1.3k | 0 | 5 | 5 | 14.3 | Закрылись Zapper и Step; DeBank и Zerion — дашборды, а не дайджест; нет экспорта |
| 11 | push-notify-webhook-utils | 6 | 6 | 2025-01…2026-10 | 129;94 | — | 1 | 0 | 6 | 9.3 | ntfy, Gotify, Pushover: доставка критичных алертов на Android ненадёжна |
| 12 | wallet-security-approvals-delegations | 6 | 6 | 2024-01…2026-02 | 3;20 | 1k (SE) | 0 | 1 | 3 | 7.4 | Revoke.cash: по одному кошельку, 7702-recovery не решается |
| 13 | token-holders-onchain-data-api | 5 | 5 | 2024-06…2026-09 | 20;16 | 8k | 0 | 4 | 1 | 7.0 | Birdeye, Shyft, Helius: холдеры за пейволлом |
| 14 | solana-network-health-monitoring | 4 | 4 | 2024-02…2026-01 | 40;11 | 2.6k | 0 | 3 | 2 | 6.5 | status.solana.com запаздывает; нет мониторинга программ в проде |
| 15 | llm-api-ops | 4 | 4 | 2024-04…2026-09 | 409;710 | — | 0 | 2 | 2 | 6.3 | Официальные status pages молчат при сбоях (HN 49550706) |
| 16 | price-data-api-limits | 2 | 2 | 2025-02…2026-11 | — | — | 1 | 1 | 2 | 6.2 | Jupiter: keyless 0.5 rps, free 1 rps только с ключом |
| 17 | defi-position-alerts | 2 | 2 | 2026-05…2026-10 | 0;3 | — | 0 | 2 | 2 | 6.0 | Alertio (free 3); нужен щедрый free-тариф |
| 18 | read-later-bookmarks | 5 | 5 | 2024-11…2025-06 | 279;75 | — | 1 | 0 | 3 | 5.9 | Закрылись Pocket и Omnivore (вне ниши, но показательный паттерн сирот) |
| 19 | dev-tool-free-tier-loss | 3 | 3 | 2025-04…2026-06 | 266;82 | — | 0 | 2 | 3 | 5.8 | Strava API платный, Glitch закрыт, Postman free — один пользователь |
| 20 | hardware-price-tracking | 4 | 3 | 2025-04…2026-09 | 180;24 | — | 0 | 0 | 4 | 5.5 | Мейкерские индексы RAM и GPU; PCPartPicker покрывает частично |
| 21 | rpc-reliability-limits | 4 | 4 | 2024-03…2025-12 | 1;5 | 1.7k | 0 | 2 | 3 | 5.4 | Закрытие Blast API оставило мёртвые дефолтные эндпоинты |
| 22 | crypto-payments-for-devs | 3 | 3 | 2024-03…2026-08 | — | — | 0 | 2 | 1 | 4.5 | BTCPay требует хостинга |
| 23 | airdrop-tools | 2 | 2 | 2025-05…2026-06 | 5100;1801 (X) | — | 0 | 1 | 2 | 3.8 | Твит Ansem; DropHunt |
| 24 | crypto-node-monitoring | 3 | 3 | 2025-06…2025-07 | 0;19 (+1k sats) | — | 0 | 0 | 3 | 3.0 | Prometheus и RTL сложны; «SN как канарейка» |
| 25 | mcp-discovery-tooling | 2 | 2 | 2025-08…2026-07 | 6;33 | — | 0 | 0 | 2 | 2.5 | Трение при публикации в официальный MCP registry |
| 26 | api-deprecation-change-tracking | 1 | 1 | 2026-10 | — | — | 0 | 1 | 1 | 3.0 | — |

## Закрытые, поглощённые и подорожавшие инструменты 2024–2026 (осиротевшие аудитории)

| Инструмент | Что случилось | Когда | Аудитория (тип) | Куда ушли | Источник |
|---|---|---|---|---|---|
| Zapper (DeFi-трекер) | Полное закрытие сайта, приложений и API, экспорта нет | Анонс 2026-07-08, офлайн 2026-08-03 | 2M+ MAU на пике (claim); $6B+ объёма (claim) | DeBank, Zerion, CoinStats, De.Fi, Rotki, Jupiter Portfolio | theblock.co, cryptool.io, coinstats.app, gfdaily.com |
| Step Finance (Solana-портфель) | Закрытие после взлома (~261k SOL, claim) | Конец февраля 2026 | н/д | Jupiter Portfolio и др. | CoinStats (claim, не перепроверено) |
| DappRadar | Закрытие | 2025-11-17 | н/д | DefiLlama и др. | web3isgoinggreat (claim) |
| Freshping (Freshworks) | Закрытие бесплатного uptime-мониторинга | 2026-03-06 | н/д | UptimeRobot, StatusCake, HetrixTools, Better Stack | GitHub avni-infra#76 (fact) |
| Flowise | Сворачивание: заморозка 2026-07-27, cloud до 2026-11-30 (поглощён Workday в 2025) | 2026-07 | н/д; HN 58;45 | n8n, Langflow, кодинг-агенты | flowiseai.com/sunset, HN 49176920 |
| GummySearch | Нет лицензии на Reddit Data API: новые продажи закрыты 2025-11-30, продукт работает год | 2025-11-06 | Платящие SaaS-клиенты | — (G4-зона) | gummysearch.com/final-chapter |
| Reddit RSS и public API | Отключение RSS и публичного API | 2026-09 | Lemmy 932;320 | — | lemmy.world/post/52568946 |
| X API free / Nitter | Free tier закрыт (pay-per-use с 2026-02), Nitter мёртв с 2024-02 | 2024–2026 | Lemmy 754;109 | Платный API | Lemmy, GitHub nitter#1182 |
| Blast API (Bware Labs) | Закрытие RPC, миграция на Alchemy | 2025-10 | Дефолтные эндпоинты starknet.js и др. | Alchemy, другие RPC | GitHub starknet.js#1508 |
| Etherscan API | V1 отключён; free-тариф не обслуживает Base, BNB, OP, Avalanche, Gnosis | 2025–2026 | Dev-тулы и MCP-агенты | Blockscout, Routescan, Sourcify | GitHub (4 issue, fact); официального анонса не нашли |
| Cursor | Смена Pro-прайсинга 2025-06-16 (извинения и рефанды), авто-кэп 2025-09-15, Max mode для legacy (2026-07), X Subscription (2026-10) | 2025–2026 | Форумные треды 20–38k просмотров | Claude Code, Codex, Windsurf | TechCrunch 2025-07-07, forum.cursor.com |
| Jupiter API | Keyless снижен до 0.5 rps, free 1 rps только с ключом | 2025–2026 | Solana-разработчики | Платные тарифы, Birdeye | developers.jup.ag (fact) |
| Strava API | Free API убран, нужна подписка | 2026-06 | 241k разработчиков (claim Strava) | — | lemmy.world/post/47699066 |
| Pocket / Omnivore | Закрытие | 2025-07 / 2024-11 | Lemmy 165;29 (гайд getoffpocket) | Wallabag, Readeck, Karakeep | Lemmy |
| Postman | Free-план только на одного пользователя | 2026-03-01 | н/д | Bruno, Insomnia | barchart, ministryoftesting (claim, URL не сохранён) |
| UptimeRobot | Free только для некоммерческого использования (конец 2024), позже, судя по всему, откатили | 2024–2026 | н/д | — | Страницы UptimeRobot (estimate) |

**Вывод по сиротам.** Закрытия порождают предсказуемый всплеск запросов «<tool> alternative» на 2–8 недель. Его забирают вендоры-аналоги (CoinStats, cryptool, web3juice по Zapper; notifier, apistatuscheck, velprove по Freshping) и гайды вроде getoffpocket.com. Нам выигрывать такие окна можно только со страницами на домене чекера, выпущенными в первые дни. Отсюда кандидат S4-010.

## Закономерности

- **Мейкеры делают первыми.** В 6 из 13 кластеров встречаются посты «I built X because I couldn't find one»: ccusage, codexometer, Crypto Address Monitor, Canary, DropHunt, RAM index. Это признак реальной боли и одновременно будущей бесплатной конкуренции.
- **Цена → боль → трекер.** Каждое изменение прайсинга (Cursor, Codex, n8n, Etherscan, Jupiter) рождает тред на 10–40k просмотров и инструменты-счётчики. Спрос на прозрачность лимитов растёт быстрее, чем вендоры её дают.
- **Telegram как интерфейс по умолчанию.** «Пришли мне в TG» встречается в алертах по кошелькам, n8n-дайджестах, мониторинге нод и uptime. Есть контр-тренд приватности: «cringe to send node data to Telegram», запросы self-hosted ntfy и Gotify.
- **Free tier — главный критерий.** Почти все запросы содержат «free», «generous free tier» или «without API key». Норма рынка — 3–10 адресов или мониторов бесплатно.
- **Агенты и MCP — новый потребитель API.** Свежие сигналы 2026 по explorer-API пишут авторы MCP-агентов. Keyless-доступ для них критичен.
- **Ошибка из API как поисковый запрос.** Тексты ошибок («Free API access is not supported for this chain», «deprecated V1 endpoint») — готовые long-tail-запросы для SEO dev-тулов.

## Топ кандидатов (score из score.py)

| # | id | Кандидат | Score | Механизм | Почему |
|---|---|---|---|---|---|
| 1 | S4-002 | Агрегатор статусов LLM-провайдеров «is Claude/ChatGPT down» + алерты | 63.8 | seo;ai-answers | Массовый tool-intent, ядро чекера (synergy 5), обновляется сам. Минус — Downdetector в топе. Объединить с S1-008 |
| 2 | S4-007 | Мультичейн-бот алертов по адресам в TG | 60.0 | store-search;seo;community | Самый частый крипто-запрос, крипто-монетизация. Минус — насыщенность, нужен дифференциатор (TON, xpub, дайджест). Объединить с S1-011 |
| 3 | S4-004 | Замена Zapper: read-only дайджест портфеля в TG | 56.2 | seo;store-search;ugc-sharing | Осиротевшая аудитория 2M (claim) и прямой запрос «дайджест между DeBank и Nansen». Окно SEO уже частично закрыто |
| 4 | S4-001 | Трекер лимитов AI-кодинга (VS Code / Open VSX / CLI) | 52.5 | store-search;seo | Самый сильный и платящий спрос в S4. Минусы — OSS-конкуренты, хрупкие неофициальные API, слабая крипто-монетизация |
| 5 | S4-009 / S4-015 | Здоровье Solana / алерты DeFi-позиций | 52.5 | seo;community | Синергия с чекером, но прямого спроса в S4 мало (confidence L) |

Остальные кандидаты: S4-006 (EIP-7702-чекер, 50.0), S4-005 (keyless explorer MCP, 50.0), S4-014 (n8n-шаблоны, 50.0), S4-011, S4-003, S4-010, S4-013 (43.8), S4-012 (41.2), S4-008 (36.2).

Отсеяны по G4: S4-016 (RSS из X/Reddit), S4-017 (раздача airdrop по виральности), S4-018 (pump.fun-алерты как торговые сигналы).

## Что не удалось проверить

- **Reddit — ноль прямых данных.** JSON API отдаёт 403, WebSearch блокирует reddit.com, в индексе Exa Reddit нет. Обход через архивы и RSS был запрещён (bot-check circumvention); Reddit-зеркала на Lemmy сознательно не использовали. Reddit-голос есть только во вторичных дайджестах (Clauday), отмечено в raw.csv. Это главный пробел: крипто-сабреддиты (r/solana, r/ethdev, r/defi, r/CryptoCurrency) не покрыты.
- **X за логином.** Есть только твит Ansem через зеркало kazuha.ai и ссылки из дайджестов.
- **Telegram-чаты** (закрытые) — не трогали по правилам. **VC.ru, Indie Hackers, Product Hunt** дали мало прямых сигналов: поиск находит в основном статьи, а не треды.
- **Объёмы поисковых запросов не измеряли** — это работа S3. Все оценки traffic и time_to_10k — по аналогам, без цифр.
- **Unique authors** для GitHub, новостей и Habr приближены числом тредов. **Engagement** несопоставим между источниками (лайки Discourse, пойнты HN, sats SN).
- **Квота Stack Exchange** ограничена (осталось около 230 запросов), выборка SE неполная. **В поиске GitHub issues 2026** много агентского спама, фильтровали вручную.
- **Не перепроверены (claim):** 2M MAU Zapper; Step Finance 261k SOL; дата закрытия DappRadar; Postman free (URL не сохранён); статус free-плана UptimeRobot в 2026; связь взлома Binance с EIP-7702 (preliminary).

## Подсказки другим потокам

**S3 (поиск) — проверить запросы:**
- «is claude down», «chatgpt down», «gemini api status», «openai api status», «claude code usage limit», «cursor usage», «codex limits»;
- «zapper alternative» (затухание после августа 2026), «defi portfolio tracker», «crypto portfolio telegram bot»;
- «wallet tracker telegram bot», «crypto wallet alert», «track solana wallet», «ton wallet notifications»;
- «eip-7702 delegation check», «revoke 7702 delegation», «approval checker base»;
- «etherscan api free alternative», «Free API access is not supported for this chain», «basescan api key free»;
- «freshping alternative», «free uptime monitor telegram», «website change monitor telegram»;
- «aave health factor alert», «liquidation alert telegram»; «ram prices», «gpu price tracker»; «llm api pricing comparison».

**Гипотезы спроса для S3:**
- (a) объём «is <LLM> down» сопоставим с «is <chain> down» или больше;
- (b) после закрытия Zapper остался long-tail «defi portfolio tracker» без сильного лидера в TG-формате;
- (c) запросы по EIP-7702 растут после каждого хака;
- (d) ошибки Etherscan-API дают измеримый dev long-tail.

**S2 (сторы):**
- установки и рейтинги аналогов в VS Code Marketplace и Open VSX (cursor-stats, ccusage-обёртки);
- позиции wallet-tracker-ботов в Telegram;
- explorer-MCP в Smithery, mcp.so и official registry;
- крипто-шаблоны в галерее n8n.

**S5 (data):**
- журнал закрытий и free-tier изменений dev-инструментов (S4-010) как data-актив;
- история цен LLM API (S4-003) — пересечение с S1-008.

**S1:** проверить трафик cielo.finance, coinstats.app/blog/zapper-alternatives, getoffpocket.com, ccusage как аналогов для time_to_10k.
