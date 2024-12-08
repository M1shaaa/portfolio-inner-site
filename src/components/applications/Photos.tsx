import React, { useState } from 'react';
import Window from '../os/Window';
import { PHOTOS, PhotoItem } from './photoData';

export interface PhotosAppProps extends WindowAppProps {}

const Photos: React.FC<PhotosAppProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % PHOTOS.length);
    };

    const previousImage = () => {
        setSelectedIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            previousImage();
        }
    };

    return (
        <Window
            top={60}
            left={200}
            width={800}
            height={500}
            windowBarIcon="folderIcon"
            windowTitle="Photos"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
        >
            <div 
                style={styles.container} 
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* File List */}
                <div style={styles.fileList}>
                    {PHOTOS.map((photo, index) => (
                        <div
                            key={photo.name}
                            style={{
                                ...styles.fileItem,
                                backgroundColor: index === selectedIndex ? '#000080' : 'transparent',
                                color: index === selectedIndex ? '#ffffff' : '#000000'
                            }}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <img 
                                src={photo.path} 
                                alt="" 
                                style={styles.thumbnail}
                            />
                            <span style={styles.fileName}>{photo.name}</span>
                        </div>
                    ))}
                </div>

                {/* Photo Viewer */}
                <div style={styles.photoViewer}>
                    <button 
                        style={styles.navButton} 
                        onClick={previousImage}
                    >
                        ◄
                    </button>
                    
                    <div style={styles.imageContainer}>
                        <img
                            src={PHOTOS[selectedIndex].path}
                            alt={PHOTOS[selectedIndex].name}
                            style={styles.image}
                        />
                    </div>

                    <button 
                        style={styles.navButton} 
                        onClick={nextImage}
                    >
                        ►
                    </button>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: {
        display: 'flex',
        height: '100%',
        backgroundColor: '#c0c0c0',
        outline: 'none',
    },
    fileList: {
        width: '200px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #808080',
        overflow: 'auto',
        padding: '4px',
    },
    fileItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        cursor: 'default',
        fontSize: '12px',
        marginBottom: '2px',
    },
    thumbnail: {
        width: '16px',
        height: '16px',
        marginRight: '8px',
        objectFit: 'cover',
    },
    fileName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    photoViewer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '16px',
    },
    imageContainer: {
        flex: 1,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 16px',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    navButton: {
        backgroundColor: '#c0c0c0',
        border: '2px outset #ffffff',
        cursor: 'pointer',
        padding: '4px 8px',
        fontSize: '16px',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default Photos;