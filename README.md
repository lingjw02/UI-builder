# Interactive UI Prototyping IDE

# 交互式 UI 原型设计 IDE

> A visual development environment for building interactive applications through components, layouts, states, interactions, and page flows — not merely static UI mockups.
>
> 一个通过组件、布局、状态、交互和页面流程构建可交互应用原型的可视化开发环境，而不只是静态 UI 设计工具。

---

## 1. Vision / 产品愿景

### English

This project aims to build a **Figma-like visual application prototyping IDE** focused on interactive application behavior.

Instead of only designing how an interface looks, users should be able to define:

- What components exist
- Where components are placed
- How components are arranged
- How components behave
- What happens when users interact with them
- How pages connect
- How components change state
- How animations and transitions work
- How mock data and API responses behave

The final prototype should be **clickable and executable**, rather than simply a static design image.

### 中文

本项目旨在构建一个类似 **Figma 的可视化应用原型开发 IDE**，但重点不只是 UI 外观，而是完整的交互行为。

用户应该能够定义：

- 页面中有哪些组件
- 组件放在哪里
- 组件如何排列
- 组件如何响应操作
- 用户点击后发生什么
- 页面之间如何连接
- 组件如何改变状态
- 动画和页面转换如何运行
- Mock 数据和 API 如何模拟

最终生成的不是静态设计图，而是一个可以**真正点击、操作和运行的交互式原型**。

---

# 2. Core Concept / 核心概念

The system is built around seven fundamental concepts:

系统由七个核心概念组成：

```text
Project
   ↓
Page
   ↓
Frame
   ↓
Layout
   ↓
Component
   ↓
State
   ↓
Interaction
   ↓
Flow
```

### English

| Concept     | Purpose                         |
| ----------- | ------------------------------- |
| Project     | Complete application            |
| Page        | A screen/application state      |
| Frame       | Fixed visual/device workspace   |
| Layout      | Controls component arrangement  |
| Component   | UI element                      |
| State       | Current component condition     |
| Interaction | Defines what happens            |
| Flow        | Connects pages and interactions |

### 中文

| 概念          | 作用         |
| ----------- | ---------- |
| Project     | 整个应用项目     |
| Page        | 一个页面 / 屏幕  |
| Frame       | 固定尺寸的工作区域  |
| Layout      | 控制组件排列方式   |
| Component   | UI 元素      |
| State       | 组件当前状态     |
| Interaction | 定义用户操作后的行为 |
| Flow        | 页面和交互之间的连接 |

---

# 3. Editor Structure / 编辑器结构

The editor should follow a familiar visual IDE structure.

编辑器采用类似 Figma / Web Builder / IDE 的结构：

```text
┌─────────────────────────────────────────────────────────────┐
│                         Toolbar                             │
├──────────────┬───────────────────────────────┬──────────────┤
│              │                               │              │
│   Component  │                               │    Right     │
│    Library   │            Canvas             │    Panel     │
│              │                               │              │
│              │                               │              │
│              │                               │              │
├──────────────┴───────────────────────────────┴──────────────┤
│                         Status Bar                          │
└─────────────────────────────────────────────────────────────┘
```

### Left Panel

Component discovery and insertion.

左侧：

- Component Library
- Search
- Categories
- Templates
- Shared Components
- Recently Used

### Canvas

The main visual editing area.

中央 Canvas：

- Drag & drop
- Resize
- Move
- Snap
- Grid visualization
- Component selection
- Multi-selection
- Preview

### Right Panel

Precise property and layout configuration.

右侧：

- Properties
- Layout
- Grid
- Position
- Size
- States
- Interactions
- Animation
- Component settings

---

# 4. Frame System / Frame 系统

A Frame represents a fixed visual workspace.

Frame 是一个固定的视觉工作区域。

Examples:

```text
iPhone
iPad
Android Phone
Laptop
Desktop
Browser
Custom
```

Users can create:

