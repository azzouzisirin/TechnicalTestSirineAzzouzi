require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "http://localhost:3000", // Origine autorisée
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
    credentials: true, // Permettre l'envoi de cookies si nécessaire
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();
app.use('/blogs', blogRoutes);
app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
