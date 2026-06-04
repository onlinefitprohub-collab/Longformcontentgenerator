"""
Generates public/demo-session.json for the Fitness Script Generator.
Coach persona: Alex Reed — online fitness coach, sustainable fat loss for busy professionals.
"""
import json, time

now = int(time.time() * 1000)
def t(offset_s): return now - (3600 * 24 * 7 * 1000) + (offset_s * 1000)

messages = [
    # ── WELCOME (assistant) ───────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """Let's build your video content library. Before I interview you, I need to understand your platform and goals.

**Stage 0 — Context & Platform Brief**

Please answer these four questions so I can tailor every script, editing direction, and content angle to your specific situation:

**1. Platform** — Where will these videos primarily live? (e.g. YouTube, a course platform, Instagram, a membership site, or a combination?)

**2. Video length** — What's your intended length range? (e.g. 10–20 minutes, 20–40 minutes, 45+ minutes?)

**3. Audience** — Do you have an existing audience or are you building from scratch?

**4. Goal** — What's the primary purpose of this video library? (Authority building, lead generation, program sales, pure education, or a mix?)

Once I have these answers I'll begin the full interview — we'll cover your background, your best client transformation stories, your training and nutrition philosophy, your audience's biggest struggles, the fitness myths you want to bust, and your signature programmes. From all of that, I'll map out 52 long-form video scripts tailored entirely to your expertise.""",
        "stageId": 0,
        "timestamp": t(0),
    },
    # ── STAGE 0 user ─────────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """1. YouTube primarily, with content repurposed to Instagram Reels and a private membership community.
2. 15–25 minutes on YouTube, shorter cuts for Instagram.
3. I have about 18,000 YouTube subscribers and 22,000 Instagram followers — so an existing but growing audience.
4. Mix of authority building and lead generation into my 12-week online coaching programme.""",
        "stageId": 0,
        "timestamp": t(30),
    },
    # ── STAGE 0 complete / Stage 1 begin ────────────────────────────────────
    {
        "role": "assistant",
        "content": """Perfect — 15–25 minute YouTube videos with Instagram repurposing into an existing audience of 40,000+ across platforms, with lead generation into a 12-week programme as the primary goal. Every script, hook, and call to action will be built around that.

Stage 0 complete. Moving to Stage 1.

---

**Stage 1 — Coach Background**

Let's start with you. Tell me about your journey into fitness coaching — your qualifications, your niche, and what makes your approach different from the thousands of other online coaches out there.

- What are your certifications and qualifications?
- How long have you been coaching, and when did you move fully online?
- What's your coaching niche — who do you work with and what do you specifically help them achieve?""",
        "stageId": 0,
        "timestamp": t(60),
    },
    # ── Stage 1 user ─────────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """I'm a Level 3 Personal Trainer and Level 4 Sports Nutrition Advisor. I also have a Certificate in Applied Sports Science from Loughborough. I've been coaching for nine years — six in commercial gyms and three fully online. My niche is sustainable fat loss for busy professionals and parents, specifically people in their 30s and 40s who've been dieting their whole lives and are exhausted by it.

What makes me different is that I don't use aggressive restriction or extreme protocols. I've built a methodology I call the Minimum Effective Dose approach — doing the least amount of training and dietary change required to produce consistent fat loss without burning out. Most of my clients are working 50-hour weeks, have kids, and have failed every diet they've ever tried. My whole system is built around the constraints of their real life, not an idealised gym lifestyle.

I was one of those clients myself. I was 28, working in finance, training six days a week, eating 1,200 calories, and gaining fat. I completely broke my relationship with food and my body. It took me three years to rebuild it, and that experience shaped everything I now teach.""",
        "stageId": 1,
        "timestamp": t(120),
    },
    # ── Stage 1 follow-up ─────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """That's a compelling origin story — the coach who used to be exactly who they now coach. The "Minimum Effective Dose" concept is immediately differentiating. A couple of follow-up questions:

- You mentioned your own experience of training hard, eating very little, and gaining fat — what was actually happening physiologically? How do you explain that mechanism to clients?
- When you say "sustainable fat loss without burning out" — what specifically does your programme look like versus a conventional fat loss programme? Walk me through the contrast.""",
        "stageId": 1,
        "timestamp": t(150),
    },
    # ── Stage 1 follow-up response ────────────────────────────────────────────
    {
        "role": "user",
        "content": """Great questions. The physiological explanation: when you combine excessive training volume with severe calorie restriction, you trigger a hormonal response that's designed to protect you from starvation. Cortisol elevates and stays elevated. T3 (active thyroid hormone) drops. Leptin — your satiety and metabolism signalling hormone — plummets. Your body literally becomes metabolically slower and more efficient at storing fat. You become very good at doing more with less, which is the opposite of what you want. I explain it to clients as "you've trained your body to be a hybrid car when you need it to be a sports car."

Conventional fat loss programme: aggressive calorie deficit (often 800–1000 below maintenance), 5–6 days of training per week, lots of cardio, very restrictive food rules, unsustainable by definition.

My approach: deficit of 300–400 calories, 3–4 training sessions per week (primarily strength-based), no banned foods, built around the client's existing schedule. The fat loss is slower — typically 0.5–1 lb per week — but it's actually happening and it's continuing at month 6, not stalling at month 6 like every crash diet they've tried.""",
        "stageId": 1,
        "timestamp": t(200),
    },
    # ── Stage 1 complete ──────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """Excellent. The hybrid car vs sports car analogy is gold — memorable, accurate, and immediately relatable to a non-scientific audience. Stage 1 complete. Moving to Stage 2.

---

**Stage 2 — Client Transformation Stories**

I want to hear about your most powerful client transformations. For each one, walk me through who they were, what they'd already tried, what you did differently, and what changed — beyond just the physical.

Start with the client story that most represents the problem you solve.""",
        "stageId": 1,
        "timestamp": t(240),
    },
    # ── Stage 2 user ──────────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """The one I tell most is Sarah. She was 41, a marketing director, two kids under 10. She'd been trying to lose the same 15 pounds for four years. She'd done WeightWatchers three times, two rounds of a popular 1,200-calorie meal plan, and was currently doing HIIT classes five mornings a week at 5:30am while also following a "clean eating" programme she'd bought online.

She was exhausted, she was hungry all the time, and she was gaining weight despite doing everything "right." She'd started to believe something was medically wrong with her — she'd been tested for thyroid issues, PCOS, everything came back normal. Her GP told her to try eating less and moving more.

When I reviewed her setup, the problems were immediately obvious. She was eating 1,100 calories a day — significantly under maintenance for an active woman her size. She was training at high intensity five mornings a week on that intake, which meant her cortisol was chronically elevated. She was sleeping five to six hours a night because of the early alarms. Her step count outside of exercise was almost zero — she had a desk job and drove everywhere.

I did something that shocked her: I told her to stop the HIIT classes. I put her on three 45-minute strength sessions per week. I raised her calories to 1,600. I gave her a daily step goal of 8,000 rather than formal cardio. And I told her not to weigh herself for six weeks.

In the first three weeks she was panicking. The scale didn't move and she felt like she was doing less. At week six her weight had dropped 4 lbs and her measurements were down significantly more than that — she'd lost body fat while adding some lean tissue. At 12 weeks she'd lost 11 lbs and her sleep had improved dramatically because she wasn't dragging herself out of bed at 5am. She told me it was the first time in four years she didn't dread mealtimes.

The second story I tell a lot is Marcus — he's the other archetype I work with. 38, works in tech, no kids but insane work hours. He came to me because he wanted to build muscle, not lose fat — but he'd been training for three years and had nothing to show for it. He was doing a push-pull-legs programme six days a week, spending 90 minutes in the gym each session. He was eating what he called "a lot" — but when we tracked it, he was eating 2,400 calories and needed closer to 3,000 to be in a genuine surplus.

His problem wasn't effort, it was not understanding the basics. He was dramatically undertrained on the exercises that matter most (he avoided squats and deadlifts because he found them boring), dramatically overtrained on isolation exercises, and consistently underfuelling without realising it. I cut him to four sessions per week, built the programme around compound lifts, and got his calories up to 3,100. In 16 weeks he added 6 kg of lean mass — more than he'd gained in his previous three years combined.""",
        "stageId": 2,
        "timestamp": t(350),
    },
    # ── Stage 2 follow-up ─────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """Both stories are powerful and very different. Sarah's story anchors the fat loss argument perfectly — she was training more and eating less and moving backwards. Marcus shows the flip side: someone training hard without the fundamentals.

One follow-up on Sarah: when you raised her calories and cut her training, what was the emotional journey like for her? A 41-year-old who's been told "eat less, move more" her whole life is being asked to do the opposite — that must require significant trust and tolerance of discomfort.

