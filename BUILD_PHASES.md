# System Build Phases

# 系统开发阶段与功能覆盖计划

> **Purpose:** This document is the implementation roadmap for AI coding agents working on the Interactive UI Prototyping IDE.
>
> **目的：** 本文件是提供给 AI Coding Agent / AI Coworker 的系统开发路线图，用于确保 README 中定义的功能不会在开发过程中被遗漏、简化或错误实现。

---

# 0. Agent Mission / Agent 总任务

The AI agent must treat:

```text
README.md
BUILD_PHASES.md
```

as the primary product specification.

AI Agent 必须将：

```text
README.md
BUILD_PHASES.md
```

视为主要产品规格文件。

The agent must **not interpret the project as a simple Figma clone**.

This is an:

> **Interactive UI Prototyping IDE**

It combines:

```text
Visual Editor
+ Component System
+ Structured Layout
+ Shared Components
+ State System
+ Interaction System
+ Page Flow
+ Motion
+ Mock Data
+ Prototype Runtime
```

---

# 1. Non-Negotiable Development Rules

# 不可违反的开发规则

## Rule 1 — Do Not Remove Features

An existing feature must never be removed merely to simplify implementation.

如果某个功能实现困难：

```text
Do NOT:
- Delete the feature
- Quietly ignore it
- Replace it with an unrelated simplified feature

Do:
- Mark it as TODO
- Document the limitation
- Preserve the architecture required for future implementation
```

---

## Rule 2 — Do Not Build Everything in One Phase

The system must be developed incrementally.

不要试图一次完成整个系统。

Each phase must produce a working state.

每一个阶段都必须能够运行。

```text
Phase N
   ↓
Build
   ↓
Test
   ↓
Verify
   ↓
Document
   ↓
Next Phase
```

---

## Rule 3 — Preserve Architecture

Features should be implemented through reusable systems instead of one-off hacks.

Avoid:

```text
if component === "sidebar"
```

when the behavior should actually belong to the component system.

Prefer:

```text
ComponentDefinition
ComponentInstance
State
Interaction
Layout
```

---

## Rule 4 — Verify Before Claiming Completion

An AI agent must not claim:

```text
"Feature completed"
```

until it has been tested.

Minimum verification:

```text
Build
+
Runtime Test
+
Interaction Test
+
Regression Check
```

---

# 2. Master System Architecture

# 总体系统架构

```text
┌───────────────────────────────────────────────────────┐
│                    Editor UI                          │
│                                                       │
│  Toolbar │ Component Library │ Canvas │ Right Panel  │
│                         │                             │
│                    Context Menu                      │
└─────────────────────────┬─────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────┐
│                 Document Model                        │
│                                                       │
│ Project                                                │
│ ├── Pages                                              │
│ ├── Frames                                             │
│ ├── Components                                         │
│ ├── Assets                                             │
│ ├── States                                             │
│ ├── Interactions                                       │
│ ├── Flows                                              │
│ ├── Mock Data                                          │
│ └── Settings                                           │
└─────────────────────────┬─────────────────────────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Layout Engine  State Engine  Flow Engine
             │            │            │
             └────────────┼────────────┘
                          ▼
┌───────────────────────────────────────────────────────┐
│                 Prototype Runtime                     │
└───────────────────────────────────────────────────────┘
```

---

# 3. Development Phases

# 开发阶段总览

```text
PHASE 0   Foundation
   ↓
PHASE 1   Editor Shell
   ↓
PHASE 2   Document Model
   ↓
PHASE 3   Frame & Layout Engine
   ↓
PHASE 4   Component System
   ↓
PHASE 5   Drag / Drop / Manipulation
   ↓
PHASE 6   Right Panel
   ↓
PHASE 7   Context Menu
   ↓
PHASE 8   Shared Components
   ↓
PHASE 9   State System
   ↓
PHASE 10  Interaction System
   ↓
PHASE 11  Page Flow
   ↓
PHASE 12  Prototype Runtime
   ↓
PHASE 13  Motion System
   ↓
PHASE 14  Mock Data / API Simulation
   ↓
PHASE 15  Responsive System
   ↓
PHASE 16  Templates / Component Library
   ↓
PHASE 17  AI Integration
   ↓
PHASE 18  Persistence / Import / Export
   ↓
PHASE 19  Performance / Security / Reliability
   ↓
PHASE 20  Final QA / Release
```

---

