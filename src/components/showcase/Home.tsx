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
    index: number;
}

interface SocialBoxProps {
    icon: string;
    link: string;
    position: number;
    onActivate: () => void;
}

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
        bottom: 10, // Moved down from 60px
        left: 20,
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
        width: 15, // Reduced from 32px
        height: 15, // Reduced from 32px
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