And do you have a third story — someone whose transformation was primarily psychological or mindset-based, where the physical result was almost secondary?""",
        "stageId": 2,
        "timestamp": t(400),
    },
    # ── Stage 2 user cont ──────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """Sarah's emotional journey was genuinely difficult. The first two weeks she messaged me almost every day asking if we'd made a mistake. She'd been conditioned to believe that eating more was always wrong, so consuming 1,600 calories felt like failing even though it was part of the plan. The turning point was when she woke up on a Saturday morning at 7am naturally, without an alarm, and realised she felt rested for the first time in months. That's when she started trusting the process — not when the scale moved, but when her quality of life improved.

For a mindset story — yes. Priya, 36, a lawyer. She'd hired me purely for the structure of a programme but within two sessions it was clear that food and her body were deeply entangled with how she felt about herself as a person. She'd been using restriction as self-punishment and food as reward since university. She wasn't in a place where a calorie target would help — it would just become another set of rules to fail against.

I referred her to a therapist I work with alongside her coaching, and we worked completely differently with her. No tracking at all for the first eight weeks. Just building consistent movement habits and establishing what I call "neutral eating" — eating in a way that has no moral charge attached to it, food that's just food. She didn't lose much weight in those eight weeks. But at week twelve, when we introduced tracking very gently, she engaged with it completely differently — as data, not judgement. Over six months she lost 14 lbs but told me the most significant change was that she no longer thought about food between meals. For her, the cognitive freedom was the transformation.""",
        "stageId": 2,
        "timestamp": t(480),
    },
    # ── Stage 2 complete ──────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """Three distinct and compelling stories — Sarah (the burned-out chronic dieter), Marcus (the hard trainer missing fundamentals), and Priya (whose transformation was psychological first, physical second). These will anchor at least a dozen scripts.

Stage 2 complete. Moving to Stage 3.

---

**Stage 3 — Training and Methodology Pillars**

What are the five to eight core principles that define your coaching approach? Not tactics — the deep beliefs about training and nutrition that everything else flows from. Start with the one that most contradicts what your clients have been told before they found you.""",
        "stageId": 2,
        "timestamp": t(520),
    },
    # ── Stage 3 user ──────────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """The big one that contradicts everything they've been told: **Strength training is the foundation of fat loss, not cardio.**

Most of my clients arrive having been told to do more cardio to lose fat. They're doing HIIT, running, cycling classes. The problem is cardio burns calories during the session and then the body adapts — it becomes more efficient and burns fewer calories over time. Strength training does something fundamentally different: it builds or preserves lean muscle tissue, which increases your resting metabolic rate permanently. Every kilogram of muscle you carry burns roughly 13 additional calories per day at rest. That doesn't sound like much but compounded over a year it's significant — and it also means your body composition changes even when you're not training.

**Second pillar: The deficit must be small enough to sustain.**

A 1,000-calorie deficit is not better than a 400-calorie deficit. It's faster in the short term and catastrophically worse in the medium term. Aggressive restriction triggers the hormonal adaptations I mentioned — metabolic slowdown, cortisol elevation, muscle loss. A 400-calorie deficit with 0.5 lbs per week of loss over 52 weeks is 26 lbs. No one achieves that on a crash diet.

**Third: NEAT is often more important than formal exercise.**

Non-Exercise Activity Thermogenesis — the calories you burn through everyday movement. Walking, fidgeting, standing, doing housework. For most of my clients, NEAT accounts for more daily calorie expenditure than their gym sessions. And it's the thing that crashes when they diet hard — the body subconsciously reduces NEAT to conserve energy, which is why people feel more lethargic when restricting. Getting 8,000–10,000 steps per day is often more impactful than adding another gym session.

**Fourth: Protein is the non-negotiable.**

I'll negotiate on carbs, on fats, on training days, on meal timing. I won't negotiate on protein. Aiming for 1.6–2.2g per kg of bodyweight per day is essential for preserving muscle in a deficit, managing satiety, and maintaining metabolic rate. Most of my clients are eating around 60–80g when they start. We move them toward 150–160g and the hunger management effect alone typically transforms their relationship with their calorie target.

**Fifth: Adherence beats optimisation.**

The best programme is the one you will actually do. I can write a theoretically perfect training plan — but if it requires the client to train at 6am six days a week and they're a night owl with an unpredictable schedule, it will fail. I ask every client: what's the worst week you could have and still do this? Whatever the answer is, that's the programme. We build from the minimum sustainable baseline upward, not from the maximum optimal standard downward.

**Sixth: Sleep is a training variable.**

Not a nice-to-have. Inadequate sleep (under 7 hours) measurably increases hunger hormones (ghrelin) and decreases satiety hormones (leptin), increases muscle breakdown, reduces insulin sensitivity, and significantly impairs cognitive control around food choices. You cannot out-train poor sleep. If a client is regularly getting under 6 hours, that's the first thing we address before anything else.""",
        "stageId": 3,
        "timestamp": t(620),
    },
    # ── Stage 3 complete ──────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """Six clearly defined, well-evidenced pillars — each one directly contradicts something the mainstream fitness industry is telling your audience. These will generate some of your highest-performing content.

Stage 3 complete. Moving to Stage 4.

---

**Stage 4 — Audience and Common Questions**

Who exactly is your audience and what keeps them stuck? I want the specific language they use, the specific questions they ask, and the specific fears they're carrying. Start with the most common question you receive.""",
        "stageId": 3,
        "timestamp": t(660),
    },
    # ── Stage 4 user ──────────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """The most common question: "I'm eating 1,200 calories and exercising every day — why am I not losing weight?" That question, in some variation, makes up probably 30% of my DMs.

The second: "How do I lose belly fat specifically?" They want spot reduction. It doesn't exist, but they've seen so many ads for "targeted belly fat" protocols that they believe it's possible.

Third: "What should I eat before and after training?" Meal timing — which matters much less than total daily intake and protein distribution, but it's what people ask about because it feels controllable.

Fourth: "How many times per week should I train?" The answer is always fewer than they expect.

Fifth: "Is [specific food] bad for you?" The moralising of food. Sugar, processed food, alcohol, dairy — they've absorbed so many food rules that eating feels like navigating a minefield.

The language they use about themselves is revealing: "I have no willpower," "I'm lazy," "I've always struggled with this," "I can't stick to anything," "I'm not a gym person." They pathologise themselves instead of recognising that the approach they've been given doesn't fit their life.

Who they are demographically: 30–50, predominantly women (about 70% of my audience), white-collar jobs, time-poor, often parents. They've usually had a relationship with dieting since their teens or twenties. They've done at least one structured diet programme before coming to me — often multiple. They're smart, capable people in every area of their life except this one, and that contrast is genuinely distressing to them.

Their deepest fear isn't about aesthetics, actually. It's about feeling out of control. The weight is a symbol of something they can't manage, and that feels wrong to them given how competent they are everywhere else.""",
        "stageId": 4,
        "timestamp": t(720),
    },
    # ── Stage 4 complete ──────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """That audience profile is exceptionally clear and rich — particularly the insight that the fear isn't really aesthetic but about feeling out of control in one area of an otherwise controlled life. That single insight could anchor an entire video.

Stage 4 complete. Moving to Stage 5.

---

**Stage 5 — Fitness Myths and Contrarian Views**

Now I want your hot takes. The things you say that make conventional fitness coaches uncomfortable. The myths you actively have to dismantle with almost every client who walks through the door.""",
        "stageId": 4,
        "timestamp": t(760),
    },
    # ── Stage 5 user ──────────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """**Myth 1: You need to earn your food through exercise.**
This is one of the most damaging ideas in mainstream fitness. It creates a punish-reward cycle with food that destroys your relationship with both eating and training. Food is fuel. Exercise is for performance, health, and body composition — not for burning off what you ate. The two things should be completely separate in your head.

**Myth 2: Clean eating is the answer.**
The idea that there are "clean" foods and "dirty" foods — and that if you just eat the right foods you'll lose weight — is both scientifically incorrect and psychologically damaging. You can gain fat eating nothing but chicken, sweet potato, and broccoli if you eat enough of it. You can lose fat eating pizza and ice cream if you're in a calorie deficit. Total calories and protein are the primary drivers of body composition. Food quality matters for health and satiety, but it is not the mechanism of fat loss.

**Myth 3: Cardio is the primary fat loss tool.**
I've touched on this but it deserves its own statement: for body composition purposes, strength training beats cardio every time. Cardio is great for cardiovascular health, mental health, and modest calorie expenditure. But for sustainably changing how your body looks, progressive resistance training is non-negotiable. Cardio is optional.

