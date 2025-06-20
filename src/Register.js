import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // ✅ Reuse login styles for consistent look

const Register = () => {
    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Minimum 6 characters').required('Password is required')
    });

    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await axios.post('https://task-backend-gilt-psi.vercel.app/auth/register', values);
            alert('User registered successfully');
            resetForm();
            navigate("/");
        } catch (error) {
            alert(error.response?.data || 'Error registering user');
            console.error(error);
        }
    };

    return (
        <div className="login-bg">
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <Row className="w-100">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card className="p-4 shadow-lg login-card">
                            <Card.Body>
                                <h2 className="text-center mb-4">Create Your Account</h2>

                                <Formik
                                    initialValues={{ name: '', email: '', password: '' }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    <Form>
                                        <div className="mb-3">
                                            <label>Name</label>
                                            <Field type="text" name="name" className="form-control" />
                                            <ErrorMessage name="name" component="div" className="text-danger small mt-1" />
                                        </div>

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
                                            Register
                                        </Button>
                                    </Form>
                                </Formik>

                                <p className="mt-3 text-center">
                                    Already have an account? <Link to="/">Login here</Link>
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
