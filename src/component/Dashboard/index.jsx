import React, { useEffect, useState } from "react";
import "./index.css";
import DOMPurify from 'dompurify';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://www.reddit.com/r/reactjs.json")
            .then((response) => response.json())
            .then((data) => {
                setPosts(data.data.children);
                console.log(data.data)
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    if (loading) {
        return <div className="loading">Waiting...</div>;
    }

    const cleanHtmlContent = (html) => {
        if (!html) return "<p>No content available</p>"; // Fallback

        // Remove unwanted tags or wrappers
        const processedHtml = html
            .replace(/<!--.*?-->/g, "") // Remove HTML comments
            .replace(/<div class="md">/g, "") // Remove the opening <div class="md">
            .replace(/<\/div>/g, ""); // Remove the closing </div>

        return DOMPurify.sanitize(processedHtml); // Sanitize cleaned HTML
    };

    return (
        <div className="app">
            <h1>Reddit ReactJS Posts</h1>
            <div className="cards-container">
                {posts.map(({ data: post }) => (
                    <div className="card" key={post.id} data-aos="fade-up">
                        <h2>{post.title}</h2>
                        {/* <div
              className="selftext"
              dangerouslySetInnerHTML={{ __html: post.selftext_html }}
            ></div> */}
                        <div className="selftext">
                            {post.selftext_html ? (
                                <div>
                                    {DOMPurify.sanitize(
                                        new DOMParser()
                                            .parseFromString(post.selftext_html, "text/html")
                                            .body.textContent || "No content available"
                                    )}
                                </div>
                            ) : (
                                <p>No content available</p>
                            )}
                        </div>

                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                            Read more
                        </a>
                        <p>Score: {post.score}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
