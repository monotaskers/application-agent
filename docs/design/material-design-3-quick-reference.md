# Material Design 3 Quick Reference
## Cheat Sheet for Claude Code Development

A condensed reference guide for quick lookups during development.

---

## Core Values

### Colors (Light Mode Default)
```
Primary: #6750A4
On Primary: #FFFFFF
Primary Container: #EADDFF
On Primary Container: #21005D

Secondary: #625B71
On Secondary: #FFFFFF

Tertiary: #7D5260
On Tertiary: #FFFFFF

Surface: #FFFBFE
On Surface: #1C1B1F

Background: #FFFBFE
On Background: #1C1B1F

Error: #B3261E
On Error: #FFFFFF
```

### Typography Scale
```
Display Large:    57px / 64px line-height / 400 weight
Headline Large:   32px / 40px / 400
Title Large:      22px / 28px / 400
Body Large:       16px / 24px / 400
Body Medium:      14px / 20px / 400
Label Large:      14px / 20px / 500
Label Medium:     12px / 16px / 500
```

### Shape (Corner Radius)
```
None:         0px
Extra Small:  4px
Small:        8px
Medium:       12px
Large:        16px
Extra Large:  28px
Full:         9999px (pill shape)
```

### Spacing Scale (4dp base)
```
0:  0px
1:  4px
2:  8px
3:  12px
4:  16px
5:  20px
6:  24px
8:  32px
10: 40px
12: 48px
```

### Elevation Levels
```
Level 0: No shadow (flat)
Level 1: Raised (cards)
Level 2: Floating (FABs at rest)
Level 3: Dialogs, pickers
Level 4: Modal sheets
Level 5: Top-level modals
```

---

## Component Quick Guide

### Button Sizes
```
Height: 40px
Padding: 10px 24px (horizontal)
Corner Radius: Full (pill shape)
Typography: Label Large
```

### Icon Button
```
Size: 48x48px (minimum touch target)
Icon Size: 24x24px
Corner Radius: Full
```

### FAB
```
Regular: 56x56px
Small: 40x40px
Large: 96x96px
Extended: 56px height, variable width
Corner Radius: Large (16px)
Elevation: Level 3
```

### Card
```
Corner Radius: Medium (12px)
Padding: 16px
Elevation: Level 1 (elevated variant)
Border: 1px outline (outlined variant)
```

### Text Fields
```
Height: 56px (filled), 56px (outlined)
Corner Radius: 4px top (filled), 4px all (outlined)
Label: Body Large
Typography: Body Large
```

### Navigation Bar (Mobile)
```
Height: 80px
Items: 3-5 destinations
Active Indicator: 64x32px pill
Typography: Label Medium
```

### Navigation Rail (Tablet)
```
Width: 80px
Items: 3-7 destinations + optional FAB
Spacing: 12px between items
```

### Top App Bar
```
Small: 64px height
Medium: 112px height
Large: 152px height
```

---

## Token Usage Patterns

### CSS Variables
```css
/* Color */
color: var(--md-sys-color-primary);
background-color: var(--md-sys-color-surface);

/* Typography */
font-family: var(--md-sys-typescale-body-large-font);
font-size: var(--md-sys-typescale-body-large-size);
line-height: var(--md-sys-typescale-body-large-line-height);

/* Shape */
border-radius: var(--md-sys-shape-corner-medium);

/* Spacing */
padding: var(--md-sys-spacing-4);
gap: var(--md-sys-spacing-2);

/* Elevation */
box-shadow: var(--md-sys-elevation-1);
```

---

## Animation Values

### Easing Functions
```css
Standard: cubic-bezier(0.2, 0, 0, 1)
Emphasized: cubic-bezier(0.2, 0, 0, 1)
Decelerated: cubic-bezier(0, 0, 0, 1)
Accelerated: cubic-bezier(0.3, 0, 1, 1)
```

### Duration
```
Short1:   50ms   - Tiny movements
Short2:   100ms  - Icon transitions
Short3:   150ms  - Small components
Short4:   200ms  - Standard interactions
Medium1:  250ms  
Medium2:  300ms  - Most transitions
Medium3:  350ms
Medium4:  400ms  - Page transitions
Long1:    450ms
Long2:    500ms  - Complex animations
```

---

## Accessibility Quick Checks

### WCAG AA Requirements
```
Normal text:     4.5:1 contrast ratio
Large text:      3:0:1 contrast ratio
UI components:   3:0:1 contrast ratio
```

### Touch Targets
```
Minimum size: 48x48dp
Recommended spacing: 8dp between targets
```

### Focus States
```
Outline: 2px solid primary color
Outline offset: 2px
```

### ARIA Essentials
```html
<!-- Button with icon -->
<button aria-label="Descriptive action">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Loading state -->
<div role="status" aria-live="polite">
  <span class="sr-only">Loading...</span>
</div>

<!-- Toggle -->
<button aria-pressed="true">Favorite</button>

<!-- Expandable -->
<button aria-expanded="false" aria-controls="menu-1">
  Menu
</button>
```

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 599px) {
  /* 4 column grid */
  /* Bottom navigation */
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1239px) {
  /* 8 column grid */
  /* Navigation rail */
}

