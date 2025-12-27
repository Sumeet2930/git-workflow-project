# Professional Portfolio Builder

Transform your static developer presence into a high-end, dynamic portfolio experience. This project features a built-in onboarding wizard that generates a personalized site with modern aesthetics and smooth interactivity.

---

## Core Features

### Dynamic Portfolio Builder

- **Multi-step Onboarding**: A 4-step guided wizard to set up your profile, impact, projects, and theme.
- **Data Persistence**: Uses `localStorage` to keep your portfolio personalized across sessions.
- **Instant Updates**: An "Edit Profile" button allows you to re-run the wizard at any time.

### Intelligent Theming & Design

- **Custom Accent Colors**: Pick any primary color; the system automatically calculates hover states and gradients.
- **Glassmorphism UI**: Modern semi-transparent elements with backdrop filters.
- **Custom Cursor**: A fluid, interactive cursor that reacts to links and buttons with a `difference` blend mode.

### Advanced Interactivity

- **Typewriter Effect**: Dynamic cycling of professional roles in the hero section.
- **Scroll Reveal**: Elements elegantly fade and slide into view as you scroll.
- **Interactive Card Glow**: Project cards feature a mouse-following radial glow effect.
- **Animated Skills**: Data-driven progress bars that animate based on skill levels.

---

## Technical Stack

- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Custom Variables, Flexbox, CSS Grid, Keyframe Animations)
- **Logic**: Vanilla JavaScript (ES6+, DOM Manipulation, LocalStorage API, IntersectionObserver)

---

## Project Structure

- `index.html`: Core structure and dynamic content containers.
- `css/style.css`: Comprehensive design system and glassmorphism theme.
- `script.js`: State management, data injection, and animation controllers.
- `PROJECT_DETAILS.md`: Detailed feature breakdown.
- `PROJECT_DOCS.md`: Technical documentation and implementation details.

---

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sumeet2930/git-workflow-project.git
   ```
2. **Open the Project**:
   Open `index.html` in any modern web browser.
3. **Run the Wizard**:
   Complete the onboarding steps to generate your unique portfolio.
4. **Customize**:
   Change your theme color and projects as often as you like via the footer's "Edit Profile" button.

---

## How to Extend

- **Add More Projects**: Insert a new project card in `index.html` with a `data-category`.
- **Modify Themes**: Update the CSS variables in the `:root` section of `style.css`.
- **Update Skills**: Change the `data-width` attribute in the HTML for automatic animation.

---

Developed with ❤️ for developers who want a premium portfolio with zero hassle.
