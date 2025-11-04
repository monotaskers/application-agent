# How to Use Material Design 3 with Claude Code
## Complete Guide for Design-Driven Development

This guide explains how to effectively use the Material Design 3 documentation suite when developing with Claude Code.

---

## 📦 What You Have

You now have three comprehensive Material Design 3 documents:

1. **material-design-3-principles.md** - The foundational guide
2. **material-design-3-implementation.md** - Practical code examples
3. **material-design-3-quick-reference.md** - Quick lookup cheat sheet

---

## 🚀 Getting Started

### Step 1: Set Up Your Workspace

Place these documents in a location where you can easily reference them:

```bash
# Recommended structure
~/projects/design-system/
  ├── material-design-3-principles.md
  ├── material-design-3-implementation.md
  └── material-design-3-quick-reference.md
```

### Step 2: Install Claude Code

If you haven't already:

```bash
# Follow installation instructions from:
# https://docs.claude.com/en/docs/claude-code
```

---

## 💡 Usage Patterns with Claude Code

### Pattern 1: Starting a New Project

**When:** Beginning a fresh project from scratch

**Steps:**

1. **Initialize your project:**
```bash
cd ~/projects
mkdir my-new-app
cd my-new-app
```

2. **Start Claude Code with design context:**
```bash
claude-code
```

3. **Give Claude Code the design context:**
```
I'm starting a new web application. Please use Material Design 3 
principles from the following document to guide the architecture 
and component design:

[Paste or reference: material-design-3-principles.md]

The project needs:
- Responsive layout (mobile, tablet, desktop)
- Light and dark mode support
- Accessible components
- Modern design tokens approach
```

4. **Ask for specific implementations:**
```
Following the patterns in material-design-3-implementation.md, 
please create:
1. A tokens.css file with M3 design tokens
2. A Button component with all variants
3. A responsive navigation system
```

### Pattern 2: Implementing Specific Components

**When:** You need to build a specific UI component

**Workflow:**

```bash
# Start Claude Code in your project
claude-code
```

**Prompt Example:**
```
I need to implement a Material Design 3 button component. 
Please reference the Button section in material-design-3-implementation.md 
and create:

1. A reusable button component in React
2. Support for all variants (filled, outlined, text)
3. Proper accessibility attributes
4. Hover, focus, and active states using M3 tokens

The component should follow the exact specifications from the 
M3 quick reference guide.
```

### Pattern 3: Quick Lookups During Development

**When:** You need specific values or patterns while coding

**Use Case Examples:**

```
# Checking spacing values
"What's the correct spacing scale for a card's padding? 
Check material-design-3-quick-reference.md"

# Color pairing rules
"I need to use primary color for a button. What's the correct 
on-primary color? Refer to material-design-3-quick-reference.md"

# Typography scale
"What's the correct font size and line height for body text? 
Check the quick reference guide"
```

### Pattern 4: Client Project Adaptation

**When:** Starting a project for a specific client with brand guidelines

**Workflow:**

```
I'm starting a project for [Client Name] with the following brand:
- Primary Color: #FF5733
- Secondary Color: #33C3FF
- Fonts: 'Poppins' for headings, 'Inter' for body

Please:
1. Review the "Client Project Adaptation" section in 
   material-design-3-principles.md
2. Map these brand colors to M3 color tokens
3. Create a custom tokens.css file that extends M3
4. Suggest appropriate shape values based on the brand personality
   (modern, friendly, professional)
```

### Pattern 5: Ensuring Accessibility

**When:** Reviewing or implementing accessibility features

**Prompt Example:**
```
Review my component implementation against the accessibility 
guidelines in material-design-3-principles.md. Check for:
- Color contrast ratios
- Touch target sizes
- Keyboard navigation
- ARIA labels
- Screen reader compatibility

[Paste your component code]
```

---

## 🎯 Specific Use Cases

### Use Case 1: Setting Up Design Tokens

**Goal:** Create a comprehensive token system for your project

**Steps:**

1. **Reference the tokens section:**
```
Using the Design Tokens System section from 
material-design-3-principles.md and the token implementation 
examples from material-design-3-implementation.md, please create:

1. A complete tokens.css file with:
   - Color tokens (light and dark mode)
   - Typography tokens
   - Spacing tokens
   - Shape tokens
   - Elevation tokens

2. A JavaScript theme switcher
3. Documentation on how to use the tokens
```

2. **Customize for your brand:**
```
Now extend these base M3 tokens with our brand colors:
- Brand Primary: [hex code]
- Brand Secondary: [hex code]

Create custom tokens that integrate seamlessly with the M3 system.
```

