import React, { useState } from 'react';
import Window from '../os/Window';
import { PHOTOS, PhotoItem } from './photoData';

export interface PhotosAppProps extends WindowAppProps {}

const Photos: React.FC<PhotosAppProps> = (props) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % PHOTOS.length);
    };

    const previousImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
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
                <div style={styles.toolBar}>
                    <div style={styles.addressBar}>
                        Address: C:\My Pictures
                    </div>
                </div>
                <div style={styles.mainContent}>
                    <div style={styles.fileListContainer}>
                        <div style={styles.headerRow}>
                            <div style={{...styles.headerCell, width: '40%'}}>Name</div>
                            <div style={{...styles.headerCell, width: '20%'}}>Type</div>
                            <div style={{...styles.headerCell, width: '20%'}}>Size</div>
                            <div style={{...styles.headerCell, width: '20%'}}>Modified</div>
                        </div>
                        <div style={styles.fileList}>
                            {PHOTOS.map((photo: PhotoItem, index: number) => (
                                <div 
                                    key={photo.name} 
                                    style={{
                                        ...styles.fileRow,
                                        backgroundColor: index === selectedImageIndex ? '#000080' : '',
                                        color: index === selectedImageIndex ? '#ffffff' : ''
                                    }}
                                    onClick={() => setSelectedImageIndex(index)}
                                    onMouseEnter={(e) => {
                                        if (index !== selectedImageIndex) {
                                            e.currentTarget.style.backgroundColor = '#000080';
                                            e.currentTarget.style.color = '#ffffff';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (index !== selectedImageIndex) {
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.color = '';
                                        }
                                    }}
                                >
                                    <div style={{...styles.fileCell, width: '40%'}}>
                                        <img 
                                            src={photo.path} 
                                            alt="" 
                                            style={styles.thumbnail}
                                        />
                                        {photo.name}
                                    </div>
                                    <div style={{...styles.fileCell, width: '20%'}}>{photo.type}</div>
                                    <div style={{...styles.fileCell, width: '20%'}}>{photo.size}</div>
                                    <div style={{...styles.fileCell, width: '20%'}}>{photo.dateModified}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={styles.previewContainer}>
                        <button 
                            style={styles.navButton} 
                            onClick={previousImage}
                        >
                            ◄
                        </button>
                        <div style={styles.imageContainer}>
                            <img 
                                src={PHOTOS[selectedImageIndex].path} 
                                alt={PHOTOS[selectedImageIndex].name}
                                style={styles.previewImage}
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
                <div style={styles.statusBar}>
                    {PHOTOS.length} object(s)
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
    toolBar: {
        padding: '4px',
        borderBottom: '1px solid #808080',
    },
    addressBar: {
        backgroundColor: '#ffffff',
        border: '1px inset #808080',
        padding: '2px 4px',
        fontSize: '12px',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
    },
    fileListContainer: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #808080',
    },
    headerRow: {
        display: 'flex',
        borderBottom: '1px solid #808080',
        backgroundColor: '#c0c0c0',
        position: 'sticky',
        top: 0,
    },
    headerCell: {
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
        borderRight: '1px solid #808080',
    },
    fileList: {
        flex: 1,
        backgroundColor: '#ffffff',
        overflow: 'auto',
    },
    fileRow: {
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'default',
    },
    fileCell: {
        padding: '4px 8px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    thumbnail: {
        width: '16px',
        height: '16px',
        marginRight: '4px',
        objectFit: 'cover',
    },
    previewContainer: {
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
        overflow: 'hidden',
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    navButton: {
        backgroundColor: '#c0c0c0',
        border: '2px outset #ffffff',
        cursor: 'pointer',
        padding: '4px 8px',
        margin: '0 8px',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
    },
    statusBar: {
        padding: '2px 4px',
        borderTop: '1px solid #808080',
        fontSize: '12px',
    },
};

export default Photos;