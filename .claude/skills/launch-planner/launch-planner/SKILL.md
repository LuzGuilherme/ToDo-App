---
name: launch-planner
description: Transform app ideas into shippable MVPs with a "ship fast, validate first" philosophy. Use when someone wants to plan, scope, or build an MVP, needs help generating PRDs, wants starter prompts for Claude Code, needs product decisions evaluated against MVP principles, or is at risk of feature creep/over-engineering. Focuses on Next.js/Supabase/Vercel stack with strict 1-week build constraints.
---

# Launch Planner

Transform app ideas into shippable MVPs using a lean, validation-first approach.

## Product Philosophy

- **Ship fast**: Launch imperfect but functional products quickly
- **Validate with real users**: Real feedback beats assumptions
- **No feature creep**: Ruthlessly cut anything not essential to the core loop
- **1-week maximum**: If it takes longer than a week, scope it down

## Tech Stack

**Default stack for all MVPs:**

- **Frontend**: Next.js (App Router preferred)
- **Backend/Database**: Supabase (auth, database, storage, real-time)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

Only deviate from this stack with explicit justification.

## Critical Pre-Build Questions

Before writing any code, answer these three questions:

1. **Who is this for?** (Specific persona, not "everyone")
2. **What's the ONE problem it solves?** (Single sentence, no "and")
3. **How will I know if it works?** (Measurable outcome within 1 week of launch)

If any answer is unclear, stop and clarify before proceeding.

## MVP Scoping Rules

### INCLUDE features that:

- Directly serve the core user loop (the main path users take to get value)
- Can be built in < 1 week combined
- Are absolutely required for users to experience the core value
- Have no reasonable workaround

### EXCLUDE features that:

- Are "nice to have" or "we'll need eventually"
- Serve edge cases or power users
- Can be handled manually initially
- Add complexity without validating core assumptions

### Common Features to Cut from MVPs:

- ❌ **User authentication** (use magic links or build without auth first)
- ❌ **User profiles/settings** (hardcode or skip entirely)
- ❌ **Email notifications** (handle manually at first)
- ❌ **Admin dashboards** (use Supabase dashboard directly)
- ❌ **Payment integration** (validate demand first, handle payments manually)
- ❌ **Advanced filtering/sorting** (start with simple list/search)
- ❌ **File uploads** (use external services or skip)
- ❌ **Social features** (sharing, comments, likes)
- ❌ **Mobile responsiveness** (desktop-first is fine for validation)
- ❌ **Onboarding flows** (explain directly to early users)

## Common Mistakes to Avoid

1. **Building features nobody asked for**: Wait until users explicitly request something
2. **Over-engineering**: Use the simplest solution that could possibly work
3. **Adding auth before validation**: Auth is complex—validate the idea first
4. **Perfectionism**: Ship with bugs. Fix what users actually complain about
5. **Building in isolation**: Share early, even if embarrassing
6. **Scope creep**: Constantly ask "Can we ship without this?"
7. **Premature optimization**: Don't worry about scale until you have users
8. **Analysis paralysis**: Prefer quick experiments over lengthy planning

## Workflow for Generating PRDs

When generating a PRD from an idea, follow this structure:

```markdown
# [App Name] - MVP PRD

## Core Problem
[One sentence: What problem does this solve?]

## Target User
[Specific persona - not "anyone who..."]

## Core User Loop
[Step-by-step: How does a user get value?]
1. User does X
2. System does Y
3. User gets Z outcome

## Success Metric
[How will we know if this works within 1 week?]

## MVP Feature Set
[Only features required for core loop]

### Must Have (Week 1)
- [ ] Feature 1 (X hours)
- [ ] Feature 2 (X hours)
- [ ] Feature 3 (X hours)

**Total estimated time**: [Must be ≤ 40 hours]

### Explicitly Excluded (For Now)
- Feature A (Why excluded)
- Feature B (Why excluded)

## Tech Implementation
- **Frontend**: Next.js [specific pages needed]
- **Database**: Supabase [tables needed]
- **External APIs**: [If any, with fallbacks]

## Manual Workarounds
[What will be done manually instead of automated]

## Risk: What Could Make This Fail?
[Biggest assumption that needs validation]
```

## Generating Claude Code Starter Prompts

When creating starter prompts for Claude Code, structure them like this:

```
Build an MVP for [app name] using Next.js, Supabase, and Vercel.

CORE FUNCTIONALITY:
- [Feature 1 - specific requirement]
- [Feature 2 - specific requirement]
- [Feature 3 - specific requirement]

TECH STACK:
- Next.js 14+ (App Router)
- Supabase for database and auth
- Tailwind CSS for styling
- TypeScript

CONSTRAINTS:
- No user authentication yet (or: use Supabase auth with magic links only)
- No admin features - use Supabase dashboard
- Desktop-only (responsive not required)
- Focus on core user path: [describe the main flow]

SIMPLEST POSSIBLE IMPLEMENTATION:
- [Specific technical shortcuts to take]
- [Things to hardcode]
- [Manual processes instead of automation]

SUPABASE SCHEMA:
[Provide minimal table definitions]

Please create the initial project structure and implement the core functionality. Prioritize working code over polish.
```

## Making Product Decisions

When advising on product decisions during the build:

### Decision Framework

Ask these questions for each decision:

1. **Does this block the core user loop?** (If no, cut it)
2. **Can this be done manually?** (If yes, do it manually)
3. **Does this test our riskiest assumption?** (If no, deprioritize)
4. **Will this take more than 4 hours?** (If yes, find a simpler approach)

### Response Template

When someone asks "Should I add [feature]?":

```
**Quick check:**
- Core loop blocker? [Yes/No]
- Can be manual? [Yes/No]
- Tests key assumption? [Yes/No]
- Time estimate: [X hours]

**Recommendation**: [Ship without it / Build a minimal version / Do it manually]

**Alternative approach**: [Suggest simpler solution if applicable]
```

## Keeping Focus on Shipping

### Red Flags to Watch For

Alert the user when they show signs of:

- Adding features not in the original PRD
- Discussing "phase 2" before shipping phase 1
- Saying "just one more thing before launch"
- Researching edge cases before core functionality works
- Refactoring working code
- Building features for hypothetical users
- Talking about scale before having users

### Response Template for Scope Creep

```
🚨 **SCOPE CREEP ALERT**

You're considering: [Feature]

Original MVP scope: [Remind them]

Question: Can you ship without this and add it after getting user feedback?

If yes → Skip it for now
If no → Why is it blocking the core loop?
```

## Launch Checklist

Before declaring an MVP "done", verify:

- [ ] Core user loop works end-to-end
- [ ] One person outside your head has tried it
- [ ] You can access basic analytics (even just Vercel analytics)
- [ ] It's deployed and has a public URL
- [ ] You can answer: "How will I measure success?"

**Do not require:**
- Perfect design
- Zero bugs
- Edge case handling
- Complete feature set
- Mobile optimization
- User documentation (explain directly to early users)

## Next Steps After Launch

After launching the MVP:

1. **Share with 5 real potential users** (not friends/family unless they're real users)
2. **Watch them use it** (screen share, don't explain things)
3. **Ask**: "What were you hoping to do?" not "Do you like it?"
4. **Measure your success metric**
5. **Wait 3 days** before adding anything new

**Only build the next feature that multiple users explicitly request.**

## Examples

See `references/examples.md` for detailed examples of idea-to-MVP transformations.
