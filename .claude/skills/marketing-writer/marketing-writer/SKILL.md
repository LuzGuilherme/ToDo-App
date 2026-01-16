---
name: marketing-writer
description: Write marketing content (landing pages, tweets, emails, blog posts) for product features and launches. Use when the user needs marketing copy, is shipping a feature, launching a product, or wants to promote their app. Analyzes codebases to automatically understand the product context, value proposition, and features before writing content. Maintains a casual, direct brand voice that focuses on real benefits without corporate buzzwords.
---

# Marketing Writer

This skill writes high-quality marketing content for your product features and launches using a casual, benefit-focused brand voice.

## When to Use This Skill

Use this skill when:
- Shipping a new feature and need to announce it
- Launching a product and need landing page copy
- Writing tweets, email, or blog content about your product
- Creating marketing materials for any product update
- User asks to "write marketing content" or "help me announce this"

## Workflow

### Step 1: Understand the Product Context

**Before writing any marketing content**, analyze the codebase and available context to understand:

1. **What the product/feature does** (core functionality)
2. **What problem it solves** (user pain points)
3. **Key benefits** (time saved, money earned, stress reduced)
4. **Target users** (who needs this)
5. **Differentiators** (what makes it unique)

**How to analyze:**

If a codebase is provided:
- Read README files, package.json, documentation
- Examine code structure to understand features
- Look for user-facing features and workflows
- Identify the value proposition from comments/docs

If no codebase is provided:
- Ask clarifying questions about the product
- Request key features and benefits
- Understand the target audience
- Get any existing product descriptions

**Never write marketing content without understanding what you're marketing.**

### Step 2: Choose the Content Type

Based on the user's request, determine which template to use:
- **Landing page sections** → Use `references/landing_page_templates.md`
- **Tweet threads** → Use `references/tweet_thread_templates.md`
- **Launch emails** → Use `references/launch_email_templates.md`
- **Blog articles** → Use `references/blog_article_templates.md`

### Step 3: Apply Brand Voice Guidelines

**Always review** `references/brand_voice.md` before writing to ensure:
- Casual, direct tone (like talking to a friend)
- No corporate buzzwords or marketing speak
- Focus on real, specific benefits (not hype)
- Simple language (8th-grade reading level)

### Step 4: Write the Content

Follow the specific template structure for the chosen content type:

**Landing Page Features:**
- Problem → Solution → Benefit format
- Specific pain points, not vague problems
- Quantify benefits when possible (hours saved, not "save time")

**Tweet Threads:**
- Hook → Credibility → Value → CTA structure
- Lead with the most interesting stat/claim
- One clear point per tweet
- Include visuals when describing features

**Launch Emails:**
- Personal opening → Specific value prop → Easy CTA
- One email = one purpose
- Short paragraphs (2-3 sentences)
- Remove friction from CTA

**Blog Articles:**
- Captivating title → Strong intro → Scannable body → Clear CTA
- Subheadings every 200-300 words
- Short paragraphs, lots of lists
- 3-5 relevant links throughout

### Step 5: Review Against Brand Voice

Before delivering content, check:
- [ ] No buzzwords (leverage, synergize, disrupt, revolutionize, etc.)
- [ ] Benefits are specific and quantified ("save 3 hours" not "save time")
- [ ] Tone is casual and direct (contractions, simple words)
- [ ] Every claim answers "So what?"
- [ ] Reading level is simple (no jargon)

## Content Type Quick Reference

### Landing Page Feature Sections

**Format:** Problem → Solution → Benefit

**Read:** `references/landing_page_templates.md`

**Example structure:**
```
### [Feature Name]

**The problem:** [Specific user frustration with time/cost]

**How we fix it:** [What the feature does in simple terms]

**What you get:** [Concrete outcome: hours saved, stress reduced, etc.]
```

**Key points:**
- Be specific about the pain (not "inefficient workflows" but "spend 3 hours every Friday")
- Explain mechanism simply (avoid technical details)
- Quantify benefits (save X hours, reduce Y by Z%)

---

### Tweet Threads

**Format:** Hook → Credibility → Value → CTA

**Read:** `references/tweet_thread_templates.md`

**Structure:**
1. **Hook (Tweet 1):** Bold claim, stat, or problem
2. **Credibility (Tweet 2):** Why they should listen
3. **Value (Tweets 3-5):** Show the feature/insight
4. **CTA (Final tweet):** Clear next step

**Key points:**
- Lead with best stat/claim in tweet 1
- One clear point per tweet
- Use bullets for multiple items
- Include screenshots of feature in action
- Make CTA frictionless ("No credit card")

---

### Launch Emails

**Format:** Personal opening → Specific value prop → Easy CTA

**Read:** `references/launch_email_templates.md`

**Structure:**
```
Subject: [Specific benefit or "You can now X"]

Hey [Name],

[Problem they have OR benefit they get in first sentence]

[Optional: Brief reason why you built this]

What's new:
• [Benefit 1 with brief explanation]
• [Benefit 2 with brief explanation]
• [Benefit 3 with brief explanation]

[CTA]: Try it now: [link]

[Friction removal: "No setup needed" / "Takes 2 minutes"]

[Sign off]

P.S. [Optional: What's next or feedback request]
```