```text
Frame
├── Width
├── Height
├── Device Type
├── Background
├── Layout Mode
├── Grid
├── Constraints
└── Components
```

### Example

```text
Laptop Frame
1440 × 900

┌───────────────────────────────────┐
│                                   │
│                                   │
│                                   │
│                                   │
└───────────────────────────────────┘
```

The Frame is the boundary in which components are arranged.

Frame 是组件进行布局和排列的边界。

---

# 5. Layout System / 布局系统

The system should support three primary layout modes.

系统应该支持三种主要布局模式：

```text
Freeform
Grid
Auto Layout
```

## 5.1 Freeform / 自由布局

Components use:

```text
x
y
width
height
rotation
```

Useful for:

- Creative layouts
- Illustrations
- Landing pages
- Experimental designs

---

## 5.2 Grid / 网格布局

Grid is a first-class Frame feature.

Grid 是 Frame 的核心布局功能，而不是组件的附加属性。

Example:

```text
4 × 2 Grid

┌─────────────┬─────────────┐
│             │             │
│     1       │      2      │
│             │             │
├─────────────┼─────────────┤
│             │             │
│     3       │      4      │
│             │             │
└─────────────┴─────────────┘
```

The user can define:

- Columns
- Rows
- Horizontal Gap
- Vertical Gap
- Padding
- Alignment
- Snap
- Auto Placement

Example:

```text
Columns: 4
Rows: 2

Horizontal Gap: 16px
Vertical Gap: 16px

Padding:
Top: 24px
Right: 24px
Bottom: 24px
Left: 24px
```

---

# 6. Grid Configuration / Grid 配置

Grid settings must be accessible from the **Right Panel**.

Grid 设置必须可以直接在**右侧属性面板**中操作。

```text
FRAME
────────────────────────────

Size
Width       [ 1440 ]
Height      [ 900 ]

Layout
○ Freeform
● Grid
○ Auto Layout

GRID
────────────────────────────

Columns    [ 4 ]
Rows       [ 2 ]

Gap
Horizontal [ 16 ]
Vertical   [ 16 ]

Padding
Top        [ 24 ]
Right      [ 24 ]
Bottom     [ 24 ]
Left       [ 24 ]

☑ Show Grid
☑ Snap to Grid

Placement
○ Manual
● Auto Place
```

Changing the values should immediately update the Frame.

修改参数后，Canvas 应该立即更新。

---

# 7. Right-Click Grid Controls / 右键 Grid 控制

Grid functionality should also be accessible through the contextual right-click menu.

Grid 功能同时应该通过右键菜单快速访问。

Example:

```text
┌──────────────────────────────┐
│ Add Component             ▶  │
│ Duplicate                    │
│ ──────────────────────────── │
│ Layout                    ▶  │
│   Grid                       │
│   Auto Layout                │
│   Freeform                   │
│ ──────────────────────────── │
│ Grid Settings...             │
│   Columns: 4                 │
│   Rows: 2                    │
│   Gap: 16px                  │
│ ──────────────────────────── │
│ Show Grid                    │
│ Snap to Grid                 │
│ Auto Arrange                 │
│ ──────────────────────────── │
│ Extract Component            │
│ Create Shared Component      │
└──────────────────────────────┘
```

### Important UX rule

`Grid Settings...` should open or focus the corresponding section of the Right Panel.

It should **not create a second independent configuration system**.

> Right-click = quick control\
> Right Panel = detailed control

右键负责快速操作，右侧面板负责完整配置。

---

# 8. Component Footprint / 组件占用区域

Components should not simply have arbitrary pixel positions when using Grid mode.

在 Grid 模式下，组件不应该只保存任意的像素坐标。

Instead, every component instance can have a **layout footprint**.

例如：

```json
{
  "gridColumn": 1,
  "gridRow": 1,
  "columnSpan": 2,
  "rowSpan": 1
}
```

This means:

```text
Start Column = 1
Start Row    = 1

Width        = 2 columns
Height       = 1 row
```

### Example

```text
4 × 2 Grid

┌───────────┬───────────┐
│ Navbar                │
│        4 × 1          │
├─────┬─────┬─────┬─────┤
│Side │     Content     │
│bar  │                 │
│1×1  │      3×1        │
└─────┴─────┴─────┴─────┘
```

The system calculates the actual pixel position from the grid.

系统根据 Grid 自动计算实际像素位置。

---

# 9. Auto Placement / 自动排列

When a user drags a component into a Grid Frame, the system should determine where it can fit.

当用户把组件拖入 Grid Frame 时，系统应该自动寻找合适的位置。

Example:

```text
Component footprint:

Card
2 × 1
```

The system should:

1. Detect available cells
2. Detect collisions
3. Find valid positions
4. Preview the position
5. Snap the component
6. Update the layout

流程：

```text
Drag
 ↓
Calculate Footprint
 ↓
Check Grid
 ↓
Collision Detection
 ↓
Find Available Space
 ↓
Preview
 ↓
Snap
 ↓
Commit
```

---

# 10. Auto Layout / 自动布局

Grid should not be forced onto every UI structure.

Grid 并不应该强制用于所有 UI。

Auto Layout is useful for:

- Buttons
- Navigation items
- Forms
- Lists
- Horizontal toolbars
- Vertical menus
- Cards
- Repeated components

Example:

```text
Button Group

[ Cancel ] [ Save ] [ Submit ]

Direction: Horizontal
Gap: 12px
Alignment: Center
```

Therefore:

```text
Frame
 ├── Grid
 │    ├── Sidebar
 │    └── Content
 │
 └── Auto Layout
      └── Button Group
```

This allows Grid and Auto Layout to work together.

---

# 11. Shared Components / 共享组件

Components can be converted into reusable shared components.

组件可以转换成全局共享组件。

Example:

```text
Global Components

├── Navbar
├── Sidebar
├── Footer
├── Mobile Navigation
└── User Menu
```

A Sidebar can appear on:

```text
Dashboard
Analytics
Settings
Profile
```

But all instances reference the same component definition.

```text
Sidebar
   │
   ├── Dashboard Instance
   ├── Analytics Instance
   ├── Settings Instance
   └── Profile Instance
```

Changing the Sidebar structure or styling updates all instances.

---

# 12. Page-Specific State / 页面独立状态

Although the component is shared, its state should be local to each page.

虽然组件结构是共享的，但每个页面可以拥有独立状态。

Example:

```text
Shared Sidebar
```

Dashboard:

```text
Home = Active
```

Analytics:

```text
Analytics = Active
```

Settings:

```text
Settings = Active
```

Therefore:

```text
Shared Component
       │
       ├── Structure = Global
       ├── Style = Global
       │
       └── Instance State = Local
```

This prevents duplicated navigation components.

---

# 13. Slots / 插槽系统

Shared components should support slots.

共享组件应该支持 Slot。

Example:

```text
Navbar
├── Logo Slot
├── Left Slot
├── Center Slot
└── Right Slot
```

A page can insert its own content into a slot without modifying the shared component structure.

这样可以让页面自定义内容，同时保持组件结构统一。

---

# 14. Component System / 组件系统

Components should be organized hierarchically.

组件应该采用层级化结构：

```text
Primitive
    ↓
Component
    ↓
Pattern
    ↓
Page
    ↓
Application
```

Example:

```text
Button
 ↓
Login Button
 ↓
Login Form
 ↓
Login Page
 ↓
Application
```

---

# 15. Component Categories / 组件分类

### Basic UI

- Button
- Icon Button
- Input
- Textarea
- Checkbox
- Radio
- Switch
- Slider
- Select
- Date Picker

### Navigation

- Navbar
- Sidebar
- Bottom Navigation
- Tabs
- Breadcrumb
- Pagination
- Stepper
- Command Menu

