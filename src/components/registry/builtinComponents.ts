// ============================================================
// BUILT-IN COMPONENT DEFINITIONS
// Pre-registered visual and interactive components
// ============================================================

import { registerComponent } from '../registry/componentRegistry'

// ─── Button ──────────────────────────────────────────────────
registerComponent({
  type: 'button',
  name: 'Button',
  category: 'basic-ui',
  description: 'Clickable button element',
  tags: ['button', 'click', 'action', 'submit'],
  defaultSize: { width: 120, height: 40 },
  props: [
    { name: 'label', label: 'Label', type: 'string', defaultValue: 'Button' },
    { name: 'variant', label: 'Variant', type: 'select', defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Outline', value: 'outline' },
      ]
    },
    { name: 'size', label: 'Size', type: 'select', defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ]
    },
    { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  ],
  states: [
    { name: 'default', label: 'Default' },
    { name: 'hover', label: 'Hover' },
    { name: 'pressed', label: 'Pressed' },
    { name: 'focus', label: 'Focus' },
    { name: 'disabled', label: 'Disabled' },
    { name: 'loading', label: 'Loading' },
    { name: 'success', label: 'Success' },
  ],
  events: [
    { name: 'onClick', label: 'On Click' },
    { name: 'onHover', label: 'On Hover' },
  ],
})

// ─── Text ─────────────────────────────────────────────────────
registerComponent({
  type: 'text',
  name: 'Text',
  category: 'basic-ui',
  description: 'Text / typography element',
  tags: ['text', 'label', 'heading', 'paragraph', 'typography'],
  defaultSize: { width: 200, height: 32 },
  props: [
    { name: 'content', label: 'Content', type: 'text', defaultValue: 'Text' },
    { name: 'tag', label: 'Tag', type: 'select', defaultValue: 'p',
      options: [
        { label: 'Paragraph', value: 'p' },
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'Span', value: 'span' },
      ]
    },
    { name: 'fontSize', label: 'Font Size', type: 'number', defaultValue: 14 },
    { name: 'fontWeight', label: 'Font Weight', type: 'select', defaultValue: '400',
      options: [
        { label: 'Regular', value: '400' },
        { label: 'Medium', value: '500' },
        { label: 'Semibold', value: '600' },
        { label: 'Bold', value: '700' },
      ]
    },
    { name: 'color', label: 'Color', type: 'color', defaultValue: '#1e1e2e' },
    { name: 'align', label: 'Align', type: 'select', defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ]
    },
  ],
})

// ─── Input ───────────────────────────────────────────────────
registerComponent({
  type: 'input',
  name: 'Input',
  category: 'basic-ui',
  description: 'Text input field',
  tags: ['input', 'form', 'field', 'text'],
  defaultSize: { width: 240, height: 40 },
  props: [
    { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Enter text...' },
    { name: 'label', label: 'Label', type: 'string', defaultValue: '' },
    { name: 'type', label: 'Input Type', type: 'select', defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Password', value: 'password' },
        { label: 'Number', value: 'number' },
        { label: 'Search', value: 'search' },
      ]
    },
    { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  ],
  states: [
    { name: 'empty', label: 'Empty' },
    { name: 'focus', label: 'Focus' },
    { name: 'filled', label: 'Filled' },
    { name: 'error', label: 'Error' },
    { name: 'success', label: 'Success' },
    { name: 'disabled', label: 'Disabled' },
  ],
})

// ─── Image ────────────────────────────────────────────────────
registerComponent({
  type: 'image',
  name: 'Image',
  category: 'media',
  description: 'Image element',
  tags: ['image', 'photo', 'picture', 'media'],
  defaultSize: { width: 200, height: 150 },
  props: [
    { name: 'src', label: 'Source URL', type: 'image', defaultValue: '' },
    { name: 'alt', label: 'Alt Text', type: 'string', defaultValue: 'Image' },
    { name: 'objectFit', label: 'Object Fit', type: 'select', defaultValue: 'cover',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
        { label: 'Fill', value: 'fill' },
        { label: 'None', value: 'none' },
      ]
    },
    { name: 'borderRadius', label: 'Border Radius', type: 'number', defaultValue: 0 },
  ],
})

