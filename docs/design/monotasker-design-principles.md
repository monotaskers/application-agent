# Design Principles Document
*Inspired by Material Design 3 - Crafted for Monotasker*

---

## 🎯 Executive Summary

This document establishes Monotasker's design principles, drawing inspiration from Google's Material Design 3 (M3) philosophy while adapting it for our unique position as AI strategy consultants. These principles guide both our internal design efforts and inform the design systems we create for client projects.

**Core Philosophy**: Design should enable *Intentional Orchestration* - creating interfaces that are personal, adaptive, and machine-readable, just like our strategic deliverables.

---

## 🏗️ Foundation Principles

### 1. **Adaptive Personalization**
*Inspired by M3's Dynamic Color & Material You*

Every design should adapt to its context - whether that's a user's preference, a client's brand, or an AI's requirements.

**Implementation**:
- Use dynamic theming that responds to user/brand preferences
- Create flexible component systems that maintain consistency while allowing customization
- Design with "machine-readability" in mind - structures that both humans and AI can parse

**For Monotasker**: Our purple gradient foundation can shift hue/saturation based on client brand colors
**For Clients**: Build their brand system to be both visually distinctive and programmatically accessible

### 2. **Expressive Simplicity**
*Inspired by M3's Bold, Graphic, Intentional principle*

Complexity should be orchestrated, not eliminated. Make sophisticated systems feel simple.

**Implementation**:
- Use generous white space to create focus
- Employ bold typography for hierarchy
- Create clear visual paths through information
- Hide complexity progressively (show more on demand)

**For Monotasker**: Clean interfaces that reveal depth when needed (like our service tiers)
**For Clients**: Dashboard designs that surface insights without overwhelming

### 3. **Meaningful Motion**
*Inspired by M3's Motion Provides Meaning*

Every animation should have purpose - guiding attention, providing feedback, or expressing personality.

**Motion Principles**:
- **Informative**: Show relationships and transformations
- **Focused**: Direct attention to what matters
- **Expressive**: Reflect brand personality through timing and easing

**Standard Timing**:
```css
/* Quick actions (100-200ms) */
--motion-quick: 150ms cubic-bezier(0.4, 0.0, 0.2, 1);

/* Standard transitions (200-300ms) */
--motion-standard: 250ms cubic-bezier(0.4, 0.0, 0.2, 1);

/* Complex animations (300-400ms) */
--motion-complex: 350ms cubic-bezier(0.4, 0.0, 0.6, 1);

/* Expressive moments (400-500ms) */
--motion-expressive: 450ms cubic-bezier(0.4, 0.0, 0.2, 1);
```

### 4. **Accessible Excellence**
*Inspired by M3's Inclusive Design principles*

Accessibility isn't a feature - it's fundamental. Every design decision should enhance usability for all.

**Requirements**:
- WCAG 2.1 AA compliance minimum
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Touch targets: minimum 44x44px
- Focus indicators: visible and high contrast
- Screen reader optimization: semantic HTML, ARIA labels

**Testing Checklist**:
- [ ] Keyboard navigation complete
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Touch targets measured
- [ ] Focus states defined

---

## 🎨 Visual Language

### Color System

#### HCT Color Space
Following M3's approach, we use Hue, Chroma, and Tone for flexible color manipulation:

**Primary Brand Colors**:
```javascript
// Monotasker Purple System (HCT values)
const monotaskerColors = {
  source: { h: 271, c: 68, t: 50 },  // Primary purple
  
  // Tonal Palette (varying tone, consistent hue/chroma)
  tones: {
    100: { h: 271, c: 68, t: 100 }, // White
    95:  { h: 271, c: 68, t: 95 },  // Lightest purple
    90:  { h: 271, c: 68, t: 90 },
    80:  { h: 271, c: 68, t: 80 },
    70:  { h: 271, c: 68, t: 70 },
    60:  { h: 271, c: 68, t: 60 },
    50:  { h: 271, c: 68, t: 50 },  // Base
    40:  { h: 271, c: 68, t: 40 },
    30:  { h: 271, c: 68, t: 30 },
    20:  { h: 271, c: 68, t: 20 },
    10:  { h: 271, c: 68, t: 10 },
    0:   { h: 271, c: 68, t: 0 }    // Black
  }
}
```

