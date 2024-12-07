import React from 'react';
import Window from '../os/Window';

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
            <div className="site-page">
                {/* Add your photo gallery content here */}
                <div style={styles.photoGrid}>
                    {/* You can map through your photos here */}
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    photoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '16px',
        padding: '16px',
    },
};

export default Photos;