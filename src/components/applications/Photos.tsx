import React from 'react';
import Window from '../os/Window';
import IMG4893 from '../../assets/pictures/IMG_4893.png';
import P1010037 from '../../assets/pictures/P1010037.jpg';
import IMG5203 from '../../assets/pictures/IMG_5203.jpg';
import IMG4960 from '../../assets/pictures/IMG_4960.jpg';
import IMG4792 from '../../assets/pictures/IMG_4792.jpg';
import IMG2211 from '../../assets/pictures/IMG_2211.jpeg';
import IMG4508 from '../../assets/pictures/IMG_4508.jpg';
import IMG2757 from '../../assets/pictures/IMG_2757.jpg';
import IMG3194 from '../../assets/pictures/IMG_3194.jpg';
import IMG0077 from '../../assets/pictures/IMG_0077.jpg';
import IMG0106 from '../../assets/pictures/IMG_0106.jpg';
import IMG3348 from '../../assets/pictures/IMG_3348.jpg';
import IMG0602 from '../../assets/pictures/IMG_0602.jpg';
import IMG3527 from '../../assets/pictures/IMG_3527.jpg';
import IMG3878 from '../../assets/pictures/IMG_3878.jpg';
import IMG1477 from '../../assets/pictures/IMG_1477.jpg';

export interface PhotosAppProps extends WindowAppProps {}

interface PhotoItem {
    name: string;
    src: string;
    type: string;
    size: string;
    dateModified: string;
}


const PHOTOS: PhotoItem[] = [
    { name: 'IMG_4893.png', src: IMG4893, type: 'PNG Image', size: '1.2 MB', dateModified: '12/06/2024' },
    { name: 'P1010037.jpg', src: P1010037, type: 'JPEG Image', size: '856 KB', dateModified: '12/06/2024' },
    { name: 'IMG_5203.jpg', src: IMG5203, type: 'JPEG Image', size: '945 KB', dateModified: '12/06/2024' },
    { name: 'IMG_4960.jpg', src: IMG4960, type: 'JPEG Image', size: '768 KB', dateModified: '12/06/2024' },
    { name: 'IMG_4792.jpg', src: IMG4792, type: 'JPEG Image', size: '892 KB', dateModified: '12/06/2024' },
    { name: 'IMG_2211.jpeg', src: IMG2211, type: 'JPEG Image', size: '1.1 MB', dateModified: '12/06/2024' },
    { name: 'IMG_4508.jpg', src: IMG4508, type: 'JPEG Image', size: '934 KB', dateModified: '12/06/2024' },
    { name: 'IMG_2757.jpg', src: IMG2757, type: 'JPEG Image', size: '825 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3194.jpg', src: IMG3194, type: 'JPEG Image', size: '967 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0077.jpg', src: IMG0077, type: 'JPEG Image', size: '912 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0106.jpg', src: IMG0106, type: 'JPEG Image', size: '843 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3348.jpg', src: IMG3348, type: 'JPEG Image', size: '978 KB', dateModified: '12/06/2024' },
    { name: 'IMG_0602.jpg', src: IMG0602, type: 'JPEG Image', size: '890 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3527.jpg', src: IMG3527, type: 'JPEG Image', size: '923 KB', dateModified: '12/06/2024' },
    { name: 'IMG_3878.jpg', src: IMG3878, type: 'JPEG Image', size: '857 KB', dateModified: '12/06/2024' }, 
    { name: 'IMG_1477.jpg', src: IMG1477, type: 'JPEG Image', size: '901 KB', dateModified: '12/06/2024' }
 ];



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
                            {PHOTOS.map((photo) => (
                                <div key={photo.name} style={styles.fileRow}>
                                    <div style={styles.fileCell}>
                                        <img 
                                            src={photo.src} 
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
            '&:hover': {
                backgroundColor: '#000080',
                color: '#ffffff',
            },
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