### Use Case 2: Building a Component Library

**Goal:** Create a reusable component library

**Approach:**

```
I want to build a component library following Material Design 3. 
Using material-design-3-implementation.md as a reference, please create:

1. Project structure for a component library
2. Button component with all variants
3. Card component
4. Text Field component
5. Navigation components (responsive)

Each component should:
- Use design tokens
- Be fully accessible
- Support light/dark modes
- Include TypeScript types
- Have usage documentation
```

### Use Case 3: Responsive Navigation

**Goal:** Implement adaptive navigation

**Prompt:**

```
Following the responsive navigation patterns in 
material-design-3-implementation.md, please create a navigation 
system that:

- Shows bottom navigation bar on mobile (< 600px)
- Shows navigation rail on tablet (600px - 1239px)
- Shows navigation drawer on desktop (≥ 1240px)

Include:
- Smooth transitions between breakpoints
- Proper ARIA labels
- Active state indicators
- Support for 3-5 navigation items
```

### Use Case 4: Theme Generation

**Goal:** Create a complete theme from brand colors

**Workflow:**

```
I have a brand color: #6B4CE6

Using the color system described in material-design-3-principles.md:

1. Generate a complete tonal palette (tones 0-100)
2. Create system color tokens for light and dark modes
3. Ensure all color pairings meet WCAG AA contrast requirements
4. Export as CSS custom properties

Reference the "Dynamic Color System" section for the approach.
```

---

## 🔄 Iterative Development Workflow

### Phase 1: Planning (Use Principles Doc)

```
Before writing any code, let's plan the architecture:

1. Review my requirements
2. Reference material-design-3-principles.md for:
   - Appropriate component categories
   - Layout strategies
   - Navigation patterns
   - Accessibility requirements

3. Create a component hierarchy and file structure
```

### Phase 2: Implementation (Use Implementation Doc)

```
Now let's implement using material-design-3-implementation.md:

1. Set up design tokens first
2. Create base components following the code examples
3. Build composite components
4. Implement responsive layouts
```

### Phase 3: Refinement (Use Quick Reference)

```
As I develop, I'll reference material-design-3-quick-reference.md for:
- Exact spacing values
- Color token names
- Typography scales
- Animation timings
```

---

## 📋 Common Claude Code Commands

### Asking for Design Reviews

```
Review this component against M3 guidelines:
[paste code]

Check:
1. Proper use of design tokens
2. Accessibility attributes
3. Responsive behavior
4. Color contrast
5. Touch target sizes

Reference: material-design-3-principles.md sections on 
accessibility and components.
```

### Requesting Refactoring

```
Refactor this code to follow M3 patterns:
[paste code]

Changes needed:
- Replace hardcoded values with tokens
- Add missing accessibility attributes
- Implement proper state layers
- Ensure responsive behavior

Use material-design-3-implementation.md for patterns.
```

### Building from Scratch

```
Create a [component name] following these requirements:
[list requirements]

Guidelines:
- Follow material-design-3-principles.md for design approach
- Use code patterns from material-design-3-implementation.md
- Reference material-design-3-quick-reference.md for exact values
```

---

## 🎨 Working with Brand Guidelines

### Scenario: You Have Client Brand Guidelines

**Step 1: Analysis**
```
I have these brand guidelines:
[paste or describe guidelines]

Using the "Client Project Adaptation" section from 
material-design-3-principles.md, help me:

1. Map brand colors to M3 color roles
2. Choose appropriate typography tokens
3. Define shape language
4. Create custom tokens that extend M3
```

**Step 2: Theme Creation**
```
Create a custom M3 theme incorporating:
- Brand Primary: [color]
- Brand Accent: [color]  
- Brand Fonts: [fonts]
- Brand Personality: [professional/playful/modern/etc]

Generate:
1. Complete token set
2. Theme configuration
3. Component customizations
```

**Step 3: Documentation**
```
Create a project-specific design system document that includes:
- Our custom tokens
- Component variations
- Usage guidelines
- Code examples

Format it as an addendum to the M3 principles.
```

---

## 🔍 Troubleshooting with Claude Code

### Issue: Components Don't Match M3 Specs

**Solution:**
```
My button doesn't match M3 specifications. 

Compare my implementation to:
- Button specs in material-design-3-quick-reference.md
- Button component code in material-design-3-implementation.md

Identify discrepancies and provide corrected code.

My code:
[paste code]
```

### Issue: Accessibility Violations

**Solution:**
```
Audit my code for accessibility issues:
[paste code]

Check against the accessibility guidelines in 
material-design-3-principles.md:
- Color contrast
- Touch targets
- ARIA labels
- Keyboard navigation
- Screen reader support

Provide a detailed report and fixes.
```

