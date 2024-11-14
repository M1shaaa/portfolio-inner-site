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

// Define StyleSheet type
interface StyleSheet {
    [key: string]: React.CSSProperties;
}

export interface HomeProps {}

interface MarioAnimationProps {
    isAnimating: boolean;
    position: number;
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
    linkContainer: {
        textDecoration: 'none',
        display: 'block',
        marginRight: 8,
    },
    socialsContainer: {
        position: 'fixed',
        bottom: 20,
        left: 20,
    },
    socials: {
        display: 'flex',
        flexDirection: 'row',
    },
    mariosContainer: {
        position: 'relative',
        height: 32,
        marginTop: 8,
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
        top: 0,
        transform: 'translateX(-50%)',
    },
    marioImage: {
        height: 32,
        width: 32,
        objectFit: 'contain',
    },
};

const MarioAnimation: React.FC<MarioAnimationProps> = ({ isAnimating, position }) => (
    <div style={{
        ...styles.marioContainer,
        left: `${position * 44}px`,
    }}>
        <img 
            src={isAnimating ? marioPunch : marioStill}
            alt=""
            style={styles.marioImage}
        />
    </div>
);

interface SocialBoxProps {
    icon: string;
    link: string;
    position: number;
    onActivate: () => void;
}

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
            style={styles.linkContainer}
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
                        <SocialBox
                            key={index}
                            icon={social.icon}
                            link={social.link}
                            position={index}
                            onActivate={() => {
                                setActiveMario(index);
                                setTimeout(() => setActiveMario(null), 500);
                            }}
                        />
                    ))}
                </div>
                <div style={styles.mariosContainer}>
                    {socialLinks.map((_, index) => (
                        <MarioAnimation
                            key={index}
                            isAnimating={activeMario === index}
                            position={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;