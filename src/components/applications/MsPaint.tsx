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
};

const styles: StyleSheetCSS = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    toolbar: {
        padding: '8px',
        backgroundColor: '#e1e1e1',
        borderBottom: '1px solid #999',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    toolSection: {
        display: 'flex',
        gap: '4px',
    },
    toolButton: {
        padding: '4px 8px',
        cursor: 'pointer',
        border: '1px solid #999',
        backgroundColor: '#fff',
    },
    selectedTool: {
        backgroundColor: '#ccc',
        borderColor: '#666',
    },
    colorPalette: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2px',
    },
    colorButton: {
        width: '20px',
        height: '20px',
        border: '1px solid #999',
        cursor: 'pointer',
    },
    selectedColor: {
        border: '2px solid #000',
    },
    canvas: {
        border: '1px solid #999',
        margin: '8px',
        backgroundColor: '#fff',
        cursor: 'crosshair',
    },
};

const MsPaint: React.FC<MsPaintAppProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentTool, setCurrentTool] = useState(TOOLS.PENCIL);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

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
        setLastPosition({ x, y });
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
        context.lineWidth = currentTool === TOOLS.ERASER ? 20 : 2;
        context.lineCap = 'round';

        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(x, y);
        context.stroke();

        setLastPosition({ x, y });
    };

    const stopDrawing = () => {
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
                                {tool}
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