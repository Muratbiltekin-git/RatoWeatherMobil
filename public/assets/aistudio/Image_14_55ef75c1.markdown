---
name: Aura Weather
colors:
  surface: '#0a122a'
  surface-dim: '#0a122a'
  surface-bright: '#313852'
  surface-container-lowest: '#050d25'
  surface-container-low: '#131a33'
  surface-container: '#171e37'
  surface-container-high: '#212942'
  surface-container-highest: '#2c344d'
  on-surface: '#dbe1ff'
  on-surface-variant: '#bcc9ce'
  inverse-surface: '#dbe1ff'
  inverse-on-surface: '#282f49'
  outline: '#869398'
  outline-variant: '#3d494d'
  surface-tint: '#4cd6fb'
  primary: '#4cd6fb'
  on-primary: '#003642'
  primary-container: '#00b4d8'
  on-primary-container: '#00414f'
  inverse-primary: '#00677d'
  secondary: '#ffb784'
  on-secondary: '#502500'
  secondary-container: '#f47d00'
  on-secondary-container: '#572900'
  tertiary: '#e0b6ff'
  on-tertiary: '#4b007d'
  tertiary-container: '#ca89ff'
  on-tertiary-container: '#5b0094'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b3ebff'
  primary-fixed-dim: '#4cd6fb'
  on-primary-fixed: '#001f27'
  on-primary-fixed-variant: '#004e5f'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#ffb784'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#713700'
  tertiary-fixed: '#f2daff'
  tertiary-fixed-dim: '#e0b6ff'
  on-tertiary-fixed: '#2e004e'
  on-tertiary-fixed-variant: '#6b00af'
  background: '#0a122a'
  on-background: '#dbe1ff'
  surface-variant: '#2c344d'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 96px
    fontWeight: '200'
    lineHeight: 96px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '200'
    lineHeight: 72px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-caps:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system blends **contemporary minimalism** with **atmospheric glassmorphism** to translate fluid meteorological data into immediate, visceral clarity. Crafted for discerning daily users, outdoor enthusiasts, and travelers, the interface evokes the quiet vastness of the troposphere: serene, crystalline, and alive with ambient energy.

The aesthetic philosophy rests on layered atmospheric light rather than synthetic decoration. Deep twilight substrates provide infinite spatial depth, allowing hyper-focused metrics, vibrant thermals, and celestial states to emerge naturally. Dynamic backdrop blurs, luminous rim lighting, and disciplined typography eliminate cognitive friction, transforming raw climate datasets into an elegant ambient narrative.

## Colors

The palette establishes an immersive nocturnal and twilight foundation, engineered natively for dark mode to optimize glanceability across diverse ambient lighting conditions:

- **Primary (`#00B4D8` / `#48CAE4`):** Atmospheric Cyan. Used for core highlights, precipitation indices, active navigation states, barometric indicators, and cooling trends.
- **Secondary (`#F77F00` / `#FCBF49`):** Solar Amber. Deployed for UV warnings, sunrise/sunset horizons, temperature peaks, and high-priority climate notices.
- **Tertiary (`#7209B7` / `#3A0CA3`):** Dusk Violet. Applied to air quality indexes, nocturnal gradients, secondary metric tracking, and radar storm vectors.
- **Neutral (`#0B132B` / `#1C2541`):** Midnight Canvas. The infinite backdrop. All base surfaces, sheet dialogs, and navigation scaffolds descend from these deep twilight pigments.
- **Text & Foreground:** Crisp Absolute White (`#FFFFFF`) commands high-contrast typographic priority, balanced by Sky Silver (`#CBD5E1`) for secondary metrics and muted Slate (`#94A3B8`) for tertiary structural captions.

## Typography

The type scale relies entirely on **Inter** to deliver a surgical, modernist digital instrument feel. Temperature values leverage ultra-light weights (`font-weight: 200`) at scale to maintain structural poise without visual heft. Numerical metrics must always use tabular figures (`font-variant-numeric: tabular-nums`) to ensure zero horizontal jitter during live telemetry updates.

Sub-headers, condition summaries, and cards use semi-bold cuts for effortless scanning against glass substrates. Captions and telemetry tags employ strict letter-spacing expansion (`0.06em` to `0.08em`) and uppercase transformations to structure spatial hierarchy across compact weather pods.

## Layout & Spacing

The layout operates on a disciplined 4px/8px modular base with an adaptable fluid column framework:
- **Mobile (< 768px):** 4-column layout, `1rem` outer margins, `1rem` gutters. Horizontal scrollers break past viewport bounds with bleeding padding to provide infinite hourly timeline exploration.
- **Tablet (768px – 1024px):** 8-column layout, `1.5rem` margins. Cards transition into a balanced 2x2 or 2x3 telemetry dashboard.
- **Desktop (> 1024px):** 12-column fixed-fluid hybrid (maximum container width: 1280px), `2.5rem` margins. The spatial model divides into an anchor panel (current visual sky state & hero thermals) and an analytical matrix (radar maps, weekly progression, and sub-metric glass pods).

