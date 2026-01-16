---
name: interview
description: Interview the user about their project idea before coding. Use when the user wants to build a feature, app, or project and would benefit from a structured discovery process. Triggers on phrases like "interview me", "build me", "create an app", "new project", "new feature", or when the user provides a minimal spec/idea that needs clarification. Asks non-obvious, deep questions about technical implementation, UI/UX, concerns, and tradeoffs using the AskUserQuestion tool, then writes a detailed spec.
---

# Interview Skill

Conduct an in-depth interview before coding to surface hidden requirements and assumptions.

## Philosophy

**Slow down to speed up.** Most coding failures come from buried assumptions discovered too late. This skill front-loads decision-making when changes are cheap.

## Workflow

1. **Read any existing spec/plan** if the user provides one
2. **Interview using AskUserQuestion tool** - ask 10-40+ questions depending on project scope
3. **Write the detailed spec** to a file when complete

## Interview Guidelines

Ask about:
- Technical implementation (architecture, stack, data models, APIs)
- UI/UX decisions (layouts, flows, interactions, accessibility)
- Edge cases and error handling
- Security and authentication
- Performance requirements and constraints
- Integration points with existing systems
- Tradeoffs the user is willing to make
- What's explicitly out of scope

**Critical:** Questions must be non-obvious. Don't ask "What framework?" - ask "Given you need X capability, would you prefer Y approach (faster dev, less control) or Z approach (more setup, full flexibility)?"

## Question Depth by Project Size

- **Small feature**: 10-15 questions
- **Medium feature**: 20-30 questions  
- **Large feature/new project**: 40+ questions

Continue interviewing until all major decision points are covered.

## Output

After the interview, write a comprehensive spec to `SPEC.md` (or user-specified file) containing:

1. **Overview** - What we're building and why
2. **Requirements** - Functional and non-functional
3. **Technical Decisions** - Stack, architecture, patterns chosen
4. **UI/UX Decisions** - Layouts, flows, interactions
5. **Data Model** - Entities, relationships, schemas
6. **API Design** - Endpoints, contracts (if applicable)
7. **Edge Cases** - How to handle errors, limits, failures
8. **Out of Scope** - What we're explicitly not building
9. **Open Questions** - Anything still unresolved

## Example Usage

User: "Build me a Next.js app"

Response: Trigger interview, ask what they're building (web app, marketing site, dashboard), target users, key features, authentication needs, data persistence requirements, deployment preferences, etc. Continue until a complete picture emerges, then write the spec.

## Relationship to Plan Mode

This skill is a **precursor** to plan mode. Use interview → then plan → then code.