**Myth 4: You need to be sore to have had a good workout.**
Delayed onset muscle soreness (DOMS) is not a proxy for training effectiveness. It's a sign of mechanical stress and novelty. Elite athletes are rarely sore because their bodies have adapted. Training a muscle you haven't used recently will make you sore. Progressive overload — lifting heavier or doing more volume over time — is what produces results, and that often produces no soreness at all.

**Myth 5: Supplements are required.**
The supplement industry is worth billions because it sells hope in a bottle. The only supplements with consistent, meaningful evidence for the general fitness population are creatine monohydrate, vitamin D (if deficient), and protein powder (as a convenience food, not a magic substance). Everything else — fat burners, BCAAs, pre-workouts, detox teas — is largely marketing. The person with the best results will almost always be the one with the most consistent training and nutrition habits, regardless of supplements.

**Myth 6: Motivation is what you need to stay consistent.**
No. Motivation is unreliable. It fluctuates with your mood, your sleep, your stress, your results. The people who maintain their fitness long-term are not more motivated than everyone else — they've built systems that make the behaviour happen regardless of motivation. They've made training non-negotiable in the same way showering is non-negotiable. Waiting for motivation before taking action is a guaranteed path to inaction.""",
        "stageId": 5,
        "timestamp": t(850),
    },
    # ── Stage 5 complete ──────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """Six strong, well-articulated myth-busters. Each one is a standalone video with the potential to be genuinely controversial in the best possible way — especially the clean eating and motivation myths.

Stage 5 complete. Moving to Stage 6.

---

**Stage 6 — Programmes, Protocols, and Frameworks**

Walk me through the systems you use — the actual structures, templates, and step-by-step processes. Start with your core 12-week programme: what does someone's first week look like, and how does week twelve look different?""",
        "stageId": 5,
        "timestamp": t(890),
    },
    # ── Stage 6 user ──────────────────────────────────────────────────────────
    {
        "role": "user",
        "content": """The 12-week programme is called The Recomposition Method. It's built around three phases:

**Phase 1 (Weeks 1–4): Foundation.** Three training sessions per week. Full-body strength training. The focus is technique and establishing the habit, not intensity. Calorie intake set at 200–300 below TDEE — a gentle deficit that prevents the panic response. Protein target established (1.8g/kg bodyweight). A daily step goal set at whatever is achievable from their current baseline — usually 6,000–8,000. No food tracking beyond protein. Weekly check-in via an app.

**Phase 2 (Weeks 5–8): Progression.** We introduce a fourth training session. Volume increases — we add sets, not exercises. The deficit adjusts based on real-world data from their check-ins. We introduce full calorie tracking at this point because they've already built the habit of eating well without it. We address any plateaus — usually by either increasing steps or adjusting the deficit slightly.

**Phase 3 (Weeks 9–12): Intensification.** Progressive overload kicks in seriously — we're adding weight to the bar or reps to the sets weekly. Calories may be adjusted based on the rate of loss. We also begin thinking about what comes after the 12 weeks: maintenance calories, training habits that will persist, and what the next goal is.

The check-in structure: every Sunday. They submit weight (daily average from the week, not one reading), a photograph if they've consented to that, their training adherence, and a mood and energy score. I review everything and send a voice note response. That personal feedback loop is what separates it from just a PDF programme.

Other frameworks I use:

**The 5-3-1 Eating Hierarchy:** (1) Total calories, (2) Protein, (3) Food quality/everything else. This is how I teach people to prioritise nutrition decisions when life gets complicated. If you're traveling and can't eat clean — fine, focus on hitting your calories and protein and let everything else be flexible.

**The 3-Day Training Minimum:** I tell every client that three sessions per week is their non-negotiable minimum. If the week is a disaster — illness, travel, family emergency — they still aim for three. Not great sessions, not long sessions. Three sessions. This prevents the all-or-nothing thinking that derails most people.

**The Non-Scale Victory Tracker:** A weekly log of performance metrics that have nothing to do with weight: are you sleeping better, do you have more energy, are you stronger, are your clothes fitting differently, are you less hungry, are you thinking about food less between meals? I make this a formal part of the check-in because the scale is slow, unreliable, and emotionally loaded.""",
        "stageId": 6,
        "timestamp": t(980),
    },
    # ── Stage 6 complete ──────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """Excellent — three named frameworks (The Recomposition Method, the 5-3-1 Eating Hierarchy, the 3-Day Minimum) plus a solid check-in structure. The Non-Scale Victory Tracker is particularly content-friendly — that's a video on its own.

Stage 6 complete. Moving to Stage 7.

---

**Stage 7 — Script Topic Mapping**

Using everything from our conversation, here are 52 long-form video titles grouped by theme. Please review and approve before I generate the full editing directions.

**THEME 1: THE FAT LOSS TRUTH (Videos 1–8)**
1. "Why You're Eating 1,200 Calories and Not Losing Weight" — The metabolic adaptation nobody tells you about and why restriction is working against you
2. "The Real Reason You're Always Hungry on a Diet" — Hormonal drivers of hunger vs. calorie restriction, and how to manage satiety without suffering
3. "Why Crash Diets Make You Fatter Long-Term" — The physiological consequences of aggressive restriction and the case for slow, sustainable loss
4. "How Much of a Calorie Deficit Do You Actually Need?" — The science of the minimum effective deficit and why 1,000 below maintenance is a trap
5. "Why the Scale Lies (And What to Track Instead)" — Understanding water retention, muscle gain, hormonal fluctuations, and why weekly averages beat daily weigh-ins
6. "The Plateau Problem: Why Your Fat Loss Stalled and Exactly How to Fix It" — Metabolic adaptation, dietary adherence issues, and NEAT suppression explained
7. "Body Recomposition: Can You Lose Fat and Build Muscle at the Same Time?" — Who can do it, how long it takes, and what the research actually says
8. "Why Your Calorie Deficit Isn't Working — A Practical Audit" — Common tracking errors, hidden calories, and how to diagnose your own fat loss programme

**THEME 2: STRENGTH TRAINING FOR FAT LOSS (Videos 9–16)**
9. "Why Cardio Is Not the Best Tool for Fat Loss" — The evidence for strength training vs. cardio for body composition, with the metabolic maths explained
10. "The Beginner's Guide to Progressive Overload" — What it is, why it's the single most important training principle, and how to apply it from your first session
11. "How Many Days Per Week Should You Train to Lose Fat?" — The minimum effective dose approach and why more is not always better
12. "The Best Exercises for Fat Loss (Ranked)" — Compound vs. isolation movements, calorie expenditure, and building a programme around the lifts that matter
13. "Why You Should Stop Doing HIIT Every Day" — The cortisol problem, the recovery cost, and why intensity without structure produces diminishing returns
14. "Strength Training for Women Over 40: What Changes and What Doesn't" — Hormonal context, muscle preservation, bone density, and why this decade is the most important for training
15. "How to Build a Training Programme That You'll Actually Stick To" — The adherence-first design principle and what the minimum sustainable week looks like
16. "The 3-Day Training Minimum: How to Stay Consistent When Life Gets in the Way" — The all-or-nothing trap and the framework for maintaining momentum through chaos

**THEME 3: NUTRITION FUNDAMENTALS (Videos 17–24)**
17. "Protein: Why It's the Only Non-Negotiable in Your Diet" — Satiety, muscle preservation, metabolic rate, and practical ways to hit your target without eating chicken every meal
18. "The 5-3-1 Eating Hierarchy: How to Make Nutrition Decisions When Life is Complicated" — Calories first, protein second, everything else third — and how to apply this when travelling, eating out, or having a bad week
19. "Clean Eating Is a Myth (And It Might Be Making You Fatter)" — The research on food quality vs. total calories, and why eliminating "bad" foods rarely produces the results people expect
20. "How to Track Macros Without Losing Your Mind" — A practical guide to calorie and protein tracking for people who hate tracking
21. "Meal Timing: Does It Actually Matter?" — The truth about breakfast, post-workout nutrition, eating windows, and what actually moves the needle
22. "How Alcohol Really Affects Fat Loss" — The metabolic priority of alcohol, its effect on recovery and sleep, and how to include it without derailing progress
23. "Eating Out Without Ruining Your Progress" — Practical strategies for restaurants, social events, holidays, and real-life eating
24. "Why You're Probably Not Eating Enough Protein (And How to Fix It)" — The gap between what most people eat and what the evidence recommends, with a practical increase plan

