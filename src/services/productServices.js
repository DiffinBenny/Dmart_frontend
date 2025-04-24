import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";

// Set withCredentials globally
axios.defaults.withCredentials = true;

// Add Product
export const productaddAPI = async (formData) => {
  const token = getToken(); // Get fresh token
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }
  try {
    const response = await axios.post(`${BASE_URL}/products/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"  
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Delete Product
export const productdeleteAPI = async (id) => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.delete(`${BASE_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// View Products
export const productviewAPI = async () => {
  const token = getToken(); // Get fresh token
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/products/view`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const stockviewAPI = async () => {
  const token = getToken(); // Get fresh token
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

    const response = await axios.get(`${BASE_URL}/stock/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
 
};

export const productviewallAPI = async () => {
  const token = getToken(); // Get fresh token
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/products/viewall`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get Product by ID
export const getProductByIdAPI = async (productId) => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Product not found");
    }
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    console.error("Error fetching product:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching product details");
  }
};

// Search Products
export const productsearchAPI = async (query) => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/products/search`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Edit P
export const producteditAPI = async (data) => {
  const token = getToken();
    const response = await axios.put(`${BASE_URL}/products/edit`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    return response.data;
  
};