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
            <h1 style={{ marginLeft: -16 }}>welcome weary internet traveler !</h1>
            <h3>I'm misha okeeffe</h3>
            <br />
            <div className="text-block">
                <p>
                I'm currently a predoctoral fellow working in <a href="https://sll.stanford.edu/">Dr. Gweon's Social
                Learning Lab</a> at Stanford University. Before working here, I worked with 
                <a href="https://clairebergey.net/">Claire Bergey</a> in <a href="https://rdhawkins.com/">Dr. Hawkins'
                Social Interaction Lab</a>, <a href="https://www.aajbaker.com/">Aaron Baker</a> in 
                <a href="https://www.socialcogdev.com/">Dr. Dunham's Social Cognitive Development Lab</a>, and 
                <a href="https://raboody.github.io/website/">Rosie Aboody</a> and <a href="https://jchu10.github.io/">Junyi
                Chu</a> in <a href="https://projects.iq.harvard.edu/ccdlab/home">Dr. Bonawitz's Computational 
                Cognitive Development Lab</a>.
                </p>
                <br />
                <p>
                    Thanks for checking out my website! I really hope you enjoy(ed) 
                    exploring it as much as I enjoyed building it. If you have any
                    questions or comments, feel free to shoot me an email at{' '}
                    <a href="mailto:mokeeffe@stanford.edu">
                        mokeeffe@stanford.edu
                    </a>
                </p>
            </div>
            <ResumeDownload />
            <div className="text-block">
                <h3>a little bit about me</h3>
                <br />
                <p>
                    I've always been super curious about how the world around me works.
                    
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
                    I'm really interested about how we learn about and from one another, and how
                    we start doing so as children. This interest led me to study econ and psych
                    as an undergrad at UW-Madison. I saw them as ways to both study and 
                    model the behavior of the people around me. Upon graduating, I decided
                    to continue more down the psych route and that's how I started working in my 
                    current lab! 
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
                            <Link to="/projects/music">adventuring</Link>{' '}
                            and {' '}
                            <Link to="/projects/art">creating cool stuff</Link>. You can
                            read more about each of these on their respective
                            pages under my projects tab. Some other hobbies I
                            enjoy are thrifting, cooking, spending time with those
                            I care about, and attemping athletic endeavors.
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
                                <b>Figure 2:</b> a more current photo of myself
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
