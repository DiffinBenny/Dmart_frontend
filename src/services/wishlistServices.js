import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

export const wishlistdeleteAPI = async(productId) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.delete(`${BASE_URL}/wishlist/delete`, {
        data: { id: productId },
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return response.data;
}

export const wishlistviewAPI = async() => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.get(`${BASE_URL}/wishlist/view`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return response.data;
}

export const wishlistsaveAPI = async(productId) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.post(`${BASE_URL}/wishlist/save`, 
        { id: productId },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }
    );
    return response.data;
}
