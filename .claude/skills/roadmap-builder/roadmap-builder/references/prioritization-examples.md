# Prioritization Examples

Real-world examples demonstrating the Roadmap Builder framework in action.

## Example 1: Analytics Dashboard (Pre-Launch)

**Request**: "We should add an analytics dashboard so we can track user behavior before launch."

**Stage**: Pre-Launch

**Analysis**:
- Stage rule violation: Pre-launch = ONLY core loop features
- Does not serve core use case for users
- This is for founders, not users
- Can use basic logging + manual SQL queries instead

**Decision**: **REJECT**

**Reasoning**: Not part of core loop. Pre-launch phase demands exclusive focus on making the core experience work. Analytics can be added post-launch when there are actual users to track.

**Alternative**: Use basic logging to a file. Run manual queries when needed. Add proper analytics after launch if user behavior shows it's valuable.

---

## Example 2: Social Sharing (Post-Launch, 500 Users)

**Request**: "Let's add Twitter/LinkedIn sharing buttons. Everyone does this."

**Stage**: Post-Launch (500 users)

**Analysis**:
- Have users explicitly requested this? NO
- "Everyone does this" = competitor copying (red flag)
- No evidence users want to share
- Building for imaginary users

**Validation Questions**:
- Does this serve core use case? Tangentially at best
- Will users actually use it? No evidence
- Can we fake it first? Yes - manual tweet composition, test engagement

**Decision**: **REJECT (for now)**

**Reasoning**: No evidence of demand. Fails the "users explicitly request" rule for post-launch phase. Competitor mimicry red flag.

**Alternative Validation**:
1. Add manual "Share your result" call-to-action with copy-paste text
2. Track how many users actually share manually
3. If >10% share manually, then build automated sharing
4. If <10%, sharing isn't valuable to users

---

## Example 3: Password Reset (Post-Launch)

**Request**: "5 users this week couldn't log in because they forgot passwords."

**Stage**: Post-Launch

**Analysis**:
- Users explicitly requesting: YES (5 in one week)
- Serves core use case: YES (access to product)
- Will users actually use it: YES (proven by manual support burden)
- Category: Core Features (essential functionality)

**Impact vs Effort**:
- Impact: Medium (affects small but consistent user subset)
- Effort: Low (standard email-based flow)
- Priority Score: 2 × (4 - 1) = 6

**Decision**: **BUILD**

**Reasoning**: Passes all validation questions. Users explicitly requesting. Clear evidence of need through support burden. Core functionality. Low effort.

---

## Example 4: Dark Mode (Post-Launch)

**Request**: "Three users asked for dark mode in feedback survey."

**Stage**: Post-Launch

**Analysis**:
- Explicitly requested: YES (3 users)
- Serves core use case: NO (aesthetic preference)
- Category: Low impact improvement

**Validation Questions**:
- Will users actually use it? Maybe (stated vs revealed preference gap)
- Can we fake it first? Not easily

**Impact vs Effort**:
- Impact: Low (quality-of-life, not functional)
- Effort: Medium (CSS overhaul, testing across components)
- Priority Score: 1 × (4 - 2) = 2

**Decision**: **DEPRIORITIZE**

**Reasoning**: Low priority score. Not core functionality. Better to focus on retention or core features. Revisit if requests increase significantly or if it becomes blocking for large user segment.

---

## Example 5: Bulk Operations (Growth Phase)

**Request**: "Add ability to process 100 items at once instead of one at a time."

**Stage**: Growth Phase (reducing churn)

**Analysis**:
- 15% of users process >50 items/day
- Top reason cited in churn surveys: "Too slow for high volume"
- Directly addresses retention issue

**Validation Questions**:
- Does this serve core use case? YES (core workflow improvement)
- Will users actually use it? YES (proven pain point)
- Can we fake it first? Already validated - users ARE doing high volume

**Impact vs Effort**:
- Impact: High (addresses primary churn reason)
- Effort: Medium (backend changes, UI updates)
- Priority Score: 3 × (4 - 2) = 6
- Category: Retention (top priority category)

**Decision**: **BUILD (HIGH PRIORITY)**

**Reasoning**: Directly reduces churn (Growth phase priority). High impact on retention. Evidence-based (churn data). Users already trying to do high volume - validated demand.

---

## Example 6: AI-Powered Recommendations

**Request**: "What if we added AI recommendations? That's trending right now."

**Stage**: Any

**Analysis**:
- Multiple red flags:
  - "What if..." = hypothetical/feature creep
  - "That's trending" = building because it's cool
  - No user requests
  - Building for imaginary users
  
**Validation Questions**:
- Does this serve core use case? Unclear - not defined yet
- Will users actually use it? No evidence
- Can we fake it first? YES (manual curation)

**Decision**: **REJECT**

