import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk pour récupérer les blogs
export const fetchBlogsAsync = createAsyncThunk(
    "blogs/fetchBlogs",
    async (page, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/blogs?page=${page}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const blogSlice = createSlice({
    name: "blogs",
    initialState: {
        blogs: [],
        totalPages: 1,
        loading: false,
        error: null,
    },
    reducers: {
        // Ajoutez le reducer `deleteBlog`
        deleteBlog: (state, action) => {
            state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload.blogs;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchBlogsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Exportez les actions et le reducer
export const { deleteBlog } = blogSlice.actions;
export default blogSlice.reducer;
