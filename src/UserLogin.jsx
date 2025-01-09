import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';
import { useJwt } from './UserStore';


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
            const response = await axios.post(import.meta.env.VITE_API_URL + '/api/users/login', values);
            console.log('Login successful:', response.data);
            console.log('JWT Token:', response.data.token); // Log the token specifically

            setJwt(response.data.token); // Store the JWT
            actions.setSubmitting(false);
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