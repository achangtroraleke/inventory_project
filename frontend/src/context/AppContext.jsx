import { useEffect, createContext, useState } from "react";

import useToggleState from "../hooks/useToggleState";
import { axiosAuth } from "../utils/axiosAuth";

const AppContext = createContext();

export default AppContext;

export const AppProvider = ({children}) =>{
    const [popupState, toggleState] = useToggleState();
    const [popupContent, setContent] = useState()


    const togglePopup = (content) =>{
        setContent(content)
        toggleState()
    }

    const [isLoading, setLoading] = useState(true)


    const fetchAllProducts = async () => {
        try {
          const res = await axiosAuth().get('/products/');
          
          return res
        } catch (err) {
          console.error('Failed to fetch user:', err);
          throw(err)
        }
      };
// PRODUCT CRUD
    const newProduct = async (formData) => {

    try {
        const res = await axiosAuth().post('/products/', formData);
        
        return res
        
    } catch (err) {
        console.error('Creation failed:', err);
        throw err;
    }
    };

    const updateProduct = async (formData) => {
 
      try {
          const res = await axiosAuth().put(`/products/${formData.id}/`, formData);

          res.status = 201
          return res
          
      } catch (err) {
          console.error('Creation failed:', err);
          throw err;
      }
      };



    // ********************************
    const newTransaction = async (formData) =>{
         
    try {
        const res = await axiosAuth().post('/transactions/', formData);

        return res
        
    } catch (err) {
        console.error('Creation failed:', err);
        throw err;
    }
    }

    const getProductDetail = async (id) =>{
          try {
          const res = await axiosAuth().get(`/products/${id}/`);
          
          return res
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
    }
    const getStockDetail = async (id) =>{
      try {
      const res = await axiosAuth().get(`/stock/${id}/`);
     
      return res
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    }

    const fetchProductWithMonthlyTransactions = async (productId, month, year) => {
    // Note: We use the detail view endpoint: /products/{id}/
    const endpoint = `/products/${productId}/`; 
     
    try {
        const response = await axiosAuth().get(endpoint, {
            // Pass the month and year as query parameters
            params: {
                month: month,
                year: year,
            }
        });
        
        // response.data will be the full product object with the transaction_history filtered!
        return response; 
    } catch (error) {
        console.error("Error fetching filtered product data:", error);
        throw error;
    }
};

    

    

    let contextData = {
        fetchProductWithMonthlyTransactions:fetchProductWithMonthlyTransactions,
        getStockDetail:getStockDetail,
        newProduct:newProduct,
        updateProduct:updateProduct,
        newTransaction:newTransaction,
        getProductDetail:getProductDetail,
        togglePopup:togglePopup ,
        popupContent:popupContent,
        popupState:popupState,
        isLoading:isLoading,
        fetchAllProducts:fetchAllProducts,
        setLoading:setLoading,
       
    }



return(
    <AppContext.Provider value={contextData}>
        {children}
    </AppContext.Provider>
)
}