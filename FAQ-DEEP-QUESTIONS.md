# sensAi — Deep Questions & Answers

_Comprehensive Q&A for sophisticated prospects (operators with data teams, CRM heads, analytics leads). These should be added to the chat agent's knowledge base and also serve as internal preparation for sales calls._

_Organized by who's likely asking._

---

## Model Trust & Accuracy

**Q: How do you prevent hallucinations? If the system uses AI, how do I know it's not making things up?**

sensAi is not a generative AI that invents answers. The intelligence layer is built on deterministic models — pattern detection, statistical scoring, behavioral classification. When sensAi says "this account is likely an abuser," it's because specific, traceable behavioral patterns matched. Every output links back to the data points and patterns that produced it. The AI chat layer (for asking questions about your data) is grounded in your actual data — it reads from the database, not from imagination. If it doesn't have the data, it says so. We don't guess.

On top of that, we have validation loops — both agentic (automated checks that cross-reference outputs against data) and human (the team reviews, confirms, or rejects). These loops run continuously, not as a one-time QA step.

**Q: How do you prevent bias or bad inputs from corrupting the models? What if someone teaches it something wrong?**

Every pattern the team adds goes through a validation cycle. When a team member teaches sensAi a new pattern (e.g., "players who deposit 5 times in 10 minutes and immediately bet max are likely abusers"), sensAi runs it against historical data and shows how many accounts match, what their profile looks like, and what the impact would be. The team reviews this before it becomes active. It's not blind learning — it's supervised, transparent, and reversible. If a pattern turns out to be wrong, you deactivate it and the model recalculates. Nothing is permanent or hidden.

**Q: How do you know if the models are drifting? What if the market changes and the model doesn't keep up?**

sensAi's philosophy incorporates both bottom-up and top-down drift prevention:

**Bottom-up (case-level):** The team reviews specific cases and deep-dives into them. When they identify a pattern — like a VIP who churned silently after playing a certain game — they feed that pattern into sensAi, and the system adapts to identify more cases like it. This is how new knowledge enters the system: from real observations, not theoretical model updates.

**Proactive flagging:** sensAi constantly surfaces accounts that don't fit their current classification — high-value players who show abuse signals, or players not flagged as abusers who keep extracting bonuses from the system. By flagging these edge cases and getting human feedback, sensAi ensures that if drift is happening, it gets identified and corrected fast. The system is designed to challenge its own outputs.

**Top-down (KPI-level):** sensAi analyzes business KPIs automatically — if metrics shift (bonus costs spike, churn changes, segment sizes move unexpectedly), it flags and analyzes the anomaly. This catches drift at the macro level before it becomes a problem at the account level.

**Continuous feedback loops:** Every time the team confirms or rejects a flag, approves or dismisses a case, that signal feeds back into the model. This keeps it aligned with current reality, not historical assumptions.

The key difference: traditional models are trained once and deployed. sensAi's models are continuously shaped by the business team through real case work. Drift happens when models are disconnected from the people who understand the business. sensAi keeps them connected.

**Q: Can we see why a specific customer got a specific score? Can we trace it back?**

Yes — this is a core design principle. Every score, every flag, every segment assignment is explainable down to the customer level. You can see which patterns contributed, what data points triggered them, and the weight of each factor. If your team disagrees with a score, they can trace the logic, identify which pattern is off, and adjust it. No black boxes.

**Q: What happens if we disagree with the model's output? Can we override it?**

Yes. The team can override any individual decision (e.g., "this flagged account is actually legitimate — I know this customer"). That override feeds back into the system as a learning signal. Over time, sensAi gets better at distinguishing similar cases. You can also adjust or deactivate the underlying patterns if the logic itself needs to change. You're always in control.

---

## CRM & Integration

**Q: We already have a CRM (Optimove / Fast Track / Xtremepush / etc.). Do we have to replace it?**

No. sensAi doesn't replace your CRM — it makes it smarter. Think of it as the brain behind your CRM. sensAi analyzes your customer base, builds segments, detects patterns, and pushes that intelligence into your CRM via API. Your CRM still handles campaign execution, communication, and workflows. It just gets better inputs. Same applies to risk tools, case management, Zendesk — sensAi enriches them, doesn't compete with them.

**Q: How does the integration actually work? What do you need from us technically?**

