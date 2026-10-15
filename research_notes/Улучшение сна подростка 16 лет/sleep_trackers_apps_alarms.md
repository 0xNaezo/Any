# Consumer sleep technology for a 16-year-old: tracker accuracy, useful metrics, smart alarms, apps, neurotech gadgets, prices and safe use (orthosomnia)

Scope note for the report writer: target person is a 16-year-old male with a fixed weekday wake time (~6:30–7:30), difficulty falling asleep, night awakenings and unrefreshing sleep with daytime sleepiness. Evidence grades used below: **strong / moderate / weak / expert opinion only**. "(ADULT evidence)" or "(ADOLESCENT evidence)" labels mark the study population. Prices are approximate USD list prices seen in 2025–2026 sources; availability differs by country. Searches ran up to 15 Oct 2026.

---

## 1. How accurate are consumer sleep trackers compared with polysomnography (PSG) in 2022–2026 validation studies?

### Takeaway
Current mid- and high-end wearables (Fitbit/Pixel, Apple Watch, Oura, Samsung watches, WHOOP) detect *sleep* well (sensitivity >90–95%) and usually estimate total sleep time (TST) within about 30 minutes on average in healthy adults. They are much weaker at detecting *wake* (specificity ~30–75%) and at sleep stages (Cohen's κ mostly 0.2–0.65). Cheap bands (Xiaomi, Axtro) and smartphone or radar "nearables" are generally worse, except for logging bed and wake times. Accuracy falls on nights of poor or fragmented sleep, which are exactly the nights this teenager complains about. Evidence grade: **moderate**. The studies are mostly single-night lab validations of 20–100 adults, several are industry-funded, and results date quickly because algorithms are updated.

### Cited Findings

**Multi-device studies and syntheses (ADULT evidence)**
- **Schyvens et al., 2025, *Sleep Advances*.** Lab PSG, single night, 62 adults (52 men, mean age 46, some with suspected sleep apnea), each wearing 2–4 devices.
  - Epoch-by-epoch sensitivity was 91.7–96.3% and specificity 29.4–52.2%.
  - κ by device: Apple Watch Series 8 0.53 (n=20), Fitbit Sense 0.42 (n=37), Fitbit Charge 5 0.41 (n=39), WHOOP 4.0 0.37 (n=40), Withings ScanWatch 0.22 (n=41), Garmin Vivosmart 4 0.21 (n=25).
  - Total sleep time (TST): every device except the Fitbit Charge 5 overestimated it, by 6.3–39.9 min. The Charge 5 underestimated by 5.7 min (not significant). The Apple Watch overestimated by 19.6 min but had the narrowest limits of agreement (−38 to +78 min). Mean absolute error ranged from 27.8 min (Apple) to 60.9 min (ScanWatch).
  - All devices underestimated wake after sleep onset (WASO) by 12–48 min and overestimated sleep efficiency by 2.2–10.2%.
  - Sleep onset latency (SOL): relative errors were huge, with mean absolute percentage error (MAPE) of 452% for WHOOP and 159% for Garmin.
  - Deep sleep (PSG N3) was often scored as light sleep: 47.7% of N3 epochs for Apple and 46.0% for Garmin.
  - Authors' conclusion: the better devices are suitable only for "prolonged and significant changes" in sleep architecture. — [Schyvens et al. 2025, Sleep Advances (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/); [OUP version](https://academic.oup.com/sleepadvances/article/6/2/zpaf021/8090472)
- **Schyvens et al., 2024, systematic review, *JMIR mHealth uHealth*.** 8 studies of Fitbit Charge 4, Garmin Vivosmart 4 and WHOOP; children were excluded.
  - WHOOP had the smallest TST disagreement (−1.4 min), light sleep (−9.6) and deep sleep (−9.3), but the largest REM disagreement (+21 min).
  - Fitbit Charge 4 had the best REM agreement (4.0 min) and the highest deep (75%) and REM (86.5%) sensitivities. Garmin had the lowest stage sensitivities.
  - Study samples were small (2–53 participants). — [Schyvens et al. 2024, JMIR mHealth](https://mhealth.jmir.org/2024/1/e52192)
- **Robbins et al., 2024, *Sensors*.** 35 healthy adults aged 20–50, single inpatient night, comparing Oura Gen3, Fitbit Sense 2 and Apple Watch Series 8.
  - All devices had sleep sensitivity ≥95%.
  - Sleep/wake (2-stage) κ: Oura 0.60, Fitbit 0.52, Apple 0.60. Four-stage κ: Oura 0.65, Fitbit 0.55, Apple 0.60.
  - Oura did not differ significantly from PSG on TST, wake, light, deep, REM, WASO or sleep efficiency, but overestimated sleep latency by 5 min.
  - Fitbit overestimated light sleep by 18 min and underestimated deep sleep by 15 min.
  - Apple underestimated wake by 7 min, deep sleep by 43 min and WASO by 10 min, and overestimated light sleep by 45 min.
  - Agreement on nightly deep sleep (ICC 0.13–0.36) and REM sleep (ICC 0.13–0.37) was poor for all devices.
  - Data were missing for 2 of 35 Fitbit nights and 6 of 35 Apple nights.
  - **Conflict of interest:** the study was funded by Oura Ring Inc., and the lead author sits on Oura's medical advisory board and receives consulting fees. — [Robbins et al. 2024 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11511193/)
- **Svensson et al., 2024, *Sleep Medicine*.** Oura Gen3 running sleep staging algorithm OSSA 2.0, 96 healthy Japanese adults aged 20–70, up to 3 nights of ambulatory PSG each (421,045 epochs).
  - Sensitivity 94.4–94.5%, specificity 73.0–74.6%, accuracy 91.7–91.8%, PABAK 0.83–0.84.
  - No significant difference from PSG for TST, SOL, WASO, light or deep sleep. REM was underestimated by 4–6 min.
  - Stage accuracy ranged from 75.5% (light) to 90.6% (REM).
  - Funding and conflicts of interest were not verified in these notes. — [Svensson et al. 2024](https://doi.org/10.1016/j.sleep.2024.01.020)
- **Lee T. et al., 2023, *JMIR mHealth uHealth*.** 75 participants at a Korean tertiary hospital and a sleep clinic (sleep-disorder patients included), 11 trackers, 349,114 epochs. Four-stage κ (macro F1) by device:

  | Device | Type | κ | Macro F1 |
  |---|---|---|---|
  | SleepRoutine | phone app | 0.56 | 0.69 |
  | Amazon Halo Rise | radar | 0.48 | — |
  | Fitbit Sense 2 | wearable | 0.42 | 0.58 |
  | Galaxy Watch 5 | wearable | 0.42 | 0.58 |
  | Pixel Watch (1st gen) | wearable | 0.40 | 0.57 |
  | Oura Ring 3 | wearable | 0.35 | 0.52 |
  | Apple Watch 8 | wearable | 0.30 | 0.49 |
  | Withings mat | under-mattress | 0.25 | 0.45 |
  | SleepScore | phone app | 0.21 | 0.40 |
  | Pillow | phone app | 0.07 | 0.26 |
  | Google Nest Hub 2 | radar | 0.06 | 0.30 |

  - Sensitivity for wake was low for many wearables: Pixel Watch 0.23, Fitbit Sense 2 0.27, Oura 0.38, Apple 0.45.
  - Sleep-efficiency bias ranged up to +12.8 percentage points (Pixel Watch). Sleep-latency bias ranged up to +39 min (Nest Hub 2).
  - **Conflict of interest:** most authors are affiliated with Asleep Co., the maker of the top-ranked SleepRoutine app, and hold stock or options in it. — [Lee T. et al. 2023 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10654909/)
- **Lee Y.J. et al., 2025, meta-analysis, *Journal of Clinical Sleep Medicine*.** 24 studies, 798 participants, wrist devices from Fitbit, Jawbone, WHOOP, Garmin, Apple, Xiaomi Mi Band 5 and others.
  - Significant pooled differences versus PSG: TST 16.9 min (95% CI 7.4–26.3), sleep efficiency 4.7%, sleep latency 2.6 min, WASO 13.3 min. The abstract's sign convention leaves the direction of the TST bias ambiguous.
  - Conclusion: wrist devices are "not as reliable as polysomnography" but are useful for "general sleep patterns". — [Lee Y.J. et al. 2025, JCSM (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11874098/)
- **Ong et al., 2023/2024, *Sleep Health*.** 60 adults aged 18–70, lab PSG scored by 3 readers.
  - Two-stage κ: Dreem 3 EEG headband 0.76, Oura Gen3 0.64, Fitbit Sense 0.58, ActiGraph research accelerometer 0.47, low-cost bands (Xiaomi Mi Band 7, Axtro Fit3) <0.31.
  - The low-cost bands had only about 33% specificity (wake detection).
  - The Xiaomi band still placed sleep onset within ±30 min of PSG on 89% of nights and sleep offset on 96%.
  - Biases were driven by nights of poorer sleep (long SOL or WASO).
  - Authors' conclusion: low-cost trackers "can log time in bed" but are not recommended for research. — [Ong et al. (Sleep Health)](https://www.sleephealthjournal.org/article/S2352-7218(23)00267-X/fulltext); [preprint with onset/offset data](https://doi.org/10.1101/2023.10.12.23296981)
- **Willoughby et al., 2024, *Sleep Health*.** 63 adults aged 20–68 who used a smartphone in bed before and after sleep, and were woken once in the night to reply to a message.
  - Oura and Fitbit detected sleep/wake transitions better than the ActiGraph and the low-cost bands.
  - All devices scored some motionless wake as sleep.
  - The low-cost bands often missed the morning wake time. The Axtro band placed sleep onset *before bedtime* for half of participants.
  - Accuracy was worse in people with low sleep efficiency. — [Willoughby et al. 2024](https://doi.org/10.1016/j.sleh.2024.02.007); [full text](https://www.sleephealthjournal.org/article/S2352-7218(24)00032-9/fulltext)
- **Kainec et al., 2024, *Sensors*.** 53 young adults, single lab night: Fitbit Inspire HR, Fitbit Versa 2, Garmin Vivosmart 4, Oura Gen2, Withings mat.
  - TST agreement was good for the Fitbits, Withings and Oura, and poor for Garmin. TST MAPE ranged from 5.3% to 14.3%.
  - WASO MAPE was 59–138%, i.e. very low accuracy for all devices. Deep and REM MAPE exceeded 20% for all devices. — [Kainec et al. 2024 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10820351/)
- **Chinoy et al., 2021, *SLEEP*.** 34 healthy young adults over 3 lab nights, including a deliberately disrupted night, with 7 consumer devices.
  - Sensitivity ≥0.93; specificity 0.18–0.54.
  - Garmin Fenix 5S and Vivosmart 3 performed worse than research actigraphy.
  - All devices did worse on disrupted nights. — [Chinoy et al. 2021, SLEEP](https://academic.oup.com/sleep/article/44/5/zsaa291/6055610)
- **Herberger et al., 2025, *Scientific Reports*.** Sleep-lab patients with varied disorders.
  - Oura Gen3 (2022 data) sleep/wake accuracy was 85% (κ 0.43), but wake sensitivity only 46%. Four-stage accuracy was 53% (κ 0.31).
  - Group-mean TST was within 12 min of PSG, but individual-level errors were often large. — [Herberger et al. 2025](https://www.nature.com/articles/s41598-025-93774-z)
  - **Methodological critique (2025 commentary):** this study compared stages using 5-minute epochs and data from older firmware. Validation results generally lag current hardware and algorithms; for example, Oura Ring 4 launched in 2024 and Oura's staging algorithm was updated in June 2023. — [de Zambotti et al. 2025 commentary (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12510450/)

**Device-specific notes**
- **Oura (Gen3/Gen4):** results range from very good (Svensson 2024; Robbins 2024, Oura-funded) to fair κ 0.35 (Lee 2023) and 53% 4-stage accuracy in clinical patients (Herberger 2025). These are conflicting results, likely explained by funding, population and epoch-handling differences. No PSG sleep-staging validation of Oura Ring 4 specifically was found. — sources as above
- **Apple Watch:**
  - κ 0.53, the best of six devices (Schyvens 2025); κ 0.60 but deep sleep underestimated by 43 min (Robbins 2024); κ 0.30 (Lee 2023). These results conflict. — [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/); [Robbins 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11511193/); [Lee 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10654909/)
  - Apple added a "sleep score" (duration, bedtime consistency, awakenings, stages) in watchOS 26 (2025). No independent validation of the score was found. — [AASM news on Apple Watch Series 11](https://aasm.org/apple-watch-series-11-offers-new-sleep-features/)
- **Google Pixel Watch / Fitbit:**
  - Fitbit-family devices are among the most consistently validated: κ 0.41–0.42 (Schyvens 2025), 0.55 (Robbins 2024), 0.45–0.60 4-stage (Ong 2023).
  - Pixel Watch (1st gen) had the best deep-sleep F1 (0.59) but poor wake sensitivity (0.23) and the largest sleep-efficiency overestimation (+12.8 percentage points). — [Lee 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10654909/)
  - No PSG validation of Pixel Watch 2/3/4 or the 2026 "Fitbit Air" was found.
- **Garmin:** older Vivosmart 4 performed worst or near-worst across studies (κ 0.21 in Schyvens 2025; poor TST agreement in Kainec 2024; worse than actigraphy in Chinoy 2021). No PSG validations of current Garmin watches or the Index Sleep Monitor were found. — sources above
- **WHOOP:** WHOOP 4.0 κ 0.37, sensitivity 93.6%, specificity 40.1%, best deep-sleep detection at 69.6% of N3 epochs, but underestimated SOL by 11 min (Schyvens 2025). No PSG validation of WHOOP 5.0/MG was found. — [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/)
- **Samsung:**
  - Galaxy Watch 3, 32 adults (Kim et al. 2023): TST overestimated by 9.5 min; sensitivity 0.954, specificity 0.524; 4-stage accuracy 0.651; REM unreliable (ICC 0.15). — [Kim et al. 2023, J Sleep Med](https://doi.org/10.13078/jsm.230004)
  - Galaxy Watch 5: κ 0.42 and the smallest sleep-efficiency bias (−0.4%). — [Lee 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10654909/)
  - **Galaxy Ring:** no peer-reviewed PSG validation was found. A tech reviewer reported it over-recorded sleep and time in bed and missed night awakenings. This is anecdotal. — [Android Authority 2024](https://www.androidauthority.com/samsung-galaxy-ring-sleep-tracking-3480846/)
- **Budget bands:**
  - Xiaomi Mi Band 5, 45 adults (Concheiro-Moscoso 2023): accuracy 78%, sensitivity 89%, specificity 35%, κ 0.22. It overestimated TST, light and deep sleep, and did better in people without sleep problems. — [Concheiro-Moscoso et al. 2023 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10238963/)
  - Xiaomi Mi Band 7 (Ong 2023): see above. Timing was fine; wake detection and stages were poor.
  - Huawei Watch GT2, 98 sleep-clinic patients in China (PLoS One 2025): sensitivity 95.3%, specificity 44.5%, κ 0.43; overestimated TST, sleep efficiency, deep and REM sleep. This comes from a secondary news summary. — [News-Medical summary of the PLoS One study](https://www.news-medical.net/news/20251007/Huawei-smartwatch-nearly-matches-gold-standard-sleep-test.aspx)
  - No PSG validation of current Amazfit models was found.
- **Under-mattress / bedside devices:**
  - Withings mat: κ 0.25 (Lee 2023); good TST agreement (Kainec 2024).
  - Google Nest Hub 2 (Soli radar): κ 0.06 and sleep-latency bias +39 min, the worst in Lee 2023.
  - SleepScore Max (sonar): performed as well as or better than actigraphy for sleep/wake (Chinoy 2021). — [Lee 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10654909/); [Kainec 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10820351/); [Chinoy 2021](https://academic.oup.com/sleep/article/44/5/zsaa291/6055610)
- **Smartphone apps:**
  - Sleep Cycle and an older Mi Band showed "poor agreement" with PSG in healthy sleepers (27 nights) and were good only for time in bed. — [Ameen et al. 2019, Sensors](https://www.mdpi.com/1424-8220/19/19/4160)
  - SleepScore app κ 0.21 and Pillow κ 0.07 were poor. SleepRoutine κ 0.56 was best, but see the conflict of interest above. — [Lee 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10654909/)
- **Professional consensus:**
  - Sleep Research Society: consumer multisensor devices now "exceed the performance of traditional actigraphy". Clear limits remain: wake during the sleep period is misclassified, artifacts occur, and performance drops for some individuals (for example skin tone, obesity). — [de Zambotti et al. 2024, SLEEP (SRS State of the Science)](https://academic.oup.com/sleep/article/47/4/zsad325/7501518)
  - World Sleep Society: on nights with sleep efficiency below 80–85%, the accuracy of tracker sleep measures is "likely compromised". — [Chee et al. 2025, World Sleep Society recommendations, Sleep Medicine](https://www.sciencedirect.com/science/article/pii/S138994572500173X)

### Inferences
- For this teenager's three complaints, the tracker is least accurate exactly where he needs it:
  - Long sleep latency and night awakenings are motionless wake, which devices miss or misplace.
  - Unrefreshing sleep is subjective and is not captured by stage data.
  - Expect the device to misjudge his worst nights.
- Rank-ordering devices is unstable across studies, partly because of conflicts of interest (Oura-funded Robbins 2024; Asleep-affiliated Lee 2023), clinical versus healthy samples, and version lag. "Iteratively improved" brands (Fitbit/Google, Oura, Apple, Samsung watches) sit in one broadly similar accuracy tier. Low-cost no-name bands and radar or phone apps sit lower.
- Validation results are snapshots. A 2026 model is likely similar or better than its predecessor, but this cannot be assumed.

### Gaps
- No peer-reviewed PSG validation was found for: Galaxy Ring; Oura Ring 4 (sleep staging); Pixel Watch 2/3/4; Fitbit Air; Apple Watch Series 9–11 or SE 3; WHOOP 5.0/MG; current Garmin watches or the Garmin Index Sleep Monitor; Polar Loop; Amazfit Helio Strap; Xiaomi Smart Band 9/10; Huawei Band 10/11. A 2026 retailer article mentions an "Oura Ring 5"; this was not verified.
- Funding and conflicts of interest for Svensson 2024 and for the Singapore (Chee lab) studies were not checked.
- The sign convention behind the meta-analytic TST difference (Lee Y.J. 2025) could not be confirmed from the abstract.

---

## 2. Are there validation studies in adolescents, and how does accuracy differ in teens?

### Takeaway
Yes, but they mostly test older devices: Jawbone UP, Fitbit Charge HR, Alta HR and Charge 3, early Oura rings, Polar A370 and Garmin Vivofit 4. The consistent finding is the **opposite of adults**: in 15–19-year-olds, devices tend to **underestimate total sleep by about 10–47 minutes and overestimate night-time wake**, probably because teens move more during sleep. Sleep staging is poor, especially deep sleep. Sleep/wake specificity is often better in teens than in adults. Evidence grade: **moderate** for direction of bias, **weak** for current-generation devices, where no adolescent PSG validations were found for 2022–2026 models.

### Cited Findings
- **de Zambotti et al., 2015, *SLEEP*.** Jawbone UP, 65 healthy adolescents (mean 15.8 y). TST mean difference −10.0 ± 20.5 min (device over PSG); differences fell within clinically acceptable limits (<30 min). The device's "sound/light sleep" did not map onto PSG stages. (ADOLESCENT evidence) — [de Zambotti et al. 2015, SLEEP](https://academic.oup.com/sleep/article/38/9/1461/2418009)
- **de Zambotti et al., 2019, *Behavioral Sleep Medicine*.** First-generation Oura ring, 41 healthy adolescents and young adults aged 14–22.
  - TST, SOL and WASO did not differ from PSG.
  - Deep sleep (N3) was underestimated by about 20 min and REM overestimated by about 17 min.
  - Sensitivity 96%, specificity 48%.
  - 87.8% of participants were within ±30 min on TST, and 90.9% of <6 h sleepers were correctly classified. (ADOLESCENT/young adult) — [de Zambotti et al., The Sleep of the Ring (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6095823/)
- **Lee X.K. et al., 2019, *JCSM*.** Fitbit Alta HR, 58 healthy adolescents aged 15–19, multiple PSG nights at 5, 6.5 and 9 h time in bed.
  - TST underestimated by 24–47 min; WASO overestimated by 21–41 min.
  - Sensitivity about 0.90; specificity 0.88–0.90, higher than the research actigraph.
  - Deep sleep (N3) underestimated by 21–46 min; REM comparable to PSG.
  - Authors note consumers should be told deep sleep is underestimated "to allay anxiety". (ADOLESCENT) — [Lee X.K. et al. 2019 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6760396/)
- **Chee N.I.Y.N. et al., 2021, *Nature and Science of Sleep*.** An earlier-generation Oura ring, 53 adolescents aged 15–19, multi-night PSG across 6.5, 8 and 9 h sleep opportunities.
  - TST underestimated by 32.8–47.3 min; WASO overestimated by 30.7–46.3 min.
  - Light sleep underestimated by 51–81 min; deep sleep (N3) overestimated by 31–47 min; REM underestimated by 13–20 min.
  - Sleep/wake accuracy, sensitivity and specificity were 0.88–0.89.
  - Authors: adequate for "characterizing the effect of sleep duration manipulation" (i.e. trends), but staging "needs improvement". (ADOLESCENT) — [Chee et al. 2021 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7894804/)
- **Menghini et al., 2021, *Chronobiology International*.** Fitbit Charge 3, 39 adolescents aged 16–19, including 12 with insomnia symptoms.
  - TST underestimated by about 11 min, sleep efficiency by 2.5%; WASO overestimated by 9 min.
  - Stage sensitivity: wake 68%, light 78%, deep 59%, REM 69%. About 40% of N3 epochs were scored as light.
  - Results were similar in teens with insomnia symptoms (wake sensitivity about 80%).
  - Higher BMI predicted larger WASO error.
  - The paper notes adolescent studies show device underestimation of sleep, "opposite to that reported by most ... studies conducted in healthy adults". (ADOLESCENT) — [Menghini et al. 2021 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8255273/)
- **Pesonen & Kuula, 2018, *JCSM*.** Polar A370, 17 children (11 y) and 17 adolescents (17.8 y), home PSG. In adolescents, sleep was underestimated by 20.6 min and WASO overestimated by 12.5 min; specificity was >0.77, better than the Actiwatch. (ADOLESCENT) — [Pesonen & Kuula 2018 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/29609722/)
- **Fitbit Charge 3 in children and adolescents (JCSM).** 56 youth, mean age 9.2 ± 3.3, about 79% with sleep apnea. Fitbit underestimated TST by 6 min and overestimated WASO by 19 min, matching or beating the ActiGraph. The paper also cites a Fitbit Charge HR adolescent study showing TST +8.0 min, sleep efficiency +1.8% and WASO −5.6 min. (PEDIATRIC, mostly clinical) — [JCSM article (PMC8020711)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8020711/)
- **Hibbing et al., 2024.** Garmin Vivofit 4, 25 youth with sleep disturbances, overnight PSG.
  - TST −0.55 ± 1.21 h.
  - The device reported sleep latency of 77 min versus 23 min by PSG, and WASO of 5 min versus 43 min.
  - "Consistently poor individual-level validity", and frequent missing data. (PEDIATRIC clinical) — [Hibbing et al. 2024 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11406596/)
- **Thigh-worn research accelerometer, 2025.** 146 adolescents aged 15–17, with and without mental disorders. TST underestimated by 51.7 min (ICC 0.88). This shows motion-based sleep detection undercounts adolescent sleep even in research devices. (ADOLESCENT, research device) — [Wilms et al. 2025, BMC Psychiatry](https://link.springer.com/article/10.1186/s12888-025-07304-2)
- **ABCD Study (abstract, SLEEP 2024).** 4,282 early adolescents (mean ~12 y) wore a Fitbit Charge 2 for 21 days. Self-reported sleep period differed from Fitbit by 40.5 min on average on weekdays, and caregivers tended to overestimate adolescents' sleep. (EARLY ADOLESCENT, abstract only.) This abstract text was retrieved from a SLEEP 2024 abstract-supplement page whose DOI belongs to a neighboring abstract; the ABCD abstract's own number was not verified. — [SLEEP 2024 abstract supplement page](https://doi.org/10.1093/sleep/zsae067.0300)
- **World Sleep Society, 2025.** Objective (actigraphy) sleep duration in adolescents is "substantially lower than questionnaire-assessed measures". The age-based duration guidelines were derived largely from self-report and time in bed. "There should be a ∼5–20% discount in measured TST compared to these recommendations." (Expert consensus) — [Chee et al. 2025, World Sleep Society](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
- **Systematic review exclusions.** The 2024 systematic review of Fitbit Charge 4, Garmin Vivosmart 4 and WHOOP excluded children. Most recent multi-device studies enrolled only adults aged 18 or older. — [Schyvens 2024](https://mhealth.jmir.org/2024/1/e52192); [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/)

### Inferences
- For a 16-year-old, a tracker reading of "6 h 50 min" may correspond to roughly 7–7.5 h of PSG sleep.
  - Interpret displayed TST against teen sleep-need recommendations with a 5–20% allowance (World Sleep Society), not literally.
  - This prevents false alarms ("I only sleep 6.5 h!"), which matter for orthosomnia risk.
- Teen data most strongly support using Fitbit-family and Oura-family algorithms for sleep timing and TST trends. Neither the deep-sleep minutes nor the WASO minutes should be acted on.
- Since current-generation devices have no adolescent validation, recommendations for teens rest on extrapolation from adult studies of the same brands plus older teen studies. The report should label them as such.

### Gaps
- No 2022–2026 PSG validation in adolescents was found for Apple Watch, Pixel Watch, current Fitbit models, Oura Gen3/4, Samsung, WHOOP, Garmin watches or Xiaomi/Huawei/Amazfit bands.
- No adolescent validation of under-mattress devices or phone apps was found.
- No adolescent data on HRV/RHR accuracy of consumer wearables was found.

---

## 3. Which metrics are reliable enough to act on, and which are not?

### Takeaway
**Act on:**
- Sleep timing (sleep onset and offset, i.e. bed and wake times).
- Regularity across days.
- Weekly averages of total sleep time.
- Long-term resting heart rate and, on the better devices, HRV trends.

**Do not act on:**
- Sleep stages ("deep sleep minutes", REM).
- Nightly WASO or sleep-latency minutes.
- Proprietary composites ("sleep score", "readiness", "body battery", "recovery").

Evidence grade: **moderate** for timing and TST trends and for RHR/HRV accuracy on named devices; **expert opinion** for how to act on them.

### Cited Findings
- **Timing.**
  - Even a $50 Xiaomi band placed sleep onset within ±30 min of PSG on 89% of nights and sleep offset on 96%, despite only about 33% wake detection. (ADULT) — [Ong et al. preprint](https://doi.org/10.1101/2023.10.12.23296981)
  - World Sleep Society: sleep onset and offset times should be shown on dashboards because they are objectively defined. Trend information over weeks "could still help inform about sleep timing", bedtime planning and avoiding bedtime procrastination. — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
  - Sleep Research Society: bedtimes and wake-up times "should only be used when self-reported or manually signaled by the users", because automatic detection approximates sleep onset and the final awakening. Otherwise use sleep diaries. — [de Zambotti et al. 2024](https://academic.oup.com/sleep/article/47/4/zsad325/7501518)
- **TST trends.**
  - A bias under 30 min is the conventional "clinically satisfactory" threshold. Fitbit Sense/Charge 5 and Apple Watch Series 8 met it in adults. — [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/)
  - Oura correctly categorized adolescents into <6 h, 6–7 h and >7 h TST bands for 81–93% of participants. — [de Zambotti 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6095823/)
  - An adolescent Oura study found the device tracked changes induced by sleep-opportunity manipulation over 2 weeks. — [Chee et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7894804/)
- **Resting heart rate and HRV (ADULT evidence).**
  - Dial et al. 2025, *Physiological Reports*: 13 adults, 536 nights, ECG chest-strap reference. Funded by the US Air Force Research Laboratory; no conflicts of interest declared.

    | Device | Nocturnal RHR CCC (MAPE) | HRV CCC (MAPE) |
    |---|---|---|
    | Oura Gen3 | 0.97 (1.7%) | 0.97 (7.2%) |
    | Oura Gen4 | 0.98 (1.9%) | 0.99 (6.0%) |
    | WHOOP 4.0 | 0.91 (3.0%) | 0.94 (8.2%) |
    | Polar Grit X Pro | 0.86 (2.7%) | 0.82 (16.3%) |
    | Garmin Fenix 6 | excluded from RHR analysis | 0.87 (10.5%) |

  - The paper notes a clinically meaningful RHR change is about 5–7 bpm or ~10% from baseline. — [Dial et al. 2025 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12367097/)
  - Methods differ by brand (for example, WHOOP weights HRV toward the last slow-wave sleep period; Polar uses a 4-h window), so absolute values are not comparable across brands. — [Dial et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12367097/)
- **Sleep stages and "deep sleep minutes" are not reliable.**
  - Nightly deep-sleep ICC was 0.13–0.36 and REM ICC 0.13–0.37. — [Robbins 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11511193/)
  - 22.5–47.7% of PSG N3 epochs were labelled "light". — [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/)
  - Deep and REM MAPE exceeded 20% for all devices. — [Kainec 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10820351/)
  - In adolescents, N3 was under- or overestimated by 20–47 min depending on the device. — [Lee X.K. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6760396/); [Chee 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7894804/)
  - World Sleep Society: "Concern over minutes or percentages of SWS/deep sleep or REM sleep must be tempered"; staging is "indicative only and ... not authoritative"; "no robust evidence that artificially increasing SWS/Deep Sleep alters outcomes". — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
- **WASO and sleep latency are not reliable.**
  - WASO MAPE was 59–138% across devices. — [Kainec 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10820351/)
  - Sleep-latency MAPE reached 159–452% for some devices. — [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/)
  - World Sleep Society: sleep latency is probably the variable with "the greatest difference between more and less accurate devices"; use only relative values. — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
- **Scores ("sleep score", "readiness").**
  - World Sleep Society: absolute scores "may currently not be comparable across manufacturers and represent a gross simplification". They are useful only for trends, and only if their constituent measures have been properly evaluated. — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
  - Without a membership, Oura shows only its three top-level scores and hides the underlying data. — [WearableBeat 2026](https://wearablebeat.com/articles/best-fitness-trackers-without-a-subscription-2026/); [Open Vital 2026](https://open-vital.com/blog/whoop-membership-cost-vs-free-alternatives)
- **Use averages, not single nights.** World Sleep Society: "Individuals should be encouraged to review 1-week averages of sleep measures rather than single nights". Weekday–weekend differences in sleep duration should be discussed. — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
- **SpO2 and apnea flags.** Significant oxygen-saturation changes should be followed up with a professional, after checking device fit, because darker skin tones may read higher than true saturation. FDA-cleared apnea screening results indicating high risk warrant medical evaluation. — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
- **Trackers alone do not improve sleep.** "the trackers themselves do not improve your sleep ... You have to change your behavior." (Kelly Glazer Baron, expert opinion) — [University of Utah Health interview, 2026](https://healthcare.utah.edu/the-scope/health-library/all/2026/09/your-sleep-tracker-stressing-you-out)

### Inferences
- Suggested "act-on" dashboard for the teen:
  1. Average sleep-onset time on school nights, week over week.
  2. Average wake time and the weekday-versus-weekend gap.
  3. 7-day average TST (with the teen-specific underestimation allowance).
  4. Night-to-night spread of sleep-onset time (regularity).
  5. Optionally, RHR and HRV 2–4-week trends, mainly as a "sick/overtrained/stressed" context flag, not a nightly verdict.
- Everything else (stages, scores, readiness, nightly sleep latency or WASO minutes) should be hidden or ignored.
- Because adolescent and insomnia-type nights are where trackers err most on wake, the diary, not the device, should be the source for "how long did it take me to fall asleep" and "how long was I awake".

### Gaps
- No validation of composite scores (Oura, Fitbit, Apple sleep score, WHOOP recovery, Garmin Body Battery) against meaningful outcomes such as daytime sleepiness or school performance was found.
- HRV/RHR accuracy data come from 13 adults. No adolescent data were found, and none for Apple, Fitbit, Samsung or budget bands in the same protocol.

---

## 4. Orthosomnia and tracker-related sleep anxiety: who is at risk, and how to use trackers healthily?

### Takeaway
"Orthosomnia" (Baron et al. 2017) describes a perfectionistic preoccupation with tracker sleep data. It can worsen insomnia, for example by spending extra time in bed to raise the tracker number. Evidence on prevalence is limited to case reports and cross-sectional surveys. Those at higher risk are people with insomnia symptoms, anxiety or perfectionism. Mitigation advice comes mainly from expert consensus: review weekly averages, don't check scores at night or first thing in the morning, turn off alerts, hide stages and scores, keep a diary, and take breaks or stop if anxiety rises. One adult RCT suggests guided interpretation of tracker data reduces insomnia severity. Evidence grade: **weak** for prevalence and harm; **expert opinion plus one moderate-quality RCT** for mitigation.

### Cited Findings
- **Baron et al., 2017, *JCSM* (case series, n=3 adults).**
  - Coined "orthosomnia".
  - Patients sought treatment for "self-diagnosed" problems such as light or restless sleep seen on trackers.
  - All three spent "excessive time in bed in attempts to increase the sleep duration reported by the sleep tracker, which may have exacerbated their insomnia".
  - Patients' beliefs persisted even after PSG showed normal deep sleep.
  - Recommendations to clinicians: explain that trackers measure movement, not EEG, and can't discriminate light from deep sleep (reading a phone in bed can be scored as light sleep); use devices to monitor sleep *pattern* and time in bed; ask for a written sleep log alongside the tracker. — [Baron et al. 2017 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5263088/)
- **Jahrami et al., 2024, *Brain Sciences* (cross-sectional, n=523).**
  - 35.8% regularly used sleep trackers.
  - Algorithm-defined orthosomnia prevalence was 3.0% (conservative), 8.6% (moderate) or 14.0% (lenient).
  - Cases had more severe insomnia; there was no age or sex difference. — [Jahrami et al. 2024](https://www.mdpi.com/2076-3425/14/11/1123)
- **Dion et al., 2025, *JMIR* (nationally representative Canadian survey, n=1,200, aged 16–88).**
  - 19.3% used sleep wearables.
  - About 45% of users felt the device had a positive effect on sleep and stress; 4.5% reported a negative effect.
  - Users reported 13 min longer sleep latency and about 1 h less sleep. After adjusting for sleep disorders, only the duration difference remained.
  - Wearable use moderated the anxiety–sleep link: users with higher anxiety showed a steeper decline in sleep duration. — [Dion et al. 2025, JMIR](https://jmir.org/2025/1/e68816)
- **Spina et al., 2023 (RCT, n=113 adults with Insomnia Severity Index ≥10).**
  - Five weeks of feedback and guidance on interpreting Fitbit and EEG-headband data, versus sleep education/hygiene.
  - Lower Insomnia Severity Index (d=0.51) and less sleep disturbance (d=0.42) post-intervention.
  - No change in the gap between self-reported and measured sleep, anxiety or depression. (ADULT) — [Spina et al. 2023 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10485571/)
- **Ojalvo et al., 2023 (small comparison).** 14 insomnia patients with Fitbit Inspire 2 plus a self-help booklet versus 12 with a paper diary. Both groups improved, with no between-group differences. "Using wearables does not necessarily exacerbate sleep worries". (ADULT; weak) — [Ojalvo et al. 2023 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/36966819/)
- **Clinician survey.** Sleep-medicine providers associate consumer sleep technology with better patient engagement but also with "increased orthosomnia and misperceptions about sleep". — [Provider survey (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10394368/)
- **Qualitative and small field study (low quality).** Participants valued the information. In the first week with a device, sleep latency increased (+10.1% on average; +33% with one device), and interviews showed orthosomnia-type anxiety. — [Aupetit et al., ergonomics conference paper](https://publications.ergonomics.org.uk/uploads/A-qualitative-study-of-sleep-trackers-usage-evidence-of-orthosomnia.pdf)
- **World Sleep Society, 2025 (expert consensus).**
  - Review 1-week averages rather than single nights.
  - Educate on acute versus chronic effects of sleep loss.
  - "For individuals where sleep tracking contributes to sleep anxiety (i.e., orthosomnia), consider taking a break from sleep tracking or discontinuing."
  - Education about metric validity may reduce anxiety. — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
- **Practical guidance from sleep specialists (expert opinion).**
  - Cheri Mah (Stanford): switch to viewing data weekly, take a break, or use a pen-and-paper journal if the data cause stress. Trackers give reliable estimates of duration, bed and wake times and schedules, but not stages. — [Stanford Lifestyle Medicine 2024](https://lifestylemedicine.stanford.edu/sleep-wearables/)
  - Harvard experts: "Don't check sleep data first thing in the morning. Start your day, decide how you feel, and then look." Ask whether you can make it through the day without exhaustion; that matters more than the numbers. — [Harvard Health 2024](https://www.health.harvard.edu/healthy-aging-and-longevity/bad-bedfellows)
  - Northwell: turn off unneeded alerts, review trends weekly, hide metrics that don't inform a decision, consider regular device-free periods. — [Northwell, The Well 2026](https://thewell.northwell.edu/sleep-health/orthosomnia)
- **Kelly Baron, 2026 interview.**
  - Ask "Is this device making you feel better or making you feel worse?"; some patients took a 2-week break and felt better.
  - Judge sleep over 1–2-week periods, not night to night.
  - Trackers typically show about 15% less sleep than people perceive, which is normal.
  - Apple renamed "light" sleep to "core" to reduce worry; about half the night is normally light/N2 sleep.
  - Orthosomnia is "not a diagnosis"; it is likely a combination of perfectionism and sleep anxiety. (expert opinion) — [University of Utah Health 2026](https://healthcare.utah.edu/the-scope/health-library/all/2026/09/your-sleep-tracker-stressing-you-out)
- **AASM 2018 position statement.** Consumer sleep technology "cannot be utilized for the diagnosis and/or treatment of sleep disorders". It "may be utilized to enhance the patient-clinician interaction". — [Khosla et al. 2018 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5940440/)

### Inferences
- This teenager is in a higher-risk group for orthosomnia: he has difficulty falling asleep and night awakenings, and is likely sensitive to a "bad score" before school. A tracker should therefore be introduced with explicit rules:
  - The device stays on the wrist but its app is not opened at night.
  - Scores and stage graphs are hidden or ignored.
  - Data are reviewed once a week (for example, Sunday) as 7-day averages.
  - "How I feel" is rated before looking at the data.
  - Time in bed is never extended to "raise the number".
  - Stop or pause for 1–2 weeks if he feels worse, checks repeatedly, or lies awake thinking about the score.
- A parent or clinician helping to interpret the data mirrors the "guided interpretation" arm of the Spina RCT, the only experimental evidence that tracker feedback can help people with insomnia symptoms. That study was in adults.

### Gaps
- No orthosomnia prevalence or intervention studies in adolescents were found.
- No trial was found testing specific mitigations: hiding scores, weekly-only viewing, or scheduled breaks.
- Device-specific "hide score" settings were not systematically verified for each brand.

---

## 5. Sleep diaries: the Consensus Sleep Diary, why diary plus tracker beats tracker alone, and good diary apps

### Takeaway
The Consensus Sleep Diary (Carney et al. 2012) is the expert-standard daily morning log. Professional bodies (AASM, Sleep Research Society, World Sleep Society) treat diaries as essential context for device data: bedtime and intended sleep time, perceived latency and awakenings, sleep quality, naps, caffeine and screen use. A diary also captures how *he* experiences sleep, which is the clinical complaint. Diaries over-report sleep relative to objective measures, and devices under-detect wake, so combining the two is the recommended approach. Evidence grade: **expert consensus**, with moderate supporting measurement data.

### Cited Findings
- **Carney et al., 2012, *SLEEP*.** The Consensus Sleep Diary was developed by an expert panel from the Pittsburgh Assessment Conference.
  - It has a "Core" diary with essential items plus optional expanded items, and was refined with focus groups of good sleepers, people with insomnia and people with sleep apnea.
  - Core diary written at about a 3rd-grade reading level; instructions at a 6th-grade level.
  - Authors called it "a living document" still needing validation. — [Carney et al. 2012 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3250369/)
- **Validation against objective measures (JCSM, 2021; n=80 community adults, 7 days).** Time-stamped online diary versus single-channel EEG and actigraphy.
  - The diary "leads to meaningful overestimations" of TST and sleep efficiency, but "sleep timing is rather accurately assessed".
  - It agreed better with actigraphy than with EEG.
  - The diary has been validated for online use. — [Consensus Sleep Diary evaluation (PMC8314633)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8314633/)
- **Diaries record what devices cannot.** Bedtime and wake-up time should be self-reported or manually marked; otherwise "sleep diaries based on third-party applications, personal digital assistants, or paper-and-pencil questionnaires should be used". — [de Zambotti et al. 2024, SRS](https://academic.oup.com/sleep/article/47/4/zsad325/7501518)
- **World Sleep Society (clinicians).** If insomnia is suspected, supplement tracker data with a sleep diary such as the free NIH/NHLBI Sleep Diary, "because sleep tracking is generally less accurate in people with insomnia ... due to more prolonged periods of quiet wakefulness in bed". — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X); [NHLBI Sleep Diary](https://www.nhlbi.nih.gov/resources/sleep-diary)
- **AASM actigraphy guideline, 2018.** Conditional recommendations to use (FDA-cleared) actigraphy in assessing pediatric insomnia and pediatric circadian rhythm sleep-wake disorders. — [AASM actigraphy CPG 2018, JCSM](https://jcsm.aasm.org/doi/10.5664/jcsm.7230)
- **Devices and logs give different information.** The World Sleep Society notes that the AASM's systematic review found actigraphy "yields significantly distinct information from sleep logs", which supports collecting both. — [Chee et al. 2025](https://www.sciencedirect.com/science/article/pii/S138994572500173X)
- **Clinical practice.** Baron et al. request "a written sleep log in addition to wearing a tracker". Some patients refused or filled the log from tracker data, which undermines its purpose. — [Baron et al. 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5263088/)
- **Providers' most common use of trackers** was "assisting patients in the completion of sleep diaries". — [Provider survey (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10394368/)
- **Specialist advice:** "You don't have to use a wearable to gain insights about your sleep. A pen and paper sleep journal can be incredibly helpful, too" (Cheri Mah). — [Stanford Lifestyle Medicine 2024](https://lifestylemedicine.stanford.edu/sleep-wearables/)

### Inferences
- Practical protocol for the teen:
  - Complete a 2-minute morning diary using the Consensus Sleep Diary core items or the NHLBI diary.
  - Add 2–3 teen-relevant optional fields: last screen use, caffeine after noon, how alert he felt in first period (0–10), naps.
  - Fill it from memory *before* opening any tracker app.
  - Keep it for 2 weeks at baseline, then during any change.
  - The diary answers "how long to fall asleep / awake at night / how refreshed"; the tracker answers "when did sleep actually start and end, and how regular is it".
- If he does not want a device at all, a diary alone is sufficient for behavior change and is what clinicians would ask for. This is the $0 tier.

### Gaps
- No validated or independently evaluated **smartphone diary apps** were found in this search. Possible options include the Consensus Sleep Diary implemented in a notes or spreadsheet app, or diary functions inside CBT-I apps (covered by another researcher). No evidence was retrieved comparing app versus paper diaries in adolescents.
- No adolescent-specific validation of the Consensus Sleep Diary was found.

---

## 6. Smart alarms / sleep-phase alarms and the snooze button

### Takeaway
**Smart alarms.** These watch a window, typically 30 minutes, before the set alarm and vibrate or ring when the device thinks you are in "light" sleep. The rationale is sound, since waking from slow-wave sleep worsens sleep inertia. However, the devices often mislabel deep sleep as light. No trial was found showing that consumer smart alarms reduce grogginess, and one lab test of a light-sleep-triggered multimodal alarm found little overall benefit. For a teen with a fixed school wake time, a smart alarm can only wake him *earlier*, up to 30 minutes, cutting already scarce sleep. Evidence grade: **weak/insufficient**.

**Snooze.** Evidence is limited and conflicting:
- A Swedish lab study in adult habitual snoozers found 30 minutes of snoozing cost about 6 minutes of sleep, avoided waking from deep sleep, and slightly helped cognition right after waking.
- A small Japanese study in university students found snoozing prolonged grogginess.
- Big-data work shows heavy snoozing goes with irregular, later schedules.

Evidence grade: **weak, conflicting** (ADULT evidence).

### Cited Findings
- **How smart wake works:**
  - Fitbit Smart Wake (since 2020) monitors the 30 minutes before the alarm and vibrates when it detects light sleep. — [Advnture 2022](https://www.advnture.com/features/why-is-garmin-still-sleeping-on-smart-wake-up-alarms)
  - Garmin added a Smart Wake alarm with a 30-minute window in 2025 (Fenix 8 and others). — [Lord of the Smart Rings 2025, quoting Garmin](https://www.lordofthesmartrings.com/garmin-fenix-smart-wake-does-it-work/)
  - Muse S Athena offers an EEG-based "Smart Wakeup" that "wakes you at the lightest moment" as a Premium feature. — [Muse S Athena product page](https://choosemuse.com/products/muse-s-athena); [Muse Premium](https://choosemuse.com/pages/premium-subscription)
  - Sleep Cycle offers a "smart snooze" that wakes users depending on sleep-cycle position. — [Robbins et al. 2025, Sci Rep](https://www.nature.com/articles/s41598-025-99563-y)
- **Rationale.** Sleep inertia "can be stronger when someone is woken up in a deeper stage of sleep, like SWS". Smart alarms "are commercially available but not validated". — [Campanella et al. 2024, Clocks & Sleep (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10969141/)
- **Lab test (Campanella et al., 2024; n=37 adults aged ~27 who reported slow waking; 4 lab nights).**
  - Multimodal alarm: room warming, then dawn-like light triggered when a mattress sensor detected light sleep within 15–30 minutes of wake time, then sound.
  - Compared with a standard alarm there was no overall change in vigilance (PVT), sleepiness or mood.
  - Subgroup effects depended on chronotype and lighting duration. Evening types with a short, abrupt light ramp (≤15 min) did *worse*; those with longer ramps did better. (ADULT) — [Campanella et al. 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10969141/); [SLEEP 2022 abstract](https://doi.org/10.1093/sleep/zsac079.201)
- **Stage-prediction accuracy.** A smartwatch smart-alarm algorithm predicted 4-class sleep stages with 66–70% accuracy (71–77% for 2 classes) in 138 nights from 92 people. No inertia outcomes were measured. — [Slyusarenko & Fedorin 2020, EMBC](https://pubmed.ncbi.nlm.nih.gov/33018943/)
- **Misclassification undermines the premise.** Consumer devices labelled 22.5–47.7% of PSG deep-sleep epochs as "light". — [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/)
- **Snooze: Sundelin et al., 2023, *Journal of Sleep Research*.**
  - Study 1 survey (n=1,732): 69% snooze at least sometimes, averaging 22 min. Snoozers were younger, more often evening types, and had more morning drowsiness and shorter sleep.
  - Study 2 within-subject lab PSG with habitual snoozers (n=31): 30 min of snoozing versus waking abruptly.
    - About 6 min of sleep was lost, but no one woke from N3 in the snooze condition.
    - Some cognitive tests (arithmetic, episodic memory) were better immediately on waking.
    - No clear effect on cortisol, sleepiness, mood or overnight sleep.
    - Bayes factors indicated much of the evidence was inconclusive.
  - Authors caution that snoozing "is most likely not for everyone". (ADULT) — [Sundelin et al. 2023 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/37849039/); [Wiley full text](https://onlinelibrary.wiley.com/doi/full/10.1111/jsr.14054); [Stockholm University release](https://www.su.se/english/news/articles/2023-10-23-you-dont-lose-if-you-snooze)
- **Snooze: Ogawa et al., 2022.**
  - Survey: 70.5% of 293 Japanese university students often snoozed, mainly from anxiety about oversleeping.
  - Lab (n=10): snoozing increased wake and N1 sleep in the last 20 min, slowed reaction times and lowered vigor after waking.
  - Conclusion: snoozing "prolongs sleep inertia". (Young-adult evidence; very small) — [Ogawa et al. 2022 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9804954/)
- **Snooze: Mattingly et al., 2022, *SLEEP* (n=450 working adults, wearables).** 57% habitually snoozed; snoozers had lighter sleep and higher resting heart rate overnight. Reported as summarized in Ogawa 2022; primary source not retrieved. — [cited in Ogawa et al. 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9804954/)
- **Snooze: Robbins et al., 2025, *Scientific Reports*.** Sleep Cycle app data, 21,222 users, 3,017,276 sleep sessions, co-authored with Sleep Cycle.
  - 55.6% of sessions ended with a snooze, averaging 2.4 presses and 10.8 min.
  - "Heavy" snoozers (45% of users, snoozing on >80% of mornings) averaged 20 min.
  - Snoozing was more frequent after later-than-usual bedtimes, and heavy snoozers had more erratic schedules.
  - Authors' message: set the latest possible alarm and get up at the first one. (ADULT, observational) — [Robbins et al. 2025](https://www.nature.com/articles/s41598-025-99563-y); [EurekAlert release](https://www.eurekalert.org/news-releases/1084308)

### Inferences
- **Smart alarm for this teen.**
  - If he wants one, set the window to end at his latest acceptable wake time, not earlier.
  - Treat it as a gentle wake aid (vibration that doesn't wake family), not as a sleep-inertia cure.
  - Light-based waking (dawn simulation) has a separate, more physiological evidence base, covered by the light/gadgets researcher; Campanella's subgroup effects were driven by lighting duration.
- **Snooze.**
  - Simplest evidence-aligned advice: set one alarm for the real get-up time, place the phone or alarm away from the bed, and get up on the first alarm.
  - Habitual heavy snoozing is better read as a sign of insufficient or late-timed sleep than fixed by gadgets.
  - Occasional short snoozing is unlikely to be harmful (Sundelin), but it is not a strategy.
  - Data come from adults and young adults; no adolescent snooze trials were found.

### Gaps
- No RCT was found of any consumer smart alarm (Fitbit, Garmin, Sleep Cycle, Muse, WHOOP) on sleep inertia, mood or school-morning functioning.
- No adolescent studies of snoozing or smart alarms were found.
- The primary Mattingly 2022 paper was not retrieved.

---

## 7. Phone features (iOS Sleep Focus / bedtime schedule, Android Bedtime mode, Screen Time / app limits) and snore-recording apps

### Takeaway
No studies were found that directly test iOS Sleep Focus, Downtime, Android Digital Wellbeing Bedtime mode or app limits on sleep outcomes. Indirect experimental evidence suggests that stopping phone use before bed helps somewhat. In one adolescent within-subject study it meant 17 minutes earlier lights-out and 21 minutes more sleep. Blue-light filters such as Night Shift did not help in an RCT. So phone features are best viewed as tools to *enforce* a phone curfew, not as sleep aids in themselves. Snore apps such as SnoreLab reasonably detect heavy snoring but cannot screen for sleep apnea, and the commercial apnea features on Apple Watch and Samsung Galaxy Watch are not intended for under-18s and under-22s respectively. Evidence grade: **weak**.

### Cited Findings
- **Bartel et al., 2018 (within-subject, n=63 adolescents aged 14–18, mean 16.3 y, 17% male).** Individualized phone "stop time" 1 h before bed for one school week.
  - Phones stopped 80 min earlier, lights out 17 min earlier, and sleep was 21 min longer.
  - Only 26% of approached teens agreed to take part, signalling low motivation. (ADOLESCENT) — [Bartel et al. 2018 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/29313721/)
- **He et al., 2020 (pilot RCT, n=38).** Avoiding the phone 30 min before bed for 4 weeks reduced sleep latency, increased sleep duration and quality, and reduced pre-sleep arousal. (ADULT/young adult) — [He et al. 2020 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/32040492/)
- **Duraccio et al., 2021, *Sleep Health* (RCT, n=167 aged 18–24, 7 nights, actigraphy).** Compared iPhone use with Night Shift, without Night Shift, and no phone in the hour before bed.
  - No differences across groups overall.
  - Among those sleeping >6.8 h, no phone gave better sleep efficiency and WASO than phone use with Night Shift.
  - Authors conclude stimulating content and arousal, not blue light, likely drive the effect. (Young-adult evidence) — [Duraccio et al. 2021 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/33867308/)
- **In-bed phone use confuses trackers.** All devices misclassified some motionless wake (phone use in bed) as sleep. Budget bands were worse, sometimes registering sleep onset before bedtime. — [Willoughby et al. 2024](https://www.sleephealthjournal.org/article/S2352-7218(24)00032-9/fulltext)
- **Snore apps.**
  - SnoreLab versus home polygraphy, 19 healthy adults (Klaus et al. 2021): for snoring on more than 50% of the night, accuracy was 94.7%, sensitivity 100% and specificity 94.1%. At lower thresholds specificity was about 54–57%. The app overestimated snoring and **could not detect obstructive events**. Authors: should not be used for OSA screening. — [Klaus et al. 2021 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8304057/)
  - SnoreLab versus in-hospital PSG, 19 suspected-OSA patients (Trecca et al. 2024): no significant correlation between Snore Score and apnea-hypopnea index (AHI). Simple snorers and severe OSA had similar Snore Scores. — [Trecca et al. 2024, Applied Sciences](https://www.mdpi.com/2076-3417/14/12/5063)
  - Shiao et al. 2024: 60 diagnosed OSA patients, SnoreLab, Anti Snore Solution and Sleep Cycle on phones 15 cm from the bed.
    - SnoreLab Snore Score correlated modestly with log-AHI (rs≈0.37).
    - AUC was 0.88 for AHI ≥15 in this OSA-enriched sample.
    - Larger studies are needed. — [Shiao et al. 2024, Nat Sci Sleep (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11127649/)
  - SnoreLab's own disclaimer: it is not intended to diagnose or treat sleep apnea. — [Klaus et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8304057/)
- **Wearable apnea features.**
  - Apple Watch sleep apnea notifications (FDA 510(k), Sept 2024) "are not intended for use if you ... are under 18 years old". — [Apple Support](https://support.apple.com/guide/watch/receive-sleep-apnea-notifications-apd4e7713562/watchos); [Apple Support requirements](https://support.apple.com/en-us/120031); [AASM news](https://aasm.org/apple-watch-series-11-offers-new-sleep-features/)
  - Samsung's sleep apnea feature (FDA De Novo, Feb 2024) is for users **22 or older**, and was validated in 470 adults aged 22+. — [Samsung IFU](https://images.samsung.com/samsung-health/ifu/IFU_SLEEP-APNEA_US.pdf); [Samsung Newsroom](https://news.samsung.com/us/samsung-sleep-apnea-feature-galaxy-watch-first-its-kind-authorized-us-fda)
- **Professional evaluation.** "A patient tracking their snoring may be at risk for obstructive sleep apnea and may require validated testing." People with ongoing sleep problems or excessive daytime sleepiness should see a licensed provider "regardless of what their wearable ... tells them". — [Khosla et al. 2018 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5940440/); [AASM press release](https://aasm.org/consumer-sleep-technology-position-statement/)

### Inferences
- Use iOS Sleep schedule with Sleep Focus, or Android Bedtime mode, to automate a fixed "phone curfew" (for example 30–60 min before target lights-out):
  - silence notifications;
  - grayscale screen (Android);
  - optional Screen Time/Digital Wellbeing limits on the most engaging apps.
- The supporting evidence is for the *behavior* (less pre-bed phone use), not for any specific feature. Night Shift or blue-light filters alone should not be expected to help.
- A snore-recording app is a reasonable free way to check one or two nights for loud, frequent snoring or gasp-after-silence episodes. A positive or worrying recording is a reason for a doctor visit, not a diagnosis. A quiet recording does not rule out sleep apnea. Medical red flags are covered by another researcher.
- For a 16-year-old, adult-only FDA apnea features should not be relied on, and are not labelled for his age.

### Gaps
- No studies of iOS Sleep Focus/Downtime, Android Bedtime mode or app-limit features on any sleep outcome were found.
- No adolescent validation of snore apps was found.
- Built-in Sleep Cycle snore detection accuracy beyond Shiao 2024 was not found.

---

## 8. Sleep neurotech headbands and other "sleep improvement" gadgets: evidence, price, and suitability for a 16-year-old

### Takeaway
Evidence ranges from small, company-sponsored adult trials (Elemind; Somnee-type transcranial stimulation) to essentially none for sleep outcomes (Muse S Athena, Apollo Neuro, Hapbee, Kokoon, Ozlo). No device has been tested in adolescents. All are expensive ($250–$475 plus subscriptions) and none target a likely driver of teen sleep-onset problems, delayed circadian timing (covered elsewhere). **Not recommended for a 16-year-old**, except possibly comfortable sleep earbuds for noise, a bedroom-environment question covered by another researcher. Evidence grade: **weak** (Elemind, tES); **insufficient/none** (others).

### Cited Findings
- **Elemind** (EEG headband delivering acoustic pulses phase-locked to alpha waves).
  - Bressler et al. 2024: randomized, sham-controlled crossover at home.
    - 21 adults aged 22–44 with sleep latency over 30 min (13 women).
    - EEG-scored weekly mean sleep latency fell from 35.8 to 25.3 min (−10.5 ± 15.9 min, ~29%).
    - 81% fell asleep within the 30-min stimulation period versus 50% on sham nights.
    - Authors and sponsor are Elemind. — [Bressler et al. 2024 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11156862/); [ClinicalTrials.gov NCT05743114](https://clinicaltrials.gov/study/NCT05743114)
  - Marketing claims "76% of people fell asleep faster ... on average 48% faster".
  - It will not work for people who cannot hear the audio.
  - Price $399 on the official store; $349 seen elsewhere. Optional app membership $6.99/mo (annual) or $12.99/mo; core features work without it. — [Elemind store](https://elemindtech.com/products/elemind); [alternate listing with membership terms](https://cortexpharm.com/products/elemind.html)
- **Somnee** (personalized transcranial electrical stimulation headband).
  - Evidence listed by the company: Ayanampudi et al. 2023, *Frontiers in Human Neuroscience* ("initial findings"; co-authored by Matthew Walker), and a 2025 company white paper on medRxiv. Sample sizes and design were not verified here. — [Somnee clinical studies page](https://somneesleep.com/pages/clinical-studies)
  - Price: $299 upfront plus $18/month, or $429 including an annual membership. The membership (now $160/yr from Sept 2025) is *required*, because the hydrogel electrodes last only 3–4 uses. — [Somnee product](https://somneesleep.com/products/smart-sleep-headband-sage-with-annual-subscription); [membership](https://somneesleep.com/products/somnee-sleep-service-membership); [price change FAQ](https://somnee-v2.gorgias.help/en-US/articles/account-and-membership-311518)
- **Related tES evidence (manufacturer not verified).** Randomized, patient-blind crossover of a wearable 0.75 Hz transcranial stimulation in adults with sleep-onset insomnia: sleep latency −53% versus baseline, compared with −30% for a 25 Hz active control, which showed order effects suggesting placebo. Sleep latency was actigraphy-based (Fitbit). (ADULT) — [Frontiers in Neuroscience 2024 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11537953/)
- **Muse S Athena** (EEG meditation and sleep headband): $474.99; smart wake-up and sleep features need a Premium subscription. No sleep-outcome RCT was found. — [Muse S Athena](https://choosemuse.com/products/muse-s-athena); [Muse Premium](https://choosemuse.com/pages/premium-subscription)
- **Apollo Neuro** (vibration wearable).
  - The company cites a company-sponsored observational preprint of 985 adults who also owned Oura or Apple Watch, reporting about 46 more minutes of sleep and 77% lower odds of sleeping under 6 h. This design is highly prone to bias.
  - A small waitlist-controlled RCT (n=66 medical and pharmacy students) found less burnout at 12 weeks but measured no sleep outcome and had no placebo device.
  - Studies enrolled people aged 18+; a pediatric ADHD trial is recruiting. — [Apollo research page](https://apolloneuro.com/pages/apollo-neuro-research); [McKennon et al. 2025 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/40816518/)
- **Kokoon Nightbuds** (sleep earbuds with tracking): $249.99 at 2022 launch. The Verge's review found sleep tracking unreliable (nights not tracked or synced) and the alarm failed to wake the reviewer. No peer-reviewed evidence was found. — [The Verge 2022](https://www.theverge.com/22915014/kokoon-nightbuds-wearable-sleep-tracker)
- **Ozlo Sleepbuds 2** (successor to the discontinued Bose Sleepbuds): $279 in 2026, versus about $350 for the first Ozlo model in 2025. Passive noise blocking plus masking sound, in-ear alarm, sleep-pattern insights. No peer-reviewed efficacy trial was found. Ozlo's medical advisory board includes sleep researchers, including Rebecca Robbins. — [Ozlo product page](https://ozlosleep.com/products/sleepbuds); [CNN Underscored 2025](https://www.cnn.com/cnn-underscored/reviews/ozlo-sleepbuds)
- **Dreem** (EEG headband): the most accurate wearable sleep stager (κ 0.76) but no longer a consumer product (~USD 1,600, research use), and not tolerated by at least 25% of participants. — [Ong et al. preprint](https://doi.org/10.1101/2023.10.12.23296981); [Sleep Health](https://www.sleephealthjournal.org/article/S2352-7218(23)00267-X/fulltext)
- **Professional context.** Consumer-sleep-technology interventions "are not substitutes for treatments that have undergone rigorous scientific investigation". — [Khosla et al. 2018 (AASM)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5940440/)

### Inferences
- For a 16-year-old:
  - None of the neurostimulation headbands have pediatric or adolescent data.
  - The best one (Elemind) produced roughly a 10-minute reduction in sleep latency in 21 adults, in a company-run trial.
  - Prices of $350–$475 plus recurring fees compare poorly with free behavioral approaches (CBT-I techniques, schedule and light timing, covered by others).
  - Electrical stimulation of a developing brain without adolescent safety data is an additional reason for caution.
- If the family wants to spend money on a gadget, a well-validated basic tracker (for timing) or bedroom-environment items (covered elsewhere) are better value.
- Sleep earbuds may help if noise is a documented problem, but are not proven sleep treatments.

### Gaps
- Stated minimum user ages for Elemind, Somnee, Muse and Hapbee were not found.
- No Hapbee evidence or price was retrieved.
- No Apollo Neuro price was retrieved.
- No independent replication of the Elemind or Somnee trials was found, and full results of the 200-person Elemind registry were not found.
- Which company makes the 0.75 Hz tES device was not verified.

---

## 9. Price tiers in 2026, best-value picks for a teenager, and privacy for minors' health data

### Takeaway
A useful setup costs $0–$100:
- **$0:** diary plus the phone's built-in bedtime tools.
- **~$50:** a basic band for sleep timing only.
- **~$80–160:** a Fitbit-family tracker, which has the most adolescent validation, allows teen accounts and has no required subscription.

Premium options do not fit a 16-year-old well:
- **Oura** requires users to be 18+ under its terms, plus about $70/yr.
- **WHOOP** charges $199–$359/yr, and its privacy policy tells under-18s not to register.
- **Galaxy Ring** costs $399 and has no PSG validation found.

Privacy terms vary. Pick a platform that explicitly allows teen accounts, and keep data sharing minimal. Evidence grade: prices and terms are factual from manufacturer and retail sources. "Best value" is an **inference**.

### Cited Findings

**Subscription models**
- **Oura Ring 4:** from $349. Membership $5.99/mo or $69.99/yr in the US; $6.99/mo or $79/yr in the "rest of world"; €5.99/mo in the EU. Without a membership the app shows only the three scores. — [Oura membership](https://ouraring.com/membership); [Open Vital 2026](https://open-vital.com/blog/whoop-membership-cost-vs-free-alternatives)
- **WHOOP** (hardware included in membership): One $199/yr (WHOOP 5.0), Peak $239/yr, Life $359/yr (WHOOP MG). Data stop updating when payment stops. — [WHOOP membership](https://www.whoop.com/us/en/membership/); [Open Vital 2026](https://open-vital.com/blog/whoop-membership-cost-vs-free-alternatives)
- **Google/Fitbit:** Premium (transitioning to "Google Health Premium") about $9.99/mo and optional; core sleep tracking is free. The Fitbit Charge 6 has historically included 6 months of Premium. — [Sleep Health Hub 2026](https://sleephh.com/signal/sleep-tracker-subscription-cost/); [WearableBeat 2026](https://wearablebeat.com/articles/best-fitness-trackers-without-a-subscription-2026/)
- **Optional subscriptions:** Garmin Connect+ $6.99/mo (core sleep metrics free); Amazfit Zepp Aura Premium $11.99/mo (no measurement gated).
- **No subscription:** Samsung (free "today"), Apple (no measurement fees), RingConn. — [WearableBeat 2026](https://wearablebeat.com/articles/best-fitness-trackers-without-a-subscription-2026/)

**Device prices (USD, 2025–2026; street prices vary)**

| Device | Approx. price | Notes |
|---|---|---|
| Xiaomi Smart Band 10 | $45–55 | US availability seller-dependent |
| Amazfit Band 7 | $49.99 | |
| Samsung Galaxy Fit3 | $59.99 | Android only |
| Huawei Band 10 | ~$60 | |
| Fitbit Inspire 3 | $99.95, often ~$80 | |
| Google Fitbit Air | $99–99.99 | screenless, new 2026 |
| Amazfit Helio Strap | $99.99 | no subscription |
| Fitbit Charge 6 | $159.95, sales ~$100–120 | |

— [Fitcoin 2026](https://www.fitcoin.co/articles/best-fitness-tracker-under-100); [WatchRanker 2026](https://watchranker.com/the-best-cheap-fitness-trackers-for-2026/)

| Device | Approx. price | Notes |
|---|---|---|
| Polar Loop | $199.99 | no subscription |
| Withings Sleep (under-mattress) | $199.95 at Withings; ~$165–169 on Amazon; €149.95 in EU | |
| Garmin Index Sleep Monitor | $169.99 | |
| Google Nest Hub 2nd gen (radar Sleep Sensing) | $99.99 | Sleep Sensing "preview at no extra charge"; worst validation results |
| Apple Watch SE 3 | ~$249 | |
| Pixel Watch 4 | from $349.99 | Android only |
| Samsung Galaxy Ring | $399.99 | Android 11+ only; no iOS |

— [Sleep Health Hub 2026](https://sleephh.com/signal/sleep-tracker-subscription-cost/); [Tom's Guide 2025](https://www.tomsguide.com/wellness/sleep-tech/withings-sleep-analyzer-vs-garmin-index-sleep-monitor); [Withings EU](https://www.withings.com/en-eu/products/sleep-analyzer); [Google Store](https://store.google.com/us/product/nest_hub_sleep_sensing?hl=en-US); [UMA Technology 2026](https://umatechnology.org/the-best-10-fitness-trackers-of-2026/); [WatchRanker Fitbit 2026](https://watchranker.com/best-fitbit-2026-google-smartawatches-and-band-style-trackers/); [Smart Home Explorer 2026](https://www.smarthomeexplorer.com/guides/best-fitness-trackers-2026); [hotukdeals 2026](https://hotuk.deals/fitness-trackers-smart-rings-uk/)

**Age limits and privacy terms**
- **Oura:** Terms and Conditions require users to represent they are "at least 18 years of age". — [Oura Terms](https://ouraring.com/terms-and-conditions)
- **WHOOP:** the Terms of Use allow age 13+ (with parental consent below the age of contract, and possibly 18+ in some countries). The Privacy Policy says: "If you are under the age of 18, please do not attempt to register for the Services". The documents conflict. WHOOP Advanced Labs are not for under-18s. WHOOP states it does not sell consumer health data. — [WHOOP Terms](https://www.whoop.com/us/en/whoop-terms-of-use/); [WHOOP Privacy Policy](https://www.whoop.com/us/en/full-privacy-policy/)
- **Fitbit/Google:** under-13s (or higher local minimum) need parental consent. Teens 13+ can hold their own account, but features such as the Fitbit ECG app and health coaching are not available to teens. Fitbit says it never sells personal information and shares data with service providers and when legally required. A Google account is now required. — [Fitbit Terms](https://support.google.com/product-documentation/answer/14816019?hl=en); [Fitbit privacy for kids and teens](https://support.google.com/fitbit/answer/14236600); [Fitbit children's account policy](https://support.google.com/product-documentation/answer/14874452?hl=en)
- **Summary table (Australian Sports Commission):** Apple requires parent/guardian consent for under-13s; Fitbit 13+; Oura 18+; Polar consent for under-13s; WHOOP 13+. Its advice: read terms and privacy policies before consenting. — [AIS privacy advice on wearables](https://www.ais.gov.au/ati/general-privacy-advice-on-using-wearables)
- **Medical-grade features:** sleep apnea notifications are age-restricted: Apple 18+, Samsung 22+. — [Apple Support](https://support.apple.com/en-us/120031); [Samsung IFU](https://images.samsung.com/samsung-health/ifu/IFU_SLEEP-APNEA_US.pdf)
- **Oura data use:** Oura's terms state it may "use, process, or share" information users provide "consistent with ... the Privacy Policy", and disclaim liability "even if that information constitutes electronic patient health records". — [Oura Terms](https://ouraring.com/terms-and-conditions)

**Accuracy context for budget picks**
- Low-cost bands (Xiaomi Mi Band 7, Axtro) had poor wake detection but acceptable sleep onset/offset timing; authors suggest they could "log sleep periods over the long-term". — [Ong et al. preprint](https://doi.org/10.1101/2023.10.12.23296981)
- Fitbit-family devices have the most adolescent PSG studies. — [Lee X.K. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6760396/); [Menghini 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8255273/)
- Fitbit-family devices performed in the upper tier in adult multi-device studies. — [Schyvens 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12038347/); [Ong 2023](https://www.sleephealthjournal.org/article/S2352-7218(23)00267-X/fulltext)

### Inferences

**Suggested tiers for a 16-year-old (2026, approximate USD; verify local availability)**
- **Tier 0 — $0 (recommended starting point for everyone):**
  - 2-week Consensus Sleep Diary or NHLBI diary.
  - iOS Sleep schedule with Sleep Focus, or Android Bedtime mode, to automate a phone curfew.
  - One alarm placed across the room.
  - Optional one-night snore recording with a free app if snoring is suspected.
- **Tier 1 — ~$45–60:**
  - Xiaomi Smart Band 10, Huawei Band 10, Amazfit Band 7, or Galaxy Fit3 (Android).
  - Good enough for bed and wake timing and regularity over weeks; ignore its stages, scores and night-wake counts.
- **Tier 2 — ~$80–160 (best value for this teen):**
  - Fitbit Inspire 3 (often ~$80), Fitbit Air (~$99) or Fitbit Charge 6 (~$100–160).
  - Reasons: the Fitbit algorithm family has the deepest adolescent validation history, teen accounts are allowed, and core sleep data are free.
  - Alternative: Amazfit Helio Strap ($99.99, no subscription), but no PSG validation was found.
- **Tier 3 — ~$165–250:**
  - Withings Sleep (under-mattress) if he refuses to wear anything; fair staging, decent TST in adults.
  - Apple Watch SE 3 (~$249) if he already uses an iPhone and wants a watch anyway.
- **Tier 4 — $350+:** Pixel Watch 4 or Galaxy Watch-class smartwatches. These are only worthwhile if bought as a smartwatch for other reasons; no sleep-accuracy advantage over Tier 2 is proven.
- **Not recommended for him:**
  - Oura Ring 4 (terms require 18+; subscription).
  - WHOOP (privacy policy says under-18s should not register; $199–359/yr).
  - Galaxy Ring ($399; no PSG validation found; Android only).
  - Neurotech headbands ($299–475+ plus fees; adult-only evidence).
  - Relying on apnea-notification features (not labelled for his age).

**Privacy practices for a minor (inference)**
- Create the account with a parent's knowledge and in line with the platform's age rules.
- Turn off social, sharing and leaderboard features.
- Don't connect third-party apps unless needed.
- Avoid entering extra health details.
- Learn where to export or delete data.
- Prefer platforms whose policy says they don't sell personal or health data.
- Remember that data reflect bedtimes and nighttime phone habits, which are sensitive within a family. Agree up front on who can see what, which also reduces orthosomnia and conflict.

### Gaps
- Exact current prices change frequently and differ by country. Several prices come from 2026 retail and review sites, not manufacturers, and the Russian or CIS availability and pricing of Fitbit, Apple, Oura and WHOOP were not checked.
- No primary sources were retrieved on legal protection of minors' wearable data: HIPAA non-applicability, COPPA (under 13), GDPR Article 8 digital-consent ages (13–16 by country), Washington's My Health My Data Act, or Russian personal-data law. The report should not make specific legal claims without verification.
- Teen-account terms for Garmin, Samsung Health, Xiaomi (Mi Fitness), Huawei Health and Amazfit (Zepp) were not checked.
- The current (2026) status of Google Nest Hub Sleep Sensing beyond the store page could not be confirmed.
