# Air Canvas - Hand Gesture Drawing Application

A futuristic, real-time hand gesture-controlled drawing application built with MediaPipe Hands and Gemini AI integration.

## Features

### 🖐️ Gesture Controls
- **Draw/Write**: Pinch your Index Finger and Thumb together to draw
- **Move Cursor**: Open hand or loose fist to move cursor without drawing
- **Select Color**: Extend three fingers (Index, Middle, Ring) to select colors
- **Erase Mode**: Close your fist to activate eraser mode
- **Clear Canvas**: Hold your hand fully open for 1 second to clear the canvas

### 🎨 Visual Features
- Dark, futuristic UI with neon green accents (#00ff88)
- Real-time webcam feed with hand landmark visualization
- Visual cursor indicator that changes color based on mode
- Status bar showing current gesture mode
- Clean, minimal interface design

### ✨ Additional Features
- **Save Functionality**: Download your artwork as PNG
- **Undo/Redo**: Full history support for your drawings
- **Brush Size Control**: Adjustable brush thickness
- **Color Picker**: Manual color selection via UI
- **Gemini AI Integration**: Chat with AI about your drawing experience
- **Welcome Modal**: Step-by-step instructions for first-time users
- **Gesture Reminders**: Helpful reminders after idle periods

## Technology Stack

- **MediaPipe Hands**: Real-time hand tracking and gesture recognition
- **HTML5 Canvas**: High-performance drawing surface
- **Gemini AI API**: AI-powered assistant integration
- **Vanilla JavaScript**: No framework dependencies

## 🌐 Live Demo

**The application is ready to run on GitHub Pages!**

Once GitHub Pages is enabled, visit: `https://yashwa39.github.io/canvas/`

### Enable GitHub Pages:

1. Go to your repository: https://github.com/yashwa39/canvas
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**
7. Wait 1-2 minutes for GitHub to deploy
8. Your site will be live at: `https://yashwa39.github.io/canvas/`

## Setup & Installation

### Option 1: Use GitHub Pages (Recommended)
Follow the instructions above to enable GitHub Pages - no local setup needed! The CDN links will automatically load all dependencies.

### Option 2: Local Development with npm

1. **Install Node.js** (if not already installed): [Download Node.js](https://nodejs.org/)

2. **Clone the repository:**
```bash
git clone https://github.com/yashwa39/canvas.git
cd canvas
```

3. **Install all dependencies:**
```bash
npm install
```

This installs:
- MediaPipe Hands libraries
- Local development server

4. **Start local server:**
```bash
npm start
```

5. **Open in browser:**
   - For CDN version: `http://localhost:8080/index.html`
   - For local libraries: `http://localhost:8080/setup-local.html`

6. Grant camera permissions when prompted

7. Start drawing with hand gestures!

### Option 3: Quick Start (No Installation)

1. Clone the repository
2. Open `index.html` directly in your browser (uses CDN)

**Note:** For detailed installation instructions, see [INSTALL.md](INSTALL.md)

## Usage

1. **Enable Camera**: Click "Enable Camera" in the welcome modal
2. **Position Your Hand**: Place your hand in front of the camera
3. **Start Drawing**: Pinch your thumb and index finger together and move your hand
4. **Change Modes**: Use different gestures to switch between drawing, erasing, and cursor modes
5. **Save Your Work**: Click the save button (💾) in the control panel

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari (may have limited support)

## API Keys

The application includes a Gemini API key for AI features. For production use, consider:
- Moving the API key to environment variables
- Implementing proper API key security measures
- Using a backend proxy for API calls

## License

This project is open source and available for personal and educational use.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Enjoy creating art with your hands!** ✨

