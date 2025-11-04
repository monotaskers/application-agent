---
# Ocupop Design Principles
# Machine-readable metadata for tooling and AI systems

document:
  title: "Ocupop Design Principles"
  version: "1.0.0"
  status: "draft"  # draft | review | approved | deprecated
  created_date: "2025-10-24"
  last_updated: "2025-10-24"
  approved_by: ""  # Creative Director approval pending
  approved_date: ""
  
organization:
  name: "Ocupop"
  tagline: "Digital Creative Agency"
  founded: "2000"
  core_mantra: "Getting Shit Done is our Love Language"
  
scope:
  applies_to:
    - "web design"
    - "brand identity"
    - "digital products"
    - "user experience"
    - "development"
  platforms:
    - "web"
    - "mobile"
    - "print"
    - "environmental"
    
maintenance:
  review_schedule: "quarterly"
  major_revision_schedule: "annual"
  feedback_process: "Team review via GitHub pull requests"
  contact: "creative-director@ocupop.com"

related_documents:
  - "Brand Guidelines"
  - "Code Style Guide"
  - "Project Process Documentation"
  - "Client Onboarding Materials"
---

# Ocupop Design Principles

**Version 1.0 | Draft**  
**Last Updated:** October 24, 2025

## About This Document

This document codifies Ocupop's design philosophy—the principles that guide our creative decisions, define our approach to problem-solving, and shape how we collaborate with clients and each other. These principles are born from 25 years of making things that work, relationships that last, and a relentless commitment to doing good work with good people.

**Purpose:**
- Provide clear guidance for design decision-making
- Maintain consistency across projects and team members
- Onboard new team members to Ocupop's design philosophy
- Share our approach transparently with clients and AI tools
- Create a foundation for design critique and evaluation

