import {createSlice} from '@reduxjs/toolkit'
import { decodedData, getToken } from '../utils/storageHandler'


export const userSlice= createSlice({
  name:"userSlice",
  initialState:{
      name:decodedData()?.name || null,
      id:decodedData()?.id || null,
      role:decodedData()?.role || null,
      email:decodedData()?.email || null,
      isLogin:getToken() ? true : false
  },
  reducers:{
      loginUserAction:((state,action)=>{
         state.name = action.payload.name
         state.email = action.payload.email
         state.id = action.payload.id
         state.role = action.payload.role
         state.isLogin = true
      }),
      registerUserAction:((state,action)=>{

        state.name = action.payload.name
        state.email = action.payload.email
        state.id = action.payload.id
        state.role = action.payload.role
        state.isLogin = true
        
      }),
      logoutAction: (state, action) => {
        state.name = null
        state.email = null
        state.id = null
        state.role = null
        state.isLogin = false
      }
  }
})

export default userSlice.reducer

export const {loginUserAction,registerUserAction,logoutAction} =  userSlice.actions
