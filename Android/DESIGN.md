---
name: Kinetic Obsidian
colors:
  surface: '#111316'
  surface-dim: '#111316'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#bdf4ff'
  on-secondary: '#00363d'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#ffffff'
  on-tertiary: '#670020'
  tertiary-container: '#ffd9dc'
  on-tertiary-container: '#c90046'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#ffb2ba'
  on-tertiary-fixed: '#400011'
  on-tertiary-fixed-variant: '#910030'
  background: '#111316'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-md:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-compact: 0.5rem
  margin: 1rem
  margin-expanded: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for high-performance fitness telemetry, routine sequencing, and body progression analytics. Rooted in an athletic, high-focus dark aesthetic, the interface removes cognitive friction while lifting heavy or sustaining anaerobic effort. 

The aesthetic leverages Modern Material 3 (Material You) paradigms tuned for extreme contrast and rapid glanceability:
- **Tone & Mood:** Purposeful, surgical, energizing, and resilient.
- **Design Metaphor:** Precision athletic instrument meets modern tactical HUD. Surfaces evoke milled matte graphite and deep basalt slabs, pierced by electric kinetic accents that communicate state transitions, target heart rates, and completed sets.
- **Visual Balance:** Restraint over decoration. High contrast legibility under direct sunlight or dim gym floors, pairing rich dark values with vibrant bio-kinetic hues.

## Colors

The palette balances absolute clarity with biological energy:
- **Primary (`#CCFF00` - Electric Lime):** Denotes primary action calls, live rep counters, completed milestones, and critical timers. It carries explosive optical energy on dark grounds without degrading legibility.
- **Secondary (`#00E5FF` - Cyan Surge):** Anchors secondary tracking layers, volume metrics, and pace intervals.
- **Tertiary (`#FF3366` - Crimson Threshold):** Designates peak heart rate zones, RPE failure thresholds, delete/cancel actions, and strain warnings.
- **Neutral Palette (`#121417` - Obsidian Base):** Stratified into tonal container levels to preserve depth in dark mode:
  - `surface-container-lowest`: `#0A0C0E` (Canvas background)
  - `surface-container-low`: `#121417` (List items, grouped background sections)
  - `surface-container`: `#1A1D23` (Standard cards, unselected metrics)
  - `surface-container-high`: `#232730` (Active workout row, elevated modal sheets)
  - `surface-container-highest`: `#2D323E` (Dividers, borders, subtle interactive pills)
- **Content Tokens:**
  - `on-surface`: `#F1F3F5` (High-emphasis metric values, set counts, titles)
  - `on-surface-variant`: `#9CA3AF` (Units of measurement: kg, lbs, reps, timestamps)
  - `outline-variant`: `#262B35` (Hairline structural borders for component framing)

## Typography

The type scale fuses the technical edge of Space Grotesk for metrics and section headlines with the neutral clarity of Inter for structural data grids, labels, and workout instructions.

- **Numerics & Readouts:** Tabular numbers (`font-variant-numeric: tabular-nums`) must be enforced on all timer displays, weight inputs, and rep tallies to eliminate layout wobble during active intervals.
- **Hierarchy Rules:**
  - `display-lg` and `display-md`: Reserved strictly for live workout elapsed time, primary rest timer countdowns, and PR (Personal Record) celebration moments.
  - `headline-lg` / `headline-md`: Dedicated to screen-level views and exercise titles (e.g., "Barbell Deadlift").
  - `label-sm` (all caps): Applied to telemetry meta-tags (e.g., `TARGET RPE`, `REST`, `TEMPO`).

## Layout & Spacing

A mobile-first fluid layout built on an 8dp vertical grid system, supplemented by a 4dp baseline subgrid for fine component alignment:

- **Screen Margins:** Standard mobile screens adopt `16dp` (`1rem`) horizontal margins. Workouts executed in dynamic motion leverage edge-to-edge execution cards with tight inner paddings.
- **Gutters & Gaps:** Column layouts for split metrics (e.g., Weight vs Reps vs RPE) deploy `8dp` (`0.5rem`) gutters to maintain cohesive visual grouping while avoiding mis-taps.
- **Touch Ergonomics:** All interactive zones (set check-boxes, stepper handles, timer adjustments) strictly adhere to a minimum physical touch target of `48dp x 48dp`, even when visual boundaries are smaller.
- **Reflow Behavior:** On foldable devices or tablets in landscape, exercise execution views split cleanly: workout log hierarchy on the left 60%, real-time biological telemetry charts pinned to the right 40%.

