import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState({});
    const [commentTexts, setCommentTexts] = useState({});
    const [comments, setComments] = useState({});
    const navigate = useNavigate("/")
    const token = localStorage.getItem('token');

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('https://task-backend-gilt-psi.vercel.app/blog/getuserblog');
            const blogData = res.data;

            // Initialize per-blog likes/comments state
            const likesData = {};
            const commentsData = {};
            const commentTextData = {};

            blogData.forEach(blog => {
                likesData[blog._id] = blog.likes?.length || 0;
                commentsData[blog._id] = blog.comments || [];
                commentTextData[blog._id] = "";
            });
            setBlogs(blogData);
            setLikes(likesData);
            setComments(commentsData);
            setCommentTexts(commentTextData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            alert(error.response.data)
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleLike = async (id) => {
        try {
            const res = await axios.post(`https://task-backend-gilt-psi.vercel.app/blog/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLikes(prev => ({ ...prev, [id]: res.data.likes }));
        } catch (error) {
            console.error('Like error:', error);
            alert(error.response.data)
        }
    };

    const handleComment = async (id) => {
        const text = commentTexts[id];
        if (!text.trim()) return;
        try {
            const res = await axios.post(`https://task-backend-gilt-psi.vercel.app/blog/${id}/comment`, {
                Comment: text
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(() => {
                console.log("Add New comment")
            }).catch((error) => {
                alert(error.response.data)
                console.log("Blog Comment Error !")
            });
            alert("comment Add Successfully")
            setComments(prev => ({ ...prev, [id]: res.data }));
            setCommentTexts(prev => ({ ...prev, [id]: "" }));
        } catch (error) {
            console.error('Comment error:', error);
        }
    };

    const handleShare = (id) => {
        navigator.clipboard.writeText(`${window.location.href}/${id}`);
        alert('Share link copied!');
    };

    const handleInputChange = (id, value) => {
        setCommentTexts(prev => ({ ...prev, [id]: value }));
    };

    return (
        <Container className="py-4">
            <h2 className="text-center mb-4">All Blogs</h2>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row>
                    {blogs.map((blog) => (
                        <Col md={6} lg={4} key={blog._id} className="mb-4">
                            <Card >
                                {blog.mediatype?.startsWith("image") ? (
                                    <Card.Img variant="top" height="300px" src={blog.media} alt="blog media" onClick={() => navigate(`/blog/${blog._id}`)} />
                                ) : blog.mediatype?.startsWith("video") ? (
                                    <video height="300px" controls onClick={() => navigate(`/blog/${blog._id}`)}>
                                        <source src={blog.media} type={blog.mediatype} />
                                        Your browser does not support video
                                    </video>
                                ) : (
                                    <a href={blog.media} target="_blank" rel="noopener noreferrer">View Media</a>
                                )}
                                <Card.Body onClick={() => navigate(`/blog/${blog._id}`)}>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text>
                                        {blog.description?.slice(0, 100)}...
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Button variant="outline-primary" onClick={() => handleLike(blog._id)}>
                                            👍 {likes[blog._id]}
                                        </Button>
                                        <Button variant="outline-success" onClick={() => handleComment(blog?._id)}>
                                            💬 Comment
                                        </Button>
                                        <Button variant="outline-secondary" onClick={() => handleShare(blog?._id)}>
                                            🔗 Share
                                        </Button>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Write a comment..."
                                        value={commentTexts[blog._id] || ''}
                                        onChange={(e) => handleInputChange(blog._id, e.target.value)}
                                    />
                                    {/* <ul className="list-group">
                                        {comments[blog._id]?.map((c, idx) => (
                                            <li key={idx} className="list-group-item">
                                                {c.text}
                                            </li>
                                        ))}
                                    </ul> */}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Blog;
