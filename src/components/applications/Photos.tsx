import React, { useState } from 'react';
import Window from '../os/Window';

// Make sure the path to the images is correct relative to where this component is located
interface PhotoItem {
    name: string;
    path: string;
    type: string;
    size: string;
    dateModified: string;
}

const PHOTOS: PhotoItem[] = [
    { name: 'IMG_4893.png', path: '/photos/IMG_4893.png', type: 'PNG Image', size: '1.2 MB', dateModified: '12/06/2024' },
    { name: 'P1010037.jpg', path: '/photos/P1010037.jpg', type: 'JPEG Image', size: '856 KB', dateModified: '12/06/2024' },
    { name: 'IMG_5203.jpg', path: '/photos/IMG_5203.jpg', type: 'JPEG Image', size: '945 KB', dateModified: '12/06/2024' },
    { name: 'IMG_4960.jpg', path: '/photos/IMG_4960.jpg', type: 'JPEG Image', size: '768 KB', dateModified: '12/06/2024' },
    { name: 'IMG_4792.jpg', path: '/photos/IMG_4792.jpg', type: 'JPEG Image', size: '892 KB', dateModified: '12/06/2024' },
    { name: 'IMG_2211.jpeg', path: '/photos/IMG_2211.jpeg', type: 'JPEG Image', size: '1.1 MB', dateModified: '12/06/2024' },
    { name: 'IMG_4508.jpg', path: '/photos/IMG_4508.jpg', type: 'JPEG Image', size: '934 KB', dateModified: '12/06/2024' },
    { name: 'IMG_2757.jpg', path: '/photos/IMG_2757.jpg', type: 'JPEG Image', size: '825 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3194.jpg', path: '/photos/IMG_3194.jpg', type: 'JPEG Image', size: '967 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0077.jpg', path: '/photos/IMG_0077.jpg', type: 'JPEG Image', size: '912 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0106.jpg', path: '/photos/IMG_0106.jpg', type: 'JPEG Image', size: '843 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3348.jpg', path: '/photos/IMG_3348.jpg', type: 'JPEG Image', size: '978 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0602.jpg', path: '/photos/IMG_0602.jpg', type: 'JPEG Image', size: '890 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3527.jpg', path: '/photos/IMG_3527.jpg', type: 'JPEG Image', size: '923 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3878.jpg', path: '/photos/IMG_3878.jpg', type: 'JPEG Image', size: '857 KB', dateModified: '12/06/2024' },
    { name: 'IMG_1477.jpg', path: '/photos/IMG_1477.jpg', type: 'JPEG Image', size: '901 KB', dateModified: '12/06/2024' }
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
                {/* File List */}
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

                {/* Photo Viewer */}
                <div style={styles.imageViewer}>
                    <div style={styles.imageContainer}>
                        <img
                            src={PHOTOS[selectedIndex].path}
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