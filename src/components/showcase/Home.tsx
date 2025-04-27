import React, { useState, useEffect, useRef } from 'react';
import { Link } from '../general';
import { useNavigate } from 'react-router';

// Import images
import marioPunch from '../../assets/pictures/mario-hit.gif';
import marioStill from '../../assets/pictures/mario-still.png';
import twitterIcon from '../../assets/pictures/contact-twitter.png';
import gsIcon from '../../assets/pictures/contact-gs.png';
import ghIcon from '../../assets/pictures/contact-gh.png';
import inIcon from '../../assets/pictures/contact-in.png';

interface StyleSheet {
    [key: string]: React.CSSProperties;
}

export interface HomeProps {}

interface MarioAnimationProps {
    isAnimating: boolean;
    index: number;
}

interface SocialBoxProps {
    icon: string;
    link: string;
    position: number;
    onActivate: () => void;
}

// Define game state interface
interface GameState {
    snake: Array<{x: number, y: number}>;
    food: {x: number, y: number};
    direction: 'up' | 'down' | 'left' | 'right';
    score: number;
}

// Improved Snake Game Component
const ImprovedSnake: React.FC = () => {
    // Game constants
    const CELL_SIZE = 20; // 2x larger (was 10)
    const GROWTH_RATE = 4; // 2x faster growth (was implicitly 1-2)
    
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameState, setGameState] = useState<GameState>({
        snake: [{ x: 50, y: 50 }, { x: 30, y: 50 }, { x: 10, y: 50 }], // Wider spacing for 2x size
        food: { x: 100, y: 100 },
        direction: 'right',
        score: 0
    });
    
    // Track if food needs to be respawned
    const foodEatenRef = useRef<boolean>(false);
    
    // Track game speed
    const speedRef = useRef<number>(120); // Starting speed (ms)
    
    // Persistent high score
    const highScoreRef = useRef<number>(
        parseInt(localStorage.getItem('snakeHighScore') || '0')
    );
    const [sessionHighScore, setSessionHighScore] = useState<number>(0);
    const initialPositionSet = useRef<boolean>(false);
    const gameLoopRef = useRef<number | null>(null);
    
    // IMPROVED: Helper function with much more precise hit detection
    const isPositionOccupied = (x: number, y: number): boolean => {
        // Get all UI elements
        const elements = document.querySelectorAll('h1, h2, a, div[style*="button"]');
        
        // Add a very tiny buffer for hit testing
        const buffer = 0.5; // Extremely small buffer for precise collision
        
        // Check if position is inside any of these elements
        for (let i = 0; i < elements.length; i++) {
            const rect = elements[i].getBoundingClientRect();
            if (
                x + buffer >= rect.left && 
                x - buffer <= rect.right && 
                y + buffer >= rect.top && 
                y - buffer <= rect.bottom
            ) {
                return true;
            }
        }
        
        return false;
    };
    
    // Render the game
    const renderGame = () => {
        if (!canvasRef.current) return;
        
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw snake - 2x larger size
        gameState.snake.forEach((segment: {x: number, y: number}, index: number) => {
            // Draw rounded rectangle for the head
            if (index === 0) {
                const radius = 8; // Increased for larger size
                ctx.fillStyle = '#32CD32'; // Lime green
                ctx.beginPath();
                ctx.moveTo(segment.x + radius, segment.y);
                ctx.arcTo(segment.x + CELL_SIZE, segment.y, segment.x + CELL_SIZE, segment.y + CELL_SIZE, radius);
                ctx.arcTo(segment.x + CELL_SIZE, segment.y + CELL_SIZE, segment.x, segment.y + CELL_SIZE, radius);
                ctx.arcTo(segment.x, segment.y + CELL_SIZE, segment.x, segment.y, radius);
                ctx.arcTo(segment.x, segment.y, segment.x + CELL_SIZE, segment.y, radius);
                ctx.closePath();
                ctx.fill();
                
                // Draw snake eyes - larger for 2x size
                ctx.fillStyle = 'white';
                
                // Position eyes based on direction
                let leftEyeX = segment.x + 5;
                let leftEyeY = segment.y + 5;
                let rightEyeX = segment.x + 15;
                let rightEyeY = segment.y + 5;
                
                switch (gameState.direction) {
                    case 'up':
                        // Eyes positioned at top
                        break;
                    case 'down':
                        // Eyes positioned at bottom
                        leftEyeY = segment.y + 15;
                        rightEyeY = segment.y + 15;
                        break;
                    case 'left':
                        // Eyes positioned at left
                        leftEyeX = segment.x + 5;
                        leftEyeY = segment.y + 5;
                        rightEyeX = segment.x + 5;
                        rightEyeY = segment.y + 15;
                        break;
                    case 'right':
                        // Eyes positioned at right
                        leftEyeX = segment.x + 15;
                        leftEyeY = segment.y + 5;
                        rightEyeX = segment.x + 15;
                        rightEyeY = segment.y + 15;
                        break;
                }
                
                // Draw eyes - larger
                const eyeSize = 3; // 2x larger
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
                ctx.fillStyle = index % 2 === 0 ? '#228B22' : '#32CD32'; // Alternating colors for body
                const gap = 4; // Larger gap for larger snake
                ctx.fillRect(
                    segment.x + gap / 2, 
                    segment.y + gap / 2, 
                    CELL_SIZE - gap, 
                    CELL_SIZE - gap
                );
            }
        });
        
        // Draw food as apple - make it more visible - 2x larger
        // Draw a pulsing effect to make the food more noticeable
        const pulseSize = 10 + Math.sin(Date.now() / 200) * 3; // 2x larger
        const glowRadius = pulseSize + 6; // 2x larger
        
        // Draw glow effect
        const gradient = ctx.createRadialGradient(
            gameState.food.x + CELL_SIZE/2, gameState.food.y + CELL_SIZE/2, 0,
            gameState.food.x + CELL_SIZE/2, gameState.food.y + CELL_SIZE/2, glowRadius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            gameState.food.x + CELL_SIZE/2,
            gameState.food.y + CELL_SIZE/2,
            glowRadius,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw apple
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            gameState.food.x + CELL_SIZE/2,
            gameState.food.y + CELL_SIZE/2,
            pulseSize,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw stem
        ctx.fillStyle = 'brown';
        ctx.fillRect(
            gameState.food.x + CELL_SIZE/2 - 2,
            gameState.food.y,
            4, // 2x width
            6  // 2x height
        );
        
        // Draw leaf
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.ellipse(
            gameState.food.x + CELL_SIZE/2 + 6, // 2x offset
            gameState.food.y + 4, // 2x offset
            6, // 2x width
            3, // 2x height
            Math.PI / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw score and high scores in 80s/90s retro style
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px "Press Start 2P", "Courier New", monospace';
        
        // Add a white background with slight transparency for better readability
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(5, 5, 250, 75);
        
        // Draw the text in black
        ctx.fillStyle = 'black';
        ctx.fillText(`SCORE: ${gameState.score}`, 10, 25);
        ctx.fillText(`LENGTH: ${gameState.snake.length}`, 10, 50);
        ctx.fillText(`SESSION HIGH: ${sessionHighScore}`, 10, 75);
        
        // Draw the all-time high score
        if (highScoreRef.current > 0) {
            ctx.fillText(`ALL-TIME HIGH: ${highScoreRef.current}`, 10, 100);
        }
    };
    
    // IMPROVED: Generate new food at a valid position
    const generateNewFood = () => {
        // Generate new food at random position
        let newFoodX: number = 0;
        let newFoodY: number = 0;
        let attempts = 0;
        const maxAttempts = 200; // Increased from 100
        
        // Get the main container dimensions for better placement
        const homeContainer = document.querySelector('div[style*="position: absolute"][style*="height: 100%"]');
        let containerRect = {
            left: 0,
            right: window.innerWidth,
            top: 0,
            bottom: window.innerHeight,
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        if (homeContainer) {
            const rect = homeContainer.getBoundingClientRect();
            containerRect = {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
            };
            console.log("Found home container:", containerRect);
        } else {
            console.log("Using window dimensions for food placement");
        }
        
        // Make sure food is within sensible bounds
        const margin = 40; // Keep food away from edges
        
        // Debug information
        console.log("Generating food within:", 
            containerRect.left + margin, 
            containerRect.right - margin,
            containerRect.top + margin,
            containerRect.bottom - margin
        );
        
        do {
            // Generate positions that are multiples of CELL_SIZE for grid alignment
            // and constrain to the visible container area
            const availableWidth = containerRect.width - (margin * 2);
            const availableHeight = containerRect.height - (margin * 2);
            
            newFoodX = Math.floor(Math.random() * (availableWidth / CELL_SIZE)) * CELL_SIZE + containerRect.left + margin;
            newFoodY = Math.floor(Math.random() * (availableHeight / CELL_SIZE)) * CELL_SIZE + containerRect.top + margin;
            
            attempts++;
            
            // Force exit after too many attempts
            if (attempts >= maxAttempts) {
                console.log("Max attempts reached, using last position:", newFoodX, newFoodY);
                break;
            }
            
            // Debug every 10 attempts
            if (attempts % 10 === 0) {
                console.log(`Attempt ${attempts}: Trying position (${newFoodX}, ${newFoodY})`);
            }
        } while (
            // Check if food would spawn on snake - use CELL_SIZE for hit detection
            gameState.snake.some((segment: {x: number, y: number}) => 
                Math.abs(segment.x - newFoodX) < CELL_SIZE && Math.abs(segment.y - newFoodY) < CELL_SIZE
            ) ||
            // Check if food would spawn on UI element with tighter tolerance
            isPositionOccupied(newFoodX, newFoodY) ||
            // Extra check: Make sure it's not too close to the edge
            newFoodX < containerRect.left + margin || 
            newFoodX > containerRect.right - margin || 
            newFoodY < containerRect.top + margin || 
            newFoodY > containerRect.bottom - margin
        );
        
        console.log("Generated new food at:", newFoodX, newFoodY);
        
        // Make the food visually distinct
        setGameState((prev: GameState) => ({
            ...prev,
            food: { x: newFoodX, y: newFoodY }
        }));
    };
    
    // IMPROVED: Move the snake in the current direction
    const moveSnake = () => {
        setGameState((prev: GameState) => {
            const newSnake = [...prev.snake];
            const head = { ...newSnake[0] };
            
            // Move head based on direction and CELL_SIZE
            switch(prev.direction) {
                case 'up': head.y -= CELL_SIZE; break;
                case 'down': head.y += CELL_SIZE; break;
                case 'left': head.x -= CELL_SIZE; break;
                case 'right': head.x += CELL_SIZE; break;
            }
            
            // Get container bounds
            const container = document.querySelector('div[style*="position: absolute"][style*="height: 100%"]');
            let containerRect = {
                left: 0,
                right: window.innerWidth,
                top: 0,
                bottom: window.innerHeight
            };
            
            if (container) {
                const rect = container.getBoundingClientRect();
                containerRect = {
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom
                };
            }
            
            // DEBUG output
            if (Math.random() < 0.01) { // Only log occasionally to reduce spam
                console.log("Snake head:", head.x, head.y);
                console.log("Container bounds:", containerRect);
                console.log("Current speed:", speedRef.current);
            }
            
            // Check only wall collision with extra debug information
            // Add a small buffer (1px) to ensure no false positives from rounding errors
            const leftBuffer = 2; // Small buffer for left wall
            const rightBuffer = 2; // Small buffer for right wall
            const topBuffer = 2; // Small buffer for top wall
            const bottomBuffer = 2; // Small buffer for bottom wall

            // Check if head is outside container bounds with buffer
            const isWallCollision = (
                head.x < containerRect.left - leftBuffer || 
                head.x >= containerRect.right + rightBuffer || 
                head.y < containerRect.top - topBuffer || 
                head.y >= containerRect.bottom + bottomBuffer
            );

            // Output detailed debug info every time to help diagnose
            console.log("Snake position:", head.x, head.y);
            console.log("Container bounds:", 
                "L:" + containerRect.left, 
                "R:" + containerRect.right, 
                "T:" + containerRect.top, 
                "B:" + containerRect.bottom
            );
            console.log("Distance from walls:", 
                "L:" + (head.x - containerRect.left), 
                "R:" + (containerRect.right - head.x), 
                "T:" + (head.y - containerRect.top), 
                "B:" + (containerRect.bottom - head.y)
            );

            if (isWallCollision) {
                // Reset snake on wall collision
                console.log("Wall collision at", head.x, head.y, "Container:", containerRect);
                
                // Reset to center of container
                const centerX = containerRect.left + (containerRect.right - containerRect.left) / 2;
                const centerY = containerRect.top + (containerRect.bottom - containerRect.top) / 2;
                
                // Round to nearest CELL_SIZE for grid alignment
                const resetX = Math.floor(centerX / CELL_SIZE) * CELL_SIZE;
                const resetY = Math.floor(centerY / CELL_SIZE) * CELL_SIZE;
                
                console.log("Resetting snake to:", resetX, resetY);
                
                return {
                    ...prev,
                    snake: [
                        { x: resetX, y: resetY },
                        { x: resetX - CELL_SIZE, y: resetY },
                        { x: resetX - CELL_SIZE*2, y: resetY }
                    ],
                    direction: 'right',
                    score: 0
                };
            }
            
            // REMOVED: UI element collision check (as requested)
            // Now the snake can pass behind/through UI elements
            
            // Check self-collision (snake can't hit itself)
            const isSelfCollision = newSnake.slice(1).some((segment: {x: number, y: number}) => 
                Math.abs(segment.x - head.x) < CELL_SIZE/2 && Math.abs(segment.y - head.y) < CELL_SIZE/2
            );
            
            if (isSelfCollision) {
                console.log("Self collision");
                
                // Reset to center of container
                const centerX = containerRect.left + (containerRect.right - containerRect.left) / 2;
                const centerY = containerRect.top + (containerRect.bottom - containerRect.top) / 2;
                
                // Round to nearest CELL_SIZE for grid alignment
                const resetX = Math.floor(centerX / CELL_SIZE) * CELL_SIZE;
                const resetY = Math.floor(centerY / CELL_SIZE) * CELL_SIZE;
                
                return {
                    ...prev,
                    snake: [
                        { x: resetX, y: resetY },
                        { x: resetX - CELL_SIZE, y: resetY },
                        { x: resetX - CELL_SIZE*2, y: resetY }
                    ],
                    direction: 'right',
                    score: 0
                };
            }
            
            // Add new head
            newSnake.unshift(head);
            
            // Check if eating food
            if (Math.abs(head.x - prev.food.x) < CELL_SIZE && Math.abs(head.y - prev.food.y) < CELL_SIZE) {
                foodEatenRef.current = true;
                
                const newScore = prev.score + 10;
                
                // Update high scores
                if (newScore > sessionHighScore) {
                    setSessionHighScore(newScore);
                }
                
                if (newScore > highScoreRef.current) {
                    highScoreRef.current = newScore;
                    localStorage.setItem('snakeHighScore', newScore.toString());
                }
                
                // IMPROVED: Add GROWTH_RATE segments when eating (2x growth rate)
                // Instead of removing tail, add more segments by cloning the last segment
                // This effectively makes the snake grow GROWTH_RATE segments at a time
                const lastSegment = newSnake[newSnake.length - 1];
                
                // Create more segments
                for (let i = 1; i < GROWTH_RATE; i++) {
                    newSnake.push({ ...lastSegment });
                }
                
                return {
                    ...prev,
                    snake: newSnake, 
                    score: newScore
                };
            } else {
                // Remove tail if not eating
                newSnake.pop();
                return { ...prev, snake: newSnake };
            }
        });
    };
    
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
        
        // Set initial state after container is loaded
        setTimeout(() => {
            // Get container bounds and set initial snake position
            const container = document.querySelector('div[style*="position: absolute"][style*="height: 100%"]');
            if (container) {
                const rect = container.getBoundingClientRect();
                // Place snake in the middle of the container
                const centerX = rect.left + (rect.width / 2);
                const centerY = rect.top + (rect.height / 2);
                
                // Round to nearest CELL_SIZE for grid alignment
                const startX = Math.floor(centerX / CELL_SIZE) * CELL_SIZE;
                const startY = Math.floor(centerY / CELL_SIZE) * CELL_SIZE;
                
                console.log("Setting initial snake position at", startX, startY);
                
                setGameState(prev => ({
                    ...prev,
                    snake: [
                        { x: startX, y: startY },
                        { x: startX - CELL_SIZE, y: startY },
                        { x: startX - CELL_SIZE*2, y: startY }
                    ]
                }));
                
                initialPositionSet.current = true;
            }
            
            // Draw initial state
            renderGame();
            
            // Generate initial food
            generateNewFood();
        }, 500); // Wait for container to be fully rendered
        
        // Keyboard controls
        const handleKeyDown = (e: KeyboardEvent) => {
            switch(e.key) {
                case 'ArrowUp': 
                    setGameState((prev: GameState) => {
                        if (prev.direction !== 'down') // Prevent 180 degree turns
                            return { ...prev, direction: 'up' };
                        return prev;
                    });
                    break;
                case 'ArrowDown': 
                    setGameState((prev: GameState) => {
                        if (prev.direction !== 'up')
                            return { ...prev, direction: 'down' };
                        return prev;
                    });
                    break;
                case 'ArrowLeft': 
                    setGameState((prev: GameState) => {
                        if (prev.direction !== 'right')
                            return { ...prev, direction: 'left' };
                        return prev;
                    });
                    break;
                case 'ArrowRight': 
                    setGameState((prev: GameState) => {
                        if (prev.direction !== 'left')
                            return { ...prev, direction: 'right' };
                        return prev;
                    });
                    break;
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        // Handle window resize
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                renderGame();
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Start game loop with dynamic speed
        const updateGameLoop = () => {
            // Clear existing interval if there is one
            if (gameLoopRef.current !== null) {
                window.clearInterval(gameLoopRef.current);
            }
            
            // Calculate speed based on snake length
            // Base speed 120ms, gets faster as snake grows
            // Minimum speed (fastest) capped at 50ms
            const snakeLength = gameState.snake.length;
            const calculatedSpeed = Math.max(50, 120 - (snakeLength * 0.5));
            speedRef.current = calculatedSpeed;
            
            console.log("Snake length:", snakeLength, "Speed:", speedRef.current);
            
            // Create new interval with updated speed
            gameLoopRef.current = window.setInterval(() => {
                // Only start moving when initial position is set
                if (initialPositionSet.current) {
                    moveSnake();
                    // Always check if we need to respawn food
                    if (foodEatenRef.current) {
                        generateNewFood();
                        foodEatenRef.current = false;
                    }
                }
            }, speedRef.current);
        };
        
        // Initialize game loop
        updateGameLoop();
        
        // Update game loop when snake length changes
        const intervalCheck = setInterval(() => {
            updateGameLoop();
        }, 1000); // Check once per second if we need to update speed
        
        return () => {
            if (gameLoopRef.current !== null) {
                window.clearInterval(gameLoopRef.current);
            }
            clearInterval(intervalCheck);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && canvasRef.current) {
                containerRef.current.removeChild(canvasRef.current);
            }
        };
    }, []);
    
    // Update whenever game state changes
    useEffect(() => {
        renderGame();
    }, [gameState]);
    
    return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}></div>;
};

