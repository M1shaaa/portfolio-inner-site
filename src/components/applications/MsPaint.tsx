import React from 'react';
import Window from '../os/Window';

export interface HenordleAppProps extends WindowAppProps {}

const HenordleApp: React.FC<HenordleAppProps> = (props) => {
    return (
        <Window
            top={24}
            left={350}
            width={600}
            height={860}
            windowBarIcon="windowgameIcon"
            windowTitle="ms (misha) paint"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div className="site-page">
                <ms paint />
            </div>
        </Window>
    );
};

export default HenordleApp;
