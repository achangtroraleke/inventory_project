import { useContext, useEffect, useState, useCallback, useRef } from "react";
import AppContext from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
import DynamicForm from "./DynamicForm";


const productDetails = ({product, editFunction}) =>{
    const {isLoading } = useContext(AppContext)
    

    const handleClick = () =>{
        editFunction()
    }
const productSchema = [
    { name: 'id', label: 'Product ID', type: 'text', readOnly: true },
    { name: 'name', label: 'Product Name', type: 'text', readOnly: true },
    { name: 'SKU', label: 'Product SKU', type: 'text', readOnly: true },
    { 
        name: 'current_stock', 
        label: 'Quantity On Hand', 
        type: 'number', 
        readOnly: true,
        // Custom style for quantity feedback
        customClass: (value, reorderPoint) => value <= reorderPoint ? 'text-red-600 font-bold' : 'text-green-600 font-bold'
    },
    { name: 'reorder_point', label: 'Reorder Point', type: 'number', readOnly: true },
    { 
        name: 'low_stock_alert', 
        label: 'Alert Status', 
        type: 'text', 
        readOnly: true,
        customClass: (value) => value === 'LOW' ? 'text-red-500 bg-red-50 rounded-full px-3 text-s' : 'text-green-500 bg-green-50 rounded-full px-3  text-s'
    },
];

    return(
         <div className=" shadow-2xl bg-white rounded-xl p-6 md:p-8">

         
            {isLoading || !product?
            <div className="min-h-[200px] flex items-center justify-center">
                <LoadingSpinner />
            </div>
            :
                <DynamicForm schema={productSchema} initialData={product} formTitle={`Product: ${product.name}`}  isReadOnly={true}/>
            }
            
       
            <div className="pt-6 border-t mt-6 flex justify-end">
                
                <button 
                onClick={handleClick}
                className="cursor-pointer flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                    EDIT
                </button>
         
            </div>

               
        </div>
    )
}

export default productDetails;