// ─── Card ─────────────────────────────────────────────────────
registerComponent({
  type: 'card',
  name: 'Card',
  category: 'content',
  description: 'Content card container',
  tags: ['card', 'container', 'panel', 'box'],
  defaultSize: { width: 280, height: 200 },
  isContainer: true,
  props: [
    { name: 'title', label: 'Title', type: 'string', defaultValue: 'Card Title' },
    { name: 'description', label: 'Description', type: 'text', defaultValue: 'Card description goes here.' },
    { name: 'shadow', label: 'Shadow', type: 'select', defaultValue: 'md',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ]
    },
    { name: 'borderRadius', label: 'Border Radius', type: 'number', defaultValue: 8 },
    { name: 'padding', label: 'Padding', type: 'number', defaultValue: 16 },
    { name: 'background', label: 'Background', type: 'color', defaultValue: '#ffffff' },
  ],
})

// ─── Container ───────────────────────────────────────────────
registerComponent({
  type: 'container',
  name: 'Container',
  category: 'layout',
  description: 'Generic layout container / div',
  tags: ['container', 'div', 'wrapper', 'layout', 'box'],
  defaultSize: { width: 300, height: 200 },
  isContainer: true,
  props: [
    { name: 'background', label: 'Background', type: 'color', defaultValue: 'transparent' },
    { name: 'borderRadius', label: 'Border Radius', type: 'number', defaultValue: 0 },
    { name: 'padding', label: 'Padding', type: 'number', defaultValue: 0 },
    { name: 'border', label: 'Border', type: 'string', defaultValue: 'none' },
  ],
})

// ─── Navbar ───────────────────────────────────────────────────
registerComponent({
  type: 'navbar',
  name: 'Navbar',
  category: 'navigation',
  description: 'Top navigation bar',
  tags: ['navbar', 'header', 'navigation', 'top-bar'],
  defaultSize: { width: 1440, height: 64 },
  isContainer: true,
  slots: ['logo', 'left', 'center', 'right'],
  props: [
    { name: 'background', label: 'Background', type: 'color', defaultValue: '#ffffff' },
    { name: 'height', label: 'Height', type: 'number', defaultValue: 64 },
    { name: 'shadow', label: 'Shadow', type: 'boolean', defaultValue: true },
    { name: 'sticky', label: 'Sticky', type: 'boolean', defaultValue: true },
  ],
})

// ─── Sidebar ──────────────────────────────────────────────────
registerComponent({
  type: 'sidebar',
  name: 'Sidebar',
  category: 'navigation',
  description: 'Left/right side navigation panel',
  tags: ['sidebar', 'drawer', 'navigation', 'menu', 'panel'],
  defaultSize: { width: 240, height: 900 },
  isContainer: true,
  props: [
    { name: 'background', label: 'Background', type: 'color', defaultValue: '#f8f9fa' },
    { name: 'width', label: 'Width', type: 'number', defaultValue: 240 },
    { name: 'position', label: 'Position', type: 'select', defaultValue: 'left',
      options: [{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }]
    },
    { name: 'collapsed', label: 'Collapsed', type: 'boolean', defaultValue: false },
  ],
})

