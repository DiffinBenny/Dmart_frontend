import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

const token=getToken()
export const cartaddAPI= async(data)=>{
    const token = getToken(); // Get fresh token
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.post(`${BASE_URL}/cart/add`,data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
    return response.data
}

export const cartgetAPI= async()=>{
    const token = getToken(); // Get fresh token
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.get(`${BASE_URL}/cart/get`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data
}

export const cartdeleteAPI= async(data)=>{
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication token is required');
        }
        if (!data || !data.id) {
            throw new Error('Product ID is required');
        }

        console.log('Deleting product with ID:', data.id);
        
        const response = await axios.post(
            `${BASE_URL}/cart/del`, 
            { id: data.id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Cart delete error:', error.response?.data || error.message);
        throw error;
    }
}

export const cartclrAPI= async()=>{
    const token = getToken(); // Get fresh token
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.delete(`${BASE_URL}/cart/clr`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data
}
