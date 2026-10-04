# Ось 6 — Доставляемость и легальность cold email (RAW-дамп)

> Дата прогона и всех живых проверок: **2026-10-04**. Исследователь оси 6. Весь текст на русском; цитаты оставлены в оригинале (EN/DE/FR/UK) в кавычках.
> Это сырой дамп: источники, дословные цитаты, живые проверки с датой, противоречия и дыры. Дистиллят — `findings/6-email-delivery.md`.
> **Контекст исполнителя:** команда из Украины (бренд nightloom), 2–5 ПЕРСОНАЛЬНЫХ писем в день (≈40–100/мес), адресаты в основном US/EU. Это НЕ bulk (порог Google/Microsoft = 5 000/день).

## 0. Метод, пометки, оговорки

Пометки достоверности (по правилам прогона):
- **[ОФИЦ]** — первичный источник (страница провайдера / текст закона / регулятор), открыт вживую 2026-10-04.
- **[ВТОР]** — вторичный источник (юрфирма, новостной сайт, отраслевой блог) — использовать как ориентир, не как факт.
- **[ВЕНДОР]** — «источник заинтересован» (продаёт cold-email/прогрев/инфру или конкурирует) — цифры и обещания не принимать на веру.
- **[ОЦЕНКА]** — моя оценка с обоснованием в одну строку; данных нет.
- **«устарело (до 2025)»** — источник/редакция старше 2025 г.; указано отдельно, даже если страница всё ещё действует.
- **«нет данных»** — проверено, ответа не нашёл.

Инструменты: WebSearch/WebFetch (WebFetch отдаёт саммари малой моделью — ключевые цитаты я перепроверял по полному тексту), Exa web_fetch (полный текст страницы), curl через прокси + свой html→text (для ToS/AUP/законов — дословный текст). Часть страниц Google переехала на `knowledge.workspace.google.com` (301-редирект с `support.google.com/a/answer/...`).

Ограничения: страницы Microsoft (microsoft.com/…/compare-all-microsoft-365-business-products) блокируют автоматический User-Agent — цены Microsoft 365 взяты со страницы Microsoft Licensing (открылась). Страница `crtc.gc.ca/eng/com500/faq500.htm` отдала 403 через curl — цитаты CRTC взяты из результатов Exa (дословные выдержки) и дублируются текстом закона (laws-lois.justice.gc.ca), открытым целиком.

---

## 1. Реестр живых проверок (2026-10-04)

