import React, { useEffect, useRef, useState } from 'react';

// Game constants
const DOT_SIZE = 5;
const DOT_COUNT = 150; // Increased from 50 to 150
const FRUIT_COUNT = 8; // Increased from 3 to 8
const GHOST_COUNT = 4;
const PACMAN_SIZE = 30;
const GHOST_SIZE = 30;
const FRUIT_SIZE = 20;
const GAME_SPEED = 100; // Reduced from 150ms to 100ms for faster updates
const GHOST_SPEED = 3.5; // Increased from 2 to 3.5
const PACMAN_SPEED = 4.5; // Increased from 3 to 4.5
const MOUTH_ANIMATION_SPEED = 5; // Lower is faster (was effectively 10 before)

// Ghost colors (defined at the module level for access in the update function)
const GHOST_COLORS = ['red', 'pink', 'cyan', 'orange'];

// Game entities
interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MovingEntity extends Entity {
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
  speed: number;
}

interface Dot extends Entity {
  eaten: boolean;
}

interface Fruit extends Entity {
  type: number;
  eaten: boolean;
}

interface Ghost extends MovingEntity {
  color: string;
  changeDirCounter: number;
  isEdible: boolean;
  edibleTimer: number;
  targetPacman: boolean;
}

interface PacMan extends MovingEntity {
  mouthOpen: boolean;
  mouthCounter: number;
  score: number;
}

// Game obstacles (elements on the page we want to avoid)
interface Obstacle extends Entity {}

// Define direction opposites type
type DirectionMap = {
  up: 'down';
  down: 'up';
  left: 'right';
  right: 'left';
};