# PHASE 0 — Foundation

# 阶段 0：基础设施

## Goal

Create a stable technical foundation.

建立稳定的技术基础。

### Tasks

- Project initialization
- Framework setup
- TypeScript
- React architecture
- Styling system
- State management
- Routing
- Component architecture
- Development environment
- Linting
- Formatting
- Testing infrastructure
- Build pipeline

### Required Output

```text
Project starts
      ↓
Editor loads
      ↓
No runtime errors
      ↓
Development build works
      ↓
Production build works
```

### Acceptance Criteria

- Application launches successfully
- No critical console errors
- TypeScript compiles
- Production build succeeds
- Basic test framework works

---

# PHASE 1 — Editor Shell

# 阶段 1：编辑器框架

Build the visual IDE shell.

建立整个编辑器 UI。

```text
┌─────────────────────────────────────┐
│ Toolbar                             │
├──────────┬────────────────┬─────────┤
│ Library  │ Canvas         │ Right   │
│          │                │ Panel   │
│          │                │         │
├──────────┴────────────────┴─────────┤
│ Status Bar                           │
└─────────────────────────────────────┘
```

### Features

- Toolbar
- Left component panel
- Canvas
- Right property panel
- Status bar
- Selection indicator
- Basic zoom
- Pan
- Canvas background

### Acceptance

User can open the application and clearly identify:

```text
Component Library
Canvas
Right Panel
Toolbar
```

---

# PHASE 2 — Document Model

# 阶段 2：文档数据模型

Create the internal representation of the application.

建立应用内部数据结构。

### Core Entities

```text
Project
Page
Frame
ComponentDefinition
ComponentInstance
State
Interaction
Flow
Asset
MockData
```

### Required Principle

The UI must render from the document model.

Do not hardcode the editor state separately from the document.

```text
Document
   ↓
Renderer
   ↓
Canvas
```

### Acceptance

A page can be represented entirely as structured data.

---

# PHASE 3 — Frame & Layout Engine

# 阶段 3：Frame 与布局引擎

This is a **critical system**.

这是整个项目的核心系统之一。

## Frame

Support:

```text
iPhone
iPad
Android
Laptop
Desktop
Browser
Custom
```

## Layout Modes

```text
Freeform
Grid
Auto Layout
```

---

## Grid System

Implement:

```text
Columns
Rows
Column Gap
Row Gap
Padding
Snap
Auto Placement
```

Example:

```text
4 × 2
```

Components must be able to occupy:

```text
1 × 1
2 × 1
1 × 2
2 × 2
...
```

---

## Grid Engine

Must support:

```text
Cell calculation
Component footprint
Collision detection
Placement preview
Auto placement
Resize
Drag
Snap
Overflow handling
```

### Acceptance Test

Create:

```text
Frame = 4 × 2
```

Place:

```text
Component A = 2 × 1
Component B = 1 × 1
Component C = 1 × 2
```

Verify:

- No illegal overlap
- Correct snapping
- Correct resizing
- Correct placement
- Correct visual rendering

---

# PHASE 4 — Component System

# 阶段 4：组件系统

Build the component architecture.

### Component Definition

```ts
ComponentDefinition {
  type
  name
  category
  props
  states
  events
  render
  preview
}
```

### Initial Components

Start with:

```text
Button
Text
Image
Input
Card
Container
Icon
Navbar
Sidebar
Modal
Panel
List
```

Do not attempt to implement hundreds of components immediately.

First prove the architecture.

### Acceptance

A component can be:

```text
Created
Added
Configured
Moved
Resized
Duplicated
Deleted
```

---

# PHASE 5 — Drag / Drop / Manipulation

# 阶段 5：拖放与组件操作

Implement:

```text
Drag
Drop
Move
Resize
Duplicate
Delete
Multi-select
Selection
Snap
Undo
Redo
```

### Grid Integration

Dragging into a Grid must use:

```text
Footprint
+
Collision Detection
+
Snap
+
Auto Placement
```

### Acceptance

User can drag a component from the library into a Frame and place it correctly.

---

# PHASE 6 — Right Panel

# 阶段 6：右侧属性面板

The Right Panel becomes the detailed configuration center.

### Sections

```text
Properties
Layout
Grid
Position
Size
Appearance
States
Interactions
Animation
Component
```

---

## Grid Panel

Must support:

```text
Columns
Rows
Gap
Padding
Snap
Auto Place
Show Grid
```

