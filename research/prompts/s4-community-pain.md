# S4 — Боль комьюнити

Код: `S4` · Папка: `research/streams/s4-pain/`

## Вопрос
Какие потребности люди озвучивают сами, как часто и готовы ли за решение платить?

## Где искать
- **Основное:** Reddit, Hacker News, X.
- **По возможности:** GitHub Issues и Discussions, Product Hunt, Indie Hackers; RU-сегмент — Хабр Q&A, VC.ru, публичные Telegram-чаты через поиск.

Сабреддиты для старта (расширяй сам): r/CryptoCurrency, r/solana, r/ethereum, r/ethdev, r/defi, r/CryptoTechnology, r/ethfinance, r/algotrading, r/webscraping, r/selfhosted, r/n8n, r/automation, r/SaaS, r/SideProject, r/chrome_extensions, r/vscode, r/Telegram, r/LocalLLaMA.

## Фразы-триггеры
- «is there a tool», «is there an app», «is there a site», «any tool that», «does anyone know a tool»;
- «alternative to», «cheaper alternative», «open source alternative to»;
- «I track it in a spreadsheet», «I use a spreadsheet to», «google sheet to track», «I manually check»;
- «wish there was», «I'd pay for», «would pay for»;
- «how do you keep track of», «how do you monitor».

Комбинируй их с нишевыми словами: wallet, airdrop, RPC, gas, PnL, portfolio, token, approval, bridge, scraper, monitor, alert, uptime, API, webhook.

## Как искать
- Google/Exa с `site:reddit.com`, `site:news.ycombinator.com`, `site:x.com`.
- HN Algolia API: `https://hn.algolia.com/api/v1/search?query=...&tags=comment` (и `story`).
- Reddit JSON: `https://www.reddit.com/r/<sub>/search.json?q=...&restrict_sr=1&sort=new` — если отдаёт.
- Manifold, если доступен (разбор болей на Reddit, жалобы на конкурентов): найди его инструменты через `ToolSearch`.

## Закрытые и подорожавшие тулзы
Отдельно найди тулзы в наших нишах, которые за 2024–2026 годы закрылись, были поглощены и свёрнуты, сломались (API или правила платформ), резко подняли цены или убрали бесплатный тариф.

Ищи по фразам: «shutting down», «sunsetting», «is dead», «discontinued», «no longer free», «price increase», «alternative now that X».

По каждой запиши, сколько у неё было пользователей и куда они ушли.

## Схема `raw.csv`
```
signal_id,source,community,url,date,quote,need_cluster,signal_type,engagement,wtp_signal,wtp_evidence,current_workaround,existing_solutions_mentioned,notes
```
- `quote` — оригинал, до 300 символов.
- `signal_type`: `tool-request` / `alternative` / `spreadsheet` / `wish` / `shutdown` / `price-hike`.
- `engagement`: `upvotes;comments`.
- `wtp_signal`:
  - `explicit` — «I'd pay», называет сумму, уже платит за плохое решение, использует в бизнесе;
  - `implicit` — тратит много времени или денег на обходной путь;
  - `none`.

## Анализ
1. **Объём:** минимум 150 сигналов в raw, не меньше 15 кластеров `need_cluster`.
2. **По каждому кластеру:**
   - частота: число сигналов, уникальных авторов, за какой период;
   - суммарное вовлечение;
   - доля explicit WTP;
   - какие решения уже есть и почему они не подходят.
3. **Ранжирование:** частота × WTP × свежесть (сигналы 2025–2026 весят больше).

## Выход
- `findings.md`:
  - таблица кластеров, отсортированная по частоте и WTP;
  - закрывшиеся и подорожавшие тулзы с осиротевшей аудиторией.
- `candidates.csv`: 10–20 кандидатов.

В `traffic_mechanism` укажи, как люди, которые это ищут, найдут решение без нас (обычно `seo`, `store-search` или `community`). Если найти его можно только через наш постинг, это G1.
