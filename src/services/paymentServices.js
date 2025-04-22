import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

// Create new payment record
export const createPaymentAPI = async (data) => {
    const token = getToken();
    console.log(data);
    
        const response = await axios.post(`${BASE_URL}/payment/process`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return response.data;
};

// Get all payments for a user
export const getPaymentsAPI = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    try {
        const response = await axios.get(`${BASE_URL}/payment/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
    }
};

// Get payment by ID
export const getPaymentByIdAPI = async (id) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    try {
        const response = await axios.get(`${BASE_URL}/payment/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Payment not found");
        }
        console.error("Error fetching payment:", error);
        throw error;
    }
};

// Update payment status
export const updatePaymentStatusAPI = async (id, status) => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    try {
        const response = await axios.put(`${BASE_URL}/api/payment/${id}`, 
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Payment not found");
        }
        console.error("Error updating payment status:", error);
        throw error;
    }
};

// Process payment using Stripe
export const processPaymentAPI = async (id, currency = "usd") => {
    const token = getToken();
    if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
    }

    try {
        const response = await axios.post(`${BASE_URL}/api/payment/process`,
            { id, currency },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Payment not found");
        }
        console.error("Error processing payment:", error);
        throw error;
    }
};

