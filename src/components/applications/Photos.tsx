import React from 'react';
import Window from '../os/Window';
import { PHOTOS, PhotoItem } from './photoData';

export interface PhotosAppProps extends WindowAppProps {}

const Photos: React.FC<PhotosAppProps> = (props) => {
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
                        <div style={styles.headerCell}>Name</div>
                        <div style={styles.headerCell}>Type</div>
                        <div style={styles.headerCell}>Size</div>
                        <div style={styles.headerCell}>Modified</div>
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
                            >
                                <div style={styles.fileCell}>
                                <img 
                                    src={photo.path} 
                                    alt="" 
                                    style={styles.thumbnail}
                                />
                                    {photo.name}
                                </div>
                                <div style={styles.fileCell}>{photo.type}</div>
                                <div style={styles.fileCell}>{photo.size}</div>
                                <div style={styles.fileCell}>{photo.dateModified}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={styles.statusBar}>
                    16 object(s)
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
    content: {
        flex: 1,
        backgroundColor: '#ffffff',
        overflow: 'auto',
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
        flex: 1,
        borderRight: '1px solid #808080',
    },
    fileList: {
        display: 'flex',
        flexDirection: 'column',
    },
    fileRow: {
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'default',
    },
    fileCell: {
        padding: '4px 8px',
        fontSize: '12px',
        flex: 1,
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
};

export default Photos;