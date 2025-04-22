
import axios from "axios";
import { BASE_URL } from "../utils/url";
import { getToken } from "../utils/storageHandler";
const token=getToken()

export const reviewaddAPI= async(data)=>{
    const response = await axios.post(`${BASE_URL}/review/add`,data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data
}

export const reviewgetAPI= async(data)=>{
    const response = await axios.get(`${BASE_URL}/review/get/${data}`,  {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data
}