**THEME 4: FITNESS MYTHS DEBUNKED (Videos 25–32)**
25. "You Don't Need to Earn Your Food Through Exercise" — The punish-reward cycle and why separating food and exercise is essential for long-term success
26. "Supplements: What Actually Works (And What's a Waste of Money)" — Creatine, vitamin D, and protein powder vs. fat burners, BCAAs, and detox teas — the honest evidence review
27. "Spot Reduction Is a Myth: Why You Can't Lose Belly Fat Specifically" — How fat loss actually works and why the "flat belly" content you've been watching is lying to you
28. "Muscle Soreness Is Not a Sign of a Good Workout" — DOMS explained, what actually produces results, and why elite athletes rarely get sore
29. "Motivation Won't Save You: Why Systems Beat Willpower Every Time" — The psychology of consistency and how to build training habits that persist without relying on feeling like it
30. "The Problem With Clean Eating Culture" — Diet culture, food moralising, all-or-nothing thinking, and the research on flexible vs. rigid dietary approaches
31. "Why 'Eat Less, Move More' Is Terrible Advice" — The oversimplification that ignores hormonal adaptation, NEAT, metabolic rate, and the psychological reality of restriction
32. "The Truth About Fat Burners and Weight Loss Supplements" — A no-nonsense breakdown of the supplement industry, what the research actually shows, and why habits trump products

**THEME 5: MINDSET, HABITS, AND SUSTAINABILITY (Videos 33–40)**
33. "Why You Keep Starting Over: The All-or-Nothing Trap and How to Escape It" — Binary thinking about diet and training, why it always leads to failure, and how to build flexible consistency
34. "The Identity Shift: How to Become Someone Who Actually Enjoys Training" — Behaviour change psychology, identity-based habit formation, and what the research says about long-term adherence
35. "How to Build a Calorie Deficit That Feels Easy" — Volume eating, protein prioritisation, food sequencing, and the practical tools for managing hunger
36. "What to Do When You've Lost Motivation" — Distinguishing motivation from discipline, the role of systems, and what to actually do when you don't want to train
37. "Why Your Relationship With Food Needs to Come Before Your Diet Plan" — The psychological prerequisites for sustainable change, and when to seek additional support
38. "Progress Is Not Linear: How to Interpret Your Results Without Quitting" — Managing expectations, understanding plateaus and fluctuations, and the long-game mindset
39. "How Busy Professionals Actually Stay Consistent" — Time constraints, travel, unpredictable schedules, and the frameworks that make consistency achievable without a perfect lifestyle
40. "The Non-Scale Victories That Actually Predict Long-Term Success" — Energy, sleep, strength, hunger, confidence — and why these metrics matter more than weekly weight loss

**THEME 6: SLEEP, RECOVERY, AND LIFESTYLE (Videos 41–46)**
41. "Why Sleep Is Your Most Underrated Fat Loss Tool" — Ghrelin, leptin, cortisol, insulin sensitivity, and the measurable impact of poor sleep on body composition
42. "Stress, Cortisol, and Fat Storage: What the Research Actually Says" — The mechanism of chronic stress on body composition and practical stress-management interventions that work
43. "NEAT: The Calorie Burn You're Ignoring That's Costing You Results" — Non-exercise activity thermogenesis, how it crashes on aggressive diets, and how 8,000 steps per day beats most exercise programmes
44. "How to Optimise Recovery So You Can Train Harder and More Consistently" — Sleep, nutrition timing, active recovery, and the signs you're under-recovering
45. "The Hidden Cost of Over-Training: When More Exercise Makes You Fatter" — The cortisol-fat storage connection, signs of overtraining, and how to find your training sweet spot
46. "How Alcohol Affects Your Sleep, Recovery, and Fat Loss Results" — The complete picture of alcohol's impact beyond just the calories

**THEME 7: BUILDING YOUR PROGRAMME (Videos 47–52)**
47. "How to Design Your Own Fat Loss Programme (From Scratch)" — A step-by-step walkthrough of the decisions you need to make and the order to make them
48. "The 12-Week Recomposition Method: What It Is and How It Works" — Full walkthrough of the three-phase programme with explanation of the reasoning behind each decision
49. "How to Track Your Progress Without Obsessing Over the Scale" — A complete tracking system using weight averages, measurements, photographs, performance, and non-scale metrics
50. "What to Do After 12 Weeks: Maintenance, Cutting, and Bulking Explained" — The decision framework for what comes after a fat loss phase
51. "How Online Fitness Coaching Actually Works (And Whether It's Right for You)" — What to expect from a good online coaching programme and how to evaluate coaches before investing
52. "The Questions to Ask Before Hiring an Online Fitness Coach" — Red flags, green flags, what accountability actually looks like, and what results are realistic""",
        "stageId": 7,
        "timestamp": t(1100),
    },
    # ── Stage 7 user approval ─────────────────────────────────────────────────
    {
        "role": "user",
        "content": "These are excellent. I particularly love the myths section and the NEAT video — that's not talked about enough. Please go ahead and generate the editing directions for Batch 1 (Videos 1–8).",
        "stageId": 7,
        "timestamp": t(1150),
    },
    # ── Batch 1 editing directions ────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """**BATCH 1: THE FAT LOSS TRUTH (Videos 1–8)**

---

VIDEO 1:
TITLE: "Why You're Eating 1,200 Calories and Not Losing Weight"
THEME / KNOWLEDGE PILLAR: Fat loss fundamentals / Metabolic adaptation
AUDIENCE PROBLEM ADDRESSED: People who are eating very little, training hard, and seeing no results — and have started to believe something is medically wrong with them
ONE-LINE VIDEO DESCRIPTION: The complete scientific explanation of why aggressive calorie restriction backfires, what happens to your metabolism, and what to do instead
CORE STORY OR CASE STUDY TO USE: Sarah — marketing director, 1,100 calories, five HIIT sessions per week, gaining fat, told by GP to eat less and move more
PRIMARY VIEWER TAKEAWAY: Eating more and training smarter is not a cop-out — it is the physiologically correct response to metabolic adaptation

SUGGESTED LONG-FORM STRUCTURE:
- Hook: The most common question in fitness coaching
- The paradox: how eating less makes fat loss harder
- The four hormones that work against you when you restrict aggressively
- What metabolic adaptation actually means and how to measure it
- Sarah's story
- The Minimum Effective Dose solution
- What to do this week

EDITING DIRECTIONS:

IMPORTANT: These directions are written for a video editor who has not met the coach and knows nothing about nutrition science. Every instruction is self-contained and must be executed exactly as written.

