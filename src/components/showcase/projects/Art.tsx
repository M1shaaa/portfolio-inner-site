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
            // Try different feed URLs
            const feedUrls = [
                'https://mishaaaa.substack.com/feed',
                'https://substack.com/@mishaaaa/feed',
                'https://mishaaaa.substack.com/feed.xml'
            ];

            for (const feedUrl of feedUrls) {
                try {
                    console.log('Trying feed URL:', feedUrl);
                    const response = await fetch(
                        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Feed response:', data);
                        
                        if (data.items && data.items.length > 0) {
                            setPosts(data.items.map((item: any) => ({
                                title: item.title,
                                link: item.link,
                                pubDate: new Date(item.pubDate).toLocaleDateString()
                            })));
                            setLoading(false);
                            return; // Exit if we successfully get posts
                        }
                    }
                } catch (error) {
                    console.error(`Error with ${feedUrl}:`, error);
                }
            }

            // If we get here, none of the URLs worked
            setError('Unable to load posts at the moment');
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
                <p>
                    Find my latest thoughts and explorations on my Substack:
                </p>
                <br />
                <a 
                    href="https://substack.com/@mishaaaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-lg hover:text-blue-600"
                >
                    → Read my latest posts
                </a>
                <br />
                {loading && <p className="text-sm text-gray-500 mt-4">Checking for recent posts...</p>}
                {error && <p className="text-sm text-gray-500 mt-4">{error}</p>}
                {posts.length > 0 && (
                    <div className="mt-6">
                        <h2>Recent Posts:</h2>
                        {posts.map((post, index) => (
                            <div key={index} className="mb-4">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtProjects;