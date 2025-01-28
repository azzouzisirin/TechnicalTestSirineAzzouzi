const Blog = require('../models/Blog');

// Get all blogs (with pagination)
const getBlogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Page and limit must be positive integers.' });
    }

    try {
        const blogs = await Blog.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();
        const count = await Blog.countDocuments();

        res.status(200).json({
            blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get blog by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new blog
const createBlog = async (req, res) => {
    try {
        const { title, content, tags, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: 'Title, content, and category are required.' });
        }

        // Vérifier la présence d'un fichier téléchargé
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const blog = new Blog({
            title,
            content,
            tags,
            category,
            image: imagePath,
        });

        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a blog
const updateBlog = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Vérifier si un fichier est téléchargé
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`; // Ajouter le chemin de l'image dans les données mises à jour
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const searchBlogs = async (req, res) => {
    const { title, tags, category, page = 1, limit = 5 } = req.query;

    const query = {};

    // Construire la requête
    if (title) {
        query.title = { $regex: title, $options: "i" }; // Recherche insensible à la casse
    }
    if (tags) {
        query.tags = { $in: tags.split(",") };
    }
    if (category) {
        query.category = category;
    }

    try {
        const blogs = await Blog.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Blog.countDocuments(query);

        res.status(200).json({
            blogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error during search:", error); // Affichez des logs détaillés dans la console
        res.status(500).json({
            message: "Error during search",
            error: error.message, // Retournez le message d'erreur
        });
    }
};

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog ,searchBlogs };
