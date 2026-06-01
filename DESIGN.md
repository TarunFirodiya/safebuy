# SafeBuy Design System

SafeBuy simplifies the property documentation process the same way Atlys
simplifies the visa process. This document is the UX source of truth for the
onboarding flow, benchmarked against Atlys.

## Product metaphor

> A visa application, but for your property paperwork.

A buyer or owner arrives unsure which of 36 services they need. Instead of
asking them to browse a catalogue, we ask a few plain questions, recommend the
right service or bundle, collect documents, take payment, and then give them
certainty about what happens next. Every screen should feel closer to a modern
fintech signup than a government portal.

## Principles (benchmarked from Atlys)

1. **Progressive disclosure.** One decision per screen. Never show a 36-item
   catalogue or a long form before we understand the user's situation.
2. **One primary action per screen.** A single, prominent CTA. Secondary
   actions are quiet (text links or outline buttons).
3. **Jargon-free prompts.** "Check if the title is clean", not "Encumbrance
   Certificate diligence". Translate legal terms into outcomes.
4. **Eligibility and price up front.** Show the recommended service with its
   fixed price and delivery time before asking for any commitment — exactly
   like an Atlys "Eligible for e-Visa" card.
5. **Trust at the moment of payment.** Escrow, fixed-price, and law-firm
   sign-off reassurances sit next to the pay button.
6. **Certainty after submit.** Replace "we'll get back to you" with a live
   status timeline (Started -> Documents -> Review -> In progress -> Delivered).
7. **Guest-first.** Let users start and progress without an account. Collect
   contact details near the end of the funnel, never as a gate at the start.

## Flow

```
/start (quiz)  ->  recommendation  ->  /apply/[id] (wizard)  ->  pay or consult  ->  /track/[token]
```

- `/start` — role -> stage -> goal -> urgency quiz, then an eligibility card.
- `/apply/[id]` — confirm SKU -> property & parties -> contact -> documents ->
  review -> pay or book a consult.
- `/track/[token]` — read-only status timeline for guests.

## Layout

- **Steppers and forms:** single column, `max-width: 32rem` (512px), centred,
  generous vertical rhythm. Mobile-first.
- **Recommendation / eligibility cards:** white card, `--shadow-md`, rounded
  `--radius-lg`. Price in `--font-mono`, delivery time with a clock icon,
  outcome line from the service `result`.
- **Quiz options:** large tappable chips/cards (min height 56px) with an icon,
  label, and one-line helper. Selected state uses `--primary` border + subtle
  `--accent` fill.
- **Status timeline:** vertical, current step highlighted in `--primary`, done
  steps in `--success`, pending in `--text-muted`.
- **Progress indicator:** thin top bar or step dots ("Step 2 of 6") so users
  always know how far they are.

## Color and type

Reuse the existing brand tokens in `app/globals.css` — do not introduce new
palettes.

- Primary: `--primary` (#0a7f86), hover `--primary-dark`.
- Surfaces: `--background`, `--surface`, accent fill `--accent`.
- Semantic: `--success` (done), `--warning` (action required), `--error`
  (rejected document / failed payment).
- Price and step numbers: `--font-mono` (JetBrains Mono).
- Display headings: keep body in `--font-sans` (Plus Jakarta Sans); reserve the
  serif `--font-display` for marketing hero only.

## Motion

Reuse `lib/motion.ts`. Step transitions should be quiet: `fadeInUp` /
`transitions.smooth` when advancing a step. No carousels, no auto-rotation in
the funnel — the user controls the pace.

## Components to add

| Component | Role |
|-----------|------|
| `Stepper` | Shows current step / total in the wizard header |
| `QuizOption` | Large selectable option card used across quiz screens |
| `EligibilityCard` | Recommended service/bundle card with price, delivery, outcome, CTA |
| `DocumentUploadCard` | One card per required document with upload + status |
| `StatusTimeline` | Vertical progress timeline for the tracker |

## Accessibility

- Every quiz option is a real `<button>`; selected state uses `aria-pressed`.
- Wizard steps have a labelled heading and a logical focus order; focus moves to
  the step heading on advance.
- Upload errors and rejected-document states are announced with visible,
  high-contrast error text (not color alone).
- All interactive targets are at least 44px tall on mobile.

## Do / Don't

- **Do** lead buyable services with "Start application" -> pay; offer "Talk to
  an advisor" as the quiet secondary.
- **Do** show the price and delivery time on the recommendation before the
  wizard.
- **Don't** open Calendly as the first action for a buyable service.
- **Don't** show all 36 services before understanding the user's stage.
- **Don't** ask for name/email/phone on the first screen.
