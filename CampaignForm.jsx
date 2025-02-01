import React from 'react';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import axios from 'axios';
import "./index.css";
import '@uploadcare/react-uploader/core.css';


// Validation Schema using Yup
const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    target_amount: Yup.number()
        .required("Target amount is required")
        .positive("Target amount must be a positive number")
        .typeError("Target amount must be a number"),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().when("start_date", (start_date, schema) => {
        return start_date && schema.min(start_date, "End date must be after start date");
    }),
    campaign_status: Yup.string().required("Campaign status is required"),
    urgency_level: Yup.string().required("Urgency level is required"),
});

const CampaignForm = () => {
    const initialValues = {
        title: "",
        description: "",
        image_url: [],
        target_amount: "",
        current_amount: 0.0,
        start_date: new Date(),
        end_date: null,
        campaign_status: "active",
        urgency_level: "low",
    };

    const handleSubmit = async (values) => {
        const payload = {
            title: values.title,
            description: values.description,
            image_url: values.image_url, // Array of CDN URLs from Uploadcare
            target_amount: values.target_amount,
            current_amount: values.current_amount,
            start_date: values.start_date,
            end_date: values.end_date,
            campaign_status: values.campaign_status,
            urgency_level: values.urgency_level,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/campaigns', payload);
            console.log("Form data successfully sent:", response.data);
        } catch (error) {
            console.error("Error submitting form data:", error);
        }

    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange, handleBlur, errors, touched, setFieldValue, handleSubmit }) => (
                <Form className="custom-form" onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-3xl font-semibold text-gray-900">Campaign</h2>
                            <p className="mt-1 text-md text-gray-600">
                                This information will be displayed publicly so be careful what you share.
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                {/* Title */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="title" className="block text-xl font-medium text-gray-900">
                                        Title
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">

                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                placeholder="Education for All"
                                                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {touched.title && errors.title ? (
                                                <div className="text-red-500 text-sm">{errors.title}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-span-full">
                                    <label htmlFor="description" className="block text-xl font-medium text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched.description && errors.description ? (
                                            <div className="text-red-500 text-sm">{errors.description}</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Photos */}
                                <div className="col-span-full">
                                    <label htmlFor="photo" className="block text-xl font-medium text-gray-900">
                                        Photos
                                    </label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            <div>
                                                <FileUploaderRegular
                                                    sourceList="local, url, camera, dropbox"
                                                    classNameUploader="uc-light"
                                                    pubkey="e3f026e661d9ddff8e61"
                                                    onChange={(fileGroup) => {
                                                        // Extract CDN URLs from the uploaded files
                                                        const fileUrls = fileGroup.successEntries.map((entry) => {
                                                            return entry.cdnUrl; // Get the CDN URL of each file
                                                        });


                                                        // Update Formik's image_url field with the CDN URLs
                                                        setFieldValue("image_url", fileUrls);

                                                    }}

                                                />
                                            </div>
                                            {/* <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" /> */}
                                            <div className="mt-4 flex text-sm/6 text-gray-600">
                                                <p className="pl-1">Upload a file or drag and drop</p>
                                            </div>
                                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Campaign Target */}
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-3xl font-semibold text-gray-900">Campaign Target</h2>
                            <p className="mt-1 text-md text-gray-600">In USD only. Currency conversion will happen on the browser.</p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                {/* Target Amount */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="target_amount" className="block text-xl font-medium text-gray-900">
                                        Target amount
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="target_amount"
                                            name="target_amount"
                                            type="text"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                            value={values.target_amount}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched.target_amount && errors.target_amount ? (
                                            <div className="text-red-500 text-sm">{errors.target_amount}</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Current Amount */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="current-amount" className="block text-xl font-medium text-gray-900">
                                        Current amount (if any)
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="current-amount"
                                            name="current-amount"
                                            type="text"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="start-date" className="block text-xl font-medium text-gray-900">
                                        Start date
                                    </label>
                                    <div className="mt-2">
                                        <DatePicker
                                            selected={values.start_date}
                                            onChange={(date) => setFieldValue("start_date", date)}
                                            maxDate={new Date()}
                                            dateFormat="dd/MM/yyyy"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                        {touched.start_date && errors.start_date ? (
                                            <div className="text-red-500 text-sm">{errors.start_date}</div>
                                        ) : null}

                                    </div>
                                </div>

                                {/* End Date */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="end-date" className="block text-xl font-medium text-gray-900">
                                        End date
                                    </label>
                                    <div className="mt-2">
                                        <DatePicker
                                            selected={values.end_date}
                                            onChange={(date) => setFieldValue("end_date", date)}
                                            minDate={values.start_date}
                                            dateFormat="dd/MM/yyyy"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                        {touched.end_date && errors.end_date ? (
                                            <div className="text-red-500 text-sm">{errors.end_date}</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Campaign Status */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="campaign_status" className="block text-xl font-medium text-gray-900">
                                        Campaign Status
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="campaign_status"
                                            name="campaign_status"
                                            value={values.campaign_status}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"

                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                        {touched.campaign_status && errors.campaign_status ? (
                                            <div className="text-red-500 text-sm">{errors.campaign_status}</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Urgency Level */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="urgency_level" className="block text-xl font-medium text-gray-900">
                                        Urgency level
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="urgency_level"
                                            name="urgency_level"
                                            value={values.urgency_level}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"

                                        >
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end py-6">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-xl font-semibold text-white hover:bg-indigo-700 focus:outline-none"

                        >
                            Create
                        </button>
                    </div>
                </Form>
            )}
        </Formik>

    )

};

export default CampaignForm;