### Content

- Card
- List
- Table
- Timeline
- Accordion
- Carousel
- Gallery
- Feed

### Feedback

- Toast
- Alert
- Modal
- Dialog
- Tooltip
- Popover
- Progress
- Spinner
- Skeleton

### Data

- Chart
- Graph
- Statistic
- KPI
- Heatmap
- Calendar
- Data Table
- Map

### Media

- Image
- Video
- Audio Player
- Video Player
- Image Gallery
- Lightbox
- File Preview

### Authentication

- Login
- Register
- OTP
- Forgot Password
- OAuth Button
- Profile

### E-Commerce

- Product Card
- Product Gallery
- Shopping Cart
- Price
- Rating
- Checkout
- Payment

### AI / Agent UI

- Chat Window
- Message
- Streaming Message
- Conversation List
- AI Input
- Prompt Box
- Model Selector
- Thinking Indicator
- Tool Call
- Citation
- Reasoning Panel
- Agent Status
- Tool Execution
- Task Progress
- Human Approval

---

# 16. Component Definition / 组件定义

A component should contain more than visual information.

组件定义不仅应该包含视觉信息。

```ts
interface ComponentDefinition {
  type: string;
  name: string;
  category: string;

  props: PropDefinition[];

  states?: StateDefinition[];

  events?: EventDefinition[];

  render: React.ComponentType<any>;

  preview?: React.ComponentType<any>;
}
```

Conceptually:

```text
Component
├── Visual
├── Properties
├── Layout
├── State
├── Events
├── Interaction
├── Animation
└── Preview
```

---

# 17. External Component Library / 外部 React 组件库

The project should be able to discover and adapt existing React components.

项目应该能够发现并适配现有 React 组件。

External component:

```text
React Component
      ↓
Adapter
      ↓
ComponentDefinition
      ↓
Editor
      ↓
Prototype Runtime
```

The external component library should therefore be treated as a **component discovery source**, rather than assuming every library has the same API or design system.

外部 React 组件库更适合作为**组件发现和收集来源**，而不是直接假设所有组件都可以无差别运行。

---

# 18. Component States / 组件状态

Every interactive component may have multiple states.

每个交互组件可以拥有多个状态。

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

The state system should be reusable by both the editor and prototype runtime.

---

# 19. Interaction System / 交互系统

Interaction should be a first-class object.

交互应该是系统中的一级对象。

Example:

```json
{
  "trigger": "click",
  "action": "navigate",
  "target": "dashboard"
}
```

### Triggers

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

### Actions

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

---

# 20. Page Flow / 页面流程

Pages should be connected through a visual flow system.

页面之间应该通过可视化 Flow 系统连接。

```text
Login
  │
  ▼
Dashboard
 ├──────► Analytics
 ├──────► Settings
 └──────► Profile
```

The Flow editor can be represented as a node graph:

```text
┌──────────┐       ┌────────────┐
│  Login   │──────►│ Dashboard  │
└──────────┘       └──────┬─────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Analytics      Settings      Profile
```

---

# 21. Three Editor Modes / 三种工作模式

## Design Mode

For constructing the interface.

```text
Drag
Drop
Resize
Grid
Auto Layout
Properties
```

## Flow Mode

For defining application navigation.

```text
Pages
Connections
Branches
Navigation
Overlays
```

## Preview Mode

For running the actual prototype.

```text
Click
Navigate
Animate
Load
Interact
```

The user should be able to switch between:

```text
Design → Flow → Preview
```

---

# 22. Prototype Runtime / 原型运行时

The prototype should not merely display static pages.

它不应该只是把页面显示出来。

Example:

```text
Click Login
      ↓
Button → Loading
      ↓
Mock API Request
      ↓
Success
      ↓
Animation
      ↓
Navigate Dashboard
```

This makes the prototype behave more like a real application.

---

# 23. Motion System / 动画系统

Motion should be integrated into the interaction system.

