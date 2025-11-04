# Material Design 3 (M3) Design Principles Document

## Purpose
This document serves as a comprehensive guide for implementing Material Design 3 principles when developing applications with Claude Code. It's designed to be used as a reference when starting client projects, combining M3 foundations with brand-specific context.

---

## Table of Contents
1. [Core Philosophy](#core-philosophy)
2. [The Seven Foundations](#the-seven-foundations)
3. [Core Principles](#core-principles)
4. [Design Tokens System](#design-tokens-system)
5. [Component Architecture](#component-architecture)
6. [Implementation Tools & Libraries](#implementation-tools--libraries)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Client Project Adaptation](#client-project-adaptation)

---

## Core Philosophy

Material Design 3 represents Google's vision for **personal, adaptive, and expressive** digital experiences. It moves beyond rigid consistency to embrace:

- **Personalization**: Interfaces that adapt to individual user preferences
- **Flexibility**: Systems that work across platforms and contexts
- **Accessibility**: Design that's inclusive by default
- **Expressivity**: Emotional and engaging experiences

### Key Shift from M2 to M3
M3 introduces dynamic theming where interfaces can adapt to user wallpapers, system settings, and brand requirements while maintaining accessibility and visual coherence.

---

## The Seven Foundations

### 1. Color
**Dynamic Color System**
- Uses algorithmic theming to generate accessible color schemes
- Adapts to user preferences, wallpapers, and brand colors
- Built on tonal palettes (not just hue/hex values)
- Ensures accessibility through 60+ luminance spread in pairings

**Color Roles:**
- **Primary**: Main brand color, most prominent UI elements
- **Secondary**: Less prominent components, expands color expression
- **Tertiary**: Contrasting accents, balances primary/secondary
- **Neutral**: Surfaces, backgrounds, high-emphasis text
- **Error**: Critical warnings and error states

**Implementation Notes:**
- Always use color tokens, not hardcoded values
- Test color combinations for WCAG accessibility
- Design for both light and dark modes simultaneously
- Consider color blindness in palette selection

### 2. Typography
**Adaptive Type Scale**
- Categories: Display, Headline, Title, Body, Label
- Sizes: Large, Medium, Small for each category
- Scales dynamically based on screen size and user preferences
- Sentence case by default (not ALL CAPS)

**Type Scale Hierarchy:**
```
Display Large/Medium/Small - Hero content
Headline Large/Medium/Small - Page titles, emphasis
Title Large/Medium/Small - Section headers
Body Large/Medium/Small - Primary content
Label Large/Medium/Small - UI components, captions
```

**Best Practices:**
- Maintain clear visual hierarchy
- Ensure sufficient contrast (especially in dark mode)
- Support user font size preferences
- Use font weights to create emphasis, not just size

### 3. Shape
**Expressive Shape System**
- Rounded corners create friendly, approachable feel
- Four shape families: None, Extra Small, Small, Medium, Large, Extra Large
- Applied consistently across components
- Reinforces brand personality

**Shape Tokens:**
- Corner radius values defined by tokens
- Different components use appropriate shape families
- FABs use smaller corner radius (boxier) than M2
- Cards and containers use medium to large radius

### 4. Motion
**Authentic Motion Principles**
- Based on real-world physics (mass, weight, acceleration)
- Provides meaningful feedback and guidance
- Creates sense of continuity between states
- Never decorative - always functional

**Motion Guidelines:**
- Use easing functions for natural feel
- Provide visual feedback for user actions
- Guide attention during transitions
- Avoid overwhelming or distracting animations
- Respect reduced motion preferences

**Types of Motion:**
- Transitions between screens
- State changes within components
- Feedback for user interactions
- Progress indicators
- Attention-grabbing animations (sparingly)

### 5. Interaction
**Responsive and Intuitive**
- Clear touch targets (minimum 48x48dp)
- Consistent interaction patterns
- Predictable responses to user actions
- Accessible by default

**Interaction States:**
- Default
- Hover
- Focus
- Pressed
- Dragged
- Disabled

**State Layers:**
- Visual feedback through overlays
- Color and opacity changes
- Defined through design tokens

### 6. Layout
**Adaptive and Responsive**
- Works across all screen sizes and form factors
- Supports foldable devices and large screens
- Uses breakpoints intelligently
- Maintains consistency across devices

**Layout Compositions:**
- **Lists**: Information on left, details on right
- **Supporting Panels**: Main content with complementary info
- **Feeds**: Card-based content suggestions
- **Multi-window**: Optimized for foldables and tablets

**Grid System:**
- Based on 4dp baseline grid
- Flexible gutters and margins
- Responsive columns
- Consistent spacing units

### 7. Elevation
**Depth and Hierarchy**
- Z-axis positioning creates visual hierarchy
- Shadows indicate elevation levels
- Helps distinguish interactive elements
- More subtle than M2 (no harsh shadows)

**Elevation Levels:**
- Level 0: Base surface
- Level 1: Raised elements (cards)
- Level 2: Floating elements (FABs)
- Level 3: Dialogs, menus
- Level 4-5: Modal surfaces

---

## Core Principles

### 1. Material is the Metaphor
- Interface elements resemble physical materials
- Creates tactile, intuitive experiences
- Uses depth and hierarchy naturally
- Balances abstraction with real-world reference

**Application:**
- Elements have tangible surfaces
- Objects cast shadows based on elevation
- Layers exist in 3D space (X, Y, Z axes)
- Interactions feel physical and natural

### 2. Bold, Graphic, Intentional
- Clear visual language
- Strong use of color, typography, and imagery
- Purposeful design choices
- Eliminates ambiguity

**Application:**
- High contrast for readability
- Clear visual hierarchy
- Strategic use of white space
- Purposeful color application

### 3. Motion Provides Meaning
- Animation guides understanding
- Transitions show relationships
- Feedback confirms actions
- Direction indicates hierarchy

**Application:**
- Smooth state transitions
- Loading indicators show progress
- Spatial relationships through movement
- Attention-directing animations

---

## Design Tokens System

### What Are Design Tokens?
Named entities that store visual design attributes. They act as the single source of truth for your design system.

### Token Hierarchy

**Reference Tokens** (Foundational)
```
--md-ref-palette-primary-0
--md-ref-palette-primary-10
--md-ref-palette-primary-20
... (tonal palette from 0-100)
```

**System Tokens** (Semantic)
```
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-surface
--md-sys-typescale-body-large
--md-sys-shape-corner-medium
```

**Component Tokens** (Specific)
```
--md-filled-button-container-color
--md-filled-button-label-text-color
--md-card-container-elevation
```

### Token Categories

1. **Color Tokens**
   - Palette reference tokens
   - System color roles
   - Component-specific colors

2. **Typography Tokens**
   - Font family
   - Font size
   - Line height
   - Letter spacing
   - Font weight

3. **Shape Tokens**
   - Corner radius values
   - Shape families

4. **Spacing Tokens**
   - Padding values
   - Margin values
   - Gap sizes

5. **Elevation Tokens**
   - Shadow definitions
   - Z-index values

### Implementation Benefits
- Single point of update across entire project
- Platform-agnostic definitions
- Easy theme switching
- Consistent design language
- Simplified designer-developer handoff

---

## Component Architecture

### Component Categories

#### 1. **Actions**
Components that help users achieve goals:
- **Buttons**: Common, Elevated, Filled, Filled Tonal, Outlined, Text
- **FABs**: Regular, Small, Large, Extended
- **Icon Buttons**: Standard, Filled, Filled Tonal, Outlined
- **Segmented Buttons**: For multiple choice selection

**Best Practices:**
- Use FAB for primary actions
- Limit one FAB per screen
- Button hierarchy through visual weight
- Icon buttons for compact spaces

#### 2. **Communication**
Components that provide information:
- **Badges**: Numerical or status indicators
- **Progress Indicators**: Linear, Circular
- **Snackbars**: Brief process messages

**Best Practices:**
- Keep messages concise
- Provide clear action options
- Auto-dismiss when appropriate
- Don't stack multiple snackbars

#### 3. **Containment**
Components that hold content:
- **Cards**: Elevated, Filled, Outlined
- **Dividers**: Full-width, Inset, Middle
- **Lists**: Single-line, Two-line, Three-line
- **Bottom Sheets**: Standard, Modal

**Best Practices:**
- Use appropriate card elevation
- Group related content
- Maintain consistent padding
- Support touch interactions

#### 4. **Navigation**
Components for moving through the app:

**For Small Screens (Mobile):**
- **Navigation Bar**: 3-5 top destinations
- **Bottom App Bar**: Actions and navigation
- **Top App Bar**: Small, Medium, Large, Center-aligned
- **Tabs**: Horizontal navigation

**For Medium/Large Screens:**
- **Navigation Rail**: Vertical navigation (3-7 items + FAB)
- **Navigation Drawer**: Modal or standard
- **Navigation Suite**: Adaptive navigation

**Best Practices:**
- Navigation bar for handheld devices
- Rail for tablets and desktop
- Keep destinations equal in importance
- Use filled icons for active states
- Outlined icons for inactive states

#### 5. **Selection**
Components for making choices:
- **Checkboxes**: Multiple selection
- **Radio Buttons**: Single selection
- **Chips**: Assist, Filter, Input, Suggestion
- **Switches**: On/off toggles
- **Sliders**: Value selection

**Best Practices:**
- Clear labels for all options
- Group related selections
- Show selection state clearly
- Provide immediate feedback

#### 6. **Text Input**
Components for entering text:
- **Text Fields**: Filled, Outlined
- **Search Bar**: Inline, Expandable
- **Date Pickers**: Calendar, Input
- **Time Pickers**: Clock, Input

**Best Practices:**
- Clear labels and placeholders
- Helpful error messages
- Support for autocomplete
- Validation feedback
- Proper keyboard types

---

## Implementation Tools & Libraries

### Design Tools

#### 1. **Material Theme Builder (Figma Plugin)**
**Purpose:** Generate dynamic color themes and design tokens

**Features:**
- Create themes from images or brand colors
- Generate accessible color palettes
- Export tokens for code implementation
- Visualize light/dark modes
- Type scale customization

**Workflow:**
1. Install from Figma Community
2. Open Material 3 Design Kit
3. Launch Material Theme Builder plugin
4. Choose source: Image or Color
5. Customize key colors (Primary, Secondary, Tertiary, Neutral)
6. Generate and export tokens
7. Apply to components

**Note:** There are some known issues with the plugin as of 2024, particularly with theme switching. Manual token assignment may be required.

#### 2. **Material 3 Design Kit (Figma)**
**Purpose:** Complete library of M3 components and styles

**Contents:**
- All M3 components
- Pre-built layouts
- Style system
- Typography scale
- Icon library
- Example screens

**Access:** Available on Figma Community

#### 3. **Material Theme Builder (Web)**
**URL:** https://m3.material.io/theme-builder

**Features:**
- Browser-based theme creation
- Code export (Android, Web, Flutter)
- Visual preview of themes
- No Figma account required

### Development Libraries

#### **Android / Kotlin**
```kotlin
implementation "androidx.compose.material3:material3:1.2.0"
implementation "androidx.compose.material3:material3-window-size-class:1.2.0"

// Enable dynamic color
DynamicColors.applyToActivityIfAvailable(this)
```

#### **Web / React**
```bash
npm install @mui/material @emotion/react @emotion/styled
# or
npm install @material/web
```

#### **Flutter**
```yaml
dependencies:
  flutter:
    sdk: flutter
  # Material 3 enabled by default in Flutter 3.16+

# In MaterialApp:
theme: ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: brandColor),
)
```

#### **Angular**
```bash
ng add @angular/material
# Version 18.1+ supports M3 with system tokens
```

### Token Management Tools

#### **Style Dictionary**
- Transforms design tokens to platform-specific formats
- JSON/YAML token definitions
- Outputs CSS, SCSS, Swift, Kotlin, etc.

#### **Design Tokens (W3C Community Group)**
- Standard format for token definitions
- Platform-agnostic
- Industry-wide adoption

---

## Accessibility Guidelines

### Core Accessibility Principles

#### 1. **Color Contrast**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Minimum 3:1 for UI components
- M3's tonal palette system ensures accessibility by default

**Tools:**
- Material Theme Builder validates contrast
- Use --md-sys-color pairings (e.g., primary/on-primary)

#### 2. **Touch Targets**
- Minimum 48x48dp for all interactive elements
- Adequate spacing between targets
- Clear visual boundaries

#### 3. **Screen Reader Support**
- Semantic HTML elements
- ARIA labels where needed
- Logical focus order
- Clear state announcements

#### 4. **Keyboard Navigation**
- Tab order follows visual hierarchy
- Visible focus indicators
- Keyboard shortcuts documented
- No keyboard traps

#### 5. **Text and Typography**
- Scalable text (respect user preferences)
- Sentence case for readability
- Adequate line height (1.5 for body text)
- Sufficient text spacing

#### 6. **Motion and Animation**
- Respect prefers-reduced-motion
- Provide static alternatives
- Avoid flickering (< 3Hz)
- No auto-playing videos with sound

#### 7. **Forms and Validation**
- Clear labels for all inputs
- Error messages near inputs
- Color not the only indicator
- Autocomplete attributes

### Testing Accessibility

**Tools:**
- Android Accessibility Scanner
- Chrome DevTools Accessibility Panel
- WAVE (Web Accessibility Evaluation Tool)
- axe DevTools

**Checklist:**
- [ ] All text has sufficient contrast
- [ ] Touch targets are at least 48x48dp
- [ ] Focus order is logical
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Reduced motion is respected

---

## Client Project Adaptation

### Integrating Brand Identity with M3

#### Step 1: Brand Analysis
Document the following brand elements:
- **Primary Brand Color**: Main brand color
- **Secondary Colors**: Supporting colors
- **Typography**: Brand fonts (headings, body)
- **Logo and Imagery**: Visual style
- **Tone and Voice**: Formal, casual, playful, etc.
- **Target Audience**: Demographics, accessibility needs

#### Step 2: M3 Configuration

**Color Mapping:**
```
Brand Primary Color → M3 Primary Key Color
Brand Accent Color → M3 Secondary or Tertiary Key Color
```

**Typography Adaptation:**
```
Brand Display Font → M3 Display scale
Brand Body Font → M3 Body scale
```

**Shape Language:**
- Corporate/Professional: Smaller corner radius (4-8dp)
- Friendly/Approachable: Medium corner radius (12-16dp)
- Playful/Creative: Larger corner radius (16-24dp)

#### Step 3: Token Customization

Create brand-specific tokens that extend M3:

```css
/* Base M3 tokens */
--md-sys-color-primary: #6750A4;
--md-sys-color-on-primary: #FFFFFF;

/* Brand-specific custom tokens */
--brand-accent-highlight: #FF6B35;
--brand-surface-tint: rgba(103, 80, 164, 0.05);
--brand-typography-display: 'Brand Font', Roboto, sans-serif;
```

#### Step 4: Component Customization

**Buttons:**
- Adjust corner radius to match brand
- Customize hover/press states
- Add brand-specific variants if needed

**Cards:**
- Modify elevation levels
- Adjust padding/spacing
- Custom border treatments

**Navigation:**
- Choose appropriate pattern (bar vs. rail vs. drawer)
- Brand icon integration
- Custom active indicators

#### Step 5: Documentation

Create project-specific design system document:

```markdown
# [Client Name] Design System
Based on Material Design 3

## Brand Colors
- Primary: #XXXXXX
- Secondary: #XXXXXX
- Usage guidelines...

## Typography
- Display: [Font Name]
- Body: [Font Name]
- Scale adjustments...

## Components
- Custom button variants
- Navigation patterns
- Card treatments
- Form elements

## Spacing System
- Base unit: 4dp/8dp
- Component-specific spacing

## Accessibility
- Contrast requirements met
- Custom accessibility considerations
```

### Implementation Checklist

#### Planning Phase
- [ ] Analyze brand guidelines
- [ ] Map brand colors to M3 color roles
- [ ] Select appropriate typography
- [ ] Define shape language
- [ ] Identify required components
- [ ] Plan navigation structure
- [ ] Document accessibility requirements

#### Design Phase
- [ ] Create theme in Material Theme Builder
- [ ] Export design tokens
- [ ] Customize M3 Design Kit components
- [ ] Build key screens in Figma
- [ ] Test light/dark modes
- [ ] Validate accessibility
- [ ] Get stakeholder approval

#### Development Phase
- [ ] Set up development environment
- [ ] Install M3 libraries
- [ ] Configure design tokens
- [ ] Implement base theme
- [ ] Build component library
- [ ] Implement responsive layouts
- [ ] Add animations and transitions
- [ ] Test across devices
- [ ] Accessibility testing
- [ ] Performance optimization

#### Handoff Phase
- [ ] Document custom components
- [ ] Create style guide
- [ ] Provide token definitions
- [ ] Share Figma files
- [ ] Code examples and patterns
- [ ] Accessibility documentation
- [ ] Maintenance guidelines

---

## Best Practices for Claude Code Development

### 1. **Start with Tokens**
Always define design tokens before building components. This ensures consistency and makes theming easier.

### 2. **Component-First Approach**
Build reusable components that can be composed into larger patterns.

### 3. **Responsive by Default**
Implement responsive behavior from the start, not as an afterthought.

### 4. **Accessibility is Non-Negotiable**
Build accessibility in from the beginning. It's harder to retrofit.

### 5. **Test Early and Often**
- Test on real devices
- Test with accessibility tools
- Test light and dark modes
- Test different text sizes

### 6. **Document as You Build**
Maintain documentation of custom components, tokens, and patterns.

### 7. **Version Control for Tokens**
Track token changes in version control to understand design evolution.

### 8. **Performance Matters**
- Optimize animations
- Lazy load when appropriate
- Monitor bundle sizes
- Test on lower-end devices

---

## Quick Reference Commands

### Material Theme Builder Export
When exporting from Material Theme Builder:
1. Click "Export" in plugin
2. Choose platform (Android, Web, iOS)
3. Download token files
4. Import into project

### Common Token Patterns

**Color:**
```css
color: var(--md-sys-color-primary);
background: var(--md-sys-color-surface);
```

**Typography:**
```css
font-family: var(--md-sys-typescale-body-large-font);
font-size: var(--md-sys-typescale-body-large-size);
line-height: var(--md-sys-typescale-body-large-line-height);
```

**Spacing:**
```css
padding: 16dp; /* Use 4dp increments */
margin: 24dp;
gap: 8dp;
```

**Shape:**
```css
border-radius: var(--md-sys-shape-corner-medium);
```

---

## Resources

### Official Documentation
- **M3 Website**: https://m3.material.io
- **Design Guidelines**: https://m3.material.io/foundations
- **Components**: https://m3.material.io/components
- **Theme Builder**: https://m3.material.io/theme-builder

### Development Resources
- **Android Compose**: https://developer.android.com/develop/ui/compose/designsystems/material3
- **Material Web**: https://github.com/material-components/material-web
- **Material UI (React)**: https://mui.com/material-ui/
- **Flutter Material**: https://docs.flutter.dev/ui/widgets/material

### Design Tools
- **Figma Community**: Search "Material Design 3"
- **Material Theme Builder Plugin**: Figma Community
- **M3 Design Kit**: Figma Community

### Learning Resources
- **Material Design Blog**: https://material.io/blog
- **YouTube**: YouTube.com/MaterialDesign
- **Codelabs**: https://codelabs.developers.google.com

---

## Conclusion

Material Design 3 provides a robust, flexible foundation for creating modern, accessible, and expressive user interfaces. By following these principles and adapting them to your brand context, you can create applications that are:

- **Consistent**: Following established patterns users recognize
- **Accessible**: Usable by everyone, regardless of ability
- **Beautiful**: Visually appealing and on-brand
- **Adaptive**: Working across all platforms and devices
- **Maintainable**: Built on a token system for easy updates

Use this document as your guide when starting new projects with Claude Code, and remember: M3 is a foundation, not a constraint. Adapt it to serve your users and your brand.

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Based on:** Material Design 3 Specifications  
**For Use With:** Claude Code and client project development
