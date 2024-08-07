import React from 'react';

import girlRun from '../../../assets/pictures/projects/art/girl-run.gif';
import gsts from '../../../assets/pictures/projects/art/gsts.png';

export interface ArtProjectsProps {}

const ArtProjects: React.FC<ArtProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Art & Design</h1>
            <h3>More Creative ventures</h3>
            <br />
            <div className="text-block">
                <p>
                    While I would by no means call myself an artist, I do have a few artistic hobbies 
                    that I find myself enjoying--here are some of them. 
                </p>
                <br />
            </div>
            <div className="text-block">
                <h2>Fashion as art</h2>
                <br />
                <p>
                    [coming soon!]
                </p>
                <br />
            </div>
            <div className="text-block">
                <h2>Music</h2>
                <br />
                <p>
                    [coming soon!]
                </p>
                <br />
            </div>
        </div>
    );
};

export default ArtProjects;