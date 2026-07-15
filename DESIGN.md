# MM to PX Calculator Design System

This design document serves as the absolute visual source of truth for the **MM → PX Calculator**, extracted directly from the Stitch project designs.

---

## 1. Visual Style & Philosophy
Rooted in the principles of **Swiss Design (International Typographic Style)**, prioritizing objectivity, legibility, and a strict mathematical grid. The aesthetic is clean, technical, and precise:
- Warm, paper-like background (`#F9F8F6`).
- Sharp, thin borders (`#E5E5E5`) representing registration guidelines and layouts.
- Vibrant cobalt blue (`#2E5BFF`) used strictly as an accent for active states.
- Monospaced technical figures (`JetBrains Mono`) for all numeric fields.

---

## 2. Design Tokens

### Colors
| Name | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| **Primary** | `#000000` | Text headings, branding, primary actions |
| **Secondary (Accent)** | `#0040e0` / `#2e5bff` | Selected preset border, active orientations, highlights |
| **Background (Paper)** | `#F9F8F6` | Underlay color for the main container |
| **Surface** | `#FFFFFF` | Form fields, results card, header, footer background |
| **Surface Container Low**| `#F4F3F3` | Background for toggles, preview container |
| **Outline / Borders** | `#E5E5E5` | Grid lines, section dividers, borders |
| **Text Primary** | `#1A1C1C` | Default body copy |
| **Text Secondary** | `#444748` | Subtitle text, inactive tabs/presets |
| **Text Outline** | `#747878` | Text labels, units, crop marks |
| **Error (Bleed)** | `#BA1A1A` | Outer bleed lines, dashed highlights |

### Spacing & Grid System
Based on an 8px unit base grid:
- `xs`: `4px`
- `sm` / `unit`: `8px`
- `md`: `16px`
- `lg`: `24px` (Desktop gutters)
- `xl`: `32px`
- `margin`: `40px` (Desktop outer margins)

### Typography
- **Fonts**: 
  - **Inter**: Main typeface for headings, labels, and text.
  - **JetBrains Mono**: Used for all numeric values, dimensions, results, and inputs.
- **Typographic Scale**:
  - `display-lg`: `48px` / Line Height: `56px` / Weight: `700` (Main result layout value)
  - `headline-lg`: `32px` / Line Height: `40px` / Weight: `600` (Mobile header title / secondary result)
  - `headline-md`: `24px` / Line Height: `32px` / Weight: `600` (Header branding)
  - `data-lg`: `20px` / Line Height: `24px` / Weight: `600` (Large numbers)
  - `body-lg`: `18px` / Line Height: `28px` / Weight: `400`
  - `body-md`: `16px` / Line Height: `24px` / Weight: `400` (Body / UI labels)
  - `label-mono`: `14px` / Line Height: `20px` / Weight: `500` (Presets / technical labels)
  - `caption`: `12px` / Line Height: `16px` / Weight: `500` (Mini section headers)

### Border Radii
- **Default**: `4px` / `0.25rem` (Inputs, buttons, presets)
- **Large**: `8px` / `0.5rem` (Cards, panels)
- **Full**: `9999px` (Icons / circular badges)

---

## 3. Interactive States

### Buttons & Preset Chips
- **Inactive Preset / Input**:
  - Background: `#FFFFFF`
  - Border: `1px solid #E5E5E5`
  - Text Color: `#444748`
- **Active Preset / Input Toggle**:
  - Border: `1px solid #2E5BFF`
  - Text Color: `#2E5BFF`
  - Weight: Bold (`700`)
- **Hover State**:
  - Border: `1px solid #000000`
  - Text Color: `#000000`

### Input Fields (Width, Height, Bleed, Margin, DPI)
- Height: `56px`
- Border: `1px solid #E5E5E5`
- Text alignment: Right-aligned (`text-right`)
- Font: `JetBrains Mono` (`20px`, Bold)
- Label placement: Absolute top-positioned overlay with background fill (`absolute -top-[9px] left-sm bg-background px-xs text-[10px]`)
- Focus: `border-secondary` (`#2E5BFF`) with no browser outline.

---

## 4. Screen Layout Specs & Proportions

### Desktop (Viewport Width: 1440px+)
- **Body Wrap**: Centered `max-w-[1440px]`, bordered on left/right.
- **Main Layout Grid**: 12-column grid (`grid-cols-12`, `gap-32px`).
  - **Left Form Column**: `col-span-7` containing presets, dimension fields, DPI selection.
  - **Right Preview Column**: `col-span-5` containing the A4 visualization box inside a high card.
- **Results Box (Bottom)**: Spans the full width (`col-span-12`), rendered inside a clean bordered section.
- **Visual Preview Box**:
  - Max Height: `612px`.
  - Inner Sheet Width: `280px` (Aspect ratio dynamically matches page width/height).
  - Bleed line offset: `-6px`.
  - Margin line offset: `16px`.
  - Crop marks: Extended 4 corners with 16px tick length.

### Mobile (Viewport Width: 390px)
- **Layout Flow**: Single-column vertical flow with padding `16px`.
- **TopNavBar**: Sticky with absolute border-b.
- **Width/Height Fields**: Positioned side-by-side (`grid-cols-2`), split by a floating link button.
- **Visual Preview Box**:
  - Centered width: `140px` (Aspect ratio matches dimensions).
  - Bleed line offset: `-0.95%`.
  - Margin line offset: `1.68%` horizontal, `2.38%` vertical.
- **Results Box**: Positioned within the flow (above the CTA copy button) rather than full width at the bottom.
- **Main Action CTA**: Fixed full-width flat button (`#000000` background, `#FFFFFF` text) at the bottom of the form.
