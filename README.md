# TECHFEST // 3D Techfest Website

A futuristic, responsive 3D techfest landing page built with HTML, CSS and Three.js.

## Features
- Interactive Three.js 3D core, rings and particle field
- Scroll-driven camera/world movement
- Mouse-responsive 3D scene
- 3D tilt interaction on event cards
- Smooth reveal animations
- Responsive mobile navigation
- Futuristic neon/space visual system
- No build step required

## Run
Open `index.html` in a modern browser.

For best results, run a local server because the page imports Three.js as an ES module:

### VS Code
Install Live Server and open `index.html` with **Open with Live Server**.

### Python
```bash
python -m http.server 5500
```
Then visit `http://localhost:5500`.

## Customize
Edit `index.html` for event names, dates and text.
Edit `style.css` for the visual theme.
Edit `script.js` for the 3D scene and interactions.

The registration button currently opens an email draft using `techfest@example.com`; replace it with your actual registration URL/email.