| ID | URL | Что получено | Способ | Примечание |
|---|---|---|---|---|
| S1 | https://support.google.com/a/answer/81126 | Email sender guidelines — полный текст | Exa + WebFetch | без видимой даты обновления; таблица «Sender requirements updates»: TLS — Dec. 2023 |
| S2 | https://support.google.com/a/answer/14229414 | Email sender guidelines FAQ — полный текст (в т.ч. заметка «Starting November 2025…») | Exa + WebFetch | [ОФИЦ] |
| S3 | https://support.google.com/mail/answer/9981691 | Set up Postmaster Tools | Exa | [ОФИЦ] про отсутствие данных при малом объёме |
| S4 | https://support.google.com/a/answer/10032169 | Set up DMARC (Workspace) | Exa | [ОФИЦ] |
| S5 | https://support.google.com/mail/answer/22839 | Лимиты Gmail (consumer) | Exa | [ОФИЦ] |
| S6 | https://knowledge.workspace.google.com/admin/gmail/gmail-sending-limits-in-google-workspace | Лимиты отправки Workspace | Exa + WebFetch | [ОФИЦ] |
| S7 | https://workspace.google.com/pricing | Цены Workspace | Exa | [ОФИЦ] |
| S8 | https://workspace.google.com/terms/use_policy/ | Google Cloud AUP (применимо к Workspace), «Last modified: October 13, 2025» | Exa | [ОФИЦ] |
| S9 | https://www.google.com/gmail/about/policy/ | Gmail Program Policies, «Last updated: Nov. 13, 2025» | Exa | [ОФИЦ] |
| S10 | https://knowledge.workspace.google.com/admin/gmail/spam-and-abuse-policy-in-gmail | Spam and abuse policy in Gmail | Exa | [ОФИЦ] |
| S11 | https://support.google.com/a/answer/14114704 | Переход с less secure apps на OAuth | Exa | [ОФИЦ] |
| S12 | https://senders.yahooinc.com/best-practices/ | Yahoo/AOL: требования к отправителям | Exa + WebFetch | [ОФИЦ] |
| S13 | https://senders.yahooinc.com/faqs/ | Yahoo/AOL FAQ | Exa + WebFetch | [ОФИЦ] |
| S14 | https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730 | Блог Microsoft: Outlook, high-volume senders; «Apr 02, 2025», «Updated Apr 30, 2025», Version 4.0 | Exa | [ОФИЦ] |
| S15 | https://support.microsoft.com/en-us/outlook/fix-ndr-error-550-5-7-515-in-outlook-com | Microsoft Support: ошибка 550 5.7.515, определение high-volume sender | Exa | [ОФИЦ] |
| S16 | learn.microsoft.com/en-us/answers/questions/5877426/… и techcommunity.microsoft.com/discussions/outlookgeneral/…/4498481 | Форумные темы 2026 про 5.7.515 | Exa | [ВТОР] (пользовательские сообщения + AI-ответ Q&A) |
| S17 | https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits | Лимиты Exchange Online (ms.date 2026-04-07, updated_at 2026-09-09) | WebFetch→файл | [ОФИЦ] |
| S18 | https://www.microsoft.com/en-us/licensing/news/2026-m365-packaging-pricing-updates | Цены Microsoft 365 с 2026-07-01 (страница от Feb 16, 2026) | Exa | [ОФИЦ] |
| S19 | https://techcommunity.microsoft.com/blog/exchange/updated-exchange-online-smtp-auth-basic-authentication-deprecation-timeline/4489835 | Обновлённый график отключения Basic auth для SMTP AUTH (Jan 27, 2026) | Exa (поиск) | [ОФИЦ] |
| S20 | https://legal.office.com/en-US/docid12 (AUP, «Last updated: February 2011») и https://support.microsoft.com/en-us/office/microsoft-anti-spam-policy | AUP и Anti-Spam Policy Microsoft | Exa | [ОФИЦ]; AUP — «устарело (до 2025)» по дате |
| S21 | https://www.rfc-editor.org/rfc/rfc8058.txt | RFC 8058 (Standards Track, January 2017) | curl | [ОФИЦ] |
| S22 | https://resend.com/legal/acceptable-use ; https://resend.com/legal/terms-of-service ; https://resend.com/pricing | Resend AUP («Last update: August 27th, 2026»), ToS, цены | curl→text | [ОФИЦ] |
| S23 | https://postmarkapp.com/terms-of-service ; https://postmarkapp.com/pricing | Postmark ToS («Effective December 10, 2024»), цены | curl→text | [ОФИЦ] |
| S24 | https://aws.amazon.com/aup/ («Last Updated: July 1, 2021»); https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html ; https://docs.aws.amazon.com/ses/latest/dg/reputationdashboardmessages.html ; https://aws.amazon.com/ses/pricing/ ; https://aws.amazon.com/ses/faqs/ | AWS AUP, SES: production access, reputation, цены, FAQ | curl→text + Exa | [ОФИЦ]; AUP — «устарело (до 2025)» по дате |
| S25 | https://www.mailgun.com/legal/aup/ («Last revised January 16, 2023»); https://www.mailgun.com/pricing/ | Mailgun (Sinch) AUP, цены | curl→text | [ОФИЦ]; AUP — «устарело (до 2025)» по дате, но это действующая редакция на странице |
| S26 | https://www.twilio.com/en-us/legal/service-country-specific-terms/email («Last Updated: April 9, 2026»); https://support.sendgrid.com/hc/en-us/articles/4404316003483-Email-Prohibited-Content-Types-and-Uses | Twilio SendGrid Email Policy | curl→text | [ОФИЦ] |
| S27 | https://www.brevo.com/legal/antispampolicy/ ; https://www.brevo.com/legal/termsofuse/ ; https://www.brevo.com/pricing/ | Brevo Anti-spam policy (на странице «© Brevo 2026»), ToS, free-план | curl→text | [ОФИЦ] |
| S28 | https://instantly.ai/pricing ; https://instantly.ai/terms («Last Updated: September 22, 2026») | Instantly: цены и ToS | Exa + curl→text | [ВЕНДОР] по ценам; ToS — [ОФИЦ] |
| S29 | https://www.smartlead.ai/pricing ; https://www.smartlead.ai/new-terms-and-conditions ; https://www.smartlead.ai/fair-use-policy | Smartlead: цены, Terms, Fair Use | Exa | [ВЕНДОР]/[ОФИЦ] |
| S30 | https://www.lemlist.com/pricing ; https://www.lemlist.com/legal/terms | lemlist: цены, Terms | Exa | [ВЕНДОР]/[ОФИЦ] |
| S31 | https://www.zoho.com/mail/zohomail-pricing.html ; https://www.zoho.com/mail/help/adminconsole/subscription.html | Zoho Mail: планы | curl→text + Exa | цены в HTML не отрисованы; цифры из [ВТОР] (LetterDuck, «verified August 7, 2026»; конкурент) |
| S32 | https://www.m3aawg.org/sites/default/files/doc_files/m3aawg_position_on_cold_email.2025_0.pdf | M3AAWG Position on Cold Email, November 2025, v1.0 | Exa | [ОФИЦ] (отраслевая ассоциация anti-abuse) |
| S33 | https://www.spamhaus.org/resource-hub/spam/spamhaus-take-on-cold-emailing-aka-spam/ | Spamhaus: «Spamhaus' take on Cold Emailing…AKA spam», June 19, 2025 | Exa | [ОФИЦ] (позиция Spamhaus) |
| S34 | https://www.spamresource.com/2026/09/new-from-validity-heatwave-domain.html ; https://martechedge.com/news/validity-launches-heatwave-to-flag-synthetic-email-warming ; https://www.mediapost.com/publications/article/417701/… ; https://resend.com/blog/avoid-warmup-services | Validity Heatwave Domain Blocklist (анонс 2026-09-03/04) и комментарии | Exa | Spamresource — независимый эксперт; MarTech/MediaPost — пересказ пресс-релиза Validity |
| S35 | https://www.gmass.co/blog/warmup-shutting-down/ | GMass: закрытие warmup из-за Google (2023-01-19) | Exa | «устарело (до 2025)»; [ВЕНДОР] (GMass) |
| S36 | https://www.spamresource.com/2025/02/ask-al-spam-folder-placement-during.html | Al Iverson о прогреве IP/домена (2025-02-05) | Exa | независимый эксперт |
| S37 | https://willitinbox.com/blog/does-email-warmup-work (2026-08-02); https://mailivery.io/blog/does-email-warmup-work (2026-03-13); https://emailcloud.com/guides/google-workspace-warmup/ ; litemail.ai ; cufinder.io | Блоги про прогрев | Exa | WillItInbox — тест-компания, «не продаёт warmup»; Mailivery/EmailCloud/Litemail — [ВЕНДОР] |
| S38 | geysera.com (2026-03-15, ссылается на Validity 2026); winnr.app (2026-03-17); saleshandy.com; getgenesis.app (2026-02-10); senderreputation.org (2026-04-19); leadyra.com | Бенчмарки inbox placement | Exa | почти всё [ВЕНДОР]; Validity — через [ВТОР] пересказ |
| S39 | https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business ; https://www.law.cornell.edu/uscode/text/15/7704 ; …/7707 | FTC-гайд и текст закона CAN-SPAM | Exa + curl→text | [ОФИЦ] |
| S40 | https://laws-lois.justice.gc.ca/eng/acts/E-1.6/FullText.html ; https://crtc.gc.ca/eng/com500/faq500.htm ; https://crtc.gc.ca/eng/com500/guide.htm ; https://www.fightspam.gc.ca/eic/site/030.nsf/eng/00008.html ; https://competition-bureau.canada.ca/…/frequently-asked-questions-about-canadas-anti-spam-legislation | CASL: закон, FAQ CRTC, руководства | curl + Exa | [ОФИЦ] |
| S41 | https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02002L0058-20091219 ; https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679 | Директива 2002/58/EC (ePrivacy) и GDPR — полные тексты | curl→text | [ОФИЦ] |
| S42 | EDPB Guidelines 2/2023 (v2.0, adopted 7 Oct 2024); EDPB Guidelines 3/2018; CNIL «Recommendation on tracking pixels in emails» (консультация 12.06–24.07.2025); EDPB Guidelines 1/2024 (консультация до 2024-11-20) | Пиксели, территориальный охват, legitimate interest | Exa | [ОФИЦ]; статус финальной версии 1/2024 — нет данных |
| S43 | https://www.gesetze-im-internet.de/uwg_2004/__7.html ; BGH I ZR 218/07 (20.05.2009) ; BGH I ZR 201/07 (10.12.2009) ; https://www.anwalt.de/rechtstipps/cold-e-mails-im-b2b-der-groesste-irrtum-und-wann-werbung-per-mail-wirklich-verboten-ist-263230.html (2026-02-04) ; IHK Ostwestfalen | Германия: UWG §7 | curl + Exa | закон — [ОФИЦ]; BGH — «устарело (до 2025)» по дате; юрблоги — [ВТОР] |
| S44 | https://www.ris.bka.gv.at/eli/bgbl/i/2021/190/P174/NOR40238632 ; https://www.bmwkms.gv.at/…/unerbetene-nachrichten.html ; https://scrutor.at/ratgeber/email-werbung-oesterreich | Австрия: TKG 2021 §174 | Exa | закон и ведомство — [ОФИЦ]; размер штрафа — [ВТОР] |
| S45 | https://www.cnil.fr/fr/communication-electronique-quelles-regles (2026-06-10) ; https://www.cnil.fr/fr/les-regles-dor-de-la-prospection-par-courrier-electronique-0 ; https://ico.org.uk/…/electronic-mail-marketing/ | Франция (CNIL), Великобритания (ICO) | Exa | [ОФИЦ] |
| S46 | theagency47.com, inventalpartners.com, ripeleads.eu, itsalesaas.com, storchak.eu, warbble.com, b2bdataindex.com | Обзоры «cold email по странам ЕС» | Exa | [ВТОР]/[ВЕНДОР]; между собой противоречат (см. §7) |
| S47 | https://zakon.rada.gov.ua/laws/show/675-19/print ; urst.com.ua (ст. 120 ЗУ «Про електронні комунікації»); zakononline.ua | Украина: закон об электронной коммерции ст. 10; закон об электронных коммуникациях | curl + Exa | ст. 10 — [ОФИЦ]; ст. 120 — [ВТОР] |

