import React, { useCallback, useEffect, useState, useRef } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import Doom from '../applications/Doom';
import OregonTrail from '../applications/OregonTrail';
import ShutdownSequence from './ShutdownSequence';
// import ThisComputer from '../applications/ThisComputer';
import Henordle from '../applications/Henordle';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import Scrabble from '../applications/Scrabble';
import Photos from '../applications/Photos';
import Music from '../applications/Music';  //
import ghibliAudio from '../../assets/audio/ghibli.mp3';  // Add this line
import { IconName } from '../../assets/icons';
import MsPaint from '../applications/MsPaint';


export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

const APPLICATIONS: {
    [key in string]: {
        key: string;
        name: string;
        shortcutIcon: IconName;
        component: React.FC<ExtendedWindowAppProps<any>>;
    };
} = {
    // computer: {
    //     key: 'computer',
    //     name: 'This Computer',
    //     shortcutIcon: 'computerBig',
    //     component: ThisComputer,
    // },
    showcase: {
        key: 'showcase',
        name: 'My Showcase',
        shortcutIcon: 'showcaseIcon',
        component: ShowcaseExplorer,
    },
    mspaint: {
        key: 'mspaint',
        name: 'ms (misha) paint',
        shortcutIcon: 'mspaintIcon',
        component: MsPaint,
    },
    trail: {
        key: 'trail',
        name: 'The Oregon Trail',
        shortcutIcon: 'trailIcon',
        component: OregonTrail,
    },
    doom: {
        key: 'doom',
        name: 'Doom',
        shortcutIcon: 'doomIcon',
        component: Doom,
    },
    scrabble: {
        key: 'scrabble',
        name: 'Scrabble',
        shortcutIcon: 'scrabbleIcon',
        component: Scrabble,
    },
    henordle: {
        key: 'henordle',
        name: 'mishdle',
        shortcutIcon: 'henordleIcon',
        component: Henordle,
    },
    photos: {
        key: 'photos',
        name: 'photos',
        shortcutIcon: 'folderIcon',
        component: Photos,
    },
    music: {
        key: 'music',
        name: 'Music',
        shortcutIcon: 'folderIcon',
        component: Music,
    }
};

