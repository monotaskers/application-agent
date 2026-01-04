# Agent Application Starter

A modern Next.js application starter. Built with Next.js 15, React 19, Supabase, and integrated with PydanticAI agents via CopilotKit.

## Features

- **User Management**: Full CRUD operations for user accounts with role management, soft delete/restore, search, filtering, and pagination
- **Authentication**: Secure authentication with Supabase (Email/Password, Magic Link, OTP, Google OAuth)
- **User Profiles**: User profile management with avatar uploads
- **AI Agent Integration**: PydanticAI agent integration via CopilotKit (example proverbs generator included)

## Prerequisites

- Node.js 20+
- Python 3.8+ (for PydanticAI agent)
- OpenAI API Key (for the PydanticAI agent)
- Supabase account and project
- pnpm (required)

> **Note:** This project **requires** `pnpm` as the package manager. Using npm, yarn, or bun may cause inconsistencies and is not supported. See [`AGENTS.md`](AGENTS.md) for development guidelines.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

> **Note:** This project requires `pnpm`. See [`AGENTS.md`](AGENTS.md) for development guidelines.

### 2. Install Python Agent Dependencies

```bash
pnpm install:agent
```

> **Note:** This automatically creates a `.venv` virtual environment inside the `agent` directory.  
> To activate manually: `source agent/.venv/bin/activate`

### 3. Set Up Environment Variables

Create a `.env` file in the project root for the Python agent:

```bash
# .env (for Python agent)
OPENAI_API_KEY=sk-proj-your-key-here
LOG_LEVEL=info  # Optional: debug, info, warning, error
```

Create a `.env.local` file in the project root for Next.js:

```bash
# .env.local (for Next.js)
# Supabase Authentication (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here  # Optional: for admin operations

# Application URL (Required for production/Vercel)
# Set this to your production URL to fix auth redirects
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app  # Required for Vercel deployments

# CopilotKit (Optional)
COPILOT_CLOUD_PUBLIC_API_KEY=ck_pub_your-key-here  # Optional: if using CopilotKit Cloud
NEXT_PUBLIC_AGENT_URL=http://localhost:8000  # Optional: custom agent URL

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_ORG=your-org  # Optional: for error monitoring
NEXT_PUBLIC_SENTRY_PROJECT=your-project  # Optional: for error monitoring
NEXT_PUBLIC_SENTRY_DISABLED=false  # Set to true to disable Sentry
```

### 4. Set Up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com/)
2. **Get your credentials**:

   - Go to Settings → API
   - Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy "service_role" key → `SUPABASE_SERVICE_ROLE_KEY` (optional)

3. **Configure authentication**:
   - Set up Google OAuth in Supabase Dashboard
   - Configure email templates for Magic Link/OTP flows
   - **IMPORTANT for Production/Vercel**: In Supabase Dashboard → Authentication → URL Configuration:
     - Add your production URL to "Redirect URLs" (e.g., `https://your-app.vercel.app/auth/callback`)
     - Set "Site URL" to your production URL
     - This prevents auth redirects from going to localhost in production

### 5. Start Development Servers

```bash
pnpm dev
```

This starts both the Next.js UI server (port 3000) and the PydanticAI agent server (port 8000) concurrently.

## Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - UI library with Server Components and React Compiler
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Supplemental component library (use only when no ReUI equivalent exists)
- **ReUI** - Primary component system for application UI, sourced from the shared ReUI kits
- **TanStack Table** - Powerful data table library
- **TanStack Query** - Server state management (for mutations and client-side updates)
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Architecture Patterns

- **Server-Side Rendering (SSR)** - All detail pages use hybrid Server/Client Component architecture for optimal performance
  - Server Components for initial data fetching and authentication
  - Client Components for interactivity (dialogs, forms, mutations)
  - Shared utilities for reusable data fetching logic
  - See [`docs/patterns/server-side-rendering.md`](docs/patterns/server-side-rendering.md) for complete documentation

### Backend & Services

- **Supabase** - Backend-as-a-Service (Auth, Database, Storage)
- **PydanticAI** - Python AI agent framework
- **CopilotKit** - AI agent UI integration

### Development Tools

- **Storybook 9.1.16** - Component development and documentation environment
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Sentry** - Error monitoring and performance tracking

### Additional Libraries

- **ReUI packages** - Install via `pnpm dlx shadcn@latest add @reui/<component-variant>` for shared UI primitives and patterns
- **date-fns** - Date utility library
- **recharts** - Charting library
- **papaparse** - CSV parsing
- **zustand** - State management
- **next-themes** - Theme switching

## Available Scripts

### Development

- `dev` - Start both UI and agent servers in development mode
- `dev:debug` - Start development servers with debug logging enabled
- `dev:ui` - Start only the Next.js UI server
- `dev:agent` - Start only the PydanticAI agent server

### Building

- `build` - Build the Next.js application for production
- `start` - Start the production server

### Code Quality

