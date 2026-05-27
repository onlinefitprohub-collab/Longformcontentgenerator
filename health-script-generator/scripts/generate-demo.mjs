import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let ts = 1746057600000; // May 1 2026 00:00 UTC
const tick = (mins = 2) => { ts += mins * 60_000; return ts; };

// ── Messages ──────────────────────────────────────────────────────────────────

const messages = [

// ── WELCOME ───────────────────────────────────────────────────────────────────
{
  role: "assistant", stageId: 0, timestamp: tick(0),
  content: `Let's begin with a quick context check before we dive into your expertise.

**Stage 0 — Context & Platform Brief**

Before I interview you, I want to make sure everything we create is built for the right environment. Please answer these four questions:

**1. Platform** — Where will these videos primarily live? (e.g. YouTube, a course platform, Instagram, a membership site, or a combination?)

**2. Video length** — What's your intended length range? (e.g. 10–20 minutes, 20–40 minutes, 45+ minutes?)

**3. Audience stage** — Do you have an existing audience, or are you building from scratch?

**4. Primary goal** — What is the main purpose of this video library? (Authority building, lead generation, course sales, pure education, or a mix?)`
},

// ── STAGE 0 ───────────────────────────────────────────────────────────────────
{
  role: "user", stageId: 0, timestamp: tick(4),
  content: `1. YouTube primarily — that's my main channel. I also repurpose to Instagram Reels and send highlights to my email list of about 3,000 people.
2. 15–20 minutes. I've tested shorter and the drop-off was worse, interestingly. My audience stays for the depth.
3. I have an existing audience — around 4,200 YouTube subscribers and that email list. Engaged but small. I'd call it early-growth stage.
4. Mixed goal but weighted toward authority and lead generation. I run a 6-month Menopause Optimisation Programme — £3,800, 1:1 with me. The videos need to attract women who are ready to invest in their health, not just people looking for quick fixes.`
},
{
  role: "assistant", stageId: 0, timestamp: tick(2),
  content: `Perfect. This gives me everything I need to calibrate the entire content library. A few notes I'll carry through everything:

- **YouTube-first**, 15–20 minutes — so each script needs strong YouTube-retention architecture: a killer hook in the first 30 seconds, chapter breaks, and at least three "stay with me" moments per video.
- **Lead generation for a premium £3,800 programme** — every video should subtly qualify and warm the right viewer. We'll weave in your process, your philosophy, and your results rather than just pure education.
- **Early-growth but engaged audience** — we'll build both authority content (that performs in search) and community-building content (that deepens trust with existing subscribers).

Stage 0 complete. Moving to Stage 1.

---

**Stage 1 — Practitioner Background**

I want to understand who you are and what makes your perspective distinctive. Let's start broadly:

1. What are your formal qualifications and training — and where did you practise before moving into your current focus?
2. How long have you been in practice, and when did menopause become your specialism rather than just part of a broader remit?
3. What is it about menopause that captured your clinical attention — was there a moment, a patient, or a realisation that shifted your focus?`
},

// ── STAGE 1 ───────────────────────────────────────────────────────────────────
{
  role: "user", stageId: 1, timestamp: tick(5),
  content: `I'm a GP by background — trained at King's College London, qualified in 2005, worked in NHS general practice for about eight years. During that time I did a diploma in obstetrics and gynaecology and I was always the doctor colleagues referred their "difficult" women's health cases to.

The shift happened in 2013. I had a patient — a 44-year-old headteacher, incredibly capable woman, came to me convinced she had early-onset dementia. She was forgetting words mid-sentence, couldn't hold her train of thought, had become terrified of her own mind. She'd seen a neurologist. She'd had a brain scan. Everything was normal, and she was being offered antidepressants. I ran a hormonal panel on a hunch. Her oestradiol was in the boots. She was in perimenopause. Six months after starting HRT she sent me a card saying she felt like herself again. That was the moment.

I then did the British Menopause Society training, then an advanced diploma in nutritional medicine, then trained under Dr. Louise Newson. I've now been exclusively focused on perimenopause and menopause for the last nine years. I run a private clinic in Harley Street and the online programme.`
},
{
  role: "assistant", stageId: 1, timestamp: tick(2),
  content: `That story about the headteacher is extraordinary — and it speaks directly to one of the most urgent failures in women's healthcare. I want to dig into what makes your approach distinct, because "menopause specialist" covers a wide spectrum.

1. You mentioned you trained under Dr. Louise Newson and have a diploma in nutritional medicine alongside your BMS training. How does that nutritional medicine lens change how you approach a patient compared to a standard menopause clinic?
2. You said you run a Harley Street clinic alongside your online programme. What do you see in the patients who come to you compared to what they've already been told by their previous doctors — is there a consistent pattern of misdiagnosis or missed opportunity?
3. What do you consider your clinical signature — the thing you do that most menopause specialists don't?`
},
{
  role: "user", stageId: 1, timestamp: tick(6),
  content: `The nutritional medicine training changed everything for me. Standard menopause care is very hormone-focused — which is right, hormones are the foundation — but it misses the downstream effects completely. If a woman has severe gut dysbiosis, she will metabolise her oestrogen poorly. If she has chronically elevated cortisol from years of overworking, her progesterone gets stolen to make more cortisol. If she's insulin resistant, her hot flushes will be worse and her sleep will be shattered. I treat the full hormonal ecosystem, not just one lever.

The pattern I see constantly: women who've been told "your bloods are normal" when their bloods haven't been properly interpreted, or they've been given a low dose of oestrogen that's slightly better than nothing but hasn't actually moved the needle. They arrive exhausted, often with a new anxiety diagnosis or an antidepressant prescription, sometimes having been told their symptoms are psychological. The ones who've been most let down are women in their early-to-mid forties who are in perimenopause but keep being told they're "too young."

My clinical signature is probably this: I optimise, I don't just treat. Most doctors aim to get symptoms under control. I aim to get women to a point where they feel better than they did in their thirties — better sleep, better cognition, better body composition, better libido. That's not unrealistic. It's achievable. But it requires looking at the whole picture.`
},
{
  role: "assistant", stageId: 1, timestamp: tick(2),
  content: `"Optimise, not just treat" — that's a genuinely distinctive positioning and I'll build that into the content DNA. The full hormonal ecosystem approach, the cortisol-progesterone connection, the gut-oestrogen link — these are all powerful educational angles that will set your videos apart from generic HRT content.

Stage 1 complete. Moving to Stage 2.

---

**Stage 2 — Patient and Client Transformation Stories**

These stories will become the narrative backbone of your most powerful videos. Walk me through three to five real, anonymised cases that capture the range of what you see and the difference your approach makes.

For the first case, take me right to the beginning: who was the patient, what was their presenting problem, and what had they already tried before they found you?`
},

// ── STAGE 2 ───────────────────────────────────────────────────────────────────
{
  role: "user", stageId: 2, timestamp: tick(7),
  content: `**Case 1 — The Anxiety Spiral**
Rachel, 46, senior barrister. Came to me after 18 months of escalating anxiety she'd never experienced before. She'd had CBT, tried two different SSRIs (both made her worse), and was being assessed for an anxiety disorder. Her husband had suggested she might be "burning out." She was getting heart palpitations that her cardiologist said were benign. She was sleeping four to five hours a night, waking at 3am with her mind racing.

When I took a detailed history, the anxiety had started around the same time her periods became irregular — every five to eight weeks rather than her normal 28-day cycle. Her oestradiol was low-normal but her progesterone in the luteal phase was almost undetectable. She had virtually no progesterone. I started her on body-identical progesterone and transdermal oestradiol. Within six weeks the 3am waking stopped. Within three months the palpitations had gone. She described it as "the volume being turned down on everything." She's now completely off all anxiety medication.

**Case 2 — The Weight Mystery**
Diane, 51, PE teacher. Extremely fit — she exercised twice a day, was meticulous about her diet, had a personal trainer. She'd gained 14 pounds over 18 months and couldn't shift it regardless of what she did. Her GP had tested her thyroid (normal) and told her this was "just what happens" in menopause. She was devastated because her entire professional identity was built around being physically strong and lean.

What I found: she was doing far too much high-intensity exercise. For a perimenopausal woman with already elevated cortisol, two sessions a day of high-intensity work was essentially pouring petrol on a fire. Her cortisol was chronically elevated, she was insulin resistant (not diabetic, but heading there), and her sleep was poor. I restructured her exercise completely — strength training as the priority, steady-state cardio only, one session per day maximum. Combined with HRT and a targeted nutrition approach, she lost the 14 pounds over four months and her body composition changed significantly.

**Case 3 — The Invisible Perimenopause**
Kate, 38, marketing director. Came to me because she'd heard my podcast interview and recognised herself. She was not technically in menopause — still having regular periods — but she was experiencing: rage episodes completely out of character for her, debilitating PMS she'd never had in her twenties, migraines around her period, extreme fatigue, and a complete loss of libido that was affecting her marriage. She'd been told twice by her GP that she was "too young for menopause."

She had early perimenopause. Her hormone levels were fluctuating wildly — classic perimenopausal pattern. I treated her with progesterone in the second half of her cycle, dietary modifications to support oestrogen clearance, and specific supplements. The rage episodes stopped. The PMS reduced by about 80%. The migraines became manageable. She told me it had saved her marriage.`
},
{
  role: "assistant", stageId: 2, timestamp: tick(3),
  content: `These are incredibly powerful cases — each one illustrates a different facet of the diagnostic failure that's happening at scale. Rachel's progesterone deficiency being treated as an anxiety disorder, Diane's exercise-cortisol connection being completely missed, Kate's perimenopause being dismissed because of her age — these are the stories that will resonate viscerally with your audience.

A few follow-up questions to deepen the Case 2 and Case 3 narratives:

**On Diane:** You mentioned restructuring her exercise and she lost the weight. Did she resist that advice initially? I imagine telling a PE teacher to exercise less is a difficult conversation — how did you frame it and what was her reaction?

**On Kate:** You said it "saved her marriage." Can you tell me more about what the rage episodes were doing to her relationships — and when you explain to a 38-year-old that she's in perimenopause, what does that conversation look like? What's the emotional reaction?`
},
{
  role: "user", stageId: 2, timestamp: tick(5),
  content: `**On Diane:** She was horrified initially. She literally said "are you telling me I've been making myself fat by exercising too much?" I had to explain the cortisol-insulin-fat storage cascade very carefully — that for a body under the hormonal stress of perimenopause, adding excessive exercise stress is like asking someone with a broken leg to run a marathon. Her body was in crisis mode and storing everything it could. Once I showed her the science and explained that strength training would actually change her body composition more effectively than two cardio sessions a day, she bought in. She now tells her PE students about it — she became a complete convert.

**On Kate:** The rage was the thing that scared her most. She described going from zero to "seeing red" over things like her husband loading the dishwasher wrong. She knew it was irrational in the moment but couldn't stop it. She'd shouted at her children twice in ways that haunted her. She was starting to wonder if she had a personality disorder.

When I told her she was in perimenopause at 38, the first response was disbelief — "but I'm having normal periods." Then it was grief, briefly. Then enormous relief. She cried in my office. She said "so I'm not going mad." That's the sentence I hear more than any other. Women who've been gaslit for years — told it's stress, anxiety, depression, burnout — and they come in and I tell them there is a physiological explanation for everything they're experiencing. The relief is profound.

I have two more cases if useful — one involving bone density and one involving a misdiagnosed thyroid issue that was actually hormonal.`
},
{
  role: "assistant", stageId: 2, timestamp: tick(2),
  content: `"So I'm not going mad" — that sentence should be at the heart of at least three of your video titles. It captures exactly why women find you and exactly what you give them.

Please share the bone density and thyroid cases — both sound like they'll generate strong educational content.`
},
{
  role: "user", stageId: 2, timestamp: tick(5),
  content: `**Case 4 — The Bone Density Shock**
Margaret, 54, recently postmenopausal, came to me after a DEXA scan showed she had osteopenia bordering on osteoporosis. She was devastated — she'd taken calcium supplements religiously for years and drank plenty of milk. Her GP had prescribed bisphosphonates. She came to me for a second opinion.

What was missing from her picture: she had low vitamin D (despite living in London, she was barely outdoors), low magnesium (which is essential for calcium to actually get into bone), and she'd had untreated menopause symptoms for four years because she was "worried about breast cancer." Four years of oestrogen deficiency had quietly been removing calcium from her bones regardless of what she supplemented.

We started HRT, optimised her vitamin D and magnesium, added a targeted resistance training programme (bones respond to load), and stopped the calcium supplements. Her DEXA two years later showed a 6% improvement in her spine density. The bisphosphonates were never needed.

**Case 5 — The Thyroid Red Herring**
Sophie, 49, asked her GP to test her thyroid because she was exhausted, gaining weight, and had brain fog. TSH came back borderline elevated — 4.2. Her GP put her on levothyroxine. Six months later she felt no different. She came to me because she'd heard me talking about how thyroid and oestrogen interact.

Her thyroid wasn't her primary problem. Low oestrogen reduces the sensitivity of thyroid receptors — her thyroid was basically working fine but oestrogen deficiency meant the signal wasn't getting through properly. Once I started her on HRT, her thyroid function normalised without any change to her levothyroxine dose, and then she was able to reduce the levothyroxine over time. She's now off it completely. Her thyroid never needed medicating in the first place.`
},
{
  role: "assistant", stageId: 2, timestamp: tick(2),
  content: `Five exceptional cases — each one unpacks a different failure point in conventional care and each one has a clear teaching principle embedded in it. The thyroid-oestrogen receptor interaction in particular is the kind of insight that will stop viewers in their tracks.

Stage 2 complete. Moving to Stage 3.

---

**Stage 3 — Core Knowledge Pillars**

Based on everything you've shared, I can already see the shape of your clinical framework. Let's make it explicit. Tell me the five to eight core knowledge pillars that define how you think and practise — the principles you return to again and again with patients.`
},

// ── STAGE 3 ───────────────────────────────────────────────────────────────────
{
  role: "user", stageId: 3, timestamp: tick(7),
  content: `Here are my six core pillars:

**Pillar 1: Perimenopause Starts Earlier Than Anyone Tells You**
Most women are told menopause happens at 51 and perimenopause is the year or two before. This is completely wrong. Perimenopause can start in the late thirties and typically begins in earnest in the early-to-mid forties — sometimes with completely regular periods. The hormonal fluctuations begin years before the last period. This is the most important educational message I carry: don't wait for your periods to change before you start paying attention.

**Pillar 2: The Progesterone Problem**
Progesterone is the forgotten hormone. Most women know about oestrogen. Almost nobody talks about progesterone — but progesterone deficiency is often the first hormonal shift of perimenopause, it drives anxiety, insomnia, and irregular periods, and it's severely underdiagnosed. When I tell women that progesterone is their calming, sleep-promoting, anti-anxiety hormone and that it drops first, they often have a complete lightbulb moment.

**Pillar 3: The Cortisol Thief**
Under chronic stress, the body preferentially converts progesterone to cortisol (via what's sometimes called the "pregnenolone steal"). A woman under constant work stress, sleep deprivation, or emotional pressure in her forties is essentially depleting her own progesterone to feed her stress response. This is why so many high-achieving women in their forties hit the wall simultaneously on all fronts — work, mood, sleep, and hormones.

**Pillar 4: The Gut-Oestrogen Axis**
Oestrogen is processed through the gut via a collection of bacteria called the estrobolome. If your gut microbiome is disrupted — which it often is in perimenopausal women, partly due to the effect of declining oestrogen on the gut lining — you recycle oestrogen poorly, leading to oestrogen dominance symptoms at the same time as oestrogen deficiency symptoms, which is utterly confusing for both the patient and most doctors.

**Pillar 5: Muscle Is the Organ of Longevity**
From around 40, women lose roughly 1% of their muscle mass per year in the absence of active resistance training. Oestrogen is profoundly anabolic — it supports muscle protein synthesis. As oestrogen declines, muscle loss accelerates. Loss of muscle drives insulin resistance, increases fracture risk, impairs metabolic health, and is strongly associated with cognitive decline. Every woman in perimenopause needs to be doing resistance training. This is not optional. This is medicine.

**Pillar 6: HRT Is Brain Protection**
The evidence that oestrogen protects the brain is now substantial — particularly for Alzheimer's risk reduction when HRT is started in the perimenopause window. Women are twice as likely as men to develop Alzheimer's, and oestrogen is almost certainly part of the explanation. Waiting until symptoms are severe before starting HRT means years of the brain operating in an oestrogen-deficient state. The window of opportunity matters.`
},
{
  role: "assistant", stageId: 3, timestamp: tick(2),
  content: `These six pillars are exceptional — they form a genuinely cohesive and differentiated framework. The progesterone/cortisol/gut trifecta in particular is the kind of interconnected systems thinking that most conventional practitioners simply don't apply to menopause care.

A few questions to bring these to life:

1. **On Pillar 3 (the Cortisol Thief):** You described high-achieving women "hitting the wall." What does that look like in your clinic? Is there a pattern to the type of woman who arrives with this presentation, and how do you explain the pregnenolone steal in terms a patient without a science background can understand?

2. **On Pillar 4 (Gut-Oestrogen Axis):** You mentioned women can experience oestrogen dominance and oestrogen deficiency simultaneously — that's counterintuitive and fascinating. What are the symptoms that distinguish each, and how do you explain this contradiction to a patient who's been told she "definitely isn't low in oestrogen" because she still has periods?

3. **On Pillar 6 (HRT and Brain Protection):** How do you handle the patient who says "but I thought HRT caused breast cancer?" — what's your response to the Women's Health Initiative fear that's still shaping patient decisions 20 years later?`
},
{
  role: "user", stageId: 3, timestamp: tick(6),
  content: `**On the Cortisol Thief pattern:** It's almost always a high-achieving professional woman — lawyer, doctor, executive, teacher, entrepreneur. She's been running on adrenaline and cortisol for twenty years and she's been fine because oestrogen and progesterone were buffering the stress response. Then in her early-to-mid forties, that buffer disappears, and suddenly the stress that she's always managed becomes unmanageable. The analogy I use: imagine you've been driving a car with excellent shock absorbers your whole life. The road has always been bumpy but you've barely felt it. Then someone removes the shock absorbers and now every bump is unbearable. The road hasn't got worse. Your car just lost its protection.

**On the Gut-Oestrogen contradiction:** The symptoms are genuinely confusing and they overlap. Oestrogen dominance gives you bloating, breast tenderness, heavy or irregular periods, and sometimes a sort of toxic, agitated mood. Oestrogen deficiency gives you hot flushes, vaginal dryness, brain fog, and bone effects. A woman can have both simultaneously if her gut isn't clearing the oestrogen properly. I explain it like this: your body is producing oestrogen but it's going around in circles rather than being used and cleared properly. It's like having a leaky tap — water is going everywhere except where it's supposed to go.

**On HRT and breast cancer:** I address it directly and with evidence every single time. The Women's Health Initiative used synthetic progestins that we now know have a different (and more problematic) risk profile than body-identical progesterone. The breast cancer risk with modern body-identical HRT is either neutral or, for oestrogen-only HRT, slightly protective. Compared to the risks of ten or fifteen years of oestrogen deficiency — cardiovascular disease, Alzheimer's, osteoporosis, diabetes — the risk-benefit calculation is not close for most women. The real scandal isn't HRT. It's the fact that millions of women have been denied it for twenty years based on a misinterpreted study.`
},
{
  role: "assistant", stageId: 3, timestamp: tick(2),
  content: `"The road hasn't got worse. Your car just lost its protection." — that's one of the most memorable analogies I've collected from this interview. And the reframe on the WHI study — "the real scandal isn't HRT" — is the kind of bold, evidence-based positioning that will make your channel stand out in a crowded wellness space.

Stage 3 complete. Moving to Stage 4.

---

**Stage 4 — Audience and Common Questions**

Tell me about the women who find you. Who is your ideal viewer and what are the questions that come up again and again — the ones you could answer in your sleep?`
},

// ── STAGE 4 ───────────────────────────────────────────────────────────────────
{
  role: "user", stageId: 4, timestamp: tick(6),
  content: `My ideal viewer is a woman between 38 and 58 who is intelligent, successful, health-conscious, and completely confused by what's happening to her body. She's the woman who has always been on top of her health — she eats well, exercises, doesn't smoke — and yet she's falling apart and nobody is giving her answers. She feels let down by her GP, she's been told her blood tests are "fine," and she's starting to wonder if this is just what getting older feels like. She is absolutely not willing to accept that.

The questions I hear over and over:

1. "How do I know if I'm in perimenopause if my periods are still regular?"
2. "My GP says I'm too young for HRT — am I?"
3. "Why am I gaining weight when nothing has changed about my diet or exercise?"
4. "Why am I so anxious when I've never been an anxious person?"
5. "Is it safe to take HRT? I'm scared of breast cancer."
6. "Will HRT make me put on weight?" (Almost the opposite is often true.)
7. "My brain fog is so bad I'm worried about dementia — could it be menopause?"
8. "Why do I feel worse on the HRT my doctor prescribed?"
9. "I'm 42 and feel terrible — could this really be hormonal?"
10. "What tests should I be getting that my doctor isn't ordering?"

The misconceptions I correct constantly: that menopause is just hot flushes and periods stopping; that HRT is dangerous; that weight gain in menopause is inevitable and unfixable; that feeling terrible in your forties is just "part of getting older"; that you need to be 50 or have stopped periods to get help; that calcium supplements protect bones.`
},
{
  role: "assistant", stageId: 4, timestamp: tick(2),
  content: `This is a goldmine. Every one of those ten questions is a video title. The audience picture is also crystal clear — intelligent, health-literate, let down by the system, and ready to invest in understanding. That's exactly the audience that will convert to your programme.

Two quick follow-ups:

1. You mentioned women who "feel worse on the HRT their doctor prescribed" — that's an intriguing one. What are the most common reasons a woman starts HRT and doesn't feel better, and what does "feeling worse" usually look like?

2. What do your clients say they wish someone had told them ten years earlier? The answer to that question often becomes the single most-watched video on a channel.`
},
{
  role: "user", stageId: 4, timestamp: tick(4),
  content: `**On feeling worse on HRT:** Usually one of four reasons. First, the dose is too low — the minimum effective dose philosophy leaves many women under-replaced and they feel marginal improvement but not the transformation that's possible. Second, the route is wrong — some women are using oestrogen gel but not absorbing it properly through skin, either because of the application site or because of skin issues. Third, they've been given a synthetic progestogen (like Norethisterone) rather than body-identical progesterone and the progestogen is causing side effects — bloating, low mood, spots — that overshadow the benefits of the oestrogen. Fourth, the underlying issues haven't been addressed — gut problems, thyroid issues, adrenal dysregulation — and the HRT is working but working against a backdrop of other unresolved problems.

**On what they wish they'd known sooner:** "That the symptoms I had in my late thirties were the beginning." That's the most common answer. Women look back and realise the rage episodes at 37, the terrible PMS at 39, the sleep problems at 41 — all of it was the hormonal transition beginning. They wish they'd known so they could have acted earlier. The second most common is: "That this was a medical issue, not a character flaw." So many women have spent years blaming themselves for not coping — thinking they were weak or broken — when there was a physiological explanation all along.`
},
{
  role: "assistant", stageId: 4, timestamp: tick(2),
  content: `"A medical issue, not a character flaw" — that's going to be a video title. That phrase alone captures why women feel seen by you in a way conventional medicine has failed them.

Stage 4 complete. Moving to Stage 5.

---

**Stage 5 — Contrarian and Unique Perspectives**

This is where we capture your boldest, most differentiated thinking. Where do you fundamentally push back against mainstream advice? What do you wish more practitioners would say out loud?`
},

// ── STAGE 5 ───────────────────────────────────────────────────────────────────
{
  role: "user", stageId: 5, timestamp: tick(7),
  content: `**1. Not prescribing HRT to a symptomatic woman is the clinical negligence — not the other way around.**
The narrative has been that HRT is the risky choice. I believe the opposite. We now have robust evidence that untreated oestrogen deficiency increases cardiovascular risk, doubles Alzheimer's risk, accelerates bone loss, and damages the urogenital tract permanently. The risk of doing nothing, for a symptomatic perimenopausal woman, is significant and cumulative. Withholding an effective, evidence-based treatment from a woman who is suffering and qualifying for it should be the conversation we're having.

**2. Cardio is not the answer to menopause weight — it may make it worse.**
The conventional advice is: gain weight, do more exercise. For a perimenopausal woman with elevated cortisol, chronic cardio is inflammatory and cortisol-raising. I see women running themselves into the ground, literally, and gaining weight. Heavy strength training three times a week, prioritising sleep, and managing cortisol will do more for body composition in menopause than any amount of cardio.

**3. Calcium supplements don't protect menopausal bones.**
The supplement industry has convinced women that calcium pills protect their bones. The evidence is weak and there's emerging concern about cardiovascular risk with high-dose calcium supplementation. Bones need oestrogen, load-bearing exercise, vitamin D, magnesium, and vitamin K2. A calcium supplement without addressing oestrogen deficiency is window dressing.

**4. Intermittent fasting is often harmful for perimenopausal women.**
It's everywhere as a weight loss tool. For perimenopausal women with already dysregulated cortisol and blood sugar, skipping breakfast and eating in a narrow window spikes cortisol, disrupts progesterone, and worsens the very metabolic problems it's supposed to fix. I've had multiple patients who made their perimenopause significantly worse following intermittent fasting advice from well-meaning influencers.

**5. "Low libido is normal in menopause" is not a clinical statement — it's a failure of imagination.**
Loss of libido is caused by low testosterone (which also declines in menopause), vaginal atrophy, relationship strain from years of symptoms being dismissed, and depression. All of these are addressable. A woman is not supposed to lose her sexuality at 50. It's not "just what happens." I have patients in their late fifties who have better sex lives than they did in their thirties, because we've treated the whole picture.`
},
{
  role: "assistant", stageId: 5, timestamp: tick(2),
  content: `Every one of these is a standalone pillar for powerful video content. The HRT-as-negligence reframe is bold but defensible, and it will attract the audience that's ready to hear the truth. The calcium supplement myth will surprise people. The intermittent fasting point is particularly timely given how aggressively it's being promoted.

One question on the libido point, because it's so important and so rarely discussed candidly:

When you mention testosterone declining in menopause — this seems to be almost completely absent from mainstream conversation. How significant is testosterone for women's overall wellbeing beyond libido, and what does the treatment picture look like? (I ask because I suspect this is a video that would perform exceptionally well — it's the conversation women can't find anywhere.)`
},
{
  role: "user", stageId: 5, timestamp: tick(4),
  content: `Testosterone is enormously important for women and it's the most ignored hormone in female medicine. Beyond libido, testosterone in women drives energy, motivation, cognitive sharpness, muscle maintenance, mood stability, and confidence. Women who are testosterone-deficient describe a kind of flatness — not depression exactly, but a loss of drive and enthusiasm for life. I sometimes describe it as the difference between being a person and being a ghost of a person.

Testosterone peaks in women in their mid-twenties and declines steadily from there. By menopause, levels are typically half what they were at 25. Adding testosterone to HRT — in the right dose, which is much smaller than what men receive — often produces the most transformative results of the entire treatment programme. Women describe getting themselves back. They have energy, they have motivation, they care about their appearance and their relationships again. It sounds almost too good, but the mechanism is clear.

The challenge: testosterone is not licensed for use in women in the UK, which means it's prescribed off-label. Many GPs won't do this, and many women don't even know it's an option. This is a significant gap in care. I talk about it in every single consultation.`
},
{
  role: "assistant", stageId: 5, timestamp: tick(2),
  content: `"The difference between being a person and being a ghost of a person" — that's the most powerful line in this entire interview so far. It's going directly into a video title.

Stage 5 complete. Moving to Stage 6.

---

**Stage 6 — Practical Protocols and Actionable Frameworks**

Now let's extract the step-by-step processes you use in practice. Walk me through your key protocols — the ones you return to most often and that produce the most consistent results.`
},

// ── STAGE 6 ───────────────────────────────────────────────────────────────────
{
  role: "user", stageId: 6, timestamp: tick(7),
  content: `**Protocol 1: The Hormone Clarity Panel**
This is the testing sequence I use before I do anything else. Standard GP testing is woefully inadequate — they typically test FSH and LH, which are lagging indicators and don't tell you much about the symptom picture. My panel includes: oestradiol, progesterone (day 21 if still cycling), testosterone (free and total), SHBG, DHEA-S, cortisol (ideally a four-point salivary cortisol), thyroid (TSH, free T3, free T4, TPO antibodies), fasting insulin and HbA1c, vitamin D, magnesium (RBC not serum), ferritin, and a full blood count. I also use a DUTCH test (dried urine test for comprehensive hormones) for complex cases to look at hormone metabolites.

**Protocol 2: The Sleep Reclamation Method**
Sleep is the non-negotiable foundation. Everything else falls apart without it. My sleep protocol has four layers:
Layer 1 — Hormonal optimisation (progesterone timing is critical; taking it at night has a direct sedative effect via GABA receptors).
Layer 2 — Cortisol management (no high-intensity exercise after 4pm, no screens after 9pm, a deliberate wind-down protocol for 30–60 minutes before bed).
Layer 3 — Blood sugar stabilisation (protein at every meal, no refined carbs in the evening, a small protein snack before bed if waking in the early hours due to blood sugar dropping).
Layer 4 — Sleep environment (blackout, cool room, no phone in bedroom — the basics that everyone ignores).

**Protocol 3: The Menopause Strength Foundation**
The resistance training protocol I give every patient. Three sessions per week, compound movements, progressively loaded. Each session: one lower body compound (squat or deadlift variation), one upper body push (press), one upper body pull (row or pull-down), one hip hinge or glute-focused exercise. Sessions are 45 minutes maximum. The key principle: lift heavy enough to challenge the muscle within 8–12 reps. Light weights for high reps do not build muscle. For bone density, the load matters.

**Protocol 4: The Gut Reset for Hormone Balance**
A four-week protocol. Week 1: remove the disruptors — alcohol, ultra-processed food, refined sugar, and for most women, gluten (at least temporarily). Week 2: add the foundations — daily prebiotic foods (leeks, garlic, asparagus, green banana), quality probiotic. Week 3: support oestrogen clearance — cruciferous vegetables daily, ground flaxseed, DIM supplement if needed. Week 4: repair the gut lining — collagen, L-glutamine, bone broth, zinc.

**Protocol 5: The Cognitive Revival Stack**
For women with brain fog and cognitive symptoms. The supplement stack I use: omega-3 (at least 2g EPA/DHA daily), phosphatidylserine, lion's mane mushroom, B-complex (with methylfolate not folic acid), and magnesium glycinate at night. Combined with HRT, this produces meaningful cognitive improvement in most women within 8–12 weeks.`
},
{
  role: "assistant", stageId: 6, timestamp: tick(2),
  content: `These five protocols are exactly what your YouTube audience needs — specific, actionable, and grounded in your clinical experience. The Sleep Reclamation Method in particular has four distinct layers that could each be their own video.

Two questions:

1. **On Protocol 1:** When you mention the DUTCH test for complex cases — what kinds of findings on that test change your treatment approach in ways that standard blood tests would miss?

2. **On Protocol 3:** You mentioned "lift heavy enough to challenge the muscle within 8–12 reps" — most of your audience will be women who've been told their whole lives that light weights and cardio are the female approach to fitness. How do you overcome that resistance, especially in women who are already exhausted and intimidated by heavy lifting?`
},
{
  role: "user", stageId: 6, timestamp: tick(5),
  content: `**On the DUTCH test:** The most important finding is oestrogen metabolites — specifically the ratio of 2-OHE1 to 16-OHE1. Women who metabolise oestrogen preferentially via the 16 pathway have a higher breast cancer risk from their own oestrogen. This changes my supplementation approach significantly — I use DIM, calcium D-glucarate, and specific dietary interventions to shift the metabolism. The second key finding is cortisol clearance — some women produce normal cortisol but clear it very slowly, meaning they're effectively in a prolonged cortisol state even if their morning reading looks fine. Third is the glucuronidation pathway — if this is impaired, oestrogen gets reactivated in the gut rather than cleared. Standard bloods cannot tell you any of this.

**On overcoming resistance to heavy lifting:** I use two approaches. First, evidence and framing — I explain that their muscles don't know they're female, and the same mechanical stimulus that builds muscle in men builds muscle in women. The hormonal environment means the visual result looks different (women don't get bulky from progressive resistance training — they get lean and strong), but the physics is the same. Second, I start them at a gym with a trainer for four sessions to learn the movements safely. Once a woman deadlifts a meaningful weight for the first time — feels the strength in her own body — the psychological shift is remarkable. I've had patients in their fifties describe it as genuinely life-changing. They had no idea they were capable of it. That empowerment carries into everything else.`
},
{
  role: "assistant", stageId: 6, timestamp: tick(2),
  content: `The DUTCH test findings — particularly the oestrogen metabolite ratios and cortisol clearance — are clinical nuances that will genuinely educate your audience and position you as someone who operates at a different level to generalist menopause care.

Stage 6 complete. Moving to Stage 7.

---

**Stage 7 — 52 Video Title Concepts**

Using everything you've shared across all six stages, here are 52 video title concepts grouped by theme. Please review and approve before I generate full editing directions and scripts.

---

**THEME 1: THE PERIMENOPAUSE WAKE-UP CALL (8 videos)**

1. **"Am I in Perimenopause? The 12 Signs That Start Years Before Your Periods Change"**
*Theme: Perimenopause awareness | Why women misattribute early perimenopause symptoms to stress, burnout, and anxiety — and what to look for instead.*

2. **"The 'Too Young' Myth: Why Your GP Might Be Missing Your Perimenopause at 38, 40, or 42"**
*Theme: Perimenopause awareness | The diagnostic failure that delays treatment by years for women in early perimenopause.*

3. **"You're Not Going Mad: The Real Reason You Feel Like a Different Person After 40"**
*Theme: Perimenopause awareness | Hormonal changes as a physiological explanation for personality, mood, and cognitive shifts that women blame themselves for.*

4. **"Why Perimenopause Looks Like Anxiety (And What to Do When Your Doctor Prescribes Antidepressants)"**
*Theme: Perimenopause awareness | The misdiagnosis pathway from hormonal anxiety to SSRI prescription — and why treating the root cause changes everything.*

5. **"The Rage Nobody Warns You About: Perimenopause Anger, Why It Happens, and How to Stop It"**
*Theme: Perimenopause awareness | The progesterone-rage connection and why sudden, uncharacteristic anger episodes are one of the earliest signs of perimenopause.*

6. **"Your Brain on Menopause: The Truth About Brain Fog, Memory Loss, and Why It's Not What You Think"**
*Theme: Perimenopause awareness | Oestrogen's role in cognitive function — why brain fog is a hormonal symptom, not a character flaw, and what actually restores it.*

7. **"How to Advocate for Yourself at the GP: What to Say When You're Told Your Bloods Are Normal"**
*Theme: Perimenopause awareness | A practical guide to navigating the NHS menopause consultation — what tests to request and how to have the conversation.*

8. **"Perimenopause Vs Menopause: The Difference That Changes Everything About Your Treatment"**
*Theme: Perimenopause awareness | Why the transition phase deserves its own clinical attention and why waiting for your periods to stop is waiting too long.*

---

**THEME 2: THE HORMONE TRUTH (8 videos)**

9. **"Progesterone: The Calming Hormone You've Never Heard Of (And Why It Drops First)"**
*Theme: Hormone education | The most overlooked hormone in menopause care — what progesterone does for sleep, anxiety, and mood, and how its loss affects everything.*

10. **"Oestrogen and Your Brain: The Alzheimer's Prevention Conversation Nobody Is Having"**
*Theme: Hormone education | The evidence connecting oestrogen deficiency to Alzheimer's risk, the window of opportunity, and why starting HRT in perimenopause matters.*

11. **"Testosterone Is a Female Hormone Too: Why Women Are Being Denied the Treatment That Changes Everything"**
*Theme: Hormone education | The case for testosterone in women — energy, drive, cognition, libido, and muscle — and why it's routinely overlooked.*

12. **"The Cortisol Thief: How Stress Steals Your Progesterone (And Why High-Achieving Women Are Hit Hardest)"**
*Theme: Hormone education | The pregnenolone steal explained — why women who cope best with stress are often the most hormonally depleted.*

13. **"Oestrogen Dominance and Oestrogen Deficiency: How You Can Have Both at the Same Time"**
*Theme: Hormone education | The gut-oestrogen axis, poor oestrogen clearance, and why a woman can have hot flushes and heavy periods simultaneously.*

14. **"The Truth About HRT and Breast Cancer: What the Women's Health Initiative Actually Said (And What It Didn't)"**
*Theme: Hormone education | A calm, evidence-based deconstruction of the study that scared a generation of women away from effective treatment.*

15. **"Why Your Hormones Make Your Thyroid Look Broken (When It Isn't)"**
*Theme: Hormone education | The oestrogen-thyroid receptor connection — why thyroid symptoms in perimenopause are often hormonal, not thyroid-primary.*

16. **"SHBG, Free Hormones, and Why Standard Blood Tests Are Missing the Point"**
*Theme: Hormone education | What sex hormone binding globulin does, why total testosterone is not the useful number, and what to ask for instead.*

---

**THEME 3: HRT — THE FACTS (6 videos)**

17. **"Body-Identical HRT vs Synthetic HRT: The Difference That Actually Matters"**
*Theme: HRT education | Why not all HRT is the same, what body-identical means, and why the type of progestogen in your HRT matters enormously.*

18. **"Why You Might Feel Worse on HRT (The Four Reasons It's Not Working and How to Fix It)"**
*Theme: HRT education | Under-dosing, wrong route, synthetic progestogen side effects, and unaddressed co-factors — the most common HRT failures explained.*

19. **"Starting HRT: A Practical Guide to What to Expect in the First Three Months"**
*Theme: HRT education | Setting realistic expectations, common adjustment symptoms, when to push through and when to call your doctor.*

20. **"The Timing Hypothesis: Why Starting HRT in Perimenopause Protects Your Heart and Brain in Ways That Starting at 60 Doesn't"**
*Theme: HRT education | The window of opportunity concept and why early intervention produces dramatically better long-term outcomes.*

21. **"How Long Should You Stay on HRT? The Honest Answer to the Question Every Woman Asks"**
*Theme: HRT education | The evidence on long-term HRT use, quality of life versus risk discussion, and why "forever" may be the right answer for many women.*

22. **"HRT Myths Busted: The 10 Things Women Believe That Simply Aren't True"**
*Theme: HRT education | Rapid-fire myth-busting on weight gain, cancer risk, dependency, natural menopause, and more.*

---

**THEME 4: BODY, MUSCLE, AND METABOLISM (6 videos)**

23. **"Why You're Gaining Weight in Menopause Despite Doing Everything Right"**
*Theme: Metabolism | Cortisol, insulin resistance, oestrogen deficiency, and the exercise-makes-it-worse paradox — the real metabolic picture of menopause.*

24. **"Stop Doing So Much Cardio: Why Strength Training Is the Medicine Your Menopausal Body Actually Needs"**
*Theme: Metabolism | The science of muscle mass, oestrogen, and longevity — and why the conventional fitness advice for women is actively harmful in this phase.*

25. **"Muscle Is Your Most Important Organ After 40: The Menopause-Longevity Connection Nobody Talks About"**
*Theme: Metabolism | Sarcopenia, metabolic health, fracture risk, and cognitive protection — why building and maintaining muscle is non-negotiable.*

26. **"The Beginners Guide to Strength Training in Perimenopause: How to Start, What to Lift, and Why Heavy Is Safe"**
*Theme: Metabolism | A practical, reassuring introduction to progressive resistance training for women who've never done it — or who've been told to stick to light weights.*

27. **"Menopause Belly Fat: Why It Appears, Why It Won't Shift, and the Only Approach That Actually Works"**
*Theme: Metabolism | The cortisol-oestrogen-visceral fat mechanism, why calorie restriction worsens it, and the evidence-based path to body recomposition.*

28. **"Protein: The Macronutrient That Changes Everything for Women Over 40"**
*Theme: Metabolism | Muscle protein synthesis, anabolism, and why most women are eating less than half the protein they need.*

---

**THEME 5: SLEEP, STRESS, AND THE NERVOUS SYSTEM (6 videos)**

29. **"Why You Can't Sleep in Perimenopause: The Four Hormonal Mechanisms Keeping You Awake"**
*Theme: Sleep | Progesterone, cortisol, oestrogen, and blood sugar — the complete hormonal picture of perimenopausal insomnia.*

30. **"My Four-Layer Sleep Reclamation Method: How to Sleep Through the Night Again"**
*Theme: Sleep | The complete protocol — hormonal timing, cortisol management, blood sugar stabilisation, and sleep environment.*

31. **"The 3am Wake-Up: What It Means and How to Stop It"**
*Theme: Sleep | Blood sugar dropping in the night as a trigger for cortisol release and early waking — and the simple intervention that resolves it.*

32. **"Stress in Menopause: Why You Can't Cope the Way You Used To (And It's Not a Weakness)"**
*Theme: Nervous system | How declining oestrogen and progesterone remove the hormonal buffer for the stress response — and what to do differently.*

33. **"How to Protect Your Nervous System in Perimenopause: The Daily Practices That Shift the Physiology"**
*Theme: Nervous system | Specific, evidence-based practices for cortisol regulation — including what doesn't work and what does.*

34. **"Menopause and Anxiety: When It's Hormonal, When It's Psychological, and How to Tell the Difference"**
*Theme: Nervous system | A clinician's framework for distinguishing hormonally-driven anxiety from anxiety with other causes — and the treatment implications.*

---

**THEME 6: GUT, BONE, AND LONG-TERM HEALTH (6 videos)**

35. **"The Gut-Oestrogen Connection: Why Your Digestive Health Determines How Well Your Hormones Work"**
*Theme: Gut health | The estrobolome, oestrogen recycling, and the four-week gut reset protocol.*

36. **"The Truth About Calcium and Bone Health: Why Your Supplements Aren't Protecting You"**
*Theme: Bone health | The calcium myth debunked — what bones actually need and why oestrogen, load-bearing exercise, and micronutrients matter more.*

37. **"Your DEXA Scan Explained: What Osteopenia Really Means and Why It's Not an Immediate Prescription for Bisphosphonates"**
*Theme: Bone health | A calm, practical guide to interpreting bone density results and the natural and hormonal approaches that can reverse bone loss.*

38. **"The Menopause-Cardiovascular Risk Nobody Talks About: Why Protecting Your Heart Starts at 40"**
*Theme: Cardiovascular health | Oestrogen's role in vascular health, the post-menopausal CV risk window, and why HRT timing matters for heart protection.*

39. **"Menopause and the Gut: Bloating, IBS, and Digestive Changes That Are Actually Hormonal"**
*Theme: Gut health | How oestrogen decline affects gut motility, permeability, and microbiome diversity — and what to do about it.*

40. **"Your Hormones and Your Skin, Hair, and Nails: What's Normal, What's Treatable, and What to Do"**
*Theme: Long-term health | The cosmetic and structural effects of declining oestrogen — collagen, hair cycling, and nail changes.*

---

**THEME 7: TESTING, TREATMENT, AND WORKING WITH YOUR DOCTOR (6 videos)**

41. **"The Complete Hormone Test You Should Be Getting (That Most GPs Won't Order)"**
*Theme: Testing | A plain-English guide to the comprehensive hormone panel — what to test, when to test, and how to interpret the results.*

42. **"Understanding Your Results: What Your Lab Numbers Actually Mean in the Context of Menopause"**
*Theme: Testing | Reference ranges were built on population data, not optimal function — here's how to read your results through a clinical lens.*

43. **"The DUTCH Test Explained: What It Reveals About Your Hormones That Blood Tests Miss"**
*Theme: Testing | A guide to dried urine hormone testing, oestrogen metabolites, and cortisol clearance.*

44. **"How to Get the Best Out of Your NHS GP for Menopause: Scripts, Questions, and What to Do If They Say No"**
*Theme: Advocacy | A practical guide to navigating the healthcare system — including how to escalate to a menopause specialist.*

45. **"Private Menopause Care: Is It Worth It, What Does It Cost, and What Should You Expect?"**
*Theme: Advocacy | An honest guide to what private menopause care offers, when it's necessary, and how to find a good specialist.*

46. **"Supplements for Menopause: What the Evidence Actually Says (The Good, the Useless, and the Risky)"**
*Theme: Treatment | An evidence-based review of the most popular menopause supplements — magnesium, ashwagandha, black cohosh, and more.*

---

**THEME 8: THRIVING IN MENOPAUSE (6 videos)**

47. **"How to Feel Better in Menopause Than You Did at 35: The Case for Hormonal Optimisation"**
*Theme: Optimisation | The difference between treatment and optimisation — and why feeling "not as bad" is not the standard your health deserves.*

48. **"The Menopause Supplement Stack I Give Every Patient: Five Evidence-Based Nutrients That Change Everything"**
*Theme: Optimisation | The Cognitive Revival Stack — omega-3, phosphatidylserine, lion's mane, B-complex, and magnesium glycinate explained.*

49. **"Menopause and Libido: Why Loss of Sex Drive Is Not Normal, Not Inevitable, and Completely Treatable"**
*Theme: Optimisation | Testosterone, vaginal health, relationship dynamics, and psychological factors — the complete picture of female sexual health after 40.*

50. **"Menopause and Relationships: The Conversation Your Partner Needs to Hear"**
*Theme: Relationships | A guide for women to explain what is happening physiologically to their partners — and for partners who want to understand.*

51. **"Menopause at Work: How to Protect Your Performance, Manage Your Symptoms, and Know Your Rights"**
*Theme: Optimisation | Cognitive strategies, practical accommodations, and the conversation with your employer.*

52. **"Your Menopause Roadmap: The Five-Step Framework for Taking Control of Your Hormonal Health"**
*Theme: Optimisation | A comprehensive overview of Dr. Chen's approach — testing, treating, strengthening, optimising sleep, and protecting the brain.*

---

These 52 titles are designed to build search authority on YouTube while warming your ideal client steadily toward your programme. Please review and let me know if you'd like any titles adjusted, removed, or replaced before I proceed with full editing directions.`
},

// ── STAGE 7 approval + batch ──────────────────────────────────────────────────
{
  role: "user", stageId: 7, timestamp: tick(3),
  content: "These are excellent. I particularly love the brain/Alzheimer's angle and the testosterone video — those feel like big opportunities that nobody else is making well. Please go ahead with the editing directions for the first batch."
},
{
  role: "assistant", stageId: 7, timestamp: tick(20),
  content: `**BATCH 1: THE PERIMENOPAUSE WAKE-UP CALL (Videos 1–4)**

---

VIDEO 1:
TITLE: "Am I in Perimenopause? The 12 Signs That Start Years Before Your Periods Change"
THEME / KNOWLEDGE PILLAR: Perimenopause awareness
AUDIENCE PROBLEM ADDRESSED: Women experiencing confusing symptoms in their late 30s and 40s who have been told their bloods are normal and nothing is wrong
ONE-LINE VIDEO DESCRIPTION: The comprehensive guide to early perimenopause recognition — 12 symptoms most doctors miss and what to do when you identify them
CORE STORY OR CASE STUDY TO USE: Kate's story — 38-year-old marketing director with regular periods, rage episodes, migraines, and lost libido who was told twice she was too young for menopause
PRIMARY VIEWER TAKEAWAY: Perimenopause can begin with regular periods; the symptoms come years before the periods change, and recognising them early transforms outcomes

SUGGESTED LONG-FORM STRUCTURE:
- Hook: The symptom list that changes everything
- The lie we were all told about when menopause starts
- The hormonal timeline: what's actually happening from your late 30s onward
- The 12 early symptoms (with clinical context for each)
- Kate's case study: regular periods, complete hormonal collapse
- What to do next: tests, conversations, and self-advocacy
- Closing call to action

EDITING DIRECTIONS:

Opening Hook Edit:
Open on Dr. Chen sitting directly to camera, no introduction. First words: "If you're in your late thirties or forties and something feels off — your mood, your sleep, your energy, your memory — and you've been told your blood tests are normal, I want you to watch this entire video. Because what I'm about to show you may be the explanation you've been looking for for years." Hold for two full seconds, then cut to a clean text overlay listing three symptoms: "Brain fog. Rage. Anxiety. These are often the first signs of perimenopause." No music during the hook — silence creates tension. Begin a soft ambient underscore at the 30-second mark.

Pacing and Cut Style:
This video should feel like a revelation, not a lecture. Keep cuts tight — no more than 8 seconds on any single shot during the symptom list section. Use a warm, documentary-conversational tone. Dr. Chen should appear relaxed and direct. Zoom in slightly (1.1x) on key phrases using keyframes. Allow pauses to breathe — do not rush Dr. Chen's delivery. The case study section should slow down to a more intimate pace.

B-Roll and Visual Support:
- Opening: close-up of a woman in her early 40s staring at a laptop, appearing exhausted and distracted
- For each symptom: relevant lifestyle shots (woman lying awake at 3am, woman snapping at family member, woman putting on reading glasses to check her phone, woman in a work meeting appearing unfocused)
- For the hormone timeline section: a simple animated timeline graphic showing oestradiol and progesterone fluctuating from age 35–55
- Kate's case study: stock footage of a professional woman in a busy office, appearing controlled on the outside; then contrast with intimate home scene showing tension
- Closing: woman looking confident and clear-eyed, speaking to her doctor

On-Screen Text and Graphics:
- At 0:08 — text overlay: "This could be perimenopause" (bold, white on dark background)
- At the 12-symptoms section — numbered title cards for each symptom as Dr. Chen names it
- Key stat: "Perimenopause can begin up to 10 years before the final period" — animated text at the point this is stated
- At the case study: lower-third name card "Patient: Kate, 38" with small disclaimer "anonymised case study"

Chapter Breaks:
0:00 — Introduction and hook
1:30 — What perimenopause actually is (the timeline)
4:30 — The 12 early signs
12:00 — A real case: regular periods, severe symptoms
15:30 — What to do right now
18:00 — Summary and next steps

Retention Devices:
1. At 2:00 — tease: "Stick around because at the 12-minute mark I'm sharing a case study of a patient who was told she absolutely was not in perimenopause — and what happened when we proved otherwise."
2. At 6:00 — pattern interrupt: cut to Dr. Chen standing at a whiteboard with a timeline diagram. Change of visual pace resets attention.
3. At 10:00 — re-engage: "Now I want to show you why symptom number nine — the one most women dismiss — is often the most important signal of all."

Tone and Music Direction:
Warm, reassuring, and quietly urgent. Music should be minimal and ambient — piano or soft strings — low in the mix. Avoid anything that feels clinical or corporate. This video should feel like a trusted friend telling you something important.

CapCut and Editor Notes:
Add auto-captions throughout. Lower third for Dr. Chen's credentials at first appearance: "Dr. Sarah Chen | Menopause Specialist | Harley Street." Use a subtle zoom-in keyframe on Dr. Chen's face during the phrase "you're not going mad." For the 12 symptoms, build a clean numbered list graphic that appears item by item (not all at once). End screen: "Watch next: 'The Truth About HRT and Breast Cancer'" and subscribe button. Pinned comment should be: "If you recognise more than three of these symptoms, drop a comment below — you're not alone, and there is a way through this."

---

VIDEO 2:
TITLE: "You're Not Going Mad: The Real Reason You Feel Like a Different Person After 40"
THEME / KNOWLEDGE PILLAR: Perimenopause awareness
AUDIENCE PROBLEM ADDRESSED: Women who are experiencing personality changes, emotional volatility, and cognitive shifts they cannot explain and are blaming themselves for
ONE-LINE VIDEO DESCRIPTION: The hormonal explanation for why capable, high-functioning women fall apart in their forties — and why it is a medical issue, not a character flaw
CORE STORY OR CASE STUDY TO USE: Kate's case (the rage episodes, the fear of her own mind) combined with Rachel's case (the senior barrister with new-onset anxiety)
PRIMARY VIEWER TAKEAWAY: What feels like a mental health crisis or personality change is often a hormonal event — understanding this is the first step to getting better

SUGGESTED LONG-FORM STRUCTURE:
- Hook: The confession that resonates
- The medical explanation for emotional change in perimenopause
- Progesterone, oestrogen, and the brain — the neurological picture
- The self-blame epidemic: why women blame themselves and why this needs to stop
- Two case studies: anxiety and rage as hormonal presentations
- The treatment path: what changes when hormones are addressed
- Closing call to action

EDITING DIRECTIONS:

Opening Hook Edit:
Open with Dr. Chen speaking with controlled emotion: "I have patients — brilliant women, capable women, women who have held it together their whole lives — who come to me in tears, convinced that they are losing their mind. And the first thing I tell them is: you're not going mad. There is a physiological explanation for every single thing you are experiencing." Cut to close-up of hands — a woman in her 40s gripping a coffee cup. Text overlay: "A medical issue. Not a character flaw." This must land with weight. Pause for two full seconds before the music begins.

Pacing and Cut Style:
Slower, more intimate than Video 1. This is an emotional video. Dr. Chen should be shot in a warmer, softer light. More single-camera closeups. Fewer cuts during emotional passages — let the words sit. The case study section can afford to slow down significantly. This is a video that will be rewatched.

B-Roll and Visual Support:
- A woman sitting alone, visibly distressed but trying to appear composed
- A professional-looking woman at a desk, staring into space
- Soft lifestyle footage of a woman with her children — warmth, not conflict
- Abstract neurological animation showing oestrogen receptors in the brain
- A woman in a doctor's office having a conversation — not distressed, but focused and relieved

On-Screen Text and Graphics:
- Opening text overlay: "You're not going mad." — large, centred, white on dark
- Key quote card (shown as styled graphic): "What feels like a personality change is often a hormonal event." — Dr. Sarah Chen
- When discussing GABA receptors: simple diagram showing progesterone's effect on calming neurotransmitter activity
- Lower thirds for case studies: "Rachel, 46, Barrister" and "Kate, 38, Marketing Director"

Chapter Breaks:
0:00 — The confession
1:00 — Why your brain changes in perimenopause
5:00 — Progesterone, oestrogen, and neurological function
9:00 — The self-blame epidemic
12:00 — Rachel's story: anxiety that wasn't anxiety
15:00 — Kate's story: rage that wasn't rage
17:30 — The treatment path
19:00 — What to do next

Retention Devices:
1. At 1:30 — tease: "Later in this video I'm going to share a case study of a woman who had been prescribed antidepressants and was being assessed for an anxiety disorder — and what happened six weeks after we addressed the real cause."
2. At 8:00 — pattern interrupt: Dr. Chen walks to a different part of the room. "I want to talk about something that doesn't get discussed enough." Change of physicality resets attention.
3. At 14:00 — re-engage: "Rachel's case is probably the one that moved me most in twelve years of practice. Let me tell you exactly what happened."

Tone and Music Direction:
This is the most emotionally resonant video in the series. Music should be understated — sparse piano, almost absent in the key emotional moments. The video should feel like a safe space. Avoid anything that feels clinical. The emotional payoff is the sentence: "You're not going mad." — that moment needs silence around it.

CapCut and Editor Notes:
Do not rush the edit on this video. Let pauses exist. Add auto-captions with careful attention to punctuation — this video will be watched with sound off by many viewers. The moment Dr. Chen says "you're not going mad" — add a single-frame zoom-in (very subtle, 1.05x) to create weight. End screen: "Watch next: 'Why Perimenopause Looks Like Anxiety.'" Pinned comment: "If this video described you, please share it with someone who needs to hear it. This is the conversation that can change lives."

---

VIDEO 3:
TITLE: "Why Perimenopause Looks Like Anxiety (And What to Do When Your Doctor Prescribes Antidepressants)"
THEME / KNOWLEDGE PILLAR: Perimenopause awareness / Misdiagnosis
AUDIENCE PROBLEM ADDRESSED: Women who have been prescribed SSRIs or anxiety medication without a hormonal investigation, or who are taking antidepressants that aren't working
ONE-LINE VIDEO DESCRIPTION: The clinical pathway from hormonal anxiety to SSRI prescription — why it happens, why it often fails, and what treating the root cause looks like
CORE STORY OR CASE STUDY TO USE: Rachel's full case — the 18 months of escalating anxiety, two failed SSRIs, the cardiology referral, and the progesterone treatment that resolved everything
PRIMARY VIEWER TAKEAWAY: New-onset anxiety in your 40s should prompt a hormonal investigation before psychiatric medication — and if you're already on antidepressants, it's worth asking whether your hormones have been properly assessed

SUGGESTED LONG-FORM STRUCTURE:
- Hook: The SSRI pathway and what it misses
- How progesterone deficiency produces anxiety (the neurological mechanism)
- Why this is consistently misdiagnosed
- Rachel's case: 18 months of the wrong treatment
- What a correct diagnosis changes
- The conversation to have with your GP
- Closing call to action

EDITING DIRECTIONS:

Opening Hook Edit:
Dr. Chen opens with a direct, slightly urgent tone: "New-onset anxiety in a woman in her forties. What should her GP do? In most cases right now, the answer is: refer to talking therapy and consider an SSRI. I'm here to tell you that in many cases, that is the wrong answer — and the cost of getting it wrong is 18 months of the wrong treatment while the real problem gets worse." Text overlay: "Anxiety in your 40s. Could it be hormonal?" Cut immediately to the chapter structure. Do not use music for the first 45 seconds.

Pacing and Cut Style:
This video has a slightly more clinical, evidence-forward tone than the first two. Dr. Chen should feel like a doctor giving a briefing, not a friend having a conversation. Tighter cuts. Use a clean whiteboard or slide graphic for the neurological mechanism section. Case study section returns to warm, intimate pacing.

B-Roll and Visual Support:
- A prescription pad being written on
- A woman sitting in a GP consultation, looking uncertain
- Pharmacy counter footage (blurred, impressionistic)
- Close-up of GABA receptor animation — show progesterone binding and the calming effect, then show the absence of progesterone and the resulting hyperactivation
- Woman post-treatment: outdoors, morning light, visibly at ease

On-Screen Text and Graphics:
- Opening text: "New-onset anxiety in a woman over 40 should trigger a hormone test." — bold, white on dark
- Neurological diagram: simple animation showing progesterone's GABA-A receptor action
- Rachel's case timeline: a clean graphic showing 18 months of symptoms → two SSRIs → cardiology → hormone test → resolution
- "Questions to ask your GP" — formatted as a clean numbered list

Chapter Breaks:
0:00 — The diagnostic failure
2:00 — How progesterone deficiency causes anxiety
6:00 — Why it gets missed
9:00 — Rachel: 18 months of the wrong treatment
13:30 — What changed with the right diagnosis
16:00 — Questions to ask your doctor
18:30 — Summary

Retention Devices:
1. At 1:00 — tease: "At the 9-minute mark I'm sharing a case that changed how I practise. A woman who had been to a neurologist, a cardiologist, and two psychiatrists before she came to me."
2. At 5:00 — pattern interrupt: "Let me show you exactly what's happening in the brain." — move to whiteboard graphic. Change of format resets attention.
3. At 12:00 — re-engage: "Here's what I found when I actually tested Rachel's hormones properly. And it explains everything."

Tone and Music Direction:
More urgent than the previous two videos. The music should have a slightly clinical edge — minimalist, perhaps electronic — but still warm. This video should feel like a credible expert blowing the whistle on a systemic failure. Not angry, but clear and insistent.

CapCut and Editor Notes:
This video will perform well in search — optimise captions and chapter titles accordingly. The case timeline graphic should be animated clearly — each stage appearing in sequence. Add a text overlay at the point where Rachel's resolution is described: "6 weeks. Palpitations gone. Sleeping through the night." — high impact, simple. End screen: links to Video 2 (not going mad) and Video 9 (progesterone). Pinned comment: "Are you on antidepressants that aren't working? Have your hormones been properly tested? Drop a comment and let me know."

---

VIDEO 4:
TITLE: "The Rage Nobody Warns You About: Perimenopause Anger, Why It Happens, and How to Stop It"
THEME / KNOWLEDGE PILLAR: Perimenopause awareness
AUDIENCE PROBLEM ADDRESSED: Women experiencing sudden, uncharacteristic anger episodes that are affecting their relationships and making them question their own character
ONE-LINE VIDEO DESCRIPTION: The progesterone-rage connection — the physiological explanation for perimenopausal anger, why it's so frightening, and what resolves it
CORE STORY OR CASE STUDY TO USE: Kate's rage episodes — the "dishwasher" story, the moment with her children, the fear of a personality disorder, and the resolution
PRIMARY VIEWER TAKEAWAY: Perimenopausal rage is a hormonal event, not a character failing — it is treatable and it is not who you are

SUGGESTED LONG-FORM STRUCTURE:
- Hook: The thing nobody talks about
- The GABA-progesterone mechanism behind rage
- Why it targets high-achieving women and high-stress moments
- The shame and self-blame cycle
- Kate's story
- Treatment and what changes
- How to talk to your partner and family about this
- Closing call to action

EDITING DIRECTIONS:

Opening Hook Edit:
Start with Dr. Chen speaking quietly and directly: "I want to talk about the symptom of perimenopause that nobody warns you about. Not the hot flushes. Not the mood swings. I'm talking about rage. The kind that comes from nowhere, over nothing, and leaves you devastated by your own behaviour." Hold. Text overlay: "The perimenopause symptom nobody talks about." This should feel like the beginning of a confession — intimate, slightly uncomfortable. No music for the first 30 seconds.

Pacing and Cut Style:
Variable pacing — fast and urgent when describing the rage episodes themselves, slow and intimate in the case study section. Use dramatic visual cuts during the description of a rage episode to convey the jarring quality. Then return to Dr. Chen speaking calmly to camera. The contrast should be stark and deliberate.

B-Roll and Visual Support:
- Abstract: a match being lit, then extinguished — symbolic of sudden rage and its aftermath
- Lifestyle: a cluttered kitchen, a woman gripping a countertop
- Contrast shots: same woman, calm, laughing — showing who she is versus who she becomes in the moment
- Emotional aftermath: a woman in a chair, head in hands, visibly distressed and ashamed
- Resolution: woman and partner in conversation, body language open and connected

On-Screen Text and Graphics:
- Opening text: "Perimenopause rage. It's real. It's hormonal. And it's treatable."
- GABA receptor diagram — simpler version than Video 3
- Quote card from Kate (anonymised): "I knew it was irrational in the moment. But I couldn't stop it."
- Text overlay at resolution: "Kate's rage episodes stopped completely. Within six weeks."

Chapter Breaks:
0:00 — The conversation nobody has
1:30 — The physiology of perimenopausal rage
5:30 — Why it affects high-achieving women
8:00 — The shame cycle
10:30 — Kate's story
15:00 — What treatment looks like
17:00 — Talking to your family about it
18:30 — Closing

Retention Devices:
1. At 2:00 — tease: "Later I'm going to share a story that will stop you in your tracks — a woman who came to me convinced she had a personality disorder, and what we found instead."
2. At 7:00 — pattern interrupt: Dr. Chen pauses and says "I want to read you something." She reads a direct patient quote (anonymised). Change of format — reading aloud — creates immediate attention.
3. At 13:00 — re-engage: "The thing Kate said to me at her three-month appointment — I've thought about it many times since. She said: 'I feel like myself again. That sounds simple, but after 18 months of not feeling like myself, it was everything.'"

Tone and Music Direction:
The most emotionally delicate video in this batch. Begin with near-silence. The music that enters should be almost sorrowful — minor key, sparse — to honour the weight of what women experience during this symptom. At the resolution section, the music can gently shift to something warmer. This video should feel cathartic.

CapCut and Editor Notes:
This video will be highly shared among women who recognise themselves and want to show it to their partners. Add a clearly timed chapter at 17:00 labelled "For your partner — watch this together." The opening silence is important — do not add music or sfx before 30 seconds. Lower third for Kate: "Kate, 38 | Anonymised case study." End screen: "Watch next: 'You're Not Going Mad'" and "How to Talk to Your GP." Pinned comment: "If the rage episodes resonated with you, you are not alone and this is not who you are. Share this video with someone who needs to hear it."`
},
{
  role: "user", stageId: 7, timestamp: tick(3),
  content: "These editing directions are fantastic. Please now write the full teleprompter scripts starting with Video 1."
},
{
  role: "assistant", stageId: 7, timestamp: tick(25),
  content: `VIDEO 1: "Am I in Perimenopause? The 12 Signs That Start Years Before Your Periods Change"

Layer 1 — Teleprompter Script:

---

**HOOK**

If you're in your late thirties or forties and something feels off — your mood, your sleep, your energy, your memory — and you've been told your blood tests are normal and everything is fine, I want you to stay with me for the next fifteen minutes.

Because what I'm about to share with you may be the explanation you have been looking for. For months. Maybe for years.

My name is Dr. Sarah Chen. I'm a menopause specialist, I've been practising medicine for nearly twenty years, and for the last nine years I have worked exclusively with women in perimenopause and menopause. I see dozens of women every week who arrive in my clinic having been told there is nothing wrong with them.

And almost every single time, there is a very clear, very treatable, hormonal explanation for every symptom they are experiencing.

Today I'm going to walk you through twelve signs that perimenopause has already begun — signs that appear years, sometimes a decade, before your periods change. Signs that most GPs don't connect to hormones. Signs that women all over the country are experiencing right now and blaming on stress, on their age, on their personality.

Let's change that.

---

**THE LIE WE WERE ALL TOLD**

The story most of us grew up with goes something like this: menopause happens at around 51, your periods stop, you get hot flushes for a year or two, and then it's over.

That story is wrong. And the consequences of that story being wrong are significant.

Perimenopause — the hormonal transition that precedes the final period — can begin in the late thirties. For most women it's well underway in the early to mid-forties. And it can involve symptoms for anywhere from four to twelve years before the last menstrual period.

You read that right. Twelve years.

The reason so many women are blindsided is not that the symptoms aren't there. It's that we don't recognise them as hormonal. We attribute them to stress at work, to the demands of family life, to "just getting older." We go to our GPs and receive tests that look at the wrong things, and we're told everything is fine.

It isn't fine. It just hasn't been properly investigated.

So let's investigate it properly right now.

---

**THE HORMONAL TIMELINE**

Two hormones decline in perimenopause — and understanding which one drops first changes everything.

Most people know about oestrogen. But the first hormone to decline in perimenopause is usually progesterone.

Progesterone is your calming hormone. It's produced in the second half of your menstrual cycle after ovulation. It has a direct effect on GABA receptors in the brain — the same receptors that anti-anxiety medication and sleeping pills target. It promotes calm. It promotes sleep. It acts as a natural antidepressant.

As ovulation becomes more irregular in the late thirties and early forties, progesterone production drops. Not dramatically at first. Subtly. But enough to shift the neurological environment significantly.

This is why the early symptoms of perimenopause so often look like anxiety, insomnia, and mood instability. It's not psychological. It's progesterone.

Oestrogen follows — fluctuating wildly before eventually declining. This is when the more classically recognised symptoms appear: the hot flushes, the brain fog, the changes in periods, the joint pain.

The twelve signs I'm about to give you map onto this hormonal timeline. Some reflect early progesterone changes. Some reflect oestrogen fluctuation. All of them are real. All of them are treatable.

---

**THE 12 EARLY SIGNS**

**Sign one: New or worsening anxiety.**
If you have never been an anxious person and anxiety has arrived in your late thirties or forties — particularly at night, or in situations that never previously triggered it — this is a classic early progesterone sign. The GABA buffer is reducing.

**Sign two: Sleep disruption.**
Difficulty falling asleep, waking at three in the morning, waking early and being unable to return to sleep. These are all progesterone-related sleep disruptions. When progesterone drops, the brain loses one of its primary sleep-promoting hormones.

**Sign three: Irritability and rage episodes.**
Not low-level irritability. Sudden, disproportionate rage that comes from nowhere and dissipates quickly. Shouting at family members over small things. Feeling flooded and then immediately ashamed. This is the symptom women are most embarrassed about and least likely to mention. It is hormonal.

**Sign four: Brain fog and memory changes.**
Forgetting words mid-sentence. Struggling to hold a train of thought. Feeling cognitively slower than you used to be. Difficulty concentrating in meetings. Oestrogen has receptors throughout the brain — in the hippocampus and prefrontal cortex in particular. When it fluctuates, thinking slows.

**Sign five: Premenstrual syndrome that's getting worse, not better.**
If your PMS has significantly worsened in your late thirties or forties — more irritability, more physical symptoms, more emotional dysregulation in the week before your period — this is frequently an early perimenopause sign. The hormonal fluctuations are more extreme.

**Sign six: Heavier, more irregular, or shorter cycles.**
Your periods don't have to stop or even become significantly irregular for perimenopause to be underway. Changes to flow, duration, or cycle length — particularly cycles that shorten to 21-24 days, or occasional cycles that lengthen to 35+ days — are hormonal shifts worth noting.

**Sign seven: Joint pain.**
Oestrogen has anti-inflammatory properties. As it fluctuates and declines, many women develop new joint aches — particularly in the hips, knees, and hands. This is dismissed as "just getting older" when it is often a directly hormonal symptom.

**Sign eight: Skin and hair changes.**
The skin feeling drier, thinner, or suddenly breakout-prone. Hair shedding more than usual, particularly at the temples and crown. Nails becoming more brittle. Oestrogen maintains collagen and skin integrity — its fluctuation shows up in the dermis.

**Sign nine: Loss of motivation and that sense of flat mood.**
Not depression. Not hopelessness. A subtle loss of the drive and enthusiasm and sheer appetite for life that you used to have. Things feel grey. You're less excited about things. Testosterone also declines in perimenopause, and this subduing of energy and motivation is a very common testosterone-deficiency symptom.

**Sign ten: Migraines, particularly linked to your cycle.**
Migraines that appear or worsen around the time of your period, or that change in character in your forties, are often hormonally driven — specifically by the oestrogen drop before the period. This is a clear early perimenopausal signal.

**Sign eleven: Palpitations.**
Heart palpitations that a cardiologist has assessed and found benign. This is progesterone and oestrogen acting on the cardiovascular system. As they fluctuate, some women experience these unsettling but medically benign episodes of irregular heartbeat or pounding in the chest.

**Sign twelve: A persistent sense that something is wrong — but nobody can find it.**
This is the hardest one to articulate and the most important. A sense that you are not yourself. That your body is doing things you don't recognise. That the person you were at 35 has somehow become harder to access. This is not anxiety. It is not depression. It is not burnout. It is a physiological transition that has not yet been named for you.

Until now.

---

**KATE'S STORY**

I want to tell you about a patient I'll call Kate. Kate was 38 when she came to see me. She had regular periods — every 28 days, like clockwork. She was a marketing director. She was fit, she ate well, she had no significant health history.

She came to me because she had heard me on a podcast and recognised herself in everything I described.

What she was experiencing: rage episodes that terrified her. Migraines around her period. Severe PMS she'd never had in her twenties. Extreme fatigue in the second half of her cycle. And a complete loss of libido that was, in her words, putting her marriage under strain.

She had been to her GP twice. Both times she was told she was too young for menopause. Both times she was advised that her symptoms were likely stress-related.

When I tested her hormones, her progesterone in the luteal phase was almost undetectable. Her oestradiol was fluctuating wildly. She was in early perimenopause. With completely regular periods.

We started her on body-identical progesterone in the second half of her cycle. Within six weeks the rage episodes had stopped. Within three months the migraines were significantly reduced and the PMS was manageable. She told me it had saved her marriage.

Kate is not unusual. Kate is one of hundreds of women I see every year who are in perimenopause with regular periods, who have been told they cannot be, who are suffering unnecessarily.

---

**WHAT TO DO RIGHT NOW**

If you recognised yourself in three or more of those twelve signs, here is what I want you to do.

First: do not dismiss it. What you are experiencing is real. It has a cause. And it is treatable.

Second: request a proper hormone panel from your GP or from a private clinician. Not just FSH and LH. You want: oestradiol, progesterone tested on day 21 of your cycle if you are still cycling, testosterone — free and total — and SHBG. I have a full guide to testing on my website which I'll link in the description.

Third: keep a symptom diary for four weeks. Track your symptoms against your cycle. Patterns will emerge. This diary will be invaluable in any clinical conversation you have.

Fourth: watch my next video — it covers the most common reason capable, high-functioning women fall apart in their forties and why it has nothing to do with their character or their mental health.

You deserve a proper explanation. You deserve a proper investigation. And you deserve a treatment plan that actually works.

I'll see you in the next one.

---

Layer 2 — Section Editing Notes:

**Hook section (0:00–1:00):**
Hold on Dr. Chen throughout — no cuts during this opening. She should be front and centre, direct to camera, warmly lit. The power is in the stillness and the eye contact. Allow the silence before the music enters at around 40 seconds. The first cut should be into the chapter structure graphic at 1:05.

**The lie section (1:05–3:30):**
Use the animated timeline graphic here — a simple line showing perimenopause beginning at 35-38 rather than 49-50. This is the visual that will create the most engagement on rewatch. Allow Dr. Chen to deliver the "twelve years" line without a cut — let it land.

**Hormonal timeline section (3:30–6:00):**
Cut to the two-hormone graphic. Keep Dr. Chen in frame but smaller — the graphic is doing the work here. Return to full-frame Dr. Chen for the final paragraph of this section.

**The 12 signs section (6:00–13:00):**
This is the highest-value section for search and shareability. Title cards for each sign should appear clean and numbered. Pace is medium-fast. Do not dwell — move through the signs with confidence. Signs 3, 9, and 12 are the most emotionally resonant — allow slightly more space around those.

**Kate's story (13:00–16:30):**
Slow down significantly here. This is the emotional heart of the video. Dr. Chen should appear settled and unhurried. The reveal — "when I tested her hormones, her progesterone in the luteal phase was almost undetectable" — should have a moment of silence after it. No cut. Let the weight of that sentence exist.

**What to do now (16:30–19:00):**
Slightly increased pace. The numbered list on screen (four steps) should build sequentially. End with Dr. Chen looking directly at camera, warm and encouraging. Final line delivered slowly.

---

RETENTION NOTES:
1. **Highest drop-off risk: The 12 signs section at signs 6–9 (minutes 9–11).** Prevent with: a mid-section re-engage hook ("Sign nine is the one I see most often in high-achieving women — and it's the one most likely to be misdiagnosed as depression. Let me explain why."), visual variety via cut-aways to relevant B-roll, and the animated sign-counter keeping viewers oriented.

2. **Second drop-off risk: The transition between the hormonal timeline and the signs (minutes 5:30–6:30).** Prevent with: the chapter title card "The 12 Signs" appearing prominently at minute 6, with Dr. Chen delivering it with energy: "Right. Let's get into the twelve signs. I want you to count how many you recognise."

3. **Third drop-off risk: The final minutes after the case study (minutes 16:30 onward).** Prevent with: the "what to do now" section being framed as a practical takeaway ("Write these four things down") — actionable content retains better than summary content.

---

PUBLISHING NOTES:
**YouTube Title Options:**
- "Am I in Perimenopause? 12 Signs That Start YEARS Before Your Periods Change"
- "12 Early Perimenopause Signs Most Doctors Miss (Even With Regular Periods)"
- "The Signs of Perimenopause Nobody Tells You About | Menopause Specialist"

**Description angle:** Open with the question — "Could your anxiety, brain fog, rage, or sleep problems be perimenopause? Even if your periods are regular?" Then list the 12 signs as text in the description (great for search). End with a clear CTA to the testing guide and programme.

**Keyword tags:** perimenopause symptoms, early perimenopause signs, perimenopause with regular periods, perimenopause anxiety, perimenopause brain fog, perimenopause rage, am I in perimenopause, perimenopause quiz, menopause specialist UK, Dr Sarah Chen

**Chapters (YouTube):**
0:00 Are you in perimenopause?
1:05 The timeline nobody tells you about
3:30 Progesterone — the hormone that drops first
6:00 The 12 early signs
13:00 A real case: regular periods, severe symptoms
16:30 What to do right now

**Pinned comment:** "If you recognised 3 or more of these signs, your next step is getting a proper hormone panel. I've put together a free guide to exactly which tests to request — link in the description. Drop a comment below with how many signs you recognised. You are not alone."

**Call to action:** Subscribe for weekly menopause content + link to the free hormone testing guide + mention of the Menopause Optimisation Programme for those ready to work 1:1.`
},
{
  role: "user", stageId: 7, timestamp: tick(3),
  content: "This is incredible. Please continue with Video 2."
},
{
  role: "assistant", stageId: 7, timestamp: tick(22),
  content: `VIDEO 2: "You're Not Going Mad: The Real Reason You Feel Like a Different Person After 40"

Layer 1 — Teleprompter Script:

---

**HOOK**

I have patients who come to me — brilliant women, capable women, women who have held it together their entire lives — and they sit down in my chair, and within five minutes they're in tears.

Not because they're having a breakdown. But because they have spent months, sometimes years, trying to explain what's happening to them and nobody has given them a satisfactory answer.

They've been told they're stressed. They've been told it's anxiety. They've been told to try therapy, to practise mindfulness, to take antidepressants. Some of them have taken antidepressants and feel no different. Some feel worse.

And the first thing I say to every single one of them is this: you're not going mad. There is a physiological explanation for every symptom you are experiencing. And when we address that physiology, the symptoms resolve.

Today I'm going to explain exactly what that physiology is. And I hope by the end of this video, something shifts for you — either for yourself or for someone you love.

---

**WHAT'S HAPPENING IN YOUR BRAIN**

To understand why so many women feel like a different person after forty, you need to understand what oestrogen and progesterone actually do in the brain.

Most people think of these as reproductive hormones. They are much more than that.

Oestrogen has receptors throughout the central nervous system — in the hippocampus, which governs memory and spatial thinking; in the prefrontal cortex, which governs executive function and decision-making; and in the amygdala, which governs emotional regulation. Oestrogen promotes serotonin production, protects neurons, and maintains the speed at which the brain processes information.

When oestrogen fluctuates and declines, the brain is quite literally working in a different neurochemical environment. Thinking slows. Memory falters. Emotional regulation becomes harder. None of this is a character failing. It is biology.

Progesterone is your brain's calming hormone. It acts on GABA-A receptors — the same receptors targeted by anti-anxiety medications and sleeping pills. When progesterone is present in adequate amounts, it creates a baseline of neurological calm. It buffers the stress response. It promotes deep sleep.

When progesterone drops — and it is often the first hormone to drop in perimenopause — that neurological buffer disappears. The world doesn't become more stressful. Your brain just loses its capacity to absorb the stress in the way it used to.

---

**THE SELF-BLAME EPIDEMIC**

Here is what I observe in clinical practice, and what I believe is one of the quiet crises of women's health.

Women who are experiencing these neurological changes — the heightened anxiety, the rage, the brain fog, the emotional volatility — do not, in most cases, attribute them to their hormones. They attribute them to themselves.

They tell themselves they are not coping. That they have become weak. That the woman they used to be — the one who handled everything — has somehow failed. They feel shame. They withdraw. They hide the symptoms from colleagues and partners.

And because they are high-functioning people who are very good at pushing through, they continue to function — at work, at home, in their relationships — at a cost that accumulates quietly and invisibly until it becomes impossible to ignore.

This is not a character flaw. This is a medical issue.

The symptoms of hormonal change in perimenopause are real, they are measurable, and they respond to treatment. The problem is not the women experiencing them. The problem is a medical system that hasn't been given the tools to recognise them.

---

**RACHEL'S STORY**

I want to tell you about a patient I'll call Rachel. Rachel was 46 when she first came to see me. She was a senior barrister — sharp, experienced, accustomed to performing under pressure.

Eighteen months before I met her, she had begun experiencing escalating anxiety that she had never experienced before in her life. She was having palpitations that her cardiologist had assessed and found benign. She was waking at three in the morning with her mind racing and being unable to fall back to sleep. She was averaging four to five hours a night.

She had tried CBT. She had tried two different SSRIs — both of which she felt either made no difference or made her worse. She was being assessed for an anxiety disorder. Her husband thought she was burning out.

When I took a detailed history, I noticed that the anxiety had started at roughly the same time that her periods had shifted from a reliable 28-day cycle to something more variable — sometimes 32 days, sometimes 38. She hadn't connected those two things.

I tested her progesterone at day 21 of her cycle. It was almost undetectable. Her progesterone wasn't just low. It was absent. Her body was not ovulating consistently, and therefore not producing the calming hormone that had been regulating her brain and her sleep and her stress response for the previous twenty-five years.

I started her on body-identical progesterone taken at night. Within six weeks, the three-in-the-morning waking had stopped. Within three months, the palpitations had resolved. She described it as "the volume being turned down on everything."

She is now completely off anti-anxiety medication. She is sleeping seven hours a night. And she told me at her last appointment — almost with disbelief in her voice — "I am performing better in court now than I was at forty."

That is not luck. That is what treating the right problem looks like.

---

**KATE'S STORY**

Rachel's case involved a woman in her mid-forties with obvious cycle changes. But what about a woman in her late thirties with completely regular periods?

Kate was 38. She was a marketing director. She had always described herself as "not an emotional person." Level-headed, logical, in control.

Over the course of about a year, she began experiencing episodes of rage that were completely out of character. She described going from zero to "seeing red" over tiny things — her husband loading the dishwasher in the wrong way, a slightly slow checkout at the supermarket. She knew, in the moment, that her reaction was disproportionate. But she couldn't stop it.

She had shouted at her children twice in ways that haunted her. She was beginning to wonder, in her quieter moments, whether she was developing a personality disorder.

She came to me because she had heard me speak on a podcast and recognised herself. I told her that what she was describing — sudden-onset rage in her late thirties, alongside worsening PMS and sleep disruption — was a classic early perimenopause picture, even with regular periods.

When I told her that, the first response was disbelief. Then, briefly, grief. And then — and I see this almost every time — profound relief. She cried in my office. She said: "So I'm not going mad."

Those five words. I hear them more than any other sentence in my clinic.

---

**THE TREATMENT PATH**

When the root cause is hormonal, treating it hormonally works.

For Rachel, body-identical progesterone taken at night addressed the GABA deficiency directly. For Kate, progesterone in the second half of her cycle managed the perimenopausal fluctuations that were driving the rage.

This doesn't mean everyone's answer is progesterone. The picture is different for everyone. But the principle is consistent: when you address the hormonal environment in which the brain is operating, the neurological and psychological symptoms often resolve in ways that no amount of talking therapy can replicate — not because therapy isn't valuable, but because therapy cannot rebalance your neurotransmitters.

You wouldn't do cognitive behavioural therapy for a broken leg. You would treat the broken leg.

Hormonal brain symptoms need hormonal treatment. Everything else is managing the consequences.

---

**WHAT TO DO NEXT**

If any of this resonated with you — if you recognised yourself in Rachel's story or in Kate's story — here is what I want you to do.

Ask yourself: when did this start? Was there a period change, a cycle shift, a change in PMS around the same time? The timing matters.

Write down your symptoms. Be specific. Don't minimise. The symptom list you bring to a clinician is the starting point for a proper investigation.

Request a proper hormone test. Not just the FSH that many GPs offer — a full panel including progesterone, oestradiol, and testosterone. I'll link a guide to the exact tests in the description below.

And if you've been told everything is normal: find a menopause specialist. The standard reference ranges for hormones were built for population averages — not for what an individual woman needs to function optimally.

You are not going mad. You are experiencing a physiological transition that hasn't been properly identified yet.

That is entirely fixable.

I'll see you in the next video.

---

Layer 2 — Section Editing Notes:

**Hook (0:00–1:15):**
This opening requires Dr. Chen at her most emotionally present. Shoot close — tighter framing than Video 1. Allow the pauses. The sentence "you're not going mad" at the end of the hook should be delivered slowly, with full eye contact, and followed by a beat of silence before the music swells gently.

**Brain science section (1:15–5:30):**
This is the most clinical section — use the neurological diagrams here. Keep them simple. Two animations: one showing oestrogen receptors in the hippocampus and prefrontal cortex, one showing progesterone binding GABA-A. Dr. Chen should speak over these graphics, not be cut away from them — picture-in-picture works well here.

**Self-blame section (5:30–8:30):**
Return to full-frame Dr. Chen. Slow down. This is the emotional core of the video's argument. No cuts to B-roll here — the power is in watching Dr. Chen speak directly to the viewer. This section will be watched, paused, and replayed. Do not interrupt it with graphics.

**Rachel's story (8:30–13:00):**
Warm the lighting imperceptibly — a slight shift toward amber. Dr. Chen should be slightly more relaxed in her delivery here, as if telling the story to a friend. The reveal of Rachel's almost-undetectable progesterone should have a visual emphasis: a brief on-screen text card reading "Progesterone: almost undetectable." Let that sit for two seconds.

**Kate's story (13:00–16:30):**
The rage episodes description should be faster — shorter sentences, quicker cuts if possible — to convey the sudden quality of the episodes. Then slow right down for the office moment. "So I'm not going mad." — full stop. Hold on Dr. Chen's face for two seconds after she says this. Do not cut away.

**Treatment path (16:30–18:00):**
Keep concise. Dr. Chen should feel authoritative and clear here. The "broken leg" analogy benefits from a visual — either a simple graphic or Dr. Chen delivering it standing rather than seated.

**What to do next (18:00–19:30):**
Slightly increased energy — this is the action section. Numbered on-screen list building in sequence. End with Dr. Chen direct to camera, warm smile. "That is entirely fixable." — last line. Hold for one second. Cut to end screen.

---

RETENTION NOTES:
1. **Highest drop-off risk: the brain science section (minutes 3–5).** This is the most technical passage and some viewers will drift. Prevent with: simple, clean animations that require no prior knowledge; Dr. Chen framing it as "this is the explanation that changes everything" before entering it; and breaking the section into two distinct sub-points (oestrogen, then progesterone) with brief visual transitions between them.

2. **Second risk: the gap between the two case studies (minutes 12:30–13:30).** The transition between Rachel and Kate needs a clear bridge. Suggested script addition: "Rachel's case involved obvious cycle changes. But what about a woman whose periods were completely regular? What happened with Kate is, if anything, even more important to understand." This tease maintains momentum across the case study transition.

3. **Third risk: the final two minutes.** Once the emotional peak of "so I'm not going mad" has passed, some viewers will feel satisfied and drift. Prevent by framing the "what to do next" section as a practical gift: "I want to give you four things to do before you close this video. Write them down if you can." Actionable content maintains to the end.

---

PUBLISHING NOTES:
**YouTube Title Options:**
- "You're Not Going Mad: The Real Reason You Feel Different After 40"
- "Why Capable Women Fall Apart in Their 40s (And It's Not What You Think)"
- "Perimenopause and Your Brain: The Medical Explanation Nobody Gave You"

**Description angle:** Open with the experience — "If you've spent months wondering what's wrong with you, being told your tests are normal, and struggling to recognise yourself — this video is for you." Then give the neurological overview as text. CTA to testing guide and programme.

**Keyword tags:** perimenopause brain, perimenopause anxiety, perimenopause rage, perimenopause personality changes, feel different after 40, hormonal anxiety, progesterone deficiency symptoms, menopause and mental health

**Chapters:**
0:00 You're not going mad
1:15 What oestrogen and progesterone do in your brain
5:30 The self-blame epidemic
8:30 Rachel's story: 18 months of the wrong treatment
13:00 Kate's story: rage, regular periods, and relief
16:30 The treatment path
18:00 What to do right now

**Pinned comment:** "The five words I hear most often in my clinic: 'So I'm not going mad.' If that sentence landed for you, please share this video. And drop a comment below — I read every one."

**Call to action:** Link to hormone testing guide + Video 3 (perimenopause and anxiety) + programme enquiry page.`
},
];

// ── videoTitles array ─────────────────────────────────────────────────────────

const videoTitles = [
  { number: 1, title: "Am I in Perimenopause? The 12 Signs That Start Years Before Your Periods Change", theme: "The Perimenopause Wake-Up Call", description: "A comprehensive guide to the early warning signs most doctors miss — with regular periods." },
  { number: 2, title: "You're Not Going Mad: The Real Reason You Feel Like a Different Person After 40", theme: "The Perimenopause Wake-Up Call", description: "Hormonal changes as a physiological explanation for personality, mood, and cognitive shifts." },
  { number: 3, title: "Why Perimenopause Looks Like Anxiety (And What to Do When Your Doctor Prescribes Antidepressants)", theme: "The Perimenopause Wake-Up Call", description: "The misdiagnosis pathway from hormonal anxiety to SSRI prescription and how to change it." },
  { number: 4, title: "The Rage Nobody Warns You About: Perimenopause Anger, Why It Happens, and How to Stop It", theme: "The Perimenopause Wake-Up Call", description: "The progesterone-rage connection and why sudden uncharacteristic anger is a hormonal event." },
  { number: 5, title: "Your Brain on Menopause: The Truth About Brain Fog, Memory Loss, and Why It's Not What You Think", theme: "The Perimenopause Wake-Up Call", description: "Oestrogen's role in cognitive function and what actually restores it." },
  { number: 6, title: "How to Advocate for Yourself at the GP: What to Say When You're Told Your Bloods Are Normal", theme: "The Perimenopause Wake-Up Call", description: "A practical guide to navigating the NHS menopause consultation — what tests to request." },
  { number: 7, title: "The 'Too Young' Myth: Why Your GP Might Be Missing Your Perimenopause at 38, 40, or 42", theme: "The Perimenopause Wake-Up Call", description: "The diagnostic failure that delays treatment by years for women in early perimenopause." },
  { number: 8, title: "Perimenopause Vs Menopause: The Difference That Changes Everything About Your Treatment", theme: "The Perimenopause Wake-Up Call", description: "Why the transition phase deserves its own clinical attention and why waiting is too long." },
  { number: 9, title: "Progesterone: The Calming Hormone You've Never Heard Of (And Why It Drops First)", theme: "The Hormone Truth", description: "The most overlooked hormone in menopause care — what progesterone does and how its loss affects everything." },
  { number: 10, title: "Oestrogen and Your Brain: The Alzheimer's Prevention Conversation Nobody Is Having", theme: "The Hormone Truth", description: "The evidence connecting oestrogen deficiency to Alzheimer's risk and the window of opportunity." },
  { number: 11, title: "Testosterone Is a Female Hormone Too: Why Women Are Being Denied the Treatment That Changes Everything", theme: "The Hormone Truth", description: "The case for testosterone in women — energy, drive, cognition, libido, and muscle." },
  { number: 12, title: "The Cortisol Thief: How Stress Steals Your Progesterone (And Why High-Achieving Women Are Hit Hardest)", theme: "The Hormone Truth", description: "The pregnenolone steal explained — why women who cope best with stress are often most hormonally depleted." },
  { number: 13, title: "Oestrogen Dominance and Oestrogen Deficiency: How You Can Have Both at the Same Time", theme: "The Hormone Truth", description: "The gut-oestrogen axis, poor oestrogen clearance, and why a woman can have hot flushes and heavy periods simultaneously." },
  { number: 14, title: "The Truth About HRT and Breast Cancer: What the Women's Health Initiative Actually Said", theme: "The Hormone Truth", description: "A calm, evidence-based deconstruction of the study that scared a generation away from effective treatment." },
  { number: 15, title: "Why Your Hormones Make Your Thyroid Look Broken (When It Isn't)", theme: "The Hormone Truth", description: "The oestrogen-thyroid receptor connection — why thyroid symptoms in perimenopause are often hormonal." },
  { number: 16, title: "SHBG, Free Hormones, and Why Standard Blood Tests Are Missing the Point", theme: "The Hormone Truth", description: "What sex hormone binding globulin does and why total testosterone is not the useful number." },
  { number: 17, title: "Body-Identical HRT vs Synthetic HRT: The Difference That Actually Matters", theme: "HRT — The Facts", description: "Why not all HRT is the same and why the type of progestogen matters enormously." },
  { number: 18, title: "Why You Might Feel Worse on HRT (The Four Reasons It's Not Working and How to Fix It)", theme: "HRT — The Facts", description: "Under-dosing, wrong route, synthetic progestogen side effects, and unaddressed co-factors explained." },
  { number: 19, title: "Starting HRT: A Practical Guide to What to Expect in the First Three Months", theme: "HRT — The Facts", description: "Setting realistic expectations, common adjustment symptoms, and when to push through." },
  { number: 20, title: "The Timing Hypothesis: Why Starting HRT in Perimenopause Protects Your Heart and Brain", theme: "HRT — The Facts", description: "The window of opportunity concept and why early intervention produces dramatically better outcomes." },
  { number: 21, title: "How Long Should You Stay on HRT? The Honest Answer to the Question Every Woman Asks", theme: "HRT — The Facts", description: "The evidence on long-term HRT use and why 'forever' may be the right answer for many women." },
  { number: 22, title: "HRT Myths Busted: The 10 Things Women Believe That Simply Aren't True", theme: "HRT — The Facts", description: "Rapid-fire myth-busting on weight gain, cancer risk, dependency, natural menopause, and more." },
  { number: 23, title: "Why You're Gaining Weight in Menopause Despite Doing Everything Right", theme: "Body, Muscle, and Metabolism", description: "Cortisol, insulin resistance, oestrogen deficiency, and the exercise-makes-it-worse paradox." },
  { number: 24, title: "Stop Doing So Much Cardio: Why Strength Training Is the Medicine Your Menopausal Body Needs", theme: "Body, Muscle, and Metabolism", description: "The science of muscle mass, oestrogen, and longevity — and why conventional fitness advice is harmful." },
  { number: 25, title: "Muscle Is Your Most Important Organ After 40: The Menopause-Longevity Connection", theme: "Body, Muscle, and Metabolism", description: "Sarcopenia, metabolic health, fracture risk, and cognitive protection — why building muscle is non-negotiable." },
  { number: 26, title: "The Beginners Guide to Strength Training in Perimenopause: How to Start, What to Lift, and Why Heavy Is Safe", theme: "Body, Muscle, and Metabolism", description: "A practical, reassuring introduction to progressive resistance training for women who have never done it." },
  { number: 27, title: "Menopause Belly Fat: Why It Appears, Why It Won't Shift, and the Only Approach That Actually Works", theme: "Body, Muscle, and Metabolism", description: "The cortisol-oestrogen-visceral fat mechanism and the evidence-based path to body recomposition." },
  { number: 28, title: "Protein: The Macronutrient That Changes Everything for Women Over 40", theme: "Body, Muscle, and Metabolism", description: "Muscle protein synthesis, anabolism, and why most women eat less than half the protein they need." },
  { number: 29, title: "Why You Can't Sleep in Perimenopause: The Four Hormonal Mechanisms Keeping You Awake", theme: "Sleep, Stress, and the Nervous System", description: "Progesterone, cortisol, oestrogen, and blood sugar — the complete hormonal picture of perimenopausal insomnia." },
  { number: 30, title: "My Four-Layer Sleep Reclamation Method: How to Sleep Through the Night Again", theme: "Sleep, Stress, and the Nervous System", description: "The complete protocol — hormonal timing, cortisol management, blood sugar stabilisation, and sleep environment." },
  { number: 31, title: "The 3am Wake-Up: What It Means and How to Stop It", theme: "Sleep, Stress, and the Nervous System", description: "Blood sugar dropping in the night as a trigger for cortisol release and the simple intervention that resolves it." },
  { number: 32, title: "Stress in Menopause: Why You Can't Cope the Way You Used To (And It's Not a Weakness)", theme: "Sleep, Stress, and the Nervous System", description: "How declining oestrogen and progesterone remove the hormonal buffer for the stress response." },
  { number: 33, title: "How to Protect Your Nervous System in Perimenopause: The Daily Practices That Shift the Physiology", theme: "Sleep, Stress, and the Nervous System", description: "Specific, evidence-based practices for cortisol regulation — including what doesn't work." },
  { number: 34, title: "Menopause and Anxiety: When It's Hormonal, When It's Psychological, and How to Tell the Difference", theme: "Sleep, Stress, and the Nervous System", description: "A clinician's framework for distinguishing hormonally-driven anxiety from other causes." },
  { number: 35, title: "The Gut-Oestrogen Connection: Why Your Digestive Health Determines How Well Your Hormones Work", theme: "Gut, Bone, and Long-Term Health", description: "The estrobolome, oestrogen recycling, and the four-week gut reset protocol." },
  { number: 36, title: "The Truth About Calcium and Bone Health: Why Your Supplements Aren't Protecting You", theme: "Gut, Bone, and Long-Term Health", description: "The calcium myth debunked — what bones actually need and why oestrogen matters more." },
  { number: 37, title: "Your DEXA Scan Explained: What Osteopenia Really Means and Why It's Not an Immediate Prescription for Bisphosphonates", theme: "Gut, Bone, and Long-Term Health", description: "A calm guide to interpreting bone density results and the approaches that can reverse bone loss." },
  { number: 38, title: "The Menopause-Cardiovascular Risk Nobody Talks About: Why Protecting Your Heart Starts at 40", theme: "Gut, Bone, and Long-Term Health", description: "Oestrogen's role in vascular health and why HRT timing matters for heart protection." },
  { number: 39, title: "Menopause and the Gut: Bloating, IBS, and Digestive Changes That Are Actually Hormonal", theme: "Gut, Bone, and Long-Term Health", description: "How oestrogen decline affects gut motility, permeability, and microbiome diversity." },
  { number: 40, title: "Your Hormones and Your Skin, Hair, and Nails: What's Normal, What's Treatable, and What to Do", theme: "Gut, Bone, and Long-Term Health", description: "The cosmetic and structural effects of declining oestrogen — collagen, hair cycling, and nail changes." },
  { number: 41, title: "The Complete Hormone Test You Should Be Getting (That Most GPs Won't Order)", theme: "Testing, Treatment, and Working With Your Doctor", description: "A plain-English guide to the comprehensive hormone panel — what to test, when, and how to interpret results." },
  { number: 42, title: "Understanding Your Results: What Your Lab Numbers Actually Mean in the Context of Menopause", theme: "Testing, Treatment, and Working With Your Doctor", description: "Why reference ranges were built on population averages, not optimal function." },
  { number: 43, title: "The DUTCH Test Explained: What It Reveals About Your Hormones That Blood Tests Miss", theme: "Testing, Treatment, and Working With Your Doctor", description: "A guide to dried urine hormone testing, oestrogen metabolites, and cortisol clearance." },
  { number: 44, title: "How to Get the Best Out of Your NHS GP for Menopause: Scripts, Questions, and What to Do If They Say No", theme: "Testing, Treatment, and Working With Your Doctor", description: "A practical guide to navigating the healthcare system and escalating to a menopause specialist." },
  { number: 45, title: "Private Menopause Care: Is It Worth It, What Does It Cost, and What Should You Expect?", theme: "Testing, Treatment, and Working With Your Doctor", description: "An honest guide to what private menopause care offers and how to find a good specialist." },
  { number: 46, title: "Supplements for Menopause: What the Evidence Actually Says (The Good, the Useless, and the Risky)", theme: "Testing, Treatment, and Working With Your Doctor", description: "An evidence-based review of the most popular menopause supplements." },
  { number: 47, title: "How to Feel Better in Menopause Than You Did at 35: The Case for Hormonal Optimisation", theme: "Thriving in Menopause", description: "The difference between treatment and optimisation — and why 'not as bad' is not the standard." },
  { number: 48, title: "The Menopause Supplement Stack I Give Every Patient: Five Evidence-Based Nutrients That Change Everything", theme: "Thriving in Menopause", description: "The Cognitive Revival Stack — omega-3, phosphatidylserine, lion's mane, B-complex, and magnesium." },
  { number: 49, title: "Menopause and Libido: Why Loss of Sex Drive Is Not Normal, Not Inevitable, and Completely Treatable", theme: "Thriving in Menopause", description: "Testosterone, vaginal health, relationship dynamics, and the complete picture of female sexual health after 40." },
  { number: 50, title: "Menopause and Relationships: The Conversation Your Partner Needs to Hear", theme: "Thriving in Menopause", description: "A guide for women to explain the hormonal transition to their partners — and for partners who want to understand." },
  { number: 51, title: "Menopause at Work: How to Protect Your Performance, Manage Your Symptoms, and Know Your Rights", theme: "Thriving in Menopause", description: "Cognitive strategies, practical accommodations, and the conversation with your employer." },
  { number: 52, title: "Your Menopause Roadmap: The Five-Step Framework for Taking Control of Your Hormonal Health", theme: "Thriving in Menopause", description: "A comprehensive overview of the testing, treating, strengthening, optimising sleep, and protecting the brain approach." },
];

