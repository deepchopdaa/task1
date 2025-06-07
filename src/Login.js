import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Container, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // 👈 Make sure to create this file

const Login = () => {
    const validationSchema = yup.object({
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().required('Password is required')
    });

    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const res = await axios.post('https://task-backend-gilt-psi.vercel.app/auth/login', values);
            const token = res.data;

            if (res.status === 400) {
                navigate("/register");
            }

            if (token) {
                localStorage.setItem("token", token.token);
                resetForm();
                alert('Login successful');
                navigate("/blog");
            }
        } catch (error) {
            alert(error.response?.data || 'Login failed');
            console.error(error);
            navigate("/register");
        }
    };

    return (
        <div className="login-bg">
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <Row className="w-100">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card className="p-4 shadow-lg login-card">
                            <Card.Body>
                                <h2 className="text-center mb-4">Login to Blog</h2>

                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    <Form>
                                        <div className="mb-3">
                                            <label>Email</label>
                                            <Field type="email" name="email" className="form-control" />
                                            <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                                        </div>

                                        <div className="mb-3">
                                            <label>Password</label>
                                            <Field type="password" name="password" className="form-control" />
                                            <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                                        </div>

                                        <Button type="submit" variant="primary" className="w-100 mt-2">
                                            Login
                                        </Button>
                                    </Form>
                                </Formik>

                                <p className="mt-3 text-center">
                                    Don't have an account? <Link to="/register">Register here</Link>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
