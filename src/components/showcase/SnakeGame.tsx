import React, { useEffect, useRef, useState } from 'react';

// Game constants
const CELL_SIZE = 15;
const GAME_SPEED = 120; // ms per update
const INITIAL_SNAKE_LENGTH = 5;
const FOOD_COLOR = 'red';

// Color palette for snake
const SNAKE_HEAD_COLOR = '#32CD32'; // Lime green
const SNAKE_BODY_COLOR = '#228B22'; // Forest green

// Game entities
interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
  color: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Snake game component
const SnakeGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const isUserControllingRef = useRef(false);
  
  // Game state
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [snake, setSnake] = useState<SnakeSegment[]>([]);
  const [food, setFood] = useState<Food | null>(null);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  // Function to find UI elements that should be obstacles
  const findObstacles = () => {
    if (!containerRef.current) return [];
    
    const newObstacles: Obstacle[] = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Get all UI elements
    const uiElements = document.querySelectorAll('div[style*="fontSize: 72"], h2, a, div[style*="button"]');
    
    uiElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      
      // Convert to relative position within our game container
      newObstacles.push({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      });
    });
    
    return newObstacles;
  };
  
  // Function to check if a position collides with obstacles
  const isCollision = (x: number, y: number): boolean => {
    // Check collision with canvas boundaries
    if (x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height) {
      return true;
    }
    
    // Check collision with obstacles (with a small buffer)
    const buffer = 5;
    return obstacles.some(obstacle => 
      x + CELL_SIZE > obstacle.x - buffer &&
      x < obstacle.x + obstacle.width + buffer &&
      y + CELL_SIZE > obstacle.y - buffer &&
      y < obstacle.y + obstacle.height + buffer
    );
  };
  
  // Function to check if snake collides with itself
  const isSelfCollision = (head: SnakeSegment, snakeBody: SnakeSegment[]): boolean => {
    return snakeBody.some((segment, index) => {
      // Skip the head and the few segments right after the head
      if (index < 3) return false;
      return segment.x === head.x && segment.y === head.y;
    });
  };
  
  // Function to generate food at a random position that's not on an obstacle or the snake
  const generateFood = (): Food => {
    const snakeCopy = [...snake];
    
    let x: number = 0;
    let y: number = 0;
    let validPosition = false;
    
    while (!validPosition) {
      // Generate random position (aligned to grid)
      x = Math.floor(Math.random() * (canvasSize.width / CELL_SIZE)) * CELL_SIZE;
      y = Math.floor(Math.random() * (canvasSize.height / CELL_SIZE)) * CELL_SIZE;
      
      // Check if position is valid (not on obstacle or snake)
      const notOnObstacle = !isCollision(x, y);
      const notOnSnake = !snakeCopy.some(segment => segment.x === x && segment.y === y);
      
      validPosition = notOnObstacle && notOnSnake;
    }
    
    return {
      x: x,
      y: y,
      color: FOOD_COLOR
    };
  };
  
  // Initialize the game
  const initGame = () => {
    if (!canvasRef.current || canvasSize.width === 0) return;
    
    // Find obstacles
    const newObstacles = findObstacles();
    setObstacles(newObstacles);
    
    // Create initial snake in the center
    const centerX = Math.floor(canvasSize.width / 2 / CELL_SIZE) * CELL_SIZE;
    const centerY = Math.floor(canvasSize.height / 2 / CELL_SIZE) * CELL_SIZE;
    
    const initialSnake: SnakeSegment[] = [];
    
    // Create snake segments going left from center
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({
        x: centerX - (i * CELL_SIZE),
        y: centerY
      });
    }
    
    setSnake(initialSnake);
    setDirection('right');
    setScore(0);
    setGameOver(false);
    
    // Generate first food
    setFood(generateFood());
    
    setGameStarted(true);
  };
  
  // Update game state
  const updateGame = () => {
    if (gameOver) return;
    
    setSnake(prevSnake => {
      // Create copy of the snake
      const newSnake = [...prevSnake];
      
      // Get head position
      const head = { ...newSnake[0] };
      
      // Calculate new head position based on direction
      switch (direction) {
        case 'up':
          head.y -= CELL_SIZE;
          break;
        case 'down':
          head.y += CELL_SIZE;
          break;
        case 'left':
          head.x -= CELL_SIZE;
          break;
        case 'right':
          head.x += CELL_SIZE;
          break;
      }
      
      // Check if game over (collision with wall, obstacle, or self)
      if (isCollision(head.x, head.y) || isSelfCollision(head, newSnake)) {
        setGameOver(true);
        return prevSnake;
      }
      
      // Add new head to the beginning of the snake
      newSnake.unshift(head);
      
      // Check if snake ate food
      if (food && head.x === food.x && head.y === food.y) {
        // Increase score
        setScore(prevScore => prevScore + 10);
        
        // Generate new food
        setFood(generateFood());
      } else {
        // Remove tail if didn't eat food
        newSnake.pop();
      }
      
      return newSnake;
    });
  };
  
  // Game loop
  const gameLoop = (timestamp: number) => {
    if (!lastUpdateRef.current) {
      lastUpdateRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastUpdateRef.current;
    
    if (elapsed >= GAME_SPEED) {
      lastUpdateRef.current = timestamp;
      updateGame();
      renderGame();
    }
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Render game entities
  const renderGame = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const ctx = contextRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
      // Use different color for head
      ctx.fillStyle = index === 0 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
      
      // Draw rounded rectangle for the head
      if (index === 0) {
        const radius = CELL_SIZE / 4;
        ctx.beginPath();
        ctx.moveTo(segment.x + radius, segment.y);
        ctx.arcTo(segment.x + CELL_SIZE, segment.y, segment.x + CELL_SIZE, segment.y + CELL_SIZE, radius);
        ctx.arcTo(segment.x + CELL_SIZE, segment.y + CELL_SIZE, segment.x, segment.y + CELL_SIZE, radius);
        ctx.arcTo(segment.x, segment.y + CELL_SIZE, segment.x, segment.y, radius);
        ctx.arcTo(segment.x, segment.y, segment.x + CELL_SIZE, segment.y, radius);
        ctx.closePath();
        ctx.fill();
        
        // Draw snake eyes
        ctx.fillStyle = 'white';
        
        // Position eyes based on direction
        let leftEyeX = segment.x + CELL_SIZE / 4;
        let leftEyeY = segment.y + CELL_SIZE / 4;
        let rightEyeX = segment.x + (CELL_SIZE / 4) * 3;
        let rightEyeY = segment.y + CELL_SIZE / 4;
        
        switch (direction) {
          case 'up':
            // Eyes positioned at top
            break;
          case 'down':
            // Eyes positioned at bottom
            leftEyeY = segment.y + (CELL_SIZE / 4) * 3;
            rightEyeY = segment.y + (CELL_SIZE / 4) * 3;
            break;
          case 'left':
            // Eyes positioned at left
            leftEyeX = segment.x + CELL_SIZE / 4;
            leftEyeY = segment.y + CELL_SIZE / 4;
            rightEyeX = segment.x + CELL_SIZE / 4;
            rightEyeY = segment.y + (CELL_SIZE / 4) * 3;
            break;
          case 'right':
            // Eyes positioned at right
            leftEyeX = segment.x + (CELL_SIZE / 4) * 3;
            leftEyeY = segment.y + CELL_SIZE / 4;
            rightEyeX = segment.x + (CELL_SIZE / 4) * 3;
            rightEyeY = segment.y + (CELL_SIZE / 4) * 3;
            break;
        }
        
        // Draw eyes
        const eyeSize = CELL_SIZE / 6;
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeSize / 2, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, eyeSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw body segments with gap between them
        const gap = 2;
        ctx.fillRect(
          segment.x + gap / 2, 
          segment.y + gap / 2, 
          CELL_SIZE - gap, 
          CELL_SIZE - gap
        );
      }
    });
    
    // Draw food
    if (food) {
      ctx.fillStyle = food.color;
      
      // Draw apple-like shape
      ctx.beginPath();
      ctx.arc(
        food.x + CELL_SIZE / 2,
        food.y + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Draw stem
      ctx.fillStyle = 'brown';
      ctx.fillRect(
        food.x + CELL_SIZE / 2 - 1,
        food.y + 2,
        2,
        5
      );
      
      // Draw leaf
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.ellipse(
        food.x + CELL_SIZE / 2 + 4,
        food.y + 5,
        4,
        2,
        Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    
    // Draw game over message
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvasSize.width / 2, canvasSize.height / 2 - 20);
      ctx.fillText(`Score: ${score}`, canvasSize.width / 2, canvasSize.height / 2 + 20);
      ctx.font = '18px Arial';
      ctx.fillText('Press Space to Play Again', canvasSize.width / 2, canvasSize.height / 2 + 60);
      ctx.textAlign = 'left';
    }
  };
  
  // Initialize the canvas and game when component mounts
  useEffect(() => {
    // Set up canvas
    if (containerRef.current) {
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '-1';
      
      containerRef.current.appendChild(canvas);
      
      contextRef.current = canvas.getContext('2d');
      
      setCanvasSize({
        width: canvas.width,
        height: canvas.height,
      });
      
      // Set up resize observer
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          
          if (canvasRef.current) {
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            
            setCanvasSize({
              width,
              height,
            });
          }
        }
      });
      
      resizeObserver.observe(containerRef.current);
      
      // Cleanup
      return () => {
        resizeObserver.disconnect();
        
        if (containerRef.current && canvasRef.current) {
          containerRef.current.removeChild(canvasRef.current);
        }
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, []);
  
  // Initialize game when canvas size is set
  useEffect(() => {
    if (canvasSize.width > 0 && !gameStarted) {
      initGame();
    }
  }, [canvasSize, gameStarted]);
  
  // Start game loop when game is initialized
  useEffect(() => {
    if (gameStarted && !gameOver && contextRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameStarted, gameOver]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isUserControllingRef.current) {
        isUserControllingRef.current = true;
      }
      
      if (gameOver) {
        // Restart game on space press
        if (e.code === 'Space') {
          initGame();
        }
        return;
      }
      
      // Don't allow 180-degree turns (can't immediately go in the opposite direction)
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'down') {
            setDirection('up');
          }
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (direction !== 'up') {
            setDirection('down');
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (direction !== 'right') {
            setDirection('left');
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (direction !== 'left') {
            setDirection('right');
          }
          e.preventDefault();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, gameOver]);
  
  // Handle automatic movement if user is not controlling
  useEffect(() => {
    if (gameStarted && !gameOver && !isUserControllingRef.current) {
      const autoMoveInterval = setInterval(() => {
        // Make random turns occasionally, but avoid obstacles
        if (Math.random() < 0.1) {
          // Get current head position
          const head = snake[0];
          
          // Calculate possible next positions
          const possibleMoves = [
            { dir: 'up', x: head.x, y: head.y - CELL_SIZE },
            { dir: 'down', x: head.x, y: head.y + CELL_SIZE },
            { dir: 'left', x: head.x - CELL_SIZE, y: head.y },
            { dir: 'right', x: head.x + CELL_SIZE, y: head.y }
          ] as const;
          
          // Filter out invalid moves (obstacles, walls, and 180-degree turns)
          const validMoves = possibleMoves.filter(move => {
            if (move.dir === 'up' && direction === 'down') return false;
            if (move.dir === 'down' && direction === 'up') return false;
            if (move.dir === 'left' && direction === 'right') return false;
            if (move.dir === 'right' && direction === 'left') return false;
            
            return !isCollision(move.x, move.y);
          });
          
          // If there are valid moves, choose one randomly
          if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            setDirection(randomMove.dir);
          }
        }
      }, 1000);
      
      return () => {
        clearInterval(autoMoveInterval);
      };
    }
  }, [gameStarted, gameOver, snake, direction]);
  
  // Return a div that will contain the canvas
  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>;
};

export default React.memo(SnakeGame);