const styles: StyleSheet = {
    page: {
        left: 0,
        right: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        textAlign: 'center',
        marginBottom: 64,
        marginTop: 64,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        justifyContent: 'space-between',
    },
    link: {
        padding: 16,
    },
    forHireContainer: {
        marginTop: 64,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    name: {
        fontSize: 72,
        marginBottom: 16,
        lineHeight: 0.9,
    },
    socialsContainer: {
        position: 'fixed',
        bottom: 5, // Moved down from 60px
        left: 40,
        display: 'flex',
        flexDirection: 'column',
    },
    socials: {
        display: 'flex',
        flexDirection: 'row',
        gap: '70px', // Increased from 24px for more horizontal spacing
    },
    socialWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 5, // Reduced from 32px (about 60% of original)
    },
    social: {
        width: 20, // Reduced from 32px
        height: 20, // Reduced from 32px
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    marioImage: {
        height: 32,
        width: 32,
        marginTop: 0,
    }
};

const MarioAnimation: React.FC<MarioAnimationProps> = ({ isAnimating, index }) => (
    <img 
        src={isAnimating ? marioPunch : marioStill}
        alt=""
        style={styles.marioImage}
    />
);

const SocialBox: React.FC<SocialBoxProps> = ({ link, icon, onActivate }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onActivate();
        
        setTimeout(() => {
            window.open(link, '_blank');
        }, 1000);
    };

    return (
        <a 
            rel="noreferrer" 
            href={link}
            onClick={handleClick}
        >
            <div className="big-button-container" style={styles.social}>
                <img src={icon} alt="" style={styles.socialImage} />
            </div>
        </a>
    );
};

