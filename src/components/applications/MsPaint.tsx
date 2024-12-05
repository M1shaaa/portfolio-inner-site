import React, { useRef, useState, useEffect } from 'react';
import Window from '../os/Window';

export interface MsPaintAppProps extends WindowAppProps {}

const COLORS = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
];

const TOOLS = {
    PENCIL: 'pencil',
    ERASER: 'eraser',
    LINE: 'line',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
};

const SIZES = [2, 4, 6, 8, 10];

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
    }
};

const MsPaint: React.FC<MsPaintAppProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentTool, setCurrentTool] = useState(TOOLS.PENCIL);
    const [currentSize, setCurrentSize] = useState(2);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
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
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        context.strokeStyle = currentTool === TOOLS.ERASER ? '#ffffff' : currentColor;
        context.lineWidth = currentSize;
        context.lineCap = 'round';

        if (currentTool === TOOLS.PENCIL || currentTool === TOOLS.ERASER) {
            context.beginPath();
            context.moveTo(lastPos.x, lastPos.y);
            context.lineTo(x, y);
            context.stroke();
            setLastPos({ x, y });
        }
    };

    const stopDrawing = (e: React.MouseEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        context.strokeStyle = currentColor;
        context.lineWidth = currentSize;

        if (currentTool === TOOLS.LINE) {
            context.beginPath();
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
            context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
            context.stroke();
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
                        {Object.values(TOOLS).map(tool => (
                            <button 
                                key={tool}
                                style={Object.assign(
                                    {},
                                    styles.toolButton,
                                    currentTool === tool && styles.selectedTool
                                )}
                                onClick={() => setCurrentTool(tool)}
                            >
                                {tool[0].toUpperCase()}
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
                                        transform: `scale(${size/10})`
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
        </Window>
    );
};

export default MsPaint;