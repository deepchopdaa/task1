import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Blog.css'; // 👈 Custom CSS

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState({});
    const [commentTexts, setCommentTexts] = useState({});
    const [comments, setComments] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const Logout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('https://task-backend-gilt-psi.vercel.app/blog/getuserblog');
            const blogData = res.data;

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
            alert(error.response?.data || "Failed to load blogs");
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
            });
            setLikes(prev => ({ ...prev, [id]: res.data.likes }));
        } catch (error) {
            console.error('Like error:', error);
            alert(error.response?.data || "Failed to like post");
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
            });

            alert("Comment added successfully");
            setComments(prev => ({ ...prev, [id]: res.data }));
            setCommentTexts(prev => ({ ...prev, [id]: "" }));
        } catch (error) {
            console.error('Comment error:', error);
            alert(error.response?.data || "Failed to add comment");
        }
    };

    const handleShare = (id) => {
        navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
        alert('Share link copied!');
    };

    const handleInputChange = (id, value) => {
        setCommentTexts(prev => ({ ...prev, [id]: value }));
    };

    return (
        <Container className="py-5 blog-container">
            <h2 className="text-center mb-4 blog-title">Explore Blogs</h2>
            <div className="position-absolute top-0 end-0 m-3">
                <Button variant="primary" onClick={Logout}>Logout</Button>
            </div>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row>
                    {blogs.map(blog => (
                        <Col md={6} lg={4} key={blog._id} className="mb-4">
                            <Card className="blog-card shadow-sm">
                                {blog.mediatype?.startsWith("image") ? (
                                    <Card.Img
                                        variant="top"
                                        src={blog.media}
                                        className="blog-img"
                                        alt="blog media"
                                        onClick={() => navigate(`/blog/${blog._id}`)}
                                    />
                                ) : blog.mediatype?.startsWith("video") ? (
                                    <video className="blog-video" controls>
                                        <source src={blog.media} type={blog.mediatype} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <a href={blog.media} target="_blank" rel="noopener noreferrer">View Media</a>
                                )}

                                <Card.Body onClick={() => navigate(`/blog/${blog._id}`)}>
                                    <Card.Title className="fw-bold">{blog.title}</Card.Title>
                                    <Card.Text>{blog.description?.slice(0, 100)}...</Card.Text>
                                </Card.Body>

                                <Card.Footer className="bg-white border-0">
                                    <div className="d-flex justify-content-between mb-3">
                                        <Button size="sm" variant="outline-primary" onClick={() => handleLike(blog._id)}>👍 {likes[blog._id]}</Button>
                                        <Button size="sm" variant="outline-success" onClick={() => handleComment(blog._id)}>💬 Comment</Button>
                                        <Button size="sm" variant="outline-secondary" onClick={() => handleShare(blog._id)}>🔗 Share</Button>
                                    </div>
                                    <Form.Control
                                        type="text"
                                        className="mb-2"
                                        placeholder="Write a comment..."
                                        value={commentTexts[blog._id] || ''}
                                        onChange={(e) => handleInputChange(blog._id, e.target.value)}
                                    />
                                    <div className="comment-list">
                                        {comments[blog._id]?.slice(-2).map((c, idx) => (
                                            <div key={idx} className="comment-item text-muted small">• {c.text}</div>
                                        ))}
                                    </div>
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
