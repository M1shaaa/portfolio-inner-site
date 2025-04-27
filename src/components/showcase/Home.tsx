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
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameState, setGameState] = useState<GameState>({
        snake: [{ x: 50, y: 50 }, { x: 40, y: 50 }, { x: 30, y: 50 }],
        food: { x: 100, y: 100 },
        direction: 'right',
        score: 0
    });
    
    // Track if food needs to be respawned
    const foodEatenRef = useRef<boolean>(false);
    
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
        
        // Generate initial food
        generateNewFood();
        
        // Start movement loop - SPEED ADJUSTED FROM 200 TO 120ms
        const interval = setInterval(() => {
            moveSnake();
            // Check if we need to respawn food
            if (foodEatenRef.current) {
                generateNewFood();
                foodEatenRef.current = false;
            }
        }, 120); // Faster movement speed (was 200ms)
        
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
        
        return () => {
            clearInterval(interval);
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
    
    // IMPROVED: Helper function with more precise hit detection
    const isPositionOccupied = (x: number, y: number): boolean => {
        // Get all UI elements
        const elements = document.querySelectorAll('h1, h2, a, div[style*="button"]');
        
        // Add a small buffer for hit testing (smaller than before)
        const buffer = 2; // Was implicitly larger before
        
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
    
    // IMPROVED: Generate new food at a valid position
    const generateNewFood = () => {
        // Generate new food at random position
        let newFoodX: number = 0;
        let newFoodY: number = 0;
        let attempts = 0;
        const maxAttempts = 200; // Increased from 100
        
        // Make sure food is within sensible bounds
        const margin = 40; // Keep food away from edges
        
        do {
            // Generate positions that are multiples of 10 for grid alignment
            newFoodX = Math.floor(Math.random() * ((window.innerWidth - margin*2) / 10)) * 10 + margin;
            newFoodY = Math.floor(Math.random() * ((window.innerHeight - margin*2) / 10)) * 10 + margin;
            attempts++;
            
            // Prevent infinite loops
            if (attempts >= maxAttempts) {
                console.log("Max attempts reached, using last position");
                break;
            }
        } while (
            // Check if food would spawn on snake
            gameState.snake.some((segment: {x: number, y: number}) => 
                Math.abs(segment.x - newFoodX) < 10 && Math.abs(segment.y - newFoodY) < 10
            ) ||
            // Check if food would spawn on UI element with tighter tolerance
            isPositionOccupied(newFoodX, newFoodY)
        );
        
        console.log("Generated new food at:", newFoodX, newFoodY);
        
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
            
            // Move head based on direction
            switch(prev.direction) {
                case 'up': head.y -= 10; break;
                case 'down': head.y += 10; break;
                case 'left': head.x -= 10; break;
                case 'right': head.x += 10; break;
            }
            
            // Check wall collision with a small margin
            const margin = 5;
            if (
                head.x < margin || 
                head.x >= window.innerWidth - margin || 
                head.y < margin || 
                head.y >= window.innerHeight - margin
            ) {
                // Reset snake on collision
                console.log("Wall collision at", head.x, head.y);
                head.x = 50;
                head.y = 50;
                
                return {
                    ...prev,
                    snake: [head],
                    direction: 'right',
                    score: 0
                };
            }
            
            // Check more precisely if head hits UI element
            if (isPositionOccupied(head.x, head.y)) {
                console.log("UI collision at", head.x, head.y);
                head.x = 50;
                head.y = 50;
                
                return {
                    ...prev,
                    snake: [head],
                    direction: 'right',
                    score: 0
                };
            }
            
            // Check self-collision (snake can't hit itself)
            const isSelfCollision = newSnake.slice(1).some((segment: {x: number, y: number}) => 
                Math.abs(segment.x - head.x) < 5 && Math.abs(segment.y - head.y) < 5
            );
            
            if (isSelfCollision) {
                console.log("Self collision");
                head.x = 50;
                head.y = 50;
                
                return {
                    ...prev,
                    snake: [head],
                    direction: 'right',
                    score: 0
                };
            }
            
            // Add new head
            newSnake.unshift(head);
            
            // Check if eating food
            if (Math.abs(head.x - prev.food.x) < 10 && Math.abs(head.y - prev.food.y) < 10) {
                foodEatenRef.current = true;
                
                // IMPROVED: Don't remove tail when eating food (snake grows)
                return {
                    ...prev,
                    snake: newSnake, 
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
        gameState.snake.forEach((segment: {x: number, y: number}, index: number) => {
            // Draw rounded rectangle for the head
            if (index === 0) {
                const radius = 5;
                ctx.fillStyle = '#32CD32'; // Lime green
                ctx.beginPath();
                ctx.moveTo(segment.x + radius, segment.y);
                ctx.arcTo(segment.x + 10, segment.y, segment.x + 10, segment.y + 10, radius);
                ctx.arcTo(segment.x + 10, segment.y + 10, segment.x, segment.y + 10, radius);
                ctx.arcTo(segment.x, segment.y + 10, segment.x, segment.y, radius);
                ctx.arcTo(segment.x, segment.y, segment.x + 10, segment.y, radius);
                ctx.closePath();
                ctx.fill();
                
                // Draw snake eyes
                ctx.fillStyle = 'white';
                
                // Position eyes based on direction
                let leftEyeX = segment.x + 2.5;
                let leftEyeY = segment.y + 2.5;
                let rightEyeX = segment.x + 7.5;
                let rightEyeY = segment.y + 2.5;
                
                switch (gameState.direction) {
                    case 'up':
                        // Eyes positioned at top
                        break;
                    case 'down':
                        // Eyes positioned at bottom
                        leftEyeY = segment.y + 7.5;
                        rightEyeY = segment.y + 7.5;
                        break;
                    case 'left':
                        // Eyes positioned at left
                        leftEyeX = segment.x + 2.5;
                        leftEyeY = segment.y + 2.5;
                        rightEyeX = segment.x + 2.5;
                        rightEyeY = segment.y + 7.5;
                        break;
                    case 'right':
                        // Eyes positioned at right
                        leftEyeX = segment.x + 7.5;
                        leftEyeY = segment.y + 2.5;
                        rightEyeX = segment.x + 7.5;
                        rightEyeY = segment.y + 7.5;
                        break;
                }
                
                // Draw eyes
                const eyeSize = 1.5;
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
                const gap = 2;
                ctx.fillRect(
                    segment.x + gap / 2, 
                    segment.y + gap / 2, 
                    10 - gap, 
                    10 - gap
                );
            }
        });
        
        // Draw food as apple
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            gameState.food.x + 5,
            gameState.food.y + 5,
            5,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw stem
        ctx.fillStyle = 'brown';
        ctx.fillRect(
            gameState.food.x + 5 - 1,
            gameState.food.y,
            2,
            3
        );
        
        // Draw leaf
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.ellipse(
            gameState.food.x + 5 + 3,
            gameState.food.y + 2,
            3,
            1.5,
            Math.PI / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`Score: ${gameState.score}`, 10, 25);
        
        // Draw snake length
        ctx.fillText(`Length: ${gameState.snake.length}`, 10, 50);
    };
    
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

// Make sure to export the component correctly
export default Home;