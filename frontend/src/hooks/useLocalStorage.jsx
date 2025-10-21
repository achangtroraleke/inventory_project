import { useState, useEffect } from "react";


/**
 * A custom React hook that persists state in localStorage and keeps it in sync.
 * 
 * @param {string} key - The key under which to store the value in localStorage
 * @param {any} defaultValue - The initial value to use if no value exists in localStorage
 * @returns {Array} - Returns an array with the current state and a function to update it (similar to useState)
 * 
 * Features:
 * - Automatically reads from localStorage on initial render
 * - Handles JSON serialization/deserialization automatically
 * - Synchronizes state to localStorage whenever it changes
 * - Maintains the same API as useState for easy adoption
 * - Gracefully handles parsing errors by falling back to defaultValue
 * 
 * Usage example: 
 * const [theme, setTheme] = useLocalStorageState('user-theme', 'light');
 * 
 * This will persist the theme preference across page refreshes and browser sessions.
 */

const useLocalStorageState = (key, defaultValue) => {
    const [state, setState] = useState(()=>{
        try{
            let value = JSON.parse(localStorage.getItem(key) || defaultValue);

            return value
        }catch(err){
            console.log(err)
        }
    });

    useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(state))
    },[key, state])
    return [ state, setState ]

}

export default useLocalStorageState;