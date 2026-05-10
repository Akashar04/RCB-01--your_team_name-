---
name: Premium AI Career System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-x-desktop: 40px
  margin-x-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style
This design system is built on a **Modern Corporate** aesthetic refined for the "Premium Startup" sector. It balances the authority of established career services with the agility of high-end AI technology. The style prioritizes clarity over ornamentation, utilizing generous whitespace and a strict mathematical grid to evoke a sense of order and intelligence.

The emotional objective is to move students from anxiety to confidence. By avoiding typical "AI clichés" like glowing purple gradients and robotic motifs, the system positions the technology as a reliable, invisible tool that serves human ambition. The visual language is high-contrast, sharp, and structured, signaling a product that is both sophisticated and easy to navigate.

## Colors
The palette is anchored by "Deep Navy" (#0F172A), used for typography and structural elements to establish immediate trust and professional gravity. "Clean White" (#FFFFFF) serves as the primary canvas, ensuring the interface feels airy and modern.

The "Electric Teal" (#14B8A6) is the sole driver of action. It is reserved strictly for primary CTAs, progress indicators, and success metrics, ensuring high visibility without overwhelming the professional tone. "Subtle Slate" tones are used for hairline borders and secondary text to maintain a soft hierarchy that doesn't distract from the primary content.

## Typography
The system utilizes **Inter** exclusively to maintain a utilitarian yet polished feel. The hierarchy is intentionally dramatic; large display headlines use heavy weights and tighter letter-spacing to command attention, while body text remains spacious and highly legible.

For mobile layouts, headline sizes scale down to prevent excessive line-breaking while maintaining the 700-weight "bold" presence. Utility labels and secondary metadata use a slightly increased letter spacing and medium weights to ensure clarity at small sizes against the deep navy text.

## Layout & Spacing
A strict 8px grid system governs all spatial relationships. The layout follows a **Fixed-Fluid hybrid** approach: content is contained within a 1280px max-width wrapper on desktop, while margins and internal gutters scale fluidly on smaller viewports.

Vertical rhythm is established through "Stack" units—increments of 8px used to separate content blocks. Generous whitespace is a functional requirement here, used to isolate AI-generated insights and prevent cognitive overload for students reviewing complex career data.

## Elevation & Depth
Depth in this design system is achieved through **Ambient Shadows** and **Low-Contrast Outlines**. Rather than aggressive layering, the UI feels like a single, cohesive surface with subtly lifted elements.

1.  **Level 0 (Base):** Pure white background.
2.  **Level 1 (Subtle):** 1px hairline border in Slate-200 (#E2E8F0). Used for input fields and secondary cards.
3.  **Level 2 (Elevated):** A soft, diffused shadow (Y: 4px, Blur: 12px, Opacity: 5% Navy). Used for primary content cards and navigation bars.
4.  **Level 3 (Interactive):** A more pronounced shadow (Y: 8px, Blur: 20px, Opacity: 8% Navy) applied only during hover states to signal interactivity.

## Shapes
The shape language is defined by a consistent 12px to 16px radius, creating a "friendly-professional" geometry.

- **Standard Elements (Buttons, Inputs):** 12px (`rounded-lg`) provides a modern, approachable feel without appearing overly "bubbly."
- **Containers (Cards, Modals):** 16px (`rounded-xl`) creates a clear framing for content.
- **Data Visuals:** Success indicators and small tags may use "Pill" shapes (999px) to contrast against the structured rectangular grid of the layout.

## Components
- **Buttons:** Primary buttons use the Electric Teal background with white text. Hover states shift the background to a darker teal (#0D9488). Secondary buttons use a Navy outline with a subtle 1px border.
- **Cards:** Cards feature a white background, the 1px Slate border, and a "Level 2" shadow. Internal padding should never be less than 24px.
- **Input Fields:** Use a 12px corner radius and a subtle Slate border. On focus, the border transitions to Electric Teal with a soft 2px outer glow in the same color (10% opacity).
- **Chips/Badges:** Small, pill-shaped markers for skills or status. Use a light tint of the Teal (#F0FDFA) with Teal text for "Success" or Slate tints for "Neutral."
- **AI Insight Component:** A specific card variant with a very thin Electric Teal left-border accent (4px) to distinguish AI-generated suggestions from user input or static data.
- **Progress Metrics:** High-contrast circular or bar charts using the Electric Teal against a Slate-100 track to emphasize student growth and achievement.