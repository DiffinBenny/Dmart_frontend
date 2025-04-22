
import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken} from "../utils/storageHandler";
const token = getToken()

export const adminvendorAPI= async(data)=>{
    const response = await axios.put(`${BASE_URL}/admin/vendor`,data, {
        headers:{
            Authorization: `Bearer ${token}`
        }
        // withCredentials: true,  // Make sure credentials (cookies) are sent
    });
    return response.data
}

export const adminviewallAPI= async()=>{
    const response = await axios.get(`${BASE_URL}/admin/viewall`, {
        headers:{
            Authorization: `Bearer ${token}`
        }  // Make sure credentials (cookies) are sent
    });
    return response.data
}

export const adminusersAPI= async()=>{
    const response = await axios.get(`${BASE_URL}/admin/users`, {
        headers:{
            Authorization: `Bearer ${token}`
        }  // Make sure credentials (cookies) are sent
    });
    return response.data
}