---

## 2. Требования почтовых провайдеров

### 2.1 Google / Gmail (получатель — личные @gmail.com / @googlemail.com)

**Область действия** (S1): «Starting in 2024, email senders must meet the requirements described here to send email to Gmail personal accounts. A personal Gmail account is an account that ends in @gmail.com or @googlemail.com.»
S2: «The Email sender guidelines don’t apply to messages sent to Google Workspace accounts. Sender requirements and Google enforcement apply only when sending email to personal Gmail accounts.» → для адресатов на корпоративных доменах, хостящихся в Google Workspace, формальные требования Gmail (SPF/DKIM/DMARC/unsub) не применяются как «правила»; фильтрация идёт по общим антиспам-механизмам. (Это важно: B2B-адресаты чаще на Workspace/M365, не на @gmail.com.)

**Требования ко ВСЕМ отправителям** (S1) — «Starting February 1, 2024, all email senders who send email to Gmail accounts must meet the requirements in this section.»:
- «Set up SPF or DKIM email authentication for your sending domains.» (т.е. хотя бы одно из двух)
- «Ensure that sending domains or IPs have valid forward and reverse DNS records, also referred to as PTR records.»
- «Use a TLS connection for transmitting email.»
- «Keep spam rates reported in Postmaster Tools below 0.3%.»
- «Format messages according to the Internet Message Format standard, RFC 5322.»
- «Don’t impersonate Gmail From: headers.»

**Дополнительно для отправителей >5 000 сообщений/день** (S1) — «Starting February 1, 2024, email senders who send more than 5,000 messages per day to Gmail accounts must meet the requirements in this section.»:
- «Set up SPF and DKIM email authentication for your domain.»
- «Set up DMARC email authentication for your sending domain. Your DMARC enforcement policy can be set to none.»
- «For direct email, the domain in the sender's From: header must be aligned with either the SPF domain or the DKIM domain. This is required to pass DMARC alignment.»
- «Marketing messages and subscribed messages must support one-click unsubscribe, and include a clearly visible unsubscribe link in the message body.»
- Spam rate: «below 0.30%».

**Определение bulk** (S2): «A bulk sender is any email sender that sends close to 5,000 messages or more to personal Gmail accounts within a 24-hour period. Messages sent from the same primary domain count toward the 5,000 limit.» «Senders who meet the above criteria at least once are permanently considered bulk senders.» «Bulk sender status doesn’t have an expiration date. Email senders that have been classified as bulk senders are permanently classified as such.»
→ Следствие для nightloom: счёт идёт по **primary domain** (поддомены суммируются). Если основной домен nightloom когда-либо отправит ≥~5 000 писем/день на Gmail (например, продуктовая/транзакционная почта), он навсегда становится bulk.

**Ключевое про «рекомендуем всегда»** (S1): «To improve email delivery, we recommend that you always set up SPF, DKIM, and DMARC for your domains. Make sure you're meeting the minimum authentication requirements described on this page. Messages that aren’t authenticated with these methods might be marked as spam or rejected with a 5.7.26 error.»
S1: «If you don’t meet the requirements described in this article, your email might not be delivered as expected, or might be marked as spam.»

**DKIM-ключ** (S1): «Sending to personal Gmail accounts requires a DKIM key of 1024 bits or longer. For security reasons, we recommend using a 2048-bit key if your domain provider supports this.»

**DMARC** (S1, S4): «DMARC tells receiving servers what to do with your messages that don’t pass SPF or DKIM.» «To pass DMARC authentication, messages must be authenticated by SPF or DKIM, or both. The authenticating domain must be the same domain that appears in the message From: header.» S4: «When you start using DMARC, we recommend setting the policy option (p) to none. … Over time, change the receiver policy to quarantine (or reject).» «Allow 48 hours after setting up SPF and/or DKIM before setting up DMARC.» «If you don't set up SPF and/or DKIM before enabling DMARC, messages sent from your domain will probably have delivery issues.»

**Spam rate** (S2): «Spam rate is calculated daily. To help ensure messages are delivered as expected, senders should keep their spam rate below 0.1% and should prevent spam rates from ever reaching 0.3% or higher.» «Even today, user-reported spam rates greater than 0.1% have a negative impact on email inbox delivery for bulk senders.» «Beginning June 2024, bulk senders with a user-reported spam rate greater than 0.3% will be ineligible for mitigation.»

