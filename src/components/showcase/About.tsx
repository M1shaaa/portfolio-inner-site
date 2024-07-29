import React from 'react';
import me from '../../assets/pictures/workingAtComputer.jpg';
import meNow from '../../assets/pictures/currentme.jpg';
import { Link } from 'react-router-dom';
import ResumeDownload from './ResumeDownload';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    return (
        // add on resize listener
        <div className="site-page-content">
            {/* <img src={me} style={styles.topImage} alt="" /> */}
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>I'm misha okeeffe</h3>
            <br />
            <div className="text-block">
                <p>
                    I'm currently a predoctoral fellow working in Dr. Gweon's Social
                    Learning Lab at Stanford University. Before working here, I worked
                    in Dr. Hawkin's Social Interaction Lab, Dr. Dunham's Social 
                    Cognitive Development Lab, and Dr. Bonawitz Computational 
                    Cognitive Development Lab.
                </p>
                <br />
                <p>
                    Thanks for checking out my portfolio! I really hope you enjoy 
                    exploring it as much as I enjoyed building it. If you have any
                    questions or comments, feel free to shoot me an email at{' '}
                    <a href="mailto:mokeeffe@stanford.edu">
                        mokeeffe@stanford.edu
                    </a>
                </p>
            </div>
            <ResumeDownload />
            <div className="text-block">
                <h3>About Me</h3>
                <br />
                <p>
                    I've always been super curious about how the world around me works.
                    As a freshman in college, this led me to pursue some super cool research
                    opportunities in physics. As I got more exposure and broadened my horizons,
                    I eventually realized that what I was really interested in were questions
                    about how people worked. This interest led me to study economics and psych
                    as an undergrad at UW-Madison. I saw them both as cool ways to study and 
                    model the behavior of the people around me. When graduating, I decided
                    to continue down the psych route and started working in my current lab. 
                </p>
                <br />
                <div className="captioned-image">
                    <img src={me} style={styles.image} alt="" />
                    <p>
                        <sub>
                            <b>Figure 1:</b> me as a youngin' :)
                        </sub>
                    </p>
                </div>
                <br />
                <p>
                    I'm really curious about how we learn about and from one another, and how
                    we start doing so as children. So much of this process happens during 
                    social interactions, even those that we aren't directly a part of. How do 
                    we learn so much in such a short span of time? I'm also tangentially
                    interested in how we can build models that effectively capture this 
                    process. 
                </p>
                <br />
                <br />
                <div style={{}}>
                    <div
                        style={{
                            flex: 1,
                            textAlign: 'justify',
                            alignSelf: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <h3>My Hobbies</h3>
                        <br />
                        <p>
                            Beyond cognitive science, I have a lot of hobbies that I
                            enjoy doing in my free time. The more tangible
                            hobbies I have are{' '}
                            <Link to="/projects/music">Music Production</Link>{' '}
                            and creating{' '}
                            <Link to="/projects/art">Digital Art</Link>. You can
                            read more about each of these on their respective
                            pages under my projects tab. Some other hobbies I
                            enjoy are thrifting, cooking, and going on various
                            adventures.
                        </p>
                        <br />
                        <p>
                            In college, I was also an ra in the dorms. 
                        </p>
                    </div>
                    <div style={styles.verticalImage}>
                        <img src={meNow} style={styles.image} alt="" />
                        <p>
                            <sub>
                                <b>Figure 2:</b> Me, April 2022
                            </sub>
                        </p>
                    </div>
                </div>
                <br />
                <br />
                <p>
                    Thanks for reading about me! I really hope that you enjoy
                    exploring the rest of my website
                </p>
                <br />
                <p>
                    If you have any questions or comments I would love to hear
                    them. You can reach me through the{' '}
                    <Link to="/contact">contact page</Link> or shoot me an email
                    at{' '}
                    <a href="mailto:mokeeffe@stanford.edu">
                        mokeeffe@stanford.edu
                    </a>
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    contentHeader: {
        marginBottom: 16,
        fontSize: 48,
    },
    image: {
        height: 'auto',
        width: '100%',
    },
    topImage: {
        height: 'auto',
        width: '100%',
        marginBottom: 32,
    },
    verticalImage: {
        alignSelf: 'center',
        // width: '80%',
        marginLeft: 32,
        flex: 0.8,

        alignItems: 'center',
        // marginBottom: 32,
        textAlign: 'center',
        flexDirection: 'column',
    },
};

export default About;
