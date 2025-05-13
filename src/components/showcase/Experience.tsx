import React from 'react';
import ResumeDownload from './ResumeDownload';
// Import the construction GIF
import constructionGif from '../../assets/pictures/construction.gif';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.constructionContainer}>
                <img 
                    src={constructionGif} 
                    alt="Under Construction" 
                    style={styles.constructionGif} 
                />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    constructionContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 40,
    },
    constructionGif: {
        maxWidth: '100%',
    },
};

export default Experience;