**Unsubscribe** (S2): «One-click unsubscribe is required only for marketing and promotional messages. Transactional messages are excluded from this requirement.» «We recommend that you fulfill unsubscribe requests within 48 hours.» «We don’t automatically reject messages or mark messages as spam when they don’t meet the one-click unsubscribe requirements… However, unwanted messages that don’t use one-click unsubscribe are more likely to be reported as spam by recipients.» «One-click unsubscribe also helps you maintain a low spam rate, which improves message delivery.» «Other types of one-click unsubscribe, such as mailto and URL unsubscribe links, don’t meet our one-click unsubscribe requirement.»

**Энфорсмент** (S2):
- «Starting November 2025, Gmail is ramping up its enforcement on non-compliant traffic. Messages that fail to meet the email sender requirements will experience disruptions, including temporary and permanent rejections.»
- Таблица «Sender requirement issue | Enforcement»: From/auth не выровнены; нет и SPF, и DKIM; нет forward/reverse DNS; нет TLS; не RFC 5322 → «Temporary or Permanent Failure codes, or spam foldering». Spam rate >0.3%; нет DMARC (min p=none); нет one-click unsubscribe; unsubscribe не исполнен за 48 часов → «Delivery support or mitigations unavailable».
- Коды ошибок: 4.7.23/4.7.27/4.7.29/4.7.30/4.7.31/4.7.32 (rate-limit), 5.7.25/5.7.27/5.7.29/5.7.30 (блок); 5.7.26 (неаутентифицировано, S1).
- Новые домены: «A new domain is defined as any domain that hasn’t sent more than 5,000 emails a day to personal Gmail accounts since January 1, 2024. … the enforcement progression for new domains will be on an accelerated timetable.»
- Независимая оценка (Spamresource, 2025-11-06, [ВТОР], пересказ через WebFetch): «No new requirements were introduced»; рост 4xx/5xx для non-compliant; «If you're already a great email sender, fully compliant…nothing should change.»

**Postmaster Tools и малый объём** (S3): «I don’t see the expected data for my domain in one or more dashboards. — Data might be missing if the total number of messages for a given day is too low. This is to protect users' privacy.» Числовой порог Google **не публикует** (нет данных). [ВТОР/ВЕНДОР] suped.com утверждает «~100 писем/день на Gmail для domain reputation» — не подтверждено Google.
→ При 2–5 письмах/день Postmaster Tools, вероятно, будет пустым (вывод из формулировки Google; [ОЦЕНКА]).

**Практики отправки, прямо описанные Google** (S1) — релевантны малому объёму:
- «Messages sent from an address in the recipient’s contacts are less likely to be marked as spam.»
- «If messages from your domain are frequently reported as spam, future messages from you are more likely to be marked as spam. Over time, user spam reports can lower your domain’s reputation.»
- «Don't purchase email addresses from other companies.» «Don't send messages to people who didn't sign up to get messages from you. These recipients might mark your messages as spam, and future messages to these recipients will be marked as spam.» (контекст — списки рассылок; к cold-аутричу применимо по смыслу).
- Формат: «From: headers should include only one email address.» «Make sure every message includes a valid Message-ID.» «Message headers and message content should be accurate, and not misleading or deceptive.» «don’t send messages with subject lines starting with Re: or Fwd: unless the messages are actual replies or forwards» «Don’t use HTML and CSS to hide content in your messages. Hiding content might cause messages to be marked as spam.» «Web links in the message body should be visible and easy to understand.» «Sender information should be clear and visible.»
- Display name: «Sender display names should be used exclusively to identify the sender.» «The display name should not include the recipient’s name and should not imply a message reply or threaded conversation.»
- Нарастание объёма: «Send email at a consistent rate. Avoid sending email in bursts.» «Start with a low sending volume to engaged users, and slowly increase the volume over time.» «Avoid introducing sudden volume spikes if you do not have a history of sending large volumes.»
- Разные категории писем: «Messages of the same category should have the same From: email address.» «Ideally, send all messages from the same IP address.»

**Gmail Program Policies** (S9, «Last updated: Nov. 13, 2025») — «Spam & bulk mail: Don’t use Gmail to distribute spam or unsolicited commercial mail. You are not allowed to use Gmail to send email in violation of the CAN-SPAM Act or other anti-spam laws; to send unauthorized email via open, third-party servers; or to distribute the email addresses of any person without their consent. You are not allowed to automate the Gmail interface, whether to send, delete, or filter emails, in a manner that misleads or deceives users. Please keep in mind that your definition of “unsolicited” or “unwanted” mail may differ from your email recipients’ perception. Exercise judgment when sending email to a large number of recipients… When Gmail users mark emails as spam, it increases the likelihood that future messages you send will also be classified as spam by our anti-abuse systems.»
**Workspace AUP** (S8, «Last modified: October 13, 2025»): запрещено использовать сервисы «to generate, distribute, publish or facilitate unsolicited mass email, promotions, advertisements, or other solicitations (“spam”)». «Your failure to comply with the AUP may result in suspension or termination».
**Spam and abuse policy in Gmail** (S10): «When you sign up for a Gmail account, you agree not to use the account to send spam… If the problem is domain-wide, we reserve the right to suspend the entire account and deny administrator access to all the Google Workspace services.»
→ Формально: AUP Workspace запрещает «unsolicited MASS email»; Gmail Program Policies — шире: «unsolicited commercial mail». Персональное единичное cold-письмо — серая зона (не «mass», но «commercial»). Реальный триггер — жалобы получателей и паттерны, а не сам факт cold.

**Лимиты Gmail consumer** (S5): «more than 500 recipients in a single email and or more than 500 emails sent in a day».
**Лимиты Workspace** (S6): «Maximum messages per day — Daily sending limit per user account: 2,000; 1,500 for mail merge; 500 for trial accounts»; «Recipients per message: 2,000 total per message (maximum of 500 external recipients)»; «External recipients per day: 3,000»; «Unique recipients per day: 3,000; 2,000 external; 500 external for trial accounts». «Sending limits can change without notice. Limits per day are applied over a rolling 24-hour period.» Триал: «limits aren’t increased during the free trial period»; после конвертации «your account sending limits automatically increase when your domain has cumulatively paid at least $100 USD (or equivalent)… It can take up to 75 days after meeting this payment threshold».
**Доступ по SMTP/IMAP** (S11): с 2025-03-14 «CalDAV, CardDAV, IMAP, SMTP, and POP will no longer work with legacy passwords (basic authentication)»; нужен OAuth, исключение — app passwords (при 2FA). (Обновление Workspace Updates: «Less Secure Apps will no longer be supported as of May 1, 2025» — по цитате из блога workspaceupdates.googleblog.com; в самой support-статье дата 14 марта 2025 — расхождение дат внутри Google, нет данных, какая окончательная.)

