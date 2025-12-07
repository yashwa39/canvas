# Installation Guide

This guide will help you set up all dependencies for the Air Canvas application.

## Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)
- A modern web browser (Chrome, Edge, or Firefox recommended)

## Installation Steps

### 1. Install Node.js Dependencies

All required packages are already defined in `package.json`. Run:

```bash
npm install
```

This will install:
- `@mediapipe/camera_utils` - Camera utilities for MediaPipe
- `@mediapipe/control_utils` - Control utilities
- `@mediapipe/drawing_utils` - Drawing utilities for landmarks
- `@mediapipe/hands` - MediaPipe Hands solution
- `http-server` - Local development server

### 2. Verify Installation

Check that `node_modules` directory was created:

```bash
ls node_modules/@mediapipe
```

You should see:
- camera_utils
- control_utils
- drawing_utils
- hands

### 3. Copy Libraries for Local Use (Optional)

The libraries are already copied to `libs/@mediapipe/` directory for local development.

## Running the Application

### Option 1: Use CDN (GitHub Pages - Recommended)

Simply open `index.html` in your browser or deploy to GitHub Pages. The CDN links will automatically load all dependencies.

**For GitHub Pages:** Use `index.html` (uses CDN)

### Option 2: Local Development Server

For local development with offline support:

```bash
npm start
```

Or with auto-open:

```bash
npm run dev
```

Then open `setup-local.html` in your browser at `http://localhost:8080/setup-local.html`

### Option 3: Direct File Opening

You can also open `index.html` directly in your browser (uses CDN).

## File Structure

```
air-canvas/
├── index.html          # Main file (uses CDN - for GitHub Pages)
├── setup-local.html    # Local version (uses local libs)
├── script.js           # Main application logic
├── style.css           # Styles
├── package.json        # npm dependencies
├── libs/               # Local copies of MediaPipe libraries
│   └── @mediapipe/
│       ├── camera_utils/
│       ├── control_utils/
│       ├── drawing_utils/
│       └── hands/
└── node_modules/       # npm installed packages
```

## Dependencies Installed

### MediaPipe Packages
- **@mediapipe/hands@0.4.1675469240** - Hand tracking and gesture recognition
- **@mediapipe/camera_utils@0.3.1640029074** - Camera handling
- **@mediapipe/control_utils@0.6.1629159506** - Control utilities
- **@mediapipe/drawing_utils@0.3.1619994837** - Drawing utilities

### Development Tools
- **http-server@^14.1.1** - Local web server for development

## Troubleshooting

### Issue: npm install fails
- Make sure Node.js is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Issue: Camera not working
- Make sure you're using HTTPS or localhost (required for camera access)
- Grant camera permissions in your browser
- Check browser console for errors

### Issue: MediaPipe not loading
- Check browser console for 404 errors
- Verify CDN links are accessible
- For local development, ensure `libs/` directory exists

## Next Steps

1. Open the application in your browser
2. Grant camera permissions
3. Start drawing with hand gestures!

For more information, see the main [README.md](README.md) file.