- `lint` - Run ESLint for code linting
- `lint:fix` - Run ESLint and auto-fix issues
- `lint:strict` - Run ESLint with zero warnings allowed
- `format` - Format code with Prettier
- `format:check` - Check code formatting without making changes
- `type-check` - Run TypeScript type checking without emitting files

### Testing

- `test` - Run tests with Vitest
- `test:watch` - Run tests in watch mode
- `test:coverage` - Run tests with coverage report
- `test:ui` - Run tests with Vitest UI

### Storybook

- `storybook` - Start Storybook development server (port 6006)
- `build-storybook` - Build static Storybook documentation

### Validation

- `validate` - Run type-check, lint, and test coverage together
- `validate:schema` - Validate schema files are synchronized with remote database

### Agent

- `install:agent` - Install Python dependencies for the agent

## Project Structure

This project follows a **vertical slice architecture**, organizing code by features rather than technical layers:

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (use shared utilities from features)
│   ├── admin/             # Admin pages
│   │   └── users/[userId]/  # User detail (Server Component)
│   │       ├── page.tsx   # Server Component - fetches data
│   │       ├── user-detail-client.tsx # Client Component - interactivity
│   │       ├── error.tsx  # Error boundary
│   │       └── not-found.tsx # 404 page
│   ├── auth/              # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # Shared UI components
│   ├── ui/               # Base components (shadcn/ui)
│   └── layout/           # Layout components
├── features/             # Feature-based modules
│   ├── users/           # User management feature
│   │   ├── lib/         # Shared utilities
│   │   │   └── fetch-user-server.ts # Server-side fetching
│   │   ├── components/   # Feature components
│   │   ├── hooks/       # Client-side hooks (mutations)
│   │   └── schemas/     # Zod validation schemas
│   ├── users/           # User management feature
│   └── [feature]/       # Other features
├── lib/                  # Core utilities
│   ├── auth/           # Authentication utilities
│   ├── utils.ts        # Utility functions
│   └── env.ts          # Environment validation
├── hooks/                # Shared React hooks
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware

docs/                     # Documentation
├── CONTEXT.md           # Critical context for AI agents and developers
├── patterns/            # Architecture patterns
│   └── server-side-rendering.md # SSR pattern documentation
├── database/            # Database documentation
│   ├── remote-schema-reference.md # Current remote schema (source of truth)
│   └── schema.md       # Human-readable schema documentation
├── design/              # Design system documentation
└── data/                # Data schemas and examples

agent/                    # PydanticAI agent
└── agent.py             # Agent implementation
```

## Development Workflow

### UI Component Preferences

- **ReUI Migration Status**: Most UI components have been migrated to ReUI. Components are installed via `pnpm dlx shadcn@latest add @reui/<component-variant>` and maintain the same import paths from `@/components/ui/`.
- Default to ReUI components for all new UI; reference the shared kits in `docs/design` and install using the shadcn CLI.
- Custom components are a last resort and must follow the documentation patterns in `AGENTS.md`, including full JSDoc coverage and tests.
- Keep styling aligned with ReUI tokens (see `.cursor/rules/design_system_rules.mdc`) and verify both light/dark themes.

### Code Quality Standards

This project enforces strict code quality standards. See [`AGENTS.md`](AGENTS.md) for complete development guidelines.

**Key Requirements:**

- **TypeScript**: Strict mode enabled, no `any` types
- **Testing**: Minimum 80% code coverage required
- **Linting**: Zero warnings allowed in strict mode
- **File Size**: Maximum 500 lines per file, 200 lines per component
- **Validation**: All external data validated with Zod
- **SSR Pattern**: All detail pages must use Server Components for initial data fetching (see [`docs/patterns/server-side-rendering.md`](docs/patterns/server-side-rendering.md))

### Pre-commit Checklist

Before committing code, ensure:

- [ ] TypeScript compiles with zero errors (`pnpm run type-check`)
- [ ] Tests pass with 80%+ coverage (`pnpm run test:coverage`)
- [ ] ESLint passes with zero warnings (`pnpm run lint`)
- [ ] Code is formatted (`pnpm run format`)
- [ ] All components have JSDoc documentation
- [ ] All external data is validated with Zod schemas

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

### Component Development with Storybook

Storybook enables isolated component development and documentation. See [`specs/001-storybook-setup/README.md`](specs/001-storybook-setup/README.md) for complete documentation.

```bash
# Start Storybook development server
pnpm run storybook

# Build static Storybook documentation
pnpm run build-storybook
```

**Features:**

- View and interact with 15+ UI components in isolation
- Test components across 5 theme variants
- Interactive controls for real-time prop modification
- Automatic documentation generation
- Accessibility testing with a11y addon
- Responsive testing with viewport addon

**Quick Start:** Open `http://localhost:6006/` after running `pnpm run storybook`

### Code Validation

```bash
# Run all validation checks
pnpm validate

# Individual checks
pnpm type-check  # TypeScript
pnpm lint        # ESLint
pnpm format:check  # Prettier
```

