# MM → PX Calculator

![GitHub release (latest by date)](https://img.shields.io/github/v/release/tenebrius-dev/MM-to-PX-Calculator)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)

A modern, fast, and responsive web application designed for graphic and web designers to seamlessly convert physical print formats (millimeters) to digital formats (pixels). 

[**Live Demo**](https://tenebrius-dev.github.io/MM-to-PX-Calculator/)

## Features

- **Standard & Custom Formats:** Quickly switch between standard A-series paper sizes (A5, A4, A3, A2, A1) or input your own custom dimensions.
- **Bleed & Margin Calculation:** Automatically calculates Cropbox and Bleedbox values in pixels based on standard print margins and bleeds.
- **Dynamic Resolution Scaling:** Easily switch between common DPI presets (72, 96, 150, 300, 600) to get accurate pixel outputs for any screen or print medium.
- **Figma Integration:** One-click copy of an SVG frame formatted perfectly for Figma, complete with bleed guidelines and safe zones.
- **Bilingual Interface:** Supports on-the-fly switching between English and Russian (RU/ENG).
- **Fully Responsive:** Perfectly optimized UI for both desktop environments and mobile devices.

## Tech Stack

- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS (with a custom design system and Material Design 3 inspired tokens)
- **Build Tool:** Vite
- **Deployment:** GitHub Pages

## Local Development

To run the project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tenebrius-dev/MM-to-PX-Calculator.git
   cd MM-to-PX-Calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## License

This project is open-source and available under the MIT License.