Changes must update Canvas immediately.

### Acceptance

Changing:

```text
4 × 2
```

to:

```text
6 × 4
```

must immediately update the Frame.

---

# PHASE 7 — Context Menu

# 阶段 7：右键菜单

Implement context-sensitive right-click menus.

### Frame

```text
Layout
Grid
Auto Layout
Freeform

Grid Settings
Show Grid
Snap
Auto Arrange
```

### Component

```text
Duplicate
Delete
Bring Forward
Send Backward
Create Component
Detach
Add Interaction
```

### Important Rule

Context Menu and Right Panel must use the **same underlying data model**.

Never create two separate implementations.

```text
Right Click
     ↓
Command
     ↓
Document Model
     ↓
Right Panel + Canvas
```

---

# PHASE 8 — Shared Components

# 阶段 8：共享组件

Implement reusable components.

Example:

```text
Global Sidebar
```

Used by:

```text
Dashboard
Analytics
Settings
Profile
```

### Required

```text
Shared structure
Shared style
Shared properties
Local instance state
Local placement
Local active item
```

---

# PHASE 9 — State System

# 阶段 9：状态系统

Implement component state.

### Button

```text
Default
Hover
Focus
Pressed
Disabled
Loading
Success
```

### Input

```text
Empty
Focus
Filled
Error
Success
Disabled
Loading
```

### Page

```text
Loading
Loaded
Empty
Error
Offline
```

### Acceptance

State changes can be previewed without modifying the base component.

---

# PHASE 10 — Interaction System

# 阶段 10：交互系统

Implement:

## Triggers

```text
Click
Hover
Press
Scroll
Load
Delay
Drag
Keyboard
```

## Actions

```text
Navigate
Open Overlay
Close Overlay
Toggle
Change State
Run Action
External URL
Play Animation
```

### Example

```text
Button
  ↓ click
Loading
  ↓
Mock API
  ↓ success
Navigate
  ↓
Dashboard
```

---

# PHASE 11 — Page Flow

# 阶段 11：页面流程

Create visual application flow.

### Requirements

- Page nodes
- Connections
- Branches
- Navigation
- Overlay relationships
- Flow visualization
- Connection editing

Example:

```text
Login
  │
  ▼
Dashboard
 ├── Analytics
 ├── Settings
 └── Profile
```

---

# PHASE 12 — Prototype Runtime

# 阶段 12：原型运行时

This is where the project becomes an actual interactive prototype system.

The runtime must execute:

```text
Component
State
Interaction
Navigation
Overlay
Animation
Mock Data
```

### Example

```text
User clicks Login
        ↓
Button Loading
        ↓
Mock API
        ↓
Success
        ↓
Animation
        ↓
Dashboard
```

### Acceptance

A complete multi-page prototype must be usable without entering Design Mode.

---

# PHASE 13 — Motion System

# 阶段 13：动画系统

Implement:

```text
Fade
Slide
Scale
Spring
Blur
Parallax
Marquee
Scroll Reveal
```

### Animation Properties

```text
Duration
Delay
Easing
Spring
Repeat
Direction
Stagger
```

Later add timeline editing.

---

# PHASE 14 — Mock Data / API Simulation

# 阶段 14：Mock 数据与 API 模拟

Implement:

```text
Mock JSON
HTTP Method
URL
Delay
Status Code
Success
Error
Timeout
```

Example:

```text
GET /api/users

Delay: 800ms

200
{
  "users": [...]
}
```

This allows realistic prototypes without requiring a backend.

---

# PHASE 15 — Responsive Layout

# 阶段 15：响应式布局

Implement:

```text
Desktop
Tablet
Mobile
```

Example:

```text
Desktop → 12 columns
Tablet  → 8 columns
Mobile  → 4 columns
```

The system should preserve logical component relationships when changing Frame size.

---

# PHASE 16 — Component Library Expansion

# 阶段 16：组件库扩展

Only after the component architecture is stable should the library become large.

## Categories

```text
Basic UI
Navigation
Content
Feedback
Data
Media
Authentication
E-Commerce
AI / Agent
Motion
Background
3D
Device Shells
Application Patterns
```

---

# PHASE 17 — Templates

# 阶段 17：模板系统

Create reusable templates.

### Pages

```text
Login
Dashboard
Analytics
Settings
Profile
Billing
Chat
AI Assistant
```

### Applications