### Issue: Theme Not Working

**Solution:**
```
My dark mode isn't working correctly.

Debug using:
1. Token structure from material-design-3-implementation.md
2. Theme configuration examples
3. Common mistakes from material-design-3-quick-reference.md

My theme code:
[paste code]
```

---

## 💼 Real-World Project Examples

### Example 1: E-commerce Dashboard

```
Project: E-commerce admin dashboard

Requirements:
- Desktop-first (but responsive)
- Data visualization
- Complex navigation
- Light/dark modes

Please:
1. Review layout patterns in material-design-3-principles.md
2. Suggest navigation structure (likely drawer + top app bar)
3. Create component hierarchy
4. Implement using patterns from material-design-3-implementation.md
```

### Example 2: Mobile-First Social App

```
Project: Social media mobile app

Requirements:
- Mobile-first
- Bottom navigation
- Cards for posts
- Accessibility critical

Please:
1. Reference mobile patterns in material-design-3-principles.md
2. Use bottom navigation examples from implementation guide
3. Create card-based feed layout
4. Ensure all accessibility requirements are met
```

### Example 3: SaaS Landing Page

```
Project: Marketing landing page for SaaS product

Brand:
- Primary: #4A90E2
- Secondary: #F5A623
- Modern, professional tone

Please:
1. Map brand colors using M3 principles
2. Create custom theme
3. Build hero section, features, CTA components
4. Ensure mobile responsiveness
5. Follow M3 layout and typography guidelines
```

---

## 📊 Performance Tips

### Optimizing Your Prompts

**❌ Vague Prompt:**
```
Make me a button
```

**✅ Specific Prompt:**
```
Create an M3 filled button component following:
- Specs from material-design-3-quick-reference.md
- Implementation pattern from material-design-3-implementation.md
- Include all variants and states
- Use design tokens
- Add accessibility attributes
```

### Iterating Efficiently

**Strategy:**
1. Start with component structure
2. Add styling with tokens
3. Implement states and interactions
4. Add accessibility features
5. Test and refine

**Prompt Flow:**
```
// Step 1
Create basic button structure with props

// Step 2  
Add M3 styling using tokens from our tokens.css

// Step 3
Implement hover, focus, active, disabled states

// Step 4
Add ARIA labels and keyboard support

// Step 5
Review against M3 accessibility checklist
```

---

## 🎓 Learning Path

### For Beginners

**Week 1: Foundations**
- Read material-design-3-principles.md completely
- Understand the 7 foundations
- Learn about design tokens

**Week 2: Implementation**
- Work through material-design-3-implementation.md examples
- Build basic components with Claude Code
- Practice using design tokens

**Week 3: Practice**
- Build a small project using M3
- Use material-design-3-quick-reference.md for lookups
- Focus on accessibility

### For Experienced Developers

**Quick Start:**
1. Skim material-design-3-principles.md for philosophy
2. Jump to material-design-3-implementation.md for code
3. Keep material-design-3-quick-reference.md open while coding
4. Use Claude Code to accelerate component creation

---

## 🤖 Best Practices with Claude Code

### 1. Always Provide Context

**Good:**
```
I'm building a React component library using Material Design 3.
Reference material-design-3-principles.md for design approach.

Create a Button component that...
```

**Better:**
```
Project: React component library for fintech app
Design System: Material Design 3
Target: Web (desktop + mobile)
Accessibility: WCAG AA required

Reference:
- material-design-3-principles.md (design philosophy)
- material-design-3-implementation.md (code patterns)

Create a Button component...
```

### 2. Reference Specific Sections

Instead of:
```
Use M3 principles
```

Do:
```
Following the "Button Components" section in 
material-design-3-implementation.md (lines 50-150)...
```

### 3. Iterate Incrementally

```
// First prompt
Create basic button structure

// Second prompt
Add M3 token-based styling

// Third prompt
Implement state management

// Fourth prompt
Add accessibility features
```

### 4. Ask for Explanations

```
Create this component, and explain:
- Why you chose these specific tokens
- How the responsive behavior works
- What accessibility features you included
- How it follows M3 principles
```

---

## 🔗 Integration Workflows

### With Figma

```
I have a Figma design using Material 3 Design Kit.

The design uses:
- Components: [list]
- Custom theme: [describe]
- Screens: [list]

Please:
1. Review design against material-design-3-principles.md
2. Identify any non-M3 patterns
3. Create implementation plan
4. Build components using material-design-3-implementation.md patterns
```

