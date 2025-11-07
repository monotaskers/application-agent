# Design Agent System - Quick Start Guide

## 🎉 What You Have

### 6 Agent Profiles (Save to `.claude/agents/design/`)

1. **01-brand-guardian.md** - Brand compliance enforcer
2. **02-creative-director.md** - Strategic design decisions  
3. **03-art-director.md** - Visual execution
4. **04-ui-analyzer.md** - Automated testing with Playwright
5. **05-accessibility-champion.md** - WCAG compliance
6. **06-brand-auditor.md** - Extract guidelines from existing work

### 2 Template Files (Save to `docs/design/templates/`)

1. **brand-template.md** - Complete brand guidelines template
2. **project-template.md** - Project-specific requirements template

---

## 🚀 Setup Instructions

### Step 1: Create Directory Structure

```bash
# In your project starter repository
mkdir -p .claude/agents/design
mkdir -p .claude/design-reviews
mkdir -p docs/design/templates
mkdir -p docs/design
mkdir -p docs/assets/{logos,icons,design-tokens}
```

### Step 2: Add Agent Files

Copy each agent profile to `.claude/agents/design/`:

```
.claude/agents/design/
├── 01-brand-guardian.md
├── 02-creative-director.md
├── 03-art-director.md
├── 04-ui-analyzer.md
├── 05-accessibility-champion.md
└── 06-brand-auditor.md
```

### Step 3: Add Templates

Copy templates to `docs/design/templates/`:

```
docs/design/templates/
├── brand-template.md
└── project-template.md
```

### Step 4: Create Your principles.md

Create `docs/design/principles.md` with YOUR core design philosophy (not included - this is unique to your company).

**Suggested sections**:
- Core Philosophy
- Layout & Hierarchy (Strictness: 🔴 HIGH)
- Color (Strictness: 🟡 MEDIUM)
- Typography (Strictness: 🔴 HIGH)
- Spacing (Strictness: 🔴 HIGH)
- Components (Strictness: 🟡 MEDIUM)
- Interaction (Strictness: 🟢 LOW)
- Accessibility (Strictness: 🔴 HIGH - Non-negotiable)
- Responsive Design (Strictness: 🔴 HIGH)
- Performance (Strictness: 🟡 MEDIUM)
- Content (Strictness: 🟢 LOW)

---

## 📋 Using the System

### For Each New Client Project

#### 1. Clone Your Starter
```bash
git clone your-starter-repo new-client-project
cd new-client-project
```

#### 2. Create Project Documentation

**Option A: Client Has Brand Guidelines**
```bash
# Copy and customize brand template
cp docs/design/templates/brand-template.md docs/design/brand.md
# Edit brand.md with client's brand info
```

**Option B: Client Has Existing Work But No Guidelines**
```bash
# Use Brand Auditor agent
cat .claude/agents/design/06-brand-auditor.md

# Brand Auditor will:
# - Analyze existing website/materials
# - Extract colors, typography, spacing
# - Generate initial brand.md
# - Identify gaps for stakeholder interview
```

**Option C: Starting From Scratch**
```bash
# Work with stakeholder to define brand
# Then fill in brand-template.md
```

#### 3. Create Project Requirements
```bash
# Copy project template
cp docs/design/templates/project-template.md docs/design/project.md
# Customize with project-specific needs
```

#### 4. You're Ready!

Your project now has:
- ✅ All 6 design agents ready to use
- ✅ `docs/design/principles.md` (your standards)
- ✅ `docs/design/brand.md` (client brand)
- ✅ `docs/design/project.md` (project requirements)

---

## 🎯 Daily Workflow

### Starting a New Feature

```bash
# 1. Load design context
cat docs/design/principles.md
cat docs/design/brand.md
cat docs/design/project.md

# 2. Creative Direction
cat .claude/agents/design/02-creative-director.md
# Use Creative Director to define strategic approach
# Save output to .claude/design-reviews/YYYY-MM-DD-[feature]-creative.md

# 3. Art Direction
cat .claude/agents/design/03-art-director.md
# Use Art Director to define visual execution
# Append to same design review file

# 4. Implementation
# Developer/Cody builds the feature

# 5. Brand Validation
cat .claude/agents/design/01-brand-guardian.md
# Use Brand Guardian to validate compliance
# Save output to .claude/design-reviews/YYYY-MM-DD-[feature]-compliance.md

# 6. Automated Testing (if setup)
npm run test:design
# UI Analyzer generates automated report

# 7. Accessibility Review
cat .claude/agents/design/05-accessibility-champion.md
# Use Accessibility Champion for WCAG validation
# Save output to .claude/design-reviews/YYYY-MM-DD-[feature]-accessibility.md
```

