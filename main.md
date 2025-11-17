# pots-and-plots

Plant management application with Spring Boot backend and React frontend.

## CLI Tool: `potsandplots`

Starts the frontend development server with automatic pnpm management.

```yaml
name: potsandplots
description: Start frontend with pnpm
commands:
  - name: start
    description: Install pnpm if missing, then run pnpm start
```

**Usage**: `potsandplots start`

**Behavior**:
- Checks if pnpm is installed, installs globally if missing
- Runs `pnpm install` then `pnpm start`
- Forwards all output to user

## Quick Start

**Frontend Only**:
```bash
node bin/potsandplots.js start
```

**Global Installation**:
```bash
npm install -g . && potsandplots start
```

Frontend runs on `http://localhost:3000`

## Full Application Setup

**Backend** (`http://localhost:8080`):
```bash
cd backend && ./gradlew bootRun
```

**Frontend** (`http://localhost:3000`):
```bash
potsandplots start
```

**Sample Data Included**:
- Areas: Front Garden, Back Garden, Greenhouse
- Plots: Tomato Bed, Herb Row with positioned plants
- Plants: Tomatoes, herbs, houseplants with realistic data
- H2 database console: `http://localhost:8080/h2-console`

## Technology Stack

**Backend:**
- Spring Boot 3.2.0 with JPA, H2 database, CORS
- Java 17, Gradle build system
- REST API endpoints for plant/plot/area management

**Frontend:**
- React 19.1.0 with React Router 6.26.1
- Modern CSS with responsive design, animations
- pnpm package management

**Development:**
- Build: `./gradlew build`
- Test: `./gradlew test` 
- Backend: `./gradlew bootRun`

## Features

### Dashboard
- Visual grid layouts showing plant positions within plots
- Separate sections for free-standing plants vs. plot plants
- Plant health status indicators and notes
- Click-to-navigate interface

### Plant Management
**Adding Plants**:
- Click empty plot grid cells to add plants at specific positions
- "+ Add Free-standing Plant" button for area-only plants
- Position conflict detection prevents overlapping placements
- Auto-selects first available position when adding to plots

**Removing Plants**:
- Remove button (🗑️) with confirmation dialog
- Works for both plot and free-standing plants

**Position Rules**:
- Plants cannot share the same plot space (backend validation)
- Plot plants must have specific coordinates
- Visual indicators for occupied/available positions

### Plant Editing
**Details Page**:
- Click any plant to open editing page
- Edit name, species, health status, notes, watering schedule, planted date
- Form validation for required fields
- Location information display (area, plot, position)

**Plant Movement**:
- "🚚 Move Plant" button opens movement dialog
- Select different areas with dropdown
- Choose specific plots or "Free-standing (no plot)"
- Interactive position grid shows available vs occupied spaces
- Auto-selects first available position
- Prevents selecting occupied positions

### Plot Management
**Adding Plots**:
- "+ Add Plot" button in area headers
- Form includes name, type (raised-bed, container, ground, hydroponic)
- Dimensions (width × length in meters)
- Soil properties (type, pH, drainage)

**Removing Plots**:
- Remove button (✕) in plot headers
- Confirmation dialog warns about plant conversion
- Plot plants become free-standing in same area

### Advanced Features
- **Position Conflict Detection**: Backend validation prevents overlapping plants
- **Auto-positioning**: Finds first available position automatically
- **Interactive Grids**: Visual position selection with hover states
- **Real-time Validation**: Immediate error feedback for conflicts
- **Responsive Design**: Mobile-friendly with modern animations

## Architecture

**Frontend**: React 19.1.0 with Router, modern CSS, modal dialogs, form validation  
**Backend**: Spring Boot 3.2.0 with JPA, H2 database, CORS configuration  
**UI**: Card-based layout, interactive grids, position selection, real-time feedback

## Project Structure

```
potsandplots/
├── bin/potsandplots.js          # CLI tool for starting frontend
├── backend/                     # Spring Boot backend application
│   ├── src/main/java/com/potsandplots/
│   │   ├── controller/          # REST API endpoints
│   │   ├── model/              # JPA entities (Plant, Plot, Area, PlantType)
│   │   ├── repository/         # Data access layer
│   │   ├── dto/                # Data transfer objects
│   │   └── config/             # Configuration and data initialization
│   └── build.gradle            # Backend dependencies and build config
├── src/                        # React frontend application
│   ├── pages/                  
│   │   ├── PlantDashboard.jsx  # Main dashboard with interactive grids
│   │   └── PlantDetails.jsx    # Plant editing page with move dialog
│   ├── api/backendApi.js       # API client for backend communication
│   └── App.js                  # Main application with routing
├── public/                     # Static assets
├── package.json               # Frontend dependencies and scripts
└── README.md                  # Basic project information
```

## Key Files

- **PlantDashboard.jsx**: Main interface with area/plot management
- **PlantDetails.jsx**: Plant editing with movement dialog
- **PlantController.java**: Backend API with position validation
- **DataInitializer.java**: Sample data initialization
- **backendApi.js**: Frontend API client with error handling
