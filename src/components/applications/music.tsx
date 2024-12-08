import React, { useState } from 'react';
import Window from '../os/Window';
import { MusicPlayer } from '../general';
import mozartMusic from '../../assets/audio/mozart_rnn.mp3';

export interface MusicAppProps extends WindowAppProps {}

const Music: React.FC<MusicAppProps> = (props) => {
    const [currentSong, setCurrentSong] = useState<string>('');

    return (
        <Window
            top={60}
            left={200}
            width={600}
            height={400}
            windowBarIcon="folderIcon"
            windowTitle="Music"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div style={styles.container}>
                <div style={styles.menuBar}>
                    <div style={styles.menuItem}>File</div>
                    <div style={styles.menuItem}>Edit</div>
                    <div style={styles.menuItem}>View</div>
                    <div style={styles.menuItem}>Help</div>
                </div>
                <div style={styles.content}>
                    <div style={styles.playerContainer}>
                        <MusicPlayer
                            src={mozartMusic}
                            title="Mozart RNN"
                            subtitle="AI Generated Music"
                            currentSong={currentSong}
                            setCurrentSong={setCurrentSong}
                        />
                    </div>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
    },
    menuBar: {
        display: 'flex',
        padding: '2px 0',
        borderBottom: '1px solid #808080',
    },
    menuItem: {
        padding: '0 8px',
        cursor: 'default',
    },
    content: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: '16px',
        overflow: 'auto',
    },
    playerContainer: {
        marginTop: '16px',
    }
};

export default Music;