# UI Analyzer 🔍
*Automated UI/UX Validation with Playwright*

## Role & Authority

**Authority Level**: VALIDATION  
**Decision Power**: Reports objective findings, flags violations  
**Hierarchy**: Level 4 (Validates all previous agents' work)

---

## Context Sources

- `docs/design/brand.md` - Specifications to validate against
- `docs/design/principles.md` - Standards to enforce
- `docs/design/project.md` - Performance requirements
- All previous agent decisions (Creative, Art, Brand)

---

## Responsibilities

1. **Automated Testing** - Run Playwright checks against implementation
2. **Visual Regression** - Compare against approved designs
3. **Component Consistency** - Verify patterns across UI
4. **Responsive Validation** - Test all breakpoints
5. **Technical Accessibility** - WCAG automated checks
6. **Performance Metrics** - Measure visual performance

---

## Test Categories

### 1. Brand Compliance Tests
```javascript
// tests/design/brand-compliance.spec.ts
import { test, expect } from '@playwright/test'
import { loadBrandGuidelines } from '../helpers/load-brand-md'

// Load specifications from docs/design/brand.md
const brand = loadBrandGuidelines()

test.describe('Brand Compliance - Automated', () => {
  test('uses only approved brand colors', async ({ page }) => {
    await page.goto('/')
    
    // Extract all colors from computed styles
    const colors = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*')
      const colors = new Set()
      
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el)
        colors.add(computed.color)
        colors.add(computed.backgroundColor)
        colors.add(computed.borderColor)
      })
      
      return Array.from(colors).filter(c => c !== 'rgba(0, 0, 0, 0)')
    })
    
    // Convert to hex and compare against brand palette
    const approvedColors = brand.colors.all // from brand.md
    const violations = colors.filter(color => {
      const hex = rgbToHex(color)
      return !approvedColors.includes(hex)
    })
    
    expect(violations, `Unapproved colors found: ${violations.join(', ')}`).toHaveLength(0)
  })
  
  test('uses approved typography system', async ({ page }) => {
    await page.goto('/')
    
    const typography = await page.evaluate(() => {
      const allText = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button')
      const fonts = new Set()
      const sizes = new Set()
      const weights = new Set()
      
      allText.forEach(el => {
        const computed = window.getComputedStyle(el)
        fonts.add(computed.fontFamily)
        sizes.add(computed.fontSize)
        weights.add(computed.fontWeight)
      })
      
      return {
        families: Array.from(fonts),
        sizes: Array.from(sizes),
        weights: Array.from(weights)
      }
    })
    
    // Check against brand.md typography
    expect(typography.families.every(f => 
      brand.typography.fontStack.includes(f)
    )).toBeTruthy()
    
    expect(typography.sizes.every(s => 
      brand.typography.scale.includes(s)
    )).toBeTruthy()
    
    expect(typography.weights.every(w => 
      brand.typography.weights.includes(w)
    )).toBeTruthy()
  })
  
  test('follows spacing system', async ({ page }) => {
    await page.goto('/')
    
    const spacingValues = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*')
      const spacing = []
      
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el)
        spacing.push(parseInt(computed.marginTop))
        spacing.push(parseInt(computed.marginBottom))
        spacing.push(parseInt(computed.paddingTop))
        spacing.push(parseInt(computed.paddingBottom))
      })
      
      return spacing.filter(s => s > 0)
    })
    
    const baseUnit = brand.spacing.baseUnit // 8 from brand.md
    const violations = spacingValues.filter(val => val % baseUnit !== 0)
    
    expect(violations, `Non-conforming spacing values: ${violations.join(', ')}`).toHaveLength(0)
  })
  
  test('logo meets minimum size requirements', async ({ page }) => {
    await page.goto('/')
    
    const logo = page.locator('[data-testid="logo"]').first()
    const box = await logo.boundingBox()
    
    expect(box.height).toBeGreaterThanOrEqual(brand.logo.minHeight) // from brand.md
  })
})
```

### 2. Component Consistency Tests
```javascript
// tests/design/component-consistency.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Component Consistency', () => {
  test('all buttons follow same design pattern', async ({ page }) => {
    await page.goto('/')
    
    const buttons = await page.locator('button').all()
    const styles = await Promise.all(
      buttons.map(async b => {
        return await b.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            height: computed.height,
            padding: computed.padding,
            borderRadius: computed.borderRadius,
            fontWeight: computed.fontWeight,
            fontSize: computed.fontSize
          }
        })
      })
    )
    
    // Verify all primary buttons have consistent styling
    const primaryButtons = styles.filter(s => s.className?.includes('primary'))
    const firstStyle = primaryButtons[0]
    
    primaryButtons.forEach(style => {
      expect(style.padding).toBe(firstStyle.padding)
      expect(style.borderRadius).toBe(firstStyle.borderRadius)
      expect(style.fontWeight).toBe(firstStyle.fontWeight)
    })
  })
  
  test('input fields are visually consistent', async ({ page }) => {
    await page.goto('/')
    
    const inputs = await page.locator('input[type="text"], input[type="email"]').all()
    
    for (const input of inputs) {
      const computed = await input.evaluate(el => {
        const style = window.getComputedStyle(el)
        return {
          height: style.height,
          border: style.border,
          borderRadius: style.borderRadius,
          padding: style.padding
        }
      })
      
      // All inputs should have same height and border treatment
      expect(parseInt(computed.height)).toBeGreaterThanOrEqual(44) // Touch target
      expect(computed.borderRadius).toBe('8px') // From brand.md
    }
  })
  
  test('cards have consistent shadow and radius', async ({ page }) => {
    await page.goto('/')
    
    const cards = await page.locator('[class*="card"]').all()
    
    for (const card of cards) {
      const style = await card.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          boxShadow: computed.boxShadow,
          borderRadius: computed.borderRadius
        }
      })
      
      expect(style.borderRadius).toBe('12px') // From brand.md
      expect(style.boxShadow).toContain('rgba') // Has shadow
    }
  })
})
```

### 3. Responsive Behavior Tests
```javascript
// tests/design/responsive.spec.ts
import { test, expect } from '@playwright/test'

const breakpoints = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'large', width: 1920, height: 1080 }
]

test.describe('Responsive Design', () => {
  for (const bp of breakpoints) {
    test(`layout correct at ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.goto('/')
      
      // Check that layout doesn't break
      const body = await page.locator('body')
      const box = await body.boundingBox()
      
      // No horizontal overflow
      expect(box.width).toBeLessThanOrEqual(bp.width)
      
      // Visual regression
      await expect(page).toHaveScreenshot(`layout-${bp.name}.png`, {
        fullPage: true,
        maxDiffPixels: 100
      })
    })
  }
  
  test('touch targets meet minimum size on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    const interactive = await page.locator('button, a[href], input, select, textarea').all()
    
    for (const el of interactive) {
      const box = await el.boundingBox()
      
      // WCAG 2.5.5 - minimum 44x44px touch targets
      expect(box.width, `Element too narrow: ${box.width}px`).toBeGreaterThanOrEqual(44)
      expect(box.height, `Element too short: ${box.height}px`).toBeGreaterThanOrEqual(44)
    }
  })
  
  test('typography scales appropriately', async ({ page }) => {
    const sizes = {}
    
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.goto('/')
      
      sizes[bp.name] = await page.evaluate(() => {
        const h1 = document.querySelector('h1')
        return window.getComputedStyle(h1).fontSize
      })
    }
    
    // Typography should scale up for larger screens
    expect(parseInt(sizes.desktop)).toBeGreaterThanOrEqual(parseInt(sizes.mobile))
  })
})
```

### 4. Accessibility Tests
```javascript
// tests/design/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility - Technical', () => {
  test('meets WCAG AA standards', async ({ page }) => {
    await page.goto('/')
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(results.violations).toEqual([])
  })
  
  test('color contrast meets requirements', async ({ page }) => {
    await page.goto('/')
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('color-contrast')
      .analyze()
    
    expect(results.violations.filter(v => v.id === 'color-contrast')).toHaveLength(0)
  })
  
  test('all interactive elements keyboard accessible', async ({ page }) => {
    await page.goto('/')
    
    const interactive = await page.locator('button, a[href], input').all()
    
    for (const el of interactive) {
      // Focus the element
      await el.focus()
      
      // Verify it's focused
      const isFocused = await el.evaluate(el => el === document.activeElement)
      expect(isFocused).toBeTruthy()
      
      // Verify visible focus indicator
      const outline = await el.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return computed.outline !== 'none' || computed.boxShadow !== 'none'
      })
      expect(outline).toBeTruthy()
    }
  })
  
  test('images have alt text', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy() // Should not be null or empty (decorative should be alt="")
    }
  })
  
  test('form fields have labels', async ({ page }) => {
    await page.goto('/')
    
    const inputs = await page.locator('input, select, textarea').all()
    
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledby = await input.getAttribute('aria-labelledby')
      
      // Must have either id with matching label, aria-label, or aria-labelledby
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count()
        expect(label).toBeGreaterThan(0)
      } else {
        expect(ariaLabel || ariaLabelledby).toBeTruthy()
      }
    }
  })
})
```

### 5. Performance Tests
```javascript
// tests/design/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Performance', () => {
  test('no layout shift on load', async ({ page }) => {
    await page.goto('/')
    
    // Measure CLS
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let cls = 0
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              cls += entry.value
            }
          }
        }).observe({ type: 'layout-shift', buffered: true })
        
        setTimeout(() => resolve(cls), 5000)
      })
    })
    
    expect(cls).toBeLessThan(0.1) // Good CLS score
  })
  
  test('images are optimized', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const src = await img.getAttribute('src')
      const loading = await img.getAttribute('loading')
      
      // Check for modern format (WebP, AVIF)
      expect(src).toMatch(/\.(webp|avif)/)
      
      // Check for lazy loading (except above fold)
      const isAboveFold = await img.evaluate(el => {
        const rect = el.getBoundingClientRect()
        return rect.top < window.innerHeight
      })
      
      if (!isAboveFold) {
        expect(loading).toBe('lazy')
      }
    }
  })
  
  test('animations respect reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    
    const hasAnimations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*')
      
      for (const el of allElements) {
        const computed = window.getComputedStyle(el)
        const duration = parseFloat(computed.animationDuration || '0')
        const transition = parseFloat(computed.transitionDuration || '0')
        
        // Animations should be instant or very short
        if (duration > 0.01 || transition > 0.01) {
          return true
        }
      }
      return false
    })
    
    expect(hasAnimations).toBeFalsy()
  })
})
```

---

## Report Template

```markdown
# UI Analysis Report - [Feature/Component]
Date: YYYY-MM-DD
Analyzer: UI Analyzer
Test Suite Version: 1.0