### With Existing Codebases

```
I have an existing codebase that needs to migrate to M3.

Current state:
- Framework: [React/Vue/Angular/etc]
- Styling: [CSS/Sass/styled-components/etc]
- Components: [list]

Please:
1. Review migration strategy in material-design-3-principles.md
2. Create migration plan
3. Start with design tokens
4. Gradually migrate components
```

### With Design Systems

```
We have an existing design system that we want to align with M3.

Our system:
[describe current system]

Please:
1. Map our tokens to M3 tokens
2. Identify gaps
3. Create migration guide
4. Preserve our brand identity while adopting M3 foundations
```

---

## 📈 Measuring Success

### Checklist for M3 Compliance

After building with Claude Code, verify:

- [ ] All colors use design tokens (no hardcoded hex values)
- [ ] Typography uses M3 type scale
- [ ] Spacing follows 4dp grid
- [ ] Touch targets are 48x48dp minimum
- [ ] Color contrast meets WCAG AA
- [ ] Dark mode is implemented and tested
- [ ] Components are keyboard navigable
- [ ] ARIA labels are present and correct
- [ ] Animations use M3 easing functions
- [ ] Responsive breakpoints follow M3 guidelines

---

## 🆘 Getting Help

### When You're Stuck

```
I'm having trouble with [specific issue].

My code:
[paste code]

Expected behavior:
[describe]

Actual behavior:
[describe]

Please debug by:
1. Comparing to examples in material-design-3-implementation.md
2. Checking against specs in material-design-3-quick-reference.md
3. Verifying against principles in material-design-3-principles.md
```

### Requesting Code Reviews

```
Please review my implementation:
[paste code]

Check for:
1. M3 compliance (reference material-design-3-principles.md)
2. Proper token usage
3. Accessibility (reference guidelines)
4. Best practices from implementation guide
5. Code quality and maintainability

Provide:
- List of issues
- Suggested fixes
- Code improvements
```

---

## 🎯 Advanced Techniques

### Custom Token Extensions

```
Our brand requires additional semantic tokens beyond M3 defaults.

Base M3 tokens: [reference tokens.css from implementation guide]

Additional needs:
- Success color system
- Warning color system  
- Info color system
- Custom surface variants

Please create extended token set that:
1. Follows M3 naming conventions
2. Maintains accessibility
3. Integrates seamlessly with base M3 tokens
```

### Component Composition

```
Using the component patterns from material-design-3-implementation.md,
create a composite component:

CompositeCardWithActions that combines:
- M3 Card (container)
- Typography (title, body)
- Buttons (actions)
- Icon (leading)

Should be:
- Fully composable
- Token-based
- Accessible
- Responsive
```

### Animation Systems

```
Create a comprehensive animation system based on M3 motion principles:

Reference: Motion section in material-design-3-principles.md

Include:
- Easing functions
- Duration tokens
- Common transitions
- Enter/exit animations
- Respects prefers-reduced-motion

Provide as reusable utility functions/classes.
```

---

## 📚 Document Quick Reference

### When to Use Each Document

**material-design-3-principles.md**
- Planning project architecture
- Understanding M3 philosophy
- Making design decisions
- Client presentations
- Team onboarding

**material-design-3-implementation.md**
- Writing actual code
- Component development
- Layout implementation
- Theme configuration
- Code reviews

**material-design-3-quick-reference.md**
- Quick value lookups
- Mid-development checks
- Token name verification
- Debugging
- Common patterns

---

## 🚀 Next Steps

1. **Bookmark these documents** in your preferred location
2. **Start small** - build one component following the guides
3. **Practice with Claude Code** - use the prompts in this guide
4. **Build a component library** - create reusable M3 components
5. **Share with your team** - use as collaborative reference

---

## 💡 Pro Tips

1. **Keep quick reference open** - Have it in a second monitor or split screen
2. **Copy useful prompts** - Create a prompt library for common tasks
3. **Build iteratively** - Start with tokens, then basic components, then compose
4. **Test early and often** - Especially accessibility and responsive behavior
5. **Document as you go** - Add notes about deviations or custom patterns
6. **Share knowledge** - Create team-specific addendums to these docs

---

## 📞 Support

If you need help:
- Reference specific sections in the documents when asking Claude Code
- Provide complete context (framework, requirements, constraints)
- Share code samples for debugging
- Ask for explanations, not just solutions

---

**Remember:** These documents are living guides. Update them as you learn and discover new patterns. The goal is to create beautiful, accessible, and consistent user interfaces efficiently.

**Happy coding with Material Design 3 and Claude Code! 🎨✨**
