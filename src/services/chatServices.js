import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

export const getChatHistoryAPI = async (receiverId) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/chat/history`, {
        params: { receiverId },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const sendMessageAPI = async (messageData) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    if (!messageData || !messageData.receiverId || !messageData.message) {
        throw new Error("Receiver ID and message content are required");
    }

    const response = await axios.post(`${BASE_URL}/chat/send`, messageData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    return response.data;
};

export const getCustomersAPI = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/chat/customers`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteMessageAPI = async (messageId) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication token is required');
        }
        if (!messageId) {
            throw new Error('Message ID is required');
        }

        const response = await axios.delete(`${BASE_URL}/chat/message`, {
            data: { id: messageId },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Delete message error:', error.response?.data || error.message);
        throw error;
    }
};

export const clearChatHistoryAPI = async (receiverId) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.delete(`${BASE_URL}/chat/clear`, {
        data: { receiverId },
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};