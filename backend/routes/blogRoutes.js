const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog,searchBlogs  } = require('../controllers/blogController');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', getBlogs);
router.get("/search", searchBlogs);

router.get('/:id', getBlogById);

router.post('/', authMiddleware, upload.single('image'), createBlog);
router.put('/:id', authMiddleware, upload.single('image'), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);
module.exports = router;
