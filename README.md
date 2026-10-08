# Interactive UI Prototyping IDE

A modern visual application prototyping environment designed for building interactive, executable user interface prototypes.

Unlike traditional static design tools that only define visual appearance, this IDE models functional component behavior: responsive layouts, interactive states, trigger-action workflows, multi-page routing flows, animation presets, mock API endpoints, and real-time execution in a runtime simulator.

---

## Features

- **Visual Design Canvas**: Flexible canvas with drag-and-drop placement, customizable grid layouts (12-column, fluid rows, gutters, padding), and visual resize controls.
- **Component System & Registry**: Extensive set of UI primitives including buttons, inputs, cards, tables, navigation bars, modals, charts, and feedback alerts.
- **Shared Components**: Global component definitions with reusable instances and local state/prop overrides across multiple pages.
- **State Machine & Variant Engine**: Interactive states (`default`, `hover`, `active`, `focus`, `disabled`, and custom states) that reflect both in the editor and in preview mode.
- **Interaction Engine**: Event-driven interaction workflows supporting triggers (`click`, `hover`, `focus`, `change`, `load`, `submit`) linked to actions (`navigate`, `setState`, `openOverlay`, `closeOverlay`, `toggle`, `apiCall`).
- **Visual Flow Editor**: Graph-based node canvas mapping page transitions and navigation relationships.
- **Prototype Runtime Simulator**: In-browser execution engine simulating page routing, state updates, animations, and mock HTTP responses.
- **Motion & Animations**: Built-in animation presets (`fade`, `slide`, `scale`, `spring-bounce`) with customizable easing, durations, and delays.
- **Mock REST API**: Embedded mock endpoint manager with latency simulation, custom payloads, and request logging.
- **Clean Export**: One-click JSON project backup, restore, and production-ready React + Tailwind CSS code generation.

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 5](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with [Immer](https://immerjs.github.io/immer/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/) with React Testing Library & jsdom
- **Linting**: [ESLint 9](https://eslint.org/)

---

## Project Structure

```text
UI-builder/
├── src/
│   ├── components/            # UI component definitions and renderers
│   │   ├── registry/          # Built-in component definitions & registry lookup
│   │   └── renderers/         # Unified canvas/runtime component renderers
│   ├── editor/                # IDE interface and panels
│   │   ├── Canvas/            # Drag-and-drop canvas, frame & component renderers
│   │   ├── ContextMenu/       # Right-click contextual action menus
│   │   ├── FlowEditor/        # Visual node graph for page navigation
│   │   ├── LeftPanel/         # Pages, components, templates & mock data tabs
│   │   ├── Modals/            # AI generation & code export modals
│   │   ├── Preview/           # Prototype runtime simulator
│   │   ├── RightPanel/        # Properties, layout, grid, states & interactions
│   │   ├── StatusBar/         # Context status, zoom, and selection breadcrumbs
│   │   ├── Toolbar/           # Mode switching, canvas controls, and project actions
│   │   └── Editor.tsx         # Main IDE application shell
│   ├── engine/                # Core engines
│   │   ├── aiEngine.ts        # Natural language UI generation engine
│   │   ├── exportEngine.ts    # JSON serialization and React code exporter
│   │   ├── flowEngine.ts      # Multi-page navigation graph engine
│   │   ├── interactionEngine.ts # Event-action trigger executor
│   │   ├── layoutEngine.ts    # Grid math, collision detection, and placement
│   │   ├── motionEngine.ts    # CSS keyframe & transition engine
│   │   ├── responsiveEngine.ts# Breakpoint presets (Desktop, Laptop, iPad, Phone)
│   │   ├── stateEngine.ts     # Component state management
│   │   ├── templateEngine.ts  # Pre-built application prototype templates
│   │   └── index.ts           # Unified engine barrel exports
│   ├── lib/                   # Utility functions (cn helper, clsx)
│   ├── store/                 # Zustand state stores
│   │   ├── editorStore.ts     # Canvas zoom, panel visibility, selection state
│   │   ├── projectStore.ts    # Document tree, page/frame/component CRUD, undo/redo
│   │   ├── sharedComponentStore.ts # Reusable component registry & overrides
│   │   ├── mockApiStore.ts    # Mock endpoint definitions & mock requests
│   │   ├── projectFactory.ts  # Factory methods for initial models
│   │   └── index.ts           # Store barrel exports
│   ├── test/                  # Test suites (unit, integration & stress tests)
│   ├── types/                 # TypeScript type definitions
│   ├── App.tsx                # Application root
│   ├── index.css              # Global styles & Tailwind directives
│   └── main.tsx               # Application entry point
├── index.html                 # HTML shell
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` or `pnpm`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/lingjw02/UI-builder.git
cd UI-builder
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start prototyping.

### Running Tests

Run the Vitest test suite:

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Open Vitest UI
npm run test:ui
```

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

To preview the built output locally:

```bash
npm run preview
```

### Code Quality & Linting

Run ESLint across TypeScript and TSX files:

```bash
npm run lint
```

---

## Core Architecture

### Document Model

The application structure is strictly hierarchical:

$$\text{Project} \longrightarrow \text{Pages} \longrightarrow \text{Frames} \longrightarrow \text{Components} \longrightarrow \text{States \& Interactions}$$

- **Project**: Root container holding metadata, global settings, and pages.
- **Page**: Represents a route or screen in the application.
- **Frame**: Responsive container with defined dimensions and grid configurations (freeform or grid).
- **Component**: Discrete UI element with layout coordinates, properties, active state, and event interactions.

### Unified Document Contract

Both the **Visual Editor** (design time) and the **Prototype Runtime** (execution time) share the exact same underlying document model. Changes made in the editor immediately reflect in preview mode without transformation lag or intermediate compilation steps.

---

## License

MIT
