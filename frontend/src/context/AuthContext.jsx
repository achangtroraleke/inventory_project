import { createContext, useEffect, useCallback } from "react";
import {jwtDecode} from 'jwt-decode'
import useLocalStorageState from "../hooks/useLocalStorage";
import { axiosAuth, axiosPublic } from "../utils/axiosAuth";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) =>{
 
    const [authToken, setToken] = useLocalStorageState('authToken', null);
    const [refreshToken, setRefreshToken] = useLocalStorageState('refreshToken', null);
    const [user, setUser] = useLocalStorageState('user',null)
    const headers = {'Content-Type':'application/json'}
 
    const registerUser = async (formData) =>{


        try {
          const res = await axiosPublic.post('/register/', formData);
          console.log(res)
          if(res.status === 201){
            setToken(res.data.access);
            setUser(jwtDecode(res.data.access))
            setRefreshToken(res.data.refresh);
            
            return res
         
          }
      
            
        } catch (err) {
          console.error('Registration failed:', err);
          throw err;
        }
    }

    const loginUser = async (formData) => {
        console.log(formData)
        try {
          const res = await axiosAuth().post('/token/', formData);
          setToken(res.data.access);
          setUser(jwtDecode(res.data.access))
          setRefreshToken(res.data.refresh);
       
        console.log(res)
          res.status = 201
          return(res)
        } catch (err) {
          console.error('Login failed:', err);
          throw err;
        }
      };

    const logoutUser = ()=>{
        
        setToken(null);
        setRefreshToken(null); // Clear refresh token
        setUser(null); // Clear user info
        localStorage.clear()
        window.location.reload()
    }

    const updateToken = useCallback(async () => {
        if (!refreshToken) {
            console.log('No refresh token found. Logging out.');
            logoutUser();
            return;
        }

        try {
            const res = await axiosPublic.post('/token/refresh/', {
                refresh: refreshToken
            });

            if (res.status === 200) {
                // Successfully received new tokens
                setToken(res.data.access);
                setUser(jwtDecode(res.data.access));
                // Optional: Update refresh token if it's new (simple-jwt usually keeps it the same)
                if (res.data.refresh) {
                    setRefreshToken(res.data.refresh);
                }
                console.log('Tokens successfully refreshed.');
                return true;
            }
        } catch (error) {
            // Refresh failed (e.g., refresh token expired or invalid)
            console.error('Failed to refresh token. Logging out:', error);
            logoutUser();
            return false;
        }
    }, [refreshToken, setToken, setRefreshToken, setUser]); // Dependencies must be explicit

    const checkTokenValidity = useCallback(() => {
      
        if (!authToken) {
            // If there's no Access Token but a Refresh Token exists, try to refresh immediately
            if (refreshToken) {
                console.log('Access token missing, attempting immediate refresh.');
                updateToken();
            }
            return; 
        }

        try {
            const tokenDecoded = jwtDecode(authToken);
            const currentTime = Date.now() / 1000;
            
            // Check if the Access Token has expired (usually short-lived)
            if (tokenDecoded.exp < currentTime) {
                console.log('Access token expired. Attempting refresh.');
                // Attempt to refresh the token instead of logging out immediately
                updateToken();
            }
        } catch (error) {
            // Catches errors for malformed tokens
            console.error('Error decoding token. Attempting refresh as a last resort:', error);
            updateToken();
        }
    }, [authToken, refreshToken, updateToken]);

    // Run token check/refresh when the component mounts or every few minutes (polling)
    useEffect(() => {
        // Initial check on mount
        checkTokenValidity(); 

        // Set up interval to check token validity every 4 minutes (240000ms)
        // This helps preemptively refresh the token before the next API call fails.
        let interval = setInterval(() => {
            
            if(authToken) {
                checkTokenValidity();
            }
        }, 1000 * 60 * 1); 
       
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [authToken, checkTokenValidity]);






    let contextData = {
        registerUser:registerUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
        authToken:authToken,
        user:user,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}