import React from 'react';
import { RiCloseCircleLine, RiCheckboxCircleLine } from "react-icons/ri";
/**
 * Parses a DRF error object (e.g., {field: [errors]}) into a clean, 
 * multi-line string for display.
 * @param {object | string} message The raw error response data or a simple string.
 * @returns {string} The formatted message string, or the original string.
 */
const formatMessageForDisplay = (message) => {
    // 1. If the message is a string (simple error), return it immediately.
    if (typeof message === 'string') {
        return message;
    }
    
    // 2. If it's a null/undefined/empty object, return a generic error.
    if (!message || typeof message !== 'object') {
        return "An unexpected error occurred.";
    }

    // 3. Process the DRF validation object
    const formattedErrors = [];
    
    // Iterate over each field (e.g., 'email', 'username')
    for (const field in message) {
        if (message.hasOwnProperty(field)) {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
            const errors = Array.isArray(message[field]) ? message[field].join('; ') : String(message[field]);
            
            // Format: "Email: user with this email already exists."
            formattedErrors.push(`${fieldName}: ${errors}`);
        }
    }

    // Join them by newlines for clear, stacked display
    return formattedErrors.join('\n');
};


const Alert = ({ type, message }) => {
    // The displayMessage is handled by the utility function
    const displayMessage = formatMessageForDisplay(message);

    if (!displayMessage || displayMessage === "An unexpected error occurred.") return null;

    const baseClasses = "rounded-lg p-4 mb-6 transition-opacity duration-300 shadow-md";
    
    // Use whitespace-pre-wrap to respect the '\n' characters from the formatted message
    const messageElement = (
        <p className="font-medium text-sm whitespace-pre-wrap">{displayMessage}</p>
    );

    if (type === 'success') {
        return (
            <div className={`${baseClasses} bg-green-100 border border-green-400 text-green-700 flex items-center`}>
                <RiCheckboxCircleLine className="w-5 h-5 mr-3 flex-shrink-0 text-green-500" />
                {messageElement}
            </div>
        );
    }
    
    if (type === 'error') {
        return (
            <div className={`${baseClasses} bg-red-100 border border-red-400 text-red-700 flex items-start`}>
                <RiCloseCircleLine className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-red-500" />
                {messageElement}
            </div>
        );
    }
    return null;
};

export default Alert;
