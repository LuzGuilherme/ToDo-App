---
name: roadmap-builder
description: Strategic product roadmap prioritization using Impact vs Effort matrix and stage-based rules. Use when advising what to build next, evaluating feature ideas, challenging roadmap decisions, or helping prioritize between multiple features. Prevents feature creep by enforcing focus on core use case and real user demand.
---

# Roadmap Builder

Apply this ruthlessly practical prioritization framework to keep product roadmaps focused on what actually matters.

## Core Prioritization Framework

### Impact vs Effort Matrix

Prioritize features in this order:

1. **High Impact, Low Effort** - Build these first
2. **High Impact, High Effort** - Strategic investments
3. **Low Impact, Low Effort** - Quick wins if capacity allows
4. **Low Impact, High Effort** - Avoid or deprioritize

### Category Priority Order

Evaluate features through these categories in order of importance:

1. **Retention** - Features that keep users coming back
2. **Core Features** - Essential functionality for the main use case
3. **Monetization** - Revenue-generating capabilities
4. **Growth** - Features that drive user acquisition or viral sharing

## Stage-Based Rules

Apply strict stage-appropriate constraints:

### Pre-Launch Phase

**ONLY build core loop features. Nothing else.**

- Focus exclusively on the minimum viable core experience
- No analytics, no admin panels, no "nice to haves"
- Must directly serve the primary use case
- Challenge: "Is this absolutely required for the core loop to function?"

### Post-Launch Phase

**ONLY build features users explicitly request.**

- No building based on hypotheticals or assumptions
- Must have concrete user requests (support tickets, interviews, surveys)
- Track frequency and urgency of requests
- Challenge: "How many users have actually asked for this?"

### Growth Phase

**Focus on features that reduce churn or increase sharing.**

- Prioritize retention metrics over new features
- Build sharing mechanisms that feel natural, not forced
- Address top reasons users leave
- Challenge: "Will this make users stay longer or invite others?"

## Critical Validation Questions

Ask these for EVERY feature before committing:

### 1. Core Use Case Alignment

**"Does this serve the core use case?"**

- If no: Reject immediately
- If tangential: Deprioritize heavily
- If yes: Continue to next question

### 2. Real vs Stated Demand

**"Will users actually use this or just say they want it?"**

- Stated preference often differs from revealed preference
- Look for evidence of pain (workarounds, complaints, churn data)
- Single vocal user ≠ real demand
- Challenge: "What evidence suggests users will actually use this?"

### 3. Validation Strategy

**"Can we fake it first to validate demand?"**

Before building:

- Manual process behind the scenes
- Wizard of Oz testing
- Landing page with signup
- Concierge MVP

If you can't validate demand cheaply, the feature might not be worth building.

## Red Flags - Automatic Rejection

Reject features exhibiting these patterns:

### Feature Creep

- "It would be cool if..."
- "Competitors have this..."
- "This could be useful someday..."
- Building complexity without validated demand
- Adding features because you can, not because you should

### Premature Optimization

- Solving performance problems before they exist
- Building scalability for 10M users when you have 100
- Complex architectures before understanding true needs
- "We might need this later..."

### Imaginary Users

- "Users will probably want..."
- "When we get to 10,000 users..."
- Building for personas instead of real people
- No actual user conversations supporting the feature

### Founder Pet Projects

- Features only the founder wants
- Building for yourself, not the market
- Ignoring user feedback because "we know better"
- Emotional attachment to unused features

## Decision Framework Workflow

When evaluating a feature request:

### Step 1: Stage Check

Determine current product stage and apply appropriate rules:

- Pre-launch: Is this core loop? If no → Reject
- Post-launch: Do users explicitly request this? If no → Reject  
- Growth: Does this reduce churn or increase sharing? If no → Deprioritize

### Step 2: Validation Questions

Ask all three critical questions in order. Any "no" answer requires strong justification to proceed.

### Step 3: Red Flag Scan

Check for any red flag patterns. Presence of red flags = automatic rejection or deprioritization.

### Step 4: Impact vs Effort Scoring

If feature passes all checks:

- **Impact**: High (3), Medium (2), Low (1)
- **Effort**: Low (1), Medium (2), High (3)
- **Priority Score** = Impact × (4 - Effort)

Higher scores = higher priority.

### Step 5: Category Placement

Place in appropriate category (Retention > Core > Monetization > Growth) and stack rank within category by priority score.

## Output Format

When advising on roadmap decisions, provide:

1. **Recommendation**: Clear build/don't build decision
2. **Reasoning**: Which rules/questions led to this decision
3. **Evidence Gaps**: What information is missing for a confident decision
4. **Alternative Approach**: If rejecting, suggest validation strategy or simpler alternative
5. **Risk Assessment**: What could go wrong with this decision

## Communication Principles

When challenging feature ideas:

- Be direct but constructive
- Focus on validation, not opinion
- Use the framework language consistently ("Does this serve the core use case?")
- Offer alternatives, don't just say no
- Remind that saying no to features = saying yes to focus

## Common Scenarios

### Scenario: "Users are asking for feature X"

**Response approach:**

- How many users? (1 or 100?)
- How strongly? (nice-to-have or blocking?)
- What's the actual problem they're trying to solve?
- Can we solve it differently?
- Stage check: Should we even build this now?

### Scenario: "Competitor has feature Y"

**Response approach:**

- Do OUR users need this?
- What's the opportunity cost?
- Could this be a differentiator to NOT have it?
- Can we validate demand first?
- Does it serve our core use case?

### Scenario: "This would only take a week to build"

**Response approach:**

- Low effort ≠ high priority
- What's the maintenance cost?
- What are we NOT building instead?
- Does it pass the validation questions?
- Will this lead to more complexity later?

### Scenario: "We need this for scalability"

**Response approach:**

- What's the actual current bottleneck?
- What metrics show this is urgent?
- Can we optimize existing code first?
- Premature optimization red flag check
- What's the user impact of this delay?

## References

For detailed examples of prioritization in action, see `references/prioritization-examples.md`.
