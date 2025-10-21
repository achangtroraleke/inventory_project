import { useState } from "react";
import useFields from "../hooks/useFields";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";

const DynamicForm = ({ 
    formTitle,
    schema = [], 
    initialData = {}, 
    onSubmit, 
    submitLabel = 'Save Changes',
    isReadOnly = false,
    formDescription
}) => {
  
  // Initialize state using the custom hook
  // The hook now handles synchronization with initialData internally.
  const [formData, handleChange, resetData] = useFields(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: null, message: null });
  // Removed the problematic useEffect hook here. The logic is now inside useFields.

  const validateForm = () => {
    const errors = {};
    schema.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        
        // Basic check for empty strings or null/undefined
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
            errors[field.name] = `${field.label} is required.`;
        }
        // Specific check for number types
        if (field.type === 'number' && (isNaN(parseFloat(value)))) {
            errors[field.name] = `${field.label} must be a number.`;
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const getDisplayText = (field, value) => {
    if (field.type === 'select' && field.options) {
        const option = field.options.find(opt => opt.value === value);
        return option ? option.label : value;
    }
    return String(value);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: null }); // Clear previous feedback

    if (!validateForm()) {
      // Focus on the first field with an error for better UX
      const firstErrorField = document.getElementById(Object.keys(formErrors)[0]);
      if (firstErrorField) firstErrorField.focus();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
        // Await the promise returned by the parent onSubmit function (the API call)
        const result = await onSubmit(formData);
        console.log(result)
        if (result && result.status===201) {
            setFeedback({ type: 'success', message: result.message || 'Action completed successfully!' });
            // Optionally reset form if it's a creation form (no initial data/ID)
             if (!initialData.id) { resetData(); } 
        } else {
            // Handle success: false from the API response body
            setFeedback({ type: 'error', message: result.data || 'An unknown error occurred during submission.' });
        }
    } catch (error) {
    // Pass the raw data object to the Alert handler
        const errorData = error.response?.data || { detail: "Network error." };
        setFeedback({ type: 'error', message: errorData }); 
        throw error;
    } finally {
        setIsSubmitting(false);
    }
  };

    const renderInput = (field) => {
        const baseClasses = "w-full p-3 border border-gray-300 rounded-lg text-sm";
        const value = formData[field.name] || '';

        // --- READ-ONLY LOGIC ---
       if (isReadOnly) {
            
            let customStyleClasses = "";
            // 1. Check if customClass function exists on the field definition
            if (typeof field.customClass === 'function') {
                // 2. Execute the function, passing the field value AND all form data
                //    This allows access to 'reorderPoint' or other related fields.
                customStyleClasses = field.customClass(value, formData);
            }

            return (
                <span className={`block p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium whitespace-pre-wrap ${customStyleClasses}`}>
                    {getDisplayText(field, value)}
                </span>
            );
        }
        // -----------------------

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows="3"
                        className={`${baseClasses} resize-y focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                );
            case 'select':
                return (
                    <select
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        required={field.required}
                        className={`${baseClasses} focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                        {!field.options.some(opt => opt.value === value) && <option value="" disabled>Select {field.label}</option>}
                        {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label} 
                            </option>
                        ))}
                    </select>
                );
            // Default: text, number, email, etc.
            default: 
                return (
                    <input
                        type={field.type}
                        name={field.name}
                        value={value}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className={`${baseClasses} focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                );
        }
    };
    
  return (
      <div className="">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3 text-indigo-600">
            {formTitle}
      </h2>
     <form onSubmit={handleSubmit} className="p-0 space-y-6">
            <p className="text-gray-500 text-sm">{formDescription}</p>

            <Alert type={feedback.type} message={feedback.message}/>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {schema.map((field) => (
                    <div key={field.name} className="flex flex-col">
                        <label htmlFor={field.name} className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                            {field.label}
                            {field.required && !isReadOnly && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        {renderInput(field)}
                    </div>
                ))}
            </div>

            {/* Hide button if read-only */}
            {!isReadOnly && (
                <div className="pt-6 border-t mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="cursor-pointer flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <LoadingSpinner /> : `${submitLabel}`}
                    </button>
                </div>
            )}
        </form>
    </div>
  );
};

export default DynamicForm;