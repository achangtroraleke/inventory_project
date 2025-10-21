import { useState } from "react";


/**
 * A custom React hook for managing form state with change handling and reset functionality.
 * 
 * @param {Object} initialState - The initial state object for the form (keys should match input names)
 * @returns {Array} - Returns an array containing:
 *   - formData: Current form state object
 *   - handleChange: Function to update form state on input changes
 *   - resetData: Function to reset form to initial state
 * 
 * Features:
 * - Manages form state in a single object
 * - Handles input changes automatically when using name attributes
 * - Provides a reset function to return to initial values
 * - Maintains all other form fields when updating one field
 *  
 * Usage example:
 * const [formData, handleChange, resetData] = useFields({
 *   username: '',
 *   password: ''
 * });
 * 
 * // In your input fields:
 * <input
 *   name="username"
 *   value={formData.username}
 *   onChange={handleChange}
 * />
 */

const useFields = (initialState) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = e => {
        const {name, value} = e.target
        
        setFormData(formData => ({
            ...formData,
            [name]:value
            }))
        }
        
    const resetData = () =>{
        setFormData(initialState)
    }
        return [formData, handleChange, resetData]
    
}

export default useFields;
