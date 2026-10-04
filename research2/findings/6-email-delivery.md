# Ось 6 — Доставляемость и легальность cold email: ДИСТИЛЛЯТ

> Дата прогона и живых проверок официальных страниц: **2026-10-04**. Полный дамп (цитаты ToS/AUP/законов, реестр S1–S58, противоречия): `research2/raw/6-email-delivery.md`.
> **Контекст исполнителя:** команда из Украины (бренд nightloom), **2–5 персональных писем в день** (≈40–100/мес), получатели в основном US/EU. Это не bulk: порог Google/Microsoft ≈5 000/день на личные ящики.
> Пометки: **[ОФИЦ]** — первичный источник (провайдер/текст закона/регулятор); **[ВТОР]** — вторичный (юрфирма, блог); **[ВЕНДОР]** — «источник заинтересован»; **[ОЦЕНКА]** — моя оценка + обоснование; **«устарело (до 2025)»** — редакция старше 2025 г.; **«нет данных»** — проверено, ответа нет. Идентификаторы **S#** — строки реестра в raw-файле; ключевые URL — в §8.
> Это сбор фактов, не юридическая консультация и не проектирование системы.

---

## 0. Короткий вывод (TL;DR)

1. **Обязательное по правилам почтовых провайдеров при нашем объёме — только «требования ко всем отправителям»:** SPF **или** DKIM, PTR (forward/reverse DNS), TLS, формат RFC 5322, доля жалоб <0,3% (Google: цель <0,1%). **DMARC и one-click unsubscribe (RFC 8058) формально обязательны только для bulk** (Google/Microsoft — ≥~5 000/день на личные ящики; Yahoo порог не называет). [ОФИЦ S1, S2, S12–S15]
2. **Но «по факту» для попадания во «Входящие» нужны SPF + DKIM + DMARC (p=none достаточно, с выравниванием From)** — Google: «we recommend that you always set up SPF, DKIM, and DMARC»; без аутентификации письма «might be marked as spam or rejected with a 5.7.26 error»; с ноября 2025 Gmail усиливает отклонения. [ОФИЦ S1, S2]
3. **Главные ограничения при 2–5 письмах/день — не пороги провайдеров, а (а) закон страны получателя, (б) ToS сервиса отправки, (в) жалобы/отбивки на крошечной выборке** (1 жалоба на ~100 писем/мес = 1% [ОЦЕНКА]).
4. **ESP, которые НЕЛЬЗЯ использовать для cold (прямой запрет в AUP/ToS): Resend, Postmark, Amazon SES, Mailgun (Sinch), Twilio SendGrid, Brevo.** Цитаты — в §3. Cold-платформы (Instantly, Smartlead, lemlist) cold не запрещают, но вся юр-ответственность на пользователе; на 2–5/день они не нужны, а встроенный «прогрев» — риск.
5. **Рабочий вариант отправки:** обычный ящик Google Workspace Business Starter **$7/польз./мес** или Microsoft 365 Business Basic **$7/польз./мес** (с 2026-07-01) на собственном домене. Их политики запрещают «unsolicited mass/bulk/commercial email» — серая зона для персональных 1:1; реальный триггер блокировки — жалобы, а не сам факт cold. [ОФИЦ S7–S9, S18, S20]
6. **По закону в КАЖДОМ письме** (единый набор для US+CA+EU/UK/FR): честные From/тема; пометка, что это предложение (реклама); название отправителя; физический адрес + контакт; рабочий отказ (выполнить ≤10 рабочих дней, механизм жив ≥30–60 дней); для EU/UK — уведомление по GDPR Art. 14 + явное право возражения (Art. 21(4)); без трекинг-пикселей для EU без согласия. §4.
7. **География (cold B2B, первое касание без согласия):** США — допустимо (opt-out); Канада — только при «conspicuous publication» + релевантность роли, бремя доказательства на нас; UK — юрлица допустимо; Франция — допустимо при трёх условиях; **Германия и Австрия — нельзя без предварительного явного согласия даже для B2B**; остальные страны ЕС — **нет данных** (обзоры противоречат), до проверки юристом считать «нельзя». §4.2.
8. **Прогрев:** сервис/пул-прогрев при 2–5/день **не нужен и рискован** (M3AAWG 11.2025, Spamhaus 06.2025, Validity Heatwave 09.2026) [ОЦЕНКА]; **естественный рэмп нужен всегда и получается сам** — стабильно, без всплесков. §5.
9. **Ожидаемая доля первых писем во «Входящих» ≈ 80–90%** (Gmail/Workspace-получатели ≈ 85–95%, за Microsoft/Proofpoint-фильтрами ≈ 70–85%) — [ОЦЕНКА] по отчёту Validity 2026 (пересказ) и вендорским данным; независимых замеров на малом объёме нет. §6.
10. **Нужен юрист/осталось «нет данных»:** представитель в ЕС по GDPR Art. 27; страны ЕС кроме DE/AT/FR/UK; применимость CAN-SPAM/«physical address» к иностранному отправителю; финальный статус EDPB 1/2024. §7.

---

## 1. Чек-лист «обязательно при нашем объёме (2–5 писем/день)»

### 1A. Аутентификация и техника: «только для bulk» vs «нужно даже при 2–5/день»

