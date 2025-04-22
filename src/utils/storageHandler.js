import {jwtDecode} from 'jwt-decode'

export const getToken = ()=>{
    return sessionStorage.getItem("userToken") ? sessionStorage.getItem("userToken") :null
}

export const decodedData = ()=>{
    return getToken() ? jwtDecode(getToken()) : null
}

export const removeToken = () => {
    sessionStorage.removeItem("userToken");
}