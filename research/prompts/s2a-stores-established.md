# S2a — Сторы со встроенным трафиком (зрелые)

Код: `S2a` · Папка: `research/streams/s2a-stores/`

## Вопрос
В каких категориях зрелых сторов большой спрос, а решения слабые?

## Платформы
1. Chrome Web Store; бонусом — Edge Add-ons и Firefox Add-ons.
2. VS Code Marketplace и Open VSX (его используют Cursor, Windsurf и другие форки).
3. Raycast Store.
4. Shopify App Store.
5. Шаблоны n8n (библиотека workflows, creator-программа, community nodes) и Make (templates).
6. Telegram Mini Apps: каталоги (Telegram Apps Center, findmini.app и др.); MAU видно в профиле бота.

## Метод для каждой платформы
1. **Механика трафика внутри.** Как работают поиск, витрины, «featured», от чего зависит ранжирование, какие метрики публичны (users, installs, rating, reviews).
2. **Условия для нас** (гейт G2).
   - Можно ли публиковать как физлицо.
   - Как получать деньги:
     - есть ли встроенный биллинг;
     - нужна ли компания;
     - выплачивает ли платформа на Payoneer — напрямую или на его локальные банковские реквизиты;
     - разрешено ли брать крипту за внешний премиум без нарушения правил стора.
   - Нужно ли раскрывать адрес и телефон (статус trader по EU DSA).
   - Сколько стоит вход.

   Для TMA проверь цепочку Telegram Stars → вывод через Fragment в TON: возможно, это путь к крипто-монетизации без юрлица.
3. **Сигналы «спрос высокий, решения слабые»:**
   - у лидеров категории или запроса много пользователей, но рейтинг ниже 3.5★ или много свежих негативных отзывов («broken», «stopped working», «too expensive»);
   - лидеры не обновлялись больше 12 месяцев или сломались после изменений платформы — например, сироты Manifest V2 в Chrome, у которых остались живые пользователи;
   - популярные запросы, по которым выдача стора нерелевантна или пуста;
   - решение есть на одной платформе и отсутствует на другой (например, есть в CWS, нет в Raycast, VS Code или TMA).
4. **Охват:** минимум 15 запросов или категорий на платформу в наших нишах, плюс до 5 вне ниш, если сигнал сильный.

## Схема `raw.csv`
```
platform,category,query_or_niche,top1_name,top1_users_or_installs,top1_rating,top1_reviews,top1_last_update,top3_combined_users,n_relevant_competitors,best_rating_among_top5,gap_type,gap_evidence,monetization_options,individual_dev_ok,payoneer_payout_ok,crypto_payment_ok,public_address_required,source_url,notes
```
- `gap_type` — `low-rating` / `abandoned` / `missing` / `cross-platform` / `price`;
- `individual_dev_ok`, `payoneer_payout_ok`, `crypto_payment_ok`, `public_address_required` — `y` / `n` / `?`.

## Выход
- `findings.md`. По каждой платформе: механика трафика, условия для физлица и крипты, 3–5 лучших дыр. В конце — **твой топ-15 пар «платформа × категория»**; оркестратор сведёт его с S2b в общий топ-20.
- `candidates.csv`: 15–25 кандидатов — конкретные расширения, плагины или шаблоны.