---

## 🔧 Context Window Status

**Current Usage**: ~115K tokens / 190K available  
**Remaining**: ~75K tokens (~39% remaining)

**We have capacity to**:
- ✅ Create setup automation scripts
- ✅ Design Playwright test structure in detail
- ✅ Answer questions and make refinements
- ⚠️ If creating more comprehensive content, may need new session

---

## 💡 Next Steps You Might Want

### Immediate
1. **Save all artifacts** to your project starter
2. **Create principles.md** with your design philosophy
3. **Test with a pilot project**

### Soon
1. **Setup Playwright** tests for UI Analyzer
2. **Create automation scripts** for project initialization
3. **Build component library** that references brand.md
4. **Create Figma/design tool** integration

### Later
1. **Train team** on using the agent system
2. **Gather metrics** on agent effectiveness
3. **Refine agents** based on real-world usage
4. **Create video tutorials**

---

## 🎓 How Agents Work Together

```
New Feature Request
        ↓
Creative Director (Strategic approach)
        ↓
Art Director (Visual execution)
        ↓
Implementation (Developer/Cody)
        ↓
Brand Guardian (Compliance check)
        ↓
UI Analyzer (Automated testing)
        ↓
Accessibility Champion (WCAG validation)
        ↓
Ship Feature ✅
```

**Parallel Paths**:
- Brand Guardian can run during implementation
- UI Analyzer runs automatically in CI/CD
- Accessibility Champion reviews anytime

**Hierarchical Authority**:
- Level 0: Brand Auditor (builds foundation)
- Level 1: Brand Guardian (veto power)
- Level 2: Creative Director (strategic)
- Level 3: Art Director (execution)
- Level 4: UI Analyzer (validation)
- Level 5: Accessibility Champion (non-negotiable)

---

## 📚 Key Files Reference

### Agent Files (`.claude/agents/design/`)
- Each agent is a standalone markdown file
- Load into Claude Desktop or Claude Code as needed
- Contains role, responsibilities, decision frameworks
- Includes integration notes with other agents

### Design Documentation (`docs/design/`)
- `principles.md` - YOUR design philosophy (create this)
- `brand.md` - Client brand guidelines (from template)
- `project.md` - Project requirements (from template)

### Design Reviews (`.claude/design-reviews/`)
- Dated review documents (YYYY-MM-DD-[feature]-[type].md)
- Captures agent decisions and findings
- Builds institutional knowledge
- Reference for future work

---

## 🤔 Common Questions

**Q: Do I need all 6 agents for every project?**  
A: No. Use what you need. Minimum: Brand Guardian + one other.

**Q: Can I customize the agents?**  
A: Yes! They're markdown files. Adapt to your workflow.

**Q: What if I don't use Playwright?**  
A: Skip UI Analyzer or adapt it for your testing tools.

**Q: Do agents work with Claude Code?**  
A: Yes! Load the agent context, it works in both Desktop and Code.

**Q: How do I update agents across projects?**  
A: Update in your starter, then copy to active projects as needed.

**Q: Can other team members use these?**  
A: Yes - anyone with Claude can load the agent context files.

---

## ✅ Success Checklist

Before considering your system "ready":

- [ ] All 6 agent files saved to `.claude/agents/design/`
- [ ] Templates saved to `docs/design/templates/`
- [ ] Created your `docs/design/principles.md`
- [ ] Tested with one pilot project
- [ ] Created at least one brand.md from template
- [ ] All agents can load context successfully
- [ ] Team understands basic workflow
- [ ] Design review process documented

---

## 🚨 Important Reminders

1. **principles.md is YOUR secret sauce** - Make it reflect your design philosophy
2. **Agents reference local docs** - They load from `docs/design/` in each project
3. **Context files are version controlled** - Treat them like code
4. **Update brand.md as brands evolve** - Living documents
5. **Strictness levels guide flexibility** - 🔴 HIGH = rigid, 🟢 LOW = flexible

---

**You now have a complete, reusable design agent system! 🎉**

Questions? Adjustments needed? Ready for the next step?
