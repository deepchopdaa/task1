import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Container, Button, Alert } from 'react-bootstrap';

const Register = () => {
    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Minimum 6 characters').required('Password is required')
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await axios.post('https://task-backend-gilt-psi.vercel.app/auth/register', values);
            alert('User registered successfully');
            resetForm();
        } catch (error) {
            alert('Error registering user');
            console.log(error);
        }
    };

    return (
        <Container className="my-4">
            <h2>Register</h2>
            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <div className="mb-3">
                        <label>Name</label>
                        <Field type="text" name="name" className="form-control" />
                        <ErrorMessage name="name" component={Alert} variant="danger" />
                    </div>

                    <div className="mb-3">
                        <label>Email</label>
                        <Field type="email" name="email" className="form-control" />
                        <ErrorMessage name="email" component={Alert} variant="danger" />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <Field type="password" name="password" className="form-control" />
                        <ErrorMessage name="password" component={Alert} variant="danger" />
                    </div>

                    <Button type="submit" variant="primary">Register</Button>
                </Form>
            </Formik>
        </Container>
    );
};

export default Register;