#### Semantic Color Roles
```css
:root {
  /* Primary - Main brand actions */
  --md-sys-color-primary: #8B5CF6;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #E9DDFF;
  --md-sys-color-on-primary-container: #21005D;
  
  /* Secondary - Supporting actions */
  --md-sys-color-secondary: #F59E0B;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #FFE4B8;
  --md-sys-color-on-secondary-container: #2A1800;
  
  /* Tertiary - Contrast accents */
  --md-sys-color-tertiary: #7C2D75;
  --md-sys-color-on-tertiary: #FFFFFF;
  
  /* Error - System feedback */
  --md-sys-color-error: #BA1A1A;
  --md-sys-color-on-error: #FFFFFF;
  
  /* Surfaces & Backgrounds */
  --md-sys-color-surface: #FAFAFA;
  --md-sys-color-on-surface: #1C1B1F;
  --md-sys-color-surface-variant: #E7E0EC;
  --md-sys-color-on-surface-variant: #49454F;
  
  /* Outlines */
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #CAC4D0;
}
```

### Typography Scale

Based on M3's type scale with Monotasker adjustments:

```css
/* Display - Largest text for hero sections */
.display-large {
  font-size: 57px;
  line-height: 64px;
  letter-spacing: -0.25px;
  font-weight: 400;
}

.display-medium {
  font-size: 45px;
  line-height: 52px;
  letter-spacing: 0;
  font-weight: 400;
}

.display-small {
  font-size: 36px;
  line-height: 44px;
  letter-spacing: 0;
  font-weight: 400;
}

/* Headlines - Section headers */
.headline-large {
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0;
  font-weight: 500;
}

.headline-medium {
  font-size: 28px;
  line-height: 36px;
  letter-spacing: 0;
  font-weight: 500;
}

.headline-small {
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0;
  font-weight: 500;
}

/* Titles - Component headers */
.title-large {
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 0;
  font-weight: 600;
}

.title-medium {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  font-weight: 600;
}

.title-small {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  font-weight: 600;
}

/* Body - Main content */
.body-large {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  font-weight: 400;
}

.body-medium {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  font-weight: 400;
}

.body-small {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  font-weight: 400;
}

/* Labels - UI elements */
.label-large {
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  font-weight: 500;
}

.label-medium {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.label-small {
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.5px;
  font-weight: 500;
}
```

### Elevation System

M3's elevation creates hierarchy through layering:

```css
/* Elevation Levels */
.elevation-0 { /* Flat surface */
  box-shadow: none;
}

.elevation-1 { /* Raised surface */
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
              0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}

.elevation-2 { /* Elevated component */
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
              0px 2px 6px 2px rgba(0, 0, 0, 0.15);
}

.elevation-3 { /* Floating action */
  box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15),
              0px 1px 3px rgba(0, 0, 0, 0.3);
}

.elevation-4 { /* Modal/Dialog */
  box-shadow: 0px 6px 10px 4px rgba(0, 0, 0, 0.15),
              0px 2px 3px rgba(0, 0, 0, 0.3);
}

.elevation-5 { /* Top-level overlay */
  box-shadow: 0px 8px 12px 6px rgba(0, 0, 0, 0.15),
              0px 4px 4px rgba(0, 0, 0, 0.3);
}
```

### Shape System

Rounded corners create approachability:

```css
/* Shape Scale */
--shape-none: 0px;
--shape-extra-small: 4px;
--shape-small: 8px;
--shape-medium: 12px;
--shape-large: 16px;
--shape-extra-large: 28px;
--shape-full: 9999px;

/* Component Applications */
.button { border-radius: var(--shape-medium); }
.card { border-radius: var(--shape-large); }
.chip { border-radius: var(--shape-small); }
.dialog { border-radius: var(--shape-extra-large); }
.avatar { border-radius: var(--shape-full); }
```

