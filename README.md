# PotsAndPlots

PotsAndPlots is a web application built with React. The core of the project is written primarily in JavaScript, with additional HTML and CSS support. 

## Project Overview

This app was scaffolded using [Create React App](https://github.com/facebook/create-react-app).  

The app is a web app to let users manage a set of plants. It will let users:
- Add and remove plants to various areas (areas and 'plots')
- See which plants need watering/attention
- Manage both indoor/outdoor pot plants and plots of plants


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (recommended version 14.x or later)
- [pnpm](https://pnpm.io/) (alternative package manager to npm)
  - Install: `npm install -g pnpm` (if you don't already have it)

### Installation

Clone the repository, then install dependencies:

```bash
git clone https://github.com/Kalekdan/PotsAndPlots.git
cd PotsAndPlots
pnpm install
```

### Running the App

#### Using the CLI Tool (Recommended)

This project includes a CLI tool that automatically handles pnpm installation and starts the development server:

```bash
potsandplots start
```

The CLI will:
- Check if pnpm is installed
- Auto-install pnpm globally if missing (via `npm install -g pnpm`)
- Run `pnpm install` to install dependencies
- Start the development server with `pnpm start`

#### Manual Method

Alternatively, you can start the development server manually:

```bash
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Optional: Running a JSON mock backend

If you want a simple local JSON backend (example using json-server):

```bash
pnpm add -D json-server
pnpm exec json-server --watch mock-backend/db.json --port 4000
```

Adjust the path/port as needed and point the frontend to that backend URL.

### Building for Production

Build the app for production with:

```bash
pnpm build
```

The optimized static files will be output to the `build/` directory, ready to deploy.

### Running Tests

Run the interactive test runner:

```bash
pnpm test
```

## Available Scripts

### CLI Tool
- `potsandplots start` – Auto-installs pnpm if needed and starts the development server.

### Manual Scripts
- `pnpm start` – Runs the app in development mode.
- `pnpm build` – Builds the app for production.
- `pnpm test` – Launches the test runner.
- `pnpm run eject` – Ejects the configuration (irreversible, advanced use).

## CLI Tool

This project includes a custom CLI tool (`potsandplots`) that simplifies the development workflow. The CLI follows the specification defined in [`main.md`](main.md).

### Usage
```bash
potsandplots start
```

### Features
- Automatically detects if pnpm is installed
- Installs pnpm globally if missing using npm
- Runs `pnpm install` to ensure dependencies are up to date
- Starts the development server
- Streams all output to the console
- Returns proper exit codes for CI/CD integration

## Learn More

For more information about Create React App, read their [documentation](https://facebook.github.io/create-react-app/docs/getting-started).