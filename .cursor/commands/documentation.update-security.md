---
description: Update security documentation for security measures, patterns, and best practices
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific security area is provided (e.g., "input-validation", "file-uploads"), focus on that area.

## Instructions

1. **Scan Security Code**
   - Scan `src/lib/` for security utilities and validation patterns
   - Scan `src/app/api/` for security implementations in routes
   - Scan `src/middleware.ts` for security middleware
   - Scan environment configuration files for security settings
   - Scan `src/utils/` for security-related utilities
   - Identify input validation patterns (Zod schemas)
   - Identify security headers and configurations
   - Identify file upload security measures
   - Identify data protection measures

2. **Analyze Security Patterns**
   - Extract input validation patterns and schemas
   - Extract security headers configuration
   - Extract file upload security measures
   - Extract authentication security measures
   - Extract data protection and encryption patterns
   - Extract rate limiting and DoS protection
   - Extract XSS and CSRF protection measures
   - Extract SQL injection prevention patterns

3. **Update Documentation Files**
   - Create or update `docs/security/overview.md` - Security overview and principles
   - Create or update `docs/security/input-validation.md` - Input validation patterns
   - Create or update `docs/security/authentication.md` - Authentication security
   - Create or update `docs/security/data-protection.md` - Data protection measures
   - Create or update `docs/security/file-uploads.md` - File upload security
   - Create or update `docs/security/headers.md` - Security headers configuration
   - Create or update `docs/security/checklist.md` - Security implementation checklist
   - Create or update `docs/security/incident-response.md` - Security incident procedures
   - Document new security measures or patterns
   - Update security best practices

4. **Documentation Format**
   - Include security principles and guidelines
   - Include code examples for security patterns
   - Include configuration examples
   - Include security checklist items
   - Include threat modeling considerations
   - Include incident response procedures
   - Include security testing guidelines

5. **Check for Missing Documentation**
   - Identify security measures without documentation
   - Flag incomplete security documentation
   - Check for outdated security patterns
   - Verify security checklist is current

## Output Format

Provide a summary including:

- Security components scanned
- Documentation files updated
- Documentation files created
- Missing documentation identified
- Security checklist items updated
- Files created/updated with paths

## Key Rules

- Document all security measures and patterns
- Include security best practices and guidelines
- Document input validation patterns with Zod examples
- Include security headers configuration
- Document file upload security measures
- Include threat modeling considerations
- Reference related code files in frontmatter
- Update last_updated date in frontmatter
- Cross-reference authentication documentation

## Security Documentation Standards

### Security Overview Template

```markdown
---
title: "Security Overview"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/"
  - "src/middleware.ts"
---

# Security Overview

## Overview

Brief description of security approach and principles

## Security Principles

- Defense in depth
- Least privilege
- Fail secure
- etc.

## Security Layers

1. Input validation
2. Authentication
3. Authorization
4. Data protection
5. etc.

## Threat Model

Common threats and mitigations

## Security Checklist

Link to security checklist
```

### Input Validation Documentation Template

```markdown
---
title: "Input Validation"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/validation/"
  - "src/features/*/schemas/"
---

# Input Validation

## Overview

Description of input validation approach

## Validation Patterns

### Zod Schema Validation

Code examples for Zod validation

### API Route Validation

How API routes validate input

### Form Validation

How forms validate input

## Validation Rules

- Required fields
- Type validation
- Format validation
- Length constraints
- etc.

## Error Handling

How validation errors are handled

## Security Considerations

How validation prevents security issues
```

### File Upload Security Template

```markdown
---
title: "File Upload Security"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/app/api/*/upload/route.ts"
  - "src/components/forms/form-file-upload.tsx"
---

# File Upload Security

## Overview

Description of file upload security measures

## Security Measures

- File type validation
- File size limits
- Content scanning
- Storage security
- Access control

## Implementation

Code examples for secure file uploads

## Configuration

Required configuration

## Threat Mitigation

How threats are mitigated

## Best Practices

File upload best practices
```

### Security Checklist Template

```markdown
---
title: "Security Implementation Checklist"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
---

# Security Implementation Checklist

## Input Validation

- [ ] All user inputs validated with Zod
- [ ] File uploads validated (type, size, content)
- [ ] URL parameters validated
- [ ] Request bodies validated
- [ ] Query parameters validated

## Authentication

- [ ] All protected routes require authentication
- [ ] Session management secure
- [ ] Token handling secure
- [ ] Password policies enforced
- [ ] Multi-factor authentication (if applicable)

## Authorization

- [ ] Permission checks on all protected resources
- [ ] Role-based access control implemented
- [ ] Principle of least privilege followed
- [ ] Authorization checks server-side

## Data Protection

- [ ] Sensitive data encrypted
- [ ] PII handled securely
- [ ] Database queries parameterized
- [ ] No sensitive data in logs
- [ ] Secure data transmission (HTTPS)

## Security Headers

- [ ] Content Security Policy configured
- [ ] XSS protection headers
- [ ] CSRF protection implemented
- [ ] HSTS enabled
- [ ] Secure cookie flags set

## File Uploads

- [ ] File type validation
- [ ] File size limits
- [ ] Content scanning
- [ ] Secure storage
- [ ] Access control

## Error Handling

- [ ] No sensitive information in error messages
- [ ] Proper error logging
- [ ] Error responses don't leak information

## Testing

- [ ] Security testing performed
- [ ] Penetration testing (if applicable)
- [ ] Vulnerability scanning
- [ ] Code review for security issues
```