---

## 🧩 Component Architecture

### Component Principles

1. **State-Driven Design**: Components respond to user interaction states
2. **Compositional**: Build complex UIs from simple, reusable parts
3. **Token-Based**: Use design tokens for consistency
4. **Accessible by Default**: ARIA attributes built-in

### Core Components

#### Buttons
```typescript
interface ButtonProps {
  variant: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size: 'small' | 'medium' | 'large';
  state: 'enabled' | 'disabled' | 'hovered' | 'focused' | 'pressed';
  icon?: 'leading' | 'trailing' | 'only';
}

// Example implementation
<Button 
  variant="filled"
  size="medium"
  icon="trailing"
  aria-label="Start your AI journey"
>
  Get Prelude Report
  <IconArrowRight />
</Button>
```

#### Cards
```typescript
interface CardProps {
  variant: 'elevated' | 'filled' | 'outlined';
  interactive?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

// Service tier card example
<Card variant="elevated" interactive>
  <CardMedia src="/harmony-visual.jpg" alt="Harmony service" />
  <CardContent>
    <Typography variant="headline-small">Harmony</Typography>
    <Typography variant="body-medium">
      3-month engagement with PRPs and workflows
    </Typography>
  </CardContent>
  <CardActions>
    <Button variant="tonal">Learn More</Button>
  </CardActions>
</Card>
```

#### Navigation
```typescript
interface NavigationProps {
  type: 'rail' | 'drawer' | 'bottom' | 'top';
  adaptive: boolean; // Changes based on screen size
}
```

---

## 📐 Layout System

### Responsive Grid

Based on M3's column system:

```css
/* Breakpoints */
--breakpoint-compact: 0-599px;      /* 4 columns */
--breakpoint-medium: 600-904px;     /* 8 columns */
--breakpoint-expanded: 905-1239px;  /* 12 columns */
--breakpoint-large: 1240-1439px;    /* 12 columns */
--breakpoint-extra-large: 1440px+;  /* 12 columns */

/* Margins */
--margin-compact: 16px;
--margin-medium: 32px;
--margin-expanded: 32px;
--margin-large: 200px;
--margin-extra-large: 200px;

/* Gutters */
--gutter-compact: 16px;
--gutter-medium: 16px;
--gutter-expanded: 24px;
--gutter-large: 24px;
--gutter-extra-large: 24px;
```

### Layout Patterns

#### Hero Layout
```css
.hero-section {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter-expanded);
  padding: 80px var(--margin-expanded);
}

.hero-content {
  grid-column: span 7;
}

.hero-visual {
  grid-column: span 5;
}
```

#### Dashboard Layout
```css
.dashboard {
  display: grid;
  grid-template-areas:
    "nav header"
    "nav main";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
}
```

---

## 🛠️ Implementation Tools

### Design Tools

#### Figma Resources
1. **Material 3 Design Kit**: Base components and styles
2. **Material Theme Builder Plugin**: Generate custom themes
3. **Tokens Studio**: Manage design tokens
4. **Figma Variables**: Dynamic theming

#### Development Libraries

**React/Next.js**:
```bash
# Material UI (React implementation)
npm install @mui/material @emotion/react @emotion/styled

# Alternative: Tailwind with M3 preset
npm install tailwindcss @material-tailwind/react
```

**CSS Framework**:
```css
/* Import Material 3 Web Components */
@import 'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css';
```

**Color Generation**:
```javascript
// Use Material Color Utilities
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

const theme = themeFromSourceColor(argbFromHex('#8B5CF6'));
```

### Token Management

```json
// design-tokens.json
{
  "color": {
    "primary": {
      "value": "#8B5CF6",
      "type": "color",
      "description": "Monotasker primary purple"
    }
  },
  "typography": {
    "headline": {
      "large": {
        "fontSize": { "value": "32px" },
        "lineHeight": { "value": "40px" },
        "fontWeight": { "value": "500" }
      }
    }
  },
  "spacing": {
    "xs": { "value": "4px" },
    "sm": { "value": "8px" },
    "md": { "value": "16px" },
    "lg": { "value": "24px" },
    "xl": { "value": "32px" }
  }
}
```