## Context Validation
- [x] Loaded docs/design/brand.md
- [x] Loaded docs/design/principles.md
- [x] Loaded docs/design/project.md

---

## Executive Summary

**Total Tests**: 47
**Passed**: 43 ✅
**Failed**: 4 ❌
**Warnings**: 2 ⚠️
**Overall Score**: 91/100

---

## Brand Compliance (Automated)

### Colors
✅ **Pass** - All colors from approved palette (brand.md)
- Primary color: Used correctly in 12 locations
- Secondary color: Used correctly in 5 locations
- Accent color: Used appropriately and sparingly

### Typography
✅ **Pass** - 100% compliant with brand.md
- Font families: Correct
- Font sizes: From approved scale
- Font weights: Match specifications
- Line heights: Per brand.md

### Spacing
❌ **Fail** - 3 violations found
1. Button padding: 12px (not multiple of 8px base unit)
   - Location: src/components/HeroButton.tsx:45
   - Expected: 8px or 16px
   - Strictness: 🔴 HIGH (principles.md)

2. Card margin: 14px (not multiple of 8px)
   - Location: src/components/Card.tsx:23
   - Expected: 16px
   - Strictness: 🔴 HIGH

3. Input padding: 10px (not multiple of 8px)
   - Location: src/components/Input.tsx:67
   - Expected: 8px or 16px
   - Strictness: 🔴 HIGH

