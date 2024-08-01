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
                    i'm currently a working as a post-bacc in the social learning lab under Dr. Gweon at 
                    stanford university. In our lab we're really curious about how, as people, we're 
                    able to make inferences about other people and their mental states. By studying children 
                    in particular, we can see how this ability develops over time. We tend to use a wide 
                    variety of methods to accomplish this. More to come on projects soon!
                </p>
                <br />
                <p>
                    So much of the learning we do is intrinsically a social process; while some exploring and 
                    learning may happen on our own, much of it is scaffolded by various external agents. On a more 
                    personal level, I'm particularly intersted in the social inferences we are able to make from 
                    social interactions. In these social interactions, we are able to learn so much more than 
                    what is explicitly said or done; how do we are able to effectively do this, especially as 
                    children? Also, how can we go about designing models that are able to effectively capture this 
                    process in a meaningful way? 
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
                    Going into my junior year of undergrad, I wanted to get involved in a lab at madison. I hadn't 
                    really been overly excited about any of the labs before this, but during my summer internship, I 
                    happened to notice that we were hiring a new professor in the psych department: Robert Hawkins. I had 
                    some familiarity at the time from reading probmods and his work with Dr. Goodman, so I decided to reach 
                    out. We were able to connect and had a ton of shared interest. Looking back, I'm so glad it worked out 
                    this well.  
                </p>
                <br />
                <p>
                    I pretty much dived right into a project working with our postdoc, Claire Bergey, that looked at how 
                    our speech and communicative act patterns change across development, and how it does so in relation to 
                    the speech patterns of our parents. By using an NLP model, we were able to automatically classify speech 
                    acts from a individual-level longitudinal dataset of conversations between children and their caregivers. 
                </p>
                <p>
                    In doing so, we found that children's communicative act use tends to diversify from 14 to 58 months, and that 
                    their diversity in repertoire was correlated with those of their parents. We also find that children with more 
                    diverse repertoires have larger vocabularies and more diverse syntactic frames. Read more about the 
                    paper <a href="https://escholarship.org/content/qt85t9s85w/qt85t9s85w_noSplash_e4daf107da08dd945a5ef45dd63a3291.pdf" target="_blank" rel="noopener noreferrer">here</a>.
                </p>
                <p>
                     Following this project, we've more recently been working on a huge overhaul of a naturalistic dataset. While our paper 
                     looked at conversational analysis between children and their caregivers, we are also really curious about the kinds 
                     of conversations that children have with their peers. A lot of childrens' day is spent at day care, preschool, etc--
                     so what role does this flavor of interaction have on their linguistic development. To explore this, we collected naturalistic 
                     POV data from children in preschool as well as home recordings. More to come on this soon!
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
                    This was actually my first psych lab I ever got involved with. I first connected 
                    with rosie aboody who was the best possible mentor I could have asked for. Together we 
                    worked on two projects: (1) replicating some of Wellman's Theory of Mind work on 
                    Lookit as a part of the larger "Garden" project and (2) the effect of our phrasing choices 
                    on how we view others credibility. After a year on these projects, I started doing some work 
                    with Junyi Chu on another Lookit Garden project investigating how children reason about 
                    riddles in the physical domain; e.g. when our intuition is broken about how physical objects 
                    should function, how do children change their approach and revise their mental models to fit 
                    the task demands?
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
                    This was the my first ever summer internship and it was fantastic! I had the opportunity 
                    to work with one of the graduate students, Aaron Baker, on a project involving how children 
                    reason about institutional roles. Specifically, do children consider the consequences of 
                    actions differently when an agent is occupying an institutional role compared to when they aren't 
                    occupying one? We also were able to think through and design a model that captured how adults do this 
                    same process; for instance, how do our perceptions of influence the attributions that we are already making 
                    about agents from a traditional theory of mind (beliefs; desires) perspective? 
                </p>
            </div>
        </div>
    ); // <--- Missing closing parenthesis and curly brace
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