```text
Admin Dashboard
SaaS Dashboard
E-Commerce
Social Application
AI Application
```

Templates should be composed from normal components.

Do not create a separate template-only rendering system.

---

# PHASE 18 — AI Integration

# 阶段 18：AI 集成

AI should be added **after the underlying document model is stable**.

AI should manipulate the same document model used by humans.

```text
User Prompt
     ↓
AI Planner
     ↓
Document Operations
     ↓
Project
     ↓
Canvas
```

Example:

> Create a SaaS dashboard with a sidebar, navbar, KPI cards and analytics chart.

AI generates:

```text
Page
 ↓
Frame
 ↓
Grid
 ↓
Sidebar
 ↓
Navbar
 ↓
Cards
 ↓
Chart
```

---

# PHASE 19 — Persistence / Import / Export

# 阶段 19：持久化与导入导出

Implement:

```text
Save Project
Load Project
Autosave
Version
Undo
Redo
Import
Export
```

Possible formats:

```text
Project JSON
Asset Package
Prototype Package
```

---

# PHASE 20 — Performance / Security / Reliability

# 阶段 20：性能、安全与可靠性

Critical areas:

```text
Large Projects
Many Components
Large Component Library
Complex Flow Graphs
Animation Performance
Memory Usage
Undo/Redo
Autosave
Malformed Project Data
External Component Security
```

Test:

```text
100 components
500 components
1,000 components
```

Do not optimize only for small demos.

---

# PHASE 21 — Final QA

# 阶段 21：最终质量验证

The final system must be tested as a complete workflow.

## Test Scenario

```text
Create Project
 ↓
Create Dashboard Page
 ↓
Create Laptop Frame
 ↓
Set Grid = 4 × 2
 ↓
Add Sidebar
 ↓
Add Navbar
 ↓
Add Cards
 ↓
Resize Components
 ↓
Create Shared Sidebar
 ↓
Create Settings Page
 ↓
Reuse Sidebar
 ↓
Change Active Selection
 ↓
Create Button Interaction
 ↓
Navigate to Settings
 ↓
Add Loading State
 ↓
Add Animation
 ↓
Run Prototype
```

Every step must work.

---

# 4. Feature Traceability Matrix

# 功能追踪矩阵

This section exists specifically to prevent feature loss.

| Feature                   |  Phase | Required |
| ------------------------- | -----: | -------: |
| Project                   |    0–2 |     MUST |
| Pages                     |      2 |     MUST |
| Fixed Frame               |      3 |     MUST |
| Device Templates          |      3 |     MUST |
| Freeform Layout           |      3 |     MUST |
| Grid Layout               |      3 |     MUST |
| Grid Columns              |      3 |     MUST |
| Grid Rows                 |      3 |     MUST |
| Grid Gap                  |      3 |     MUST |
| Grid Padding              |      3 |     MUST |
| Grid Snap                 |      3 |     MUST |
| Grid Auto Placement       |      3 |     MUST |
| Component Footprint       |      3 |     MUST |
| Collision Detection       |      3 |     MUST |
| Auto Layout               |      3 |     MUST |
| Component Library         |      4 |     MUST |
| Drag & Drop               |      5 |     MUST |
| Resize                    |      5 |     MUST |
| Multi-select              |      5 |     MUST |
| Undo / Redo               | 5 / 19 |     MUST |
| Right Panel               |      6 |     MUST |
| Grid Right Panel          |      6 |     MUST |
| Right Click Menu          |      7 |     MUST |
| Grid Right Click          |      7 |     MUST |
| Shared Components         |      8 |     MUST |
| Component Slots           |      8 |   SHOULD |
| Local Component State     |    8–9 |     MUST |
| Component States          |      9 |     MUST |
| Interactions              |     10 |     MUST |
| Page Navigation           |  10–11 |     MUST |
| Flow Editor               |     11 |     MUST |
| Prototype Runtime         |     12 |     MUST |
| Motion                    |     13 |     MUST |
| Mock Data                 |     14 |   SHOULD |
| Mock API                  |     14 |   SHOULD |
| Responsive Layout         |     15 |   SHOULD |
| Large Component Library   |     16 |   SHOULD |
| Templates                 |     17 |   SHOULD |
| AI UI Generation          |     18 |    LATER |
| AI Interaction Generation |     18 |    LATER |
| Save / Load               |     19 |     MUST |
| Import / Export           |     19 |   SHOULD |
| Performance               |     20 |     MUST |
| Security                  |     20 |     MUST |
| Final QA                  |     21 |     MUST |

