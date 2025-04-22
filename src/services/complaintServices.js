import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

export const fileComplaintAPI = async (data) => {
    const token = getToken(); // Get fresh token
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    if (!data.subject || !data.description) {
        throw new Error("Subject and description are required");
    }

    const response = await axios.post(`${BASE_URL}/complaint/add`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

export const getAllComplaintsAPI = async () => {
    const token = getToken(); // Get fresh token
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.get(`${BASE_URL}/complaint/viewall`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const getUserComplaintsAPI = async () => {
    const token = getToken(); // Get fresh token
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }
    
    const response = await axios.get(`${BASE_URL}/complaints/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const updateComplaintStatusAPI = async (data) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication token is required');
        }
        if (!data || !data.id) {
            throw new Error('Complaint ID is required');
        }

        console.log('Updating complaint with ID:', data.id);
        
        const response = await axios.put(
            `${BASE_URL}/complaints/${data.id}`, 
            {
                status: data.status,
                response: data.response
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Complaint update error:', error.response?.data || error.message);
        throw error;
    }
}

export const deleteComplaintAPI = async (data) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication token is required');
        }
        if (!data || !data.id) {
            throw new Error('Complaint ID is required');
        }

        console.log('Deleting complaint with ID:', data.id);
        
        const response = await axios.delete(
            `${BASE_URL}/complaints/${data.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Complaint delete error:', error.response?.data || error.message);
        throw error;
    }
}