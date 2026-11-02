# Топ-20 пар «платформа × категория» (S2a + S2b)

Дата: 2026-11-02. Источники:
- `research/streams/s2a-stores/raw.csv` (165 наблюдений) и черновик findings S2a (топ-15 пар);
- `research/streams/s2b-young-stores/raw.csv` (40 наблюдений).

Пары ранжированы по score связанного кандидата из [`candidates_master.csv`](candidates_master.csv). Цифры спроса — fact со страниц сторов на 2026-11-02, если не помечено иначе.

| # | Платформа × категория | Спрос | Слабость решений | Условия для нас | Кандидат · score |
|---|---|---|---|---|---|
| 1 | VS Code Marketplace + Open VSX × usage-метр AI coding-агентов | Claude Code Usage 75.5k (VSM) + 60.9k (OVSX); Codex Rate Limit Monitor 8.5k | мульти-агентных <600 установок | физлицо, без адреса; крипта — за внешний Pro | C-012 · 70.5 |
| 2 | CWS × газ и комиссии (покупка лидера) | Ethereum Gas Price Extension 40k, 4.75★; GasNow 10k; DeFi Saver Gas 10k | лидеры заброшены (2025-02/03), мультичейна нет; новички 240–380/мес | off-market сделка, цена неизвестна | C-021 · 69.2 |
| 3 | ChatGPT Plugin Directory × airdrop eligibility | Drops 80k users (claim, вне стора) | 0 плагинов (снапшот 2026-10-10) | individual verification; продавать внутри нельзя | C-005 · 66.8 |
| 4 | n8n templates × крипто-мониторинг → Telegram | лучшие крипто-шаблоны 11.9–13.1k просмотров; TG AI-боты до 82k | rpc — 0, whale — 2, dexscreener — 2 шаблона | физлицо; платные шаблоны через внешний purchaseUrl | C-017 · 65.5 |
| 5 | ChatGPT Plugin Directory × безопасность токенов и адресов (+TON) | тег Crypto — 47 из 9,877 плагинов (claim); scam-check вне стора — Token Sniffer 2.78M (est.) | ~7 слабых листингов, TON — 0 | individual verification, страна KYC ?; внутри плагина денег нет | C-003 · 65.5 |
| 6 | CWS + AMO × paper trading (memecoin, perps) | DryFlip 40k, MockApe 20k, Simora 7k; AMO — 748 ADU | Hyperliquid/perps — пусто; в Firefox один игрок | non-trader; Pro за SOL/USDC | C-014 · 65.0 |
| 7 | CWS × selector / XPath для скрейпинга | SelectorsHub 400k, SelectorGadget 100k, xPath Finder 50k | SelectorGadget не обновлялся с 2022-08; остальные ≤3.4★ | покупка вне бюджета; своё расширение растёт на 300–400/мес | C-022 · 64.2 |
| 8 | Telegram bots/TMA × аналитика Telegram Gifts | рынки ≈930k MAU (MRKT 486,883; Portals 385,286); NFT GIFT Calculator 82,669 MAU | 3 аналитических бота | Stars → Fragment → TON, KYC при выводе | C-016 · 63.8 |
| 9 | CWS + AMO × cookie editor / экспорт | Cookie-Editor 2M + 135.6k ADU; Get cookies.txt LOCALLY 900k | лидер не обновлялся с 2024-02 | строгое ревью разрешений | C-024 · 62.5 |
| 10 | Solana dApp Store × безопасность и сканер токенов | 150–200k устройств, ~9k DAU (claim) | сканера не найдено (каталог виден только с устройства) | 0% комиссии, SOL/USDC напрямую; KYC издателя | C-004 · 62.5 |
| 11 | CWS × JSON viewer | JSON Formatter 2M (1.51★ после продажи); JSON Viewer Pro 300k | лидер испорчен рекламой; новички ~600/мес | покупка $7.5k–36k или open-source форк | C-023 · 61.8 |
| 12 | CWS + AMO × лимиты AI-ассистентов (мульти-провайдер) | Claude Usage Tracker 100k; Conso 10k за ~2 мес | ChatGPT-трекеры 2.33★ или заброшены; Claude-only — 10+ игроков | non-trader | C-013 · 60.0 |
| 13 | ChatGPT Plugin Directory × DeFi-доходности / TVL | DefiLlama ~1.5M visits/мес (estimate, вне стора) | 0 плагинов | риск ревью «unofficial connector» | C-035 · 58.8 |
| 14 | Claude Directory (+ ChatGPT Developer Tools) × цены и статус LLM API | Artificial Analysis 8.08M visits (estimate) | в ChatGPT 0–1 листинг; в реестре ~8 мелких серверов | Pro-аккаунт физлица; крипта в Claude Directory запрещена, LLM-данные — нет | C-009 · 58.5 |
| 15 | VS Code Marketplace + Open VSX × REST / .http клиент | Thunder Client 7.68M (2.36★, paywall); REST Client 7.72M (с 2022-08) | лидеры испорчены, но есть httpYac (141k, 4.96★) | 25 дней работы | C-030 · 56.2 |
| 16 | Telegram bots × paper trading | торговые боты 15–41k MAU (Trojan, BONKbot, Bloom) | paper-ботов не найдено (проверены 45 из 433) | Mini App — только TON (ToS, раздел 7) | C-015 · 56.2 |
| 17 | CWS × ассистенты для n8n | n8n Chat 40k | лидер 2.68★ (paywall, сбои) | риск встроенного AI Builder в n8n | C-031 · 52.5 |
| 18 | TMA × крипто-калькуляторы | @cryptocalcru_bot 18.6k MAU | в Calculators (106 apps) нет PnL и ликвидаций | Stars | C-027 · 51.2 |
| 19 | x402 Bazaar × chain reads для агентов | 44.9M переводов / 440k плательщиков за 30 дней (claim); top-роуты — 200–560 плательщиков | 7,288 листингов, 77% — ≤2 плательщиков; Solana/TON слабее | USDC на свой кошелёк; CDP-фасилитатор требует KYC | C-019 · 50.5 |
| 20 | CWS × Web3 anti-phishing | Pocket Universe 100k; Wallet Guard 60k | Wallet Guard и Web3 Antivirus заброшены с 2025-05 | кошельки встраивают Blockaid | C-026 · 50.0 |

