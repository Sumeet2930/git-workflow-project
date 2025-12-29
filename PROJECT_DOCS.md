# Project Documentation: Professional Portfolio Generator

This document provides a comprehensive overview of the webpage structure, planning ideas, workflow, and internal mechanics of the portfolio.

## 1. Webpage Structure (Architecture)

The project is built using a modern, component-based approach with Vanilla HTML, CSS, and JS.

### File Organization

- `index.html`: The structural backbone containing all semantic sections (Hero, About, Impact, Skills, Projects, Testimonials, Contact).
- `css/style.css`: The design system featuring CSS variables (Tokens), Glassmorphism utilities, and advanced Keyframe animations.
- `script.js`: The "brain" of the application handling interactivity through modern Web APIs.

### Semantic Sections

- **Hero**: First impression with a high-impact typing effect.
- **Impact Section**: Highlights a real-world problem and a technical solution.
- **Technical Arsenal**: Visual representation of skills using animated data-driven bars.
- **Featured Projects**: Filterable grid with interactive mouse-follow glow effects.
- **Contact Form**: Interactive form with loading states and validation.

---

## 2. Planning & Design Ideas

The design philosophy focuses on **Premium Perception** and **Dynamic Interactivity**.

### UI/UX Tokens

- **Dark Theme**: Uses `--bg: #030712` as a base for a sleek, deep space feel.
- **Glassmorphism**: Uses semi-transparent borders and backdrop filters (`blur(12px)`) to create depth and hierarchy.
- **Micro-interactions**: Every interactive element (links, buttons, cards) has a hover state that reacts to a custom themed cursor.

### Animation Logic

- **Narrative Flow**: Elements don't just appear; they "reveal" themselves using an `IntersectionObserver` system, creating a storytelling experience during the scroll.

---

## 3. Workflow & Technical Implementation

### Scroll-Reveal System

We use the **Intersection Observer API** to detect when an element enters the viewport.

1. Elements are tagged with `.reveal` and set to `opacity: 0; transform: translateY(30px)`.
2. When the observer detects the element, it adds the `.active` class.
3. CSS transitions handle the smooth slide-and-fade effect.

### Hero Typing Effect

A JavaScript loop and recursive `setTimeout` system:

- It cycles through an array of strings.
- It subtracts/adds characters based on state.
- It features an "auto-wait" pause at the end of each word.

### Project Filtering Logic

1. Each project has a `data-category` attribute.
2. Filtering buttons have a `data-filter` attribute.
3. JS compares these and toggles `display` and `opacity` properties with a small delay for "fade-out/fade-in" aesthetics.

### Custom Interactive Cursor

A fixed `div` tracked to the mouse:

- Uses `mix-blend-mode: difference` so it's always visible regardless of the background color.
- Scales up using CSS `transform` when hovering over designated "interactive" HTML selectors.

---

## 4. How to Extend

1. **Adding a Project**: Add a new `div` in the `projects-grid` with the appropriate `data-category`.
2. **Changing Themes**: Simply update the hex codes in the `:root` section of `style.css`.
3. **Updating Skills**: Update the `data-width` attribute in the HTML, and the progress bar will automatically animate to that specific percentage.