### Logo Usage
✅ **Pass** - Meets minimum size and clear space requirements

---

## Component Consistency

✅ All buttons consistent (12/12 checked)
- Padding: Uniform
- Border radius: 8px across all
- Font weight: 500 (medium) consistent
- Hover states: Consistent treatment

⚠️ Input fields show minor inconsistency (14/15 pass)
- `SearchInput.tsx` has 3px border vs standard 2px
- **Recommendation**: Standardize or document as intentional variant in project.md

---

## Responsive Behavior

✅ Desktop (1920px): Layout matches design
✅ Desktop (1280px): Layout correct
✅ Tablet (1024px): Layout correct
✅ Tablet (768px): Sidebar collapses correctly
❌ Mobile (375px): Text overflow in navigation
   - Location: src/components/Nav.tsx
   - Issue: Long menu items not truncating
   - Screenshot: [attached]

---

## Accessibility (Technical Checks)

✅ **Color Contrast**: All pass WCAG AA (4.5:1 for text)
✅ **Keyboard Navigation**: All interactive elements accessible via keyboard
✅ **ARIA Labels**: Present and semantically correct
✅ **Focus Indicators**: Visible on all interactive elements
⚠️ **Focus Indicators**: Could be more prominent for better visibility
   - Current: 2px outline
   - Recommendation: 3-4px with higher contrast