## Ниже порога и закрытые пары
- **Дешёвые доп. листинги** к парам 1 и 12, отдельно не ранжируются:
  - Raycast × AI usage: ccusage 14.7k, Agent Usage 4.2k;
  - AMO и Open VSX — порты.
- **Solana dApp Store × трекер наград Seeker** (C-036 · 48.8): кампании меняются каждую неделю, аудитория маленькая.
- **ChatGPT × perps, funding и ликвидации** (C-037 · 45.0): узкий интент, есть риск, что ревью сочтёт это инвест-советом.
- **Base App / Farcaster × карточка кошелька** (C-038 · 43.8): медиана mini app — 287 WAU на 4-й неделе.
- **Shopify × Telegram-алерты и аптайм** (C-028 · 41.2, C-029 · 43.8):
  - публичный адрес в листинге;
  - деньги только через Billing API, Payoneer не подтверждён.
- **Raycast × крипто-инспектор** (C-034 · 33.8): вся крипто-категория ≈16k загрузок за 4 года.
- **Вне ниш:** CWS × SEO-оверлеи (C-033 · 55.0): 1.2M users у заброшенных лидеров, но synergy 1.
- **Закрыто гейтом:**
  - Claude Directory × крипто (G4, политика 4A);
  - ChatGPT × цены и рынок крипты (G1: заняли CoinGecko и CoinMarketCap);
  - MCP-реестры как отдельный канал (54,941 сервер без метрик — гигиена, а не трафик);
  - Make (шаблоны курирует сам Make, метрик нет).

## Выводы по сторам
1. **Новые категории дают новичкам скорость, старые — нет.**
   - Новые (2025–2026: AI usage, paper trading): новички набирают 1.8–4.9k users/мес.
   - Старые (selector, JSON, газ, мониторинг страниц): 12–650/мес даже при заброшенных лидерах.
   - Поэтому в старых категориях пары 2, 7 и 11 имеют смысл только как покупка.
2. **Exact-match название решает.** Это верно для CWS и каталога ChatGPT (в 56% топ-10 ключ стоит в имени). Значит, одно ядро и несколько узких листингов, а не один бренд.
3. **Одно ядро — 4–5 витрин.**
   - AI usage: CWS, VSM, OVSX, Raycast, AMO.
   - Чекер: ChatGPT, Seeker, x402, реестры.
4. **Деньги в сторе.**
   - Крипта прямо из стора — только Solana dApp Store (0%) и Telegram (Stars → TON, с KYC).
   - CWS, VSM, OVSX: свой чекаут за внешний Pro.
   - ChatGPT: продавать внутри плагина запрещено, только перелив на свой сайт или бота.
5. **Ошибка выжившего.** Медианы: AI usage — 441 users, paper trading — 75. Скорость аналогов в `time_to_10k` — это скорость победителей.
