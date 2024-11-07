import React, { useState, useEffect } from 'react';

interface Post {
    title: string;
    link: string;
    pubDate: string;
}

const ArtProjects: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Let's try your direct Substack URL
                const response = await fetch(
                    'https://api.rss2json.com/v1/api.json?rss_url=https://mishaaaa.substack.com/feed'
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('RSS Feed Response:', data); // For debugging
                
                if (data.items && data.items.length > 0) {
                    setPosts(data.items.map((item: any) => ({
                        title: item.title,
                        link: item.link,
                        pubDate: new Date(item.pubDate).toLocaleDateString()
                    })));
                } else {
                    setError('No posts found');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to fetch posts');
            } finally {
                setLoading(false);
            }
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
                ) : error ? (
                    <div>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <p className="mb-4">In the meantime, you can find my writing directly on Substack:</p>
                        <a 
                            href="https://substack.com/@mishaaaa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono hover:text-blue-600"
                        >
                            → Visit my Substack
                        </a>
                    </div>
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