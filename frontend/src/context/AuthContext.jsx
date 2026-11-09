import {createContext,useContext,useEffect,useState} from 'react';
import {api} from '../services/api';
const Context=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(null),[loading,setLoading]=useState(true);useEffect(()=>{api('/auth/me').then(({user})=>setUser(user)).catch(()=>{}).finally(()=>setLoading(false))},[]);const login=async(email,password)=>{const result=await api('/auth/login',{method:'POST',body:JSON.stringify({email,password})});setUser(result.user)};const register=async(name,email,password)=>{const result=await api('/auth/register',{method:'POST',body:JSON.stringify({name,email,password})});setUser(result.user)};const logout=async()=>{await api('/auth/logout',{method:'POST'});setUser(null)};return <Context.Provider value={{user,loading,login,register,logout}}>{children}</Context.Provider>}
export const useAuth=()=>useContext(Context);
