---
name: design-guide
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
---

# Design Guide

Enforce modern, professional design standards for all UI components. This skill ensures clean, minimal interfaces that avoid generic AI aesthetics.

## Core Design Principles

### 1. Clean and Minimal Layout
- Prioritize whitespace over density
- Remove unnecessary decorative elements
- Each element must serve a purpose
- Avoid visual clutter at all costs

### 2. Color System
**Base Palette:**
- Grays and off-whites as foundation (e.g., #FAFAFA, #F5F5F5, #E5E5E5, #9CA3AF, #6B7280, #374151)
- ONE accent color used sparingly for CTAs and key interactions
- NEVER use purple/blue gradients or rainbow color schemes

**Accent Color Usage:**
- Primary actions only (submit buttons, links)
- Maximum 10-15% of visible elements
- Maintain WCAG AA contrast ratios (4.5:1 minimum)

### 3. Spacing System (8px Grid)
Use these values exclusively: 8, 16, 24, 32, 48, 64px

**Common patterns:**
- Component padding: 16px or 24px
- Section spacing: 48px or 64px
- Element gaps: 8px or 16px
- Card/container padding: 24px or 32px

### 4. Typography
**Hierarchy:**
- H1: 32-48px, font-weight: 600-700
- H2: 24-32px, font-weight: 600
- H3: 20-24px, font-weight: 600
- Body: 16px minimum (never smaller), font-weight: 400
- Small text: 14px minimum, use sparingly

**Font Rules:**
- Maximum 2 font families total
- Default to system fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- Line height: 1.5 for body, 1.2 for headings

### 5. Elevation and Shadows
Use subtle shadows sparingly:
- `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)` - Subtle card lift
- `box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07)` - Moderate elevation
- NEVER use heavy or multiple shadows on one element

### 6. Border Radius
- Small elements (buttons, inputs): 6-8px
- Cards: 8-12px
- NOT everything needs rounded corners
- Maintain consistency within component types

### 7. Interactive States
ALWAYS define these states:
```css
/* Hover: 5-10% darker or lighter */
background: #E5E5E5;
:hover { background: #D4D4D4; }

/* Active: More pronounced than hover */
:active { transform: scale(0.98); }

/* Disabled: 50% opacity, no pointer events */
:disabled { opacity: 0.5; cursor: not-allowed; }

/* Focus: Clear outline, never remove */
:focus-visible { outline: 2px solid [accent-color]; outline-offset: 2px; }
```

## Component Patterns

### Buttons
```
GOOD:
- Padding: 12px 24px (or 16px 32px for large)
- Border-radius: 6px
- Subtle shadow: 0 1px 3px rgba(0,0,0,0.1)
- Clear hover: slightly darker background
- Font-weight: 500 or 600
- Letter-spacing: 0.01em (optional)

BAD:
- Gradients
- Heavy shadows
- Tiny padding
- All caps text (use sparingly)
```

### Cards
```
GOOD:
- Either: 1px solid border (#E5E5E5) OR subtle shadow
- NOT both border and shadow
- Padding: 24px
- Background: white or very light gray
- Border-radius: 8px

BAD:
- Heavy borders and shadows together
- Colored backgrounds
- Inconsistent padding
```

### Forms
```
GOOD:
- Labels: Above inputs, 14-16px, font-weight: 500
- Inputs: Height 40-48px, padding: 12px 16px
- Border: 1px solid #D4D4D4, focus: 2px solid [accent]
- Spacing between fields: 24px
- Error state: Red border + red text below
- Success state: Green border (no text if not needed)

BAD:
- Placeholder-only (always have labels)
- Tiny inputs
- Missing error states
- Inconsistent spacing
```

### Navigation
```
GOOD:
- Height: 64px
- Padding: 16px 24px
- Sticky positioning common
- Link spacing: 24px or 32px
- Active state: Bold or accent color underline

BAD:
- Cluttered with too many items
- Different colored backgrounds
- Missing mobile menu
```

## Mobile-First Approach

Start with mobile (320px+) and scale up:

```css
/* Mobile first */
.container {
  padding: 16px;
  flex-direction: column;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    flex-direction: row;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Anti-Patterns (What NOT to Do)

1. **Rainbow gradients** - Use solid colors
2. **Text below 16px for body** - Readability first
3. **Inconsistent spacing** - Stick to 8px grid
4. **Every element different color** - Restrain palette
5. **Heavy shadows everywhere** - Subtle elevation only
6. **No hover states** - Always show interactivity
7. **Centered large text blocks** - Left-align for readability
8. **Mixing too many styles** - Choose one coherent approach

## Pre-Implementation Checklist

Before creating any UI component, verify:
- [ ] Color palette chosen (base + one accent)
- [ ] All spacing uses 8px grid values
- [ ] Minimum 16px body text
- [ ] All interactive elements have hover/active/disabled states
- [ ] Focus states defined for accessibility
- [ ] Mobile responsive behavior planned
- [ ] Shadow usage is minimal and consistent

## Example Color Schemes

**Neutral + Blue accent:**
- Background: #FAFAFA
- Cards: #FFFFFF
- Text: #374151
- Borders: #E5E5E5
- Accent: #3B82F6

**Neutral + Green accent:**
- Background: #F9FAFB
- Cards: #FFFFFF
- Text: #1F2937
- Borders: #D1D5DB
- Accent: #10B981

**Neutral + Orange accent:**
- Background: #FAFAFA
- Cards: #FFFFFF
- Text: #374151
- Borders: #E5E5E5
- Accent: #F97316