**Key points:**
- Get to the point in first sentence
- 100-150 words total
- One clear CTA
- Remove friction ("No credit card," "Free trial")

---

### Blog Articles

**Format:** Title → Intro → Scannable body → CTA

**Read:** `references/blog_article_templates.md`

**Structure:**
1. **Title:** Specific, benefit-driven, keyword-rich
2. **Intro (2-3 paragraphs):** Hook + what they'll learn
3. **Body:** Short paragraphs, H2s every 200-300 words, lists
4. **Conclusion:** Recap + clear next step

**Key points:**
- Paragraphs = 2-4 sentences max
- Use subheadings liberally
- Include examples and specifics
- 3-5 links to related content
- Optimize for SEO (keyword in title, H2s, naturally throughout)

**Article types:**
- How-to guides (1,000-1,500 words)
- Problem-solution posts (800-1,200 words)
- Comparison/reviews (1,500-2,000 words)
- Case studies (1,000-1,500 words)

---

## Writing Principles

### Focus on Benefits, Not Features

❌ **Feature-focused:**
"Advanced AI-powered analytics dashboard"

✅ **Benefit-focused:**
"See which customers are about to churn—before they leave"

### Be Specific, Not Vague

❌ **Vague:**
"Streamline your workflow and boost productivity"

✅ **Specific:**
"Cut your weekly reporting time from 3 hours to 15 minutes"

### Use Real Talk, Not Marketing Speak

❌ **Corporate:**
"Our innovative platform leverages cutting-edge technology to transform your business"

✅ **Real:**
"Stop wasting time on busywork. We'll handle the boring stuff."

### Quantify Everything

When possible, use numbers:
- Hours saved
- Percentage improvement
- Money earned/saved
- Time to complete
- Number of steps reduced

❌ "Save time on reports"
✅ "Save 3 hours every Friday"

---

## Common Mistakes to Avoid

### For All Content:

❌ **Buzzwords:** Leverage, synergize, disrupt, revolutionize, transform, empower
✅ **Simple words:** Use, build, make, improve, help, save

❌ **Hype without specifics:** "Game-changing," "revolutionary," "unlike anything"
✅ **Concrete claims:** "10x faster," "save 3 hours," "reduce errors by 80%"

❌ **Long sentences:** Dense paragraphs with multiple clauses
✅ **Short, punchy:** One idea per sentence. Lots of white space.

❌ **Passive voice:** "Reports can be generated automatically"
✅ **Active voice:** "Generate reports automatically"

### Content-Specific:

**Landing pages:**
- Don't list features without benefits
- Don't use vague problems ("inefficient")
- Don't forget to quantify outcomes

**Tweet threads:**
- Don't bury the lead (best stat goes in tweet 1)
- Don't use walls of text (2-3 lines max per tweet)
- Don't skip visuals

**Emails:**
- Don't ramble (cut 30% of what you write)
- Don't use multiple CTAs (one clear action)
- Don't forget friction removal

**Blog posts:**
- Don't write long paragraphs (2-4 sentences)
- Don't skip subheadings (every 200-300 words)
- Don't ignore SEO (keyword in title, H2s)

---

## Reference Files

All templates and detailed guidelines are in the `references/` directory:

- **`brand_voice.md`** - Core voice principles, tone guidelines, examples
- **`landing_page_templates.md`** - Problem→Solution→Benefit format with examples
- **`tweet_thread_templates.md`** - Hook→Credibility→Value→CTA with thread structures
- **`launch_email_templates.md`** - Email templates for features, launches, updates
- **`blog_article_templates.md`** - Full article structures with SEO optimization

**Read these files** before writing content to ensure you're following the correct format and brand voice.

---

## Deliverables

When writing marketing content, provide:

1. **The content** in the requested format
2. **Brief explanation** of key decisions made
3. **Suggestions** for improvements or variations (if relevant)

Example:
```
Here's your feature announcement email:

[EMAIL CONTENT]

I focused on the time-saving benefit (3 hours → 15 minutes) since that's the most
concrete and relatable outcome. The CTA is frictionless with "no setup needed."

Alternative subject lines to test:
- "You can now export to Excel in one click"
- "Stop spending 3 hours on reports every week"
```

---

## Example Usage

**User:** "I just shipped automatic report exports. Write a tweet thread announcing it."

**Claude's response:**
1. Reads `references/tweet_thread_templates.md`
2. Applies `references/brand_voice.md` principles
3. Writes thread following Hook→Credibility→Value→CTA structure
4. Includes specific benefits (time saved)
5. Keeps casual tone without buzzwords

---

## Notes

- This skill automatically understands product context from codebases when available
- Always prioritize specific, quantified benefits over vague feature descriptions
- The goal is marketing that sounds human and focuses on real value
- When in doubt, cut corporate language and explain it like you would to a friend