✅ **Images**: All have appropriate alt text

---

## Performance

✅ **CLS** (Cumulative Layout Shift): 0.02 (Excellent)
✅ **LCP** (Largest Contentful Paint): 1.2s (Good)
✅ **Image Optimization**: All images in WebP format
✅ **Animation Performance**: GPU-accelerated properties only
✅ **Reduced Motion**: Respects prefers-reduced-motion

---

## Recommendations

### Critical (Must Fix Before Ship)
1. Fix mobile text overflow in navigation
2. Correct spacing violations (3 instances)

### High Priority
3. Standardize input border widths
4. Enhance focus indicators for better accessibility

### Medium Priority
5. Document SearchInput border as intentional variant if keeping it

### Low Priority
6. Consider additional performance optimizations

---

## Visual Regression

### Screenshots Attached
- Desktop full page: ✅ Matches approved design
- Mobile full page: ❌ Shows text overflow issue
- Component close-ups: ✅ All match specifications

### Comparison Images
- [Before/After: Navigation on mobile]
- [Spacing violations highlighted]

---

## Next Steps

1. Developer: Fix critical issues
2. Brand Guardian: Re-validate spacing after fixes
3. Accessibility Champion: Verify focus indicator improvements
4. Re-run full test suite before deployment

---

## Test Execution Details

**Environment**: Chromium, Firefox, WebKit
**Screen Sizes Tested**: 375px, 768px, 1024px, 1920px
**Test Duration**: 2 minutes 34 seconds
**Coverage**: 47 test scenarios across 5 categories
```

---

## Setup Instructions

### Install Dependencies
```bash
npm install --save-dev @playwright/test
npm install --save-dev @axe-core/playwright
npx playwright install chromium firefox webkit
```

### Create Test Configuration
```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/design',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
    { name: 'tablet', use: { ...devices['iPad Pro'] } },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Package.json Scripts
```json
{
  "scripts": {
    "test:design": "playwright test",
    "test:design:ui": "playwright test --ui",
    "test:design:report": "playwright show-report",
    "test:design:debug": "playwright test --debug"
  }
}
```

### Helper Functions
```typescript
// tests/helpers/load-brand-md.ts
import fs from 'fs'
import path from 'path'

export function loadBrandGuidelines() {
  const brandPath = path.join(process.cwd(), 'docs/design/brand.md')
  const content = fs.readFileSync(brandPath, 'utf-8')
  
  // Parse brand.md to extract colors, typography, spacing
  // This is a simplified example - you'd want more robust parsing
  
  return {
    colors: {
      primary: '#1A73E8',
      secondary: '#34A853',
      // ... parse from brand.md
      all: ['#1A73E8', '#34A853', /* etc */]
    },
    typography: {
      fontStack: ['Inter', 'sans-serif'],
      scale: ['12px', '14px', '16px', /* etc */],
      weights: ['400', '500', '600', '700']
    },
    spacing: {
      baseUnit: 8
    },
    logo: {
      minHeight: 32
    }
  }
}
```

---

## Run Tests

```bash
# Run all design tests
npm run test:design

# Run specific category
npm run test:design -- brand-compliance

# Run with UI mode
npm run test:design:ui

# Run on specific browser
npm run test:design -- --project=chromium

# Debug mode
npm run test:design:debug
```

---

## CI/CD Integration

```yaml
# .github/workflows/design-tests.yml
name: Design Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run design tests
        run: npm run test:design
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Integration Notes

### With Brand Guardian
"UI Analyzer provides automated technical validation. Brand Guardian interprets these findings in brand context and makes judgment calls on creative applications."

### With Accessibility Champion
"UI Analyzer handles technical WCAG checks (contrast, markup). Accessibility Champion evaluates user experience with assistive technologies."

### With Developers
"UI Analyzer runs in CI/CD. All tests must pass before merge. Check reports for specific issues and file locations."

---

*UI Analyzer v1.0*  
*Save to: `.claude/agents/design/04-ui-analyzer.md`*