Stack vertical spacing uses strict semantic rhythm: `space-xs` (4px) separates sub-labels from values, `space-sm` (8px) separates internal metric groups, and `space-md` (16px) establishes consistent interior module padding.

## Elevation & Depth

Spatial depth is conveyed strictly via **glassmorphic stratification** and **chromatic ambient luminance** rather than conventional opaque shadows. 

1. **Base Layer (L0):** Deep gradient canvas transitioning between `#0B132B` and `#1C2541`, accented with slow, hardware-accelerated ambient color orbs matching dynamic sky conditions.
2. **Glass Tier 1 / Structural Modules (L1):** Standard telemetry cards use background fill `rgba(28, 37, 65, 0.65)` layered with `backdrop-filter: blur(20px)` and a crisp perimeter border of `1px solid rgba(255, 255, 255, 0.12)`.
3. **Glass Tier 2 / Elevated Floating Panels (L2):** Active cards, floating action drawers, and search modals utilize `rgba(28, 37, 65, 0.85)` with `backdrop-filter: blur(32px)`, a `1px solid rgba(255, 255, 255, 0.20)` border highlight, and a diffused ambient colored glow: `0 16px 40px -8px rgba(0, 180, 216, 0.15)`.
4. **Specular Edge Inset:** High-tier interactive cards feature an inner rim specular highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`) replicating the angled bevel of polished glass.

## Shapes

The design system incorporates a unified **Rounded** geometry (Token level `2`):
- Standard cards, interactive pods, and data sheets utilize `0.5rem` (`8px`) to `1rem` (`16px`) corner radiuses for an ergonomic, refined hand-feel.
- Larger spatial modules and full-width containers scale to `rounded-xl` (`1.5rem` / `24px`).
- Filter chips, condition pills, status badges, and slider thumbs explicitly override base parameters to adopt fully continuous pill shapes (`border-radius: 9999px`), ensuring distinction between informational containers and fast-action controls.

## Components

### Buttons & Interactive Controls
- **Primary Action Button:** Gradient background (`#00B4D8` to `#0077B6`), rounded pill geometry, bold white typography, subtle cyan drop glow (`0 4px 14px rgba(0, 180, 216, 0.4)`). Active state scales to `98%` with increased specular border reflection.
- **Glass Secondary Button:** `rgba(255, 255, 255, 0.08)` fill, `1px solid rgba(255, 255, 255, 0.15)`, pure white text, hover state brightening to `rgba(255, 255, 255, 0.14)`.

### Weather Cards & Metric Pods
- Compact 1:1 or 2:1 glassmorphic tiles displaying specific atmospheric dimensions (Humidity, UV Index, Wind Vector, Air Quality).
- Top row houses `label-caps` in `#94A3B8` accompanied by an inline micro-icon; middle row showcases bold metric numerals with tabular alignment; bottom row holds dynamic status indicators or mini gauge bars.

### Chips & Pill Badges
- **Status Pills:** Compact rounded capsules with `rgba(255, 255, 255, 0.06)` fill, `1px solid rgba(255, 255, 255, 0.1)`, housing a pulsating circular status pip (e.g., Solar Amber for UV Warning, Electric Cyan for Rain Approaching).
- **Segmented Unit Toggles (°C / °F):** Dual-pill housing on `rgba(11, 19, 43, 0.6)` track. The active pill snaps with smooth spring kinetics, finished in `rgba(255, 255, 255, 0.16)` with full specular border.

### Forecast Scrollers (Hourly & 10-Day)
- **Hourly Horizontal Ribbon:** Borderless glass lane allowing smooth horizontal panning. Active hour is enclosed in a subtle frosted pill highlights. Displays time, animated iconography, probability percentage in `#48CAE4`, and temperature.
- **Extended Daily List:** Vertical stacked list view featuring weekday label, weather icon, range bar visualizing low-to-high temperature spans with continuous chromatic horizontal gradient fills, and bounded numeric limits.

### Glowing Metric Indicators
- Circular and linear gauges designed with dual-track vector paths: an inactive track (`rgba(255, 255, 255, 0.1)`) and an active glowing gradient path terminal equipped with a radial diffuse flare (`box-shadow: 0 0 12px currentColor`).

### Mobile Navigation Bar
- Floating glass dock positioned with safe-area spacing above the bottom bezel. Constructed with `rgba(11, 19, 43, 0.75)`, `backdrop-filter: blur(24px)`, and `1px solid rgba(255, 255, 255, 0.12)`. Contains streamlined iconography with active states illuminated by soft electric cyan underglow halos.