**How to Use This Document:**
- **Designers & Developers:** Reference when making design decisions or resolving conflicts
- **Project Managers:** Use to evaluate project direction and scope
- **Creative Director:** Framework for design reviews and team guidance
- **Clients:** Understand our design thinking and approach
- **AI Tools:** Context for generating designs aligned with Ocupop's philosophy

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Foundations](#foundations)
3. [Patterns & Practices](#patterns--practices)
4. [Decision Framework](#decision-framework)
5. [Voice & Tone](#voice--tone)
6. [Appendix](#appendix)

---

# Core Principles

These five principles are the foundation of Ocupop's design philosophy. When in doubt, return to these.

---

## 1. Honest Over Pretty

```yaml
id: "honest-over-pretty"
order: 1
category: "core-principle"
related_values: ["authenticity", "clarity", "respect"]
keywords: ["transparency", "truth", "clarity", "function"]
```

### Description

Design should communicate clearly and authentically, never hiding behind decoration or obscuring truth with unnecessary flourish.

### Rationale

Ocupop's commitment to being "real, not faux-positive" extends to our design work. We believe the best design doesn't manipulate or mislead—it respects users' intelligence and time. Beauty emerges from clarity and function, not despite it. When faced with a choice between an aesthetically pleasing solution that obscures and a straightforward one that enlightens, we choose transparency every time.

This isn't about making things ugly or boring—it's about ensuring that every design choice serves the user's understanding first. We can be beautiful AND honest. We can be surprising AND clear. But we never sacrifice truth for aesthetics.

### Application

**When designing data visualizations:**
- Show the full picture, including uncomfortable truths
- Don't cherry-pick data or use visual tricks to skew perception
- Label axes clearly, provide context, show margins of error
- If data is limited or flawed, say so

**When writing error messages:**
- Tell users exactly what went wrong and how to fix it
- No cutesy apologies or vague "Oops!" messages
- Provide actionable next steps
- Take responsibility when it's our system's fault

**When presenting information hierarchy:**
- Put the most important information first, even if it's not the most glamorous content
- Don't bury required disclosures in fine print
- Make navigation and next steps obvious
- If something is mandatory, say "required" not "optional to skip"

**When choosing visual metaphors:**
- Use metaphors that illuminate, not obscure
- Avoid trendy design patterns that don't serve users
- Question whether decoration adds meaning or just noise

### Examples

✅ **Good Examples:**
- A sustainability dashboard that shows declining metrics prominently with clear "what's happening" and "how to improve" explanations
- Forms that explain WHY we're asking for information upfront ("We need your phone number to send delivery updates")
- 404 pages that admit "we can't find this page" and offer genuinely helpful navigation options
- Pricing pages that show the total cost including fees upfront

❌ **Anti-Patterns to Avoid:**
- Loading animations that make waits feel shorter than they are without actually improving performance
- "Dark patterns" that manipulate users into unintended actions (hidden unsubscribe links, confusing button hierarchies)
- Hiding critical information in "tasteful" ways that require hunting (important terms buried in modals)
- Ambiguous iconography that requires guessing (minimalist icons without labels on first-time use)
- Fake urgency or scarcity ("Only 2 left!" when it's algorithmically generated)

### Related Ocupop Values

- "Let's be Real. Always and forever"
- "Solutions, not options"
- "Meaningful relationships, not toxic veneer of faux-positivity"

### When This Principle Conflicts

**Honest vs. Delightful:** If a delightful interaction obscures function, choose honesty. But often, the most delightful experiences come FROM clarity and thoughtfulness.

**Honest vs. Brand Image:** If being honest makes a client look bad, we work WITH them to fix the underlying issue, not hide it with design. Our role is partnership, not propaganda.

---

## 2. Action Over Perfection

```yaml
id: "action-over-perfection"
order: 2
category: "core-principle"
related_values: ["momentum", "pragmatism", "iteration"]
keywords: ["shipping", "mvp", "iteration", "feedback", "agility"]
```

### Description

Ship functional, well-crafted work that solves real problems. Iterate based on real use rather than endlessly polishing in isolation.

### Rationale

"Getting Shit Done" isn't about cutting corners—it's about understanding that perfect is the enemy of good, and unused design is worthless design. We're a small, agile team that values momentum and real-world feedback over theoretical perfection.

The best insights come from watching real people use real products, not from endless internal debates. We believe in shipping 90% solutions that we can iterate on, rather than 100% solutions that ship too late to matter. This requires discipline: the craft must be high, the core experience must work, but we ruthlessly prioritize.

### Application

**When deciding on a design direction:**
- Choose the solution that's 90% there and shippable over the 100% solution that needs three more weeks
- Define "what must work flawlessly" vs. "what can improve v2"
- Ship when core value is deliverable, even if nice-to-haves remain

**When prototyping:**
- Build testable versions quickly: paper prototypes, Figma clickthroughs, rough code—whatever gets feedback fastest
- Don't spend days on a prototype that could be validated in hours with sketches
- Match fidelity to the question being answered

**When setting project scope:**
- Define the core experience that must work flawlessly, then prioritize ruthlessly
- Use "must have / should have / nice to have" frameworks
- Be honest about tradeoffs with clients: "We can have all three if you give us two more weeks, or we can ship the most important two on schedule"

**When reviewing work:**
- Focus on "does this solve the problem?" before "is this pixel-perfect?"
- Identify actual blockers vs. preference improvements
- Schedule polish time, don't steal from building time

### Examples

✅ **Good Examples:**
- Launching with two well-tested primary user flows instead of five half-tested ones
- Using standard UI components (Material, Bootstrap) to ship quickly, then customizing based on actual usage patterns
- Shipping with placeholder illustrations if they don't block core function, then commissioning custom art for v2
- Conducting hallway testing with 3 users instead of waiting to set up formal research
- Documenting known issues in a backlog rather than delaying launch

❌ **Anti-Patterns to Avoid:**
- Pixel-pushing minor details while core functionality remains untested
- Building custom solutions for edge cases that affect 2% of users before testing with the 98%
- Analysis paralysis: "Let's test five more concepts before choosing"
- Redesigning before understanding what's not working in the current design
- Over-engineering for theoretical future needs ("What if we need to support 100 languages someday?")
- Delaying launch for minor aesthetic improvements that don't affect usability

### Related Ocupop Values

- "Getting Shit Done is our Love Language"
- "Dead serious deadlines"
- "Shared urgency and shared reality"
- "Uniquely agile"

### When This Principle Conflicts

**Action vs. Quality:** We ship fast, but never ship broken. Core functionality must work. Accessibility must be there. Security can't be "v2." The question is: what's genuinely core vs. what's enhancement?

**Action vs. Delight in Details:** Fast doesn't mean sloppy. It means focusing our detail-obsession on what matters most, not spreading it thin across everything.

---

## 3. Guided Discovery

```yaml
id: "guided-discovery"
order: 3
category: "core-principle"
related_values: ["expertise", "curation", "trust"]
keywords: ["guidance", "recommendations", "progressive-disclosure", "defaults"]
```

### Description

Lead users confidently through experiences with expert curation, not overwhelming choice. Show clear paths forward while respecting user intelligence.

### Rationale

As "trusted experts" who provide "solutions, not options," we design interfaces that guide without patronizing. We've learned through 25 years that people want direction from those who know—but they also want to understand why we're recommending a path.

We reduce cognitive load through thoughtful defaults and clear recommendations, while maintaining transparency about tradeoffs. This isn't about limiting options—it's about respecting users' time by doing the thinking work for them, while making it easy to dig deeper if they want to.

### Application

**When designing navigation:**
- Prioritize the 80% use case prominently
- Make the other 20% discoverable but not prominent
- Use progressive disclosure: show essential paths, reveal complexity as needed
- Test: can first-time users accomplish the primary task without hunting?

**When presenting choices:**
- Recommend a default based on context
- Explain why it's the best choice for most users (briefly)
- Make alternatives easy to select if the default doesn't fit
- Avoid false equality: if one option is genuinely better for most people, say so

**When onboarding:**
- Show users the quickest path to value, then reveal complexity as they need it
- "Get started in 30 seconds" should be possible
- Offer optional deeper dives for power users
- Use contextual education: explain features when first encountered, not in a manual

**When writing:**
- Lead with the recommendation, then provide supporting detail
- Structure content for skimmers: headers, bold, bullets
- Front-load value: "Here's what you should do. Here's why."

### Examples

✅ **Good Examples:**
- A form that pre-fills intelligent defaults with a small "Why we chose this" tooltip
- Progressive disclosure that shows essential options first, advanced settings behind a clearly labeled "Advanced" accordion
- E-commerce filtering that starts with "Most Popular" and shows it's selected
- Wizards that say "Most people choose X, but you can also Y or Z"
- Navigation that highlights the likely next step

❌ **Anti-Patterns to Avoid:**
- Dropdowns with 50 unsorted options and no recommendation
- Wizards that ask for every possible configuration upfront
- False equality: presenting all options as equally valid when they're not
- Hidden affordances that require discovery ("mystery meat navigation")
- Assuming users know industry jargon without explanation
- Tutorial overkill that prevents getting started ("watch this 10-minute video before using anything")

### Related Ocupop Values

- "Solutions, not options"
- "We take our role as a trusted expert very seriously"
- "User Experience Strategy" and "Critical User Journeys"

### When This Principle Conflicts

**Guidance vs. Flexibility:** Power users need control. The solution is progressive disclosure and smart defaults, not removing options. Make the simple case simple, and the complex case possible.

**Guidance vs. Honesty:** Sometimes the honest answer is "it depends on your needs." That's okay—explain the tradeoffs clearly and help users self-identify which path fits them.

---

## 4. Delight in Details

```yaml
id: "delight-in-details"
order: 4
category: "core-principle"
related_values: ["craft", "thoroughness", "care"]
keywords: ["edge-cases", "micro-interactions", "states", "polish", "attention"]
```

### Description

Sweat the small stuff that others overlook. The tiniest interactions, the most minor edge cases, the forgotten micro-moments—these reveal craft and care.

### Rationale

From Ocupop's "Midwest heart" comes attention to "things others might overlook." We're not creating award-bait or viral moments—we're creating experiences where every touchpoint feels considered.

The loading state, the empty state, the error state, the success confirmation—these "boring" moments are where trust is built. Users may not consciously notice these details, but they'll feel their absence. The difference between "this feels polished" and "this feels rushed" lives in the details.

### Application

**When designing states:**
- Don't just design the happy path
- Consider and design for: loading, empty, error, partial data, success, first-time, returning user
- Each state is an opportunity to communicate and help

**When writing micro-copy:**
- Every button label, helper text, placeholder, and confirmation message deserves thought
- Match tone to context (playful on success, serious on errors)
- Be specific, not generic ("Save draft" vs. "Save")

**When considering transitions:**
- How does one view connect to the next?
- What does motion communicate? (spatial relationships, cause/effect, progress)
- Is this transition necessary or just decorative?

**When handling edge cases:**
- What happens with: no data, one item, 1000 items, very long text, very short text?
- What if the user's name is "王秀英" or "María José" or "X Æ A-12"?
- What if they're on a slow connection? A small screen? Using a screen reader?

### Examples

✅ **Good Examples:**
- An empty state that explains what will appear here and offers clear next steps ("No projects yet. Create your first one →")
- Error messages that maintain brand voice and provide specific recovery actions ("We couldn't save your changes. Check your internet connection and try again.")
- Loading states that show progress and set expectations ("Uploading... This usually takes 30 seconds")
- Success confirmations that reinforce what just happened ("✓ Saved! Your changes are live at example.com/page")
- Thoughtful placeholder text that guides without patronizing
- Smooth, purposeful transitions that orient users

❌ **Anti-Patterns to Avoid:**
- Generic "Coming soon" or "No data available" without guidance
- Abrupt state changes with no transition or context
- Copy-pasted error messages that don't fit the context
- Designing only the ideal scenario (perfect data, no errors)
- Placeholder copy in production ("Lorem ipsum" anywhere)
- Inconsistent interaction patterns (button works this way here, that way there)
- Ignoring accessibility as an "edge case"

### Related Ocupop Values

- "Passionate about things others might overlook"
- "The tiniest of design details"
- "Spirited creativity, deep empathy, and a relentless focus"

### When This Principle Conflicts

**Details vs. Action:** Don't let perfecting edge cases block shipping core functionality. Solution: ship with edge cases handled gracefully (even if simply), then polish. "Handled" > "Ignored" > "Perfect."

**Details vs. Simplicity:** Sometimes the details feel cluttered. The solution is usually better execution, not fewer details. Can you communicate the same care more efficiently?

---

## 5. Collaborative Transparency

```yaml
id: "collaborative-transparency"
order: 5
category: "core-principle"
related_values: ["partnership", "openness", "shared-ownership"]
keywords: ["collaboration", "documentation", "communication", "process"]
```

### Description

Design is a team sport. Share work early and often, explain decisions clearly, and create artifacts that invite collaboration rather than demand approval.

### Rationale

"We don't work FOR our clients, we work WITH them." This means our design process must be transparent and inclusive. We show work-in-progress, explain our rationale, document decisions, and create tools that help non-designers participate meaningfully.

We're building together, which means everyone needs to understand the journey, not just see the destination. This requires vulnerability (showing work before it's perfect) and clarity (explaining why we made each choice). The result is better work and stronger relationships.

### Application

**When presenting designs:**
- Show the thinking, not just the outcome
- Explain what you tried, what didn't work, why this direction won
- Present options when there are genuinely multiple good paths (not false choices)
- Make it easy to give feedback: "Here are the specific decisions I need input on"

**When documenting:**
- Create artifacts others can actually use—not just designer-to-designer handoffs
- Write for your audience: developers need specs, clients need concepts, future-you needs rationale
- Document decisions: what was decided, why, what was considered and rejected
- Make files navigable: clear naming, organized layers, linked components

**When receiving feedback:**
- Distinguish between "this doesn't work for users" feedback and preference feedback
- Address the former, contextualize the latter ("I hear you prefer blue, and here's why we chose green for this use case")
- Ask clarifying questions: "When you say this feels cluttered, is it the density, the colors, or the lack of hierarchy?"
- Be open to being wrong—your job is good work, not defending your ideas

**When collaborating across disciplines:**
- Involve developers early (technical constraints inform design)
- Involve content strategists early (structure follows content)
- Involve stakeholders early (business constraints are real)
- Create shared artifacts: journey maps, definitions, success metrics

### Examples

✅ **Good Examples:**
- Design review decks that show: the problem, constraints, explorations attempted, rationale for final direction, specific feedback needed
- Developer handoff documentation with: interaction specs, all states, edge cases, accessibility requirements, motion timing
- Design systems that non-designers can navigate and use (clear naming, usage guidelines, do's and don'ts)
- Miro boards where stakeholders can add notes and reactions
- Changelog that explains what changed and why
- Office hours for questions and collaboration

❌ **Anti-Patterns to Avoid:**
- "Here's the final design" presentations with no context or process
- Dense Figma files only the creator can navigate (no organization, no comments)
- Defensive responses to stakeholder feedback ("You just don't understand design")
- Presenting only one option (takes away collaboration opportunity)
- Jargon-heavy explanations that exclude non-designers
- Treating feedback as attack rather than input
- Disappearing into design cave for weeks, emerging with "done" work
- No documentation of decisions (future team can't understand why things are the way they are)

### Related Ocupop Values

- "We don't work FOR our clients, we work WITH them"
- "Seamlessly and transparently sharing the good and the bad"
- "Being accountable"
- "Setting each other up for success"

### When This Principle Conflicts

**Transparency vs. Efficiency:** Sometimes explaining everything takes too long. Solution: match explanation depth to the stakes. Quick decisions need quick rationale. Big pivots need deep explanation.

**Transparency vs. Confidence:** Showing uncertainty can undermine client confidence. Solution: separate "we're exploring" moments from "here's our recommendation" moments. Both involve transparency, but different types.

---

# Foundations

Foundations are the building blocks that enable our principles. They define the concrete systems, standards, and approaches we use across projects.

---

## Accessibility

```yaml
id: "accessibility"
category: "foundation"
priority: "critical"
standards: ["WCAG 2.1 AA", "Section 508"]
keywords: ["wcag", "inclusive", "universal-design"]
```

### Philosophy

Accessibility is not a feature, a checklist, or an edge case—it's a baseline requirement for all work. We design for the widest possible range of human abilities from the start, not as an afterthought.

Good accessibility benefits everyone: captions help people in loud environments, keyboard navigation helps power users, clear language helps non-native speakers, and high contrast helps people using devices outdoors.

### Requirements

**All projects must meet WCAG 2.1 Level AA standards minimum.**

This includes:
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text and UI components
- Keyboard accessibility: all functionality available without a mouse
- Screen reader compatibility: semantic HTML, proper ARIA labels, logical navigation order
- Text alternatives: alt text for images, captions for video, transcripts for audio
- Flexible presentation: content works at 200% zoom, respects user font size preferences
- Clear language: plain language, avoid jargon, provide context

### Testing

**Every project should include:**
- Automated testing with tools like axe, WAVE, or Lighthouse
- Manual keyboard navigation testing
- Screen reader testing (VoiceOver on iOS/Mac, NVDA/JAWS on Windows)
- Color blindness simulation (Stark, Chrome DevTools)
- Zoom testing (200% minimum)
- Real user testing with people with disabilities when possible

### Resources

- [WebAIM: WCAG Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/)
- [Deque University](https://dequeuniversity.com/)

### Common Patterns

**Focus indicators:**
- Always visible when using keyboard navigation
- High contrast against all backgrounds
- Not removed without replacement
- Consistent across all interactive elements

**Form accessibility:**
- Visible labels (not just placeholders)
- Clear error messages associated with fields
- Logical tab order
- Grouped related fields with fieldsets

**Color usage:**
- Never rely on color alone to convey meaning
- Provide multiple indicators: color + icon, color + text, etc.
- Test for color blindness (red/green especially)

---

## Color

```yaml
id: "color"
category: "foundation"
keywords: ["palette", "contrast", "brand", "accessibility"]
```

### Philosophy

Color should serve hierarchy, guide attention, communicate meaning, and express brand personality—in that order. We use color purposefully, not decoratively.

Our approach balances brand expression with accessibility and usability. Every color choice should answer: "What is this communicating to the user?"

### Color Strategy by Project Type

**Brand Identity:**
- Primary palette: 2-3 colors that define the brand
- Extended palette: supporting colors for variety and application
- Always test for accessibility compliance
- Define usage: which color for what purpose?

**Digital Products:**
- Semantic color system: success, warning, error, info
- Neutral grays for structure and hierarchy
- Brand colors for identity and personality
- Background/surface/foreground relationships
- Light and dark mode considerations

**Data Visualization:**
- Colorblind-safe palettes
- Sufficient contrast for readability
- Consistent meaning across views
- Sequential, diverging, or categorical as appropriate

### Accessibility Requirements

**Text and backgrounds:**
- 4.5:1 contrast for normal text (under 18pt or 14pt bold)
- 3:1 contrast for large text (18pt+ or 14pt+ bold)
- 3:1 contrast for UI components and graphical objects

**Interactive elements:**
- Hover/focus states must be clearly distinguishable
- Active/selected states must be obvious
- Don't rely on color alone (add icons, text, patterns)

**Testing tools:**
- Contrast checkers (WebAIM, Stark, built into design tools)
- Color blindness simulators
- Grayscale testing (does hierarchy still work?)

### Best Practices

**Do:**
- Start with grayscale, add color purposefully
- Use color to reinforce hierarchy (not create it)
- Test in context (colors behave differently at different sizes and on different backgrounds)
- Document color meaning and usage
- Consider cultural associations

**Don't:**
- Use more colors than needed
- Use color as the only way to distinguish information
- Ignore accessibility contrast requirements
- Assume colors look the same on all devices
- Use pure black or pure white (almost never needed)

---

## Typography

```yaml
id: "typography"
category: "foundation"
keywords: ["type", "fonts", "readability", "hierarchy"]
```

### Philosophy

Typography is the voice of the written word. It sets tone, creates hierarchy, and ensures readability. Good typography is invisible until you need it—it serves the content, never overshadowing it.

We prioritize readability and accessibility, then layer in personality through thoughtful type choices.

### Type Selection Principles

**Web and digital products:**
- Prioritize performance (web fonts have file size costs)
- Ensure readability at small sizes (16px+ for body text)
- Test across devices and browsers
- Provide fallback fonts
- Use variable fonts when appropriate (one file, multiple weights)

**Brand identity:**
- Choose type that reinforces brand personality
- Ensure versatility (works at all sizes and applications)
- Consider licensing (desktop, web, app usage)
- Test in black and white first

### Hierarchy and Scale

**Establish clear typographic hierarchy:**
- Size, weight, and spacing create hierarchy
- Minimum 3 levels: heading, subheading, body
- Consistent scale across project (1.25, 1.5, or 2x are common)
- Line height: 1.4-1.6 for body text, tighter for headings
- Measure (line length): 50-75 characters for optimal readability

**Modular scale example:**
- Body: 16px
- Small: 14px
- H4: 18px (1.125x)
- H3: 20px (1.25x)
- H2: 24px (1.5x)
- H1: 32px (2x)
- Display: 40px+ (2.5x+)

### Accessibility

**Readability requirements:**
- Body text minimum 16px (1rem)
- Sufficient line height (1.5x minimum for body text)
- Adequate letter spacing (not too tight)
- Strong contrast between text and background
- Avoid ALL CAPS for long passages (harder to read)
- Use real italics, not fake (oblique)

**Responsive considerations:**
- Scale up for larger screens, maintain readability on small
- Increase line height on narrow columns
- Break long lines into shorter measures
- Consider reader modes and user font preferences

### Best Practices

**Do:**
- Limit to 2-3 font families per project
- Use real em dashes (—) not double hyphens (--)
- Set proper quotation marks (" " ' ') not straight quotes (" ')
- Use appropriate apostrophes (')
- Left-align text in Latin languages (easier to read)
- Use true small caps when available

**Don't:**
- Use too many weights (3-4 is usually enough)
- Fake bold or italic (use real font weights)
- Stretch or squash type
- Use decorative fonts for body text
- Set long passages in all caps
- Use center alignment for body text
- Use tiny font sizes (smaller than 14px for UI)

---

## Motion & Animation

```yaml
id: "motion"
category: "foundation"
keywords: ["animation", "transitions", "micro-interactions", "performance"]
```

### Philosophy

Motion should communicate, orient, and provide feedback—not just entertain. Every animation should have a purpose: showing spatial relationships, indicating progress, or confirming actions.

We use motion sparingly and purposefully. Too much animation is overwhelming and can trigger vestibular disorders. Motion should respect user preferences (respect `prefers-reduced-motion`).

### Timing

**Speed guidelines:**
- Quick (150-200ms): Micro-interactions, hovers, simple state changes
- Standard (300-400ms): Panel slides, dropdown menus, modals
- Deliberate (500-700ms): Page transitions, complex choreography
- Slow (800ms+): Rarely used, only for emphasis or complex sequences

**Easing functions:**
- `ease-out`: Objects enter quickly, decelerate (most common)
- `ease-in`: Objects exit slowly, accelerate
- `ease-in-out`: Smooth, equal acceleration/deceleration
- `linear`: Rare, feels robotic (use for looping animations)

### Purpose-Driven Animation

**Use motion to:**
- Show relationships: Where did this come from? Where is it going?
- Provide feedback: Confirm button presses, show loading, indicate success/error
- Guide attention: Draw eye to important changes
- Teach: Show how to interact with something
- Express brand personality: Match motion style to brand voice

**Don't use motion for:**
- Decoration alone (no purpose)
- Slowing users down ("Look how fancy our loader is!")
- Hiding bad UX (no amount of animation fixes poor information architecture)
- Causing motion sickness (respect reduced-motion preferences)

### Accessibility

**Required:**
- Respect `prefers-reduced-motion` media query
- Provide non-animated alternatives
- Never auto-play video with sound
- Avoid flashing/strobing (seizure risk)
- Allow users to pause animations

**Reduced motion mode:**
- Crossfades instead of slides
- Instant transitions instead of animated
- Static instead of animated illustrations
- All functionality still works

### Performance

**Motion must be performant:**
- Animate only `transform` and `opacity` (GPU-accelerated)
- Avoid animating: `width`, `height`, `top`, `left` (causes repaints)
- Use `will-change` sparingly (memory cost)
- Test on lower-end devices
- 60fps minimum, 120fps ideal for high-refresh displays

### Best Practices

**Do:**
- Use consistent timing across similar interactions
- Match motion to brand personality
- Test on actual devices (not just desktop browsers)
- Provide reduced-motion alternatives
- Make motion purposeful and directional

**Don't:**
- Animate everything (motion fatigue)
- Make users wait for animations to complete
- Use different timings for similar interactions
- Ignore performance impact
- Auto-play without user consent

---

## Layout & Spacing

```yaml
id: "layout"
category: "foundation"
keywords: ["grid", "spacing", "responsive", "structure"]
```

### Philosophy

Good layout creates visual hierarchy, guides the eye, and makes content scannable and digestible. Consistent spacing creates rhythm and professionalism.

We use systematic spacing scales (not arbitrary values) and responsive grids that adapt to any screen size. Layout should feel intentional, not haphazard.

### Spacing Scale

**Use consistent spacing values based on a scale:**

Common approach: 8px base unit
- 4px: Tight (letter spacing, small gaps)
- 8px: Compact (related items)
- 16px: Default (standard spacing)
- 24px: Comfortable (section spacing)
- 32px: Relaxed (between major sections)
- 48px: Loose (page sections)
- 64px+: Spacious (hero areas, major divisions)

**Why systematic spacing:**
- Creates visual rhythm and consistency
- Makes decisions easier (no debates about 17px vs 19px)
- Easier to maintain and scale
- More professional appearance

### Grid Systems

**Responsive grid principles:**
- 12-column grids are most flexible (divisible by 2, 3, 4, 6)
- Define breakpoints based on content, not devices
- Mobile-first approach (start small, scale up)
- Maintain gutters and margins at all sizes

**Common breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large: 1440px+

### Responsive Strategy

**Mobile-first approach:**
1. Design for smallest screen first
2. Add complexity as space allows
3. Use progressive enhancement
4. Test on actual devices

**Content priority:**
- What's essential on mobile?
- What can be revealed progressively?
- What can be reorganized for small screens?
- Are we hiding important content?

### Best Practices

**Do:**
- Use consistent spacing from your scale
- Establish clear content hierarchies
- Test at multiple viewport sizes
- Use flexible units (rem, em, %) where appropriate
- Consider touch targets on mobile (44px minimum)
- Group related items closer together
- Separate distinct sections with more space

**Don't:**
- Use random spacing values
- Make users horizontal scroll
- Hide critical content on mobile
- Assume all users have large screens
- Use fixed pixel widths for containers
- Forget about very small or very large screens
- Let content touch the edge of the screen (use margins)

---

# Patterns & Practices

Patterns are reusable solutions to common design problems. These have been proven through use across multiple projects.

---

## Progressive Disclosure

```yaml
id: "progressive-disclosure"
category: "pattern"
related_principles: ["guided-discovery", "action-over-perfection"]
keywords: ["complexity", "layering", "simplicity"]
```

### Problem

Users are overwhelmed by too much information or too many options at once, leading to decision paralysis or abandonment.

### Solution

Show essential information and functionality first, revealing additional details progressively as users need them. Start simple, add complexity as needed.

### When to Use

- Complex forms with many fields
- Feature-rich interfaces with advanced settings
- Onboarding flows
- Product catalogs with many options
- Settings and preferences
- Dashboards with multiple data views

### When Not to Use

- Critical safety information (never hide important warnings)
- Short, simple forms (more complexity than value)
- When all information is equally important
- Linear processes where all steps are essential

### Implementation

**Techniques:**
- Accordions for optional sections
- "Show advanced options" expansions
- Multi-step wizards for complex processes
- Tabs to organize related content
- Hover/focus reveals for supplementary info
- "Learn more" links for detailed explanations

**Best practices:**
- Always show what's hidden (don't hide entire features)
- Make it obvious something is expandable
- Remember user preferences (keep sections open if they expanded them)
- Provide shortcuts to jump to advanced features for power users

### Examples

✅ **Good:**
- Gmail compose: basic fields visible, CC/BCC revealed on click
- Form with "Basic info" shown, "Additional details" collapsed
- Settings with "Most used" section expanded, "Advanced" collapsed

❌ **Avoid:**
- Hiding required information behind multiple clicks
- Making commonly-used features hard to access
- Unclear affordances (users don't know something is expandable)

---

## Feedback Loops

```yaml
id: "feedback-loops"
category: "pattern"
related_principles: ["honest-over-pretty", "delight-in-details"]
keywords: ["feedback", "confirmation", "loading", "errors"]
```

### Problem

Users are uncertain about system state, whether their action succeeded, or what's happening next.

### Solution

Provide immediate, clear feedback for all user actions. Never leave users wondering if something worked or what's happening.

### When to Use

- Always. Every user action deserves feedback.
- Button clicks
- Form submissions
- File uploads
- Background processes
- State changes
- Errors and failures

### Implementation

**Types of feedback:**

**Immediate (< 100ms):**
- Button press states (active, hover)
- Checkbox toggles
- Drag and drop
- Text input acknowledgment

**Short-wait (100ms - 1s):**
- Simple animations
- Brief transitions
- "Saving..." indicators

**Long-wait (> 1s):**
- Progress indicators with time estimates
- Detailed status messages
- Cancel options
- What's happening explanations

**Permanent:**
- Success confirmations
- Error messages with recovery
- State changes that persist

### Best Practices

**Do:**
- Show immediate visual feedback (button depresses, checkbox fills)
- Provide progress indicators for waits over 1 second
- Explain what's happening: "Uploading your file..." not just a spinner
- Show success confirmations: "✓ Saved!"
- Make errors helpful: what happened, why, how to fix
- Allow canceling long operations
- Persist feedback (success message doesn't vanish too quickly)

**Don't:**
- Leave users wondering if click registered
- Use vague messages: "Processing..." (processing what?)
- Auto-dismiss messages too quickly (user might miss them)
- Show errors without explanations
- Block all interaction during loading (allow canceling)
- Use generic error messages: "Error 500" (explain in human terms)

### Examples

✅ **Good:**
- "Uploading resume.pdf... 3 of 5 MB uploaded (30 seconds remaining) [Cancel]"
- "✓ Changes saved! Your updates are live at example.com/page"
- "We couldn't process your payment. Your card was declined. Please check your card details and try again."

❌ **Avoid:**
- Silent failures (nothing happens, user doesn't know why)
- Spinners without context
- Error messages: "ERROR_CODE_2847"
- Success messages that vanish before you read them

---

## Empty States

```yaml
id: "empty-states"
category: "pattern"
related_principles: ["delight-in-details", "guided-discovery"]
keywords: ["onboarding", "first-use", "zero-data"]
```

### Problem

Users land on a screen with no content yet and aren't sure what this area is for or how to populate it.

### Solution

Design empty states that explain the purpose of the space, show what will appear here, and provide clear next steps to populate it.

### When to Use

- First-time app/feature use
- After deleting all items
- Search with no results
- Filtered views that match nothing
- Inbox zero states
- Dashboards before data exists

### Implementation

**Components of good empty states:**

1. **Explanation:** What is this area for?
2. **Preview:** What will appear here? (Optional screenshot or illustration)
3. **Action:** Clear next step to populate this area
4. **Alternative:** Or what else they can do

**Example structure:**
```
[Illustration]
No projects yet
Projects help you organize your work.
[Create your first project →]
or [Import existing projects]
```

### Best Practices

**Do:**
- Be specific about what goes here
- Show examples or illustrations
- Provide a clear call-to-action
- Match the tone of the empty state to its context
- Make the CTA the primary action
- Consider offering templates or examples to get started

**Don't:**
- Just say "No data" or "Empty" (not helpful)
- Leave users stranded without next steps
- Use generic messages across different empty states
- Make the empty state feel like an error (it's not, it's a starting point)

### Examples

✅ **Good:**
- Spotify: "You haven't saved any songs yet. Find something you like and tap the ♡"
- Trello: Shows a sample board with example cards
- GitHub: "Get started by creating a new repository" with big green button

❌ **Avoid:**
- "No results found." (Okay... now what?)
- "Nothing to see here."
- "Empty" (completely unhelpful)

---

# Decision Framework

When design principles conflict or choices aren't clear, use this framework to make decisions.

---

## Priority Hierarchy

When multiple principles or requirements conflict, use this priority order:

### 1. Safety & Accessibility (Non-negotiable)

- User safety (no patterns that risk harm)
- Accessibility standards (WCAG 2.1 AA minimum)
- Privacy and security
- Legal compliance

**These cannot be compromised.** If a design doesn't meet these requirements, it's not shippable.

### 2. Core Functionality (Essential)

- Does the primary task work?
- Can users complete their goal?
- Is performance acceptable?
- Does it solve the actual problem?

**Functionality over form.** Beautiful design that doesn't work is worthless.

### 3. Usability & Clarity (High Priority)

- Can users figure out how to use it?
- Is feedback clear?
- Are errors helpful?
- Does hierarchy guide users?

**If users can't figure it out, it doesn't matter how technically sound it is.**

### 4. Brand Expression (Important)

- Does it feel like Ocupop / the client's brand?
- Is the tone appropriate?
- Does it differentiate from competitors?

**Brand matters, but not at the expense of functionality or usability.**

### 5. Innovation & Delight (Nice to Have)

- Moments of surprise and delight
- Innovative interactions
- Personality and charm
- Polish and refinement

**These make good work great, but aren't required for launch.**

---

## Resolving Conflicts

### When Aesthetic Preferences Conflict with UX Best Practices

**Example:** Client wants to remove button labels for "cleaner" design, but users need labels to understand actions.

**Resolution:**
1. Explain the usability issue with data or examples
2. Show alternative ways to achieve clean aesthetic while maintaining usability
3. Test both versions if possible
4. Recommend the usable solution
5. Document if client overrides recommendation

**Principle:** Usability wins. Find creative ways to achieve aesthetic goals without sacrificing function.

---

### When Speed Conflicts with Quality

**Example:** Timeline requires shipping before everything is polished.

**Resolution:**
1. Define what's "must work" vs "nice to have"
2. Ship the must-have functionality
3. Plan polish for v2
4. Be honest about tradeoffs
5. Don't ship broken things to meet deadline

**Principle:** Action over perfection. Ship 90% solutions, iterate. But never ship functionally broken or inaccessible work.

---

### When Client Preference Conflicts with Design Principles

**Example:** Client loves animation on every interaction, but it slows down the experience and might cause accessibility issues.

**Resolution:**
1. Listen to understand why they want it (what problem are they solving?)
2. Explain concerns (performance, accessibility, user fatigue)
3. Show examples of purposeful motion vs. gratuitous motion
4. Propose compromise (motion in key moments, not everywhere)
5. Test with users if disagreement persists
6. Document final decision and rationale

**Principle:** We work WITH clients, not FOR them. Educate, collaborate, but ultimately respect client's choice while documenting our recommendation.

---

### When Innovation Conflicts with Familiarity

**Example:** Novel interaction pattern vs. standard pattern users already know.

**Resolution:**
1. Ask: Does the innovation provide significant value over the standard?
2. Consider: How much learning curve is acceptable?
3. Test: Do users understand the novel pattern quickly?
4. Decide: If the innovation solves a real problem better, use it. If it's just different for different's sake, use the familiar pattern.

**Principle:** Innovate where it matters. Use conventions where they serve users.

---

### When Business Goals Conflict with User Goals

**Example:** Business wants aggressive upsells, users find them annoying.

**Resolution:**
1. Find win-win solutions (timing, targeting, messaging)
2. Show how respecting users drives long-term business value
3. Test different approaches
4. Propose compromise (less aggressive but more effective)
5. Set metrics to measure impact

**Principle:** Great user experience IS good business. Find the overlap.

---

# Voice & Tone

How we communicate through design, writing, and interaction.

---

## Brand Voice Attributes

Ocupop's voice is:

**Real, Not Faux-Positive**
- Honest about challenges, transparent about limitations
- No corporate-speak or empty buzzwords
- Genuine enthusiasm, not forced cheerfulness
- Example: "This might take a minute" not "Please wait while we work our magic! ✨"

**Expert, Not Preachy**
- Confident in our recommendations
- Willing to explain why
- Respectful of client knowledge
- Example: "We recommend X because..." not "You should do X" (no explanation)

**Spirited, Not Chaotic**
- Energetic and engaged
- Playful when appropriate
- Professional without being stiff
- Example: "Let's make this happen" not "Let's synergize our core competencies"

**Direct, Not Blunt**
- Say what needs to be said
- Don't hide behind politeness
- Kind, but honest
- Example: "This won't work for your users" not "Interesting approach..."

---

## Tonal Shifts by Context

### Error Messages

**Tone:** Helpful and clear, never blame the user

**Approach:**
- Explain what happened (in human terms)
- Explain why it happened (if helpful)
- Provide clear next steps
- Take responsibility when it's our system

✅ **Good:**
- "We couldn't save your changes. Check your internet connection and try again."
- "This email is already in use. Try logging in or resetting your password."
- "Oops, that file is too large. We accept files up to 10MB. Try compressing your image."

❌ **Avoid:**
- "Invalid input."
- "Error code: 404"
- "Something went wrong." (Too vague)
- "You entered the wrong password." (Blaming)

---

### Success Confirmations

**Tone:** Satisfying and clear

**Approach:**
- Confirm what happened
- Explain the impact or next step
- Brief and to the point
- Celebrate big accomplishments, be matter-of-fact about small ones

✅ **Good:**
- "✓ Published! Your changes are live at example.com"
- "✓ Saved"
- "✓ Welcome aboard! Let's get your first project started."

❌ **Avoid:**
- "Successfully executed operation." (Too formal)
- "Yay! You did it! 🎉" (For every small action)
- No confirmation at all

---

### Onboarding

**Tone:** Welcoming and efficient

**Approach:**
- Get users to value quickly
- Explain as you go, don't lecture upfront
- Show, don't tell when possible
- Make skip/back options clear

✅ **Good:**
- "What brings you here today? [Options]"
- "Great! Here's a template to get started. You can customize it anytime."
- "Need help? Check out these examples →"

❌ **Avoid:**
- Forced tours of every feature
- "Welcome! Here are 47 things you can do..."
- No guidance at all

---

### Empty States

**Tone:** Encouraging and helpful

✅ **Good:**
- "No invoices yet. Create your first one →"
- "Your inbox is empty. Nice work!"

❌ **Avoid:**
- "Nothing here."
- "No data."

---

## Writing Principles

### Be Specific
- ❌ "Soon"
- ✅ "In about 30 seconds"

### Be Human
- ❌ "Execute query"
- ✅ "Search"

### Be Direct
- ❌ "It is recommended that you..."
- ✅ "We recommend..."

### Be Helpful
- ❌ "Invalid"
- ✅ "Passwords must be at least 8 characters"

### Be Honest
- ❌ "Please wait while we work our magic..."
- ✅ "Loading your data..."

---

# Appendix

---

## How to Use This Document

**For design decisions:**
1. Identify which principle(s) apply
2. Check if there are relevant patterns
3. Use the decision framework if principles conflict
4. Document your reasoning

**For design reviews:**
1. Evaluate against core principles
2. Check accessibility requirements
3. Review against relevant patterns
4. Discuss tradeoffs openly

**For onboarding:**
1. Read core principles first
2. Explore relevant foundations for your role
3. Review past projects through this lens
4. Ask questions in team discussions

---

## Proposing Changes

This is a living document. As we learn and evolve, so should our principles.

**To propose a change:**
1. Create a pull request or document with your proposal
2. Explain the rationale: Why is this change needed?
3. Show examples: Where would this apply?
4. Discuss in team meeting
5. Update after approval

**Review schedule:**
- Quarterly: Light review, minor updates
- Annual: Deep review, major revisions
- As needed: When project experiences reveal gaps

---

## AI Tool Context

This document provides context for AI-assisted design and development. When using Claude, GPT, or other AI tools with Ocupop projects:

**Include this document** as context to ensure:
- Generated designs align with Ocupop's principles
- Code follows accessibility and performance standards
- Copy matches our voice and tone
- Recommendations reflect our philosophy

**Use specific sections** as focused context:
- Core principles for high-level decisions
- Foundations for technical implementation
- Patterns for solving specific problems
- Voice & tone for writing

**Example prompt:**
```
Using Ocupop's design principle of "Honest Over Pretty" 
and "Delight in Details," create an error message for 
when a file upload fails due to size limits.
```

---

## Version History

**v1.0.0 (2025-10-24):**
- Initial draft
- 5 core principles established
- Foundations documented
- Key patterns defined
- Decision framework created
- Voice & tone guidelines added
- Awaiting Creative Director approval

---

## Credits & Acknowledgments

This document synthesizes 25 years of Ocupop's collective wisdom, client partnerships, and project learnings. It was created through research into industry-leading design systems (Apple HIG, Google Material Design 3) and adaptation to Ocupop's unique values and approach.

**Contributors:**
- [Team member names to be added]
- [Creative Director approval]

**Inspired by:**
- Apple Human Interface Guidelines
- Google Material Design 3
- 25 years of Ocupop project work
- Our mantra: "Getting Shit Done is our Love Language"

---

## Contact & Feedback

**Questions about these principles?**
- Slack: #design-principles
- Email: creative-director@ocupop.com
- Team meetings: Every [frequency]

**Found something unclear or missing?**
- Open a GitHub issue
- Bring it to design review
- Propose a change (see "Proposing Changes" above)

---

**Built WITH clients, not FOR them. Since 2000.**
