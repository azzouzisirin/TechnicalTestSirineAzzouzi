import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Hook to dispatch actions

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/auth/login", formData);
            const { token } = response.data;

            // Dispatch the login action
            dispatch(login(token));

            // Optionally store the token in localStorage or sessionStorage
            localStorage.setItem("token", token);

            // Show a success notification
            toast.success("Logged in successfully!");

            // Navigate to the homepage
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Failed to log in. Check your credentials.");

            // Show an error notification
            toast.error("Failed to log in. Please try again.");
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Login</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-field">
                    <label className="label">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                </div>
                <div className="form-field">
                    <label className="label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="button">
                    Login
                </button>
            </form>
            <p className="text-link">
                Don't have an account? <a href="/register" className="link">Register</a>
            </p>
        </div>
    );
};

export default LoginPage;