We need read access to a short list of raw data tables — typically player transactions, sessions, deposits, withdrawals, and basic account info. We connect to your data warehouse (BigQuery, Snowflake, etc.) or receive daily exports. We build the data model and pipeline on our side. We don't touch your production systems. Outputs are pushed back via API to wherever you need them — CRM, risk tools, DWH, BI layer.

What we need from you: database read access and a technical contact for the initial setup. That's it.

**Q: How long does integration take?**

Days, not months. Once we have access to the data tables, the pipeline is built within 1-2 weeks. First outputs (enriched profiles, initial segments, abuse scans) typically within 2-3 weeks of data access. This isn't a 6-month implementation project.

**Q: Do you process PII?**

No. sensAi works with behavioral and transactional data. We don't need names, emails, addresses, or identity documents. Account IDs, transaction data, session data, game activity — that's what powers the intelligence. If specific use cases require PII down the road (e.g., Zendesk integration for case context), we handle it through masking or work without it.

**Q: What if our CRM doesn't have an API? Or it's limited?**

sensAi pushes intelligence via standard APIs. If your CRM has API access (most modern CRMs do), we integrate directly. If the API is limited or closed, we can push enriched data to your data warehouse or BI layer, and your team pulls it from there. The intelligence still gets generated — the delivery channel adapts to your stack.

**Q: Can sensAi push segments or lists directly into our CRM for campaigns?**

Yes — that's one of the core outputs. sensAi generates targeted customer lists and segments (e.g., "high-value players showing early churn signals" or "players eligible for reactivation who responded to bonus type X in the past") and pushes them to your CRM. Your CRM team uses those lists for campaigns, communications, or offers. The segments update daily, so campaigns are always working with current data.

**Q: Do you replace our BI / analytics tools (Tableau, Looker, Power BI)?**

No. BI tools show what happened — dashboards, reports, historical views. sensAi tells you what's happening now and what to do about it. They complement each other. In practice, sensAi's enriched data can also flow into your BI tools, making your existing dashboards smarter.

---

## Data & Architecture

**Q: Is this real-time?**

Currently sensAi runs on batch processing — data is analyzed and refreshed on a daily cycle. Real-time processing is on the roadmap. For the core use cases (segmentation, abuse detection, LTV, KPI monitoring), daily refresh is what operators need. The patterns that matter — value shifts, abuse networks, churn signals — play out over days and weeks, not milliseconds. When real-time matters (e.g., in-session fraud detection), that's a future layer.

**Q: How do you handle large data volumes? We have 1M+ MAU and billions of transactions.**

sensAi's pipeline is built to scale. We're already processing 400K+ accounts nightly in production. For larger operators, we optimize with delta processing (only process changes), efficient storage, and parallel computation. Data volume is an engineering challenge we've planned for, not a surprise.

**Q: Where does our data go? Is it secure?**

Your data stays in your cloud. sensAi connects to your data warehouse — we read from it, we don't copy your raw data to our servers. The intelligence layer (models, patterns, scores) runs on our infrastructure (GCP), but the source data remains yours. We can discuss specific security requirements on a call — we're flexible on architecture to meet compliance needs.

**Q: What if we have data quality issues?**

Every operator does. sensAi's pipeline includes data validation and cleaning steps. We flag quality issues we find (missing fields, inconsistent formats, gaps) and work with your team to address them. The system is built to be robust against messy data — it won't break because of a few null fields. That said, better data = better intelligence, so we'll always push to improve quality where it matters.

---

## LTV & Models

**Q: How is sensAi's LTV model different from what we could build ourselves?**

Three things:
1. **It's built on human intuition, not just math.** Your team defines the behavioral patterns that matter — what indicates a fraudster, what signals a high-value player, what early signs predict churn. The model incorporates these business-defined patterns alongside the statistical signals. So a customer with high deposits but fraud-like behavior gets scored correctly as risky, not as high-value.
2. **It's two layers.** First: who is this customer (behavioral classification based on patterns). Second: where do they stand (account health, lifecycle stage, churn signals). Combined, this produces a lifetime value projection that's intuitive and explainable — not a single black-box number.
3. **It adapts continuously.** When the business reality changes (new market, new product, new abuse technique), the team teaches sensAi the new patterns and the model adapts. No retraining tickets, no 3-month model refresh cycles.

**Q: Can I see the LTV calculation for a specific customer?**

