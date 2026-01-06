# Theme Controls & Customization Guide

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Version**: 1.1  
**Related**: [`brand.md`](./brand.md), [`design-principles.md`](./design-principles.md)

> Comprehensive guide to understanding and adjusting themes in the application.

---

## Overview

The application uses a **dual-layer theme system**:

1. **Light/Dark Mode** - Handled by `next-themes` (system preference or manual toggle)
2. **Color Variants** - Handled by `ActiveThemeProvider` (default, blue, green, amber, mono)

These layers work independently and can be combined (e.g., "Blue theme in dark mode").

---

## Theme System Architecture

```
┌─────────────────────────────────────┐
│   User Interaction                 │
│  - ThemeSelector (color variants)  │
│  - ModeToggle (light/dark)         │
│  - Keyboard shortcuts              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Theme Context                     │
│  - ActiveThemeProvider               │
│  - useThemeConfig() hook            │
│  - Cookie persistence               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   CSS Application                   │
│  - body.classList.add('theme-*')    │
│  - next-themes adds 'dark' class    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   CSS Variables                     │
│  - globals.css (base tokens)        │
│  - theme.css (variant overrides)    │
│  - Tailwind utilities consume vars  │
└─────────────────────────────────────┘
```

---

## Theme Control Locations

### User-Facing Controls

#### 1. Theme Selector Component
**Location**: `src/components/theme-selector.tsx`

Dropdown component that allows users to switch between color variants:

- **Default Themes**: Default, Purple, Blue, Green, Amber, Warm, Cool, Vibrant
- **Scaled Themes**: Default-scaled, Blue-scaled (responsive scaling for desktop)
- **Monospaced Theme**: Mono-scaled (monospace font, no rounded corners, no shadows)

**Usage**: Import and use `<ThemeSelector />` in any component.

#### 2. Mode Toggle Component
**Location**: `src/components/layout/ThemeToggle/theme-toggle.tsx`

Button component that toggles between light and dark modes:

- Uses view transitions for smooth theme switching
- Respects system preference by default
- Persists choice via `next-themes`

**Usage**: Import and use `<ModeToggle />` in navigation/header components.

#### 3. Keyboard Shortcuts
**Location**: `src/components/kbar/use-theme-switching.tsx`

Keyboard commands available via the command palette:

- `t` + `t` - Toggle light/dark mode
- "Set Light Theme" - Force light mode
- "Set Dark Theme" - Force dark mode

---

## Configuration Files

### 1. Base Colors & Tokens
**File**: `src/app/globals.css`

Defines all base CSS variables using OKLCH color space for perceptual uniformity:

```css
:root {
  /* Brand Colors */
  --color-brand-primary: oklch(0.55 0.23 280); /* IRIS #4B4DED */
  --color-brand-secondary: oklch(0.65 0.15 29.23); /* ORANGE #FF7300 */
  --color-brand-accent: oklch(0.88 0.06 185); /* ROBIN'S EGG #ABE6E0 */
  
  /* Semantic Tokens - Default theme uses brand colors */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: var(--color-brand-primary);
  --secondary: var(--color-brand-secondary);
  --accent: var(--color-brand-accent);
  /* ... more tokens */
}

.dark {
  /* Dark mode overrides */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... more dark mode tokens */
}
```

**Key Variables**:
- `--color-brand-*` - Brand colors (used by default theme)
- `--primary`, `--secondary`, `--accent` - Semantic color tokens
- `--background`, `--foreground` - Base UI colors
- `--border`, `--input`, `--ring` - Interactive element colors
- `--chart-1` through `--chart-5` - Chart color palette
- `--sidebar-*` - Sidebar-specific colors

### 2. Theme Variants
**File**: `src/app/theme.css`

Defines color variant classes that override the `--primary` color:

```css
.theme-default,
.theme-default-scaled {
  --primary: var(--color-brand-primary);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: var(--color-brand-secondary);
  --secondary-foreground: oklch(0.985 0 0);
  --accent: var(--color-brand-accent);
  --accent-foreground: oklch(0.145 0 0);
  
  @variant dark {
    --primary: oklch(0.60 0.23 280);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.70 0.15 29.23);
    --secondary-foreground: oklch(0.985 0 0);
    --accent: oklch(0.90 0.06 185);
    --accent-foreground: oklch(0.985 0 0);
  }
}

.theme-blue,
.theme-blue-scaled {
  --primary: var(--color-blue-600);
  --primary-foreground: var(--color-blue-50);
  /* ... */
}
```

