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

// Simple Snake Game Component
const SimpleSnake: React.FC = () => {
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
          setGameState(prev => {
            if (prev.direction !== 'down') // Prevent 180 degree turns
              return { ...prev, direction: 'up' };
            return prev;
          });
          break;
        case 'ArrowDown': 
          setGameState(prev => {
            if (prev.direction !== 'up')
              return { ...prev, direction: 'down' };
            return prev;
          });
          break;
        case 'ArrowLeft': 
          setGameState(prev => {
            if (prev.direction !== 'right')
              return { ...prev, direction: 'left' };
            return prev;
          });
          break;
        case 'ArrowRight': 
          setGameState(prev => {
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
  
  // Helper function to determine if a position is occupied by a UI element
  const isPositionOccupied = (x: number, y: number): boolean => {
    // Get all UI elements
    const elements = document.querySelectorAll('h1, h2, a, div[style*="button"]');
    
    // Check if position is inside any of these elements
    for (let i = 0; i < elements.length; i++) {
      const rect = elements[i].getBoundingClientRect();
      if (
        x >= rect.left && 
        x <= rect.right && 
        y >= rect.top && 
        y <= rect.bottom
      ) {
        return true;
      }
    }
    
    return false;
  };
  
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
      
      // Check wall collision
      if (
        head.x < 0 || 
        head.x >= window.innerWidth || 
        head.y < 0 || 
        head.y >= window.innerHeight ||
        isPositionOccupied(head.x, head.y)
      ) {
        // Reset snake on collision
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
        // Generate new food at random position
        let newFoodX, newFoodY;
        do {
          newFoodX = Math.floor(Math.random() * (window.innerWidth / 10)) * 10;
          newFoodY = Math.floor(Math.random() * (window.innerHeight / 10)) * 10;
        } while (isPositionOccupied(newFoodX, newFoodY)); // Ensure food isn't inside UI elements
        
        return {
          ...prev,
          snake: newSnake,
          food: { x: newFoodX, y: newFoodY },
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
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#32CD32' : '#228B22'; // Head is lighter green
      ctx.fillRect(segment.x, segment.y, 10, 10);
    });
    
    // Draw food
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
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 10, 25);
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
            {/* Add the Snake game in the background */}
            <SimpleSnake />
            
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