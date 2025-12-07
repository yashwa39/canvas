// Global variables
let video;
let webcamCanvas;
let webcamCtx;
let drawingCanvas;
let drawingCtx;
let hands;
let camera;
let isDrawing = false;
let currentMode = 'idle'; // 'idle', 'drawing', 'erasing', 'moving'
let lastPoint = null;
let drawingHistory = [];
let historyIndex = -1;
let currentColor = '#00ff88';
let brushSize = 5;
let clearTimer = null;
let idleTimer = null;
let cursorIndicator = null;

// Initialize the application
async function init() {
    // Get canvas elements
    drawingCanvas = document.getElementById('drawingCanvas');
    drawingCtx = drawingCanvas.getContext('2d');
    webcamCanvas = document.getElementById('webcamCanvas');
    webcamCtx = webcamCanvas.getContext('2d');
    video = document.getElementById('webcam');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create cursor indicator
    createCursorIndicator();

    // Setup event listeners
    setupEventListeners();

    // Initialize MediaPipe Hands
    await initMediaPipe();

    // Setup welcome modal
    setupWelcomeModal();
}

function resizeCanvas() {
    drawingCanvas.width = window.innerWidth;
    drawingCanvas.height = window.innerHeight;
    webcamCanvas.width = 200;
    webcamCanvas.height = 150;
    
    // Restore drawing from history
    if (drawingHistory.length > 0 && historyIndex >= 0) {
        restoreDrawing();
    }
}

function createCursorIndicator() {
    cursorIndicator = document.createElement('div');
    cursorIndicator.className = 'cursor-indicator';
    cursorIndicator.style.display = 'none';
    document.body.appendChild(cursorIndicator);
}

function setupEventListeners() {
    // Color picker
    document.getElementById('colorPicker').addEventListener('input', (e) => {
        currentColor = e.target.value;
    });

    // Brush size
    const brushSizeInput = document.getElementById('brushSize');
    brushSizeInput.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        document.getElementById('brushSizeValue').textContent = brushSize;
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', saveDrawing);

    // Undo/Redo buttons
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);

    // Gemini AI
    document.getElementById('geminiToggle').addEventListener('click', toggleGemini);
    document.getElementById('geminiSend').addEventListener('click', sendGeminiMessage);
    document.getElementById('geminiInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendGeminiMessage();
        }
    });
}

async function initMediaPipe() {
    // Wait for MediaPipe to be available
    if (typeof Hands === 'undefined' || typeof Camera === 'undefined') {
        setTimeout(initMediaPipe, 100);
        return;
    }
    
    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469404/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onHandResults);

    camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({ image: video });
        },
        width: 640,
        height: 480
    });

    camera.start();
}

function onHandResults(results) {
    webcamCtx.save();
    webcamCtx.clearRect(0, 0, webcamCanvas.width, webcamCanvas.height);
    webcamCtx.drawImage(results.image, 0, 0, webcamCanvas.width, webcamCanvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const handedness = results.multiHandedness[0].label;

        // Draw landmarks on webcam feed
        drawLandmarks(landmarks);

        // Process gestures
        processGestures(landmarks, handedness);

        // Reset idle timer
        resetIdleTimer();
    } else {
        // No hand detected
        updateStatus('Waiting for Hand Gesture...', 'idle');
        hideCursorIndicator();
        resetIdleTimer();
    }
}

function drawLandmarks(landmarks) {
    const colors = ['#00ff88', '#ff0080', '#00d4ff', '#ffaa00', '#aa00ff'];
    
    // Draw connections
    const connections = [
        [0, 1, 2, 3, 4], // Thumb
        [0, 5, 6, 7, 8], // Index
        [0, 9, 10, 11, 12], // Middle
        [0, 13, 14, 15, 16], // Ring
        [0, 17, 18, 19, 20] // Pinky
    ];

    webcamCtx.strokeStyle = '#00ff88';
    webcamCtx.lineWidth = 2;

    connections.forEach((finger, fingerIdx) => {
        for (let i = 0; i < finger.length - 1; i++) {
            const start = landmarks[finger[i]];
            const end = landmarks[finger[i + 1]];
            webcamCtx.beginPath();
            webcamCtx.moveTo(start.x * webcamCanvas.width, start.y * webcamCanvas.height);
            webcamCtx.lineTo(end.x * webcamCanvas.width, end.y * webcamCanvas.height);
            webcamCtx.stroke();
        }
    });

    // Draw landmarks
    landmarks.forEach((landmark, idx) => {
        webcamCtx.fillStyle = colors[Math.floor(idx / 4) % colors.length];
        webcamCtx.beginPath();
        webcamCtx.arc(
            landmark.x * webcamCanvas.width,
            landmark.y * webcamCanvas.height,
            3,
            0,
            2 * Math.PI
        );
        webcamCtx.fill();
    });

    webcamCtx.restore();
}