// ─── Modal ────────────────────────────────────────────────────
registerComponent({
  type: 'modal',
  name: 'Modal',
  category: 'feedback',
  description: 'Dialog/modal overlay',
  tags: ['modal', 'dialog', 'overlay', 'popup'],
  defaultSize: { width: 480, height: 320 },
  isContainer: true,
  props: [
    { name: 'title', label: 'Title', type: 'string', defaultValue: 'Modal Title' },
    { name: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
    { name: 'backdrop', label: 'Backdrop', type: 'boolean', defaultValue: true },
    { name: 'closeable', label: 'Closeable', type: 'boolean', defaultValue: true },
  ],
})

// ─── Panel ────────────────────────────────────────────────────
registerComponent({
  type: 'panel',
  name: 'Panel',
  category: 'layout',
  description: 'Content panel with optional header',
  tags: ['panel', 'section', 'area', 'container'],
  defaultSize: { width: 300, height: 250 },
  isContainer: true,
  props: [
    { name: 'title', label: 'Title', type: 'string', defaultValue: '' },
    { name: 'background', label: 'Background', type: 'color', defaultValue: '#ffffff' },
    { name: 'bordered', label: 'Bordered', type: 'boolean', defaultValue: true },
    { name: 'borderRadius', label: 'Border Radius', type: 'number', defaultValue: 8 },
  ],
})

// ─── List ─────────────────────────────────────────────────────
registerComponent({
  type: 'list',
  name: 'List',
  category: 'content',
  description: 'Ordered or unordered list of items',
  tags: ['list', 'items', 'rows', 'menu'],
  defaultSize: { width: 240, height: 160 },
  props: [
    { name: 'items', label: 'Items', type: 'array', defaultValue: ['Item 1', 'Item 2', 'Item 3'] },
    { name: 'ordered', label: 'Ordered', type: 'boolean', defaultValue: false },
    { name: 'divided', label: 'Divided', type: 'boolean', defaultValue: true },
  ],
})

// ─── Checkbox ─────────────────────────────────────────────────
registerComponent({
  type: 'checkbox',
  name: 'Checkbox',
  category: 'basic-ui',
  description: 'Checkbox input',
  tags: ['checkbox', 'check', 'toggle', 'form'],
  defaultSize: { width: 160, height: 32 },
  props: [
    { name: 'label', label: 'Label', type: 'string', defaultValue: 'Checkbox' },
    { name: 'checked', label: 'Checked', type: 'boolean', defaultValue: false },
    { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  ],
})

// ─── Switch ───────────────────────────────────────────────────
registerComponent({
  type: 'switch',
  name: 'Switch',
  category: 'basic-ui',
  description: 'Toggle switch',
  tags: ['switch', 'toggle', 'on-off', 'form'],
  defaultSize: { width: 160, height: 32 },
  props: [
    { name: 'label', label: 'Label', type: 'string', defaultValue: 'Toggle' },
    { name: 'enabled', label: 'Enabled', type: 'boolean', defaultValue: false },
    { name: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  ],
})

// ─── Badge ────────────────────────────────────────────────────
registerComponent({
  type: 'badge',
  name: 'Badge',
  category: 'feedback',
  description: 'Status/count badge',
  tags: ['badge', 'tag', 'label', 'status', 'count'],
  defaultSize: { width: 60, height: 24 },
  props: [
    { name: 'label', label: 'Label', type: 'string', defaultValue: 'New' },
    { name: 'variant', label: 'Variant', type: 'select', defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Info', value: 'info' },
      ]
    },
  ],
})

// ─── Divider ──────────────────────────────────────────────────
registerComponent({
  type: 'divider',
  name: 'Divider',
  category: 'layout',
  description: 'Horizontal or vertical divider line',
  tags: ['divider', 'separator', 'line', 'hr'],
  defaultSize: { width: 300, height: 1 },
  props: [
    { name: 'orientation', label: 'Orientation', type: 'select', defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ]
    },
    { name: 'color', label: 'Color', type: 'color', defaultValue: '#e5e7eb' },
    { name: 'thickness', label: 'Thickness', type: 'number', defaultValue: 1 },
  ],
})

// ─── Stat Card ────────────────────────────────────────────────
registerComponent({
  type: 'stat-card',
  name: 'Stat Card',
  category: 'data',
  description: 'KPI metric card with change indicator and icon',
  tags: ['kpi', 'metric', 'stat', 'card', 'dashboard', 'analytics'],
  defaultSize: { width: 220, height: 110 },
  props: [
    { name: 'title', label: 'Title', type: 'string', defaultValue: 'Total Revenue' },
    { name: 'value', label: 'Value', type: 'string', defaultValue: '$48,250' },
    { name: 'change', label: 'Change', type: 'string', defaultValue: '+14.2%' },
    { name: 'trend', label: 'Trend', type: 'select', defaultValue: 'up',
      options: [{ label: 'Up (Growth)', value: 'up' }, { label: 'Down', value: 'down' }]
    },
    { name: 'icon', label: 'Icon', type: 'string', defaultValue: '📈' },
    { name: 'subtext', label: 'Subtext', type: 'string', defaultValue: 'vs last month' },
  ],
})

// ─── Chart ────────────────────────────────────────────────────
registerComponent({
  type: 'chart',
  name: 'Chart',
  category: 'data',
  description: 'Data chart with Bar, Line, or Donut visualizer',
  tags: ['chart', 'graph', 'bar', 'line', 'donut', 'analytics'],
  defaultSize: { width: 340, height: 200 },
  props: [
    { name: 'title', label: 'Title', type: 'string', defaultValue: 'Analytics Overview' },
    { name: 'chartType', label: 'Chart Type', type: 'select', defaultValue: 'bar',
      options: [
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Line Chart', value: 'line' },
        { label: 'Donut Chart', value: 'donut' },
      ]
    },
  ],
})

// ─── AI Chat Stream ───────────────────────────────────────────
registerComponent({
  type: 'ai-chat',
  name: 'AI Chat Stream',
  category: 'ai-agent',
  description: 'Conversational AI chat stream interface',
  tags: ['ai', 'chat', 'agent', 'bot', 'stream', 'conversation'],
  defaultSize: { width: 340, height: 280 },
  props: [
    { name: 'title', label: 'Assistant Name', type: 'string', defaultValue: 'AI Assistant' },
    { name: 'model', label: 'AI Model', type: 'string', defaultValue: 'Gemini 1.5' },
  ],
})

// ─── Prompt Input ─────────────────────────────────────────────
registerComponent({
  type: 'prompt-input',
  name: 'Prompt Input',
  category: 'ai-agent',
  description: 'Modern expandable AI prompt bar with send & attachments',
  tags: ['ai', 'prompt', 'input', 'chat', 'command'],
  defaultSize: { width: 380, height: 50 },
  props: [
    { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Ask AI or type instructions...' },
  ],
})

// ─── Agent Tool Call ──────────────────────────────────────────
registerComponent({
  type: 'agent-tool-call',
  name: 'Agent Tool Call',
  category: 'ai-agent',
  description: 'Collapsible agent tool execution status card',
  tags: ['agent', 'tool', 'execution', 'step', 'ai'],
  defaultSize: { width: 320, height: 90 },
  props: [
    { name: 'toolName', label: 'Tool Name', type: 'string', defaultValue: 'search_knowledge_base' },
    { name: 'status', label: 'Status', type: 'select', defaultValue: 'success',
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Running', value: 'running' },
        { label: 'Failed', value: 'failed' },
      ]
    },
  ],
})

// ─── Alert ────────────────────────────────────────────────────
registerComponent({
  type: 'alert',
  name: 'Alert',
  category: 'feedback',
  description: 'Notification or alert banner',
  tags: ['alert', 'banner', 'notification', 'warning', 'info'],
  defaultSize: { width: 320, height: 60 },
  props: [
    { name: 'title', label: 'Title', type: 'string', defaultValue: 'Notification' },
    { name: 'message', label: 'Message', type: 'string', defaultValue: 'This is an alert notification message.' },
    { name: 'variant', label: 'Variant', type: 'select', defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
      ]
    },
    { name: 'dismissible', label: 'Dismissible', type: 'boolean', defaultValue: true },
  ],
})

