import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";
const token = getToken()


export const loginAPI= async(data)=>{
    const response = await axios.post(`${BASE_URL}/users/login`,data, {
        withCredentials: true,  // Make sure credentials (cookies) are sent
    });
    return response.data
}

export const registerAPI= async(data)=>{
    const response = await axios.post(`${BASE_URL}/users/reg`,data, {
        withCredentials: true,  // Make sure credentials (cookies) are sent
    });
    return response.data
}
export const editAPI= async(data)=>{ 
    const response = await axios.put(`${BASE_URL}/users/edit`,data, {headers: {
        Authorization: `Bearer ${token}`,
      },// Make sure credentials (cookies) are sent
    });
    return response.data
}
export const passwordAPI= async(data)=>{   
    console.log(data);
    
    const response = await axios.put(`${BASE_URL}/users/password`,data,  {headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
}
export const logoutAPI= async(data)=>{
    const userToken=getUserData()      
    const response = await axios.delete(`${BASE_URL}/users/logout`,data, {
        withCredentials: true,  // Make sure credentials (cookies) are sent
    });
    return response.data
}
export const viewAPI= async()=>{
    const token = getToken()
    const response = await axios.get(`${BASE_URL}/users/view`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}
export const forgotAPI=async(data)=>{
    const response=await axios.post(`${BASE_URL}/users/forgot`,data, {
    withCredentials: true, 
    })
    return response.data
    }
export const resetAPI=async(data)=>{
    const response=await axios.post(`${BASE_URL}/users/reset`,data, {
    withCredentials: true, 
    })
    return response.data
    }
    
export const uploadProfilePicAPI = async (formData) => {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/users/upload-profile-pic`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};

// export const getVendorProfile = async () => {
//     try {
//         console.log("Fetching vendor profile...",BASE_URL);
//         const headers = getAuthHeader();
//        // console.log("Using headers:", headers);

        
//         const response = await axios.get(`${BASE_URL}/users/profile`, {
//             withCredentials: true,
//             headers: headers
//         });
        
//         console.log("Vendor profile response:", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching vendor profile:", error);
//         console.error("Error response:", error.response?.data);
//         throw error;
//     }
// };
