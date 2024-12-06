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
        backgroundColor: '#ffffff',
        cursor: 'crosshair',
        // Ensure the canvas isn't being affected by any positioning
        position: 'static',
        display: 'block',
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
        flex: 1,
        // Remove any absolute positioning that might cause layering issues
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

const MsPaint: React.FC<MsPaintAppProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentTool, setCurrentTool] = useState(TOOLS.PENCIL);
    const [currentSize, setCurrentSize] = useState(SIZES[0]);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [savedImageData, setSavedImageData] = useState<ImageData | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Set initial white background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        // Calculate position relative to the canvas, accounting for any scaling.
        return {
            x: ((e.clientX - rect.left) * canvas.width) / rect.width,
            y: ((e.clientY - rect.top) * canvas.height) / rect.height,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const pos = getMousePos(e);
        
        setIsDrawing(true);
        setStartPos(pos);
        setLastPos(pos);

        // Save the canvas state before starting any drawing
        setSavedImageData(context.getImageData(0, 0, canvas.width, canvas.height));

        if (currentTool === TOOLS.PENCIL || currentTool === TOOLS.ERASER) {
            context.beginPath();
            context.moveTo(pos.x, pos.y);
            context.strokeStyle = currentTool === TOOLS.ERASER ? '#ffffff' : currentColor;
            context.lineWidth = currentSize;
            context.lineCap = 'round';
            context.stroke();
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const pos = getMousePos(e);

        if (currentTool === TOOLS.PENCIL || currentTool === TOOLS.ERASER) {
            context.beginPath();
            context.moveTo(lastPos.x, lastPos.y);
            context.lineTo(pos.x, pos.y);
            context.strokeStyle = currentTool === TOOLS.ERASER ? '#ffffff' : currentColor;
            context.lineWidth = currentSize;
            context.lineCap = 'round';
            context.stroke();
            setLastPos(pos);
        } else {
            // For shapes, restore the original state and draw the preview
            if (savedImageData) {
                context.putImageData(savedImageData, 0, 0);
            }

            context.beginPath();
            context.strokeStyle = currentColor;
            context.lineWidth = currentSize;

            switch (currentTool) {
                case TOOLS.LINE:
                    context.beginPath();
                    context.moveTo(startPos.x, startPos.y);
                    context.lineTo(pos.x, pos.y);
                    context.stroke();
                    break;
                case TOOLS.RECTANGLE:
                    context.strokeRect(
                        Math.min(startPos.x, pos.x),
                        Math.min(startPos.y, pos.y),
                        Math.abs(pos.x - startPos.x),
                        Math.abs(pos.y - startPos.y)
                    );
                    break;
                case TOOLS.CIRCLE:
                    const radius = Math.sqrt(
                        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
                    );
                    context.beginPath();
                    context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                    context.stroke();
                    break;
            }
        }
    };

    const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        // For shapes, make sure to draw the final shape
        if (currentTool !== TOOLS.PENCIL && currentTool !== TOOLS.ERASER) {
            draw(e);
        }
        
        setIsDrawing(false);
        setSavedImageData(null);
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
                </div>
            </div>
        </Window>
    );
};

export default MsPaint;