import React, { useRef, useState, useEffect } from 'react';
import Window from '../os/Window';

export interface MsPaintAppProps extends WindowAppProps {}

const COLORS = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
];

const SIZES = [2, 6, 12, 20, 32];

const TOOLS = {
    PENCIL: 'pencil',
    ERASER: 'eraser',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
};

const TOOL_ICONS = {
    [TOOLS.PENCIL]: (
        <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M3,17.25V21h3.75L17.81,9.94l-3.75-3.75L3,17.25z M20.71,7.04c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34 c-0.39-0.39-1.02-0.39-1.41,0l-1.83,1.83l3.75,3.75L20.71,7.04z" fill="currentColor"/>
        </svg>
    ),
    [TOOLS.ERASER]: (
        <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M15.14,3c-0.51,0-1.02,0.19-1.41,0.58L2.58,14.73c-0.78,0.78-0.78,2.05,0,2.83l3.86,3.86C7.8,21.8,9.07,21.8,9.85,21.02 l11.15-11.15c0.78-0.78,0.78-2.05,0-2.83l-3.86-3.86C16.16,3.19,15.65,3,15.14,3z" fill="currentColor"/>
        </svg>
    ),
    [TOOLS.LINE]: (
        <svg viewBox="0 0 24 24" width="16" height="16">
            <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
    ),
    [TOOLS.RECTANGLE]: (
        <svg viewBox="0 0 24 24" width="16" height="16">
            <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"/>
        </svg>
    ),
    [TOOLS.CIRCLE]: (
        <svg viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="8" stroke="currentColor" fill="none" strokeWidth="2"/>
        </svg>
    ),
};

const styles: StyleSheetCSS = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
    },
    toolbar: {
        padding: '4px',
        backgroundColor: '#c0c0c0',
        borderTop: '2px solid #ffffff',
        borderLeft: '2px solid #ffffff',
        borderRight: '2px solid #808080',
        borderBottom: '2px solid #808080',
        display: 'flex',
        gap: '8px',
    },
    toolSection: {
        display: 'flex',
        gap: '2px',
        borderTop: '1px solid #808080',
        borderLeft: '1px solid #808080',
        borderRight: '1px solid #ffffff',
        borderBottom: '1px solid #ffffff',
        padding: '2px',
    },
    toolButton: {
        width: '28px',
        height: '28px',
        padding: '2px',
        cursor: 'pointer',
        backgroundColor: '#c0c0c0',
        border: '2px outset #ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTool: {
        border: '2px inset #ffffff',
        backgroundColor: '#808080',
    },
    sizeButton: {
        width: '28px',
        height: '28px',
        padding: '2px',
        cursor: 'pointer',
        backgroundColor: '#c0c0c0',
        border: '2px outset #ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorPalette: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '224px',
        gap: '1px',
        padding: '2px',
        borderTop: '1px solid #808080',
        borderLeft: '1px solid #808080',
        borderRight: '1px solid #ffffff',
        borderBottom: '1px solid #ffffff',
    },
    colorButton: {
        width: '26px',
        height: '26px',
        border: '1px solid #808080',
        cursor: 'pointer',
    },
    selectedColor: {
        border: '2px solid #000000',
    },
    canvas: {
        border: '1px solid #808080',
        margin: '4px',
        backgroundColor: '#ffffff',
        cursor: 'crosshair',
    },
    sizeIndicator: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: 'black',
    },
    canvasContainer: {
        position: 'relative',
        margin: '4px',
    }
};