## Environment Variables

### Required Variables

#### `.env` (Python Agent)

- `OPENAI_API_KEY` - Your OpenAI API key (required for agent)

#### `.env.local` (Next.js)

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key (required)

### Optional Variables

#### `.env.local` (Next.js)

- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- `COPILOT_CLOUD_PUBLIC_API_KEY` - CopilotKit Cloud API key
- `NEXT_PUBLIC_AGENT_URL` - Custom agent URL (defaults to `http://localhost:8000`)
- `NEXT_PUBLIC_SENTRY_ORG` - Sentry organization name
- `NEXT_PUBLIC_SENTRY_PROJECT` - Sentry project name
- `NEXT_PUBLIC_SENTRY_DISABLED` - Set to `true` to disable Sentry

#### `.env` (Python Agent)

- `LOG_LEVEL` - Logging level: `debug`, `info`, `warning`, `error` (default: `info`)

> **Security Note:** Never commit `.env` or `.env.local` files to version control. They are already in `.gitignore`.

## PydanticAI Agent

The project includes a PydanticAI agent example that demonstrates integration with CopilotKit. The current example is a **proverbs generator** that serves as a template for building custom AI agents.

**Location:** `agent/agent.py`

**Purpose:**

- Demonstrates PydanticAI + CopilotKit integration
- Shows how to create custom tools and state management
- Can be customized for your specific use cases

**To customize the agent:**

1. Modify `agent/agent.py` with your agent logic
2. Add custom tools using the `@agent.tool` decorator
3. Update agent instructions in the `@agent.instructions` function
4. The agent runs on port 8000 by default

## Troubleshooting

### Agent Connection Issues

If you see "I'm having trouble connecting to my tools":

1. Verify the PydanticAI agent is running on port 8000
2. Check that `OPENAI_API_KEY` is set in `.env`
3. Ensure both servers started successfully (`pnpm dev`)
4. Check agent logs for startup errors
5. Verify `NEXT_PUBLIC_AGENT_URL` matches the agent server URL

### Environment Variable Issues

**Agent fails to start with "OPENAI_API_KEY not found":**

1. Ensure `.env` file exists in project root
2. Verify API key format: `OPENAI_API_KEY=sk-proj-...`
3. Restart the agent server after adding the key
4. Check that the key is valid and not revoked

**Supabase connection errors:**

1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`
2. Check that your Supabase project is active
3. Verify the keys are correct in Supabase Dashboard → Settings → API

### Python Dependencies

**Import errors:**

```bash
cd agent
source .venv/bin/activate  # Activate virtual environment
pip install -r requirements.txt
```

**Virtual environment issues:**

```bash
# Remove and recreate virtual environment
rm -rf agent/.venv
pnpm install:agent
```

### Build and Deployment Issues

**Build fails:**

1. Run `pnpm type-check` to identify TypeScript errors
2. Run `pnpm lint` to find linting issues
3. Ensure all environment variables are set
4. Clear `.next` directory: `rm -rf .next`

**Sentry configuration:**

- If Sentry is causing build issues, disable it by setting `NEXT_PUBLIC_SENTRY_DISABLED=true` in `.env.local`
- Configure Sentry org and project names in `next.config.ts` or via environment variables

### Testing Issues

**Tests fail:**

1. Ensure test environment variables are set
2. Check that test database is configured (if applicable)
3. Run `pnpm test:watch` to see detailed error messages
4. Verify test setup file: `src/test/setup.ts`

**Coverage below 80%:**

- Add tests for uncovered code paths
- Use `pnpm test:coverage` to identify gaps
- Focus on critical paths first

## Contributing

This project follows strict development standards. Before contributing:

1. Read [`AGENTS.md`](AGENTS.md) for development guidelines
2. Ensure all tests pass with 80%+ coverage
3. Follow the vertical slice architecture pattern
4. Write comprehensive JSDoc documentation
5. Validate all external data with Zod schemas

### Design System

This project includes a comprehensive design system:

- **Design Principles**: [`docs/design/design-principles.md`](docs/design/design-principles.md)
- **Brand Guidelines**: [`docs/design/brand.md`](docs/design/brand.md)
- **Design System Rules**: `.cursor/rules/design_system_rules.mdc`

## Documentation

### Internal Documentation

- **[Server-Side Rendering Pattern](docs/patterns/server-side-rendering.md)** - Complete guide to SSR optimization for detail pages
- **[Development Guidelines](AGENTS.md)** - Comprehensive development standards and patterns
- **[Design System](docs/design/)** - Design principles, brand guidelines, and component documentation

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [PydanticAI Documentation](https://ai.pydantic.dev) - PydanticAI agent framework
- [CopilotKit Documentation](https://docs.copilotkit.ai) - CopilotKit integration
- [Supabase Documentation](https://supabase.com/docs) - Supabase services
- [shadcn/ui Documentation](https://ui.shadcn.com) - Component library