**Available Themes**:
- `.theme-default` - Uses all three brand colors (IRIS primary, ORANGE secondary, ROBIN'S EGG accent)
- `.theme-purple` - Purple color scheme (uses brand primary/IRIS)
- `.theme-blue` - Blue color scheme
- `.theme-green` - Green/Lime color scheme
- `.theme-amber` - Amber color scheme
- `.theme-warm` - Warm color scheme (oranges, reds, yellows) - **NEW**
- `.theme-cool` - Cool color scheme (blues, teals, cyans) - **NEW**
- `.theme-vibrant` - Vibrant color scheme (high saturation colors) - **NEW**
- `.theme-mono` - Monospace font, neutral colors, no rounded corners

**Scaled Variants**:
- `.theme-scaled` - Responsive scaling for desktop (>1024px)
  - Smaller border radius
  - Reduced text sizes
  - Tighter spacing

### 3. Theme Context Provider
**File**: `src/components/active-theme.tsx`

Manages active theme state and applies theme classes:

- **State Management**: React Context API
- **Persistence**: Cookie-based (`active_theme` cookie)
- **Application**: Adds `theme-{variant}` class to `<body>` element
- **Hook**: `useThemeConfig()` for accessing theme state

**Default Theme**: `"default"`

---

## Easiest Ways to Adjust Themes

### Quick Adjustments

#### 1. Change Brand Colors (Affects Default Theme)
**File**: `src/app/globals.css` (lines 13-15)

```css
:root {
  /* Modify these OKLCH values */
  --color-brand-primary: oklch(0.55 0.23 280); /* IRIS #4B4DED */
  --color-brand-secondary: oklch(0.65 0.15 29.23); /* ORANGE #FF7300 */
  --color-brand-accent: oklch(0.88 0.06 185); /* ROBIN'S EGG #ABE6E0 */
}
```

**Impact**: Changes the default theme's primary, secondary, and accent colors throughout the app.

**OKLCH Format**: `oklch(lightness chroma hue)`
- **Lightness**: 0-1 (0 = black, 1 = white)
- **Chroma**: 0-0.4 (0 = grayscale, higher = more saturated)
- **Hue**: 0-360 (color wheel position)

#### 2. Adjust Existing Theme Variant Colors
**File**: `src/app/theme.css`

```css
.theme-blue,
.theme-blue-scaled {
  --primary: var(--color-blue-600); /* Change to any Tailwind color */
  --primary-foreground: var(--color-blue-50);
  
  @variant dark {
    --primary: var(--color-blue-500);
    --primary-foreground: var(--color-blue-50);
  }
}
```

**Available Tailwind Colors**: `blue`, `green`, `lime`, `amber`, `purple`, `red`, `pink`, `indigo`, `cyan`, `teal`, `orange`, `yellow`, `neutral`, `slate`, `stone`, `zinc`, `gray`

**Scales**: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`

#### 3. Add a New Theme Variant

**Step 1**: Add CSS in `src/app/theme.css`

```css
.theme-purple,
.theme-purple-scaled {
  --primary: var(--color-purple-600);
  --primary-foreground: var(--color-purple-50);
  
  @variant dark {
    --primary: var(--color-purple-500);
    --primary-foreground: var(--color-purple-50);
  }
}
```

**Step 2**: Add to selector in `src/components/theme-selector.tsx`

```typescript
const DEFAULT_THEMES = [
  // ... existing themes
  {
    name: "Purple",
    value: "purple",
  },
];

// If you want a scaled version:
const SCALED_THEMES = [
  // ... existing themes
  {
    name: "Purple",
    value: "purple-scaled",
  },
];
```

**Step 3**: Test in both light and dark modes!

#### 4. Adjust Dark Mode Colors
**File**: `src/app/globals.css` - Modify the `.dark` selector

```css
.dark {
  --background: oklch(0.145 0 0); /* Make darker/lighter */
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  /* ... other dark mode overrides */
}
```

**Tip**: Use OKLCH for better perceptual uniformity. Lower lightness values = darker colors.

#### 5. Change Base Semantic Colors
**File**: `src/app/globals.css` - Modify `:root` variables

```css
:root {
  --primary: var(--color-brand-primary); /* Default uses brand primary */
  --secondary: var(--color-brand-secondary); /* Default uses brand secondary */
  --destructive: oklch(0.577 0.245 27.325); /* Change error color */
  --accent: var(--color-brand-accent); /* Default uses brand accent */
  /* ... etc */
}
```

**Impact**: Affects all themes unless overridden by theme variants. Default theme uses brand colors.

---

### Advanced Adjustments

#### 6. Modify Scaled Theme Behavior
**File**: `src/app/theme.css` - Adjust `.theme-scaled`

```css
.theme-scaled {
  @media (min-width: 1024px) {
    --radius: 0.6rem; /* Change border radius */
    --text-lg: 1.05rem; /* Change text sizes */
    --text-base: 0.85rem;
    --text-sm: 0.8rem;
    --spacing: 0.222222rem; /* Change spacing scale */
  }
  
  /* Component-specific overrides */
  [data-slot="card"] {
    --spacing: 0.16rem;
  }
}
```

**Use Case**: Create a more compact UI for desktop users or data-dense interfaces.

#### 7. Customize Mono Theme
**File**: `src/app/theme.css` - Modify `.theme-mono`

```css
.theme-mono,
.theme-mono-scaled {
  --font-sans: var(--font-mono); /* Monospace font */
  --primary: var(--color-neutral-600);
  --primary-foreground: var(--color-neutral-50);
  
  /* Remove rounded corners */
  .rounded-xs, .rounded-sm, .rounded-md, .rounded-lg, .rounded-xl {
    @apply !rounded-none;
  }
  
  /* Remove shadows */
  .shadow-xs, .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl {
    @apply !shadow-none;
  }
  
  /* Add more customizations as needed */
}
```

**Use Case**: Terminal-like aesthetic, code-focused interfaces, or minimalist design.

---

## Quick Reference Table

| What to Change | File | Lines | Impact |
|----------------|------|-------|--------|
| **Brand colors** | `src/app/globals.css` | 13-15 | Default theme primary, secondary, accent colors |
| **Dark mode colors** | `src/app/globals.css` | 50-87 | All themes in dark mode |
| **Theme variant colors** | `src/app/theme.css` | 29-107 | Specific theme variants |
| **Add new theme** | `src/app/theme.css` + `src/components/theme-selector.tsx` | - | New color option |
| **Base semantic tokens** | `src/app/globals.css` | 17-48 | All themes (unless overridden) |
| **Scaled theme behavior** | `src/app/theme.css` | 10-27 | Desktop scaling adjustments |
| **Mono theme styling** | `src/app/theme.css` | 75-107 | Monospace theme appearance |

---

## Theme Persistence

Themes are persisted via cookies:

- **Cookie Name**: `active_theme`
- **Lifetime**: 1 year (`max-age=31536000`)
- **Scope**: Site-wide (`path=/`)
- **Security**: `SameSite=Lax`, `Secure` in HTTPS

**Location**: `src/components/active-theme.tsx` (line 15-18)

---

## Best Practices

### 1. Use OKLCH for Colors
OKLCH provides perceptual uniformity - colors with the same lightness appear equally bright to the human eye.

**Conversion Tools**:
- [OKLCH Color Picker](https://oklch.com/)
- [Color.js](https://colorjs.io/apps/convert/) - Convert hex/RGB to OKLCH

### 2. Test in Both Modes
Always test theme changes in:
- ✅ Light mode
- ✅ Dark mode
- ✅ All theme variants (default, blue, green, amber, mono)

### 3. Check Contrast
Ensure sufficient contrast for accessibility:

- **Text on Background**: WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- **Interactive Elements**: WCAG AA minimum (3:1)
- **Primary Actions**: WCAG AA minimum (4.5:1)

**Contrast Calculation Rules (OKLCH)**:
- **Light backgrounds** (L > 0.6): Use dark foreground (L: 0.145 or darker)
- **Medium backgrounds** (0.4 < L < 0.6): Use white foreground (L: 0.985) for better contrast
- **Dark backgrounds** (L < 0.4): Use light foreground (L: 0.985)
- **Minimum lightness difference**: 40% (0.4) for WCAG AA compliance

**Example**:
```css
/* Primary: IRIS (L: 0.55) - Medium dark, use white foreground for WCAG AA (diff: 0.435) */
--primary: oklch(0.55 0.23 280);
--primary-foreground: oklch(0.985 0 0);
```

**Tools**:
- [OddContrast](https://www.oddcontrast.com/) - OKLCH-aware contrast checker
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser DevTools accessibility panel

### 4. Maintain Consistency
- Use semantic tokens (`--primary`, `--secondary`) instead of direct colors
- Reference brand colors via `--color-brand-*` variables
- Keep dark mode adjustments proportional to light mode

### 5. Document Custom Themes
If adding a new theme variant:
- Add to `theme-selector.tsx`
- Document in this file
- Update any relevant design system documentation

---

## View Transitions

The app uses CSS View Transitions API for smooth theme switching:

**Location**: `src/components/layout/ThemeToggle/theme-toggle.tsx`

**Features**:
- Smooth cross-fade between themes
- Origin-based reveal animation (from click point)
- Fallback for browsers without View Transitions support

**CSS**: `src/app/globals.css` (lines 136-169)

---

## Troubleshooting

### Theme Not Applying

1. **Check cookie**: Verify `active_theme` cookie is set
2. **Check body class**: Inspect `<body>` element for `theme-{variant}` class
3. **Check dark class**: Verify `.dark` class is present on `<html>` for dark mode
4. **Clear cache**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Colors Not Updating

1. **CSS specificity**: Ensure theme variant CSS has correct specificity
2. **Variable references**: Verify CSS variables are correctly referenced
3. **Tailwind cache**: Clear Tailwind cache: `rm -rf .next`
4. **Browser cache**: Clear browser cache and hard refresh

### Theme Persistence Issues

1. **Cookie settings**: Check browser cookie settings
2. **HTTPS requirement**: `Secure` flag requires HTTPS in production
3. **SameSite policy**: Verify `SameSite=Lax` is appropriate for your use case

---

## Related Documentation

- **Brand Guidelines**: [`brand.md`](./brand.md) - Brand colors and identity
- **Design Principles**: [`design-principles.md`](./design-principles.md) - Design standards
- **Design System Rules**: `.cursor/rules/design_system_rules.mdc` - Technical implementation details

---

## Code Locations Summary

| Component/File | Purpose | Location |
|----------------|---------|----------|
| `ThemeSelector` | Color variant dropdown | `src/components/theme-selector.tsx` |
| `ModeToggle` | Light/dark toggle button | `src/components/layout/ThemeToggle/theme-toggle.tsx` |
| `ActiveThemeProvider` | Theme context provider | `src/components/active-theme.tsx` |
| `useThemeConfig` | Theme state hook | `src/components/active-theme.tsx` |
| Base CSS variables | Color tokens | `src/app/globals.css` |
| Theme variants | Color variant overrides | `src/app/theme.css` |
| Theme provider | next-themes integration | `src/components/layout/ThemeToggle/theme-provider.tsx` |
| Keyboard shortcuts | Theme switching commands | `src/components/kbar/use-theme-switching.tsx` |

---

**Last Updated**: 2025-01-27  
**Version**: 1.1  
**Maintained By**: Design System Team

## Recent Updates (v1.1)

- ✅ **Brand Colors Refactored**: Default theme now uses all three brand colors (IRIS primary, ORANGE secondary, ROBIN'S EGG accent)
- ✅ **New Preset Themes**: Added three new themes (Warm, Cool, Vibrant) with distinct color palettes
- ✅ **Dark Mode Support**: All brand colors and new themes have proper dark mode variants
- ✅ **Brand Color Definitions**: Fixed brand color definitions (ORANGE as secondary, ROBIN'S EGG as accent)