// Create a new component for the Pac-Man game
const PacManGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameEntities, setGameEntities] = useState<{
    pacman: PacMan;
    ghosts: Ghost[];
    dots: Dot[];
    fruits: Fruit[];
  }>({
    pacman: {
      x: 0,
      y: 0,
      width: PACMAN_SIZE,
      height: PACMAN_SIZE,
      direction: 'none',
      speed: PACMAN_SPEED,
      mouthOpen: true,
      mouthCounter: 0,
      score: 0,
    },
    ghosts: [],
    dots: [],
    fruits: [],
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const requestRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isUserControlling = useRef(false);

  // Function to detect if a position is inside any obstacle
  const isPositionInObstacle = (x: number, y: number, width: number, height: number): boolean => {
    // Add a small buffer around obstacles
    const buffer = 5;
    
    return obstacles.some(
      obstacle => 
        x + width > obstacle.x - buffer &&
        x < obstacle.x + obstacle.width + buffer &&
        y + height > obstacle.y - buffer &&
        y < obstacle.y + obstacle.height + buffer
    );
  };

  // Generate random position that doesn't overlap with obstacles
  const getRandomPosition = (width: number, height: number): { x: number; y: number } => {
    let x = 0;
    let y = 0;
    let validPosition = false;
    
    // Try up to 100 times to find a valid position
    let attempts = 0;
    while (!validPosition && attempts < 100) {
      x = Math.floor(Math.random() * (canvasSize.width - width));
      y = Math.floor(Math.random() * (canvasSize.height - height));
      
      validPosition = !isPositionInObstacle(x, y, width, height);
      attempts++;
    }
    
    return { x, y };
  };

  // Initialize the game
  const initializeGame = React.useCallback(() => {
    if (!containerRef.current || canvasSize.width === 0) return;
    
    // Find obstacles (DOM elements that should act as walls)
    findObstacles();
    
    // Generate dots
    const dots: Dot[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const { x, y } = getRandomPosition(DOT_SIZE, DOT_SIZE);
      dots.push({
        x,
        y,
        width: DOT_SIZE,
        height: DOT_SIZE,
        eaten: false,
      });
    }
    
    // Generate fruits
    const fruits: Fruit[] = [];
    for (let i = 0; i < FRUIT_COUNT; i++) {
      const { x, y } = getRandomPosition(FRUIT_SIZE, FRUIT_SIZE);
      fruits.push({
        x,
        y,
        width: FRUIT_SIZE,
        height: FRUIT_SIZE,
        type: Math.floor(Math.random() * 4), // 0-3 for different fruit types
        eaten: false,
      });
    }
    
    // Generate ghosts
    const ghosts: Ghost[] = [];
    
    // Try to place ghosts at a minimum distance from UI elements
    for (let i = 0; i < GHOST_COUNT; i++) {
      let validPosition = false;
      let attempts = 0;
      let posX = 0;
      let posY = 0;
      
      // Try up to 30 times to find a position that's not too close to obstacles
      while (!validPosition && attempts < 30) {
        const tempPos = getRandomPosition(GHOST_SIZE, GHOST_SIZE);
        posX = tempPos.x;
        posY = tempPos.y;
        
        // Check if position is at least 50px away from any obstacle
        validPosition = !obstacles.some(
          obstacle => 
            posX + GHOST_SIZE > obstacle.x - 50 &&
            posX < obstacle.x + obstacle.width + 50 &&
            posY + GHOST_SIZE > obstacle.y - 50 &&
            posY < obstacle.y + obstacle.height + 50
        );
        
        attempts++;
      }
      
      const directions = ['up', 'down', 'left', 'right'] as const;
      ghosts.push({
        x: posX,
        y: posY,
        width: GHOST_SIZE,
        height: GHOST_SIZE,
        color: GHOST_COLORS[i % GHOST_COLORS.length],
        direction: directions[Math.floor(Math.random() * directions.length)],
        speed: GHOST_SPEED,
        changeDirCounter: 0,
        isEdible: false,
        edibleTimer: 0,
        targetPacman: Math.random() > 0.5, // 50% chance to target Pacman initially
      });
    }
    
    // Initialize Pac-Man
    const { x, y } = getRandomPosition(PACMAN_SIZE, PACMAN_SIZE);
    const pacman: PacMan = {
      x,
      y,
      width: PACMAN_SIZE,
      height: PACMAN_SIZE,
      direction: 'none',
      speed: PACMAN_SPEED,
      mouthOpen: true,
      mouthCounter: 0,
      score: 0,
    };
    
    setGameEntities({ pacman, ghosts, dots, fruits });
    setGameStarted(true);
  }, [canvasSize, obstacles]);  // Add dependencies here

  // Find all DOM elements that should be obstacles
  const findObstacles = () => {
    if (!containerRef.current) return;
    
    const newObstacles: Obstacle[] = [];
    
    // Get all direct children of the Home component
    const homeElements = document.querySelectorAll('div[style*="fontSize: 72"], h2, a, div[style*="button"]');
    
    homeElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      // Convert to relative position within our game container
      newObstacles.push({
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      });
    });
    
    setObstacles(newObstacles);
  };

  // Update game state
  const updateGame = () => {
    setGameEntities(prev => {
      // Update Pac-Man
      const newPacman = { ...prev.pacman };
      
      // Handle Pac-Man movement
      let newX = newPacman.x;
      let newY = newPacman.y;
      
      switch (newPacman.direction) {
        case 'up':
          newY -= newPacman.speed;
          break;
        case 'down':
          newY += newPacman.speed;
          break;
        case 'left':
          newX -= newPacman.speed;
          break;
        case 'right':
          newX += newPacman.speed;
          break;
        case 'none':
          // No movement
          break;
      }
      
      // Check if new position is valid (within bounds and not in obstacle)
      if (
        newX >= 0 &&
        newX <= canvasSize.width - newPacman.width &&
        newY >= 0 &&
        newY <= canvasSize.height - newPacman.height &&
        !isPositionInObstacle(newX, newY, newPacman.width, newPacman.height)
      ) {
        newPacman.x = newX;
        newPacman.y = newY;
      }
      
      // Animate Pac-Man's mouth (faster)
      newPacman.mouthCounter = (newPacman.mouthCounter + 1) % MOUTH_ANIMATION_SPEED;
      if (newPacman.mouthCounter === 0) {
        newPacman.mouthOpen = !newPacman.mouthOpen;
      }
      
      // Update ghosts
      const newGhosts = prev.ghosts.map(ghost => {
        const newGhost = { ...ghost };
        
        // Handle edible state
        if (newGhost.isEdible) {
          newGhost.edibleTimer--;
          if (newGhost.edibleTimer <= 0) {
            newGhost.isEdible = false;
            newGhost.color = GHOST_COLORS[newGhosts.indexOf(newGhost) % GHOST_COLORS.length];
          }
          
          // Make edible ghosts move randomly and slower
          newGhost.speed = GHOST_SPEED * 0.6;
          
          // Occasionally change direction when edible
          if (Math.random() < 0.05) {
            const directions = ['up', 'down', 'left', 'right'] as const;
            newGhost.direction = directions[Math.floor(Math.random() * directions.length)];
          }
        } else {
          // Reset normal speed
          newGhost.speed = GHOST_SPEED;
          
          // If targeting Pacman, determine best direction to chase
          if (newGhost.targetPacman) {
            // Only change direction every so often
            newGhost.changeDirCounter = (newGhost.changeDirCounter + 1) % 20;
            if (newGhost.changeDirCounter === 0) {
              // Find direction that gets closer to Pacman
              const distX = newPacman.x - newGhost.x;
              const distY = newPacman.y - newGhost.y;
              
              // Determine primary direction based on which distance is greater
              if (Math.abs(distX) > Math.abs(distY)) {
                newGhost.direction = distX > 0 ? 'right' : 'left';
              } else {
                newGhost.direction = distY > 0 ? 'down' : 'up';
              }
              
              // Occasionally add randomness to make movement less predictable
              if (Math.random() < 0.2) {
                const directions = ['up', 'down', 'left', 'right'] as const;
                newGhost.direction = directions[Math.floor(Math.random() * directions.length)];
              }
            }
          } else {
            // Non-chasing ghosts change direction randomly
            newGhost.changeDirCounter = (newGhost.changeDirCounter + 1) % 30;
            if (newGhost.changeDirCounter === 0 || Math.random() < 0.02) {
              const directions = ['up', 'down', 'left', 'right'] as const;
              newGhost.direction = directions[Math.floor(Math.random() * directions.length)];
            }
          }
        }
        
        // Move ghost
        let ghostNewX = newGhost.x;
        let ghostNewY = newGhost.y;
        
        switch (newGhost.direction) {
          case 'up':
            ghostNewY -= newGhost.speed;
            break;
          case 'down':
            ghostNewY += newGhost.speed;
            break;
          case 'left':
            ghostNewX -= newGhost.speed;
            break;
          case 'right':
            ghostNewX += newGhost.speed;
            break;
          case 'none':
            // No movement
            break;
        }
        
        // Check if new position is valid
        if (
          ghostNewX >= 0 &&
          ghostNewX <= canvasSize.width - newGhost.width &&
          ghostNewY >= 0 &&
          ghostNewY <= canvasSize.height - newGhost.height &&
          !isPositionInObstacle(ghostNewX, ghostNewY, newGhost.width, newGhost.height)
        ) {
          newGhost.x = ghostNewX;
          newGhost.y = ghostNewY;
        } else {
          // If invalid position, reverse direction
          const opposites: DirectionMap = {
            up: 'down',
            down: 'up',
            left: 'right',
            right: 'left',
          };
          
          // Only change direction if current direction is not 'none'
          if (newGhost.direction !== 'none') {
            newGhost.direction = opposites[newGhost.direction];
          }
        }
        
        return newGhost;
      });
      
      // Check for eating dots
      const newDots = prev.dots.map(dot => {
        if (
          !dot.eaten &&
          newPacman.x < dot.x + dot.width &&
          newPacman.x + newPacman.width > dot.x &&
          newPacman.y < dot.y + dot.height &&
          newPacman.y + newPacman.height > dot.y
        ) {
          newPacman.score += 10;
          return { ...dot, eaten: true };
        }
        return dot;
      });
      
      // Check for eating fruits
      const newFruits = prev.fruits.map(fruit => {
        if (
          !fruit.eaten &&
          newPacman.x < fruit.x + fruit.width &&
          newPacman.x + newPacman.width > fruit.x &&
          newPacman.y < fruit.y + fruit.height &&
          newPacman.y + newPacman.height > fruit.y
        ) {
          newPacman.score += 100;
          
          // Make all ghosts edible when fruit is eaten
          newGhosts.forEach(ghost => {
            ghost.isEdible = true;
            ghost.edibleTimer = 300; // Ghost will be edible for 300 frames (about 30 seconds at 100ms update)
            ghost.color = 'blue';
          });
          
          return { ...fruit, eaten: true };
        }
        return fruit;
      });
      
      // Check for ghost collision
      newGhosts.forEach(ghost => {
        if (
          newPacman.x < ghost.x + ghost.width &&
          newPacman.x + newPacman.width > ghost.x &&
          newPacman.y < ghost.y + ghost.height &&
          newPacman.y + newPacman.height > ghost.y
        ) {
          if (ghost.isEdible) {
            // If ghost is edible, eat it
            ghost.isEdible = false;
            ghost.edibleTimer = 0;
            ghost.color = GHOST_COLORS[newGhosts.indexOf(ghost) % GHOST_COLORS.length];
            
            // Reset ghost position
            const { x, y } = getRandomPosition(GHOST_SIZE, GHOST_SIZE);
            ghost.x = x;
            ghost.y = y;
            
            // Increase score
            newPacman.score += 200;
          } else {
            // Regular ghost collision
            const { x, y } = getRandomPosition(PACMAN_SIZE, PACMAN_SIZE);
            newPacman.x = x;
            newPacman.y = y;
            newPacman.score = Math.max(0, newPacman.score - 50);
          }
        }
      });
      
      return {
        pacman: newPacman,
        ghosts: newGhosts,
        dots: newDots,
        fruits: newFruits,
      };
    });
  };

  // Game loop
  const gameLoop = React.useCallback((timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - lastUpdateTimeRef.current;
    
    if (elapsed >= GAME_SPEED) {
      lastUpdateTimeRef.current = timestamp;
      updateGame();
      renderGame();
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, []);  // Empty dependency array since we don't want to recreate this on every render

  // Render game entities
  const renderGame = () => {
    const ctx = contextRef.current;
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw dots
    gameEntities.dots.forEach(dot => {
      if (!dot.eaten) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
          dot.x + dot.width / 2,
          dot.y + dot.height / 2,
          dot.width / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    });
    
    // Draw fruits
    gameEntities.fruits.forEach(fruit => {
      if (!fruit.eaten) {
        // Different colors for different fruit types
        const fruitColors = ['red', 'orange', 'green', 'purple'];
        ctx.fillStyle = fruitColors[fruit.type];
        ctx.beginPath();
        ctx.arc(
          fruit.x + fruit.width / 2,
          fruit.y + fruit.height / 2,
          fruit.width / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
        
        // Add a stem
        ctx.fillStyle = 'brown';
        ctx.fillRect(
          fruit.x + fruit.width / 2 - 2,
          fruit.y,
          4,
          5
        );
      }
    });
    
    // Draw ghosts
    gameEntities.ghosts.forEach(ghost => {
      ctx.fillStyle = ghost.color;
      
      // Ghost body
      ctx.beginPath();
      ctx.arc(
        ghost.x + ghost.width / 2,
        ghost.y + ghost.height / 2 - 5,
        ghost.width / 2,
        Math.PI,
        0,
        false
      );
      ctx.lineTo(ghost.x + ghost.width, ghost.y + ghost.height);
      
      // Wavy bottom
      const waveSize = ghost.width / 5;
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          ghost.x + ghost.width - i * waveSize,
          ghost.y + ghost.height - (i % 2 === 0 ? 0 : waveSize)
        );
      }
      
      ctx.lineTo(ghost.x, ghost.y + ghost.height);
      ctx.lineTo(ghost.x, ghost.y + ghost.height / 2);
      ctx.fill();
      
      // For edible ghosts, draw blinking effect when almost done
      if (ghost.isEdible && ghost.edibleTimer < 100 && Math.floor(ghost.edibleTimer / 10) % 2 === 0) {
        // Draw white eyes and mouth for flashing effect
        ctx.fillStyle = 'white';
        // Eyes
        ctx.beginPath();
        ctx.arc(
          ghost.x + ghost.width / 3,
          ghost.y + ghost.height / 3,
          ghost.width / 5,
          0,
          2 * Math.PI
        );
        ctx.arc(
          ghost.x + (ghost.width / 3) * 2,
          ghost.y + ghost.height / 3,
          ghost.width / 5,
          0,
          2 * Math.PI
        );
        ctx.fill();
      } else if (ghost.isEdible) {
        // Draw edible ghost eyes (scared eyes)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        
        // Left eye - simple curve
        ctx.moveTo(ghost.x + ghost.width / 4, ghost.y + ghost.height / 3);
        ctx.lineTo(ghost.x + ghost.width / 4 + ghost.width / 10, ghost.y + ghost.height / 3 - ghost.height / 10);
        ctx.lineTo(ghost.x + ghost.width / 4 + ghost.width / 5, ghost.y + ghost.height / 3);
        ctx.fill();
        
        // Right eye - simple curve
        ctx.moveTo(ghost.x + (ghost.width / 4) * 3, ghost.y + ghost.height / 3);
        ctx.lineTo(ghost.x + (ghost.width / 4) * 3 - ghost.width / 10, ghost.y + ghost.height / 3 - ghost.height / 10);
        ctx.lineTo(ghost.x + (ghost.width / 4) * 3 - ghost.width / 5, ghost.y + ghost.height / 3);
        ctx.fill();
        
        // Draw scared mouth
        ctx.beginPath();
        ctx.moveTo(ghost.x + ghost.width / 4, ghost.y + ghost.height / 2);
        
        // Zigzag mouth
        const mouthWidth = ghost.width / 2;
        const zigzagCount = 5;
        const segmentWidth = mouthWidth / zigzagCount;
        
        for (let i = 0; i <= zigzagCount; i++) {
          const y = ghost.y + ghost.height / 2 + (i % 2 === 0 ? ghost.height / 15 : -ghost.height / 15);
          ctx.lineTo(ghost.x + ghost.width / 4 + i * segmentWidth, y);
        }
        
        ctx.stroke();
      } else {
        // Regular ghost eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
          ghost.x + ghost.width / 3,
          ghost.y + ghost.height / 3,
          ghost.width / 6,
          0,
          2 * Math.PI
        );
        ctx.arc(
          ghost.x + (ghost.width / 3) * 2,
          ghost.y + ghost.height / 3,
          ghost.width / 6,
          0,
          2 * Math.PI
        );
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = 'black';
        
        // Adjust pupil position based on direction
        let pupilOffsetX = 0;
        let pupilOffsetY = 0;
        
        switch (ghost.direction) {
          case 'up':
            pupilOffsetY = -2;
            break;
          case 'down':
            pupilOffsetY = 2;
            break;
          case 'left':
            pupilOffsetX = -2;
            break;
          case 'right':
            pupilOffsetX = 2;
            break;
          case 'none':
            // No offset
            break;
        }
        
        ctx.beginPath();
        ctx.arc(
          ghost.x + ghost.width / 3 + pupilOffsetX,
          ghost.y + ghost.height / 3 + pupilOffsetY,
          ghost.width / 10,
          0,
          2 * Math.PI
        );
        ctx.arc(
          ghost.x + (ghost.width / 3) * 2 + pupilOffsetX,
          ghost.y + ghost.height / 3 + pupilOffsetY,
          ghost.width / 10,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    });
    
    // Draw Pac-Man
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    
    // Center coordinates for easier reference
    const centerX = gameEntities.pacman.x + gameEntities.pacman.width / 2;
    const centerY = gameEntities.pacman.y + gameEntities.pacman.height / 2;
    const radius = gameEntities.pacman.width / 2;
    
    if (gameEntities.pacman.mouthOpen) {
      // Calculate mouth angle based on direction
      let startAngle = 0;
      let endAngle = 0;
      
      switch (gameEntities.pacman.direction) {
        case 'up':
          startAngle = 1.75 * Math.PI; // 315 degrees
          endAngle = 1.25 * Math.PI; // 225 degrees
          break;
        case 'down':
          startAngle = 0.75 * Math.PI; // 135 degrees
          endAngle = 0.25 * Math.PI; // 45 degrees
          break;
        case 'left':
          startAngle = 1.25 * Math.PI; // 225 degrees
          endAngle = 0.75 * Math.PI; // 135 degrees
          break;
        case 'right':
          startAngle = 0.25 * Math.PI; // 45 degrees
          endAngle = 1.75 * Math.PI; // 315 degrees
          break;
        case 'none':
          // Default to right-facing if no direction
          startAngle = 0.25 * Math.PI; // 45 degrees
          endAngle = 1.75 * Math.PI; // 315 degrees
          break;
      }
      
      // Draw the pacman arc
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      
      // Connect to center
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
    } else {
      // Full circle when mouth is closed
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    }
    
    ctx.fill();
    
    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`Score: ${gameEntities.pacman.score}`, 10, 20);
  };

  // Initialize canvas and game on component mount
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ width, height });
      }
    });
    
    let currentContainer: HTMLDivElement | null = null;
    
    if (containerRef.current) {
      currentContainer = containerRef.current;
      resizeObserver.observe(currentContainer);
      
      const canvas = document.createElement('canvas');
      canvas.width = currentContainer.clientWidth;
      canvas.height = currentContainer.clientHeight;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '-1';
      currentContainer.appendChild(canvas);
      
      contextRef.current = canvas.getContext('2d');
      
      setCanvasSize({
        width: currentContainer.clientWidth,
        height: currentContainer.clientHeight,
      });
    }
    
    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
        const canvas = currentContainer.querySelector('canvas');
        if (canvas) {
          currentContainer.removeChild(canvas);
        }
      }
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Initialize game when canvas size is set
  useEffect(() => {
    if (canvasSize.width > 0 && !gameStarted) {
      initializeGame();
    }
  }, [canvasSize, gameStarted, initializeGame]);

  // Start game loop when game is initialized
  useEffect(() => {
    if (gameStarted && contextRef.current) {
      requestRef.current = requestAnimationFrame(gameLoop);
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [gameStarted, gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isUserControlling.current) {
        isUserControlling.current = true;
      }
      
      switch (e.key) {
        case 'ArrowUp':
          setGameEntities(prev => ({
            ...prev,
            pacman: { ...prev.pacman, direction: 'up' },
          }));
          e.preventDefault();
          break;
        case 'ArrowDown':
          setGameEntities(prev => ({
            ...prev,
            pacman: { ...prev.pacman, direction: 'down' },
          }));
          e.preventDefault();
          break;
        case 'ArrowLeft':
          setGameEntities(prev => ({
            ...prev,
            pacman: { ...prev.pacman, direction: 'left' },
          }));
          e.preventDefault();
          break;
        case 'ArrowRight':
          setGameEntities(prev => ({
            ...prev,
            pacman: { ...prev.pacman, direction: 'right' },
          }));
          e.preventDefault();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle automatic movement if user is not controlling
  useEffect(() => {
    if (gameStarted && !isUserControlling.current) {
      const autoMoveInterval = setInterval(() => {
        setGameEntities(prev => {
          // Random direction changes
          if (Math.random() < 0.05) {
            const directions = ['up', 'down', 'left', 'right'] as const;
            const newDirection = directions[Math.floor(Math.random() * directions.length)];
            return {
              ...prev,
              pacman: { ...prev.pacman, direction: newDirection },
            };
          }
          return prev;
        });
      }, 2000);
      
      return () => {
        clearInterval(autoMoveInterval);
      };
    }
  }, [gameStarted]);

  // Recalculate obstacles when window is resized
  useEffect(() => {
    const handleResize = () => {
      findObstacles();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Return a div that will contain the canvas
  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>;
};

// Memoize the component to avoid unnecessary re-renders
export default React.memo(PacManGame);