// ─── Avatar ───────────────────────────────────────────────────
registerComponent({
  type: 'avatar',
  name: 'Avatar',
  category: 'content',
  description: 'User profile avatar with name and badge',
  tags: ['avatar', 'user', 'profile', 'image'],
  defaultSize: { width: 160, height: 50 },
  props: [
    { name: 'name', label: 'Full Name', type: 'string', defaultValue: 'Alex Morgan' },
    { name: 'role', label: 'Role / Bio', type: 'string', defaultValue: 'Product Designer' },
  ],
})

// ─── Tabs ─────────────────────────────────────────────────────
registerComponent({
  type: 'tabs',
  name: 'Tabs',
  category: 'navigation',
  description: 'Navigation tab switcher',
  tags: ['tabs', 'navigation', 'segment', 'switch'],
  defaultSize: { width: 320, height: 40 },
  props: [
    { name: 'items', label: 'Tab Labels', type: 'array', defaultValue: ['Overview', 'Analytics', 'Settings'] },
    { name: 'activeTab', label: 'Active Index', type: 'number', defaultValue: 0 },
  ],
})

// ─── Table ────────────────────────────────────────────────────
registerComponent({
  type: 'table',
  name: 'Table',
  category: 'data',
  description: 'Structured tabular data view',
  tags: ['table', 'grid', 'data', 'rows', 'columns'],
  defaultSize: { width: 440, height: 160 },
  props: [
    { name: 'striped', label: 'Striped Rows', type: 'boolean', defaultValue: true },
  ],
})

console.log('[ComponentRegistry] Built-in components registered')
