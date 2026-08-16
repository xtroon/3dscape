# 3DScape — Residential Site Planner

> *"Design your entire property before you build it."*

**3DScape** is a modern, interactive web-based 3D architectural visualization and master site planning tool designed for real-estate developers, contractors, and homebuilders to design, customize, and present full residential communities on a large land plot.

---

## 🌟 Key Features

### 🏢 Multi-Building Site Planner
- **Multiple Residential Buildings**: Place and arrange multiple apartment towers (`Building A`, `Building B`, `Building C`, etc.) on a 200m × 200m land plot.
- **Customizable Building Dimensions**: Independently adjust Building Width (10m–40m), Building Depth (8m–30m), and Floors Count (1–10).
- **Procedural Architecture**: Floor slabs, glass facades, balconies, lobby canopy, rooftop solar panels, elevator penthouse, and parapet walls scale dynamically.
- **Appearance & Materials**: Real-time color swatches and custom hex pickers for wall paint, glass window tint, and slab trim.

### 🎮 Smooth 3D Navigation & Placement Workflow
- **Ghost Placement Mode**: One-click placement tool (`+ Building`, `+ Road`, `+ Park`, `+ Parking`, `+ Tree`, `+ Pool`, `+ Clubhouse`) with interactive cursor tracking and click-to-drop functionality.
- **2m Grid Snapping**: Toggleable grid alignment to snap items cleanly without overlapping.
- **WASD Street Walk Mode**: Walk down any internal street or between buildings at human eye-level (1.8m) using keyboard WASD or Arrow keys!
- **Focus Camera**: One-click camera target centering on any selected building or amenity across the entire plot.
- **Directional Nudge Pad & Quick Rotate**: Fine-tune positions with `[←] [→] [↑] [↓]` nudge buttons and `[↺ -90°]`, `[↻ +45°]`, `[↻ +90°]` snap rotation buttons.

### 🛣️ Customizable Site Elements & Street Lights
- 🚗 **Parking Lots**: Customizable width & depth measurements with dynamic repeating parking bay stripes and parked 3D cars.
- 🏊 **Swimming Pool**: Customizable length & width with transparent water material, tiled borders, and sun loungers.
- 🏛️ **Grand Clubhouse**: 2-story modern amenity building.
- 🌳 **Parks & Green Reserves**: Central park pad, stone fountain, park benches, and foliage.
- 💡 **Customizable Street Lamps**: Adjustable pole height (4m–12m), fixture heads (Single, Double, Quad Mast), bulb color tints, and active illumination brightness.
- 🧱 **Perimeter Boundary Wall**: Enclosing boundary wall with grand entrance gate pillars and external highway road.

### 🌆 Lighting & Presentation Tools
- **Lighting Modes**: Day ☀️, Sunset 🌅, and Night 🌙 with emissive window glow and active street light fixtures.
- **HD Snapshot Tool**: Capture high-resolution PNG snapshots of the 3D scene with celebratory confetti!

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **3D Graphics Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Styling**: Tailwind CSS + Lucide Icons + Google Fonts (Outfit)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📄 License

MIT License — free for personal and commercial portfolio use.