### 2.2 Yahoo / AOL (S12, S13)

Требования ко **всем** отправителям (S12): «Authenticate your mail — Implement SPF or DKIM at a minimum»; «Keep your spam rate below 0.3%»; «Have a valid forward and reverse DNS record for your sending IPs»; «Comply with RFCs 5321 and 5322».
Для **bulk** (S12): «Implement both SPF & DKIM»; «Publish a valid DMARC policy with at least p=none - DMARC must pass» («rua» рекомендуется; relaxed alignment допустим); «Ensure the domain in the From: header is aligned with either the SPF domain or the DKIM domain»; «Implement a functioning list-unsubscribe header, which supports one-click unsubscribe for marketing and subscribed messages» («The Post (RFC 8058) method is highly recommended; The mail-to: method is acceptable»); «Have a clearly visible unsubscribe link in the email body»; «Honor unsubscribes within 2 days»; spam rate <0.3% («Spam rate is calculated in our system based on mail delivered to the inbox»).
**Порог bulk НЕ задан** (S13): «A “bulk” sender is classified as an email sender sending a significant volume of mail. We will not specify a volume threshold.» «For the purposes of enforcement, a “sender” is viewed at the authenticated domain or From header domain level. However, we will use all of the information available (content, IP, etc.) to review sender compliance.»
DMARC (S12/S13): «Yahoo strongly urges all senders to publish a DMARC policy for each domain that sends mail. For some senders, this is now a requirement.»
DKIM-ключ (S13): «We require a DKIM key length of 1024 bits or greater. We recommend a 2048-bit key length.»
Энфорсмент (S13): «Enforcement will begin in February 2024, and we will continue to gradually roll out enforcement»; List-Unsubscribe — июнь 2024. «If you do not meet the requirements, your mail may be sent to the spam folder or rejected. If mail is rejected, we will return a specific error code.»
One-click только для promo (S13): «No, one-click unsubscribe is only required for promotional/marketing messages.» + «If you see high complaint rates for mail that is not legally required to have an unsubscribe link, it may be in your best interest to include a one-click unsubscribe option to reduce the chance of delivery issues».
Что реально кладёт в спам (S13): «We usually do not redirect mail to the Spam folder for poor reputation alone. It can be a combination of reputation with other poor mailing characteristics like: Obfuscation of URL's in body of mail; IP's which do not have a FQDN in their rDNS; Not RFC compliant».
Разделение потоков (S12): «Don't send bulk/marketing email from the same IPs you use to send user mail, transactional mail, alerts, etc. Each IP and DKIM domain has a reputation… By segregating your email according to function, you help ensure that your mail receives the best delivery possible.»
CAN-SPAM (S12): «Regardless of where in the world you're sending your mail, make sure you adhere to the requirements stipulated by the CAN-SPAM Act.»
Новые инструменты: Yahoo Insights Dashboard (октябрь 2025) — [ВТОР], в этом прогоне не перепроверялось.

### 2.3 Microsoft — Outlook.com / Hotmail / Live / MSN (consumer)

**Блог Microsoft** (S14; «Apr 02, 2025», «Updated Apr 30, 2025», Version 4.0): «This applies to Outlook.com - our consumer service, which is supporting hotmail.com live.com and outlook.com consumer domain addresses.» «we’re announcing new requirements and best practices designed to strengthen email authentication for domains sending more than 5,000 emails per day.»
- «For domains sending over 5,000 emails per day, Outlook will soon require compliance with SPF, DKIM, DMARC. Non‐compliant messages will first be routed to Junk. If issues remain unresolved, they may eventually be rejected.»
- SPF «Must Pass for the sending domain»; DKIM «Must Pass»; DMARC «At least p=none and align with either SPF or DKIM (preferably both).»
- Гигиена («Large senders should also adopt…»): валидный From/Reply-To, «Functional Unsubscribe Links», «List Hygiene & Bounce Management», «Transparent Mailing Practices: Use accurate subject lines, avoid deceptive headers, and ensure your recipients have consented to receive your messages.» «Outlook reserves the right to take negative action, including filtering or blocking—against non‐compliant senders».
- **Внутреннее противоречие страницы:** абзац апдейта 30 апреля: «we have made a decision to reject messages that don't pass the required authentication requirements… designated as “550; 5.7.515 Access denied, sending domain [SendingDomain] does not meet the required authentication level.” This change will state taking effect on May 5th as originally stated.» — а следующий абзац (из первой версии) говорит: «After May 5th, 2025, Outlook will begin routing messages from high volume non‐compliant domains to the Junk folder… NOTE: that in the future (date to be announced), non-compliant messages will be rejected». Дату «будущего отказа» Microsoft в этой странице не называет.
- FAQ: «Do I still need to do this if I send fewer than 5,000 emails/day? — While enforcement first targets large senders, all senders benefit from these best practices. Strong authentication protects your reputation.» «Will adding to safe senders list bypass the new enforcement? — No. Safe Sender list won’t be honored.» «If someone regularly reports my emails as spam despite authentication, what can I do? — Authentication ensures emails are from you, but user perception still matters. Review your content, frequency, and opt‐out process…» «If you use a 3rd‐party email vendor, do I still need SPF, DKIM, DMARC records in my domain DNS? — Yes.»
**Определение high-volume** (S15, Microsoft Support): «What defines a high volume (large) sender? You send 5,000 or more email messages to Microsoft consumer email services. and All of the messages use the same domain in the 5322.From address. After you reach this threshold, we expect all messages from senders in the domain to meet all of the following email authentication requirements: 1. Publish SPF and DKIM records… 2. Publish a DMARC record… For example: Hostname: _dmarc TXT value: v=DMARC1; p=none 3. Messages from senders in the domain must pass DMARC validation: The SPF and/or DKIM record (at least one) must align with… the domain in the 5322.From address.»
**Статус 2026 — только вторично:**
- [ВТОР, vendor-блоги senderreputation.org (2026-05-09), mailreach.co (2026-09-09)] утверждают, что к концу 2025 г. Microsoft перешёл на жёсткое отклонение (550 5.7.515) для неаутентифицированного bulk, а p=none «всё чаще смотрят с подозрением». Официального подтверждения новых дат в этом прогоне **не найдено**.
- [ВТОР, S16] Форумы 2026: отправитель с ~20–25 тыс. писем/день получает 550 5.7.515 при падении DKIM (2026-03-02); другой отправитель утверждает, что «daily volume is well below the 5,000-message threshold», но получает «550 5.7.515 - Access denied, banned sender» (2026-05-01; ответ — AI-генерированный и утверждает, что если домен когда-либо пересёк порог, требования действуют и при меньшем объёме — **не подтверждено официально**). Вывод: для малого объёма ошибка 5.7.515 в формальном определении не должна применяться, но реальные случаи с оспариваемым объёмом существуют → «нет данных», как именно Microsoft считает порог.
**Корпоративные ящики (M365/Exchange Online Protection):** отдельная фильтрация; [ВТОР] mailreach: «Outlook ≠ Microsoft 365 … Microsoft 365 business inboxes are filtered separately through EOP (Exchange Online Protection)». Официальных числовых порогов для корпоративных тенантов — нет данных.

