import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import software from '../../assets/pictures/projects/software.gif';
import pencil from '../../assets/pictures/projects/pencil.gif';
import music from '../../assets/pictures/projects/music.gif';
import loop from '../../assets/pictures/projects/loop.gif';

export interface ProjectsProps {}

interface ProjectBoxProps {
    icon: string;
    title: string;
    subtitle: string;
    route: string;
    iconStyle: React.CSSProperties;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({
    icon,
    title,
    subtitle,
    route,
    iconStyle,
}) => {
    const [, setIsHovering] = useState(false);
    const navigation = useNavigate();

    const handleClick = () => {
        navigation(`/projects/${route}`);
    };

    const onMouseEnter = () => {
        setIsHovering(true);
    };

    const onMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div
            onMouseDown={handleClick}
            className="big-button-container"
            style={styles.projectLink}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={styles.projectLinkLeft}>
                <img
                    src={icon}
                    style={Object.assign(
                        {},
                        styles.projectLinkImage,
                        iconStyle
                    )}
                    alt=""
                />
                <div style={styles.projectText}>
                    <h1 style={{ fontSize: 48 }}>{title}</h1>
                    <h3>{subtitle}</h3>
                </div>
            </div>
            <div style={styles.projectLinkRight}></div>
        </div>
    );
};

const Projects: React.FC<ProjectsProps> = (props) => {
    console.log("Loop image loaded:", loop);
    return (
        <div className="site-page-content">
            <h1>Hobbies</h1>
            <h3>& Resources</h3>
            <br />
            <p>
                Click on one of the areas below to check out my adventures, thoughts, writing, and some resources 
                I've compiled that I hope will help. 
            </p>
            <br />
            <div style={styles.projectLinksContainer}>
                <ProjectBox
                    icon={software}
                    iconStyle={styles.computerIcon}
                    title="my adventures"
                    subtitle="travel and various endeavors"
                    route="software"
                />
                <ProjectBox
                    icon={loop}
                    iconStyle={styles.loopIcon}
                    title="what's cooking"
                    subtitle="what's been on loop in my brain lately"
                    route="thoughts"
                />
                <ProjectBox
                    icon={pencil}
                    iconStyle={styles.pencilIcon}  // Changed from artIcon to pencilIcon
                    title="my musings"
                    subtitle="substack: that liminal space between my thoughts and the ether"
                    route="art"
                />
                <ProjectBox
                    icon={music}
                    iconStyle={styles.musicIcon}
                    title="open science"
                    subtitle="resources"
                    route="music"
                />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    projectLinksContainer: {
        flexDirection: 'column',
        width: '100%',
        display: 'flex',
        flex: 1,
    },
    projectLink: {
        marginBottom: 24,
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',

        alignItems: 'center',
        justifyContent: 'space-between',
    },
    projectText: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    projectLinkImage: {
        width: 48,
        // height: 48,
        marginRight: 38,
    },
    projectLinkLeft: {
        marginLeft: 16,
        alignItems: 'center',
    },
    computerIcon: {
        width: 90,
        height: 90,
    },
    musicIcon: {
        width: 70,
        height: 70,
    },
    arrowIcon: {
        width: 48,
        height: 48,
    },
    pencilIcon: {
        width: 70,
        height: 70,
    },
    loopIcon: {
        width: 70,
        height: 80,
    },
};

export default Projects;