Yes. Every customer's LTV score is traceable — you can see which behavioral classification they fall into, what patterns matched, their account health indicators, and how those factors combined into the projection. If you think a score is wrong, you can trace why and adjust the underlying patterns.

**Q: How accurate is the LTV model? What's the error rate?**

We measure accuracy through continuous back-testing — comparing projections against actual outcomes as they materialize. The model improves over time as more data and more team feedback accumulate. We're transparent about accuracy and share performance metrics with you. Early in the partnership, accuracy grows quickly because the team is actively shaping the patterns. We don't claim 99% accuracy on day one — we claim a model that gets smarter every week because your team is part of the loop.

---

## Game Intelligence

**Q: How do game recommendations work?**

sensAi builds a gaming profile for each customer based on their actual playing behavior — which games they play, how they play, session patterns, bet sizes, game type preferences. Then it uses collaborative filtering: it recommends games that players with similar profiles liked but this customer hasn't tried yet. Think Netflix recommendations, but for your game catalogue.

**Q: What's the gaming catalogue?**

sensAi builds a game-level view of your entire catalogue. For each game, it maps: stickiness (how well it retains players), the types of players it attracts (high-value, risk-flagged, casual, game fans), engagement patterns, and revenue contribution. This helps you understand your catalogue strategically — which games attract the players you want, which games are associated with risk, and where the gaps are.

**Q: Can this feed into our CRM for personalized content?**

Yes. Game recommendations and player-game affinity scores can be pushed into your CRM as enrichment data. Your CRM team uses it to personalize game suggestions, bonus offers, or content — right game to the right player. sensAi also generates alerts when game behavior shifts (e.g., a VIP moving away from their usual games, or a game suddenly attracting flagged accounts).

---

## Abuse Detection — Deep Dive

**Q: How does ring detection work? How do you find coordinated accounts?**

sensAi identifies groups of accounts that are likely operated by the same person or a coordinated group. It does this by detecting behavioral signatures across accounts:
- **Deposit patterns:** velocity deposits — players accumulating bankrolls in similar amounts, at similar times, using similar scripts
- **Gaming/betting signatures:** accounts playing the same games with the same bet patterns, same session durations
- **Timing patterns:** accounts active at the same hours, making the same sequence of actions
- **Network mapping:** once a pair of suspicious accounts is identified, sensAi maps outward to find the full network — other accounts with similar signatures

These aren't simple rules (like "same IP" or "same device"). sensAi looks at behavioral fingerprints that are much harder to fake. The output is a visual network cluster that your team reviews in Q Center — they see the accounts, the connections, the evidence, and decide what to do.

**Q: What types of abuse can sensAi detect?**

- **Bonus abuse** — players systematically exploiting promotional offers (sign-up bonuses, reload bonuses, free bets) with no intent to play genuinely
- **Multi-accounting** — same person operating multiple accounts to multiply bonuses or circumvent limits
- **Coordinated rings** — groups working together to extract value (e.g., one deposits, another receives transfers, third withdraws)
- **Arbitrage patterns** — exploiting odds or game mechanics for guaranteed profit
- **Deposit-and-withdraw cycling** — depositing to claim a bonus, meeting minimum wagering, withdrawing immediately
- **Promo stacking** — using multiple promotional offers across accounts or in sequence to maximize extraction

**Q: How is this different from our existing fraud rules?**

Rules catch what you already know about. sensAi catches what you don't know yet. Rule-based systems work on predefined thresholds ("flag if deposit > X within Y minutes"). sensAi detects patterns — behavioral similarities across accounts that no single rule would catch. The ring detection is a good example: a coordinated group might each individually look normal, but together their behavioral signatures form a pattern that's unmistakable. Rules don't see networks. sensAi does.

**Q: What's the false positive rate? How much noise does it create?**

sensAi is designed to surface high-confidence patterns, not flood your team with alerts. The Q Center prioritizes cases by confidence level — your team works the most clear-cut cases first. As they confirm or dismiss cases, the system learns what's real and what's noise, and calibrates accordingly. The result is precise detection, not a flood of flags — operators get meaningful signal, not noise.

---

## Operations & Team

**Q: How much of our team's time does this require?**

In the setup phase (first 2-4 weeks): a few hours with your data/technical contact to set up access, and a few conversations with the business team to define initial patterns and priorities. After that: the system runs continuously. Your team interacts with it as part of their normal workflow — reviewing cases in Q Center, giving feedback on flags, using enriched segments for campaigns. It saves time, it doesn't add overhead.