动画应该直接集成到交互系统。

Supported properties:

```text
X
Y
Scale
Rotation
Opacity
Blur
Width
Height
Color
```

Animation configuration:

```text
Duration
Delay
Easing
Spring
Stagger
Repeat
Direction
```

Potential animation types:

- Fade
- Slide
- Scale
- Blur
- Spring
- Parallax
- Marquee
- Magnetic
- Scroll Reveal
- Text Reveal
- Typewriter
- Glitch
- Scramble
- Morphing Text

---

# 24. Mock Data / Mock API

The prototype should eventually support simulated application data.

原型系统应该支持模拟应用数据。

Example:

```text
GET /api/users

Delay: 800ms

Success:
200

Response:
{
  "users": [...]
}
```

Possible states:

```text
Loading
Success
Empty
Error
Timeout
Offline
```

This allows users to create realistic application prototypes without requiring a backend.

---

# 25. Application Templates / 应用模板

The system should provide complete page/application patterns.

系统应该提供完整页面和应用模板。

Examples:

```text
Login Page
Dashboard
Admin Dashboard
User Dashboard
Profile
Settings
Billing
Notification Center
Product Page
Shopping Cart
Checkout
Social Feed
Chat Application
AI Assistant
```

---

# 26. Device Templates / 设备模板

The Frame system should provide common device templates.

```text
iPhone
iPad
Android
MacBook
Desktop
Browser
Custom
```

Users can switch device dimensions while preserving the component structure where possible.

---

# 27. Project Structure / 项目结构

```text
PROJECT
│
├── Global Components
│   ├── Navbar
│   ├── Sidebar
│   ├── Footer
│   └── Mobile Navigation
│
├── Pages
│   ├── Login
│   │   └── Frame
│   │
│   ├── Dashboard
│   │   └── Frame
│   │
│   ├── Analytics
│   │   └── Frame
│   │
│   └── Settings
│       └── Frame
│
├── Assets
│
├── Mock Data
│
├── API Simulation
│
├── Animations
│
└── Flow
    ├── Login → Dashboard
    ├── Dashboard → Analytics
    ├── Dashboard → Settings
    └── Dashboard → Profile
```

---

# 28. Data Model / 数据模型

A simplified architecture:

```text
Project
│
├── Pages[]
│
├── Components[]
│
├── Assets[]
│
├── Flows[]
│
├── MockData[]
│
└── Settings
```

### Page

```ts
interface Page {
  id: string;
  name: string;
  frames: Frame[];
}
```

### Frame

```ts
interface Frame {
  id: string;

  width: number;
  height: number;

  layoutMode: "freeform" | "grid" | "auto";

  grid?: {
    columns: number;
    rows: number;
    columnGap: number;
    rowGap: number;

    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };

    snap: boolean;
    autoPlace: boolean;
  };

  children: ComponentInstance[];
}
```

### Component Instance

```ts
interface ComponentInstance {
  id: string;
  componentType: string;

  props: Record<string, any>;

  layout?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;

    gridColumn?: number;
    gridRow?: number;

    columnSpan?: number;
    rowSpan?: number;
  };

  state?: string;

  interactions?: Interaction[];
}
```

---

# 29. Layout Engine / 布局引擎

The layout engine is one of the most important technical components.

布局引擎是整个系统最重要的技术模块之一。

It must handle:

```text
Grid calculation
Cell sizing
Component footprint
Collision detection
Auto placement
Resize
Drag
Snap
Constraints
Overflow
Responsive behavior
```

Core pipeline:

```text
User Action
    ↓
Layout Engine
    ↓
Calculate Position
    ↓
Check Constraints
    ↓
Collision Detection
    ↓
Update Layout
    ↓
Render
```

The layout engine should separate **logical layout coordinates** from **rendered pixel coordinates**.

布局引擎应该将：

```text
Logical Layout
```

和：

```text
Rendered Pixel Position
```

分开。

