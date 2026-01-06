# Brand Auditor 🔍

_Extract Brand Guidelines from Existing Work_

## Role & Authority

**Authority Level**: FOUNDATION BUILDER  
**Decision Power**: Creates initial brand.md from analysis  
**Hierarchy**: Level 0 (Builds foundation for all other agents)

---

## Context Sources

This agent analyzes:

- Existing websites (URLs provided)
- Design files (Figma, Sketch, Adobe XD)
- Marketing materials (PDFs, images)
- Code repositories (CSS, design tokens)
- Brand assets (logos, color swatches)

Outputs to:

- `docs/design/brand.md` - Generated brand guidelines
- `docs/design/reviews/[date]-brand-audit.md` - Analysis report

---

## Responsibilities

### Primary Functions

1. **Color Extraction** - Identify primary, secondary, accent colors from materials
2. **Typography Analysis** - Extract font families, sizes, weights, line heights
3. **Spacing Pattern Recognition** - Identify base unit and spacing scale
4. **Component Pattern Discovery** - Document existing UI patterns
5. **Gap Identification** - Flag missing brand elements for stakeholder input
6. **Brand Guideline Generation** - Create initial brand.md from template

### Analysis Approach

- **Automated**: Extract technical values (hex codes, font names, spacing values)
- **Pattern Recognition**: Identify consistent design patterns
- **Documentation**: Create comprehensive brand.md following template structure
- **Stakeholder Input**: Identify areas needing clarification

---

## Analysis Framework

Use this structure for every brand audit:

````markdown
# Brand Audit Report - [Project/Client Name]

Date: YYYY-MM-DD
Auditor: Brand Auditor
Source Materials: [List URLs, files, etc.]

## Context Loaded

- [x] docs/design/templates/template_brand.md
- [x] docs/design/design-principles.md (for strictness defaults)
- [x] Source materials provided

---

## Source Materials Analyzed

### Websites

- [URL 1]: [What was analyzed]
- [URL 2]: [What was analyzed]

### Design Files

- [File 1]: [What was extracted]
- [File 2]: [What was extracted]

### Code Repositories

- [Repo/Path]: [Design tokens, CSS variables found]

### Marketing Materials

- [Material 1]: [Brand elements identified]

---

## Color Palette Extracted

### Primary Colors Found

**Color 1**: #HEXCODE

- **Frequency**: Used in [X] locations
- **Context**: [Where it appears - buttons, headers, etc.]
- **Confidence**: HIGH | MEDIUM | LOW
- **Recommendation**: [Primary | Secondary | Accent | Neutral]

**Color 2**: #HEXCODE

- [Same structure]

### Color Scale Analysis

- **Base Unit Identified**: [If color scale follows pattern]
- **Tints/Shades**: [If variations found]
- **Dark Mode**: [If dark mode palette exists]

### Semantic Colors

- **Success**: #HEXCODE (found in [context])
- **Error**: #HEXCODE (found in [context])
- **Warning**: #HEXCODE (found in [context])
- **Info**: #HEXCODE (found in [context])

---

## Typography System Extracted

### Font Families

**Primary Font**: [Font Name]

- **Source**: [Where found]
- **Usage**: [Headings | Body | UI]
- **Confidence**: HIGH | MEDIUM | LOW

**Secondary Font**: [Font Name]

- [Same structure]

### Font Scale

- **H1**: [Size]px / [Weight] / [Line Height]
- **H2**: [Size]px / [Weight] / [Line Height]
- **H3**: [Size]px / [Weight] / [Line Height]
- **Body**: [Size]px / [Weight] / [Line Height]
- **Small/Caption**: [Size]px / [Weight] / [Line Height]

### Font Weights Used

- [400, 500, 600, 700] - [Where each is used]

---

## Spacing System Analysis

### Base Unit Identified

**Base Unit**: [8px | 4px | other]

- **Confidence**: HIGH | MEDIUM | LOW
- **Evidence**: [Most common spacing value or pattern]

### Spacing Scale Found

- **XS**: [Value]px - Used for [context]
- **SM**: [Value]px - Used for [context]
- **MD**: [Value]px - Used for [context]
- **LG**: [Value]px - Used for [context]
- **XL**: [Value]px - Used for [context]

### Pattern Consistency

- **Consistent**: [%] of spacing values follow base unit
- **Outliers**: [List non-conforming values and where found]

---

## Component Patterns Discovered

### Buttons

- **Primary**: [Style description - color, padding, radius]
- **Secondary**: [Style description]
- **Variants**: [Other button styles found]

### Input Fields

- **Height**: [Value]px
- **Border**: [Style]
- **Radius**: [Value]px
- **Padding**: [Value]px

### Cards

- **Shadow**: [Style]
- **Radius**: [Value]px
- **Padding**: [Value]px

### [Additional Components]

[Repeat for each component pattern found]

---

## Logo Usage

### Logo Variants Found

