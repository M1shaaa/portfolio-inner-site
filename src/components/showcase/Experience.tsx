import React from 'react';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>SLL Lab</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://sll.stanford.edu'}
                        >
                            <h4>sll.stanford.edu</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>predoctoral fellow</h3>
                        <b>
                            <p>july 2024 - present</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
            <p>
                    Working under Dr. Hyowon Gweon studying the development of social cognition and learning. Our research 
                    investigates how humans infer others' mental states and how this ability develops throughout childhood. 
                    Current projects focus on understanding the mechanisms behind social learning and inference-making in 
                    early childhood development.
                </p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>SoIL Lab</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://socialinteractionlab.github.io/'}
                        >
                            <h4>socialinteractionlab</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>research assistant</h3>
                        <b>
                        <p>august 2023 - present</p>
                </b>
            </div>
        </div>
    </div>
    <div className="text-block">
        <p>
            Conducted research with Dr. Robert Hawkins and Dr. Claire Bergey analyzing developmental patterns 
            in speech and communication. Our main project analyzed child-caregiver conversations using NLP models 
            to classify speech acts, where we demonstrated correlation between parental communication diversity 
            and child vocabulary development (ages 14-58 months). Published findings available 
            <a href="https://escholarship.org/content/qt85t9s85w/qt85t9s85w_noSplash_e4daf107da08dd945a5ef45dd63a3291.pdf" target="_blank" rel="noopener noreferrer"> here</a>.
        </p>
        <p>
            We are currently analyzing naturalistic POV recordings of preschool peer interactions to understand 
            the impact of peer communication on linguistic development.
        </p>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>CoCoDev Lab</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://projects.iq.harvard.edu/ccdlab/home'}
                        >
                            <h4>cocodev lab</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Research Assistant</h3>
                        <b>
                            <p>December 2023 - May 2024</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Collaborated on multiple projects investigating cognitive development. Working with Rosie Aboody,
                    we replicated Wellman's Theory of Mind studies on the Lookit platform and investigated the relationship 
                    between language choice and perceived credibility. Additionally, worked with Junyi Chu studying 
                    children's reasoning about physical riddles, examining how children revise mental models when faced 
                    with counterintuitive physical phenomena.
                </p>
                <br />
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>SCD Lab</h1>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={'https://www.socialcogdev.com/'}
                        >
                            <h4>soccogdevlab</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Research Assistant</h3>
                        <b>
                            <p>May 2023 - Aug 2023</p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                Collaborated with Aaron Baker on investigating how children reason about institutional roles. 
                    Our work studied how children's evaluations of actions differ based on institutional context. 
                    We also developed computational models of adult reasoning about institutional roles, integrating 
                    traditional theory of mind frameworks with role-based inference.
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    skillRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    skillName: {
        minWidth: 56,
    },
    skill: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        background: 'red',
        marginLeft: 8,
        height: 8,
    },
    hoverLogo: {
        height: 32,
        marginBottom: 16,
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    hoverText: {
        marginBottom: 8,
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;