This makes the system easier to support across different device sizes.

---

# 30. Responsive Behavior / 响应式行为

A component should not necessarily have only one absolute position.

组件不应该只依赖一个固定绝对坐标。

Example:

```text
Desktop
12 columns

Tablet
8 columns

Mobile
4 columns
```

The system can eventually support:

```text
Breakpoint
    ↓
Grid Configuration
    ↓
Component Footprint
    ↓
Responsive Layout
```

---

# 31. Context Menu Philosophy / 右键菜单设计原则

Right-click should provide **contextual shortcuts**, not duplicate the entire editor.

右键菜单应该提供**上下文快捷操作**，而不是复制整个右侧面板。

Example:

```text
Select Frame
      ↓
Right Click
      ↓
Relevant Frame Actions
```

Whereas:

```text
Select Frame
      ↓
Right Panel
      ↓
Complete Configuration
```

This keeps the interface powerful without becoming cluttered.

---

# 32. Recommended Architecture / 推荐架构

Conceptually:

```text
┌──────────────────────────────┐
│          Editor UI           │
├──────────────────────────────┤
│ Component Library            │
│ Canvas                       │
│ Right Panel                  │
│ Context Menu                 │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│       Document Model         │
├──────────────────────────────┤
│ Project                      │
│ Pages                        │
│ Frames                       │
│ Components                   │
│ States                       │
│ Interactions                 │
│ Flows                        │
└───────────────┬──────────────┘
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
     Layout   State    Flow
     Engine   Engine   Engine
        │       │        │
        └───────┼────────┘
                ▼
┌──────────────────────────────┐
│      Prototype Runtime       │
└──────────────────────────────┘
```

---

# 33. Open-Source References / 开源参考

The project should study existing open-source projects rather than rebuilding every subsystem from zero.

项目应该参考成熟的开源项目，而不是所有功能都从零开始。

### Onlook

Visual React editor reference.