---

# 5. Definition of Done

# 完成定义

A feature is considered complete only when all of these are true:

```text
[ ] Implemented
[ ] Integrated into Document Model
[ ] UI implemented
[ ] Runtime behavior implemented where required
[ ] Error handling implemented
[ ] Tested
[ ] Regression tested
[ ] Documentation updated
```

A feature must **not** be marked complete simply because the UI exists.

---

# 6. AI Agent Workflow

# AI Agent 工作流程

Every AI coding agent should follow:

```text
1. Read README.md
2. Read BUILD_PHASES.md
3. Inspect existing code
4. Identify current phase
5. Identify dependencies
6. Create implementation plan
7. Implement smallest stable unit
8. Run tests
9. Run application
10. Verify behavior
11. Check regression
12. Update documentation
13. Report completed features
14. Report remaining features
```

---

# 7. Before Coding

# 编码前

The agent must inspect:

```text
Project structure
Existing components
Existing state management
Existing routes
Existing styling
Existing tests
Existing dependencies
```

Do not rewrite working systems without justification.

---

# 8. Before Every Major Feature

# 每个大型功能开发前

The agent should answer internally:

```text
What data does this feature require?

Which existing system owns this behavior?

Does this need a new abstraction?

Will this affect existing components?

Will this affect the runtime?

Will this affect persistence?

How will it be tested?
```

---

# 9. After Every Phase

# 每个阶段结束后

Generate:

```text
PHASE STATUS
────────────────────────────

Phase:
Status:

Completed:
- ...

Tested:
- ...

Known Issues:
- ...

Not Implemented:
- ...

Technical Debt:
- ...

Next Phase:
- ...
```

---

# 10. Do Not Hide Technical Debt

# 不允许隐藏技术债务

If a shortcut is required:

```text
Document it.
```

Example:

```text
Known Limitation:

Grid auto-placement currently supports rectangular
footprints but does not yet support irregular shapes.

Planned improvement:
Phase 15+
```

Never silently create temporary architecture that becomes permanent.

---

# 11. Architecture Integrity Rules

# 架构完整性规则

## Rule A

Right Panel and Context Menu must modify the same document state.

```text
Right Panel
     │
     ▼
Command / Action
     │
     ▼
Document Model
     ▲
     │
Context Menu
```

---

## Rule B

Shared Components must not duplicate their definition.

```text
Shared Component
      │
      ├── Instance A
      ├── Instance B
      └── Instance C
```

---

## Rule C

Grid position must not be confused with pixel position.

```text
Logical:

column = 2
row = 1
columnSpan = 2

        ↓

Layout Engine

        ↓

Rendered:

x = ...
y = ...
width = ...
height = ...
```

---

## Rule D

Prototype Runtime must use the same project model as the editor.

```text
Editor
  ↓
Project Model
  ↓
Runtime
```

Do not create a separate incompatible prototype representation.

---

# 12. Priority Classification

# 功能优先级

## P0 — Foundation

The system cannot function without these.

```text
Project
Page
Frame
Component
Document Model
Canvas
Grid
Layout Engine
Drag & Drop
Right Panel
```

## P1 — Core Product

```text
Shared Components
States
Interactions
Navigation
Flow
Prototype Runtime
Persistence
```

## P2 — Advanced

```text
Motion
Mock API
Responsive Layout
Templates
Large Component Library
```

## P3 — Expansion

```text
AI Generation
Plugin System
Code Export
Advanced 3D
Advanced AI Agent
```

---

# 13. Critical Dependencies

# 关键依赖关系

The agent must respect this dependency order:

```text
Document Model
      ↓
Frame
      ↓
Layout Engine
      ↓
Component System
      ↓
Drag & Drop
      ↓
Right Panel
      ↓
Context Menu
      ↓
Shared Components
      ↓
State System
      ↓
Interaction System
      ↓
Flow
      ↓
Prototype Runtime
      ↓
Motion / Mock API
      ↓
Responsive
      ↓
AI
```

Do not build advanced AI generation before the document model is stable.

---

# 14. Final Feature Tree

# 最终功能树

