import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post(
                "http://localhost:5000/auth/signup",
                formData,
                config
            );

            if (response.status === 201) {
                const { token } = response.data;

                // Dispatch login action to store the token
                dispatch(login(token));

                // Save token to local storage
                localStorage.setItem("authToken", token);

                // Redirect to home or dashboard
                navigate("/");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(
                error.response?.data?.message || "Failed to register. Please try again."
            );
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Register</h1>
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
                    Register
                </button>
            </form>
            <p className="text-link">
                Already have an account?{" "}
                <a href="/login" className="link">
                    Log in
                </a>
            </p>
        </div>
    );
};

export default RegisterPage;
