# [Project Name] Brand Guidelines

**Status**: 🔄 Draft | ✅ Active  
**Last Updated**: YYYY-MM-DD  
**Version**: 1.0  
**Extends**: docs/design/principles.md

> Copy this template to `docs/design/brand.md` and customize for each project

---

## Brand Overview

### Mission
[Client's mission statement or project purpose]

### Brand Personality
**Adjectives**: [Choose 3-5: Professional, Approachable, Innovative, Bold, Minimal, Playful, Trustworthy, etc.]

**Tone**: [Describe how the brand communicates]

**Audience**: [Who this brand serves - be specific]

---

## Visual Identity

### Color Palette

> Implements principles.md "Color" section (Default Strictness: 🟡 MEDIUM)  
> **Project Strictness Override**: [Adjust if needed, explain why]

#### Primary Colors

```css
/* Primary Brand Color */
--color-primary: #1A73E8;
```
- **Usage**: CTAs, primary actions, links, brand moments
- **Strictness**: 🔴 HIGH (exact hex only) | 🟡 MEDIUM (can use scale)
- **Accessibility**: [Contrast ratio with white/black text]
- **Source**: [Where this came from - client, brand audit, stakeholder]

```css
/* Secondary Brand Color */
--color-secondary: #34A853;
```
- **Usage**: Success states, positive actions, secondary CTAs
- **Strictness**: 🟡 MEDIUM
- **Accessibility**: [Contrast ratio]

```css
/* Accent Color */
--color-accent: #FBBC04;
```
- **Usage**: Highlights, badges, notifications (use sparingly)
- **Strictness**: 🟡 MEDIUM
- **Accessibility**: [Contrast ratio]

#### Color Scales (Generated)

> Generate using tools like: coolors.co, adobe color, or manually

**Primary Scale**:
```css
--color-primary-50:  #E8F0FE;   /* Lightest */
--color-primary-100: #C4DDFF;
--color-primary-200: #A0CAFF;
--color-primary-300: #7BAAF9;
--color-primary-400: #558AE8;
--color-primary-500: #1A73E8;   /* Base - from above */
--color-primary-600: #1557B8;
--color-primary-700: #0F3D88;
--color-primary-800: #0A2858;
--color-primary-900: #051328;   /* Darkest */
```

**Note**: Repeat for secondary and accent if needed

#### Semantic Colors
```css
--color-success: #34A853;  /* Or reference secondary */
--color-warning: #FBBC04;  /* Or reference accent */
--color-error:   #EA4335;  /* Dedicated error color */
--color-info:    #1A73E8;  /* Or reference primary */
```

#### Neutral Palette
```css
--color-black:   #000000;  /* Pure black (sparingly) */
--color-gray-900: #202124; /* Headings, body text */
--color-gray-700: #5F6368; /* Secondary text */
--color-gray-500: #80868B; /* Placeholder text */
--color-gray-300: #DADCE0; /* Borders, dividers */
--color-gray-100: #F1F3F4; /* Backgrounds, subtle fills */
--color-white:   #FFFFFF;  /* Pure white */
```

**Strictness**: 🔴 HIGH - Use these exact values for consistency

---

### Typography

> Implements principles.md "Typography" section (Strictness: 🔴 HIGH)

#### Font Stack

```css
/* Primary Font Family */
--font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Monospace Font (if needed) */
--font-mono: "Fira Code", "Courier New", Consolas, monospace;
```

**Licensing**: [Google Fonts / Adobe Fonts / Custom / Confirm license status]

**Fallbacks**: System fonts ensure text displays even if custom font fails

**Strictness**: 🔴 HIGH - Only use fonts from approved stack

#### Type Scale

> Base size: 16px | Scale ratio: [1.25 / 1.333 / custom]

```css
--text-xs:   12px; /* Line height: 16px (1.333) */
--text-sm:   14px; /* Line height: 20px (1.429) */
--text-base: 16px; /* Line height: 24px (1.5) */
--text-lg:   18px; /* Line height: 28px (1.556) */
--text-xl:   20px; /* Line height: 28px (1.4) */
--text-2xl:  24px; /* Line height: 32px (1.333) */
--text-3xl:  30px; /* Line height: 36px (1.2) */
--text-4xl:  36px; /* Line height: 40px (1.111) */
--text-5xl:  48px; /* Line height: 48px (1) */
--text-6xl:  60px; /* Line height: 60px (1) - Optional */
```

**Strictness**: 🔴 HIGH - Only use sizes from this scale

#### Font Weights

```css
--weight-normal:   400; /* Body text, default */
--weight-medium:   500; /* Subheadings, UI elements */
--weight-semibold: 600; /* Headings, emphasis */
--weight-bold:     700; /* Primary CTAs, strong emphasis */
```

**Usage Guidelines**:
- **Headings**: Semibold (600) or Bold (700)
- **Body Text**: Normal (400)
- **UI Elements**: Medium (500)
- **Emphasis**: Semibold (600)

**Strictness**: 🔴 HIGH - Only use these four weights

---

### Spacing System

> Implements principles.md "Spacing" section (Strictness: 🔴 HIGH)

#### Base Unit: 8px

**Philosophy**: All spacing should be multiples of 8px for consistent rhythm

#### Spacing Scale

```css
--space-0:  0px;   /* No space */
--space-1:  8px;   /* 1x - Tiny */
--space-2:  16px;  /* 2x - Small */
--space-3:  24px;  /* 3x - Medium */
--space-4:  32px;  /* 4x - Large */
--space-5:  40px;  /* 5x - XL */
--space-6:  48px;  /* 6x - 2XL */
--space-8:  64px;  /* 8x - 3XL */
--space-10: 80px;  /* 10x - 4XL */
--space-12: 96px;  /* 12x - 5XL */
--space-16: 128px; /* 16x - 6XL */
--space-20: 160px; /* 20x - 7XL */
```

**Common Uses**:
- Component padding: 2x-4x (16-32px)
- Element margins: 2x-3x (16-24px)
- Section spacing: 8x-12x (64-96px)
- Button padding: 1.5x horizontal, 3x vertical (12px 24px)

**Strictness**: 🔴 HIGH - Only use multiples of 8px

---

### Layout System

> Implements principles.md "Layout & Hierarchy" section

#### Grid System

**Columns**: 12-column grid  
**Desktop Gutter**: 24px (3x base unit)  
**Mobile Gutter**: 16px (2x base unit)  
**Max Container Width**: 1200px

#### Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile landscape / Small tablet */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape / Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large desktop (optional) */
```

**Mobile-First Approach**: Design for mobile first, enhance for larger screens

**Strictness**: 🔴 HIGH - Use these breakpoints consistently

---

### Elevation & Depth

#### Shadow System

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

**Usage**:
- Cards at rest: `--shadow-md`
- Cards on hover: `--shadow-lg`
- Modals/Dialogs: `--shadow-xl`
- Dropdowns: `--shadow-lg`

#### Border Radius

```css
--radius-none: 0px;
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-2xl:  24px;
--radius-full: 9999px; /* Pills, circular avatars */
```

**Common Uses**:
- Buttons: `--radius-md` (8px)
- Inputs: `--radius-md` (8px)
- Cards: `--radius-lg` (12px)
- Modals: `--radius-xl` (16px)

---

## Components

> Implements principles.md "Components" section (Strictness: 🟡 MEDIUM)

### Buttons

#### Primary Button
```css
background: var(--color-primary);
color: #FFFFFF;
padding: 12px 24px; /* 1.5x, 3x base unit */
border-radius: var(--radius-md);
font-weight: var(--weight-medium);
font-size: var(--text-base);

/* States */
hover: darken(--color-primary, 10%);
active: darken(--color-primary, 15%);
disabled: opacity 50%;
focus: outline 3px solid primary with offset;
```

#### Secondary Button
```css
background: transparent;
border: 2px solid var(--color-primary);
color: var(--color-primary);
/* Same padding, radius as primary */

hover: background var(--color-primary-50);
```

#### Text Button (Tertiary)
```css
background: transparent;
border: none;
color: var(--color-primary);
padding: 8px 16px;

hover: background var(--color-gray-100);
```

### Input Fields

```css
height: 44px; /* Meets accessibility minimum touch target */
padding: 12px 16px; /* 1.5x, 2x base unit */
border: 2px solid var(--color-gray-300);
border-radius: var(--radius-md);
font-size: var(--text-base);

/* States */
focus: border-color var(--color-primary), box-shadow;
error: border-color var(--color-error);
disabled: background var(--color-gray-100), opacity 60%;
```

### Cards

```css
background: var(--color-white);
padding: var(--space-3); /* 24px */
border-radius: var(--radius-lg);
box-shadow: var(--shadow-md);

/* Interactive Cards */
hover: box-shadow var(--shadow-lg), translate Y -2px;
transition: all 200ms ease;
```

**Add more components as needed**: Modals, Dropdowns, Tabs, etc.

---

## Tone & Voice

> Implements principles.md "Content" section (Strictness: 🟢 LOW - Flexible)

### Brand Voice

**Core Characteristics**: [Professional, Approachable, Clear, Helpful, etc.]

**Writing Style**:
- Use active voice
- Address users as "you"
- Keep sentences concise (aim for <20 words)
- Avoid jargon unless audience-appropriate
- Be specific with numbers and facts
- Use contractions for warmth (we're, you'll, etc.)

### Tone by Context

**Marketing/Sales**: Confident, aspirational, benefit-focused  
**Product/UI**: Clear, helpful, action-oriented  
**Support/Help**: Empathetic, patient, solution-focused  
**Errors**: Apologetic but constructive, provide next steps  
**Success**: Positive, encouraging, celebratory  
**Legal/Privacy**: Formal but readable, transparent

### Voice Examples

**Good Examples**:
- "Get started in 2 minutes" (specific, benefit-driven)
- "We'll email you a confirmation" (active, clear)
- "Something went wrong. Let's try that again." (empathetic, actionable)

**Bad Examples**:
- "Utilize our platform" (use "use" instead)
- "An error has occurred" (passive, unhelpful)
- "Optimized synergistic solutions" (jargon)

---

## Logo Usage

### Logo Variations

**Primary Logo**: Full color version (default)  
**Logo on Dark**: White or light version for dark backgrounds  
**Logo Mark**: Icon-only version for small spaces (< 100px)  
**Monochrome**: Single color version for special uses

### Clear Space

**Minimum Clear Space**: Logo height on all sides (top, bottom, left, right)

**Visual**: [Ideally show diagram]

### Minimum Sizes

**Digital**: 32px height minimum  
**Print**: 0.5 inch height minimum

### Usage Guidelines

✅ **Do's**:
- Use on simple, uncluttered backgrounds
- Maintain clear space
- Use approved variations only
- Scale proportionally

❌ **Don'ts**:
- Don't rotate or skew
- Don't change colors
- Don't add effects (shadows, gradients, outlines)
- Don't place on busy backgrounds
- Don't stretch or distort

---

## Imagery

> Guidelines for photos, illustrations, icons

### Photography

**Style**: [Natural, Professional, Candid, Staged, etc.]  
**Mood**: [Bright, Energetic, Calm, Professional, etc.]  
**Subject Matter**: [People, Products, Lifestyle, Abstract, etc.]

**Guidelines**:
- Diverse representation
- Natural lighting preferred
- True-to-life colors
- Rule of thirds composition
- Adequate negative space

### Illustrations

**Style**: [Geometric, Hand-drawn, Minimal, Detailed, etc.]  
**Color Treatment**: Use brand colors only  
**Complexity**: [Simple, Moderate, Detailed]  
**Use Cases**: [Onboarding, Empty states, Marketing, etc.]

### Icons

**Style**: [Outlined, Filled, Duotone, etc.]  
**Base Size**: 24px (3x base unit)  
**Stroke Weight**: 2px  
**Source**: [Heroicons, Feather Icons, Lucide, Custom, etc.]

**Guidelines**:
- Use consistent style across all icons
- Maintain optical balance
- Ensure clarity at small sizes

---

## Motion & Animation

> Implements principles.md "Interaction" section (Strictness: 🟢 LOW)

### Animation Principles

**Purpose-Driven**: Every animation serves a function  
**Subtle**: Enhance, don't distract  
**Performant**: GPU-accelerated properties only (transform, opacity)

### Timing

```css
--duration-instant: 100ms;  /* Immediate feedback */
--duration-fast:    200ms;  /* UI transitions */
--duration-normal:  300ms;  /* Standard animations */
--duration-slow:    500ms;  /* Emphasized animations */

--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
```

### Common Animations

**Button Hover**: Color transition 200ms  
**Focus**: Border/shadow transition 200ms  
**Page Transition**: Fade 300ms  
**Modal Enter**: Scale + fade 300ms  
**Toast Notification**: Slide + fade 300ms

### Accessibility

**Critical**: Respect `prefers-reduced-motion` preference

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## White-Label Support

> Include this section if project supports multiple brands

### Configurable Elements

All brand-specific elements should be configurable via design tokens:

```json
{
  "brandColors": {
    "primary": "#1A73E8",
    "secondary": "#34A853",
    "accent": "#FBBC04"
  },
  "typography": {
    "fontFamily": "Inter",
    "fontFamilyUrl": "https://fonts.google.com/specimen/Inter"
  },
  "logo": {
    "light": "/logos/brand-logo.svg",
    "dark": "/logos/brand-logo-dark.svg",
    "mark": "/logos/brand-mark.svg"
  },
  "theme": {
    "borderRadius": "8px",
    "shadowStyle": "subtle"
  }
}
```

### Implementation Requirements

**For Developers**:
- All colors must use CSS variables (no hardcoded hex values)
- Logo must be loaded from config/theme
- Typography must support font swapping
- No hardcoded brand-specific text in components
- Test with at least 2 different brand configurations

---

## Resources

### Design Files

**Figma**: [Link to Figma file]  
**Sketch**: [Link to Sketch file]  
**Adobe XD**: [Link to XD file]

### Asset Library

**Logos**: `docs/assets/logos/`  
**Icons**: `docs/assets/icons/`  
**Illustrations**: `docs/assets/illustrations/`

### Code Resources

**Design Tokens**: `docs/assets/design-tokens.json`  
**CSS Variables**: `src/styles/variables.css`  
**Component Library**: `src/components/`

---

## Governance

### Update Process

1. Propose change in design review meeting
2. Document rationale for change
3. Update this file with new version number
4. Update design tokens and code
5. Communicate changes to team
6. Update component library if needed

### Approval Authority

**Minor Updates** (color values, spacing tweaks): Design lead  
**Major Changes** (new colors, typography): Stakeholder approval required

### Questions?

**Design Lead**: [Name/Email]  
**Stakeholder**: [Name/Email]

---

## Agent Usage Notes

### For Brand Guardian
- Enforce 🔴 HIGH strictness items automatically
- Flag 🟡 MEDIUM items for human review
- Check white-label compliance

### For Creative Director
- Reference brand personality for strategic decisions
- Use tone/voice for content strategy
- Can propose justified departures from 🟡/🟢 items

### For Art Director
- Use component specs as baseline
- Apply creative expertise within defined bounds
- Document aesthetic decisions

### For UI Analyzer
- Validate against color palette, spacing, typography
- Test component consistency per specs
- Performance checks per animation guidelines

### For Accessibility Champion
- Validate color contrast
- Ensure touch targets meet minimums
- Verify motion respects reduced-motion preference

---

*This brand.md extends docs/design/principles.md with project-specific guidelines.*  
*Last Updated: [Date]*  
*Version: 1.0*

---

## Template Usage Instructions

**When starting a new project**:

1. Copy this file to `docs/design/brand.md`
2. Replace all `[placeholders]` with actual values
3. Delete sections that don't apply
4. Add sections for project-specific needs
5. If you have existing brand materials, run Brand Auditor agent first
6. Review and approve with stakeholder
7. Update version and last-updated date

**Strictness Level Guide**:
- 🔴 **HIGH**: No deviations without stakeholder approval
- 🟡 **MEDIUM**: Creative interpretation allowed with documentation
- 🟢 **LOW**: Flexible, project-specific decisions welcome