/* Desktop */
@media (min-width: 1240px) {
  /* 12 column grid */
  /* Navigation drawer */
}

/* Large Desktop */
@media (min-width: 1600px) {
  /* Max width container */
}
```

---

## Color Pairing Rules

### Always Use Together
```
primary → on-primary
surface → on-surface
background → on-background
error → on-error
primary-container → on-primary-container
secondary-container → on-secondary-container
tertiary-container → on-tertiary-container
```

### State Layer Opacity
```
Hover:    8% of on-surface
Focus:    12% of on-surface
Pressed:  12% of on-surface
Dragged:  16% of on-surface
```

---

## Common Patterns

### Button with Icon
```html
<button class="md-button md-button--filled">
  <svg class="md-button__icon">...</svg>
  <span>Label</span>
</button>
```

### Card with Actions
```html
<div class="md-card">
  <img class="md-card__media" src="...">
  <div class="md-card__content">
    <h3 class="md-card__title">Title</h3>
    <p class="md-card__text">Description</p>
  </div>
  <div class="md-card__actions">
    <button class="md-button md-button--text">Action</button>
  </div>
</div>
```

### List Item
```html
<div class="md-list-item">
  <svg class="md-list-item__icon">...</svg>
  <div class="md-list-item__content">
    <div class="md-list-item__headline">Title</div>
    <div class="md-list-item__supporting">Supporting text</div>
  </div>
  <button class="md-icon-button">...</button>
</div>
```

### Dialog
```html
<dialog class="md-dialog">
  <div class="md-dialog__content">
    <h2 class="md-dialog__headline">Title</h2>
    <p class="md-dialog__text">Content</p>
  </div>
  <div class="md-dialog__actions">
    <button class="md-button md-button--text">Cancel</button>
    <button class="md-button md-button--filled">Confirm</button>
  </div>
</dialog>
```

---

## CSS Reset Essentials

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  color: var(--md-sys-color-on-background);
  background-color: var(--md-sys-color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: inherit;
  cursor: pointer;
}

img,
svg {
  display: block;
  max-width: 100%;
}
```

---

## Theme Toggle Implementation

```javascript
// Quick theme switcher
function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  document.documentElement.setAttribute('data-theme', next);
}
```

---

## Common Mistakes to Avoid

❌ **Don't:**
- Hardcode color values
- Use px for everything (use relative units)
- Ignore dark mode
- Skip accessibility attributes
- Use ALL CAPS for buttons
- Ignore touch target sizes
- Mix M2 and M3 patterns
- Forget elevation on interactive elements

✅ **Do:**
- Use design tokens everywhere
- Build mobile-first
- Test in both themes
- Include ARIA labels
- Use sentence case
- Ensure 48dp touch targets
- Stay consistent with M3
- Apply appropriate elevation

---

## Quick Start Checklist

### Setup
- [ ] Install/import M3 library
- [ ] Set up design tokens
- [ ] Configure theme provider
- [ ] Add font imports (Roboto)
- [ ] Set up CSS reset

### Development
- [ ] Use semantic HTML
- [ ] Apply token-based styling
- [ ] Implement responsive layouts
- [ ] Add keyboard navigation
- [ ] Test touch interactions
- [ ] Verify color contrast

### Testing
- [ ] Cross-browser check
- [ ] Mobile device test
- [ ] Dark mode verification
- [ ] Accessibility audit
- [ ] Performance check

---

## Useful Resources Links

**Official:**
- m3.material.io
- m3.material.io/theme-builder
- m3.material.io/components

**Tools:**
- Material Theme Builder (Figma)
- Material 3 Design Kit (Figma)
- Chrome DevTools (Accessibility Panel)

**Libraries:**
- @mui/material (React)
- @angular/material (Angular)
- androidx.compose.material3 (Android)
- Flutter Material 3

---

## Token Naming Convention

```
--md-[type]-[role]-[variant]-[state]

Examples:
--md-sys-color-primary
--md-sys-typescale-body-large-size
--md-comp-button-filled-container-color
--md-comp-button-filled-hover-state-layer-opacity
```

---

## Pro Tips

1. **Always design for dark mode from the start** - It's harder to retrofit
2. **Use the 8dp spacing grid** - Maintains visual rhythm
3. **Leverage state layers** - Better than manual hover/focus states
4. **Trust the tonal palette** - M3's color system is scientifically designed
5. **Test on real devices** - Simulators don't catch everything
6. **Document custom tokens** - Future you will thank you
7. **Use semantic color names** - Not colors (e.g., 'primary' not 'purple')
8. **Build a component library** - Reuse across projects

---

**Keep this reference handy while developing with Claude Code!**
