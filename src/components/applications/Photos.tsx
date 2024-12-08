import React, { useState } from 'react';
import Window from '../os/Window';

// Import the images we know exist
import img1477 from '../../assets/pictures/IMG_1477.jpg';
import img3348 from '../../assets/pictures/IMG_3348.jpg';

interface PhotoItem {
    name: string;
    image: string;
    type: string;
    size: string;
    dateModified: string;
}

// Start with just the confirmed images
const PHOTOS: PhotoItem[] = [
    { name: 'IMG_1477.jpg', image: img1477, type: 'JPEG Image', size: '901 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3348.jpg', image: img3348, type: 'JPEG Image', size: '978 KB', dateModified: '12/06/2024' }
];

export interface WindowAppProps {
    onClose: () => void;
    onMinimize: () => void;
    onInteract: () => void;
}

export interface PhotosAppProps extends WindowAppProps {}

const Photos: React.FC<PhotosAppProps> = ({ onClose, onMinimize, onInteract }) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % PHOTOS.length);
    };

    const previousImage = () => {
        setSelectedIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
    };

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
            closeWindow={onClose}
            onInteract={onInteract}
            minimizeWindow={onMinimize}
        >
            <div style={styles.container} tabIndex={0} onKeyDown={handleKeyDown}>
                <div style={styles.fileListContainer}>
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
                                <div style={styles.fileDetails}>
                                    {photo.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.imageViewer}>
                    <div style={styles.imageContainer}>
                        <img
                            src={PHOTOS[selectedIndex].image}
                            alt={PHOTOS[selectedIndex].name}
                            style={styles.previewImage}
                        />
                    </div>
                    <div style={styles.navigationBar}>
                        <button 
                            style={styles.navButton} 
                            onClick={previousImage}
                        >
                            ◄
                        </button>
                        <button 
                            style={styles.navButton} 
                            onClick={nextImage}
                        >
                            ►
                        </button>
                    </div>
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
    fileListContainer: {
        width: '200px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #808080',
        display: 'flex',
        flexDirection: 'column',
    },
    fileList: {
        flex: 1,
        overflow: 'auto',
    },
    fileItem: {
        padding: '4px 8px',
        cursor: 'default',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        height: '24px',
        lineHeight: '24px',
    },
    fileDetails: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    imageViewer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: '8px',
    },
    imageContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    navigationBar: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px',
        backgroundColor: '#c0c0c0',
        marginTop: '8px',
    },
    navButton: {
        backgroundColor: '#c0c0c0',
        border: '2px outset #ffffff',
        cursor: 'pointer',
        padding: '4px 8px',
        fontSize: '12px',
        minWidth: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
    },
};

export default Photos;