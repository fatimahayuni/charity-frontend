import React from 'react';
import { Formik, Field, Form } from 'formik';
import { CountryDropdown } from 'react-country-region-selector';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation } from 'wouter'
import { useFlashMessage } from './FlashMessageStore';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    salutation: Yup.string().required('Salutation is required'),
    country: Yup.string().required('Country is required'),
});


function RegisterPage() {
    const { showMessage } = useFlashMessage();
    const [_, setLocation] = useLocation();

    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        salutation: '',
        marketingPreferences: [],
        country: 'Malaysia', // Default value
    };

    const handleSubmit = async (values, formikHelpers) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, values);
            console.log('Registration successful', response.data);
            showMessage('Registration successful!', 'success');
            setLocation('/');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            showMessage('Registration failed. Please try again.', 'error');
        } finally {
            formikHelpers.setSubmitting(false);
        }
    }

    return (
        <div className="container mt-5">
            <h1>Register</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ values, setFieldValue, errors, touched }) => (
                    <Form>
                        {/* Name */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <Field type="text" className="form-control" id="name" name="name" />
                            {errors.name && touched.name ? (
                                <div className="text-danger">{errors.name}</div>
                            ) : null}

                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field type="email" className="form-control" id="email" name="email" />
                            {errors.email && touched.email ? (
                                <div className="text-danger">{errors.email}</div>
                            ) : null}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Field type="password" className="form-control" id="password" name="password" />
                            {errors.password && touched.password ? (
                                <div className="text-danger">{errors.password}</div>
                            ) : null}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <Field type="password" className="form-control" id="confirmPassword" name="confirmPassword" />
                            {errors.password && touched.password ? (
                                <div className="text-danger">{errors.password}</div>
                            ) : null}
                        </div>

                        {/* Salutation */}
                        <div className="mb-3">
                            <label className="form-label">Salutation</label>
                            <div>
                                {['Mr', 'Ms', 'Mrs', 'Dr', 'Dato', 'Datin', 'Tan Sri'].map((title) => (
                                    <div key={title} className="form-check form-check-inline">
                                        <Field
                                            className="form-check-input"
                                            type="radio"
                                            name="salutation"
                                            value={title}
                                            id={title.toLowerCase()}
                                        />
                                        <label className="form-check-label" htmlFor={title.toLowerCase()}>{title}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Marketing Preferences */}
                        <div className="mb-3">
                            <label className="form-label">Marketing Preferences</label>
                            {['Email', 'SMS', 'Whatsapp'].map((preference) => (
                                <div key={preference} className="form-check">
                                    <Field
                                        className="form-check-input"
                                        type="checkbox"
                                        name="marketingPreferences"
                                        value={preference}
                                        id={preference.toLowerCase()}
                                    />
                                    <label className="form-check-label" htmlFor={preference.toLowerCase()}>
                                        {preference}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Country Dropdown */}
                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <CountryDropdown
                                className="form-select"
                                value={values.country}
                                onChange={(val) => setFieldValue('country', val)}
                                id="country"
                                name="country"
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary">Register</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default RegisterPage;
