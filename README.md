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

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/yashwa39/canvas.git
cd canvas
```

2. Open `index.html` in a modern web browser (Chrome, Edge, or Firefox recommended)

3. Grant camera permissions when prompted

4. Start drawing with hand gestures!

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

