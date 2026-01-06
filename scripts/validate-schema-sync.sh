#!/bin/bash

# Schema Synchronization Validation Script
# Validates that all schema-related files are synchronized with the remote database

set -e

echo "🔍 Validating schema synchronization..."
echo ""

ERRORS=0
WARNINGS=0

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 1. Check if schema documentation exists
echo "1️⃣ Checking schema documentation..."
if [ ! -f "docs/database/schema.md" ]; then
  echo -e "${RED}❌ ERROR: docs/database/schema.md not found${NC}"
  echo "   Create schema documentation based on schema.sql"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ Schema documentation exists${NC}"
fi

# 2. Check if schema.sql exists
echo ""
echo "2️⃣ Checking schema.sql..."
if [ ! -f "docs/database/schema.sql" ]; then
  echo -e "${YELLOW}⚠️  WARNING: docs/database/schema.sql not found${NC}"
  echo "   Run: supabase db dump --linked -s public -f docs/database/schema.sql"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✅ schema.sql exists${NC}"
fi

# 3. Check if base_schema.sql matches schema.sql
echo ""
echo "3️⃣ Checking base_schema.sql synchronization..."
if [ -f "docs/database/schema.sql" ] && [ -f "supabase/schemas/base_schema.sql" ]; then
  if ! diff -q docs/database/schema.sql supabase/schemas/base_schema.sql > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  WARNING: schema.sql and base_schema.sql differ${NC}"
    echo "   Sync with: cp docs/database/schema.sql supabase/schemas/base_schema.sql"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}✅ base_schema.sql is synchronized${NC}"
  fi
elif [ ! -f "supabase/schemas/base_schema.sql" ]; then
  echo -e "${YELLOW}⚠️  WARNING: supabase/schemas/base_schema.sql not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# 4. Verify TypeScript types compile
echo ""
echo "4️⃣ Checking TypeScript types..."
if command -v pnpm &> /dev/null; then
  if pnpm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript types compile successfully${NC}"
  else
    echo -e "${RED}❌ ERROR: TypeScript type check failed${NC}"
    echo "   Regenerate types: supabase gen types typescript --linked > src/types/database.types.ts"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${YELLOW}⚠️  WARNING: pnpm not found, skipping type check${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# 5. Check for common deprecated field references
echo ""
echo "5️⃣ Checking for deprecated field references..."
DEPRECATED_REFS=$(rg -i "maturity_level|total_score.*\b1500\b|size_classification|survey_version|assessment_snapshot" src/ --type ts --type tsx 2>/dev/null | grep -v "__tests__" | grep -v ".test." | grep -v "schema.md" | grep -v "schema-change-log.md" | grep -v "schema-validation.md" || true)

if [ -n "$DEPRECATED_REFS" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found references to deprecated/non-existent fields:${NC}"
  echo "$DEPRECATED_REFS" | head -5
  if [ $(echo "$DEPRECATED_REFS" | wc -l) -gt 5 ]; then
    echo "   ... and more (showing first 5)"
  fi
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✅ No deprecated field references found${NC}"
fi

# 6. Check for backward compatibility comments
echo ""
echo "6️⃣ Checking for backward compatibility code..."
BC_REFS=$(rg -i "backward compat|backwards compat|old schema|legacy.*schema" src/ --type ts --type tsx 2>/dev/null | grep -v "__tests__" | grep -v ".test." | grep -v "schema.md" | grep -v "CONTEXT.md" || true)

if [ -n "$BC_REFS" ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found backward compatibility references (project does not maintain BC):${NC}"
  echo "$BC_REFS" | head -5
  if [ $(echo "$BC_REFS" | wc -l) -gt 5 ]; then
    echo "   ... and more (showing first 5)"
  fi
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✅ No backward compatibility code found${NC}"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ Schema validation passed with no issues${NC}"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Schema validation completed with $WARNINGS warning(s)${NC}"
  echo "   Review warnings above and address as needed"
  exit 0
else
  echo -e "${RED}❌ Schema validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
  echo "   Please fix errors before proceeding"
  exit 1
fi
