import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';
import { useJwt } from './UserStore';
import Cookies from 'js-cookie';



function UserLogin() {
    const { setJwt } = useJwt();
    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();

    const initialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required')
    });

    const handleSubmit = async (values, actions) => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + '/api/users/login', values,
                { withCredentials: true } // to send cookies (JWT) with the request
            );
            console.log("user details in UserLogin.jsx: ", response.data)

            // Set cookie with secure attributes
            Cookies.set('jwt', response.data.token, {
                expires: 7, // Store JWT for 7 days
                secure: true, // Only send over HTTPS (remove if testing on localhost without HTTPS)
                sameSite: 'Lax' // Adjust this if your frontend and backend are on different domains
            });
            console.log("JWT stored in cookies:", Cookies.get('jwt'));

            // Store the JWT in cookies
            setJwt(response.data.token);
            // actions.setSubmitting(false);
            showMessage('Login successful!', 'success');
            setLocation('/');
        } catch (error) {
            console.error('Login error:', error);
            actions.setErrors({ submit: error.response.data.message });
            actions.setSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {function (formik) {
                    return (
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field type="email" id="email" name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <Field type="password" id="password" name="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>

                            {formik.errors.submit && <div className="alert alert-danger">{formik.errors.submit}</div>}

                            <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default UserLogin;