import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const fetchBlogs = async (page = 1, limit = 5) => {
    const response = await axios.get(`${API_BASE_URL}/blogs?page=${page}&limit=${limit}`);
    return response.data;
};