const MsPaint: React.FC<MsPaintAppProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentTool, setCurrentTool] = useState(TOOLS.PENCIL);
    const [currentSize, setCurrentSize] = useState(SIZES[0]);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;
        if (!canvas || !overlayCanvas) return;

        const context = canvas.getContext('2d');
        const overlayContext = overlayCanvas.getContext('2d');
        if (!context || !overlayContext) return;

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        overlayCanvas.width = canvas.width;
        overlayCanvas.height = canvas.height;
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x, y });
        setLastPos({ x, y });
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
    
        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;
        if (!canvas || !overlayCanvas) return;
    
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        // Get both contexts
        const context = canvas.getContext('2d');
        const overlayContext = overlayCanvas.getContext('2d');
        if (!context || !overlayContext) return;
    
        if (currentTool === TOOLS.PENCIL || currentTool === TOOLS.ERASER) {
            // Draw directly on main canvas for pencil/eraser
            context.beginPath();
            context.strokeStyle = currentTool === TOOLS.ERASER ? '#ffffff' : currentColor;
            context.lineWidth = currentSize;
            context.lineCap = 'round';
            context.lineJoin = 'round';  // Add this for smoother lines
            context.moveTo(lastPos.x, lastPos.y);
            context.lineTo(x, y);
            context.stroke();
            setLastPos({ x, y });
        } else {
            // Clear and redraw on overlay for shape preview
            overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            overlayContext.beginPath();
            overlayContext.strokeStyle = currentColor;
            overlayContext.lineWidth = currentSize;
    
            if (currentTool === TOOLS.LINE) {
                overlayContext.moveTo(startPos.x, startPos.y);
                overlayContext.lineTo(x, y);
                overlayContext.stroke();
            } else if (currentTool === TOOLS.RECTANGLE) {
                overlayContext.strokeRect(
                    Math.min(startPos.x, x),
                    Math.min(startPos.y, y),
                    Math.abs(x - startPos.x),
                    Math.abs(y - startPos.y)
                );
            } else if (currentTool === TOOLS.CIRCLE) {
                const radius = Math.sqrt(
                    Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
                );
                overlayContext.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                overlayContext.stroke();
            }
        }
    };

    const stopDrawing = (e: React.MouseEvent) => {
        if (!isDrawing) return;
    
        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;
        if (!canvas || !overlayCanvas) return;
    
        const context = canvas.getContext('2d');
        const overlayContext = overlayCanvas.getContext('2d');
        if (!context || !overlayContext) return;
    
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        if (currentTool !== TOOLS.PENCIL && currentTool !== TOOLS.ERASER) {
            // Draw the final shape on the main canvas
            context.beginPath();
            context.strokeStyle = currentColor;
            context.lineWidth = currentSize;
    
            if (currentTool === TOOLS.LINE) {
                context.moveTo(startPos.x, startPos.y);
                context.lineTo(x, y);
                context.stroke();
            } else if (currentTool === TOOLS.RECTANGLE) {
                context.strokeRect(
                    Math.min(startPos.x, x),
                    Math.min(startPos.y, y),
                    Math.abs(x - startPos.x),
                    Math.abs(y - startPos.y)
                );
            } else if (currentTool === TOOLS.CIRCLE) {
                const radius = Math.sqrt(
                    Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
                );
                context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                context.stroke();
            }
    
            // Clear the overlay after drawing the final shape
            overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }

        setIsDrawing(false);
    };

    return (
        <Window
            top={40}
            left={100}
            width={800}
            height={600}
            windowBarIcon="mspaintIcon"
            windowTitle="ms paint"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div style={styles.container}>
                <div style={styles.toolbar}>
                    <div style={styles.toolSection}>
                        {Object.entries(TOOLS).map(([key, tool]) => (
                            <button 
                                key={tool}
                                style={Object.assign(
                                    {},
                                    styles.toolButton,
                                    currentTool === tool && styles.selectedTool
                                )}
                                onClick={() => setCurrentTool(tool)}
                            >
                                {TOOL_ICONS[tool]}
                            </button>
                        ))}
                    </div>
                    <div style={styles.toolSection}>
                        {SIZES.map(size => (
                            <button
                                key={size}
                                style={Object.assign(
                                    {},
                                    styles.sizeButton,
                                    currentSize === size && styles.selectedTool
                                )}
                                onClick={() => setCurrentSize(size)}
                            >
                                <div 
                                    style={{
                                        ...styles.sizeIndicator,
                                        transform: `scale(${size/32})`
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                    <div style={styles.colorPalette}>
                        {COLORS.map(color => (
                            <div
                                key={color}
                                style={Object.assign(
                                    {},
                                    styles.colorButton,
                                    { backgroundColor: color },
                                    currentColor === color && styles.selectedColor
                                )}
                                onClick={() => setCurrentColor(color)}
                            />
                        ))}
                    </div>
                </div>
                <div style={styles.canvasContainer}>
                    <canvas
                        ref={canvasRef}
                        width={780}
                        height={500}
                        style={styles.canvas}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                    <canvas
                        ref={overlayCanvasRef}
                        width={780}
                        height={500}
                        style={{
                            ...styles.canvas,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                            margin: 0,
                        }}
                    />
                </div>
            </div>
        </Window>
    );
};

export default MsPaint;