function processGestures(landmarks, handedness) {
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // Convert to canvas coordinates
    const canvasX = indexTip.x * drawingCanvas.width;
    const canvasY = indexTip.y * drawingCanvas.height;

    // Show cursor indicator
    showCursorIndicator(canvasX, canvasY);

    // Detect gestures
    const isPinch = isPinching(landmarks);
    const isFist = isFistClosed(landmarks);
    const isThreeFingers = isThreeFingersExtended(landmarks);
    const isOpenHand = isHandOpen(landmarks);

    // Handle color selection with three fingers
    if (isThreeFingers) {
        selectColorFromPalette(canvasX, canvasY);
        updateStatus('ACTIVE: COLOR SELECT MODE', 'idle');
        hideCursorIndicator();
        return;
    }

    // Handle clear canvas with open hand (held for 1 second)
    if (isOpenHand) {
        if (!clearTimer) {
            clearTimer = setTimeout(() => {
                if (confirm('Clear the entire canvas?')) {
                    clearCanvas();
                }
                clearTimer = null;
            }, 1000);
        }
        updateStatus('HOLD: CLEAR CANVAS (1s)', 'idle');
        return;
    } else {
        if (clearTimer) {
            clearTimeout(clearTimer);
            clearTimer = null;
        }
    }

    // Handle erase mode with fist
    if (isFist) {
        if (currentMode !== 'erasing') {
            currentMode = 'erasing';
            updateStatus('ACTIVE: ERASE MODE (FIST)', 'erasing');
            saveState();
        }
        eraseAt(canvasX, canvasY);
        return;
    }

    // Handle draw mode with pinch
    if (isPinch) {
        if (currentMode !== 'drawing') {
            currentMode = 'drawing';
            updateStatus('ACTIVE: DRAW MODE (PINCH)', 'drawing');
            saveState();
            lastPoint = null;
        }
        drawAt(canvasX, canvasY);
        return;
    }

    // Default: move cursor mode
    if (currentMode !== 'moving') {
        currentMode = 'moving';
        updateStatus('ACTIVE: MOVE CURSOR MODE', 'idle');
        isDrawing = false;
        lastPoint = null;
    }
}

function isPinching(landmarks) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const thumbIp = landmarks[3];
    const indexPip = landmarks[6];

    const distance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) + 
        Math.pow(thumbTip.y - indexTip.y, 2)
    );

    // Check if thumb and index are close
    return distance < 0.05 && 
           thumbTip.y < thumbIp.y && 
           indexTip.y < indexPip.y;
}

function isFistClosed(landmarks) {
    const tips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky tips
    const pips = [6, 10, 14, 18]; // Corresponding PIP joints

    // Check if all fingers are curled
    let allCurl = true;
    for (let i = 0; i < tips.length; i++) {
        if (landmarks[tips[i]].y < landmarks[pips[i]].y) {
            allCurl = false;
            break;
        }
    }

    return allCurl;
}

function isThreeFingersExtended(landmarks) {
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const indexPip = landmarks[6];
    const middlePip = landmarks[10];
    const ringPip = landmarks[14];
    const thumbTip = landmarks[4];
    const thumbIp = landmarks[3];
    const pinkyTip = landmarks[20];
    const pinkyPip = landmarks[18];

    // Check if index, middle, and ring are extended
    const indexExtended = indexTip.y < indexPip.y;
    const middleExtended = middleTip.y < middlePip.y;
    const ringExtended = ringTip.y < ringPip.y;
    
    // Check if thumb and pinky are curled
    const thumbCurl = thumbTip.y > thumbIp.y;
    const pinkyCurl = pinkyTip.y > pinkyPip.y;

    return indexExtended && middleExtended && ringExtended && thumbCurl && pinkyCurl;
}

function isHandOpen(landmarks) {
    const tips = [8, 12, 16, 20];
    const pips = [6, 10, 14, 18];

    // Check if all fingers are extended
    let allExtended = true;
    for (let i = 0; i < tips.length; i++) {
        if (landmarks[tips[i]].y > landmarks[pips[i]].y) {
            allExtended = false;
            break;
        }
    }

    return allExtended;
}

function drawAt(x, y) {
    if (!isDrawing) {
        isDrawing = true;
        lastPoint = { x, y };
        return;
    }

    drawingCtx.strokeStyle = currentColor;
    drawingCtx.lineWidth = brushSize;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';

    drawingCtx.beginPath();
    drawingCtx.moveTo(lastPoint.x, lastPoint.y);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();

    lastPoint = { x, y };
}

function eraseAt(x, y) {
    if (!isDrawing) {
        isDrawing = true;
        lastPoint = { x, y };
        return;
    }

    drawingCtx.globalCompositeOperation = 'destination-out';
    drawingCtx.strokeStyle = 'rgba(0,0,0,1)';
    drawingCtx.lineWidth = brushSize * 2;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';

    drawingCtx.beginPath();
    drawingCtx.moveTo(lastPoint.x, lastPoint.y);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();

    drawingCtx.globalCompositeOperation = 'source-over';
    lastPoint = { x, y };
}

