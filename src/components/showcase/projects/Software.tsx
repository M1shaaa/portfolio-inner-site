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
                    In August 2022, probably two weeks into moving to Madison, I had my very first shift
                    at the restaurant I was going to be working at. It also happened to be the same day
                    that the Madison ironman was going on. Because all the roads were shut down, it was 
                    super hard for us to get orders out to our delivery drivers. It eventually got to the 
                    point where I decided to run the food out to the drivers myself. While running with 
                    my uniform on and food in hand, I thought to myself just how cool it would be to run 
                    the Madison Ironman.
                </p>
                <br />
                <p>
                    Fast forward to April and I (impulsively) signed up to run the following year. Most of my summer
                    that year was spent trying to get into good enough shape such that I wouldn't embarass myself too
                    much when the time came. In all honestly, this was dreadful and I more or less gave up and stopped 
                    training completely about a month or so out from the race. Nonetheless, I decided to try anyway. The day 
                    of, I was barely able to make each cutoff time and finished in about 14 or 15 hours. This was probably 
                    the hardest thing I have ever done--would not recommend lol. 
                </p>
            </div>
            <div className="text-block">
                <h2>running</h2>
                <p>
                    [coming soon!]
                </p>
            </div>
            <div className="text-block">
                <h2>mountaineering</h2>
                <p>
                    [coming soon!]
                </p>
            </div>
        </div>
    );
};

export default SoftwareProjects;