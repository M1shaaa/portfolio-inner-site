import React, { useState } from 'react';
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
    index: number; // Changed from position to index
}

interface SocialBoxProps {
    icon: string;
    link: string;
    position: number;
    onActivate: () => void;
}

const styles: StyleSheet = {
    // ... other styles remain the same ...
    socialsContainer: {
        position: 'fixed',
        bottom: 60,
        left: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    socials: {
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
    },
    socialWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 32, // Match social icon width
    },
    social: {
        width: 32,
        height: 32,
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
        marginTop: 16, // Space between icon and Mario
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
        }, 500);
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
            {/* ... other elements remain the same ... */}
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