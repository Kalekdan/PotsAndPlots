# PotsAndPlots

PotsAndPlots is a web application built with React. The core of the project is written primarily in JavaScript, with additional HTML and CSS support. 

## Project Overview

This app was scaffolded using [Create React App](https://github.com/facebook/create-react-app).  
While the app's specific functionality isn't detailed in this README, the structure and dependencies suggest it is a JavaScript-driven SPA with React at its core.

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

To start the development server, run:

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

- `pnpm start` – Runs the app in development mode.
- `pnpm build` – Builds the app for production.
- `pnpm test` – Launches the test runner.
- `pnpm run eject` – Ejects the configuration (irreversible, advanced use).

## Learn More

For more information about Create React App, read their [documentation](https://facebook.github.io/create-react-app/docs/getting-started).