**Q: Who on our team needs to be involved?**

Typically: a technical contact for data access (data engineer or analyst), and the business users who will consume the intelligence (CRM team, risk team, VIP managers). No dedicated "sensAi admin" needed. The founding team handles configuration and tuning during the design partnership.

**Q: What if our analyst leaves? Does the knowledge disappear?**

No — that's one of the core problems sensAi solves. When your team teaches sensAi patterns and gives feedback, that knowledge is captured in the system permanently. It doesn't live in someone's head or their spreadsheets. If an analyst leaves, the patterns they defined, the feedback they gave, and the intelligence they helped build — it all stays. The next person starts with that foundation, not from scratch.

---

## Commercial & Partnership

**Q: How is sensAi priced?**

Pricing depends on the scope and scale of the engagement. We structure design partnerships to be flexible and value-based. Best to discuss specifics on a call with our team.

_(Do NOT share specific numbers, discounts, or contract terms in the chat.)_

**Q: What's the commitment? Can we exit if it doesn't work?**

We structure partnerships to be flexible — no long lock-ins. We're value-based, which means if it doesn't work for you, it doesn't work for us. Specific terms are best discussed directly with our team.

_(Do NOT share specific exit clauses, timeframes, or contract details in the chat.)_

**Q: Do you work with our competitors?**

Each operator's data, patterns, and models are completely separate. We don't share intelligence across operators. Your data, your patterns, your competitive advantage. That said, we do work with multiple operators — the product improves as we learn from different business contexts (without ever sharing specifics across clients).

**Q: What happens after the design partnership ends?**

The system you've built together — the patterns, the models, the intelligence layer — continues to run. You transition from hands-on partnership to a standard product subscription with ongoing support. The goal of the design partnership is to reach a point where your team runs sensAi independently, with us available for support and new capabilities.

---

## Competitive Positioning

**Q: How are you different from Optimove / Fast Track / Xtremepush?**

These are CRM platforms with CDP capabilities — they handle campaigns, communications, customer data unification, and workflows really well. sensAi isn't a CRM. It's the intelligence layer that makes your CRM smarter. We analyze your customer base, build the segments, detect the patterns, and push that intelligence into your CRM. Your CRM executes better because sensAi tells it what to execute on. They're complementary, not competitive. sensAi also has its own CDP capability and can feed from an existing CDP if you have one — it adapts to your stack.

**Q: How are you different from Tableau / Looker / Power BI?**

BI tools are great at showing what happened — dashboards, reports, historical analysis. sensAi tells you what's happening now and what to do about it. It's the difference between a rearview mirror and a co-pilot. sensAi's enriched data can also flow into your BI tools, making your existing dashboards smarter.

**Q: How are you different from our internal data team building models?**

Your data team is capable but bottlenecked. They respond to requests, build models when they have bandwidth, and the insights often stay trapped in reports. sensAi runs continuously — 100s of sensors, daily refresh, pushing intelligence into workflows automatically. Your data team is freed to focus on strategic analysis and deeper questions, while sensAi handles the continuous monitoring and operational intelligence. It multiplies their capacity, not replaces them.

**Q: We looked at Bloomreach / other CRM+CDP platforms. How is sensAi different?**

Bloomreach, Optimove, Xtremepush — these are CRM systems with CDP capabilities built in. They're great at execution: campaigns, communications, customer data unification. sensAi is the intelligence layer that sits on top. It doesn't just store and unify data — it thinks about it. It detects patterns, builds predictive models, surfaces anomalies, and pushes actionable intelligence into those CRM systems.

A CRM+CDP tells you what data you have and helps you act on segments you define. sensAi discovers the segments, detects what you're missing, and continuously adapts the intelligence. They're complementary — sensAi makes your CRM+CDP smarter.

sensAi also has its own CDP capability — it builds enriched customer profiles as part of its pipeline. And if you already have a CDP, sensAi can feed from it. It works with your existing data infrastructure, not against it.

**Q: Can sensAi ingest outputs from other models or systems we already use?**

Yes. sensAi can take the output of any external system or model and incorporate it as a signal — for example, a SEON fraud score, an internal value model, a third-party risk rating, or a CRM propensity score. These become additional data points that sensAi uses alongside its own behavioral analysis. You don't have to throw away what you've already built — sensAi layers intelligence on top of it and connects the dots across all your signals.
