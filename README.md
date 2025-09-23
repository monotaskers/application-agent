# CopilotKit <> PydanticAI Starter

This is a starter template for building AI agents using [PydanticAI](https://ai.pydantic.dev/) and [CopilotKit](https://copilotkit.ai). It provides a modern Next.js application with an integrated investment analyst agent that can research stocks, analyze market data, and provide investment insights.

## Prerequisites

- Node.js 18+
- Python 3.8+
- OpenAI API Key (for the PydanticAI agent)
- Any of the following package managers:
  - pnpm (recommended)
  - npm
  - yarn
  - bun

> **Note:** This repository ignores lock files (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb) to avoid conflicts between different package managers. Each developer should generate their own lock file using their preferred package manager. After that, make sure to delete it from the .gitignore.

## Quick Start

For first-time setup, run the automated setup script:
```bash
./scripts/setup-dev.sh
```

This will:
- Check prerequisites (Python, Node.js)
- Create `.env` files from templates
- Install dependencies
- Guide you through adding API keys

## Getting Started

1. Install dependencies using your preferred package manager:
```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

2. Install Python dependencies for the PydanticAI agent:
```bash
# Using pnpm
pnpm install:agent

# Using npm
npm run install:agent

# Using yarn
yarn install:agent

# Using bun
bun run install:agent
```

> **Note:** This will automatically setup a `.venv` (virtual environment) inside the `agent` directory.  
>
> To activate the virtual environment manually, you can run:
> ```bash
> source agent/.venv/bin/activate
> ```


3. Set up your environment variables:

Create a `.env` file in the project root with your OpenAI API key:
```bash
# Copy from template
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-proj-your-key-here
```

Optionally, set up CopilotKit Cloud (if using):
```bash
# Copy from template
cp .env.local.example .env.local

# Edit .env.local and add your CopilotKit Cloud key
# COPILOT_CLOUD_PUBLIC_API_KEY=ck_pub_your-key-here
```

4. Start the development server:
```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

This will start both the UI and agent servers concurrently.

## Available Scripts
The following scripts can also be run using your preferred package manager:
- `dev` - Starts both UI and agent servers in development mode
- `dev:debug` - Starts development servers with debug logging enabled
- `dev:ui` - Starts only the Next.js UI server
- `dev:agent` - Starts only the PydanticAI agent server
- `build` - Builds the Next.js application for production
- `start` - Starts the production server
- `lint` - Runs ESLint for code linting
- `install:agent` - Installs Python dependencies for the agent

## Documentation

The main UI component is in `src/app/page.tsx`. You can:
- Modify the theme colors and styling
- Add new frontend actions
- Customize the CopilotKit sidebar appearance

## 📚 Documentation

- [PydanticAI Documentation](https://ai.pydantic.dev) - Learn more about PydanticAI and its features
- [CopilotKit Documentation](https://docs.copilotkit.ai) - Explore CopilotKit's capabilities
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API


## Contributing

Feel free to submit issues and enhancement requests! This starter is designed to be easily extensible.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Environment Variables

This project uses environment variables to manage API keys securely:

### Required Variables
- **`.env`** - Backend/Python agent variables
  - `OPENAI_API_KEY` - Your OpenAI API key (required)
  - `LOG_LEVEL` - Logging level: debug, info, warning, error (optional)

### Optional Variables
- **`.env.local`** - Frontend/Next.js variables
  - `COPILOT_CLOUD_PUBLIC_API_KEY` - CopilotKit Cloud API key (optional)
  - `NEXT_PUBLIC_AGENT_URL` - Custom agent URL (defaults to http://localhost:8000)

> **Security Note:** Never commit `.env` or `.env.local` files to version control. They are already in `.gitignore`.

## Troubleshooting

### Agent Connection Issues
If you see "I'm having trouble connecting to my tools", make sure:
1. The PydanticAI agent is running on port 8000
2. Your OpenAI API key is correctly set in `.env` file
3. Both servers started successfully
4. Check the agent logs for any startup errors

### Environment Variable Issues
If the agent fails to start with "OPENAI_API_KEY not found":
1. Ensure `.env` file exists in the project root
2. Verify the API key is correctly formatted: `OPENAI_API_KEY=sk-proj-...`
3. Try running `source .env` manually before starting the agent
4. Check that the key is valid and has not been revoked

### Python Dependencies
If you encounter Python import errors:
```bash
cd agent
pip install -r requirements.txt
```