import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container, Card, Button, Spinner, Form, ListGroup, Row, Col, Image
} from 'react-bootstrap';
import moment from 'moment'; // optional for pretty timestamps

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [likesCount, setLikesCount] = useState(0);
    const [comments, setComments] = useState([]);
    const token = localStorage.getItem("token");

    const fetchBlog = async () => {
        try {
            const res = await axios.get(`https://task-backend-gilt-psi.vercel.app/blog/getsingnle/${id}`);
            setBlog(res.data);
            setLikesCount(res.data.likes?.length || 0);
            setComments(res.data.Comments || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch blog:', error);
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const res = await axios.post(`https://task-backend-gilt-psi.vercel.app/blog/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLikesCount(res.data.likes);
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
            const res = await axios.post(`https://task-backend-gilt-psi.vercel.app/blog/${id}/comment`, {
                Comment: commentText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(res.data);
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!blog) {
        return (
            <Container className="text-center py-5">
                <p>Blog not found.</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                {blog.mediatype?.startsWith("image") ? (
                    <Image src={blog.media} alt={blog.title} fluid style={{ height: "500px", objectFit: "cover" }} />
                ) : blog.mediatype?.startsWith("video") ? (
                    <video className="w-100" height="500" controls>
                        <source src={blog.media} type={blog.mediatype} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="p-3 text-center text-muted">No media available</div>
                )}

                <Card.Body className="p-5">
                    <h1 className="fw-bold mb-3">{blog.title}</h1>
                    <p className="text-secondary mb-4">{moment(blog.createdAt).format('MMMM Do YYYY, h:mm A')}</p>

                    <Card.Text className="fs-5 lh-lg">
                        {blog.description}
                    </Card.Text>

                    <Row className="mt-4 mb-3 align-items-center">
                        <Col xs="auto">
                            <Button variant="outline-primary" onClick={handleLike}>
                                👍 Like ({likesCount})
                            </Button>
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    <h4 className="mb-3">Leave a Comment</h4>
                    <Form>
                        <Form.Group controlId="commentInput">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </Form.Group>
                        <Button className="mt-2" variant="success" onClick={handleComment}>
                            Submit Comment
                        </Button>
                    </Form>

                    <hr className="my-4" />

                    <h4 className="mb-3">Comments</h4>
                    {comments.length > 0 ? (
                        <ListGroup variant="flush">
                            {comments.map((comment, index) => (
                                <ListGroup.Item key={index} className="py-3 px-2 border-bottom">
                                    <div className="fw-semibold">@{comment.user?.name || "User"}</div>
                                    <div>{comment.Comment}</div>
                                    <small className="text-muted">{moment(comment.createdAt).fromNow()}</small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-muted">No comments yet. Be the first to comment!</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BlogDetails;