Область действия: правила Google применяются к письмам на **личные @gmail.com/@googlemail.com**; для получателей на Google Workspace формальные требования Gmail не применяются (фильтрация идёт общими механизмами) — а B2B-адресаты чаще на Workspace/M365 [ОФИЦ S2]. Порог bulk у Google — «close to 5,000 messages or more to personal Gmail accounts within a 24-hour period», считается по **primary domain**, статус **постоянный** [ОФИЦ S2]; у Microsoft — 5 000+ писем/день на consumer-сервисы Microsoft с одним доменом в 5322.From [ОФИЦ S15]; у Yahoo — «We will not specify a volume threshold» [ОФИЦ S13].

| Требование | Формально обязательно | При 2–5/день | Источник |
|---|---|---|---|
| SPF **или** DKIM | ВСЕМ отправителям на Gmail (с 2024-02-01) и Yahoo | **Да, обязательно** | S1, S12 |
| DKIM-ключ ≥1024 бит (рекомендуют 2048) | Gmail: «requires» для личных Gmail; Yahoo ≥1024 | **Да** | S1, S13 |
| PTR (forward+reverse DNS), TLS, RFC 5322 | всем | **Да** (обеспечивает Google/Microsoft при отправке через их ящик; на самописном SMTP — на нас [ОЦЕНКА]) | S1, S12 |
| Доля жалоб <0,3% (цель <0,1%) | всем (формулировка) | Формально да, **практически не измеримо**: Postmaster Tools скрывает данные при малом объёме (порог не публикуется — нет данных); 1 жалоба на ~100 писем = 1% [ОЦЕНКА] | S1, S2, S3 |
| SPF **и** DKIM (оба) | только bulk | **Да по факту** (рекомендация Google «always») | S1 |
| DMARC (достаточно p=none), выравнивание From с SPF- или DKIM-доменом | только bulk (Microsoft пример записи: `_dmarc` TXT `v=DMARC1; p=none`) | **Да по факту** (одна TXT-запись; Google/Yahoo/Microsoft рекомендуют всем; без выравнивания DMARC не пройдёт) | S1, S4, S13, S15 |
| One-click unsubscribe по RFC 8058 (`List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, подпись DKIM) | только bulk-маркетинг; транзакционные исключены | **Нет** (не обязателен); полезен как «клапан» против жалоб (Google: «helps you maintain a low spam rate») | S2, S13, S21 |
| Видимая отписка в теле письма | bulk (Gmail/Yahoo) | **Да — но по закону** (CAN-SPAM/CASL/ePrivacy), не по правилам провайдера | §4 |
| Отписка исполнена ≤48 ч (Google, рекомендация) / ≤2 дней (Yahoo, bulk) | bulk | Желательно; по закону ≤10 рабочих дней (US/CA) | S2, S12, S39, S40 |
| Постепенный объём, «без всплесков», стабильная частота | рекомендация Google всем | **Да** (при 2–5/день выполняется само) | S1 |
| Postmaster Tools / compliance-дашборды | bulk (рекомендуется) | Данных, вероятно, не будет [ОЦЕНКА] | S2, S3 |

Энфорсмент: Gmail с ноября 2025 «ramping up its enforcement… temporary and permanent rejections» (код 5.7.26 — неаутентифицировано); новых требований не вводилось [ОФИЦ S2; независимо Spamresource 2025-11-06, S48]. Microsoft: отказ `550 5.7.515` для неаутентифицированного bulk на consumer-доменах; **официальная дата перехода от «Junk» к отказу в источнике противоречива** (S14); подтверждения 2026-статуса из первоисточника нет, только вендорские блоги [ВТОР].

### 1B. Содержание письма по закону (минимальный набор — подробности §4)
1. Честные `From`/`Reply-To`/routing (реальный домен отправителя), без подделки; тема не вводит в заблуждение; без фейкового `Re:/Fwd:` (S1, S39).
2. Прямое указание, что письмо — **коммерческое предложение/реклама** (CAN-SPAM; Украина ст. 10(4)). [S39, S47]
3. **Идентификация отправителя** (название/юрлицо; от чьего имени) + **физический почтовый адрес** + контакт (email/телефон/сайт); контакт должен быть валиден **≥60 дней** после отправки (CASL). [S39, S40]
4. **Рабочий отказ**: ответ-письмо или ссылка; живёт **≥30 дней** (US) / **≥60 дней** (CA); выполнять **≤10 рабочих дней** (US/CA) — на практике сразу; бесплатно, без запроса лишних данных. [S39, S40]
5. Для получателей в ЕС/UK: **уведомление по GDPR Art. 14 в первом письме** (кто мы, цель и основание, категории данных, источник, срок хранения, права, право жалобы) + **право возражать против direct marketing, показанное явно и отдельно (Art. 21(4))**. [S41]
6. Для ЕС: **без пикселей открытия и tracked-ссылок** без согласия (EDPB 2/2023, CNIL 2025). [S42]
7. Для Канады — иметь **доказательства** (где/когда найден адрес, что он опубликован публично без оговорки, почему письмо релевантно роли). [S40]

### 1C. Операционные требования, вытекающие из закона/ToS (факты, не дизайн)
- Список «не контактировать»: после отказа нельзя слать >10 рабочих дней и нельзя передавать адрес (CAN-SPAM §7704(a)(4)); CASL — тот же срок; ICO/CNIL рекомендуют вести такой список. [S39, S40, S45]
- **Нельзя** слать письма на адреса, полученные автоматическим подбором перестановок (first.last@…) или автоскрейпингом с сайта, у которого есть notice о нераспространении адресов, — отягчающее нарушение CAN-SPAM §7704(b)(1) (если письмо и так нарушает (a)). [S39]
- Нарушение закона = нарушение ToS ящика: Gmail Program Policies «not allowed to use Gmail to send email in violation of the CAN-SPAM Act or other anti-spam laws». [S9]
- Отправка из Украины не снимает применимость права получателя: GDPR Art. 3(2) (оферта услуг субъектам в ЕС) — вероятно применим [ОЦЕНКА; нужен юрист]; CASL — письма получателям в Канаде из другой страны «must comply with CASL» (CRTC FAQ, выдержка). [S40, S41]

---

## 2. Что требуют провайдеры (кратко)

| Провайдер | К кому применяется | Всем отправителям | Дополнительно bulk | Энфорсмент | Источник |
|---|---|---|---|---|---|
| **Google/Gmail** (получатель — личные @gmail.com) | все; bulk ≈5 000+/день на личные Gmail, по primary domain, статус постоянный | SPF или DKIM; PTR; TLS; RFC 5322; spam <0,3% (цель <0,1%); не подделывать Gmail From | SPF+DKIM; DMARC (p=none достаточно) с выравниванием; one-click unsubscribe + видимая ссылка; обработка отписки ≤48 ч (рекомендация) | с 2025-11 усиление: 4xx/5xx, `5.7.26` для неаутентифицированных; «delivery support unavailable» при spam >0,3% | S1, S2 [ОФИЦ] |
| **Yahoo/AOL** | все; bulk — «significant volume», порог не назван | SPF или DKIM; spam <0,3%; PTR; RFC 5321/5322 | SPF+DKIM; DMARC p=none (+rua); выравнивание; List-Unsubscribe с one-click (RFC 8058 «highly recommended»; mailto допустим); отписка ≤2 дней | постепенное усиление с 2024-02; «spam folder or rejected» | S12, S13 [ОФИЦ] |
| **Microsoft Outlook.com/Hotmail/Live (consumer)** | bulk ≥5 000/день на consumer-домены Microsoft, один домен в 5322.From | (в блоге — «best practices для всех») | SPF+DKIM (Must Pass); DMARC ≥p=none с выравниванием; рабочая отписка | Junk → отказ `550 5.7.515`; дата отказа в источнике противоречива | S14, S15 [ОФИЦ]; 2026-статус — [ВТОР] |
| Корпоративные ящики (M365/EOP, Proofpoint-класс) | отдельная фильтрация | официальных числовых порогов нет | — | нет данных | [ВТОР] |

RFC 8058 (Standards Track, январь 2017): письмо несёт два заголовка и подпись DKIM, покрывающую оба; получатель делает HTTPS POST без участия пользователя. [ОФИЦ S21]

---

## 3. Инфраструктура отправки: «инфра | цена | cold по ToS | вердикт»

Решающий фактор — что ToS/AUP говорит про cold/unsolicited. Страницы открыты 2026-10-04; даты редакций указаны. Цены вендоров — [ВЕНДОР], «источник заинтересован».

| Инфра | Цена | Cold разрешён по ToS? (дословно/суть) | Вердикт |
|---|---|---|---|
| **Google Workspace (ящик)** | Business Starter **$7**, Standard $14, Plus $22 /польз./мес при годовом обязательстве (оплата помесячно); помесячный гибкий тариф дороже — цена не подтверждена [ОФИЦ S7] | **Серая зона.** AUP (ред. 2025-10-13): запрещён «unsolicited mass email»; Gmail Program Policies (2025-11-13): «Don’t use Gmail to distribute spam or unsolicited commercial mail». Для 1:1 не «mass», но «commercial»; триггер — жалобы [ОФИЦ S8, S9] | **МОЖНО.** Базовый вариант для брендового домена. Лимит 2 000/день на польз. — при 2–5/день нерелевантен [S6] |
| **Microsoft 365 (ящик)** | Business Basic **$7,00** (было $6,00; с 2026-07-01), Standard $14, Premium $22 [ОФИЦ S18]; Exchange Online Plan 1 — цена только [ВТОР] | **Серая зона.** Anti-Spam Policy: запрещено «unsolicited bulk or unsolicited commercial e-mail»; AUP (ред. 2011-02 — «устарело (до 2025)») — то же [ОФИЦ S20]. Лимиты Exchange Online: 10 000 получателей/день, 30 писем/мин [S17] | **МОЖНО.** Для автоматической отправки по SMTP: Basic auth для SMTP AUTH по умолчанию выключается в конце декабря 2026 → OAuth [ОФИЦ S19] |
| Обычный Gmail (бесплатно) | $0 | Gmail Program Policies — те же; лимит 500 получателей/день [S5, S9] | **Не рекомендуется** для бренда: адрес @gmail.com; при «Send as» домена DKIM подпишет gmail.com → нет выравнивания с From=ваш домен [ОЦЕНКА по требованию S1] |
| Zoho Mail (Free/Lite) | Free: до 5 пользователей на домен, IMAP/POP/ActiveSync не включены [ОФИЦ S31]; Lite ≈$1/польз./мес [ВТОР, вендор-конкурент] | **нет данных** (страница антиспам-политики вернула 404); [ВТОР]: «Bulk or burst sending is not supported» | **Нет данных** — бюджетный вариант без проверенной политики |
| **Instantly** | Growth **$47**/мес ($37,6 при годовой): 5 000 писем/мес, неограниченные ящики и прогрев; Hypergrowth $97; Light Speed $358 [ВЕНДОР S28] | **Разрешает cold, ответственность на вас.** ToS (2026-09-22): Subscriber — «sole “sender” and “initiator” (as those terms are used under CAN-SPAM…)»; §6.8: «Instantly does not provide notices or obtain consents on Subscriber’s behalf.» §4.8: данные других пользователей из пула прогрева [ОФИЦ S28] | **Можно, но не нужно** при 2–5/день; прогрев-пул = риск (Heatwave) |
| **Smartlead** | Base **$39**/мес (2 000 контактов, 6 000 писем), Pro $94, Smart $174, Prime $379 [ВЕНДОР S29] | **Конфликт с правом получателя.** Terms: «any use of the Service for the purpose of sending unsolicited commercial electronic messages… as defined by the Spam Laws is strictly prohibited»; Spam Laws = законы «other jurisdictions in which you or your intended audience are in» → cold в DE/AT/CA без оснований нарушает и Terms [ОФИЦ S29] | **Не нужно/юридически неудобно** |
| **lemlist** | Email от **$55**/мес; Multichannel от $87 [ВЕНДОР S30] | Anti-Spam/Sending Policy входит в договор; при «unusual number of complaints» вправе закрыть аккаунт без возмещения [ОФИЦ S30] | Не нужно на 2–5/день |
| **Resend** | Free $0 (3 000 писем/мес, 100/день); Pro $20/мес [ОФИЦ S22] | **ЗАПРЕЩЕНО.** AUP (2026-08-27): «You are prohibited from sending unsolicited messages of any kind, including cold outreach, purchased lists, or scraped contact data.» «All mail must be sent to recipients who have explicitly opted in… Sending to unsolicited recipients is not permitted on Resend.» Пороги: жалобы <0,08%, bounce <4% | **НЕЛЬЗЯ для cold** |
| **Postmark** | Free 100 писем/мес; **$15/мес за 10 000** [ОФИЦ S23] | **ЗАПРЕЩЕНО (по смыслу).** ToS (2024-12-10 — «устарело (до 2025)» по дате): «All email lists… must be permission-based subscriptions.»; «Emails sent unsolicited will receive abuse complaints…»; слова «cold email» нет. Пороги: жалобы <0,1%, bounce <10% | **НЕЛЬЗЯ для cold** |
| **Amazon SES** | **$0,10 / 1 000** писем; free tier — 3 000 в мес. первые 12 мес. [ОФИЦ S24] | **ЗАПРЕЩЕНО.** AWS AUP (2021-07-01 — «устарело (до 2025)»): запрет «unsolicited mass email»; при запросе production-доступа нужно подтвердить: «agree to only send email to individuals who’ve explicitly requested it». SES FAQ: паузу вправе наложить при «unsolicited or malicious content» | **НЕЛЬЗЯ для cold** |
| **Mailgun (Sinch)** | Free $0 (100/день); Basic $15; Foundation $35 [ОФИЦ S25] | **ЗАПРЕЩЕНО.** AUP (2023-01-16 — «устарело (до 2025)»): «Emails and SMS (unless transactional) can only be sent where permission has been expressly obtained… clear, explicit and provable consent»; «Use of contact lists that are bought, rented or scraped… is absolutely prohibited»; «Proof of consent must be provided». Пороги: bounce ≤5%, жалобы ≤0,08% | **НЕЛЬЗЯ для cold** |
| **Twilio SendGrid** | бесплатный trial; цены платных не извлечены — нет данных [S26] | **ЗАПРЕЩЕНО.** Email Policy (2026-04-09): «you must obtain affirmative consent prior to sending any emails to a recipient»; запрещено «Sending emails to email addresses that you obtained from the Internet or social media… without obtaining prior affirmative consent» и tracking-пиксели до согласия | **НЕЛЬЗЯ для cold** |
| **Brevo** | Free: до 300 писем/день [ОФИЦ S27] | **ЗАПРЕЩЕНО.** Anti-spam policy: «Bought & scraped lists… strictly prohibited»; «You must have the consent of your Contacts… active… and explicit»; спам-законы CAN-SPAM, GDPR, LGPD, CASL названы | **НЕЛЬЗЯ для cold** |

Дополнительно: «замаскировать» cold под transactional через ESP тоже не годится — Spamhaus: cold-рассылки пытаются «falsely identifying as transactional because they are sent “one-to-one”. But cold emails are not transactional» и перечисляет «Misusing the free tier of sending platforms and cloud providers» среди признаков спама [ОФИЦ S33].

---

## 4. Что юридически обязательно в каждом письме (US / EU / CA)

### 4.1 Модели по юрисдикции получателя (cold B2B, 1:1, первое касание)

| Юрисдикция | Модель | Первое cold-B2B-письмо без предварительного согласия | Условия | Статус источников | Для нас [ОЦЕНКА] |
|---|---|---|---|---|---|
| **США** — CAN-SPAM | opt-out | **Допустимо** | честные заголовки/тема; пометка «реклама/solicitation»; физический адрес; рабочий отказ; ≤10 рабочих дней; закон «makes no exception for business-to-business email»; штраф до **$53,088 за каждое письмо** (FTC, 2026-10-04) | [ОФИЦ] FTC + 15 USC §7704, §7707 | допустимо при полном соблюдении; применимость к иностранному отправителю — нет данных, допускать «применим» |
| **Канада** — CASL | opt-in + подразумеваемое согласие | **Только** если адрес «conspicuously published» без оговорки о нежелании + письмо релевантно роли; **бремя доказательства на отправителе** (s.13) | идентификация; адрес + контакт; отписка ≤10 рабочих дней; контакты валидны ≥60 дней; штраф до C$10 млн (организация)/C$1 млн (физлицо) за нарушение; применимо к письмам получателям в Канаде из другой страны | [ОФИЦ] закон (act current to 2026-09-21) + CRTC (выдержки) | допустимо при условиях и доказательствах; адреса из каталогов, запрещающих рассылки, не годятся |
| **Великобритания** — PECR/ICO | opt-in для физлиц; свободно для юрлиц | **Допустимо к corporate bodies**; sole traders и часть partnerships — как физлица (нужно согласие) | не скрывать личность; валидный адрес для отказа; вести do-not-email; GDPR для именных адресов; руководство ICO «under review» | [ОФИЦ] ICO | допустимо к ltd/LLP |
| **Франция** — CNIL | opt-out с условиями | **Допустимо при 3 условиях:** связь с проф. деятельностью получателя; информирование об источнике данных и цели; простой отказ | идентичность рекламодателя + способ отказа в каждом письме; пиксели — только с согласием (CNIL 2025) | [ОФИЦ] CNIL, страница 2026-06-10 | допустимо при условиях |
| **Германия** — UWG §7(2) Nr. 2 | opt-in и для B2B | **НЕЛЬЗЯ** без предварительного явного согласия | риск Abmahnung от получателя/конкурента; суды 2009 г. — «устарело (до 2025)» по дате, но не отменены | [ОФИЦ] закон; [ВТОР] юрблог 2026-02-04 | не слать |
| **Австрия** — TKG 2021 §174(3) | opt-in и для B2B | **НЕЛЬЗЯ** без предварительного согласия | штраф до €50 000 [ВТОР]; ведомство: против иностранных отправителей преследование «nicht Erfolg versprechend» | [ОФИЦ] RIS + ведомство; сумма штрафа [ВТОР] | не слать |
| Прочие страны ЕС | по национальному праву (ePrivacy Art. 13(3),(5)) | **нет данных** — обзоры противоречат (S46) | — | [ВТОР] | до проверки юристом — не слать |
| **Украина** (страна отправителя) | opt-out (ЗУ «Про електронну комерцію» ст. 10) + запрет «масового» спама (ЗУ про ел. комунікації ст. 120) | допустимо при возможности отказаться; не «масово» | идентификация; відомості по ст. 7 (название/ПІБ, адрес, email, код) | ст. 10 — [ОФИЦ]; ст. 120 — [ВТОР] | вторичный риск для отправки за рубеж |

### 4.2 Слой GDPR (получатель в ЕС; поверх ePrivacy)
- **Территория, Art. 3(2):** GDPR применим к обработке данных субъектов в ЕС оператором вне ЕС, если обработка связана с «offering of goods or services… to such data subjects in the Union». Прямое письмо с предложением услуги основателю в ЕС — вероятно подпадает [ОЦЕНКА; нужен юрист]. [ОФИЦ S41]
- **Основание:** Art. 6(1)(f) + Recital 47 («processing… for direct marketing purposes may be regarded as carried out for a legitimate interest») — **но** это не заменяет национальное правило ePrivacy о согласии там, где оно есть (GDPR Art. 95; вторичные источники ссылаются на EDPB 1/2024 — финальный статус «нет данных»). [ОФИЦ S41 / ВТОР S46]
- **Art. 14** (данные не от субъекта): к моменту первого сообщения (14(3)(b)) сообщить: контролёр и контакты, цели и основание (+ какой именно legitimate interest), категории данных, получатели, срок хранения, права (доступ/исправление/удаление/возражение), право жалобы, **источник данных**. [ОФИЦ S41]
- **Art. 21(2)–(4):** право возражать против direct marketing; после возражения данные для этой цели больше не обрабатываются; право должно быть «explicitly brought to the attention… at the latest at the time of the first communication… clearly and separately». [ОФИЦ S41]
- **Art. 27:** контролёр вне ЕС при Art. 3(2) назначает представителя в ЕС, кроме «occasional» обработки без риска; относится ли регулярная малая рассылка к «occasional» — **нет данных/нужен юрист**. [ОФИЦ S41]
- **Пиксели/трекинг:** EDPB 2/2023 п.47–51 — tracking pixel в письме подпадает под Art. 5(3) ePrivacy; CNIL 2025: пиксели для замера открытий требуют согласия. SendGrid запрещает то же. [ОФИЦ S42, S26]

### 4.3 Минимальное обязательное содержание КАЖДОГО письма (по закону)

| Элемент | США | Канада | ЕС / UK / FR / DE / AT | Украина |
|---|---|---|---|---|
| Правдивые From/Reply-To/routing | обязательно §7704(a)(1) | идентификация обязательна s.6(2)(a) | «disguise or conceal the identity» запрещено (ePrivacy Art. 13(4); UWG §7(2) Nr. 3; TKG §174(5)) | — |
| Правдивая тема | обязательно §7704(a)(2) | не в s.6 (др. нормы — не проверял) | нет данных по первичке | — |
| Пометка «реклама/предложение» | обязательно §7704(a)(5)(A)(i) (кроме случая prior affirmative consent) | — | нет данных по первичке (через Art. 13(4)→ст. 6 Directive 2000/31/EC) | обязательно (ст. 10(4)) |
| Название отправителя / от чьего имени | через «From» | обязательно | GDPR Art. 14(1)(a); FR: «préciser l’identité de l’annonceur» | ст. 7 |
| Физический адрес | обязательно («valid physical postal address») | обязательно: mailing address + телефон/email/сайт | GDPR — контакты контролёра; DE/AT — Impressum-нормы не проверял | ст. 7: місцезнаходження |
| Рабочий отказ | ≥30 дней; ≤10 раб. дней; бесплатно | ≥60 дней; ≤10 раб. дней; тем же каналом | «valid address to which the recipient may send a request that such communications cease» (Art. 13(4)); FR: «moyen simple de s’opposer» | ч. 3 ст. 10 |
| Уведомление Art. 14 + явное Art. 21(4) | — | — | **обязательно** к первому письму | — |
| Без трекинг-пикселей | не регулируется (первичку не искал) | нет данных | **да** без согласия | — |
| Доказательства (источник/релевантность/основание) | рекомендуется | **обязательно в споре** (s.13; список CRTC) | DE: бремя доказать согласие на рекламодателе (IHK); GDPR — подтверждение основания [ОЦЕНКА] | — |

---

## 5. Warm-up: нужен ли при 2–5 писем/день

- **Определения:** *реальный рэмп* — малый стабильный объём реальных 1:1-писем без всплесков; *синтетический прогрев* — сервис/пул ящиков, обменивающихся письмами с автооткрытиями/ответами/«not spam».
- **Реальный рэмп — да, всегда (рекомендация Google):** «Send email at a consistent rate. Avoid sending email in bursts.» «Start with a low sending volume to engaged users, and slowly increase the volume over time.» «Avoid introducing sudden volume spikes if you do not have a history of sending large volumes.» При 2–5/день это выполняется само, если не копить письма и не рассылать «пачкой». [ОФИЦ S1]
- **Синтетический прогрев/сервис — при 2–5/день НЕ нужен и рискован** [ОЦЕНКА]. Основания: (1) независимые источники сходятся: Resend (2026-09-30; ESP, источник заинтересован): «Legitimate senders do not need a warmup service»; WillItInbox (2026-08-02): имитация открытий/ответов «does not build transferable reputation — and in 2026 it can actively get you flagged»; (2) **M3AAWG, Position on Cold Email (11.2025):** «artificially simulate subscriber engagement… are not acceptable in any manner»; (3) **Spamhaus (2025-06-19):** «Using warmup tools to spread traffic across multiple platforms» и «Interacting with emails to fake engagement» — признаки спама; (4) **Validity Heatwave (2026-09-03):** blocklist доменов с «synthetic warming» и «active cold outreach», >1 млн доменов, сигнал передан партнёрам (Comcast, Proofpoint, Spamhaus, SURBL — «using or evaluating»); Al Iverson (2026-09-09): у клиентов после «warming»/«outreach»-сервисов репутация «actually worse than when they started»; нет подтверждения, что Google/Microsoft используют Heatwave; (5) Google якобы потребовал от GMass закрыть прогрев (2023, вендор — «устарело (до 2025)»), официального подтверждения нет. [S32–S37]
- **Вендоры «за» прогрев — источник заинтересован** (EmailCloud, Litemail, MailStrike, Winnr и др.): расписания стартуют с **10–30 писем/день на ящик**, на 3–8 недель — наш объём 2–5/день ниже первой ступени любого из них [ОЦЕНКА].
- **Встроенный прогрев в cold-платформах** (Instantly «Unlimited Email Warmup», lemlist lemwarm, Smartlead «unlimited email warm-up») — именно тот класс, на который нацелены M3AAWG/Spamhaus/Heatwave. [S28–S30]
- **Что нормально ожидать:** Iverson (2025-02-05, про ESP-объёмы): «It is actually not uncommon to experience some spam folder placement during the warming process… at Microsoft in that first week»; на стабилизацию — «five to eight weeks, even for generally good senders» [независимый эксперт, объёмы не наши].
- **Нет данных:** возраст/история домена nightloom; сколько недель до стабилизации при 2–5/день; независимых замеров эффекта прогрева на малом объёме.

---

## 6. Ожидаемый inbox placement и главные спам-риски [ОЦЕНКА]

**Оценка:** доля первых писем во «Входящих» **≈ 80–90%** для персональных простых текстовых 1:1 с корректными SPF/DKIM/DMARC, ящик Workspace/M365 на своём домене, без трекинга/редиректов, проверенные адреса. Gmail/Workspace-получатели ≈ 85–95%; получатели за Microsoft/Proofpoint-подобными фильтрами ≈ 70–85%. Остаток — спам/карантин/тихий отказ. Неопределённость ±10 п.п.

Обоснование (одна строка): нижняя граница ≈ Validity 2026 для корпоративных фильтров 79,0% и хостинга (O365+Google Apps) 83,0%, верхняя ≈ Validity для Gmail 89,8% (глобально 87,2%; Microsoft 77,4%) — **пересказ Geysera 2026-03-15, [ВТОР]; Validity — вендор**; вендорские cold-цифры 95–96% (Saleshandy, Litemail) считаю завышенными; у разрешённой почты уже ~87%, у cold «typically performs much worse» (SenderReputation, вендор). Независимых измерений на 2–5/день нет; Postmaster, вероятно, пуст; измерить можно только seed-тестом и по ответам/отбивкам.

**Главные спам-риски (по убыванию) [ОЦЕНКА]:**
1. **Жалоба на спам на крошечной выборке** — 1 жалоба на ~100 писем/мес = 1% (порог 0,3%, цель <0,1%); Google: жалобы снижают репутацию домена. Эффект на малом объёме — нет данных. [S1]
2. **Отбивки/«угаданные» адреса/спам-ловушки** — пороги ESP: Resend bounce <4% (≈1 из 25), Postmark <10%, Mailgun ≤5%; автоподбор адресов — отягчающее нарушение CAN-SPAM. [S22–S25, S39]
3. **Шаблонность и контент:** Spamhaus — «the same templates being duplicated and sent at scale»; правила Google: не использовать `Re:/Fwd:` в теме без реального ответа, не прятать контент, видимые понятные ссылки. [S33, S1]
4. **Cold-платформы, пулы прогрева, множество доменов/ящиков, lookalike-домены** — прямо названы M3AAWG/Spamhaus/Heatwave. [S32–S34]
5. **Заражение репутации основного домена** (Google считает по primary domain; bulk-статус постоянный) — если тот же домен несёт продуктовую/транзакционную почту; поведение Google по субдоменам — нет данных. [S2]
6. **Корпоративные фильтры получателей** (Microsoft/Proofpoint-класс) — самые низкие значения в бенчмарках. [S38]
7. **Юридические триггеры:** письма в DE/AT без согласия → Abmahnung; нарушение «anti-spam laws» — основание для санкций по Gmail Program Policies. [S9, S43, S44]
8. **Техгигиена:** выравнивание DKIM/From, формат RFC 5322; для M365-автоматизации — OAuth вместо Basic auth SMTP AUTH (с конца 2026). [S1, S19]

---

## 7. Открытые вопросы, «нет данных», нужен юрист

- **Нужен юрист:** (а) требуется ли представитель в ЕС по Art. 27 при регулярной малой рассылке; (б) применимость GDPR/ePrivacy к B2B-оферте юрлицу при именном адресе; (в) страны ЕС кроме DE/AT/FR/UK; (г) «valid physical postal address» и применимость CAN-SPAM к иностранному отправителю; (д) практика преследования малых иностранных отправителей в любой юрисдикции — нет данных.
- **Не подтверждено первичкой:** размер штрафа в Австрии (€50 000 — Scrutor, [ВТОР]); финальный статус EDPB 1/2024; EDPB 3/2018 (читал только пересказы); ст. 120 ЗУ «Про електронні комунікації» (читал вторично); актуальность старых BGH-решений (2009) — «устарело (до 2025)».
- **Противоречия источников:** Microsoft (дата перехода к отказу, S14); Google (даты Less Secure Apps: 2025-03-14 vs 2025-05-01); обзоры по странам ЕС (b2bdataindex vs остальные); число доменов в Heatwave (>1M vs >1,2M).
- **Нет данных:** числовой порог Postmaster Tools; как Microsoft считает порог 5 000 в спорных случаях; цены SendGrid (платные), Zoho (официальные), Exchange Online Plan 1 (официальные); официальное заявление Google о сервисах прогрева; статус реформы ePrivacy/«Digital Omnibus» (не проверялся).
- **Объём работы:** ≈43 поисковых запроса + ≈39 загрузок страниц + ≈35 curl-загрузок первичных текстов — больше ориентира 10–18; сделано сознательно, чтобы брать цитаты из полного текста ToS/законов.

### Передаточные заметки для других осей
- **Ось 5 (контакты):** CAN-SPAM §7704(b)(1) — автоскрейпинг адресов и подбор перестановок = отягчающее нарушение; CASL — адреса из каталогов с запретом рассылок не «conspicuously published»; GDPR Art. 14(2)(f) — указать источник данных в первом письме; Spamhaus считает «scraping contacts from social media and business websites» признаком спама.
- **Ось 1/2 (площадки):** ToS площадок на использование контактов для рассылок здесь не проверялись.
- **Ось 7 (отдача):** множитель «доля во Входящих ≈ 0,8–0,9» [ОЦЕНКА]; reply-rate в этой оси не оценивался.

---

## 8. Ключевые источники (все открыты 2026-10-04, если не указано иное)

**Правила провайдеров:** Google sender guidelines — https://support.google.com/a/answer/81126 (S1); FAQ (Nov 2025 enforcement) — https://support.google.com/a/answer/14229414 (S2); Postmaster low-volume — https://support.google.com/mail/answer/9981691 (S3); DMARC — https://support.google.com/a/answer/10032169 (S4); Yahoo — https://senders.yahooinc.com/best-practices/ и /faqs/ (S12, S13); Microsoft Outlook high-volume (Apr 2025, upd. Apr 30, 2025) — https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730 (S14); 5.7.515 — https://support.microsoft.com/en-us/outlook/fix-ndr-error-550-5-7-515-in-outlook-com (S15); RFC 8058 — https://www.rfc-editor.org/rfc/rfc8058 (S21).

**Инфраструктура и ToS:** Workspace цены — https://workspace.google.com/pricing (S7); Workspace AUP — https://workspace.google.com/terms/use_policy/ (S8); Gmail Program Policies — https://www.google.com/gmail/about/policy/ (S9); Microsoft цены — https://www.microsoft.com/en-us/licensing/news/2026-m365-packaging-pricing-updates (S18); Exchange limits — https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits (S17); Resend AUP — https://resend.com/legal/acceptable-use (S22); Postmark ToS — https://postmarkapp.com/terms-of-service (S23); AWS AUP — https://aws.amazon.com/aup/ и SES — https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html (S24); Mailgun AUP — https://www.mailgun.com/legal/aup/ (S25); SendGrid/Twilio — https://www.twilio.com/en-us/legal/service-country-specific-terms/email (S26); Brevo — https://www.brevo.com/legal/antispampolicy/ (S27); Instantly — https://instantly.ai/terms и /pricing (S28); Smartlead — https://www.smartlead.ai/pricing и /new-terms-and-conditions (S29); lemlist — https://www.lemlist.com/pricing (S30); Zoho — https://www.zoho.com/mail/zohomail-pricing.html (S31).

**Прогрев/отрасль:** M3AAWG Position on Cold Email (Nov 2025) — https://www.m3aawg.org/sites/default/files/doc_files/m3aawg_position_on_cold_email.2025_0.pdf (S32); Spamhaus (2025-06-19) — https://www.spamhaus.org/resource-hub/spam/spamhaus-take-on-cold-emailing-aka-spam/ (S33); Heatwave — https://www.spamresource.com/2026/09/new-from-validity-heatwave-domain.html , https://martechedge.com/news/validity-launches-heatwave-to-flag-synthetic-email-warming , https://resend.com/blog/avoid-warmup-services (S34); GMass (2023-01-19, «устарело (до 2025)») — https://www.gmass.co/blog/warmup-shutting-down/ (S35); Iverson (2025-02-05) — https://www.spamresource.com/2025/02/ask-al-spam-folder-placement-during.html (S36); WillItInbox — https://willitinbox.com/blog/does-email-warmup-work (S37); бенчмарки — https://www.geysera.com/blog/email-marketing/email-deliverability-in-2026-the-numbers-behind-whether-your-emails-actually-arrive , https://winnr.app/blog/cold-email-deliverability-benchmarks-2026.html , https://senderreputation.org/blog/email-deliverability-benchmarks-2026-industry-data , https://www.saleshandy.com/blog/email-deliverability-statistics/ , https://litemail.ai/blog/cold-email-inbox-google-vs-microsoft-2026 (S38); вендорские расписания прогрева — https://emailcloud.com/guides/google-workspace-warmup/ , https://www.mailstrike.ai/warmup/google-workspace , https://litemail.ai/blog/email-warmup-google-workspace-complete-guide-2026 (S37, все «источник заинтересован»).

**Право:** FTC CAN-SPAM guide — https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business ; 15 USC §7704 — https://www.law.cornell.edu/uscode/text/15/7704 ; §7707 — https://www.law.cornell.edu/uscode/text/15/7707 (S39); CASL — https://laws-lois.justice.gc.ca/eng/acts/E-1.6/FullText.html ; CRTC FAQ — https://crtc.gc.ca/eng/com500/faq500.htm (выдержки) (S40); ePrivacy — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02002L0058-20091219 ; GDPR — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679 (S41); EDPB 2/2023 — https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf (S42); UWG §7 — https://www.gesetze-im-internet.de/uwg_2004/__7.html ; юрблог — https://www.anwalt.de/rechtstipps/cold-e-mails-im-b2b-der-groesste-irrtum-und-wann-werbung-per-mail-wirklich-verboten-ist-263230.html (S43); TKG §174 — https://www.ris.bka.gv.at/eli/bgbl/i/2021/190/P174/NOR40238632 ; ведомство — https://www.bmwkms.gv.at/themen/telekommunikation-post/telekommunikationsrecht-politik/oesterreich/unerbetene-nachrichten.html (S44); CNIL — https://www.cnil.fr/fr/communication-electronique-quelles-regles (2026-06-10) ; ICO — https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/ (S45); обзоры по ЕС (противоречивые) — theagency47.com, itsalesaas.com, b2bdataindex.com (S46); Украина — https://zakon.rada.gov.ua/laws/show/675-19 (ст. 10), https://urst.com.ua/pro_elektronni_komunikatsii/st-120 (ст. 120, [ВТОР]) (S47).