---

## 🎯 Client Adaptation Framework

### Discovery Phase
1. **Brand Analysis**: Extract existing brand colors, typography, voice
2. **User Research**: Understand target audience emotional needs
3. **Technical Audit**: Assess current tech stack and constraints

### Design System Creation

#### Step 1: Generate Color Scheme
```javascript
// Client brand color to M3 palette
function generateClientTheme(brandColor) {
  const sourceColor = argbFromHex(brandColor);
  const theme = themeFromSourceColor(sourceColor);
  
  return {
    primary: theme.palettes.primary,
    secondary: theme.palettes.secondary,
    tertiary: theme.palettes.tertiary,
    neutral: theme.palettes.neutral,
    error: theme.palettes.error
  };
}
```

#### Step 2: Customize Typography
- Map brand fonts to M3 scale
- Maintain readability standards
- Ensure web font performance

#### Step 3: Define Motion Language
- Match brand personality (playful, professional, innovative)
- Set consistent timing functions
- Create signature transitions

#### Step 4: Component Customization
- Adapt shape system to brand
- Adjust elevation for depth preference
- Customize interaction states

### Deliverable Templates

#### PRP-Ready Design System
```yaml
design_system:
  name: "ClientName Design System"
  version: "1.0.0"
  
  tokens:
    colors: {...}
    typography: {...}
    spacing: {...}
    elevation: {...}
    motion: {...}
  
  components:
    - name: "Button"
      variants: ["primary", "secondary", "ghost"]
      states: ["default", "hover", "active", "disabled"]
      accessibility:
        role: "button"
        aria_label: required
        keyboard_navigation: true
  
  documentation:
    figma_url: "..."
    storybook_url: "..."
    guidelines_url: "..."
```

---

## 📊 Quality Metrics

### Design Quality Checklist

#### Visual Consistency
- [ ] All colors from defined palette
- [ ] Typography follows scale
- [ ] Spacing uses 8px grid
- [ ] Elevation is purposeful

#### Usability
- [ ] Touch targets ≥ 44px
- [ ] Text contrast ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] Error states clear

#### Performance
- [ ] Animations under 400ms
- [ ] Images optimized
- [ ] Fonts subset and preloaded
- [ ] CSS < 50KB

#### Brand Expression
- [ ] Reflects brand personality
- [ ] Unique within constraints
- [ ] Emotionally appropriate
- [ ] Professionally executed

---

## 🔄 Evolution & Maintenance

### Versioning Strategy
- **Major**: Breaking visual changes
- **Minor**: New components/patterns
- **Patch**: Bug fixes, small adjustments

### Update Cycle
- Quarterly review of design system
- Monthly component additions
- Weekly bug fixes
- Daily token updates (automated)

### Feedback Loops
1. User testing insights
2. Analytics data
3. Developer feedback
4. Client satisfaction
5. AI readability metrics

---

## 📚 Resources & References

### Official Material Design 3
- [M3 Guidelines](https://m3.material.io)
- [Material Theme Builder](https://m3.material.io/theme-builder)
- [Material Symbols](https://fonts.google.com/icons)
- [Color Utilities](https://github.com/material-foundation/material-color-utilities)

### Figma Resources
- [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460)
- [Material Theme Builder Plugin](https://www.figma.com/community/plugin/1034969338659738588)

### Development Tools
- [MUI (React)](https://mui.com/material-ui/)
- [Material Web Components](https://github.com/material-components/material-web)
- [Tailwind Material](https://www.material-tailwind.com/)

### Learning Resources
- [Material Design Blog](https://material.io/blog)
- [Google Design](https://design.google)
- [Material Studies](https://material.io/design/material-studies)


*Last Updated: August 30, 2025*  
*Version: 1.0.0*  
*Maintained by: Monotasker Design*

**Remember**: Great design isn't about following rules—it's about understanding principles deeply enough to know when and how to adapt them. We have the foundation in these principles; our creativity and client needs guide the expression.