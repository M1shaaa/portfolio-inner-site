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
                    Going into my final year at Madison, I knew I wanted to do something to celebrate graduating. Ideally, I 
                    wanted find something to do with my dad, who had also gone to Madison. We decided to run an Ultramarathon 
                    together. Looking at dates and logistics, we decided that the Bryce Canyon ultra would work the best for the 
                    both of us. I actually ended up deciding to graduate in December so that I could go to my mom's graduation (which 
                    was happening the same day as the Madison one that Spring). So right after I took my last final, I went to go celebrate 
                    my mom's graduation before coming back to Madison to move all my stuff out to chicago and finally flying off to Utah. 
                    It ended up being aorund 58 miles and so! much! fun! It basically combined two of my favorite hobbies: being outside and 
                    running. It was definitely hard and I walked for much of it, but it was so much more enjoyable than road marathons I had 
                    done before. 
                </p>
            </div>
            <div className="text-block">
                <h2>mountaineering</h2>
                <p>
                    I also really enjoy climbing - or rather trying to climb - various mountains, often 
                    with my friends. With one of my good friends in particular, Aaron, I've
                    {/* Complete this sentence */}
                </p>
                <div className="captioned-image">
                    <VideoAsset src={scroll} />
                    <p className="caption">
                        <sub>
                            <b>Figure 3:</b>
                        </sub>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SoftwareProjects;