## Elevation & Depth

To avoid murky, desaturated shadows in dark UI, depth is communicated through tonal layer progression coupled with calibrated ambient borders:

- **Level 0 (Surface Base):** Pure `#0A0C0E`. Zero elevation. Houses backdrop layout containers.
- **Level 1 (Card & Section):** `#1A1D23` with a 1px border of `rgba(255, 255, 255, 0.06)`. Used for non-active workout cards, historical sessions, and stat widgets.
- **Level 2 (Active/Current Focus):** `#232730` with a subtle top highlight (`rgba(255, 255, 255, 0.12)`) and an electric edge accent: `rgba(204, 255, 0, 0.15)`. Indicates the current working set.
- **Level 3 (Floating Controls & Bottom Sheets):** `#2D323E` with an extra-diffused drop shadow: `0px 12px 32px -4px rgba(0, 0, 0, 0.60)`. Houses quick-action rest bars and bottom navigation modals.

## Shapes

The shape hierarchy follows Material 3 rounded geometry, emphasizing athletic ergonomics:
- **Small (8dp - `space-sm` * 2):** Inputs, metric badges, telemetry tags, and table row containers.
- **Medium (16dp - `space-md`):** Routine cards, set execution containers, chart panels, and modal action dialogs.
- **Large (24dp - `space-lg`):** Main bottom sheets, hero tracker containers, and dashboard summaries.
- **Full / Pill (`rounded-full`):** Floating action buttons (FAB), set complete toggles, and filter chips.

## Components

### Buttons
- **Primary Kinetic Action:** Container background `#CCFF00`, typography `label-lg` in `#0A0C0E` (Heavy black contrast). Pill-shaped (`rounded-full`), height `52dp`. Used for "Start Workout", "Finish Routine", and "Log Set".
- **Secondary Tone:** Container `#232730`, text `#F1F3F5`, border 1px `rgba(255, 255, 255, 0.08)`. Used for "Add Exercise" and "Adjust Rest".
- **Ghost/Tertiary:** No background fill, text `#9CA3AF`, hover/press state `#1A1D23`. Used for "Dismiss" or "Skip Rest".

### Chips & Tags
- **Filter Chips:** Height `32dp`, corner radius `8dp`. Unselected: `#1A1D23` with `#9CA3AF` text. Selected: `#232730` with `#CCFF00` text and 1px border `#CCFF00`.
- **RPE / Zone Tags:** Compact `20dp` height badges with high-contrast indicator dots (`#FF3366` for failure sets, `#00E5FF` for warmups).

### Cards
- **Exercise Execution Card:** Corner radius `16dp`, background `#1A1D23`, stroke 1px `rgba(255, 255, 255, 0.06)`. Interior layout organizes set rows into tabular columns: Set Number, Previous Weight, Target Weight, Reps, and Check Action.
- **Active Set Highlight:** The active row within an exercise card adopts a tinted background of `rgba(204, 255, 0, 0.08)` with a 2px left border accent of `#CCFF00`.

### Inputs & Number Steppers
- Input fields use `#121417` inner fill with sharp 8dp radius. Numbers are centered, rendered in `Space Grotesk` `headline-sm`. Focus state triggers a glowing outline `1.5px solid #CCFF00`.

### Selection Controls
- **Set Completion Checkbox:** A specialized circular checkbox (`36dp x 36dp`). Default state: hollow circle with 2px stroke of `#2D323E`. Completed state: fully filled with `#CCFF00`, displaying a sharp black checkmark icon.

### Metrics & Charts
- **Volume & Heart Rate Graphs:** Background transparent. Grid lines `#1A1D23`. Sparklines rendered in `#00E5FF` with a translucent vertical gradient drop (`rgba(0, 229, 255, 0.15)` fading to zero). Peak values marked with `#CCFF00` circular datum nodes.