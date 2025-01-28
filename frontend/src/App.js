import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogFormPage from "./pages/BlogFormPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            {/* ToastContainer for notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blogs/new" element={<BlogFormPage />} />
                <Route path="/blogs/edit/:id" element={<BlogFormPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
}

 

export default App;
