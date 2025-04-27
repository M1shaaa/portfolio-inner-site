import React, { useEffect, useRef, useState } from 'react';

// Super simple snake game
const BasicSnake: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState({
    snake: [{ x: 50, y: 50 }, { x: 40, y: 50 }, { x: 30, y: 50 }],
    food: { x: 100, y: 100 },
    direction: 'right' as 'up' | 'down' | 'left' | 'right',
    score: 0
  });
  
  // Setup canvas once on mount
  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log("Creating canvas");
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;
    
    // Draw initial state
    renderGame();
    
    // Start simple movement loop
    const interval = setInterval(() => {
      moveSnake();
    }, 200);
    
    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp': 
          setGameState(prev => ({ ...prev, direction: 'up' }));
          break;
        case 'ArrowDown': 
          setGameState(prev => ({ ...prev, direction: 'down' }));
          break;
        case 'ArrowLeft': 
          setGameState(prev => ({ ...prev, direction: 'left' }));
          break;
        case 'ArrowRight': 
          setGameState(prev => ({ ...prev, direction: 'right' }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      if (containerRef.current && canvasRef.current) {
        containerRef.current.removeChild(canvasRef.current);
      }
    };
  }, []);
  
  // Update whenever game state changes
  useEffect(() => {
    renderGame();
  }, [gameState]);
  
  // Move the snake in the current direction
  const moveSnake = () => {
    setGameState(prev => {
      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };
      
      // Move head based on direction
      switch(prev.direction) {
        case 'up': head.y -= 10; break;
        case 'down': head.y += 10; break;
        case 'left': head.x -= 10; break;
        case 'right': head.x += 10; break;
      }
      
      // Add new head and remove tail
      newSnake.unshift(head);
      
      // Check if eating food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        // Generate new food at random position
        const newFood = {
          x: Math.floor(Math.random() * (window.innerWidth / 10)) * 10,
          y: Math.floor(Math.random() * (window.innerHeight / 10)) * 10
        };
        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: prev.score + 10
        };
      } else {
        // Remove tail if not eating
        newSnake.pop();
        return { ...prev, snake: newSnake };
      }
    });
  };
  
  // Render the game
  const renderGame = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw snake
    ctx.fillStyle = 'lime';
    gameState.snake.forEach(segment => {
      ctx.fillRect(segment.x, segment.y, 10, 10);
    });
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(gameState.food.x, gameState.food.y, 10, 10);
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
  };
  
  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>;
};

export default BasicSnake;