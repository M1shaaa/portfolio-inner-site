import React from 'react';
// @ts-ignore
import scroll from '../../../assets/pictures/projects/software/scroll.mp4';
import ResumeDownload from '../ResumeDownload';
import VideoAsset from '../../general/VideoAsset';

export interface SoftwareProjectsProps {}

const SoftwareProjects: React.FC<SoftwareProjectsProps> = () => {
    return (
        <div className="site-page-content">
            <h1>my various adventures</h1>
            <p>
                Below are some of my favorite things I've had the opportunity to do 
                over the past couple years. 
            </p>
            <ResumeDownload />
            <div className="text-block">
                <h2>the ironman</h2>
                <p>
                    [coming soon!]
                </p>
                <br />
            </div>
            <div className="text-block">
                <h2>ultra running</h2>
                <br />
                <h4>the 100 miler</h4>
                <p>
                     
                </p>
                <br />
                <h4>the 50 miler</h4>
                <p>
                     
                </p>
            </div>
            <div className="text-block">
            <br />
                <h2>mountain climbing</h2>
                <br />
                <h4>nevado de tolima - Colombia (17,100')</h4>
                <p>
                     
                </p>
                <br />
                <h4>mt. shasta (14,179')</h4>
                <p>
                     
                </p>
                <br />
                <h4>mt. whitney (14,505')</h4>
                <p>
                     
                </p>
                <br />
                <h4>longs peak (14,259′')</h4>
                <p>
                     
                </p>
                <br />
                <h4>longs peak (14,438′')</h4>
                <p>
                     
                </p>
            </div>
        </div>
    );
};

export default SoftwareProjects;