### 2.4 RFC 8058 — one-click unsubscribe (S21)
Category: Standards Track, January 2017. Нормативные места (curl, дословно): отправитель кладёт в письмо два заголовка: `List-Unsubscribe` (содержит ровно один/минимум один HTTPS URI) и `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. «senders MUST apply at least one valid DKIM signature to the message»; «The List-Unsubscribe and List-Unsubscribe-Post headers MUST be covered by the signature.» «The mail receiver MUST NOT perform a POST on the HTTPS URI without user consent.» Получатель (Gmail/Yahoo) при клике делает HTTPS POST на URI.
Google (S1, S2) явно требует именно эту схему для bulk-marketing; mailto и ссылка на страницу-настройки её не заменяют.

### 2.5 Матрица: «обязательно только для bulk» vs «нужно даже при 2–5 писем/день»

| Элемент | Формально обязателен | Нужен при 2–5/день? | Основание |
|---|---|---|---|
| SPF **или** DKIM | Gmail/Yahoo — для ВСЕХ отправителей | **Да** (формальное требование) | S1, S12 |
| SPF **и** DKIM | Gmail/Yahoo/Microsoft — только bulk | **Да по факту** (Google: «we recommend that you always set up SPF, DKIM, and DMARC»; без аутентификации «marked as spam or rejected with a 5.7.26») | S1 |
| DMARC (p=none достаточно) | только bulk (Google ≥5 000/д; Microsoft ≥5 000/д на consumer; Yahoo — «значительный объём», порог не назван) | **Да по факту** (рекомендация Google; Microsoft FAQ: «all senders benefit»; Yahoo «strongly urges all senders») | S1, S4, S13, S14 |
| DMARC-alignment (From = домен SPF или DKIM) | bulk | **Да по факту**: без выравнивания DMARC не проходит | S1, S15 |
| DKIM-ключ ≥1024 бит (рекомендуется 2048) | Gmail: «requires» для отправки на личные Gmail; Yahoo: ≥1024 | **Да** | S1, S13 |
| PTR (forward/reverse DNS) | все (Gmail, Yahoo) | Да, но на стороне провайдера ящика (Google/Microsoft), если отправлять через их инфраструктуру; на собственном SMTP — на вас [ОЦЕНКА: логика, не цитата] | S1, S12 |
| TLS | все (Gmail) | Да (обеспечивается провайдером) [ОЦЕНКА] | S1 |
| RFC 5322 формат | все | Да; ломается самописной сборкой заголовков | S1, S12 |
| Spam rate <0.3% (рекомендация <0.1%) | все (формулировка Gmail/Yahoo) | **Метрика практически неприменима**: Postmaster не показывает данные при малом объёме; арифметика: 1 жалоба на 100 писем = 1% [ОЦЕНКА] | S1, S2, S3 |
| One-click unsubscribe (RFC 8058, List-Unsubscribe-Post) | только bulk-marketing | Нет (формально). Полезен как «клапан» против жалоб (Google FAQ: «helps you maintain a low spam rate»; Yahoo FAQ рекомендует и там, где закон не требует) | S2, S13 |
| Видимая ссылка/строка отписки в теле | bulk (Gmail/Yahoo) | **Да — по закону** (CAN-SPAM: opt-out; CASL: unsubscribe) | S39, S40 |
| Отписка исполняется ≤48 ч (Google, рекомендация)/≤2 дней (Yahoo, bulk) | bulk | Желательно; по закону — 10 рабочих дней (US/CA) | S2, S12, S39, S40 |
| Постепенное наращивание объёма, «без всплесков» | рекомендация Google для всех | Да (при 2–5/день выполняется само) | S1 |
| Мониторинг Postmaster Tools / compliance dashboard | bulk (рекомендуется) | Данных не будет [ОЦЕНКА] | S2, S3 |

---

## 3. Инфраструктура отправки: цены, лимиты, ToS про cold

### 3.1 Обычный ящик Google Workspace (S6, S7, S8, S9)
- Цены (S7, [ОФИЦ], 2026-10-04): Business Starter **$7**, Standard **$14**, Plus **$22** «/ user per month»; переключатель «Annual (Save 16% with 1 year commitment)»; «All plans billed monthly, all prices $USD»; на странице — промо «up to 30% off first 3 months» (новым клиентам; «introductory price… only for the first 20 users added, for 12 months»). Starter: 30 GB pooled, «Secure custom business email you@your-company.com». Цена гибкого помесячного тарифа на странице не отрисована; [ВТОР] (lineserve/cloudwards) называют $8.40/$16.80/$26.40 — не подтверждено.
- Лимиты (S6): 2 000 сообщений/день на пользователя (1 500 mail merge; 500 trial); внешних уникальных получателей/день 2 000; — для 2–5 писем/день нерелевантно.
- ToS про cold: AUP — «unsolicited mass email»; Gmail Program Policies — «unsolicited commercial mail» (см. 2.1). Серая зона; риск — блокировка пользователя/домена при жалобах.
- [ВЕНДОР, litemail.ai, Q1 2026]: «Google Workspace suspended approximately 22% of high-volume new accounts within 90 days»; «Google reinstates roughly half of first-time appeals» — **не принимать на веру** (продавец pre-warmed inbox); относится к высокому объёму.

### 3.2 Обычный ящик Microsoft 365 (S17, S18, S19, S20)
- Цены (S18, Microsoft Licensing, страница от Feb 16, 2026; вступают с **2026-07-01**): Business Basic **$6.00 → $7.00**, Business Standard **$12.50 → $14.00**, Business Premium **$22.00**; «Existing customers remain on current pricing until renewal». Без Teams: Basic $4.40 → $5.40. Exchange Online Plan 1 как отдельный SKU на этой странице не указан — цена $4/user/мес только из [ВТОР] (в этом прогоне не подтверждена).
- Лимиты (S17): «Recipient rate limit: 10,000 recipients per day»; «Message rate limit: 30 messages per minute»; recipient limit per message — см. страницу (по умолчанию 500, настраивается 1–1000 — [ВТОР], страница S17 содержит сноску про «between 1 and 1000»). «Exchange Online customers who need to send legitimate bulk commercial email (for example, customer newsletters) should use third-party providers that specialize in these services.»
- ToS про cold: Anti-Spam Policy (S20): «Microsoft prohibits the use of the service in any manner associated with the transmission, distribution, or delivery of any unsolicited bulk or unsolicited commercial e-mail (“spam”).» AUP (S20, «Last updated: February 2011» — «устарело (до 2025)» по дате): «Use the Services to transmit, distribute, or deliver any unsolicited bulk or unsolicited commercial e-mail (i.e., spam).» Та же серая зона, что у Google.
- SMTP AUTH (S19, обновление 2026-01-27): «Now to December 2026: SMTP AUTH Basic Authentication behavior remains unchanged. End of December 2026: SMTP AUTH Basic Authentication will be disabled by default for existing tenants. Administrators will still be able to enable it if needed. New tenants created after December 2026: SMTP AUTH Basic Authentication will be unavailable by default. OAuth will be the supported authentication method. Second half of 2027: Microsoft will announce the final removal date.» (Для автоматической отправки через M365 SMTP нужен OAuth.)

### 3.3 Бесплатные/дешёвые варианты ящика
- **Consumer Gmail (бесплатно)** (S5): «500 recipients in a single email and or more than 500 emails sent in a day». Адрес @gmail.com — не брендовый; при «Send mail as» с вашего домена через SMTP Gmail DKIM подписывается gmail.com — выравнивания с From=ваш домен нет [ОЦЕНКА: вытекает из требования Google «the domain in the sender's From: header must be aligned with either the SPF domain or the DKIM domain»]. Политики Gmail (S9) — те же.
- **Zoho Mail** (S31): Free — «Email hosting for one domain for up to 5 users, 5 GB Mail storage per user, IMAP/ POP/ Active Sync not included» (официальная страница S31; «only in selected data centers»). Mail Lite $1/user/мес (5 GB) или $1.25 (10 GB), только годовая оплата; Mail Premium $4 — по [ВТОР] LetterDuck («verified August 7, 2026 against the live pricing data feed»; сервис-конкурент). Лимиты отправки (150/250/1000 в день) — только [ВТОР] (codeopx.com), не подтверждены. Антиспам-политика Zoho Mail в этом прогоне **не найдена** (страница /mail/anti-spam-policy.html — 404). [ВТОР] itechguides: «Bulk or burst sending is not supported under the business-usage policy».

### 3.4 Cold-email платформы (все цены — [ВЕНДОР], «источник заинтересован»; страницы открыты 2026-10-04)

**Instantly** (S28, Exa-снимок страницы): страница показывает несколько режимов (Outreach/Credits/Bundles; monthly/annual). Outreach: **Growth $47/мес** (при годовой оплате — «$37.6/monthly»): «Unlimited Email Accounts; Unlimited Email Warmup; 1000 Uploaded Contacts; 5000 Emails Monthly»; **Hypergrowth $97/мес** (25 000 контактов, 125 000 писем/мес; годовая — $77.6); **Light Speed $358/мес** (500 000 писем/мес; годовая — $286.3). Bundles: Starter $94/мес («5000 emails monthly, 1000 uploaded contacts, 1500 Instantly credits»), Scale $194, Agency $555 (−10% при годовой). Страница рекламирует «Cold Email Bench Report 2026».
ToS (S28, «Last Updated: September 22, 2026»): Subscriber — «sole “sender” and “initiator” (as those and similar terms are used under CAN-SPAM and other applicable laws)»; «6.8 Notices and Consents. Instantly does not provide notices or obtain consents on Subscriber’s behalf. To the extent any law requires notice, consent, or other action before marketing to or processing personal information of any individual, Subscriber represents and warrants it will obtain and maintain such rights at its own expense.» §6.7: персональные данные из Output Data — «only process such data: (a) with valid, informed consent of the data subject; or (b) under another lawful basis recognized by applicable law (e.g., Subscriber’s legitimate interests…)». §4.8: прогрев — пул, «Subscriber may be exposed to the personal and contact information for other Instantly users from the Warmup pool». Т.е. cold-аутрич **не запрещён**, вся юридическая ответственность на пользователе.

**Smartlead** (S29): Base **$39/мес** (2 000 контактов, 6 000 писем), Pro **$94**, Smart **$174**, Prime **$379**; годовая −17% ($32.5/$78.3/$144.5/$314.6); «All Smartlead plans include unlimited email accounts». Add-on SmartSenders: Google/Outlook-ящик «$4.5/mailbox/month» + «$13/domain/year» (через стороннего Zapmail), пре-прогретые — «$9/mailbox/month, $18/domain/year».
Terms (S29): «you agree to comply with all Spam Laws. You acknowledge that any use of the Service for the purpose of sending unsolicited commercial electronic messages or making unsolicited phonecalls, as defined by the Spam Laws is strictly prohibited»; «Spam Laws means any applicable spam laws and regulations, including but not limited to the Spam Act 2003 (Cth) in Australia, as well as any similar laws or regulations in other jurisdictions in which you or your intended audience are in.» → отправка на Германию/Австрию (где cold-письмо по закону «unsolicited») формально нарушает их Terms. Fair Use: «abusing the unlimited email warm-up offered by us» — пример злоупотребления.

**lemlist** (S30): **Email — от $55/мес** (зачёркнуто $69; привязка к годовой оплате явно не указана), **Multichannel — от $87/мес** (зачёркнуто $109); 14-дневный триал; «lemwarm and built-in deliverability protections are included in all plans». Terms (S30): «Sending Policy (Anti-Spam Policy)» входит в договор; при «unusual number of complaints» вправе закрыть аккаунт/ограничить отправку без возмещения.

### 3.5 Транзакционные/ESP — что говорят ToS/AUP про cold/unsolicited (РЕШАЮЩИЙ ФАКТОР)

**Resend** (S22; AUP «Last update: August 27th, 2026») — **прямой запрет**:
- «Spamming: You are prohibited from sending unsolicited messages of any kind, including cold outreach, purchased lists, or scraped contact data.»
- «Appropriate Mailing Lists: All mail must be sent to recipients who have explicitly opted in to receive communications from you. Sending to unsolicited recipients is not permitted on Resend.»
- Пороги: «Your complaint rate must be lower than 0.08%. Your bounce rate must be lower than 4%. … your account may be shut down without warning.»
- ToS: «You have obtained all necessary consents and permissions from recipients to send them messages in accordance with applicable laws…».
- Цены (S22): Free $0 (3 000 писем/мес, 100/день), Pro $20/мес (50 000 писем/мес).
- Блог Resend (2026-09-30): «Legitimate senders do not need a warmup service.»

**Postmark** (S23; ToS «Effective December 10, 2024» — действующая редакция, но «устарело (до 2025)» по дате):
- «All email lists contained and/or used with respect to the Service must be permission-based subscriptions. Use of a list that has been purchased or rented from a third party is prohibited.»
- «Emails sent unsolicited will receive abuse complaints that will be reflected on Your account.»
- «We reserve the right to suspend or terminate your account for… inclusion of spam or otherwise duplicative or unsolicited messages in Your Messaging Content».
- Пороги: «Your spam complaint rate must be lower than 1 in 1,000 emails (0.1%).» «Your bounce rate has to be lower than 10% of all emails sent.»
- Слова «cold email» в ToS нет; запрет следует из «permission-based» + «unsolicited». Vetting-гайд Postmark (2021, «устарело (до 2025)»): «Postmark requires that lists and recipients be permission-based subscriptions. This means that recipients have explicitly opted-in…»
- Цены (S23): Free 100 писем/мес; **$15/мес за 10 000 писем**.

**Amazon SES** (S24):
- AWS AUP («Last Updated: July 1, 2021» — «устарело (до 2025)» по дате): запрещено «to distribute, publish, send, or facilitate the sending of unsolicited mass email or other messages, promotions, advertising, or solicitations (or “spam”).»
- SES — запрос production-доступа (docs, живая страница): «In Acknowledgement, check the box that you agree to only send email to individuals who’ve explicitly requested it and confirm that you have a process in place for handling bounce and complaint notifications.» «In order to prevent our systems from being used to send unsolicited or malicious content, we have to consider each request carefully.» Sandbox: «You can only send mail to verified email addresses and domains… maximum of 200 messages per 24-hour period… 1 message per second.»
- SES docs (reputation): «Ensure that the only recipients you are contacting are those who have explicitly asked to receive email from you. Never purchase, rent, or borrow lists of email recipients. Don’t attempt to hide your identity or the purpose of your communication».
- SES FAQ: «If we determine that the email you send is of poor or questionable quality (for example, if it has high bounced email or complaint rates, or if it contains unsolicited or malicious content), we reserve the right to pause your ability to send email.»
- Цены (S24): «Outbound email $0.10 / 1,000 emails»; free tier: «Receive up to 3,000 message charges for free each month for the first 12 months».
- [ВТОР] (AWS re:Post-треды) сообщают, что production-доступ отклоняют за cold/bulk — не официальная формулировка.

**Mailgun (Sinch)** (S25; AUP «Last revised January 16, 2023» — «устарело (до 2025)» по дате, но это текущая редакция страницы):
- «1c – Emails and SMS (unless transactional) can only be sent where permission has been expressly obtained in nature, and can only be sent to recipients who have granted clear, explicit and provable consent to receive communication. This consent should be granted through a confirmed single or double opt-in system…»
- «1b – Acquiring or sending to a third-party mailing list is prohibited. Use of contact lists that are bought, rented or scraped from third-parties is prohibited by law in most countries, and is absolutely prohibited on Sinch Email servers.»
- «1d – Proof of consent must be provided in the event of an escalated abuse complaint.»
- Пороги: bounces ≤5%; unsubscribes ≤1.4% (или 1% если unsubs > clicks); spam complaints ≤0.08%; blocks <20%.
- Цены (S25): Free $0 (100 писем/день), Basic $15/мес, Foundation $35/мес (50 000 писем).

**Twilio SendGrid** (S26; Email Policy «Last Updated: April 9, 2026»):
- «Except for transactional emails…, you must obtain affirmative consent prior to sending any emails to a recipient via the Email Services. Any affirmative consent must be freely given by each recipient to each sender (e.g., blanket consents or consents provided on behalf of a third party are not acceptable), informed, and unambiguous.»
- Запрещено (Prohibited actions): «Sending unsolicited or unwanted emails in bulk»; «**Sending emails to email addresses that you obtained from the Internet or social media or to generic email aliases (e.g., webmaster@domain.com or info@domain.com) without obtaining prior affirmative consent**»; «Using purchased or rented email lists or email lists of recipients that have not affirmatively consented to receive emails from you»; «Using or embedding tracking technologies (e.g., tracking pixels or cookies) in emails sent to a recipient prior to obtaining consent from that recipient to the extent and in the manner required by applicable law»; фильтр-evasion: snowshoeing/waterfalling.
- Цены: бесплатный trial («Sign up for a free trial—no credit card required»); цифры платных планов в этом прогоне не извлечены (нет данных).

**Brevo** (S27; Anti-spam policy, «© Brevo 2026»):
- «B) Bought & scraped lists — Lists of Contacts that have been scraped on the internet, acquired or purchased from a third-party… the use of such lists of Contacts is strictly prohibited on our Software.»
- «C) Consent of the recipients — You must have the consent of your Contacts, and it must be active… and explicit… You must be able at any time to provide a proof of opt-in for each of your Contacts».
- «Any messages violating anti-spam laws such as, but not limited to CAN-SPAM, GDPR, LGPD, CASL» — strictly prohibited content.
- Free-план: «you can start sending up to 300 emails per day» (после одобрения аккаунта).

**Важное замечание про «персональные 1:1 через ESP как transactional»:** Spamhaus (S33): cold-рассылки пытаются «falsely identifying as transactional because they are sent “one-to-one”. But cold emails are not transactional. There’s no existing business relationship, no transaction, and certainly no confirmed opt-in». Plus Spamhaus: «Misusing the free tier of sending platforms and cloud providers» перечислено среди признаков cold-спама.

---
<!-- CONTINUE-RAW -->
