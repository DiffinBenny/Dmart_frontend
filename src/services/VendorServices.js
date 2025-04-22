import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

// Helper function to get auth header
const getAuthHeader = () => {
    const token = getToken()
    if (!token) {
        throw new Error('No authentication token found');
    }
    return {
        Authorization: `Bearer ${token}`
    };
};

export const vendordeleteAPI = async(data) => {
    const token = getToken()
    try {
        const response = await axios.delete(`${BASE_URL}/vendor/delete/${data}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        return response.data;
    } catch (error) {
        console.error("Error in vendordeleteAPI:", error);
        throw error;
    }
};

export const vendororderAPI = async() => {
    const token = getToken()
    try {
        const response = await axios.get(`${BASE_URL}/vendor/orders`, {
            withCredentials: true,
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error in vendororderAPI:", error);
        throw error;
    }
};

export const vendorsearchAPI = async() => {
    const token = getToken()
    try {
        const response = await axios.get(`${BASE_URL}/vendor/search`, {
            withCredentials: true,
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error in vendorsearchAPI:", error);
        throw error;
    }
};

export const vendorsaveAPI = async(data) => {
    const token = getToken()
    try {
        const response = await axios.put(`${BASE_URL}/vendor/save`, data, {
            withCredentials: true,
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error in vendorsaveAPI:", error);
        throw error;
    }
};

export const getVendorProfileAPI = async () => {
    const token = getToken()
    try {
        console.log("Fetching vendor profile...",BASE_URL);
        const headers = getAuthHeader();
       // console.log("Using headers:", headers);

        
        const response = await axios.get(`${BASE_URL}/vendor/profile`, {
            withCredentials: true,
            headers: headers
        });
        
        console.log("Vendor profile response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching vendor profile:", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
};

export const uploadProfilePicAPI = async (formData) => {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/vendor/upload-profile-pic`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
    });
    return response.data;
};
