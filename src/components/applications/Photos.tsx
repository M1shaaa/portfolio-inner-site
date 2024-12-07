import React, { useState } from 'react';
import Window from '../os/Window';
import { PHOTOS, PhotoItem } from './photoData';

export interface PhotosAppProps extends WindowAppProps {}

const ImageViewer: React.FC<{
    photo: PhotoItem;
    onClose: () => void;
}> = ({ photo, onClose }) => {
    return (
        <Window
            top={80}
            left={220}
            width={500}
            height={400}
            windowBarIcon="folderIcon"
            windowTitle={photo.name}
            closeWindow={onClose}
            onInteract={() => {}}
            minimizeWindow={() => {}}
        >
            <div style={styles.imageViewerContainer}>
                <img 
                    src={photo.path} 
                    alt={photo.name}
                    style={styles.fullImage}
                />
            </div>
        </Window>
    );
};

const Photos: React.FC<PhotosAppProps> = (props) => {
    const [selectedImage, setSelectedImage] = useState<PhotoItem | null>(null);

    return (
        <Window
            top={60}
            left={200}
            width={600}
            height={400}
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
                <div style={styles.content}>
                    <div style={styles.headerRow}>
                        <div style={{...styles.headerCell, width: '40%'}}>Name</div>
                        <div style={{...styles.headerCell, width: '20%'}}>Type</div>
                        <div style={{...styles.headerCell, width: '20%'}}>Size</div>
                        <div style={{...styles.headerCell, width: '20%'}}>Modified</div>
                    </div>
                    <div style={styles.fileList}>
                        {PHOTOS.map((photo: PhotoItem) => (
                            <div 
                                key={photo.name} 
                                style={styles.fileRow}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#000080';
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '';
                                    e.currentTarget.style.color = '';
                                }}
                                onDoubleClick={() => setSelectedImage(photo)}
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
                <div style={styles.statusBar}>
                    16 object(s)
                </div>
            </div>
            {selectedImage && (
                <ImageViewer 
                    photo={selectedImage} 
                    onClose={() => setSelectedImage(null)}
                />
            )}
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
    content: {
        flex: 1,
        backgroundColor: '#ffffff',
        overflow: 'auto',
        width: '100%',
    },
    headerRow: {
        display: 'flex',
        borderBottom: '1px solid #808080',
        backgroundColor: '#c0c0c0',
        position: 'sticky',
        top: 0,
        width: '100%',
    },
    headerCell: {
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
        borderRight: '1px solid #808080',
    },
    fileList: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    fileRow: {
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'default',
        width: '100%',
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
    statusBar: {
        padding: '2px 4px',
        borderTop: '1px solid #808080',
        fontSize: '12px',
    },
    imageViewerContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
    },
    fullImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
};

export default Photos;