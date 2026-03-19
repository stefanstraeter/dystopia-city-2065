# DEVELOPER AKADEMIE – NEON CITY 2065

## Overview

**Neon City 2065** is a high-octane, side-scrolling action game built with **Vanilla JavaScript and HTML5 Canvas**. Set in a dystopian future, players take control of "Bud" to navigate through a neon-drenched metropolis. The project demonstrates advanced game development patterns, including **object-oriented programming (OOP)**, a custom **physics engine**, and a dynamic **parallax background system**.

### The Challenge

- Implement a robust **Collision Manager** for complex entity interactions.
- Create a seamless **Parallax Scrolling** effect across multiple background layers.
- Manage game states (Start, Play, Pause, Game Over) via a centralized **UI Manager**.
- Integrate a dedicated **Audio Manager** to handle ambient music and sound effects while bypassing browser autoplay restrictions.
- Handle hardware-accelerated rendering at **60 FPS** using `requestAnimationFrame`.

### Links

- **Live Site:** [Live Demo](https://dein-username.github.io/neon-city-2065/)

### Mockup

![Neon City 2065 Screenshot](assets/img/neonCity_mockup.jpg)

---

## My Process

### Built With

- **HTML5 Canvas** – high-performance 2D rendering
- **CSS3** – neon glow effects, scanline overlays, and glitch animations
- **JavaScript (ES6+)** – strictly object-oriented (Classes, Inheritance)
- **Custom Physics Engine** – gravity, velocity, and collision detection
- **Web Audio API** – dynamic sound management

### Key Features & Techniques

#### Object-Oriented Architecture

- **Inheritance Pattern:** All game entities (Bud, Enemies, Projectiles) derive from a base `MoveableObject` class, ensuring DRY (_Don't Repeat Yourself_) code.
- **Manager Pattern:** Dedicated classes (`UIManager`, `AudioManager`, `CollisionManager`) handle specific game domains, keeping the `World` class clean and maintainable.

#### Advanced Rendering & FX

- **Parallax System:** Multiple layers (background, midground, foreground) move at different speeds to create a sense of depth.
- **Visual Juice:** Integrated screen-shake effects on damage, grain filters, and pulsing neon borders for an immersive cyberpunk atmosphere.
- **Z-Index Management:** Precise drawing order ensures that explosions and UI elements always appear in the foreground of the action.

#### Game Mechanics & Logic

- **Resource Management:** Players must collect **Cyber-Kits** to repair their chassis and **Plasma** to recharge weapon systems.
- **AI Behavior:** Enemies feature distinct movement patterns and state-driven animations (Idle, Attack, Death).
- **Responsive Controls:** Low-latency input handling for movement, jetpack flight, and combat.

#### Audio Implementation

- A custom `AudioManager` handles the looping background score and synchronized sound effects.
- Smart "User-Interaction-Trigger" to comply with modern browser autoplay policies.

---

## Getting Started

1. Clone the repository: `git clone https://github.com/stefanstraeter/dystopia-city-2065`
2. Open `index.html` in your browser (or use VS Code Live Server).
3. Press **ENTER** to start the mission.

---

## Author

- GitHub: [@dein-username](https://github.com/stefanstraeter/)