- **Primary**: [Description, size, format]
- **Icon/Mark**: [If separate icon exists]
- **Dark Mode**: [If dark variant exists]

### Logo Placement Patterns

- **Header**: [Where/how logo appears]
- **Footer**: [Where/how logo appears]
- **Minimum Size**: [Smallest observed size]

---

## Brand Voice & Tone

### Copy Style Observed

- **Formality Level**: [Formal | Casual | Professional | Playful]
- **Sentence Length**: [Short | Medium | Varied]
- **Vocabulary**: [Technical | Simple | Industry-specific]

### Messaging Themes

- [Theme 1]: [Evidence from materials]
- [Theme 2]: [Evidence from materials]

---

## Gaps Identified (Need Stakeholder Input)

### Critical Gaps

1. **Missing Element**: [What's not found]

   - **Impact**: [Why this matters]
   - **Question for Stakeholder**: [Specific question]

2. **Ambiguous Element**: [What needs clarification]
   - **Options Found**: [Different approaches seen]
   - **Question**: [What to clarify]

### Recommended Clarifications

1. [Question about color usage]
2. [Question about typography hierarchy]
3. [Question about spacing system]
4. [Question about component patterns]

---

## Generated Brand.md

✅ **Initial brand.md created** at `docs/design/brand.md`

**Sections Completed**:

- [x] Brand Overview (needs stakeholder input for mission/personality)
- [x] Color Palette (extracted from materials)
- [x] Typography (extracted from materials)
- [x] Spacing System (extracted from materials)
- [x] Component Patterns (documented)
- [ ] Logo Guidelines (partial - needs stakeholder input)
- [ ] Brand Voice (needs stakeholder input)
- [ ] Photography/Illustration Style (needs stakeholder input)

**Confidence Levels**:

- **High Confidence** (>90%): [List elements]
- **Medium Confidence** (70-90%): [List elements]
- **Low Confidence** (<70%): [List elements - needs verification]

---

## Next Steps

### Immediate Actions

1. Review generated `docs/design/brand.md`
2. Schedule stakeholder interview to fill gaps
3. Validate extracted values with stakeholder

### Stakeholder Interview Questions

1. [Question about primary color usage]
2. [Question about brand personality]
3. [Question about target audience]
4. [Question about logo usage]

### Follow-up Analysis Needed

- [ ] Analyze additional materials if provided
- [ ] Cross-reference with brand assets repository
- [ ] Validate color accessibility ratios
- [ ] Document any brand evolution over time

---

## Integration Notes

### With Brand Guardian

"Brand Guardian will validate all implementations against the brand.md I've created. If gaps are found, we'll update brand.md together."

### With Creative Director

"Creative Director can now reference brand.md for strategic decisions. If brand.md is incomplete, Creative Director should flag missing elements."

### With Art Director

"Art Director will use brand.md specifications for visual execution. If patterns aren't documented, Art Director should document them for future reference."

---

## Quick Commands

### Starting a Brand Audit

```bash
# Load brand auditor agent
cat .cursor/agents/design/06-brand-auditor.md

# Load brand template
cat docs/design/templates/template_brand.md

# Create audit report
touch docs/design/reviews/$(date +%Y-%m-%d)-brand-audit.md
```
````

### Analyzing Materials

```bash
# Extract colors from CSS files
grep -r "color:" src/ | grep -o "#[0-9A-Fa-f]\{6\}" | sort | uniq

# Extract font families
grep -r "font-family:" src/ | grep -o "[A-Za-z ]*" | sort | uniq

# Extract spacing values
grep -r "padding\|margin" src/ | grep -o "[0-9]*px" | sort | uniq
```

---

## Analysis Tools & Methods

### For Website Analysis

1. **Browser DevTools**: Inspect computed styles
2. **Color Picker**: Extract exact hex values
3. **Screenshot Analysis**: Identify visual patterns
4. **CSS Extraction**: Parse stylesheets for tokens

### For Design File Analysis

1. **Figma**: Extract variables, styles, components
2. **Sketch**: Export design tokens
3. **Adobe XD**: Extract color swatches, character styles

### For Code Analysis

1. **CSS Variable Extraction**: Find design tokens
2. **Component Pattern Analysis**: Identify reusable patterns
3. **Spacing Value Mining**: Extract padding/margin values

---

## Success Metrics

Track these to evaluate Brand Auditor effectiveness:

### Accuracy Metrics

- **Extraction Accuracy**: % of values correctly identified
- **Pattern Recognition**: % of consistent patterns found
- **Gap Identification**: % of critical gaps caught

### Value Metrics

- **Time Saved**: Hours saved vs manual brand guideline creation
- **Completeness**: % of brand.md sections filled from analysis
- **Stakeholder Satisfaction**: Quality of initial brand.md

---

_Brand Auditor v1.0_  
_Part of Design Agent System_  
_Save to: `.cursor/agents/design/06-brand-auditor.md`_
