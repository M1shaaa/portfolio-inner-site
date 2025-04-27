import React, { useEffect, useRef, useState } from 'react';

// Game constants
const CELL_SIZE = 15;
const GAME_SPEED = 150; // ms per update - slower for better visibility
const INITIAL_SNAKE_LENGTH = 5;
const FOOD_COLOR = 'red';
const MIN_DISTANCE_FROM_OBSTACLE = 60; // Increased minimum distance from obstacles

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
  const [gameInitialized, setGameInitialized] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const isUserControllingRef = useRef(false);
  const autoMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Game state
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [snake, setSnake] = useState<SnakeSegment[]>([]);
  const [food, setFood] = useState<Food | null>(null);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  console.log("Game state:", { snake, direction, gameStarted, gameInitialized, gameOver });
  
  // Function to find UI elements that should be obstacles
  const findObstacles = () => {
    if (!containerRef.current) return [];
    
    const newObstacles: Obstacle[] = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Get all UI elements
    const uiElements = document.querySelectorAll('div[style*="fontSize: 72"], h1, h2, a, div[style*="button"], div[style*="social"]');
    
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
    
    console.log("Found obstacles:", newObstacles);
    return newObstacles;
  };
  
  // Function to check if a position collides with obstacles
  const isCollision = (x: number, y: number): boolean => {
    // Check collision with canvas boundaries
    if (x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height) {
      return true;
    }
    
    // Check collision with obstacles (with a buffer)
    const buffer = 5;
    return obstacles.some(obstacle => 
      x + CELL_SIZE > obstacle.x - buffer &&
      x < obstacle.x + obstacle.width + buffer &&
      y + CELL_SIZE > obstacle.y - buffer &&
      y < obstacle.y + obstacle.height + buffer
    );
  };
  
  // Function to check if a position is too close to obstacles
  const isTooCloseToObstacle = (x: number, y: number): boolean => {
    return obstacles.some(obstacle => 
      x + CELL_SIZE > obstacle.x - MIN_DISTANCE_FROM_OBSTACLE &&
      x < obstacle.x + obstacle.width + MIN_DISTANCE_FROM_OBSTACLE &&
      y + CELL_SIZE > obstacle.y - MIN_DISTANCE_FROM_OBSTACLE &&
      y < obstacle.y + obstacle.height + MIN_DISTANCE_FROM_OBSTACLE
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
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!validPosition && attempts < maxAttempts) {
      // Generate random position (aligned to grid)
      x = Math.floor(Math.random() * (canvasSize.width / CELL_SIZE)) * CELL_SIZE;
      y = Math.floor(Math.random() * (canvasSize.height / CELL_SIZE)) * CELL_SIZE;
      
      // Check if position is valid (not on obstacle or snake)
      const notOnObstacle = !isCollision(x, y);
      const notTooCloseToObstacle = !isTooCloseToObstacle(x, y);
      const notOnSnake = !snakeCopy.some(segment => segment.x === x && segment.y === y);
      
      validPosition = notOnObstacle && notOnSnake && notTooCloseToObstacle;
      attempts++;
    }
    
    // If no valid position found after max attempts, just find a position not on an obstacle
    if (!validPosition) {
      attempts = 0;
      while (!validPosition && attempts < maxAttempts) {
        x = Math.floor(Math.random() * (canvasSize.width / CELL_SIZE)) * CELL_SIZE;
        y = Math.floor(Math.random() * (canvasSize.height / CELL_SIZE)) * CELL_SIZE;
        validPosition = !isCollision(x, y);
        attempts++;
      }
    }
    
    console.log("Generated food at:", x, y);
    return {
      x: x,
      y: y,
      color: FOOD_COLOR
    };
  };
  
  // Initialize the game
  const initGame = () => {
    if (!canvasRef.current || canvasSize.width === 0) return;
    
    console.log("Initializing game with canvas size:", canvasSize);
    
    // Find obstacles
    const newObstacles = findObstacles();
    setObstacles(newObstacles);
    
    // Create initial snake away from obstacles
    let centerX = Math.floor(canvasSize.width / 3 / CELL_SIZE) * CELL_SIZE;
    let centerY = Math.floor(canvasSize.height / 3 / CELL_SIZE) * CELL_SIZE;
    
    // Make sure snake doesn't start too close to obstacles
    let validStart = false;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!validStart && attempts < maxAttempts) {
      centerX = Math.floor(Math.random() * (canvasSize.width / CELL_SIZE)) * CELL_SIZE;
      centerY = Math.floor(Math.random() * (canvasSize.height / CELL_SIZE)) * CELL_SIZE;
      
      // Check if position and nearby positions (for snake length) are valid
      let allPositionsValid = true;
      for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        const posX = centerX - (i * CELL_SIZE);
        if (posX < 0 || isCollision(posX, centerY) || isTooCloseToObstacle(posX, centerY)) {
          allPositionsValid = false;
          break;
        }
      }
      
      validStart = allPositionsValid;
      attempts++;
    }
    
    // Create snake segments
    const initialSnake: SnakeSegment[] = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({
        x: centerX - (i * CELL_SIZE),
        y: centerY
      });
    }
    
    console.log("Created initial snake:", initialSnake);
    
    setSnake(initialSnake);
    setDirection('right');
    setScore(0);
    setGameOver(false);
    
    // Generate first food
    setTimeout(() => {
      const newFood = generateFood();
      setFood(newFood);
      
      // Force an initial auto-move after a short delay
      setTimeout(() => {
        console.log("Starting auto movement");
        setGameStarted(true);
        setGameInitialized(true);
        startAutoMovement();
      }, 500);
    }, 500);
  };
  
  // Start automatic movement
  const startAutoMovement = () => {
    if (autoMoveTimeoutRef.current) {
      clearTimeout(autoMoveTimeoutRef.current);
    }
    
    // Move in current direction
    updateGame();
    
    // Schedule next automatic move
    autoMoveTimeoutRef.current = setTimeout(() => {
      // Only continue auto movement if user isn't controlling
      if (!isUserControllingRef.current && !gameOver) {
        startAutoMovement();
      }
    }, GAME_SPEED);
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
        console.log("Game over - collision detected");
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
        setTimeout(() => {
          setFood(generateFood());
        }, 100);
      } else {
        // Remove tail if didn't eat food
        newSnake.pop();
      }
      
      return newSnake;
    });
  };
  
  // Game loop for rendering
  const gameLoop = (timestamp: number) => {
    if (!lastUpdateRef.current) {
      lastUpdateRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastUpdateRef.current;
    
    if (elapsed >= GAME_SPEED / 2) { // Render twice as often as game updates
      lastUpdateRef.current = timestamp;
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
    
    // Debug: visualize obstacles
    // ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    // obstacles.forEach(obstacle => {
    //   ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    // });
  };
  
  // Initialize the canvas and game when component mounts
  useEffect(() => {
    // Set up canvas
    if (containerRef.current) {
      console.log("Setting up canvas");
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
        
        if (autoMoveTimeoutRef.current) {
          clearTimeout(autoMoveTimeoutRef.current);
        }
      };
    }
  }, []);
  
  // Initialize game when canvas size is set
  useEffect(() => {
    if (canvasSize.width > 0 && !gameInitialized) {
      console.log("Canvas size set, initializing game");
      initGame();
    }
  }, [canvasSize, gameInitialized]);
  
  // Start game loop for rendering when game is initialized
  useEffect(() => {
    if (gameInitialized && contextRef.current) {
      console.log("Starting game loop");
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gameInitialized]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isUserControllingRef.current) {
        console.log("User taking control");
        isUserControllingRef.current = true;
        
        // Clear auto-movement when user takes control
        if (autoMoveTimeoutRef.current) {
          clearTimeout(autoMoveTimeoutRef.current);
        }
      }
      
      if (gameOver) {
        // Restart game on space press
        if (e.code === 'Space') {
          console.log("Restarting game");
          initGame();
        }
        return;
      }
      
      let newDirection = direction;
      
      // Don't allow 180-degree turns (can't immediately go in the opposite direction)
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'down') {
            newDirection = 'up';
          }
          break;
        case 'ArrowDown':
          if (direction !== 'up') {
            newDirection = 'down';
          }
          break;
        case 'ArrowLeft':
          if (direction !== 'right') {
            newDirection = 'left';
          }
          break;
        case 'ArrowRight':
          if (direction !== 'left') {
            newDirection = 'right';
          }
          break;
        default:
          return; // Don't continue for other keys
      }
      
      // If direction changed, update it and move immediately
      if (newDirection !== direction) {
        setDirection(newDirection);
        // Move immediately
        setTimeout(updateGame, 0);
        // Then start a new movement timer
        setTimeout(() => {
          if (!gameOver) {
            updateGame();
            // Schedule next movement
            const moveInterval = setInterval(() => {
              if (gameOver) {
                clearInterval(moveInterval);
                return;
              }
              updateGame();
            }, GAME_SPEED);
            
            // Cleanup on unmount
            return () => clearInterval(moveInterval);
          }
        }, GAME_SPEED);
      }
      
      e.preventDefault();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, gameOver]);
  
  // Return a div that will contain the canvas
  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>;
};

export default React.memo(SnakeGame);