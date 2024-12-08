import React, { useState } from 'react';
import Window from '../os/Window';

// Import all images with correct extensions
import img0077 from '../../assets/pictures/IMG_0077.jpg';
import img0106 from '../../assets/pictures/IMG_0106.jpg';
import img0602 from '../../assets/pictures/IMG_0602.jpg';
import img1477 from '../../assets/pictures/IMG_1477.jpg';
import img2211 from '../../assets/pictures/IMG_2211.jpeg';
import img2757 from '../../assets/pictures/IMG_2757.jpg';
import img3194 from '../../assets/pictures/IMG_3194.jpeg';
import img3348 from '../../assets/pictures/IMG_3348.jpg';
import img3527 from '../../assets/pictures/IMG_3527.jpg';
import img3878 from '../../assets/pictures/IMG_3878.jpg';
import img4508 from '../../assets/pictures/IMG_4508.jpg';
import img4792 from '../../assets/pictures/IMG_4792.jpg';
import img4893 from '../../assets/pictures/IMG_4893.png';
import img4960 from '../../assets/pictures/IMG_4960.jpg';
import img5203 from '../../assets/pictures/IMG_5203.jpg';
import img1010037 from '../../assets/pictures/P1010037.jpg';

interface PhotoItem {
    name: string;
    image: string;
    type: string;
    size: string;
    dateModified: string;
}

const PHOTOS: PhotoItem[] = [
    { name: 'IMG_0077.jpg', image: img0077, type: 'JPEG Image', size: '912 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0106.jpg', image: img0106, type: 'JPEG Image', size: '843 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0602.jpg', image: img0602, type: 'JPEG Image', size: '890 KB', dateModified: '12/06/2024' },
    { name: 'IMG_1477.jpg', image: img1477, type: 'JPEG Image', size: '901 KB', dateModified: '12/06/2024' },
    { name: 'IMG_2211.jpeg', image: img2211, type: 'JPEG Image', size: '1.1 MB', dateModified: '12/06/2024' },
    { name: 'IMG_2757.jpg', image: img2757, type: 'JPEG Image', size: '825 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3194.jpeg', image: img3194, type: 'JPEG Image', size: '967 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3348.jpg', image: img3348, type: 'JPEG Image', size: '978 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3527.jpg', image: img3527, type: 'JPEG Image', size: '923 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3878.jpg', image: img3878, type: 'JPEG Image', size: '857 KB', dateModified: '12/06/2024' },
    { name: 'IMG_4508.jpg', image: img4508, type: 'JPEG Image', size: '934 KB', dateModified: '12/06/2024' },
    { name: 'IMG_4792.jpg', image: img4792, type: 'JPEG Image', size: '892 KB', dateModified: '12/06/2024' },
    { name: 'IMG_4893.png', image: img4893, type: 'PNG Image', size: '1.2 MB', dateModified: '12/06/2024' },
    { name: 'IMG_4960.jpg', image: img4960, type: 'JPEG Image', size: '768 KB', dateModified: '12/06/2024' },
    { name: 'IMG_5203.jpg', image: img5203, type: 'JPEG Image', size: '945 KB', dateModified: '12/06/2024' },
    { name: 'P1010037.jpg', image: img1010037, type: 'JPEG Image', size: '856 KB', dateModified: '12/06/2024' }
];

export interface WindowAppProps {
    onClose: () => void;
    onMinimize: () => void;
    onInteract: () => void;
}

export interface PhotosAppProps extends WindowAppProps {}

const Photos: React.FC<PhotosAppProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % PHOTOS.length);
    };

    const previousImage = () => {
        setSelectedIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
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
            <div style={styles.container}>
                <div style={styles.menuBar}>
                    <div style={styles.menuItem}>File</div>
                    <div style={styles.menuItem}>Edit</div>
                    <div style={styles.menuItem}>View</div>
                    <div style={styles.menuItem}>Help</div>
                </div>
                <div style={styles.main}>
                    {/* Left side - File list */}
                    <div style={styles.fileList}>
                        <div style={styles.fileListInner}>
                            {PHOTOS.map((photo, index) => (
                                <div 
                                    key={photo.name}
                                    style={{
                                        ...styles.fileRow,
                                        backgroundColor: index === selectedIndex ? '#000080' : 'transparent',
                                        color: index === selectedIndex ? '#ffffff' : '#000000',
                                    }}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    {photo.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Image viewer */}
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
                <div style={styles.statusBar}>
                    {PHOTOS.length} object(s)
                </div>
            </div>
        </Window>
    );
};

const styles = {
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
        fontSize: '12px',
    },
    main: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
    },
    fileList: {
        width: '200px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #808080',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    fileListInner: {
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column', // This ensures vertical stacking
    },
    fileRow: {
        padding: '2px 4px',
        cursor: 'default',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        userSelect: 'none',
        minHeight: '20px',
        alignItems: 'center',
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
    statusBar: {
        padding: '2px 4px',
        borderTop: '1px solid #808080',
        fontSize: '12px',
    },
} as const;

export default Photos;