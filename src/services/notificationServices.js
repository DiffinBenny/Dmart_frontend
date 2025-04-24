import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

export const getNotificationsAPI = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/notify/viewall`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};

export const markNotificationsAsReadAPI = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.delete(`${BASE_URL}/notify/read`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};

export const deleteAllNotificationsAPI = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.delete(`${BASE_URL}/notify/deleteall`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};

export const deleteReadNotificationsAPI = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.delete(`${BASE_URL}/notify/deleteread`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};