[Onlook GitHub](https://github.com/onlook-dev/onlook?utm_source=chatgpt.com)

### Penpot

Open-source Figma-like design/prototyping reference.

[Penpot GitHub](https://github.com/penpot/penpot?utm_source=chatgpt.com)

### Puck

React visual editor and component configuration reference.

[Puck GitHub](https://github.com/puckeditor/puck?utm_source=chatgpt.com)

### Plasmic

Visual component composition and application builder reference.

[Plasmic GitHub](https://github.com/plasmicapp/plasmic?utm_source=chatgpt.com)

### Webstudio

Visual website-builder architecture reference.

[Webstudio GitHub](https://github.com/webstudio-is/webstudio?utm_source=chatgpt.com)

### React Flow / xyflow

Flow graph and node-based interaction editor.

[React Flow / xyflow GitHub](https://github.com/xyflow/xyflow?utm_source=chatgpt.com)

### Wireflow

User-flow visualization reference.

[Wireflow GitHub](https://github.com/vanila-io/wireflow2?utm_source=chatgpt.com)

### OpenPencil

Modern open-source Figma-style editor reference.

[OpenPencil GitHub](https://github.com/open-pencil/open-pencil?utm_source=chatgpt.com)

### Motion

Animation, gesture and layout transition engine.

[Motion GitHub](https://github.com/motiondivision/motion?utm_source=chatgpt.com)

### Motion Primitives

Animated React component reference.

[Motion Primitives GitHub](https://github.com/ibelick/motion-primitives?utm_source=chatgpt.com)

### React Bits

Large collection of animated React UI components.

[React Bits GitHub](https://github.com/DavidHDev/react-bits?utm_source=chatgpt.com)

---

# 34. Component Discovery / 组件资源发现

The project can use curated React component collections as discovery resources.

For example:

[Awesome React Components](https://github.com/brillout/awesome-react-components?utm_source=chatgpt.com)

However, this should **not** be treated as a single runtime library.

Different libraries have:

- Different APIs
- Different styling systems
- Different dependencies
- Different licenses
- Different component architectures

Therefore:

```text
External Library
       ↓
Component Adapter
       ↓
Normalized Definition
       ↓
Internal Component System
```

This creates a consistent internal architecture.

---

# 35. Design Principles / 设计原则

### 1. Visual First

Users should understand the system visually.

用户应该通过视觉操作理解系统，而不是依赖大量代码。

### 2. Behavior First-Class

Interaction is as important as appearance.

交互行为与视觉设计具有同等重要性。

### 3. Layout Is Structured

The system should understand spatial relationships.

布局系统应该理解组件之间的空间关系。

### 4. Shared Components

Avoid duplicated UI definitions.

避免重复创建相同组件。

### 5. Contextual Controls

Right-click provides shortcuts.

右键提供上下文快捷操作。

### 6. Precise Configuration

Right Panel provides complete control.

右侧面板提供精确控制。

### 7. Real Prototype

The result should actually behave like an application.

最终结果应该真正像应用一样运行。

---

# 36. Core User Workflow / 核心用户流程

```text
Create Project
      ↓
Create Page
      ↓
Choose Frame
      ↓
Choose Layout
      ↓
Configure Grid
      ↓
Drag Components
      ↓
Auto Place / Snap
      ↓
Configure Properties
      ↓
Create Shared Components
      ↓
Configure States
      ↓
Create Interactions
      ↓
Connect Pages
      ↓
Add Animation
      ↓
Configure Mock Data
      ↓
Preview
      ↓
Interactive Prototype
```

中文：

```text
创建项目
   ↓
创建页面
   ↓
选择 Frame
   ↓
选择布局
   ↓
配置 Grid
   ↓
拖入组件
   ↓
自动排列 / 吸附
   ↓
配置属性
   ↓
创建共享组件
   ↓
配置状态
   ↓
配置交互
   ↓
连接页面
   ↓
添加动画
   ↓
配置 Mock 数据
   ↓
预览
   ↓
可交互原型
```

---

# 37. MVP / 第一阶段版本

The first version should **not attempt to implement everything**.

第一版本不应该试图一次实现所有功能。

Recommended MVP:

```text
✓ Project
✓ Pages
✓ Fixed Frames
✓ Component Library
✓ Drag & Drop
✓ Grid Layout
✓ Grid Right Panel
✓ Grid Right-Click Menu
✓ Component Resize
✓ Snap to Grid
✓ Auto Placement
✓ Shared Components
✓ Basic States
✓ Page Navigation
✓ Preview Mode
```

Second stage:

```text
→ Auto Layout
→ Flow Editor
→ Animation
→ Mock Data
→ API Simulation
→ Responsive Layout
→ Component Slots
```

Later:

```text
→ AI UI Generation
→ AI Interaction Generation
→ Code Export
→ Plugin System
→ Advanced Motion
→ Real Backend Integration
→ Design-to-Code
```

---

# 38. Final Product Definition / 产品最终定义

This project should be understood as:

> **A visual application prototyping IDE that combines component-based design, structured layout, reusable components, interactive states, page navigation, motion, and executable prototype behavior.**

中文：

> **一个融合组件化设计、结构化布局、可复用组件、交互状态、页面导航、动画以及可执行原型行为的可视化应用原型 IDE。**

The central model is:

```text
Page
 ↓
Frame
 ↓
Layout
 ↓
Component
 ↓
State
 ↓
Interaction
 ↓
Flow
 ↓
Prototype
```

And the key editor principle is:

```text
Canvas
   ↕
Right Panel
   ↕
Context Menu
   ↕
Document Model
   ↕
Runtime
```

The **Canvas** provides visual manipulation.

**Right Panel** provides precise configuration.

**Right-click** provides contextual shortcuts.

**Document Model** stores the application structure.

**Runtime** executes the resulting prototype.

Together, these form the foundation of the Interactive UI Prototyping IDE.
