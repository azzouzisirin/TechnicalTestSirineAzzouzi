import { useSelector } from "react-redux";

export const getToken = () => {
    return localStorage.getItem("token");
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const useAuthToken = () => {
    const token = useSelector((state) => state.auth.token);
    return token;
};
 
