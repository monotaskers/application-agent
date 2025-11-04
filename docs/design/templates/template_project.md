# [Project Name] - Design Requirements

**Project Type**: [Website / Web App / Mobile App / Platform / etc.]  
**Timeline**: [Start Date] - [Target Launch Date]  
**Status**: 🔄 Planning | 🚧 In Progress | ✅ Complete  
**References**: docs/design/principles.md, docs/design/brand.md

> Copy this template to `docs/design/project.md` and customize for each project

---

## Project Overview

### Primary Goal
[What is the #1 objective this project must achieve?]

### Secondary Goals
1. [Goal 2]
2. [Goal 3]
3. [Goal 4]

### Success Metrics
Define how you'll measure success:

- **Metric 1**: [e.g., User conversion rate] - Target: [e.g., 15%]
- **Metric 2**: [e.g., Average session duration] - Target: [e.g., 5 min]
- **Metric 3**: [e.g., Task completion rate] - Target: [e.g., 90%]
- **Metric 4**: [e.g., User satisfaction score] - Target: [e.g., 4.5/5]

### Target Audience

**Primary Persona**: [Name/Description]
- **Demographics**: [Age, location, occupation, etc.]
- **Technical Proficiency**: [Novice / Intermediate / Advanced]
- **Goals**: [What they want to accomplish]
- **Pain Points**: [What frustrates them]
- **Devices**: [Mobile-first / Desktop-first / Equal]

**Secondary Persona**: [If applicable]
- [Same structure as above]

---

## Design Requirements

### Brand & Principles Relationship

**Extends brand.md**: [How this project applies brand guidelines]

**Applies principles.md**: [Which principles are most critical for this project]

**Unique to This Project**: [What makes this project different]

### Overall Visual Treatment

**Desired Feel**: [Modern / Classic / Playful / Professional / Bold / Minimal / etc.]

**Key Differentiator**: [What makes this project's design unique]

**Inspiration**: [Links to mood boards, competitor sites, design references]

### Project-Specific Design Guidelines

List requirements that extend or override brand.md:

#### 1. [Requirement Name]
- **Description**: [Clear explanation of the requirement]
- **Rationale**: [Why this is important for this project]
- **Strictness**: 🔴 HIGH | 🟡 MEDIUM | 🟢 LOW
- **Brand Alignment**: [How this relates to brand.md]
- **Principle Reference**: [Related principle from principles.md]
- **Examples**: [Show what this looks like]

#### 2. [Requirement Name]
[Same structure]

#### 3. [Requirement Name]
[Same structure]

---

## Responsive Strategy

> Implements principles.md "Responsive Design" section

### Device Priorities

**Primary**: [Mobile / Tablet / Desktop]  
**Secondary**: [Next priority]  
**Tertiary**: [Least critical but supported]

**Rationale**: [Why this priority order - based on analytics, audience, etc.]

### Mobile Considerations
- [Specific mobile-first requirements]
- [Touch interactions needed]
- [Mobile performance targets]
- [Offline capabilities if needed]

### Tablet Considerations
- [How tablet experience differs from mobile/desktop]
- [Landscape vs portrait considerations]

### Desktop Considerations
- [Large screen optimizations]
- [Multi-column layouts]
- [Hover states and interactions]

---

## Performance Requirements

> Implements principles.md "Performance" section

### Performance Targets

**Lighthouse Scores** (minimum):
- Performance: [Target score, e.g., >90]
- Accessibility: [Target score, e.g., 100]
- Best Practices: [Target score, e.g., >90]
- SEO: [Target score, e.g., >90]

### Core Web Vitals

- **LCP** (Largest Contentful Paint): [< 2.5s]
- **FID** (First Input Delay): [< 100ms]
- **CLS** (Cumulative Layout Shift): [< 0.1]

### Additional Metrics

- **First Contentful Paint**: [< 1.5s]
- **Time to Interactive**: [< 3.5s]
- **Total Page Weight**: [< 2MB for initial load]
- **JavaScript Bundle Size**: [< 500KB]
- **Image Optimization**: [All images WebP, lazy-loaded]

**Special Considerations**: [e.g., International users, slow connections, etc.]

---

## Page/Section Requirements

### [Page/Section Name - e.g., Homepage]

**Purpose**: [What this page accomplishes]

**Priority**: 🔴 Critical | 🟡 High | 🟢 Medium | ⚪ Low

#### Key Elements
- [ ] [Element 1 - e.g., Hero with value proposition]
- [ ] [Element 2 - e.g., Social proof section]
- [ ] [Element 3 - e.g., Feature highlights]
- [ ] [Element 4 - e.g., CTA above fold]

#### Design Notes
- **Hero Section**: [Specific requirements]
- **Layout**: [Grid, sections, structure]
- **Content Strategy**: [Key messages, CTAs]
- **Interactions**: [Animations, hover states, etc.]

#### Success Criteria
- [ ] [Criterion 1 - e.g., Value prop clear in <3 seconds]
- [ ] [Criterion 2 - e.g., CTA visible without scrolling]
- [ ] [Criterion 3 - e.g., Mobile load time <2s]

---

### [Page/Section Name - e.g., Dashboard]

**Purpose**: [What this page accomplishes]

**Priority**: [Level]

#### Key Elements
- [ ] [Element 1]
- [ ] [Element 2]

#### Design Notes
[Specific requirements]

#### Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

### [Additional Pages]
[Repeat structure for each major page/section]

---

## Component Requirements

> Implements principles.md "Components" section

### Custom Components Needed

List components unique to this project (beyond standard UI components):

#### [Component Name - e.g., Data Visualization Card]

**Purpose**: [What this component does]

**Variants**:
- Default: [Description]
- [Variant 2]: [Description]
- [Variant 3]: [Description]

**States**:
- Default: [Visual appearance]
- Hover: [Interaction feedback]
- Active/Focus: [Selected state]
- Loading: [Loading treatment]
- Error: [Error state]
- Empty: [Empty state]
- Disabled: [Disabled appearance]

**Special Considerations**:
- [Accessibility requirement]
- [Performance consideration]
- [Edge case handling]

**Principle References**:
- [Related principle from principles.md]
- [Strictness level and why]

**Brand References**:
- [How this uses brand.md specifications]

---

## User Flows

> Critical paths users will take through the product

### Flow 1: [Flow Name - e.g., Sign-up to First Action]

**Priority**: 🔴 Critical

**Steps**:
1. **[Step 1]** - [User action]
   - Design requirement: [What's needed]
   - Success indicator: [How user knows it worked]
   
2. **[Step 2]** - [User action]
   - Design requirement: [What's needed]
   - Success indicator: [How user knows it worked]

3. **[Step 3]** - [User action]
   - Design requirement: [What's needed]
   - Success indicator: [How user knows it worked]

**Success State**: [What user sees/experiences when flow completes]

**Error Handling**: [How errors are communicated and resolved]

**Design Considerations**:
- Each step should take < [X] seconds
- Progress indicator visible (principles.md feedback guidelines)
- Allow users to save and return
- Keyboard accessible (principles.md accessibility)
- Clear back/cancel options

---

### Flow 2: [Flow Name]
[Same structure]

---

## Content Strategy

### Messaging Priorities

**Primary Message**: [The #1 thing users should understand]

**Supporting Messages**:
1. [Key point 1]
2. [Key point 2]
3. [Key point 3]

### Tone for This Project

> Adapts brand.md tone/voice for project-specific context

**Overall Tone**: [How this project's tone differs from general brand]

**Context-Specific Adjustments**:
- [Situation 1]: [Tone adjustment]
- [Situation 2]: [Tone adjustment]

**Messaging Examples**:
- **Good**: [Example of on-brand messaging]
- **Bad**: [Example of off-brand messaging]

### Microcopy Requirements

**Error Messages**: [Empathetic, actionable, specific]
**Empty States**: [Helpful, guiding next action]
**Success Messages**: [Celebratory, clear confirmation]
**Loading States**: [Informative, reduces uncertainty]

---

## Technical Constraints

### Technology Stack

**Frontend**: [e.g., Next.js 14, React 18, TypeScript]  
**Styling**: [e.g., Tailwind CSS, CSS Modules, Styled Components]  
**Backend**: [e.g., Node.js, Python, etc.]  
**Database**: [e.g., PostgreSQL, MongoDB]  
**Hosting**: [e.g., Vercel, AWS, etc.]

### Browser Support

> Per principles.md requirements

**Desktop Browsers**:
- Chrome/Edge: [Last 2 versions]
- Safari: [Last 2 versions]
- Firefox: [Last 2 versions]

**Mobile Browsers**:
- Mobile Safari: [iOS 14+]
- Chrome Mobile: [Last 2 versions]
- Samsung Internet: [Last 2 versions]

### Known Technical Limitations

List any constraints that affect design:
- [Limitation 1 and its design impact]
- [Limitation 2 and its design impact]
- [Limitation 3 and its design impact]

### Third-Party Integrations

List services that need design consideration:
- [Service 1 - e.g., Payment processor] - [Design consideration]
- [Service 2 - e.g., Analytics] - [Design consideration]

---

## Accessibility Requirements

> Implements principles.md "Accessibility" section (Strictness: 🔴 HIGH)

### Compliance Standard

**Minimum**: WCAG 2.1 Level AA (per principles.md)  
**Goal**: WCAG 2.1 Level AAA where possible

### Project-Specific Accessibility Needs

Beyond standard WCAG compliance, this project requires:

1. **[Requirement 1]**
   - **Description**: [e.g., Screen reader support for financial data]
   - **Rationale**: [Why this is critical for this project]
   - **Implementation**: [How to achieve this]

2. **[Requirement 2]**
   - **Description**: [e.g., Extra large text option]
   - **Rationale**: [e.g., Elderly user base]
   - **Implementation**: [Text scaling beyond 200%]

### Assistive Technology Testing

**Required Testing**:
- [ ] Screen reader (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation
- [ ] Voice control
- [ ] Screen magnification
- [ ] [Other specific requirements]

---

## Design Deliverables

### Phase 1: Discovery & Planning
- [ ] User research summary
- [ ] Competitive analysis
- [ ] User personas
- [ ] Information architecture
- [ ] Sitemap
- [ ] User flow diagrams

### Phase 2: Design
- [ ] Wireframes (all key pages)
- [ ] High-fidelity mockups (desktop)
- [ ] High-fidelity mockups (mobile)
- [ ] High-fidelity mockups (tablet)
- [ ] Interactive prototype
- [ ] Component specifications
- [ ] Motion/animation specifications
- [ ] Icon set (custom icons if needed)

### Phase 3: Documentation
- [ ] Component library documentation
- [ ] Design system documentation
- [ ] Handoff documentation for developers
- [ ] Style guide

### Phase 4: Support
- [ ] QA review participation
- [ ] Developer support during build
- [ ] Feedback iteration
- [ ] Launch support

---

## Approval Process

### Design Review Milestones

**Milestone 1: Wireframes**
- **Reviewers**: [Stakeholder names]
- **Approval Criteria**: [What needs to be approved]
- **Timeline**: [Date/timeframe]

**Milestone 2: Visual Design**
- **Reviewers**: [Stakeholder names]
- **Approval Criteria**: [What needs to be approved]
- **Timeline**: [Date/timeframe]

**Milestone 3: Prototype**
- **Reviewers**: [Stakeholder names]
- **Approval Criteria**: [What needs to be approved]
- **Timeline**: [Date/timeframe]

**Milestone 4: Final Approval**
- **Reviewers**: [Stakeholder names]
- **Approval Criteria**: [What needs to be approved]
- **Timeline**: [Date/timeframe]

### Revision Policy

**Included Revisions**: [Number of revision rounds included]  
**Additional Revisions**: [How handled if needed]  
**Scope Changes**: [Process for scope changes]

---

## Open Questions / Decisions Pending

> Document open items that need resolution before proceeding

### Design Decisions Needed

#### 1. [Question/Decision]
- **Issue**: [What needs to be decided]
- **Impact**: [How this affects design/timeline]
- **Options**:
  - **Option A**: [Description, pros/cons]
  - **Option B**: [Description, pros/cons]
  - **Option C**: [Description, pros/cons]
- **Principle Consideration**: [Relevant principle from principles.md]
- **Recommendation**: [Design team recommendation if any]
- **Owner**: [Who will make final decision]
- **Due Date**: [When decision is needed]
- **Status**: 🔴 Blocking | 🟡 Important | 🟢 Nice to Know

#### 2. [Next Question]
[Same structure]

---

## Timeline & Milestones

### Design Phase Schedule

**Week 1-2: Discovery**
- User research
- Competitive analysis
- Information architecture

**Week 3-4: Wireframes**
- Low-fidelity wireframes
- User flow mapping
- Stakeholder review

**Week 5-7: Visual Design**
- High-fidelity mockups
- Component design
- Design system refinement

**Week 8-9: Prototyping**
- Interactive prototype
- User testing
- Iteration

**Week 10: Handoff**
- Documentation
- Developer handoff
- Component specs finalized

### Development Handoff

**Handoff Date**: [Planned date]

**Included in Handoff**:
- [ ] All design files (Figma/Sketch links)
- [ ] Exported assets (organized in `docs/assets/`)
- [ ] Component specifications
- [ ] Design tokens (CSS/JSON)
- [ ] Animation specifications
- [ ] Responsive behavior documentation
- [ ] Accessibility annotations

**Developer Meeting**: [Scheduled date for walkthrough]

---

## Risk Assessment

### Design Risks

#### Risk 1: [Risk Description]
- **Likelihood**: [High / Medium / Low]
- **Impact**: [High / Medium / Low]
- **Mitigation**: [How to prevent or minimize]

#### Risk 2: [Risk Description]
[Same structure]

### Dependencies

**Design Dependencies**:
- [Dependency 1] - [Impact if not met]
- [Dependency 2] - [Impact if not met]

**External Dependencies**:
- [External factor] - [How this affects design]

---

## Resources & References

### Inspiration

**Mood Boards**: [Links]  
**Reference Sites**: [URLs of inspirational examples]  
**Competitor Analysis**: [Links to analysis docs]

### Related Projects

**Similar Work**: [Links to similar projects from portfolio]  
**Patterns to Reuse**: [What can be adapted from previous work]

### Stakeholder Materials

**Brand Guidelines**: [If provided separately]  
**Content Strategy**: [Link to content doc]  
**Business Requirements**: [Link to BRD/PRD]

---

## Agent Instructions

> Guidance for design agents working on this project

### For Creative Director
- Reference project goals for all strategic decisions
- Balance [specific considerations] unique to this project
- Open questions [list numbers] need resolution before proceeding
- Coordinate with [stakeholder name] on [specific areas]

### For Art Director
- Emphasize [specific visual direction]
- Component [X] is highest priority
- [Specific brand considerations] for this project
- Reference [specific inspiration] for visual direction

### For Brand Guardian
- Project-specific strictness overrides: [List any]
- Pay special attention to [specific brand elements]
- [Unique requirement] requires interpretation

### For UI Analyzer
- Performance is critical: [Specific targets]
- Test thoroughly at [specific breakpoints]
- [Unique validation requirements]

### For Accessibility Champion
- [Project-specific accessibility needs]
- [User base considerations]
- [Required assistive technology testing]

---

## Project-Specific Notes

### Unique Challenges
[Any special considerations or challenges for this project]

### Opportunities
[Unique opportunities this project presents]

### Lessons from Similar Projects
[What to repeat or avoid based on experience]

---

*This project.md extends docs/design/brand.md and docs/design/principles.md with project-specific requirements.*  
*Last Updated: [Date]*  
*Version: 1.0*

---

## Template Usage Instructions

**When starting a new project**:

1. Copy this file to `docs/design/project.md`
2. Fill in all `[placeholders]` with specific project information
3. Delete sections that don't apply to your project
4. Add custom sections for unique project needs
5. Review with stakeholders for alignment
6. Update as project evolves
7. Keep version and date current

**Keep This Updated**:
- This is a living document
- Update when requirements change
- Document decisions as they're made
- Keep agents informed of project evolution
