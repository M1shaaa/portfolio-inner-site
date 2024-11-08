import React, { useEffect, useState } from 'react';
import { Link } from '../general';
import forHire from '../../assets/pictures/forHireGif.gif';
import { useLocation, useNavigate } from 'react-router';

export interface VerticalNavbarProps {}

const VerticalNavbar: React.FC<VerticalNavbarProps> = (props) => {
    const location = useLocation();
    const [projectsExpanded, setProjectsExpanded] = useState(false);
    const [isHome, setIsHome] = useState(false);

    const navigate = useNavigate();
    const goToContact = () => {
        navigate('/contact');
    };

    useEffect(() => {
        if (location.pathname.includes('/projects')) {
            setProjectsExpanded(true);
        } else {
            setProjectsExpanded(false);
        }
        if (location.pathname === '/') {
            setIsHome(true);
        } else {
            setIsHome(false);
        }
        return () => {};
    }, [location.pathname]);

    return !isHome ? (
        <div style={styles.navbar}>
            <div style={styles.header}>
                <h1 style={styles.headerText}>misha</h1>
                <h1 style={styles.headerText}>okeeffe</h1>
                <h3 style={styles.headerShowcase}>personal website</h3>
            </div>
            <div style={styles.links}>
                <Link containerStyle={styles.link} to="" text="home" />
                <Link containerStyle={styles.link} to="about" text="about me" />
                <Link
                    containerStyle={styles.link}
                    to="experience"
                    text="research"
                />
                <Link
                    containerStyle={Object.assign(
                        {},
                        styles.link,
                        projectsExpanded && styles.expandedLink
                    )}
                    to="projects"
                    text="everything else"
                />
                {projectsExpanded && (
                    <div style={styles.insetLinks}>
                        <Link
                            containerStyle={styles.insetLink}
                            to="projects/software"
                            text="adventures"
                        />
                        <Link
                            containerStyle={styles.insetLink}
                            to="projects/thoughts"
                            text="what's cooking"
                        />
                        <Link
                            containerStyle={styles.insetLink}
                            to="projects/art"
                            text="my musings"
                        />
                        <Link
                            containerStyle={styles.insetLink}
                            to="projects/music"
                            text="open science"
                        />
                    </div>
                )}
                <Link containerStyle={styles.link} to="contact" text="contact" />
            </div>
            <div style={styles.spacer} />
            <div style={styles.forHireContainer} onMouseDown={goToContact}>
                {/* <img src={forHire} style={styles.image} alt="" /> */}
            </div>
        </div>
    ) : (
        <></>
    );
};

const styles: StyleSheetCSS = {
    navbar: {
        width: 300,
        height: '100vh',  // Changed from 100% to 100vh
        flexDirection: 'column',
        padding: 48,
        boxSizing: 'border-box',
        position: 'fixed',
        overflowY: 'auto',  // Changed from 'hidden' to 'auto'
        overflowX: 'hidden',  // Keep horizontal overflow hidden
        scrollbarWidth: 'thin',  // For Firefox
        msOverflowStyle: 'none',  // For IE
        '&::-webkit-scrollbar': {  // For Chrome/Safari
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
        },
    },
    header: {
        flexDirection: 'column',
        marginBottom: 64,
    },
    headerText: {
        fontSize: 38,
        lineHeight: 1,
    },
    headerShowcase: {
        marginTop: 12,
    },
    logo: {
        width: '100%',
        marginBottom: 8,
    },
    link: {
        marginBottom: 32,
    },
    expandedLink: {
        marginBottom: 16,
    },
    insetLinks: {
        flexDirection: 'column',
        marginLeft: 32,
        marginBottom: 16,
    },
    insetLink: {
        marginBottom: 8,
    },
    links: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width: '80%',
    },
    spacer: {
        flex: 1,
    },
    forHireContainer: {
        cursor: 'pointer',

        width: '100%',
    },
};

export default VerticalNavbar;