// ── scripts array ─────────────────────────────────────────────────────────────

const scripts = [
  {
    number: 1,
    title: "Am I in Perimenopause? The 12 Signs That Start Years Before Your Periods Change",
    teleprompterScript: messages.find(m => m.content.includes("Layer 1 — Teleprompter Script") && m.content.includes("VIDEO 1"))?.content
      .split("Layer 1 — Teleprompter Script:")[1]
      ?.split("Layer 2 — Section Editing Notes:")[0]
      ?.trim() ?? "",
    editingDirections: messages.find(m => m.content.includes("Layer 2 — Section Editing Notes") && m.content.includes("VIDEO 1"))?.content
      .split("Layer 2 — Section Editing Notes:")[1]
      ?.split("RETENTION NOTES:")[0]
      ?.trim() ?? "",
    retentionNotes: messages.find(m => m.content.includes("RETENTION NOTES") && m.content.includes("VIDEO 1"))?.content
      .split("RETENTION NOTES:")[1]
      ?.split("PUBLISHING NOTES:")[0]
      ?.trim() ?? "",
    publishingNotes: messages.find(m => m.content.includes("PUBLISHING NOTES") && m.content.includes("VIDEO 1"))?.content
      .split("PUBLISHING NOTES:")[1]
      ?.split("VIDEO 2:")[0]
      ?.trim() ?? "",
  },
  {
    number: 2,
    title: "You're Not Going Mad: The Real Reason You Feel Like a Different Person After 40",
    teleprompterScript: messages[messages.length - 1].content
      .split("Layer 1 — Teleprompter Script:")[1]
      ?.split("Layer 2 — Section Editing Notes:")[0]
      ?.trim() ?? "",
    editingDirections: messages[messages.length - 1].content
      .split("Layer 2 — Section Editing Notes:")[1]
      ?.split("RETENTION NOTES:")[0]
      ?.trim() ?? "",
    retentionNotes: messages[messages.length - 1].content
      .split("RETENTION NOTES:")[1]
      ?.split("PUBLISHING NOTES:")[0]
      ?.trim() ?? "",
    publishingNotes: messages[messages.length - 1].content
      .split("PUBLISHING NOTES:")[1]
      ?.trim() ?? "",
  },
];

// ── Assemble session ──────────────────────────────────────────────────────────

const session = {
  practitionerName: "Dr. Sarah Chen",
  platform: "YouTube",
  startedAt: 1746057600000,
  currentStageIdx: 7,
  messages,
  videoTitles,
  scripts,
};

const outPath = resolve(__dirname, "../public/demo-session.json");
writeFileSync(outPath, JSON.stringify(session, null, 2));
console.log(`Demo session written to ${outPath} (${(JSON.stringify(session).length / 1024).toFixed(0)}KB)`);
