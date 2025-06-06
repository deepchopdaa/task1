import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Spinner, Form, ListGroup, Row, Col } from 'react-bootstrap';

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
            console.log(res.data)
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
            alert("Comments Add sucessfully")
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
            <Card className="shadow-lg">
                {blog.mediatype?.startsWith("image") ? (
                    <Card.Img variant="top" height="600px" src={`https://task-backend-gilt-psi.vercel.app/${blog.media}`} />
                ) : blog.mediatype?.startsWith("video") ? (
                    <video className="w-100" height="600" controls>
                        <source src={`https://task-backend-gilt-psi.vercel.app/${blog.media}`} type={blog.mediatype} />
                        Your browser does not support the video tag.
                    </video>
                ) : null}

                <Card.Body>
                    <Card.Title className="text-center fs-2 fw-bold mb-3">{blog.title}</Card.Title>
                    <Card.Text className="fs-5">{blog.description}</Card.Text>

                    <Row className="my-3">
                        <Col xs="auto">
                            <Button variant="outline-primary" onClick={handleLike}>
                                👍 {likesCount} Likes
                            </Button>
                        </Col>
                    </Row>

                    <Form className="my-4">
                        <Form.Group controlId="commentInput">
                            <Form.Control
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </Form.Group>
                        <Button className="mt-2" variant="success" onClick={handleComment}>
                            Submit Comment
                        </Button>
                    </Form>

                    <h5 className="mt-4">Comments:</h5>
                    {comments.length > 0 ? (
                        <ListGroup variant="flush">
                            {comments?.map((comment, index) => (
                                <ListGroup.Item key={index}>
                                    user name :  <strong>{comment.user?.name}:</strong>  Comment :  <strong>{comment.Comment}</strong>   Time:   <strong>{comment.createAt}</strong>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="text-muted">No comments yet.</p>
                    )}
                </Card.Body>
            </Card>
        </Container >
    );
};

export default BlogDetails;