```text
Interactive UI Prototyping IDE
│
├── Editor
│   ├── Toolbar
│   ├── Canvas
│   ├── Component Library
│   ├── Right Panel
│   └── Context Menu
│
├── Project
│   ├── Pages
│   ├── Frames
│   ├── Assets
│   └── Settings
│
├── Layout
│   ├── Freeform
│   ├── Grid
│   │   ├── Columns
│   │   ├── Rows
│   │   ├── Gap
│   │   ├── Padding
│   │   ├── Snap
│   │   ├── Footprint
│   │   ├── Collision
│   │   └── Auto Placement
│   │
│   └── Auto Layout
│
├── Components
│   ├── Primitive
│   ├── Components
│   ├── Patterns
│   ├── Shared Components
│   ├── Slots
│   └── Templates
│
├── State
│   ├── Component State
│   └── Page State
│
├── Interaction
│   ├── Triggers
│   ├── Actions
│   ├── Navigation
│   └── Overlay
│
├── Flow
│   ├── Page Nodes
│   ├── Connections
│   └── Branches
│
├── Runtime
│   ├── Preview
│   ├── Navigation
│   ├── State
│   ├── Interaction
│   └── Animation
│
├── Motion
│   ├── Transitions
│   ├── Timeline
│   ├── Easing
│   └── Spring
│
├── Data
│   ├── Mock Data
│   ├── Mock API
│   ├── Loading
│   ├── Empty
│   └── Error
│
├── Responsive
│   ├── Desktop
│   ├── Tablet
│   └── Mobile
│
├── Persistence
│   ├── Save
│   ├── Load
│   ├── Autosave
│   ├── Undo
│   └── Redo
│
└── AI
    ├── UI Generation
    ├── Component Generation
    ├── Layout Generation
    ├── Interaction Generation
    └── Application Generation
```

---

# 15. Final Agent Instruction

# 最终 Agent 指令

Before declaring the project complete, compare the implementation against:

```text
README.md
BUILD_PHASES.md
Feature Traceability Matrix
Final Feature Tree
```

The agent must explicitly identify:

```text
IMPLEMENTED
PARTIALLY IMPLEMENTED
NOT IMPLEMENTED
KNOWN LIMITATIONS
```

The agent must never assume that a visually similar feature is equivalent to the specified feature.

For example:

```text
"Grid is visible"
```

does NOT mean:

```text
"Grid system is complete."
```

A complete Grid system requires:

```text
Grid Configuration
+
Right Panel
+
Right Click
+
Footprint
+
Snap
+
Collision Detection
+
Auto Placement
+
Resize
+
Document Persistence
+
Runtime Compatibility
```

Likewise:

```text
"Sidebar appears on multiple pages"
```

does NOT automatically mean:

```text
"Shared Component System is complete."
```

A complete shared component system requires:

```text
Shared Definition
+
Multiple Instances
+
Global Updates
+
Local Instance State
+
Local Placement
+
Slots where applicable
```

---

# 16. Completion Standard

# 最终完成标准

The project is ready for release only when a user can perform this complete workflow:

```text
Create Project
       ↓
Create Page
       ↓
Create Fixed Frame
       ↓
Choose Device
       ↓
Set Grid
       ↓
Configure Grid from Right Panel
       ↓
Configure Grid from Right Click
       ↓
Drag Components
       ↓
Resize Components
       ↓
Snap Components
       ↓
Auto Arrange Components
       ↓
Create Shared Sidebar
       ↓
Reuse Sidebar on Multiple Pages
       ↓
Configure Page-Specific Active State
       ↓
Create Interaction
       ↓
Connect Pages
       ↓
Add Loading / Success / Error States
       ↓
Add Animation
       ↓
Add Mock Data
       ↓
Run Prototype
       ↓
Navigate Through Application
       ↓
Save Project
       ↓
Reload Project
       ↓
Everything remains intact
```

If any critical step fails, the system should **not** be considered feature-complete.

---

# 17. Build Philosophy

# 开发理念

The goal is not:

> Build a collection of UI components.

The goal is:

> **Build a system in which components, layout, state, interaction, flow and runtime behavior form one coherent application model.**

最终目标不是：

> 做一个很多 UI Component 的网站。

而是：

> **建立一个让组件、布局、状态、交互、页面流程和运行时行为统一在同一个应用模型中的可视化开发系统。**

```text
Component
      +
Layout
      +
State
      +
Interaction
      +
Flow
      +
Runtime
      =
Interactive Application Prototype
```

This document should remain alongside `README.md` throughout development and should be updated whenever the architecture or feature scope changes.
