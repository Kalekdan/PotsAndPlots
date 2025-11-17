# PotsAndPlots

🌱 A comprehensive plant management web application for gardeners and plant enthusiasts. Track your indoor and outdoor plants, organize them into areas and plots, and never forget to water them again!

![Dashboard Screenshot](https://github.com/user-attachments/assets/f1781110-73c3-4a3c-8317-69c641d3633a)

## What is PotsAndPlots?

PotsAndPlots is a full-stack web application built with **React** (frontend) and **Spring Boot** (backend) that helps you manage your plant collection. Whether you're tending to houseplants, managing a vegetable garden, or maintaining a greenhouse, PotsAndPlots provides an intuitive interface to organize and track your plants.

### Key Features

**Current Features:**
- **🏠 Area Management**: Organize plants by location (Living Room, Front Garden, Greenhouse, etc.)
  - Track location type (indoor/outdoor)
  - Monitor brightness levels
  - Note whether areas are covered or exposed to elements
- **🧱 Plot System**: Create structured growing areas within your spaces
  - Visualize plants in a grid layout
  - Define plot dimensions, soil type, pH levels, and drainage
  - Support for different plot types (raised beds, containers, ground plots, hydroponics)
- **🌱 Plant Tracking**: Add and manage individual plants
  - Assign plants to specific areas and plot positions
  - Track plant species with common and scientific names
  - Monitor health status (healthy, sick, recovering, dormant, flowering, fruiting)
  - Set watering schedules (daily, weekly, bi-weekly, etc.)
  - Record planting dates and custom notes
- **📝 Detailed Plant Management**: Edit plant information and view comprehensive details
  - Update plant health status and watering requirements
  - Track location history
  - Move plants between areas and plots
- **🎨 Visual Dashboard**: Clean, intuitive interface with emoji-based iconography
  - Interactive grid view for plots showing plant positions
  - Color-coded health status indicators
  - Quick-access plant cards for free-standing plants

![Plant Details Screenshot](https://github.com/user-attachments/assets/7f5f6613-c091-4815-bd2d-cb6eb726405f)

**Planned Features:**
- **📅 Watering Reminders**: Get notifications when plants need attention
- **📊 Plant Analytics**: Track growth patterns and health trends over time
- **📸 Photo Gallery**: Upload and attach photos to your plants
- **🔍 Search & Filter**: Quickly find plants by name, type, location, or health status
- **📱 Mobile Optimization**: Enhanced mobile experience with responsive design
- **🌍 Weather Integration**: Automatic watering suggestions based on local weather
- **🔄 Plant History**: Track changes, relocations, and lifecycle events
- **👥 Multi-user Support**: Share gardens with family or manage multiple properties

## Technology Stack

- **Frontend**: React 19, React Router, Create React App
- **Backend**: Spring Boot, Java
- **Database**: H2 (in-memory for development)
- **Build Tools**: Gradle (backend), npm/pnpm (frontend)
- **Testing**: Jest, React Testing Library


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

### Running the Backend

The application includes a Spring Boot backend that provides the REST API. To start the backend:

```bash
cd backend
./gradlew bootRun
```

The backend will start on [http://localhost:8080](http://localhost:8080) and automatically initialize with sample data including:
- 3 areas (Living Room, Front Garden, Greenhouse)
- 2 plots (Tomato Bed, Herb Row)
- 6 plants (Spider Plant, Pothos, Tomatoes, Basil, Rosemary)
- 7 plant types with detailed information

**Note**: The backend uses an in-memory H2 database, so data is reset each time the server restarts.

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