
import { useContext, useEffect, useState, useC, useCallback } from 'react';
import ProductForm from '../components/ProductForm';
import AppContext from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router';

const ProductPage = () =>{
    const [products, setProducts] = useState([])
    const {fetchAllProducts, isLoading, setLoading, newProduct} =useContext(AppContext)
    
    const handleFetch = useCallback(()=>{
        setLoading(true);
        fetchAllProducts().then((res)=>{
          
            setProducts(res.data)
           
        })
        .catch((error)=>{
            // 2. CATCH ERRORS AND HANDLE THEM
                console.error("Failed to fetch products:", error.message);
                // Optionally show an error message to the user here
                setProducts([]); // Clear list on error
        })
        .finally(()=>{
            setLoading(false)
        })
    },[fetchAllProducts, setLoading])

    useEffect(()=>{
        handleFetch()
    },[])
    return(
      <main className="w-full flex flex-col space-y-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  p-6 md:p-12">
        <div className="bg-white shadow-2xl rounded-xl p-6 gap-4 md:p-8" >
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3 text-indigo-600">
                Products
            </h2>
            {isLoading?
            <LoadingSpinner/>:
            <div>
                  <ul className="divide-y divide-gray-200">
                                {products.length > 0 ? products.map((prod) => {
                                    return(
                                    <Link to={`/products/${prod.id}`} key={prod.id}>
                                   
                                    <li  className="py-3 flex justify-between items-center hover:bg-gray-50 transition duration-150 px-2 rounded-lg">
                                        <span className="font-medium text-gray-700">{prod.name}</span>
                                        <span className="text-sm text-gray-500">SKU: {prod.SKU} | Stock: {prod.current_stock? prod.current_stock: 0}</span>
                                    </li>
                                     </Link>
                                )}) :    <li className="text-center py-8 text-gray-500">
                                        No products found. Please add a new product using the form below.
                                    </li>}
                            </ul>
            </div>}
   
        </div>
     
        <ProductForm title='Create Product' submitFunc={newProduct} submitLabel='Create Product'/>
    </main>
    )
}
export default ProductPage;