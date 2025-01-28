import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogFormPage = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: "",
        category: "IT",
        image: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/blogs/${id}`);
                    const { title, content, tags, category, image } = response.data;

                    setFormData({
                        title,
                        content,
                        tags: tags.join(","),
                        category,
                        image: null,
                    });
                    setPreviewImage(`http://localhost:5000${image}`);
                } catch (error) {
                    console.error("Error fetching blog details:", error);
                    toast.error("Failed to fetch blog details.");
                }
            };
            fetchBlog();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error("Title and Content are required.");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("tags", formData.tags);
        data.append("category", formData.category);
        if (formData.image) data.append("image", formData.image);

        try {
            const token = getToken();
            if (!token) {
                toast.error("You must be logged in to perform this action.");
                navigate("/login");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (id) {
                await axios.put(`http://localhost:5000/blogs/${id}`, data, { headers });
                toast.success("Blog updated successfully.");
            } else {
                await axios.post(`http://localhost:5000/blogs`, data, { headers });
                toast.success("Blog created successfully.");
            }

            navigate("/");
        } catch (error) {
            console.error("Error submitting form:", error.response?.data || error.message);
            toast.error(`Failed to save blog: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">{id ? "Edit Blog" : "Create Blog"}</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-field">
                    <label className="label">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                </div>
                <div className="form-field">
                    <label className="label">Content:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        className="textarea"
                    />
                </div>
                <div className="form-field">
                    <label className="label">Tags (comma-separated):</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="input"
                    />
                </div>
                <div className="form-field">
                    <label className="label">Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="select"
                    >
                        <option value="IT">IT</option>
                        <option value="Scientific">Scientific</option>
                    </select>
                </div>
                <div className="form-field">
                    <label className="label">Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="preview-image"
                        />
                    )}
                </div>
                <button type="submit" className="button">
                    {id ? "Update Blog" : "Create Blog"}
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default BlogFormPage;
