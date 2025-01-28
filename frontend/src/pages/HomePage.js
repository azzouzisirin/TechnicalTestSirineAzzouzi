import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {  deleteBlog } from "../store/slices/blogSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {  totalPages, loading, error } = useSelector((state) => state.blogs);

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Gestion de connexion
    const [filteredBlogs, setFilteredBlogs] = useState([]);

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/blogs?page=${page}`);
                const data = response.data;
                setFilteredBlogs(data.blogs); // Assuming the API returns { blogs: [], totalPages: n }
            } catch (err) {
                console.error("Erreur lors du chargement des blogs :", err);
                toast.error("Impossible de charger les blogs.");
            }
        };

        fetchBlogs();
    }, [page]);

    // Vérification de la connexion dès le chargement
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        navigate("/login"); // Redirige vers la page de connexion
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Supprime le token
        setIsLoggedIn(false); // Met à jour l'état
        toast.success("Déconnexion réussie !");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce blog ?")) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Vous n'êtes pas autorisé !");
                    return;
                }

                await axios.delete(`http://localhost:5000/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                dispatch(deleteBlog(id));
                toast.success("Blog supprimé avec succès.");
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
                toast.error("Impossible de supprimer le blog.");
            }
        }
    };

    // Filter blogs based on search query and selected category
    const displayedBlogs = filteredBlogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div>Chargement des blogs...</div>;
    if (error) return <div>Erreur : {error}</div>;

    return (
        <div className="page-container">
            <div className="header">
                <h1 className="page-title">Blogs</h1>
                {isLoggedIn ? (
                    <button className="button logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button className="button login-button" onClick={handleLogin}>
                        Login
                    </button>
                )}
            </div>

            {isLoggedIn && (
                <Link to="/blogs/new" className="link">
                    Create New Blog
                </Link>
            )}

            <input
                type="text"
                placeholder="Rechercher par titre"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
            />

            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select"
            >
                <option value="">Toutes les catégories</option>
                <option value="IT">IT</option>
                <option value="Scientific">Scientific</option>
            </select>

            {displayedBlogs.map((blog) => (
                <div key={blog._id} className="blog-item">
                    <h2 className="blog-title">{blog.title}</h2>
                    <p className="blog-category">Catégorie : {blog.category}</p>
                    <p className="blog-content">{blog.content.substring(0, 100)}...</p>
                    <img
                        src={blog.image ? `http://localhost:5000${blog.image}` : "placeholder-image.jpg"}
                        alt={blog.title}
                        className="blog-image"
                    />
                    <div className="blog-actions">
                        <button
                            onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                            className="button edit-button"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => handleDelete(blog._id)}
                            className="button delete-button"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            ))}

            <div className="pagination">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="button"
                >
                    Précédent
                </button>
                <span>
                    Page {page} sur {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="button"
                >
                    Suivant
                </button>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default HomePage;