const Desktop: React.FC<DesktopProps> = (props) => {
    const [windows, setWindows] = useState<DesktopWindows>({});

    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);

    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);

    const [isSoundOn, setIsSoundOn] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const images = {
        volumeOn: require('../../assets/icons/volumeOn.png'),
        volumeOff: require('../../assets/icons/volumeOff.png')
    };

    useEffect(() => {
        if (shutdown === true) {
            rebootDesktop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shutdown]);

    const [audioLoaded, setAudioLoaded] = useState(false);

    useEffect(() => {
        const audio = new Audio(ghibliAudio);
        audio.addEventListener('canplaythrough', () => {
            console.log('Audio loaded and ready to play');
        });
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
        });
        audio.loop = true;
        audioRef.current = audio;
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleSound = useCallback(() => {
        console.log('Toggle sound clicked');
        console.log('Current isSoundOn:', isSoundOn);
        console.log('AudioRef exists:', !!audioRef.current);
        
        if (audioRef.current) {
            if (isSoundOn) {
                console.log('Attempting to pause');
                audioRef.current.pause();
                // Add volume check
                audioRef.current.volume = 0;
            } else {
                console.log('Attempting to play');
                // Set volume explicitly
                audioRef.current.volume = 1;
                audioRef.current.play().catch(e => {
                    console.error('Play error:', e);
                });
            }
            setIsSoundOn(!isSoundOn);
            console.log('Icon should now show:', !isSoundOn ? 'volumeOn' : 'volumeOff');
        }
    }, [isSoundOn]);

    

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [];
        Object.keys(APPLICATIONS).forEach((key) => {
            const app = APPLICATIONS[key];
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => {
                    addWindow(
                        app.key,
                        <app.component
                            onInteract={() => onWindowInteract(app.key)}
                            onMinimize={() => minimizeWindow(app.key)}
                            onClose={() => removeWindow(app.key)}
                            key={app.key}
                        />
                    );
                },
            });
        });

        newShortcuts.forEach((shortcut) => {
            if (shortcut.shortcutName === 'My Showcase') {
                shortcut.onOpen();
            }
        });

        setShortcuts(newShortcuts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rebootDesktop = useCallback(() => {
        setWindows({});
    }, []);

    const removeWindow = useCallback((key: string) => {
        // Absolute hack and a half
        setTimeout(() => {
            setWindows((prevWindows) => {
                const newWindows = { ...prevWindows };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            newWindows[key].minimized = true;
            return newWindows;
        });
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let highestZIndex = 0;
        Object.keys(windows).forEach((key) => {
            const window = windows[key];
            if (window) {
                if (window.zIndex > highestZIndex)
                    highestZIndex = window.zIndex;
            }
        });
        return highestZIndex;
    }, [windows]);

    const toggleMinimize = useCallback(
        (key: string) => {
            const newWindows = { ...windows };
            const highestIndex = getHighestZIndex();
            if (
                newWindows[key].minimized ||
                newWindows[key].zIndex === highestIndex
            ) {
                newWindows[key].minimized = !newWindows[key].minimized;
            }
            newWindows[key].zIndex = getHighestZIndex() + 1;
            setWindows(newWindows);
        },
        [windows, getHighestZIndex]
    );

    const onWindowInteract = useCallback(
        (key: string) => {
            setWindows((prevWindows) => ({
                ...prevWindows,
                [key]: {
                    ...prevWindows[key],
                    zIndex: 1 + getHighestZIndex(),
                },
            }));
        },
        [setWindows, getHighestZIndex]
    );

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns(numShutdowns + 1);
        }, 600);
    }, [numShutdowns]);

    const addWindow = useCallback(
        (key: string, element: JSX.Element) => {
            setWindows((prevState) => ({
                ...prevState,
                [key]: {
                    zIndex: getHighestZIndex() + 1,
                    minimized: false,
                    component: element,
                    name: APPLICATIONS[key].name,
                    icon: APPLICATIONS[key].shortcutIcon,
                },
            }));
        },
        [getHighestZIndex]
    );

    return !shutdown ? (
        <div style={styles.desktop}>
            {/* For each window in windows, loop over and render  */}
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`}></div>;
                return (
                    <div
                        key={`win-${key}`}
                        style={Object.assign(
                            {},
                            { zIndex: windows[key].zIndex },
                            windows[key].minimized && styles.minimized
                        )}
                    >
                        {React.cloneElement(element, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}
            <div style={styles.shortcuts}>
            {shortcuts.map((shortcut, i) => {
                return (
                    <div
                        style={Object.assign({}, styles.shortcutContainer, {
                            top: Math.floor(i / 2) * 104,
                            left: (i % 2) * 100,
                        })}
                        key={shortcut.shortcutName}
                    >
                        <DesktopShortcut
                            icon={shortcut.icon}
                            shortcutName={shortcut.shortcutName}
                            onOpen={shortcut.onOpen}
                        />
                    </div>
                    );
                })}
            </div>

            <div style={styles.soundControl} onClick={toggleSound}>
                <img
                    alt="volume control"
                    src={isSoundOn ? images.volumeOn : images.volumeOff}
                    style={{
                        imageRendering: 'pixelated',
                        userSelect: 'none',
                        pointerEvents: 'none',
                        cursor: 'pointer',
                        height: 18,
                    }}
                />
                <p style={{ fontSize: 12, fontFamily: 'MSSerif' }}>
                    {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </p>
            </div>

            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
        </div>
    ) : (
        <ShutdownSequence
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 16,
        left: 6,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
    soundControl: {
        position: 'fixed',
        bottom: 0,
        right: 4,
        flexShrink: 1,
        width: 86,
        height: 24,
        boxSizing: 'border-box',
        marginRight: 4,
        paddingLeft: 4,
        paddingRight: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#86898D #ffffff #ffffff #86898D',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        cursor: 'pointer',
        backgroundColor: Colors.lightGray,
        zIndex: 9999,
    },
};

export default Desktop;
