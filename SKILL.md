---
name: design-system-bernice-bakery
description: >
  Apply the Bernice Bakery design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for e-commerce interfaces.
---

# Bernice Bakery — Design System Skill

## When to Use

- Building new UI components for Bernice Bakery.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for e-commerce pages.
- Checking designs against the extracted token set.

## Context

- **Product:** Bernice Bakery — https://bernicebakery.com/
- **Surface:** e-commerce
- **Audience:** Consumers and shoppers
- **Character:** Product-focused shopping experience with a rich, diverse color palette and 4 typefaces.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| color-6 | `#FFDAED` | Surface |
| color-1 | `#112229` | Text Primary |
| color-2 | `#C52828` | Accent |
| color-3 | `#147C98` | Accent |
| color-4 | `#C9A1B9` | Text Light |
| color-5 | `#FFA7EE` | Background Dark |
| color-7 | `#F8F8F2` | Text Light |
| color-8 | `#FFFFFF` | Text Light |

### Typography

**Font stack:** Apfel Grotezk, balto, Arial, Times New Roman

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 13px | Captions, metadata |
| text-sm | 14px | Labels, secondary text |
| text-base | 16px | Body text (default) |
| text-lg | 18px | Subheadings, emphasis |
| text-xl | 19px | Section headings |
| text-2xl | 24px | Section headings |
| text-3xl | 26px | Section headings |
| text-4xl | 32px | Section headings |
| text-9 | 35px | General use |
| text-10 | 67px | General use |
| text-11 | 128px | General use |
| text-12 | 133px | General use |
| text-13 | 222px | General use |

**Weight scale:** 400 · 500 · 600 · 700 · 800 · 900
**Line heights:** 23.76px · 79.776px · 60.48px · 28.8px · 15.84px · 17.28px · 21.6px · 22px · 11.52px · 14.4px · 12px · 31.4928px · 119.664px · 0px · 115.2px · 199.44px

### Spacing

**Base unit:** 4px

`space-1: 1px` · `space-2: 2px` · `space-3: 3px` · `space-4: 5px` · `space-5: 6px` · `space-6: 10px` · `space-7: 12px` · `space-8: 13px` · `space-9: 14px` · `space-10: 16px` · `space-11: 18px` · `space-12: 19px` · `space-13: 24px` · `space-14: 30px` · `space-15: 32px` · `space-16: 40px` · `space-17: 44px` · `space-18: 48px` · `space-19: 50px` · `space-20: 58px` · `space-21: 64px`

### Shapes

**Border radius:** `radius-sm: 10px` · `radius-md: 12px` · `radius-lg: 15px` · `radius-xl: 20px` · `radius-full: 24px` · `radius-6: 100px` · `radius-7: 500px 500px 80px 80px` · `radius-full: 10000px`

### Elevation

_None detected._

### Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-fast:** `0.1s ease-out`
- **duration-base:** `background-color 0.3s, opacity 0.3s`
- **duration-base:** `border-color 0.3s, box-shadow 0.3s`
- **duration-slow:** `0.4s cubic-bezier(0.28, 0.71, 0, 0.98)`
- **duration-slow:** `0.5s cubic-bezier(0.28, 0.71, 0, 0.98)`
- **duration-slow:** `color 0.6s cubic-bezier(0.28, 0.71, 0, 0.98)`
- **duration-slow:** `0.6s cubic-bezier(0.28, 0.71, 0, 0.98)`
- **duration-slow:** `0.8s cubic-bezier(0.28, 0.71, 0, 0.98)`
- **duration-slow:** `1s cubic-bezier(0.28, 0.71, 0, 0.98)`
- **duration-slow:** `transform 3s ease-out, color 0.1s ease-out`
- **duration-slow:** `15s cubic-bezier(0.28, 0.71, 0, 0.98) infinite changingImages`
- **duration-slow:** `34s linear infinite reverse MarqueeScroll`

## Component Inventory

- **Buttons:** 42 detected
- **Links:** 87 detected
- **Inputs:** 35 detected
- **Navigation:** 1 elements
- **Lists:** 5 detected
- **Forms:** 30 detected
- **Images:** 127 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (10px, 12px, 15px, 20px, 24px, 100px, 500px 500px 80px 80px, 10000px).
- Do not stack more than one primary CTA per viewport.
- Do not use red for non-error UI — reserve it for destructive actions and warnings.
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Persuasive, benefit-driven, trustworthy. Active voice, urgency without pressure.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
