# Quickstart: Verify Sentry Removal

## Prerequisites
- Node.js 20.x installed
- pnpm package manager installed
- Development environment set up

## Verification Steps

### 1. Verify Sentry Package Removal
```bash
# Check that Sentry packages are removed
pnpm list @sentry/nextjs
# Expected: Package not found

# Verify package.json doesn't contain Sentry
grep -i sentry package.json
# Expected: No results
```

### 2. Start the Application
```bash
# Install dependencies (without Sentry)
pnpm install

# Start development server
pnpm run dev
# Expected: Server starts without Sentry initialization messages
```

### 3. Test Error Logging
```bash
# In browser console, navigate to any page
# Open browser developer console

# Trigger a test error (in browser console):
throw new Error('Test error - should appear in console only')

# Expected: Error appears in browser console with timestamp and level
# Expected: No Sentry error reporting popup or network calls
```

### 4. Verify Console Logging Format
```bash
# Check server logs in terminal where dev server is running
# Expected format for each log:
# [2025-10-17T10:30:45.123Z] [INFO] Application started
# [2025-10-17T10:30:46.456Z] [ERROR] Test error message
```

### 5. Test Performance Metrics
```bash
# Navigate to pages that previously tracked performance
# Check console for performance logs

# Expected format:
# [2025-10-17T10:30:47.789Z] [PERF] page-load: 245ms
# [2025-10-17T10:30:48.012Z] [PERF] api-call: 89ms
```

### 6. Verify No Sentry Network Calls
```bash
# Open browser Network tab
# Filter by "sentry" or check all XHR/Fetch requests
# Navigate through the application

# Expected: No requests to Sentry domains:
# - No calls to *.sentry.io
# - No calls to *.ingest.sentry.io
```

### 7. Check Error Boundaries
```bash
# Navigate to a page with an error boundary
# Trigger an error in that component

# Expected: Error boundary catches and logs to console
# Expected: User sees fallback UI
# Expected: No Sentry error dialog
```

### 8. Verify Environment Variables
```bash
# Check that Sentry environment variables are removed
grep SENTRY .env .env.local .env.production 2>/dev/null
# Expected: No results

# Check runtime environment
pnpm run dev
# Then in another terminal:
curl http://localhost:3000/api/health
# Expected: No Sentry-related warnings about missing env vars
```

### 9. Run Tests
```bash
# Run unit tests
pnpm run test
# Expected: All tests pass without Sentry dependencies

# Run linting
pnpm run lint
# Expected: No unused imports from @sentry packages
```

### 10. Production Build Verification
```bash
# Create production build
pnpm run build
# Expected: Build completes without Sentry plugin messages

# Check bundle size
# Expected: Smaller bundle size without Sentry SDK

# Start production server
pnpm run start
# Expected: Server runs without Sentry initialization
```

## Success Criteria
✅ Application starts and runs without errors
✅ No Sentry packages in dependencies
✅ All errors log to console only
✅ Performance metrics appear in console
✅ No network requests to Sentry services
✅ Error boundaries work without Sentry
✅ Tests pass without Sentry mocks
✅ Production build is smaller and runs correctly

## Troubleshooting

### Issue: Build fails with Sentry import errors
**Solution**: Check for missed Sentry imports in components. Search for:
```bash
rg "from '@sentry" --type ts --type tsx
rg "import.*Sentry" --type ts --type tsx
```

### Issue: Console logs not appearing
**Solution**: Verify logger utility is properly imported and initialized:
```typescript
import { logger } from '@/lib/logger';
logger.info('Test message');
```

### Issue: Performance metrics missing
**Solution**: Ensure performance tracking is redirected to console logger:
```typescript
logger.performance('metric-name', performanceValue);
```

## Rollback Instructions
If issues arise and Sentry needs to be re-enabled:
1. This removal is permanent per specification
2. To re-add Sentry, create a new feature specification
3. Git history contains all removed code for reference

## Next Steps
After successful verification:
1. Monitor console logs for any missed error handling
2. Document console log location for production environment
3. Set up log aggregation if needed (separate feature)
4. Train team on using console logs for debugging