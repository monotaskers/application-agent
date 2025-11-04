# Material Design 3 Implementation Guide
## Practical Examples for Claude Code Development

This companion guide provides practical code examples and templates for implementing Material Design 3 principles in your projects.

---

## Table of Contents
1. [Design Token Implementation](#design-token-implementation)
2. [Component Examples](#component-examples)
3. [Layout Patterns](#layout-patterns)
4. [Theme Configuration](#theme-configuration)
5. [Accessibility Implementations](#accessibility-implementations)
6. [Animation Patterns](#animation-patterns)
7. [Project Starter Templates](#project-starter-templates)

---

## Design Token Implementation

### CSS Custom Properties (Web)

```css
/* tokens.css - Base M3 Design Tokens */

/* ========== Color Tokens ========== */

/* Reference Palette - Light Mode */
:root {
  /* Primary Palette */
  --md-ref-palette-primary0: #000000;
  --md-ref-palette-primary10: #21005D;
  --md-ref-palette-primary20: #381E72;
  --md-ref-palette-primary30: #4F378B;
  --md-ref-palette-primary40: #6750A4;
  --md-ref-palette-primary50: #7F67BE;
  --md-ref-palette-primary60: #9A82DB;
  --md-ref-palette-primary70: #B69DF8;
  --md-ref-palette-primary80: #D0BCFF;
  --md-ref-palette-primary90: #EADDFF;
  --md-ref-palette-primary95: #F6EDFF;
  --md-ref-palette-primary99: #FFFBFE;
  --md-ref-palette-primary100: #FFFFFF;

  /* System Color Tokens */
  --md-sys-color-primary: var(--md-ref-palette-primary40);
  --md-sys-color-on-primary: var(--md-ref-palette-primary100);
  --md-sys-color-primary-container: var(--md-ref-palette-primary90);
  --md-sys-color-on-primary-container: var(--md-ref-palette-primary10);
  
  --md-sys-color-secondary: #625B71;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #E8DEF8;
  --md-sys-color-on-secondary-container: #1D192B;
  
  --md-sys-color-tertiary: #7D5260;
  --md-sys-color-on-tertiary: #FFFFFF;
  --md-sys-color-tertiary-container: #FFD8E4;
  --md-sys-color-on-tertiary-container: #31111D;
  
  --md-sys-color-surface: #FFFBFE;
  --md-sys-color-surface-dim: #DED8E1;
  --md-sys-color-surface-bright: #FFFBFE;
  --md-sys-color-on-surface: #1C1B1F;
  --md-sys-color-on-surface-variant: #49454F;
  
  --md-sys-color-background: #FFFBFE;
  --md-sys-color-on-background: #1C1B1F;
  
  --md-sys-color-error: #B3261E;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #F9DEDC;
  --md-sys-color-on-error-container: #410E0B;
  
  --md-sys-color-outline: #79747E;
  --md-sys-color-outline-variant: #CAC4D0;
  
  /* Surface Containers */
  --md-sys-color-surface-container-lowest: #FFFFFF;
  --md-sys-color-surface-container-low: #F7F2FA;
  --md-sys-color-surface-container: #F3EDF7;
  --md-sys-color-surface-container-high: #ECE6F0;
  --md-sys-color-surface-container-highest: #E6E0E9;
}

/* Dark Mode */
[data-theme="dark"] {
  --md-sys-color-primary: var(--md-ref-palette-primary80);
  --md-sys-color-on-primary: var(--md-ref-palette-primary20);
  --md-sys-color-primary-container: var(--md-ref-palette-primary30);
  --md-sys-color-on-primary-container: var(--md-ref-palette-primary90);
  
  --md-sys-color-surface: #1C1B1F;
  --md-sys-color-on-surface: #E6E1E5;
  --md-sys-color-background: #1C1B1F;
  --md-sys-color-on-background: #E6E1E5;
  
  /* ... other dark mode colors */
}

/* ========== Typography Tokens ========== */

:root {
  /* Display */
  --md-sys-typescale-display-large-font: 'Roboto', sans-serif;
  --md-sys-typescale-display-large-size: 57px;
  --md-sys-typescale-display-large-line-height: 64px;
  --md-sys-typescale-display-large-weight: 400;
  --md-sys-typescale-display-large-tracking: -0.25px;
  
  /* Headline */
  --md-sys-typescale-headline-large-font: 'Roboto', sans-serif;
  --md-sys-typescale-headline-large-size: 32px;
  --md-sys-typescale-headline-large-line-height: 40px;
  --md-sys-typescale-headline-large-weight: 400;
  --md-sys-typescale-headline-large-tracking: 0px;
  
  /* Body */
  --md-sys-typescale-body-large-font: 'Roboto', sans-serif;
  --md-sys-typescale-body-large-size: 16px;
  --md-sys-typescale-body-large-line-height: 24px;
  --md-sys-typescale-body-large-weight: 400;
  --md-sys-typescale-body-large-tracking: 0.5px;
  
  --md-sys-typescale-body-medium-font: 'Roboto', sans-serif;
  --md-sys-typescale-body-medium-size: 14px;
  --md-sys-typescale-body-medium-line-height: 20px;
  --md-sys-typescale-body-medium-weight: 400;
  --md-sys-typescale-body-medium-tracking: 0.25px;
  
  /* Label */
  --md-sys-typescale-label-large-font: 'Roboto', sans-serif;
  --md-sys-typescale-label-large-size: 14px;
  --md-sys-typescale-label-large-line-height: 20px;
  --md-sys-typescale-label-large-weight: 500;
  --md-sys-typescale-label-large-tracking: 0.1px;
}

/* ========== Shape Tokens ========== */

:root {
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 9999px;
}

/* ========== Spacing Tokens ========== */

:root {
  --md-sys-spacing-0: 0px;
  --md-sys-spacing-1: 4px;
  --md-sys-spacing-2: 8px;
  --md-sys-spacing-3: 12px;
  --md-sys-spacing-4: 16px;
  --md-sys-spacing-5: 20px;
  --md-sys-spacing-6: 24px;
  --md-sys-spacing-8: 32px;
  --md-sys-spacing-10: 40px;
  --md-sys-spacing-12: 48px;
}

/* ========== Elevation Tokens ========== */

:root {
  --md-sys-elevation-0: none;
  --md-sys-elevation-1: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-2: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-3: 0px 1px 3px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-4: 0px 2px 3px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-5: 0px 4px 4px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15);
}
```

### JavaScript/JSON Tokens

```json
{
  "color": {
    "primary": {
      "value": "#6750A4",
      "type": "color"
    },
    "on-primary": {
      "value": "#FFFFFF",
      "type": "color"
    }
  },
  "typography": {
    "body": {
      "large": {
        "fontFamily": {
          "value": "Roboto",
          "type": "fontFamily"
        },
        "fontSize": {
          "value": "16px",
          "type": "dimension"
        },
        "lineHeight": {
          "value": "24px",
          "type": "dimension"
        }
      }
    }
  }
}
```

---

## Component Examples

### Button Components (Web)

```css
/* button.css */

.md-button {
  /* Base button styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--md-sys-spacing-2);
  padding: 10px var(--md-sys-spacing-6);
  min-height: 40px;
  border: none;
  border-radius: var(--md-sys-shape-corner-full);
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
  
  /* Typography */
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
  text-transform: none; /* Sentence case */
}

/* Filled Button (Primary) */
.md-button--filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  box-shadow: var(--md-sys-elevation-0);
}

.md-button--filled:hover {
  box-shadow: var(--md-sys-elevation-1);
  background-color: color-mix(in srgb, var(--md-sys-color-primary) 92%, var(--md-sys-color-on-primary));
}

.md-button--filled:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.md-button--filled:active {
  box-shadow: var(--md-sys-elevation-0);
  background-color: color-mix(in srgb, var(--md-sys-color-primary) 88%, var(--md-sys-color-on-primary));
}

/* Outlined Button */
.md-button--outlined {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
}

.md-button--outlined:hover {
  background-color: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent);
}

/* Text Button */
.md-button--text {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  padding: 10px var(--md-sys-spacing-3);
}

.md-button--text:hover {
  background-color: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent);
}

/* Icon Button */
.md-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  padding: 0;
  border: none;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: transparent;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
}

.md-icon-button:hover {
  background-color: color-mix(in srgb, var(--md-sys-color-on-surface-variant) 8%, transparent);
}

/* FAB */
.md-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--md-sys-spacing-2);
  min-width: 56px;
  height: 56px;
  padding: 16px;
  border: none;
  border-radius: var(--md-sys-shape-corner-large);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  box-shadow: var(--md-sys-elevation-3);
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
}

.md-fab:hover {
  box-shadow: var(--md-sys-elevation-4);
}

.md-fab--extended {
  padding: 16px var(--md-sys-spacing-4);
  width: auto;
}

/* Disabled State */
.md-button:disabled,
.md-icon-button:disabled,
.md-fab:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}
```

```html
<!-- HTML Usage -->
<button class="md-button md-button--filled">
  <span>Filled button</span>
</button>

<button class="md-button md-button--outlined">
  <span>Outlined button</span>
</button>

<button class="md-button md-button--text">
  <span>Text button</span>
</button>

<button class="md-icon-button" aria-label="Favorite">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
</button>

<button class="md-fab md-fab--extended">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
  <span>Create</span>
</button>
```

### Card Component (Web)

```css
/* card.css */

.md-card {
  display: flex;
  flex-direction: column;
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
  overflow: hidden;
  transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
}

.md-card--elevated {
  box-shadow: var(--md-sys-elevation-1);
}

.md-card--elevated:hover {
  box-shadow: var(--md-sys-elevation-2);
}

.md-card--filled {
  background-color: var(--md-sys-color-surface-container-highest);
}

.md-card--outlined {
  border: 1px solid var(--md-sys-color-outline-variant);
}

.md-card__media {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.md-card__content {
  padding: var(--md-sys-spacing-4);
}

.md-card__title {
  font-family: var(--md-sys-typescale-headline-large-font);
  font-size: var(--md-sys-typescale-headline-large-size);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  margin: 0 0 var(--md-sys-spacing-2) 0;
}

.md-card__text {
  font-family: var(--md-sys-typescale-body-medium-font);
  font-size: var(--md-sys-typescale-body-medium-size);
  line-height: var(--md-sys-typescale-body-medium-line-height);
  color: var(--md-sys-color-on-surface-variant);
  margin: 0;
}

.md-card__actions {
  display: flex;
  gap: var(--md-sys-spacing-2);
  padding: var(--md-sys-spacing-2) var(--md-sys-spacing-4) var(--md-sys-spacing-4);
  margin-top: auto;
}
```

```html
<!-- HTML Usage -->
<div class="md-card md-card--elevated">
  <img class="md-card__media" src="image.jpg" alt="Card image">
  <div class="md-card__content">
    <h3 class="md-card__title">Card title</h3>
    <p class="md-card__text">
      This is the card content with some descriptive text.
    </p>
  </div>
  <div class="md-card__actions">
    <button class="md-button md-button--text">Action 1</button>
    <button class="md-button md-button--text">Action 2</button>
  </div>
</div>
```

### React Component Example

```jsx
// Button.jsx
import React from 'react';
import './Button.css';

export const Button = ({
  variant = 'filled',
  icon,
  children,
  disabled = false,
  onClick,
  ...props
}) => {
  const className = `md-button md-button--${variant}`;
  
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="md-button__icon">{icon}</span>}
      {children && <span className="md-button__label">{children}</span>}
    </button>
  );
};

// Usage
<Button variant="filled" onClick={handleClick}>
  Save changes
</Button>

<Button variant="outlined" icon={<HeartIcon />}>
  Favorite
</Button>
```

---

## Layout Patterns

### Responsive Navigation

```css
/* navigation.css */

.md-navigation {
  position: fixed;
  z-index: 100;
}

/* Mobile: Bottom Navigation Bar */
@media (max-width: 599px) {
  .md-navigation {
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background-color: var(--md-sys-color-surface-container);
  }
  
  .md-navigation__items {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    padding: 0 var(--md-sys-spacing-2);
  }
  
  .md-navigation__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md-sys-spacing-1);
    padding: var(--md-sys-spacing-2);
    flex: 1;
    max-width: 168px;
    min-width: 80px;
  }
  
  .md-navigation__item-indicator {
    width: 64px;
    height: 32px;
    border-radius: var(--md-sys-shape-corner-full);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 200ms;
  }
  
  .md-navigation__item--active .md-navigation__item-indicator {
    background-color: var(--md-sys-color-secondary-container);
  }
  
  .md-navigation__item-icon {
    width: 24px;
    height: 24px;
  }
  
  .md-navigation__item-label {
    font-size: var(--md-sys-typescale-label-medium-size);
    font-weight: var(--md-sys-typescale-label-medium-weight);
  }
}

/* Tablet: Navigation Rail */
@media (min-width: 600px) and (max-width: 1239px) {
  .md-navigation {
    top: 0;
    left: 0;
    bottom: 0;
    width: 80px;
    background-color: var(--md-sys-color-surface-container);
  }
  
  .md-navigation__items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md-sys-spacing-3);
    padding: var(--md-sys-spacing-3) 0;
  }
  
  .md-navigation__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md-sys-spacing-1);
    padding: var(--md-sys-spacing-2);
    width: 100%;
  }
  
  .md-navigation__fab {
    margin-bottom: var(--md-sys-spacing-4);
  }
}

/* Desktop: Navigation Drawer */
@media (min-width: 1240px) {
  .md-navigation {
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background-color: var(--md-sys-color-surface-container-low);
  }
  
  .md-navigation__items {
    display: flex;
    flex-direction: column;
    gap: var(--md-sys-spacing-1);
    padding: var(--md-sys-spacing-3);
  }
  
  .md-navigation__item {
    display: flex;
    align-items: center;
    gap: var(--md-sys-spacing-3);
    padding: var(--md-sys-spacing-4);
    border-radius: var(--md-sys-shape-corner-full);
    transition: background-color 200ms;
  }
  
  .md-navigation__item:hover {
    background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
  }
  
  .md-navigation__item--active {
    background-color: var(--md-sys-color-secondary-container);
  }
}
```

### Grid Layout System

```css
/* grid.css */

.md-grid {
  display: grid;
  gap: var(--md-sys-spacing-4);
  padding: var(--md-sys-spacing-4);
  max-width: 1600px;
  margin: 0 auto;
}

/* Mobile: 4 columns */
@media (max-width: 599px) {
  .md-grid {
    grid-template-columns: repeat(4, 1fr);
    padding: var(--md-sys-spacing-4) var(--md-sys-spacing-4);
  }
}

/* Tablet: 8 columns */
@media (min-width: 600px) and (max-width: 1239px) {
  .md-grid {
    grid-template-columns: repeat(8, 1fr);
    padding: var(--md-sys-spacing-6) var(--md-sys-spacing-6);
  }
}

/* Desktop: 12 columns */
@media (min-width: 1240px) {
  .md-grid {
    grid-template-columns: repeat(12, 1fr);
    padding: var(--md-sys-spacing-6) var(--md-sys-spacing-8);
  }
}

/* Column Spanning */
.md-col-span-1 { grid-column: span 1; }
.md-col-span-2 { grid-column: span 2; }
.md-col-span-3 { grid-column: span 3; }
.md-col-span-4 { grid-column: span 4; }
.md-col-span-full { grid-column: 1 / -1; }

/* Responsive Column Spanning */
@media (min-width: 600px) {
  .md-col-span-md-4 { grid-column: span 4; }
  .md-col-span-md-8 { grid-column: span 8; }
}

@media (min-width: 1240px) {
  .md-col-span-lg-6 { grid-column: span 6; }
  .md-col-span-lg-12 { grid-column: span 12; }
}
```

---

## Theme Configuration

### JavaScript Theme Switcher

```javascript
// theme.js

class MaterialTheme {
  constructor() {
    this.init();
  }
  
  init() {
    // Check for saved theme preference or default to 'system'
    const savedTheme = localStorage.getItem('theme') || 'system';
    this.setTheme(savedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('theme') === 'system') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  setTheme(theme) {
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(isDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === 'dark' ? '#1C1B1F' : '#FFFBFE';
      metaThemeColor.setAttribute('content', color);
    }
  }
  
  getTheme() {
    return localStorage.getItem('theme') || 'system';
  }
}

// Initialize theme
const materialTheme = new MaterialTheme();

// Usage
// materialTheme.setTheme('light');
// materialTheme.setTheme('dark');
// materialTheme.setTheme('system');
```

### React Theme Provider

```jsx
// ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });
  
  useEffect(() => {
    const applyTheme = (themeMode) => {
      document.documentElement.setAttribute('data-theme', themeMode);
    };
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);
  
  const setThemeMode = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usage
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

---

## Accessibility Implementations

### Focus Management

```css
/* focus.css */

/* Global focus styles */
*:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-radius: var(--md-sys-shape-corner-small);
}

/* Remove default outline */
*:focus {
  outline: none;
}

/* Skip to main content link */
.skip-to-main {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: var(--md-sys-spacing-2) var(--md-sys-spacing-4);
  text-decoration: none;
  border-radius: var(--md-sys-shape-corner-small);
  z-index: 1000;
}

.skip-to-main:focus {
  top: var(--md-sys-spacing-2);
}
```

```html
<!-- HTML Accessibility Structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible App</title>
</head>
<body>
  <!-- Skip to main content -->
  <a href="#main-content" class="skip-to-main">Skip to main content</a>
  
  <!-- Navigation with proper ARIA -->
  <nav aria-label="Primary navigation">
    <ul role="list">
      <li><a href="/" aria-current="page">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
  
  <!-- Main content -->
  <main id="main-content" tabindex="-1">
    <h1>Page Title</h1>
    <!-- Content -->
  </main>
</body>
</html>
```

### ARIA Patterns

```html
<!-- Button with icon and accessible name -->
<button class="md-icon-button" aria-label="Add to favorites">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>

<!-- Loading indicator -->
<div role="status" aria-live="polite" aria-busy="true">
  <svg class="spinner" aria-hidden="true"><!-- spinner --></svg>
  <span class="sr-only">Loading...</span>
</div>

<!-- Tab panel -->
<div role="tablist" aria-label="Account settings">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    Profile
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
    Security
  </button>
</div>

<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  <!-- Profile content -->
</div>

<!-- Screen reader only text -->
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Animation Patterns

### M3 Standard Easing

```css
/* animations.css */

:root {
  /* Easing functions */
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-decelerated: cubic-bezier(0, 0, 0, 1);
  --md-sys-motion-easing-accelerated: cubic-bezier(0.3, 0, 1, 1);
  
  /* Durations */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-short3: 150ms;
  --md-sys-motion-duration-short4: 200ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-medium3: 350ms;
  --md-sys-motion-duration-medium4: 400ms;
  --md-sys-motion-duration-long1: 450ms;
  --md-sys-motion-duration-long2: 500ms;
}

/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
}

/* Slide up */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slideUp var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Project Starter Templates

### HTML Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#FFFBFE">
  <meta name="description" content="App description">
  <title>Material Design 3 App</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="/styles/tokens.css">
  <link rel="stylesheet" href="/styles/global.css">
  <link rel="stylesheet" href="/styles/components.css">
</head>
<body>
  <a href="#main" class="skip-to-main">Skip to main content</a>
  
  <div class="app">
    <nav class="md-navigation" aria-label="Primary navigation">
      <!-- Navigation items -->
    </nav>
    
    <main id="main" class="app__content">
      <!-- Main content -->
    </main>
  </div>
  
  <script src="/scripts/theme.js"></script>
  <script src="/scripts/app.js"></script>
</body>
</html>
```

### React App Structure

```
/src
  /components
    /Button
      Button.jsx
      Button.css
    /Card
      Card.jsx
      Card.css
    /Navigation
      Navigation.jsx
      Navigation.css
  /tokens
    colors.js
    typography.js
    spacing.js
  /theme
    ThemeProvider.jsx
    tokens.css
  /utils
    a11y.js
  App.jsx
  App.css
  index.js
```

---

## Best Practices Checklist

### Before Starting Development
- [ ] Review brand guidelines
- [ ] Generate color palette in Material Theme Builder
- [ ] Export design tokens
- [ ] Set up token files
- [ ] Configure theme provider
- [ ] Test light and dark modes

### During Development
- [ ] Use design tokens (never hardcode values)
- [ ] Build mobile-first, responsive layouts
- [ ] Test with keyboard navigation
- [ ] Verify color contrast (WCAG AA minimum)
- [ ] Add ARIA labels where needed
- [ ] Respect reduced motion preferences
- [ ] Test with screen readers

### Before Launch
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Performance testing
- [ ] Mobile device testing
- [ ] Dark mode testing
- [ ] Documentation complete

---

**This implementation guide should be used alongside the Material Design 3 Principles Document for complete project setup with Claude Code.**
