import React, { useState, useEffect } from 'react';

interface Post {
    title: string;
    link: string;
    pubDate: string;
}

const ArtProjects: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Using a proxy service to avoid CORS issues
                const response = await fetch(
                    'https://api.rss2json.com/v1/api.json?rss_url=https://mishaaaa.substack.com/feed'
                );
                const data = await response.json();
                if (data.items) {
                    setPosts(data.items.map((item: any) => ({
                        title: item.title,
                        link: item.link,
                        pubDate: new Date(item.pubDate).toLocaleDateString()
                    })));
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    return (
        <div className="site-page-content">
            <h1>My Musings</h1>
            <h3>the liminal space between thought and ether</h3>
            <br />
            <div className="text-block">
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div>
                        {posts.map((post, index) => (
                            <div key={index} className="mb-6">
                                <a 
                                    href={post.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono hover:text-blue-600"
                                >
                                    → {post.title}
                                </a>
                                <div className="text-sm text-gray-500 mt-1 ml-4">
                                    {post.pubDate}
                                </div>
                            </div>
                        ))}
                        <br />
                        <a 
                            href="https://substack.com/@mishaaaa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm hover:text-blue-600"
                        >
                            Read more on Substack →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtProjects;