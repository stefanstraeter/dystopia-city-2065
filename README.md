# NEON CITY 2065

## Overview

**Neon City 2065** is a high-octane action game developed as a final project during my Front-End Development training at Developer Akademie. It is a side-scrolling action game built with **Vanilla JavaScript and HTML5 Canvas**. Set in a dystopian future, players take control of "Bud" to navigate through a neon-drenched metropolis. This project serves as a deep dive into **Object-Oriented Programming (OOP)**, modern software design patterns, and scalable game architecture.

### Preview

![Neon City 2065 Gameplay Mockup](assets/img/00_general/neon-city-2065.gif)

### Live Demo

- **Link:** [View Live Project](https://stefanstraeter.github.io/neon-city-2065/)

---

## Technical Architecture: Modern ES6 Modules

A core highlight of this project is the migration from a global script-based architecture to a **fully modular ES6 system**. This ensures a professional, maintainable, and leak-proof codebase.

### Key Modular Implementations:

- **Encapsulation:** Utilizing `import` and `export` to strictly control dependencies between classes.
- **Dependency Management:** Resolved complex **Circular Dependencies** between base classes (`MoveableObject`) and specialized entities (`ThrowableObject`) using advanced architectural patterns.
- **Scoped Logic:** No more global variables; each system (Physics, AI, UI) lives in its own isolated module, communicating through clean interfaces.

### Project Structure

- **`models/base`**: Fundamental classes (`DrawableObject`, `MoveableObject`) providing the blueprint for inheritance.
- **`models/core`**: The engine's heart, including the `World` controller, `Camera` logic, and the central `GameStateManager`.
- **`models/entities`**: All living and interactive actors, including "Bud", AI enemies (Sentry Drones, Spiders), and the Endboss.
- **`models/managers`**: High-level systems for `Audio`, `Collisions`, `UI`, and the dynamic `Status Bar`.
- **`models/environment`**: Logic for parallax backgrounds, neon signs, and collectibles.

---

## Key Features & Implementation

### Advanced OOP & Inheritance

By utilizing a hierarchical class structure, common behaviors like gravity, movement, and animation frames are defined in base classes and inherited by specific entities. This strictly follows the **DRY (Don't Repeat Yourself)** principle.

### Decoupled Game Logic

- **Collision Manager**: A dedicated system handling complex hitbox calculations and interaction triggers, separate from the rendering loop.
- **GameState Manager**: Centralized control for the game flow, managing transitions between cinematic intros, active gameplay, and game-over states.
- **Audio Manager**: A robust solution for the Web Audio API that handles sound sprites and bypasses browser autoplay restrictions.

### Responsive Cyberpunk UI

- **Adaptive Canvas**: Sophisticated resizing logic to maintain a consistent aspect ratio across all screen sizes.
- **Mobile-First Controls**: Custom touch-interface with orientation detection (Landscape enforcement) and safe-area optimizations.
- **Visual Juice**: Real-time filters, screen-shake effects, and a multi-layered parallax system create an immersive 2065 atmosphere.

---

## Getting Started

1. **Clone the repository:** `git clone https://github.com/stefanstraeter/neon-city-2065`
2. **Launch:** Open `index.html` via a local server (e.g., VS Code Live Server).
3. **Controls:** - **Keyboard:** Arrow keys to move, Space to shoot, Up to jump.
   - **System:** ENTER to progress intro, M for Mission, C for Controls.
   - **Mobile:** Use the integrated neon-touch overlay.

---

## Author

**Stefan Straeter** _Full Stack Developer_ GitHub: [@stefanstraeter](https://github.com/stefanstraeter/)
