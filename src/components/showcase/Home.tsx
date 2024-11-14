import React, { useState } from 'react';
import marioPunch from '../../assets/pictures/mario-hit.gif';
import marioStill from '../../assets/pictures/mario-still.png';

interface AnimatedSocialBoxProps {
    icon: string;
    link: string;
    boxPosition: number; // To offset Mario horizontally under each box
}

const AnimatedSocialBox: React.FC<AnimatedSocialBoxProps> = ({ link, icon, boxPosition }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent immediate navigation
        setIsAnimating(true);
        
        // Wait for animation to complete before navigating
        setTimeout(() => {
            window.open(link, '_blank');
            setIsAnimating(false);
        }, 500); // Adjust timing based on your GIF duration
    };

    return (
        <div style={styles.container}>
            <a 
                rel="noreferrer" 
                href={link}
                onClick={handleClick}
                style={styles.linkContainer}
            >
                <div className="big-button-container" style={styles.social}>
                    <img src={icon} alt="" style={styles.socialImage} />
                </div>
            </a>
            <div style={{
                ...styles.marioContainer,
                left: `${boxPosition * 44}px`, // 44px = social icon width + gap
            }}>
                <img 
                    src={isAnimating ? marioPunch : marioStill}
                    alt=""
                    style={styles.marioImage}
                />
            </div>
        </div>
    );
};

// Updated Home component code - replace the previous SocialBox components with these:
const Home: React.FC<HomeProps> = (props) => {
    // ... other code remains the same ...

    return (
        <div style={styles.page}>
            {/* ... other elements remain the same ... */}
            <div style={styles.socialsContainer}>
                <div style={styles.socials}>
                    <AnimatedSocialBox
                        icon={ghIcon}
                        link={'https://github.com/M1shaaa'}
                        boxPosition={0}
                    />
                    <AnimatedSocialBox
                        icon={inIcon}
                        link={'https://www.linkedin.com/in/misha-o-keeffe-099348262/'}
                        boxPosition={1}
                    />
                    <AnimatedSocialBox
                        icon={twitterIcon}
                        link={'https://x.com/mish_uhhh'}
                        boxPosition={2}
                    />
                    <AnimatedSocialBox
                        icon={gsIcon}
                        link={'https://scholar.google.com/citations?user=j41CbesAAAAJ&hl=en'}
                        boxPosition={3}
                    />
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    // ... keep existing styles ...
    container: {
        position: 'relative',
        marginRight: 8,
    },
    linkContainer: {
        textDecoration: 'none',
        display: 'block',
    },
    social: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialImage: {
        width: 36,
        height: 36,
    },
    marioContainer: {
        position: 'absolute',
        bottom: -40, // Adjust this value to position Mario vertically
        transform: 'translateX(-50%)', // Center Mario under the box
        zIndex: -1,
    },
    marioImage: {
        height: 32, // Adjust size as needed
        width: 'auto',
    },
};

export default Home;