function selectColorFromPalette(x, y) {
    // Simple color selection based on position
    // In a full implementation, you'd check if the cursor is over a color palette
    const hue = (x / drawingCanvas.width) * 360;
    currentColor = `hsl(${hue}, 100%, 50%)`;
    document.getElementById('colorPicker').value = hslToHex(currentColor);
}

function hslToHex(hsl) {
    const match = hsl.match(/\d+/g);
    if (!match) return '#00ff88';
    const h = parseInt(match[0]) / 360;
    const s = parseInt(match[1]) / 100;
    const l = parseInt(match[2]) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h < 1/6) { r = c; g = x; b = 0; }
    else if (h < 2/6) { r = x; g = c; b = 0; }
    else if (h < 3/6) { r = 0; g = c; b = x; }
    else if (h < 4/6) { r = 0; g = x; b = c; }
    else if (h < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

function showCursorIndicator(x, y) {
    if (!cursorIndicator) return;
    
    cursorIndicator.style.display = 'block';
    cursorIndicator.style.left = `${x}px`;
    cursorIndicator.style.top = `${y}px`;
    
    if (currentMode === 'drawing') {
        cursorIndicator.className = 'cursor-indicator drawing';
        cursorIndicator.style.borderColor = currentColor;
        cursorIndicator.style.boxShadow = `0 0 20px ${currentColor}`;
    } else if (currentMode === 'erasing') {
        cursorIndicator.className = 'cursor-indicator erasing';
    } else {
        cursorIndicator.className = 'cursor-indicator';
    }
}

function hideCursorIndicator() {
    if (cursorIndicator) {
        cursorIndicator.style.display = 'none';
    }
}

function updateStatus(text, mode) {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = text;
    statusBar.className = `status-bar ${mode}`;
}

function clearCanvas() {
    saveState();
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    updateStatus('Canvas Cleared', 'idle');
}

function saveState() {
    // Remove any future states if we're not at the end
    if (historyIndex < drawingHistory.length - 1) {
        drawingHistory = drawingHistory.slice(0, historyIndex + 1);
    }

    // Save current state
    const imageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingHistory.push(imageData);
    historyIndex++;

    // Limit history size
    if (drawingHistory.length > 50) {
        drawingHistory.shift();
        historyIndex--;
    }
}

function restoreDrawing() {
    if (historyIndex >= 0 && historyIndex < drawingHistory.length) {
        drawingCtx.putImageData(drawingHistory[historyIndex], 0, 0);
    }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreDrawing();
    }
}

function redo() {
    if (historyIndex < drawingHistory.length - 1) {
        historyIndex++;
        restoreDrawing();
    }
}

function saveDrawing() {
    const link = document.createElement('a');
    link.download = `air-canvas-${Date.now()}.png`;
    link.href = drawingCanvas.toDataURL();
    link.click();
}

function resetIdleTimer() {
    if (idleTimer) {
        clearTimeout(idleTimer);
    }
    
    const reminder = document.getElementById('gestureReminder');
    reminder.classList.remove('show');

    idleTimer = setTimeout(() => {
        reminder.classList.add('show');
    }, 10000); // Show reminder after 10 seconds of inactivity
}

function setupWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const enableCameraBtn = document.getElementById('enableCameraBtn');
    const startDrawingBtn = document.getElementById('startDrawingBtn');

    enableCameraBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            enableCameraBtn.textContent = '✓ Camera Enabled';
            enableCameraBtn.disabled = true;
            startDrawingBtn.style.display = 'block';
        } catch (error) {
            alert('Error accessing camera: ' + error.message);
        }
    });

    startDrawingBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        saveState(); // Save initial empty state
    });
}

// Gemini AI Integration
const GEMINI_API_KEY = 'AIzaSyARTv6Oxob0VF6udQzstjAKn4MJp3VjLV4';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

function toggleGemini() {
    const content = document.getElementById('geminiContent');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

async function sendGeminiMessage() {
    const input = document.getElementById('geminiInput');
    const message = input.value.trim();
    
    if (!message) return;

    const messagesDiv = document.getElementById('geminiMessages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.textContent = message;
    messagesDiv.appendChild(userMsg);
    
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Get canvas context for AI analysis
    const canvasData = drawingCanvas.toDataURL();
    
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an AI assistant for an Air Canvas drawing application. The user said: "${message}". The user is drawing on a canvas using hand gestures. Provide helpful, creative, and encouraging responses about their drawing experience. Keep responses concise and friendly.`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai-message';
            aiMsg.textContent = aiText;
            messagesDiv.appendChild(aiMsg);
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } else {
            throw new Error('Invalid response from Gemini API');
        }
    } catch (error) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message ai-message';
        errorMsg.textContent = 'Sorry, I encountered an error. Please try again.';
        errorMsg.style.color = '#ff0080';
        messagesDiv.appendChild(errorMsg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        console.error('Gemini API Error:', error);
    }
}

// Initialize when page loads
window.addEventListener('load', init);