const Home: React.FC<HomeProps> = (props) => {
    const navigate = useNavigate();
    const [activeMario, setActiveMario] = useState<number | null>(null);

    const goToContact = () => {
        navigate('/contact');
    };

    const socialLinks = [
        { icon: ghIcon, link: 'https://github.com/M1shaaa' },
        { icon: inIcon, link: 'https://www.linkedin.com/in/misha-o-keeffe-099348262/' },
        { icon: twitterIcon, link: 'https://x.com/mish_uhhh' },
        { icon: gsIcon, link: 'https://scholar.google.com/citations?user=j41CbesAAAAJ&hl=en' },
    ];

    return (
        <div style={styles.page}>
            {/* Add the improved Snake game in the background */}
            <ImprovedSnake />
            
            <div style={styles.header}>
                <h1 style={styles.name}>misha okeeffe</h1>
                <h2>personal website</h2>
            </div>
            <div style={styles.buttons}>
                <Link containerStyle={styles.link} to="about" text="about me" />
                <Link
                    containerStyle={styles.link}
                    to="experience"
                    text="research"
                />
                <Link
                    containerStyle={styles.link}
                    to="projects"
                    text="everything else"
                />
                <Link
                    containerStyle={styles.link}
                    to="contact"
                    text="contact"
                />
            </div>
            <div style={styles.forHireContainer} onMouseDown={goToContact}>
                {/* <img src={forhire} alt="" /> */}
            </div>
            <div style={styles.socialsContainer}>
                <div style={styles.socials}>
                    {socialLinks.map((social, index) => (
                        <div key={index} style={styles.socialWrapper}>
                            <SocialBox
                                icon={social.icon}
                                link={social.link}
                                position={index}
                                onActivate={() => {
                                    setActiveMario(index);
                                    setTimeout(() => setActiveMario(null), 500);
                                }}
                            />
                            <MarioAnimation
                                isAnimating={activeMario === index}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;