**Reasoning**: Pure feature creep. Trend-chasing. No validated demand. Building because "AI is hot" not because users need it.

**Alternative Validation**:
1. Manually curate recommendations for 100 users
2. Track engagement with manual recommendations
3. Survey users: "Would you use automated recommendations?"
4. If engagement >30% and strong survey response, reconsider

---

## Example 7: Team Collaboration Features (Pre-Launch)

**Request**: "We should add team workspaces and sharing before we launch. Collaboration is huge."

**Stage**: Pre-Launch

**Analysis**:
- Stage violation: Not core loop
- "Should" = premature assumption
- Building for imaginary users
- No validation of collaboration demand

**Validation Questions**:
- Does this serve core use case? Depends on product
- Is it required for core loop to function? Probably NO
- Can we validate first? YES (launch single-player first)

**Decision**: **REJECT**

**Reasoning**: Launch single-player version first. See if users ask for collaboration. Many products assume collaboration is needed when users actually prefer solo use. Don't build what you think users want - validate first.

**Alternative Path**:
1. Launch single-player version
2. Add manual sharing (email export, link sharing)
3. Track how many users try to share manually
4. If >20% attempt sharing in first month, add real-time collaboration
5. If <20%, collaboration isn't actually needed

---

## Example 8: Premium Feature Set (Post-Launch)

**Request**: "Let's add a premium tier with advanced features to start monetizing."

**Stage**: Post-Launch (200 users, 50% weekly active)

**Analysis**:
- Category: Monetization (3rd priority)
- Should prioritize Retention first - only 50% weekly active
- Premature to monetize when retention isn't solid
- Risk: Adding paywall before proving value

**Validation Questions**:
- Does this serve core use case? Not directly
- Will users actually pay? No evidence yet
- Can we validate willingness to pay first? YES

**Decision**: **DEFER**

**Reasoning**: Fix retention first (50% weekly active is weak). Once users love the product (>70% weekly active), THEN add monetization. Can't monetize a product users don't consistently use.

**Priority Order**:
1. First: Build features that improve weekly active from 50% → 70%
2. Then: Validate pricing (ask users what they'd pay)
3. Finally: Add premium tier when retention is strong

---

## Example 9: API Access (Post-Launch)

**Request**: "Can we get API access? I want to integrate with my other tools."

**Stage**: Post-Launch

**Analysis**:
- Single user request initially
- Then 3 more requests in following week
- Then 10 more the next month
- Growing, consistent signal

**Impact vs Effort**:
- Impact: Medium initially, potentially High (enables power users)
- Effort: High (security, documentation, rate limiting)
- Priority Score: 2 × (4 - 3) = 2 initially

**Decision**: **BUILD (when request count hits threshold)**

**Reasoning**: Not urgent immediately (low priority score), but clear growing demand. Set threshold: "Build API when 50 active users request it OR when losing customers due to lack of API." Track requests. Revisit monthly.

**Validation Strategy**:
- Create waiting list for API access
- Survey requesters about specific use cases
- Design API based on real use cases
- Private beta with waiting list users first

---

## Example 10: Performance Optimization

**Request**: "The app feels slow. Let's rebuild with [new framework/architecture]."

**Stage**: Any

**Analysis**:
- Premature optimization red flag check:
  - What specific slowness? Quantify it.
  - Where exactly is the bottleneck?
  - Have users complained?
  - Can we optimize existing code first?

**Validation Questions**:
- Does this serve core use case? Only if slowness blocks usage
- Will users actually notice? Need metrics
- Can we test smaller fixes first? YES (always)

**Decision**: **CONDITIONAL**

**Framework for Decision**:

1. **If no user complaints + metrics show acceptable performance**: REJECT (premature optimization)

2. **If user complaints + metrics show slowness**: 
   - First: Profile to find bottleneck
   - Second: Optimize the bottleneck specifically
   - Third: Measure improvement
   - Fourth: Only rebuild if optimization isn't enough

3. **If users are churning due to performance**:
   - BUILD immediately
   - Focus on biggest bottleneck first
   - Avoid complete rewrites - incremental fixes

**Never**: Full rebuild/new framework without evidence of severe performance problems affecting users.

---

## Key Patterns Across Examples

### Strong Build Signals
- Explicit user requests (multiple, consistent)
- Evidence in behavior data (usage, churn, support tickets)
- Directly serves core use case
- Retention category
- High impact, low effort combination

### Strong Reject Signals
- "What if..." / "We should..." / "It would be cool..."
- Competitor copying without evidence
- Single user request (wait for pattern)
- Building for imaginary users
- Trend-chasing
- Stage rule violations

### Validation Before Building
- Manual process first
- Track engagement with manual version
- Survey for willingness to use/pay
- Set clear threshold for building
- Start with smallest testable version
