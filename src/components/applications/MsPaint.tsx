import React, { useRef, useState, useEffect } from 'react';
import Window from '../os/Window';

export interface MsPaintAppProps extends WindowAppProps {}

const MOVIE_PALETTES = {
    'Fantastic Mr. Fox': ['#DD8D29', '#E2D200', '#46ACC8', '#E58601', '#B40F20'],
    'Rushmore': ['#AC1109', '#D4A84B', '#7C1E1E', '#EBC944', '#0B0F26'],
    'Grand Budapest': ['#F1BB7B', '#FD6467', '#5B1A18', '#D67236', '#E6A0C4'],
};

const SIZES = [2, 6, 12, 20, 32];

const TOOLS = {
    PENCIL: 'pencil',
    ERASER: 'eraser',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    CLEAR: 'clear',
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
    [TOOLS.CLEAR]: (
        <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
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
    colorSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '2px',
        borderTop: '1px solid #808080',
        borderLeft: '1px solid #808080',
        borderRight: '1px solid #ffffff',
        borderBottom: '1px solid #ffffff',
    },
    moviePalette: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px',
    },
    movieName: {
        width: '100px',
        fontSize: '12px',
        fontFamily: 'Arial',
    },
    movieColors: {
        display: 'flex',
        gap: '4px',
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
    canvasContainer: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        padding: '4px',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    canvas: {
        flex: 1,
        border: '1px solid #808080',
        backgroundColor: '#ffffff',
        cursor: 'crosshair',
    },
    sizeIndicator: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: 'black',
    },
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

    const handleToolClick = (tool: string) => {
        setCurrentTool(tool);
        if (tool === TOOLS.CLEAR) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext('2d');
            if (!context) return;
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            setCurrentTool(TOOLS.PENCIL);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        const updateCanvasSize = () => {
            const canvas = canvasRef.current;
            const container = canvas?.parentElement;
            if (!canvas || !container) return;
    
            // Save the current drawing
            const context = canvas.getContext('2d');
            if (!context) return;
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
            // Calculate new dimensions (subtract margins and borders)
            const newWidth = container.clientWidth - 10;
            const newHeight = container.clientHeight - 10;
    
            // Update canvas dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;
    
            // Restore the drawing
            context.putImageData(imageData, 0, 0);
        };
    
        // Call once on mount
        updateCanvasSize();
    
        // Create a ResizeObserver to watch the container's size
        const resizeObserver = new ResizeObserver(updateCanvasSize);
        const container = canvasRef.current?.parentElement;
        if (container) {
            resizeObserver.observe(container);
        }
    
        return () => {
            if (container) {
                resizeObserver.unobserve(container);
            }
            resizeObserver.disconnect();
        };
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x, y });
        setLastPos({ x, y });

        if (currentTool !== TOOLS.PENCIL && currentTool !== TOOLS.ERASER) {
            setSavedImageData(context.getImageData(0, 0, canvas.width, canvas.height));
        }

        if (currentTool === TOOLS.PENCIL || currentTool === TOOLS.ERASER) {
            context.beginPath();
            context.arc(x, y, currentSize/2, 0, Math.PI * 2);
            context.fillStyle = currentTool === TOOLS.ERASER ? '#ffffff' : currentColor;
            context.fill();
        }
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (currentTool === TOOLS.PENCIL || currentTool === TOOLS.ERASER) {
            context.beginPath();
            context.moveTo(lastPos.x, lastPos.y);
            context.lineTo(x, y);
            context.strokeStyle = currentTool === TOOLS.ERASER ? '#ffffff' : currentColor;
            context.lineWidth = currentSize;
            context.lineCap = 'round';
            context.stroke();
            setLastPos({ x, y });
        } else {
            if (savedImageData) {
                context.putImageData(savedImageData, 0, 0);
            }

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
                context.beginPath();
                context.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
                context.stroke();
            }
        }
    };

    const stopDrawing = () => {
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
                                onClick={() => handleToolClick(tool)}
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
                    <div style={styles.colorSection}>
                        {Object.entries(MOVIE_PALETTES).map(([movie, colors]) => (
                            <div key={movie} style={styles.moviePalette}>
                                <div style={styles.movieName}>{movie}</div>
                                <div style={styles.movieColors}>
                                    {colors.map(color => (
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
                        ))}
                    </div>
                </div>
                <div style={styles.canvasContainer}>
                    <canvas
                        ref={canvasRef}
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