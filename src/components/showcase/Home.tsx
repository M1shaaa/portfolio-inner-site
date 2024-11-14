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

export interface HomeProps {}

interface AnimatedSocialBoxProps {
    icon: string;
    link: string;
    boxPosition: number;
}

const AnimatedSocialBox: React.FC<AnimatedSocialBoxProps> = ({ link, icon, boxPosition }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAnimating(true);
        
        setTimeout(() => {
            window.open(link, '_blank');
            setIsAnimating(false);
        }, 500);
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
                left: `${boxPosition * 44}px`,
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

const Home: React.FC<HomeProps> = (props) => {
    const navigate = useNavigate();

    const goToContact = () => {
        navigate('/contact');
    };

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
    container: {
        position: 'relative',
        marginRight: 8,
    },
    linkContainer: {
        textDecoration: 'none',
        display: 'block',
    },
    socialsContainer: {
        position: 'fixed',
        bottom: 20,
        left: 20,
    },
    socials: {
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
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
        bottom: -40,
        transform: 'translateX(-50%)',
        zIndex: -1,
    },
    marioImage: {
        height: 32,
        width: 'auto',
    },
};

export default Home;