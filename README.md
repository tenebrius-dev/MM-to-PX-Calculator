<div align="center">
  <img src="public/favicon.svg" alt="MM to PX Logo" width="80" height="80">
  <h1 align="center">MM → PX Calculator</h1>
  <p align="center">
    <strong>A precision tool for converting print layout dimensions (millimeters) into digital pixels, specifically tailored for Figma workflows.</strong>
  </p>
</div>

---

## 📐 Overview

**MM → PX Calculator** bridges the gap between physical print specifications and digital design environments. Whether you are preparing business cards, flyers, posters, or packaging in Figma, this calculator instantly translates your physical dimensions (width, height, bleeds, and margins in mm) into precise pixel dimensions for any given DPI.

This eliminates the guesswork of calculating Gross (Bleedbox) and Net (Cropbox) sizes, allowing designers to set up their Figma artboards with mathematical precision.

## ✨ Features

- **Standard Formats Out-of-the-Box**: Instant presets for A1, A2, A3, A4, A5 in both Portrait and Landscape orientations.
- **Custom Dimensions**: Enter any custom millimeter dimensions for bespoke formats.
- **Dynamic Bleeds & Margins**: Input your required bleed and margin sizes in millimeters to calculate safe zones and cut lines.
- **Adjustable DPI**: Supports standard print resolutions (72, 96, 150, 300, 600) and custom DPI values.
- **Visual Preview**: A responsive, scaled visual representation of your layout, dynamically showing Bleedbox and Cropbox guides proportional to your paper size.
- **One-Click Figma Export**: Generates a pre-formatted, pasteable SVG frame specifically designed for Figma, automatically applying your dimensions, bleeds, and guidelines.
- **Responsive & Modern UI**: A sleek, minimal interface inspired by Swiss design principles, fully responsive from mobile to ultra-wide desktop monitors.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: Google Material Symbols
- **Linter**: Oxlint

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tenebrius-dev/MM-to-PX-Calculator.git
   ```

2. Navigate into the project directory:
   ```bash
   cd MM-to-PX-Calculator
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## 🎨 How to use with Figma

1. Enter your layout dimensions, bleeds, and DPI into the calculator.
2. Click the **"Скопировать фрейм для Figma"** (Copy frame for Figma) button.
3. Open your Figma file.
4. Press `Cmd/Ctrl + V` to paste.
5. A perfectly sized frame will appear, complete with properly named layers and vector guidelines for your bleeds and margins!
*(Note: Be sure to hide the guideline layers before exporting your final PDF for print).*

---

<div align="center">
  <p>© 2026 MM → PX Calculator.</p>
</div>
