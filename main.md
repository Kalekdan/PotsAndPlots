# pots-and-plots

AI coding agent specification. Simple CLI to run the frontend.

## Spec-driven CLI: `potsandplots`

Purpose: Start the frontend development server with pnpm.

Machine-readable spec (YAML)

```yaml
name: potsandplots
description: Start frontend with pnpm
commands:
  - name: start
    description: Install pnpm if missing, then run pnpm start
    behavior:
      - check if pnpm is installed
      - if missing, install pnpm globally via npm
      - run pnpm install
      - run pnpm start
      - stream stdout/stderr
      - return process exit code
```

Behavior

- Check if pnpm is available in PATH
- If missing, run `npm install -g pnpm`
- Run `pnpm install` then `pnpm start` in current directory
- Forward all output to user
- Return the exit code from pnpm start

Examples

- Start frontend: `potsandplots start`

Implementation notes

- Auto-install pnpm if missing using npm
- Only run `pnpm install` and `pnpm start`
- No custom arguments needed

## Quick Start

To start the entire application (frontend only via CLI):

```bash
# Using the potsandplots CLI
node bin/potsandplots.js start
```

Or if installed globally:

```bash
# Install globally first
npm install -g .

# Then run
potsandplots start
```

This will:
1. Check if pnpm is installed, install it if missing
2. Run `pnpm install` to install dependencies
3. Start the React development server on `http://localhost:3000`

## Full Development Setup

To run both frontend and backend:

1. **Start Backend** (in one terminal):
   ```bash
   cd backend
   ./gradlew bootRun
   ```
   Backend will be available at `http://localhost:8080`

2. **Start Frontend** (in another terminal):
   ```bash
   potsandplots start
   ```
   Frontend will be available at `http://localhost:3000`

# Backend
The backend is spring boot and built using gradle. The backend exposes endpoints used by the web app to get data about the plants.

## Running the Backend

To start the backend server:

```bash
cd backend
./gradlew bootRun
```

The backend will start on `http://localhost:8080` and includes:
- REST API endpoints for plant management
- H2 in-memory database for development
- CORS configuration for frontend integration
- Swagger/OpenAPI documentation (if enabled)

### Backend Development

- Build: `./gradlew build`
- Test: `./gradlew test`
- Clean: `./gradlew clean`

The backend uses:
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database
- Java 17

# Features and functionality
## Adding and removing plants
- A button next to each plant should let you remove it with a single click
- A button next to each area/plot should let you add a new plant