Opening Hook Edit:
First frame: coach on screen from first word, no title card opening. Tight head-and-shoulders frame, coach speaking directly to camera. First line should be: "If you are eating 1,200 calories a day and you are not losing weight, I want you to stay with this video. Because you have not failed. The approach you've been given has failed you." No music during first 45 seconds. At 0:45, begin ambient underscore at 8% volume (search Epidemic Sound for "calm motivational piano" — instrumental only, no beat). First cut at 1:00: full-screen title card — dark charcoal background (#1A1A1A), white bold centred text: "Why Eating Less Stops Working" (36px bold, Inter or similar clean sans-serif). Hold 1.5 seconds. Hard cut to coach.

Pacing and Cut Style:
Teaching sections: hold on coach for 10–15 seconds between cuts. Apply a slow push-in zoom (scale 100% → 104%, keyframed over 5 seconds) at the emotionally weighted lines ("you have not failed" and "eating more is the correct answer"). Case study section (Sarah): zero cuts, hold on coach throughout, no B-roll. Final section: slightly increased pacing, end with direct eye contact to camera.

B-Roll and Visual Support:
— At 0:03 (before coach speaks): search Pexels for "woman sitting alone looking at salad bowl frustrated kitchen" — 4 seconds at 90% speed. Hard cut to coach at first word.
— Hormonal section (approx 4:00): search Pexels for "cortisol stress woman rubbing temples office" — 4 seconds at 85% speed. Dissolve back to coach.
— NEAT section (approx 8:00): search Pexels for "woman walking slowly looking tired desk job office" — 3 seconds at 90% speed. Hard cut to coach.
— Solution section (approx 14:00): search Pexels for "woman lifting weights gym confident smiling" — 4 seconds at 90% speed. Hard cut to coach.

On-Screen Text and Graphics:
— At 1:30 — GRAPHIC REQUIRED — build in Canva (1920×1080): Title at top "The 4 Hormonal Responses to Aggressive Restriction" (18px, dark gray #333). Below: four horizontal rows, each with an icon (can be simple shapes) and two columns. Column 1: hormone name. Column 2: effect. Row 1: "CORTISOL — Elevates and stays elevated → fat storage signal". Row 2: "T3 THYROID — Active form drops → metabolism slows". Row 3: "LEPTIN — Crashes → hunger increases, metabolism drops". Row 4: "GHRELIN — Rises → intense, persistent hunger". Dark teal background (#0F766E) for hormone names column, white background for effects column. 12px font throughout, each row alternating white/light gray background. Hold as full-frame overlay for 8 seconds.
— At 3:00 — text overlay — white bold text, centred, no background: "Your body thinks you are starving. It is trying to save your life." Fade in 0.3s, hold 4s, fade out 0.3s.
— At 6:30 (Sarah's story) — lower-third name card for 4 seconds: Line 1 "Sarah, 41" (bold 20px white). Line 2 "Marketing Director · Mother of two" (14px white). Line 3 "Details anonymised" (11px light gray italic). Semi-transparent dark background bar. Fade in 0.5s, hold 4s, fade out.
— At 13:00 — GRAPHIC REQUIRED — "The Minimum Effective Deficit" comparison. Build in Canva (1920×1080). Two panels side by side. White background. Left panel heading: "AGGRESSIVE APPROACH" (orange, 18px bold). Below: "Deficit: 1,000 cal/day. Training: 5–6 days. Timeline: 4–6 weeks then plateau. Outcome: Muscle loss, metabolic adaptation, rebound." Right panel heading: "MINIMUM EFFECTIVE DOSE" (teal, 18px bold). Below: "Deficit: 300–400 cal/day. Training: 3–4 days. Timeline: Ongoing, sustainable. Outcome: Fat loss preserved, metabolic rate maintained." Hold 8 seconds as full-frame overlay.

Chapter Breaks (enter exactly in YouTube Studio):
0:00 The question 30% of my DMs ask
1:00 How eating less makes fat loss harder
3:30 The four hormones working against you
7:00 What metabolic adaptation really means
9:30 Sarah's story: 1,100 calories and gaining weight
13:00 The Minimum Effective Dose solution
16:30 What to do this week

Retention Devices:
1. At 1:45 — coach delivers: "Stick around because at the nine-minute mark I'm going to share the case of a client who was eating 1,100 calories a day, training five times a week, and gaining body fat. And I'm going to show you exactly what we changed — and what her results looked like at twelve weeks." Apply zoom (100% → 103%, 2 seconds) at the word "gaining."
2. At 6:30 — CHAPTER CARD: dark teal background (#0F766E), white bold text centred: "Sarah's Story" (40px). Hold 1.5 seconds. Hard cut to coach.
3. At 11:00 — coach: "Now I want to tell you the part of this that surprises people the most. The solution isn't just about eating more. It's about eating more of one specific thing." Apply zoom (100% → 103%, 2 seconds) at "surprises people the most."

Tone and Music Direction:
Instrumental only. Warm and slightly motivational — not dramatic. Piano with light acoustic guitar. BPM 65–75. No percussion. Search Epidemic Sound for "calm motivational acoustic guitar piano" or Artlist for "hopeful documentary instrumental." Start at 8% volume from 0:45. Hold at 8% throughout teaching sections. Drop to 0% at Sarah's story (approx 9:30), hold silence. Bring back to 10% at solution section (13:00). Raise to 15% for final 30 seconds. Fade to 0% over last 5 seconds.

CapCut and Editor Notes:
(1) Auto-captions: enable. Bold white with black outline, bottom 15% of screen. Review carefully for: TDEE, ghrelin, leptin, T3, cortisol, NEAT — correct any transcription errors for these terms. (2) Lower third for coach credentials: at first frame coach appears — Line 1: "[Coach full name]" (bold 20px white). Line 2: "[Exact certification / credential]" (14px white). No background bar. Fade in 0.5s, hold 4s. (3) Zoom keyframes at "you have not failed" (approx 0:20) and "eating more is the correct answer" (approx 13:30) — scale 100% → 104%, 3 seconds each. (4) End screen: final 20 seconds — two video thumbnails (centre-left and centre-right), subscribe button (top-right), all fade in simultaneously. (5) Export: 1920×1080, MP4 H.264, -14 LUFS stereo.

---

VIDEO 2:
TITLE: "The Real Reason You're Always Hungry on a Diet"
THEME / KNOWLEDGE PILLAR: Fat loss fundamentals / Hunger and satiety
AUDIENCE PROBLEM ADDRESSED: People who feel that dieting requires constant suffering and willpower, who believe they are "just bad at hunger"
ONE-LINE VIDEO DESCRIPTION: The hormonal explanation for diet-induced hunger, why willpower has nothing to do with it, and the practical strategies that actually manage appetite
CORE STORY OR CASE STUDY TO USE: Sarah's experience of being hungry all the time on 1,100 calories and how raising protein and adding training changed her hunger signals
PRIMARY VIEWER TAKEAWAY: Persistent hunger on a diet is a physiological event, not a character failing — it can be managed with the right approach

SUGGESTED LONG-FORM STRUCTURE:
- Hook: The hunger that never goes away
- Why calorie restriction makes you more hungry (the hormone mechanism)
- The three evidence-based tools for managing hunger without suffering
- Protein as the primary hunger management tool (with the maths)
- Volume eating: how to eat more food for fewer calories
- Case study: Sarah before and after
- Building a diet that feels manageable

EDITING DIRECTIONS:

Opening Hook Edit:
Coach opens directly to camera with: "Feeling hungry all the time on a diet is not a sign that you lack willpower. It is a hormonal response that your body is deliberately generating to make you stop dieting. And once you understand the mechanism, you can work with it instead of fighting it." No music during first 40 seconds. Begin ambient underscore at 0:40 at 8% volume. First visual cut at 1:10: full-screen title card — dark background (#1A1A1A), white bold centred text: "It's Not Your Willpower" (36px bold). Hold 1.5 seconds. Hard cut to coach.

B-Roll and Visual Support:
— Opening (before first word): search Pexels for "woman looking at food tempted kitchen late night" — 4 seconds at 90% speed. Hard cut to coach.
— Ghrelin section: search Pexels for "woman holding stomach hunger frustrated" — 3 seconds at 85% speed. Hard cut to coach.
— Volume eating section: search Pexels for "large bowl salad vegetables colourful meal prep" — 4 seconds at 90% speed. Dissolve back to coach.

On-Screen Text and Graphics:
— At 2:30 — GRAPHIC: Canva (1920×1080). Title: "What Happens to Hunger Hormones in a Deficit" (18px dark gray). Two rows. Row 1: "GHRELIN (hunger hormone)" — left: "Normal eating" bar chart at 100%. Right: "After 4 weeks restriction" bar chart at 160%. Bar colour: orange (#EA580C). Row 2: "LEPTIN (satiety hormone)" — left: "Normal eating" bar chart at 100%. Right: "After 4 weeks restriction" bar chart at 45%. Bar colour: teal (#0D9488). Small text below each bar with the label. White background. Hold 7 seconds full-frame.
— At 6:00 — text overlay, white bold centred: "Protein: 4 calories per gram. Highest satiety of any macronutrient." Fade in 0.3s, hold 4s.
— At 10:30 — GRAPHIC: "Volume Eating Comparison" — Canva (1920×1080). Left panel: "200 calories of chocolate" — show a small square icon. Right panel: "200 calories of chicken, rice, and salad" — show three larger icons side by side. Label each panel clearly. Heading: "Same Calories. Very Different Fullness." White background, dark gray text (18px). Hold 6 seconds.

Chapter Breaks:
0:00 The hunger that never stops
1:10 Why dieting makes you more hungry
4:00 The three tools that actually work
6:00 Why protein is the most important hunger tool
9:00 Volume eating: more food, fewer calories
12:00 How to build a diet that feels manageable

Retention Devices:
1. At 2:00 — "At the eight-minute mark I'm going to show you exactly how to build a day of eating that keeps you full on a calorie deficit — without eating chicken and broccoli three times a day."
2. At 6:30 — CHAPTER CARD: dark teal, white text: "The Protein Fix" (40px). Hold 1.5 seconds.
3. At 11:00 — "Here's the part most coaches don't tell you: the same number of calories can feel like starvation or abundance depending on what you eat them as. Let me show you the comparison."

Tone and Music Direction:
Same track series as Video 1 for consistency. BPM 65–75. Start at 8%, drop to 0% during case study (approx 12:30), return to 10% for final section, fade to 0% over last 5 seconds.

CapCut and Editor Notes:
Same caption style and export settings as Video 1. Zoom keyframes at "not your willpower" (0:10, scale 100% → 103%, 2s) and at the protein maths reveal (approx 7:30, scale 100% → 104%, 3s). Lower third for coach credentials same as Video 1.""",
        "stageId": 7,
        "timestamp": t(1250),
    },
    # ── Script generation request ─────────────────────────────────────────────
    {
        "role": "user",
        "content": "These editing directions are exactly what I needed. Please now write the full teleprompter script for Video 1.",
        "stageId": 7,
        "timestamp": t(1300),
    },
    # ── Video 1 full script ────────────────────────────────────────────────────
    {
        "role": "assistant",
        "content": """VIDEO 1: "Why You're Eating 1,200 Calories and Not Losing Weight"

Layer 1 — Teleprompter Script:

---

**HOOK**

If you are eating 1,200 calories a day and you are not losing weight, I want you to stay with this video.

Because you have not failed.

The approach you have been given has failed you.

[EDIT: 0:20] ZOOM: Slow push-in, keyframe scale 100% → 104% over 4 seconds. Begin on the word "failed."

I have had this conversation — in some form — with hundreds of clients. The pattern is always the same. They are eating very little. They are training hard. The scale is not moving. And they have started to believe that something is fundamentally wrong with them. That they are broken. That their body is the problem.

It isn't.

There is a physiological explanation for what is happening to you. And once you understand it, not only will it stop feeling personal — it will actually point you toward the solution.

My name is Alex Reed. I am a Level 3 Personal Trainer and a Level 4 Sports Nutrition Advisor. I've been coaching for nine years. For the last three years I've worked exclusively online with busy professionals and parents who've been stuck in the diet cycle for years.

[EDIT: 1:00] CHAPTER CARD: Dark charcoal background (#1A1A1A), white bold text centred: "Why Eating Less Stops Working" (36px). Hold 1.5 seconds. Hard cut to coach.

Today I am going to explain exactly what happens to your body when you eat too little for too long. Why it fights back. Which hormones are involved. And what the evidence-based solution actually looks like.

---

**THE PARADOX**

Let me start with something that seems counterintuitive: the harder you restrict your calories, the harder fat loss becomes.

Not in the short term. In the short term, aggressive restriction works. You lose weight quickly. The first two weeks look promising. This is why crash diets get testimonials — because those first two weeks always produce results.

But at around the four to six week mark, something changes.

[EDIT: 3:00] TEXT OVERLAY: White bold text centred, no background: "Weeks 1–2: Progress. Weeks 4–6: Stall. Why?" Fade in 0.3s, hold 4s, fade out 0.3s.

The weight loss slows. Then stops. And the hunger gets worse. And the fatigue gets worse. And the person doing everything right starts doing more — cutting more calories, adding more exercise — and still the scale doesn't move. And eventually they give up, convinced they are the problem.

They are not the problem. The mechanism is the problem. And the mechanism has a name: metabolic adaptation.

---

**THE FOUR HORMONES**

When you eat significantly below your maintenance calories — I'm talking 800 to 1,000 calories below your total daily energy expenditure — your body interprets this as a threat. Not a diet. A famine. It responds by activating a survival protocol that has kept humans alive through periods of genuine food scarcity for thousands of years.

[EDIT: 3:30] GRAPHIC: Full-frame overlay — "The 4 Hormonal Responses to Aggressive Restriction" — hold 8 seconds. See Editing Directions for build specifications.

Four things happen hormonally:

**First: cortisol rises.** Cortisol is your primary stress hormone. It rises in response to the physiological stress of restriction. And elevated cortisol signals your body to store fat — particularly around the abdomen. This is one of the main reasons people notice their belly fat is most resistant to shifting: their cortisol is chronically elevated from restriction and the associated sleep disruption.

[EDIT: 4:30] B-ROLL: Search Pexels for "cortisol stress woman rubbing temples office" — 4 seconds at 85% speed. Dissolve back to coach.

**Second: active thyroid hormone drops.** Your thyroid produces two hormones — T4 and T3. T3 is the active, metabolically significant one. When you restrict significantly, your body converts less T4 to T3 as a conservation mechanism. The result: your metabolism slows. You burn fewer calories at rest. Your body becomes more efficient at doing more with less. Which is exactly what you don't want when your goal is fat loss.

**Third: leptin crashes.** Leptin is produced by your fat cells and signals your brain that you have sufficient energy stores. When you restrict and lose fat, leptin drops — and your brain interprets this as a survival alarm. It responds by increasing appetite, reducing motivation to move, and slowing your metabolism further. The less fat you carry, the less leptin you produce, the more intensely your body fights back.

**Fourth: ghrelin rises.** Ghrelin is your primary hunger hormone. It is produced in the stomach and signals your brain that you need to eat. On a sustained calorie deficit, ghrelin rises and stays elevated — sometimes for months after the restriction ends. This is why people who crash diet feel hungry all the time and why the hunger can persist even after they've started eating normally again. It is not a lack of willpower. It is an elevated ghrelin signal that they cannot simply choose to ignore.

[EDIT: 6:00] TEXT OVERLAY: White bold text centred: "Persistent hunger is not weak willpower. It is elevated ghrelin." Fade in 0.3s, hold 4s.

I explain this to clients using what I call the hybrid car problem. Your body, under aggressive restriction, has done something very clever: it has trained itself to become more fuel-efficient. It burns fewer calories at rest. It moves less spontaneously — a phenomenon called NEAT suppression, which I'll come back to. It conserves every calorie it gets. You have accidentally optimised your body for survival, when what you needed was to optimise it for performance.

---

**WHAT METABOLIC ADAPTATION ACTUALLY MEANS**

Metabolic adaptation is not a myth. It is a well-documented physiological response to calorie restriction. Studies have consistently found that people who have dieted aggressively have measurably lower resting metabolic rates than would be predicted from their body composition alone — sometimes 15 to 20% lower. This means that after a period of aggressive restriction, your body is genuinely burning fewer calories at rest than it should be for someone of your size.

[EDIT: 7:00] CHAPTER CARD: Dark teal (#0F766E), white bold text: "What Metabolic Adaptation Means" (36px). Hold 1.5 seconds. Hard cut to coach.

This is not permanent. This is reversible. But you cannot reverse it by restricting harder. You reverse it by eating more — strategically — and training in a way that rebuilds and preserves lean muscle tissue.

The other component that almost nobody talks about: NEAT. Non-Exercise Activity Thermogenesis. The calories you burn through everyday movement — walking, fidgeting, standing, doing housework. For most people, NEAT accounts for more daily calorie expenditure than their formal gym sessions. And NEAT is the first thing that crashes when you restrict aggressively. Your body, protecting its energy stores, makes you move less. You sit rather than stand. You take the lift. You don't fidget. These small reductions add up to hundreds of calories per day — and because they happen subconsciously, you don't notice them.

[EDIT: 8:30] B-ROLL: Search Pexels for "woman walking slowly looking tired desk job office" — 3 seconds at 90% speed. Hard cut to coach.

This is the full picture of why 1,200 calories stops working. Your metabolism has slowed. Your hunger hormones are elevated. Your NEAT has crashed. And you're adding more training and further restriction onto a system that is already under siege.

---

**SARAH'S STORY**

[EDIT: 9:30] CHAPTER CARD: Dark teal, white bold text: "Sarah's Story" (40px). Hold 1.5 seconds. Hard cut to coach.

I want to tell you about a client I'll call Sarah. She was 41 — a marketing director, two kids under ten. She had been trying to lose the same fifteen pounds for four years.

She'd done WeightWatchers three times. Two rounds of a popular 1,200-calorie meal plan. When she came to me, she was doing HIIT classes five mornings a week at 5:30 in the morning and eating 1,100 calories a day. She was exhausted. She was hungry all the time. And she was gaining weight despite doing everything right.

She'd had her thyroid tested. PCOS screening. Everything came back normal. Her GP told her to try eating less and moving more.

When I looked at her programme, the problem was immediately clear. She was chronically under-eating. She was doing high-intensity training five days a week on that intake — which meant her cortisol was permanently elevated. She was sleeping five to six hours a night because of the early alarms. And her NEAT was essentially zero — she had a desk job and drove everywhere.

I told her to stop the HIIT classes.

She looked at me like I was insane.

I put her on three forty-five-minute strength sessions per week. I raised her calories to 1,600. I gave her a daily step goal of eight thousand steps — not a gym session, just walking — and told her not to weigh herself for six weeks.

In the first three weeks she messaged me almost every day asking if we'd made a mistake. She was eating more. She was training less. She was convinced it wasn't going to work.

At week six, her weight had dropped four pounds. Her measurements were down more than that — she'd lost body fat while beginning to build lean tissue. But the thing she mentioned first wasn't the scale. She woke up on a Saturday morning at seven in the morning, naturally, without an alarm — and she felt rested. For the first time in months. That's when she started trusting the process.

At twelve weeks: eleven pounds lost. Dramatically improved sleep. And — this is the part that matters most to me — she told me it was the first time in four years she hadn't dreaded mealtimes.

[EDIT: 12:30] MUSIC: Bring music back from 0% to 10% volume over 3 seconds as this section ends.

---

**THE MINIMUM EFFECTIVE DOSE SOLUTION**

[EDIT: 13:00] GRAPHIC: Full-frame comparison overlay — "Aggressive Approach vs Minimum Effective Dose" — see Editing Directions for build specifications. Hold 8 seconds.

The principle that underpins everything I do is called the Minimum Effective Dose. It comes from pharmacology: the minimum dose required to produce the desired therapeutic effect. Below that dose, the treatment doesn't work. But above it — you don't get more benefit. You get side effects.

Applied to fat loss: the minimum calorie deficit required to produce consistent, sustainable fat loss — without triggering the hormonal adaptations that work against you. For most people, that's 300 to 400 calories below their maintenance. Not 1,000. Not 800. Three hundred to four hundred.

[EDIT: 13:30] ZOOM: Slow push-in, scale 100% → 104%, 3 seconds. On the word "three hundred to four hundred."

The fat loss is slower. Typically half a pound to one pound per week. But it is actually happening. And it continues at month six. And month nine. And month twelve — because you haven't triggered the hormonal cascade that causes your metabolism to adapt against you.

Paired with strength training — not cardio, strength training, and I'll explain exactly why in another video — this approach preserves and builds lean muscle tissue. Which raises your metabolic rate. Which makes fat loss easier over time, not harder.

---

**WHAT TO DO THIS WEEK**

If this video has described your situation — if you have been eating very little and training hard and not losing weight — here is where to start.

First: do not restrict further. If you are below 1,200 calories, consider spending two to four weeks eating at maintenance before entering a deficit. This is called a diet break and it is evidence-based, not an excuse.

Second: calculate your TDEE — your total daily energy expenditure. There are free calculators online. I will link one in the description. Then aim for a deficit of three hundred to four hundred calories from that number.

Third: prioritise protein. Whatever else changes, aim for 1.6 to 2.2 grams per kilogram of bodyweight per day. This preserves muscle, manages hunger, and supports your metabolic rate.

Fourth: add steps before you add gym sessions. Eight thousand steps per day will do more for your fat loss than an additional HIIT class. It keeps your NEAT elevated without triggering the cortisol response that high-intensity training does when you're under-fuelled.

And fifth: if you have been in a significant deficit for more than three months and have stalled completely, consider working with a coach who can assess your specific situation. The patterns are identifiable and they are fixable — but they need to be addressed in the right order.

[EDIT: 18:00] ANIMATION: The five action steps appear one at a time on screen, each sliding up from the bottom as coach delivers them. Build in CapCut as separate text layers: white bold text on dark semi-transparent background card, bottom third of screen. Each step: "Step 1: Stop restricting further." "Step 2: Calculate and eat at a moderate deficit." "Step 3: Prioritise protein at 1.6–2.2g/kg." "Step 4: 8,000 steps before extra gym sessions." "Step 5: Seek coaching if stalled for 3+ months." Each step appears and stays on screen, stacking sequentially.

I'll see you in the next one.

---

Layer 2 — Section Editing Notes:

**SECTION-BY-SECTION EDIT NOTES**

**Hook (0:00–1:00):** Static camera, tight frame, no cuts. Hold on coach throughout. The delivery of "you have not failed" is the most important line in the video — do not cut away from it. Apply slow push-in zoom at the word "failed" (scale 100% → 104%, 4 seconds).

**The Paradox (1:00–3:30):** Hold on coach 12–15 seconds between cuts. No B-roll here — the argument needs to land verbally before visuals appear. The two-week stall rhythm ("weeks 1–2 progress, weeks 4–6 stall") should have a text overlay at the moment the coach pauses.

**The Four Hormones (3:30–8:30):** This is the most information-dense section. Each hormone gets its own beat — do not rush. Use the full-frame graphic at 3:30 and hold it for 8 seconds before cutting back to coach. B-roll for cortisol section. No B-roll for the leptin/ghrelin explanations — hold on coach.

**Sarah's Story (9:30–12:30):** Zero cuts from start to finish. Hold on coach. No B-roll, no graphics (except the name card at the start). The absence of cuts signals to the viewer that this is important and personal. After "she told me it was the first time in four years she hadn't dreaded mealtimes" — hold 3 full seconds. Do not cut. Do not bring music in early.

**Solution (13:00–16:30):** Slightly increased energy from coach and editor. The comparison graphic (Aggressive vs MED) at 13:00 is the visual centrepiece of this section — hold it for 8 seconds. Step animations from 18:00 should be clean and un-rushed — give each step 3 seconds of screen time before the next appears.

---

**ASSETS TO SOURCE (Stock Footage)**
☐ Pexels — Search: "woman sitting alone looking at salad bowl frustrated kitchen" — 4 seconds at 90% speed — hard cut to coach
☐ Pexels — Search: "cortisol stress woman rubbing temples office" — 4 seconds at 85% speed — dissolve back to coach
☐ Pexels — Search: "woman walking slowly looking tired desk job" — 3 seconds at 90% speed — hard cut to coach
☐ Pexels — Search: "woman lifting weights gym confident smiling" — 4 seconds at 90% speed — hard cut to coach

**GRAPHICS TO BUILD (Canva or After Effects)**
☐ Graphic 1 — "The 4 Hormonal Responses" table: Canvas 1920×1080. White background. Title: "The 4 Hormonal Responses to Aggressive Restriction" (18px dark gray #333, centred). Four rows with 2 columns. Column 1: Hormone name on dark teal background (#0F766E), white bold text 13px. Column 2: Effect on white background, dark gray text 12px. Row 1: CORTISOL / "Elevates chronically → fat storage signal, especially abdominal." Row 2: T3 THYROID / "Active form drops → metabolism slows by up to 20%." Row 3: LEPTIN / "Crashes → hunger increases, motivation to move drops." Row 4: GHRELIN / "Rises and stays elevated → persistent, intense hunger." Import as PNG, hold 8 seconds full-frame.
☐ Graphic 2 — "Aggressive vs MED" comparison: Canvas 1920×1080. White background. Title: "Two Approaches to a Calorie Deficit" (18px dark gray #333). Two equal panels. Left — heading "AGGRESSIVE APPROACH" (orange #EA580C, 20px bold). Content (14px dark gray): "Deficit: 800–1,000 cal · Training: 5–6 days · Timeline: Stalls at 4–6 weeks · Outcome: Muscle loss, hormonal adaptation, rebound." Right — heading "MINIMUM EFFECTIVE DOSE" (teal #0D9488, 20px bold). Content (14px dark gray): "Deficit: 300–400 cal · Training: 3–4 days · Timeline: Continues at month 12 · Outcome: Metabolism maintained, fat loss sustained." Hold 8 seconds full-frame.

**ANIMATION IDEAS**
- At 6:00 — Kinetic text reveal for the hunger line: "Persistent hunger is not weak willpower." Each word appears from left to right in 0.2s increments. Final word "willpower" slightly larger (120% size) before settling to 100%. Effect: authority. Achievable in CapCut text animation settings.
- At 13:30 — Number counter animation for the deficit figures: the numbers "300–400" count up from 0 to 300 then 400 over 1.5 seconds on screen, settling in a bold centred overlay. Search Canva templates for "number counter animation" or create in CapCut using rapid text frame changes. Effect: precision and confidence.
- At 18:00 — Typewriter effect for each of the five action steps: each letter appears individually at 0.05 seconds per character. Effect: clarity and deliberate pacing. Apply in CapCut text animation → typewriter preset.

**TEXT OVERLAYS & TITLE CARDS (add in CapCut)**
☐ At 0:00 — No title card. Coach on screen from first frame.
☐ At 1:00 — Chapter card: dark charcoal (#1A1A1A) full-screen, white bold centred: "Why Eating Less Stops Working" (36px). Fade in 0.3s, hold 1.5s, hard cut.
☐ At 3:00 — Centred white bold text overlay: "Weeks 1–2: Progress. Weeks 4–6: Stall. Why?" No background. Fade in 0.3s, hold 4s, fade out 0.3s.
☐ At 6:00 — Centred white bold text overlay: "Persistent hunger is not weak willpower. It is elevated ghrelin." No background. Fade in 0.3s, hold 4s.
☐ At 9:30 — Chapter card: dark teal (#0F766E), white bold: "Sarah's Story" (40px). Hold 1.5s, hard cut.
☐ At 9:32 — Lower third name card: "Sarah, 41 · Marketing Director · Mother of two · Details anonymised." Semi-transparent dark bar, white text (20px/14px/11px). Fade in 0.5s, hold 4s.
☐ At 13:00 — Chapter card: dark teal, white bold: "The Minimum Effective Dose" (40px). Hold 1.5s, hard cut.
☐ At 13:30 — Centred white bold text: "300–400 calorie deficit. Not 800. Not 1,000." Fade in 0.3s, hold 4s.

**MUSIC GUIDE**
Platform: Epidemic Sound. Search: "calm motivational acoustic piano documentary" — instrumental only, no beat. BPM 65–75. Piano with light acoustic guitar, no percussion.
— 0:00–0:45: Silence
— 0:45: Fade in at 8% volume over 3 seconds
— 9:30 (Sarah's story): Fade out to 0% over 3 seconds
— 12:30: Fade in at 10% over 3 seconds
— 18:30: Raise to 15%
— 19:00: Fade to 0% over final 5 seconds

**CAPCCUT STEP-BY-STEP INSTRUCTIONS**
1. Enable auto-captions. Font: Bold, white with black outline, bottom 15% of screen. Review transcript for fitness terms: TDEE, NEAT, leptin, ghrelin, T3, cortisol, macronutrient, thyroid. Correct errors before export.
2. Lower third for coach credentials: first frame coach appears. Line 1: "[Coach full name]" (bold 20px white). Line 2: "[Exact certification — e.g. Level 3 PT · Level 4 Sports Nutrition]" (regular 14px white). No background bar. Fade in 0.5s, hold 4s, fade out 0.5s.
3. Zoom keyframes: (a) At "you have not failed" (approx 0:20) — scale 100% → 104%, 4 seconds. (b) At "three hundred to four hundred" (approx 13:30) — scale 100% → 104%, 3 seconds.
4. Insert Graphic 1 (hormonal responses) at 3:30 as full-frame overlay. Import PNG. Hold 8 seconds. Hard cut back to coach.
5. Insert Graphic 2 (comparison table) at 13:00. Hold 8 seconds. Hard cut back to coach.
6. End screen: final 20 seconds. Two video thumbnail placeholders (centre-left and centre-right). Subscribe button (top-right). All elements fade in simultaneously over 0.5s.
7. Export: 1920×1080, MP4 H.264, stereo audio at -14 LUFS.

---

RETENTION NOTES:
1. **Highest drop-off risk: The hormonal mechanism section (3:30–8:30) — dense information, potential for viewer fatigue.** Prevent with: the full-frame graphic at 3:30 provides a visual reset; B-roll for the cortisol section at 4:30 breaks up the talking-head delivery; the text overlay at 6:00 gives viewers something to screenshot/share; the NEAT revelation at 8:00 re-engages with a surprising practical implication.
2. **Second drop-off risk: Transition from Sarah's story back to the solution (12:30–13:30).** Prevent with: the music returning at 12:30 signals a tone shift; the comparison graphic at 13:00 is the visual payoff for the entire argument — it should be given its full 8 seconds without rushing.
3. **Third drop-off risk: The five-step action section (18:00 onward).** Prevent with: the typewriter animation keeps each step visually interesting; the coach should deliver this section with energy, not exhaustion; the steps should feel actionable and achievable, not overwhelming.

PUBLISHING NOTES:
**YouTube Title Options:**
- "Why You're Eating 1,200 Calories and Still Not Losing Weight (The Real Reason)"
- "The Science Behind Why Your Diet Stopped Working"
- "Eating 1,200 Calories and Not Losing Weight? Watch This."

**Description angle:** Open with the question directly — "If you're eating very little and exercising hard but the scale won't move, this video explains exactly why — and what to do about it." Then outline the four hormonal mechanisms in text (great for search). Link to TDEE calculator and coaching programme.

**Keyword tags:** why am I not losing weight eating 1200 calories, metabolic adaptation, calorie deficit not working, why diets stop working, NEAT non exercise activity thermogenesis, ghrelin leptin hunger hormones, minimum effective dose fat loss, sustainable fat loss, online fitness coach, Alex Reed fitness

**Chapters (YouTube Studio):**
0:00 The most common fitness coaching question
1:00 Why eating less makes fat loss harder
3:30 The 4 hormones working against you
7:00 What metabolic adaptation really means
9:30 Sarah's story: 1,100 calories and gaining weight
13:00 The Minimum Effective Dose solution
16:30 What to do this week

**Pinned comment:** "If this video described your situation — eating very little, training hard, and not losing weight — drop a comment below. You are not the problem. The approach is the problem. And there is a way through this. The description has a link to my TDEE calculator if you want to work out your actual maintenance calories."

**Call to action:** Subscribe for weekly fat loss education + link to 12-week Recomposition Method programme + free TDEE calculator in description.""",
        "stageId": 7,
        "timestamp": t(1450),
    },
]

# Add video titles to session
video_titles = [
    {"number": i+1, "title": title} for i, title in enumerate([
        "Why You're Eating 1,200 Calories and Not Losing Weight",
        "The Real Reason You're Always Hungry on a Diet",
        "Why Crash Diets Make You Fatter Long-Term",
        "How Much of a Calorie Deficit Do You Actually Need?",
        "Why the Scale Lies (And What to Track Instead)",
        "The Plateau Problem: Why Your Fat Loss Stalled and Exactly How to Fix It",
        "Body Recomposition: Can You Lose Fat and Build Muscle at the Same Time?",
        "Why Your Calorie Deficit Isn't Working — A Practical Audit",
        "Why Cardio Is Not the Best Tool for Fat Loss",
        "The Beginner's Guide to Progressive Overload",
        "How Many Days Per Week Should You Train to Lose Fat?",
        "The Best Exercises for Fat Loss (Ranked)",
        "Why You Should Stop Doing HIIT Every Day",
        "Strength Training for Women Over 40: What Changes and What Doesn't",
        "How to Build a Training Programme That You'll Actually Stick To",
        "The 3-Day Training Minimum: How to Stay Consistent When Life Gets in the Way",
        "Protein: Why It's the Only Non-Negotiable in Your Diet",
        "The 5-3-1 Eating Hierarchy: How to Make Nutrition Decisions When Life is Complicated",
        "Clean Eating Is a Myth (And It Might Be Making You Fatter)",
        "How to Track Macros Without Losing Your Mind",
        "Meal Timing: Does It Actually Matter?",
        "How Alcohol Really Affects Fat Loss",
        "Eating Out Without Ruining Your Progress",
        "Why You're Probably Not Eating Enough Protein (And How to Fix It)",
        "You Don't Need to Earn Your Food Through Exercise",
        "Supplements: What Actually Works (And What's a Waste of Money)",
        "Spot Reduction Is a Myth: Why You Can't Lose Belly Fat Specifically",
        "Muscle Soreness Is Not a Sign of a Good Workout",
        "Motivation Won't Save You: Why Systems Beat Willpower Every Time",
        "The Problem With Clean Eating Culture",
        "Why 'Eat Less, Move More' Is Terrible Advice",
        "The Truth About Fat Burners and Weight Loss Supplements",
        "Why You Keep Starting Over: The All-or-Nothing Trap and How to Escape It",
        "The Identity Shift: How to Become Someone Who Actually Enjoys Training",
        "How to Build a Calorie Deficit That Feels Easy",
        "What to Do When You've Lost Motivation",
        "Why Your Relationship With Food Needs to Come Before Your Diet Plan",
        "Progress Is Not Linear: How to Interpret Your Results Without Quitting",
        "How Busy Professionals Actually Stay Consistent",
        "The Non-Scale Victories That Actually Predict Long-Term Success",
        "Why Sleep Is Your Most Underrated Fat Loss Tool",
        "Stress, Cortisol, and Fat Storage: What the Research Actually Says",
        "NEAT: The Calorie Burn You're Ignoring That's Costing You Results",
        "How to Optimise Recovery So You Can Train Harder and More Consistently",
        "The Hidden Cost of Over-Training: When More Exercise Makes You Fatter",
        "How Alcohol Affects Your Sleep, Recovery, and Fat Loss Results",
        "How to Design Your Own Fat Loss Programme (From Scratch)",
        "The 12-Week Recomposition Method: What It Is and How It Works",
        "How to Track Your Progress Without Obsessing Over the Scale",
        "What to Do After 12 Weeks: Maintenance, Cutting, and Bulking Explained",
        "How Online Fitness Coaching Actually Works (And Whether It's Right for You)",
        "The Questions to Ask Before Hiring an Online Fitness Coach",
    ])
]

session = {
    "startedAt": t(0),
    "currentStageIdx": 7,
    "practitionerName": "Alex Reed",
    "messages": messages,
    "videoTitles": video_titles,
}

with open("health-script-generator/public/demo-session.json", "w") as f:
    json.dump(session, f, indent=2, ensure_ascii=False)

print(f"Demo session written. Messages: {len(messages)}, Videos: {len(video_titles)}")
