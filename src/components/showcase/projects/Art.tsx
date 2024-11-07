import React from 'react';

const ArtProjects: React.FC = () => {
    return (
        <div className="site-page-content">
            <h1>My Musings</h1>
            <h3>the liminal space between thought and ether</h3>
            <br />
            <div style={{ width: '100%' }}>
                <iframe
                    src="https://mishaaaa.substack.com/embed"
                    width="100%"
                    height="500"
                    style={{ border: '1px solid #EEE', background: 'white' }}
                    frameBorder="0"
                    scrolling="no"
                ></iframe>
            </div>
        </div>
    );
};

export default ArtProjects;