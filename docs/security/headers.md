---
title: "Security Headers"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "next.config.ts"
  - "src/middleware.ts"
---

# Security Headers

## Overview

Security headers provide an additional layer of protection by instructing browsers to enforce security policies. While Next.js provides some security headers by default, additional headers can be configured for enhanced security.

## Current Configuration

### Next.js Default Headers

Next.js automatically sets some security headers:

- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - Enables XSS filter

### Recommended Headers

The following security headers are recommended for production:

#### Content Security Policy (CSP)

Prevents XSS attacks by controlling which resources can be loaded:

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust for your needs
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];
```

**Note**: CSP requires careful configuration to avoid breaking functionality. Test thoroughly before enabling.

#### Strict-Transport-Security (HSTS)

Forces browsers to use HTTPS:

```typescript
{
  key: "Strict-Transport-Security",
  value: "max-age=31536000; includeSubDomains; preload",
}
```

#### X-Content-Type-Options

Prevents MIME type sniffing:

```typescript
{
  key: "X-Content-Type-Options",
  value: "nosniff",
}
```

#### X-Frame-Options

Prevents clickjacking:

```typescript
{
  key: "X-Frame-Options",
  value: "SAMEORIGIN",
}
```

#### X-XSS-Protection

Enables XSS filter (legacy browsers):

```typescript
{
  key: "X-XSS-Protection",
  value: "1; mode=block",
}
```

#### Referrer-Policy

Controls referrer information:

```typescript
{
  key: "Referrer-Policy",
  value: "strict-origin-when-cross-origin",
}
```

#### Permissions-Policy

Controls browser features:

```typescript
{
  key: "Permissions-Policy",
  value: [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "interest-cohort=()",
  ].join(", "),
}
```

## Implementation

### Next.js Configuration

Add security headers in `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Middleware Configuration

Security headers can also be set in middleware:

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}
```

## Header Descriptions

### Content-Security-Policy (CSP)

Controls which resources can be loaded and executed.

**Benefits**:
- Prevents XSS attacks
- Controls resource loading
- Prevents data injection

**Configuration**:
- Start with `default-src 'self'`
- Add specific directives for scripts, styles, images, etc.
- Use `'unsafe-inline'` and `'unsafe-eval'` sparingly
- Test thoroughly before enabling

### Strict-Transport-Security (HSTS)

Forces browsers to use HTTPS for all connections.

**Benefits**:
- Prevents protocol downgrade attacks
- Ensures encrypted connections
- Protects against man-in-the-middle attacks

**Configuration**:
- `max-age`: How long to enforce HTTPS (in seconds)
- `includeSubDomains`: Apply to all subdomains
- `preload`: Include in HSTS preload list

### X-Content-Type-Options

Prevents browsers from MIME-sniffing responses.

**Benefits**:
- Prevents MIME type confusion attacks
- Ensures correct content type handling

### X-Frame-Options

Prevents page from being embedded in frames.

**Options**:
- `DENY`: Never allow framing
- `SAMEORIGIN`: Allow framing from same origin
- `ALLOW-FROM uri`: Allow framing from specific URI (deprecated)

### X-XSS-Protection

Enables XSS filter in legacy browsers.

**Options**:
- `0`: Disable filter
- `1`: Enable filter
- `1; mode=block`: Enable filter and block page if XSS detected

### Referrer-Policy

Controls how much referrer information is sent.

**Options**:
- `no-referrer`: Don't send referrer
- `strict-origin-when-cross-origin`: Send full URL for same-origin, origin only for cross-origin
- `origin`: Send only origin
- `unsafe-url`: Always send full URL

### Permissions-Policy

Controls browser features and APIs.

**Benefits**:
- Prevents unauthorized access to device features
- Reduces attack surface
- Protects user privacy

## Testing Headers

### Browser DevTools

Check headers in browser DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Select a request
4. View Response Headers

### Online Tools

Test security headers with online tools:

- [SecurityHeaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

## Best Practices

1. **Start conservative** - Begin with restrictive headers, relax as needed
2. **Test thoroughly** - Headers can break functionality if misconfigured
3. **Monitor errors** - Watch for CSP violations or other header-related issues
4. **Update regularly** - Keep headers up to date with security best practices
5. **Document exceptions** - Document why certain headers are relaxed

## Security Considerations

### Content Security Policy (CSP)

CSP requires careful configuration:

- **Inline scripts**: May require `'unsafe-inline'` for Next.js
- **External resources**: Add domains to appropriate directives
- **Third-party scripts**: Include in `script-src`
- **Styles**: May require `'unsafe-inline'` for CSS-in-JS

**Recommendation**: Start with report-only mode:

```typescript
{
  key: "Content-Security-Policy-Report-Only",
  value: "default-src 'self'; report-uri /api/csp-report",
}
```

### HSTS Considerations

- Only enable HSTS if HTTPS is fully configured
- Test thoroughly before enabling
- Consider preload list inclusion for maximum security

## Related Documentation

- [Security Overview](./overview.md) - Overall security strategy
- [Authentication](./authentication.md) - Authentication security
- [Data Protection](./data-protection.md) - Secure data handling
