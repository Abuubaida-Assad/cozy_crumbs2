# Bernice Bakery

## Overview

**Product:** Bernice Bakery
**URL:** https://bernicebakery.com/
**Surface type:** e-commerce
**Audience:** Consumers and shoppers
**Brand character:** Product-focused shopping experience with a rich, diverse color palette and 4 typefaces.

### Design Principles

- Trust signals first — credibility reduces friction more than clever copy.
- Clear path to action — one primary CTA per view, never stacked.
- Speed over polish — perceived performance is part of the design system.

## Colors

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

## Typography

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

## Spacing

**Base unit:** 4px

`space-1: 1px` · `space-2: 2px` · `space-3: 3px` · `space-4: 5px` · `space-5: 6px` · `space-6: 10px` · `space-7: 12px` · `space-8: 13px` · `space-9: 14px` · `space-10: 16px` · `space-11: 18px` · `space-12: 19px` · `space-13: 24px` · `space-14: 30px` · `space-15: 32px` · `space-16: 40px` · `space-17: 44px` · `space-18: 48px` · `space-19: 50px` · `space-20: 58px` · `space-21: 64px`

## Shapes

**Border radius:** `radius-sm: 10px` · `radius-md: 12px` · `radius-lg: 15px` · `radius-xl: 20px` · `radius-full: 24px` · `radius-6: 100px` · `radius-7: 500px 500px 80px 80px` · `radius-full: 10000px`

## Elevation

_None detected._

## Motion

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

## Components

- **Buttons:** 42 detected
- **Links:** 87 detected
- **Inputs:** 35 detected
- **Navigation:** 1 elements
- **Lists:** 5 detected
- **Forms:** 30 detected
- **Images:** 127 detected

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values — agents and developers should use `color.text.primary`, not `#171717`.
- Define all interactive states: default, hover, focus-visible, active, disabled.
- Use the spacing scale for all padding, margin, and gap values.
- Write content in sentence case. Reserve ALL CAPS for acronyms only.
- Test every component at the smallest and largest breakpoint before shipping.

### Don't

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (10px, 12px, 15px, 20px, 24px, 100px, 500px 500px 80px 80px, 10000px).
- Do not stack more than one primary CTA per viewport.
- Do not use red for non-error UI — reserve it for destructive actions and warnings.
- Do not ship components without defining hover, focus-visible, and disabled states.

## Writing Tone

Persuasive, benefit-driven, trustworthy. Active voice, urgency without pressure.

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.
2. **Map tokens** — list every color, spacing, typography, and radius token the component uses. No raw values.
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty.
5. **Describe interactions** — keyboard, pointer, and touch behavior, including edge cases (long content, overflow, truncation).
6. **Add accessibility criteria** — write testable pass/fail checks (e.g. "focus ring must be visible at 3:1 contrast").
7. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.
8. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.
2. Tokens and foundations — all referenced tokens from the tables above.
3. Anatomy and variants — named parts, variant matrix, responsive behavior.
4. States and interactions — full state table, keyboard/pointer/touch behavior.
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.
6. Content guidelines — copy length, tone, capitalisation, placeholder text rules.
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above — no hardcoded hex, px, or font values.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Specify responsive behavior at the smallest and largest supported breakpoint.
- Handle edge cases: empty state, overflow / truncation, maximum content length.
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).
- Document ARIA roles, labels, and live-region behavior where relevant.
- Include known page component density: - **Buttons:** 42 detected
- **Links:** 87 detected
- **Inputs:** 35 detected
- **Navigation:** 1 elements
- **Lists:** 5 detected
- **Forms:** 30 detected
- **Images:** 127 detected

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).
- All states documented and visually verified (hover, focus, disabled, loading, error, empty).
- All visual values use design tokens — zero hardcoded values.
- Keyboard navigation works without a pointer.
- No critical accessibility violations (contrast, ARIA, focus order).
- Tested at smallest and largest breakpoint.
- Anti-patterns section lists at least one concrete misuse example.
- Documentation covers purpose, usage, props/API, and limitations.
