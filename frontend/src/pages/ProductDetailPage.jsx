import { useContext, useEffect, useState,  useCallback } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate, useParams } from 'react-router';
import ProductDetail from '../components/ProductDetail';
import TransactionForm from '../components/TransactionForm';
import TransactionHistory from '../components/TransactionHistory';
import ProductForm from '../components/ProductForm';
import TransactionsLineChart from '../components/TransactionsLineChart';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage = () =>{
    const navigate = useNavigate()
    const {getProductDetail, isLoading, setLoading, updateProduct, fetchProductWithMonthlyTransactions} = useContext(AppContext)
    const {id} = useParams()
    const [product, setProduct] = useState()
    const [readOnly, setReadOnly] = useState(true)
    const MONTHS = [
    { value: 0, label: 'January' }, { value: 1, label: 'February' },
    { value: 2, label: 'March' }, { value: 3, label: 'April' },
    { value: 4, label: 'May' }, { value: 5, label: 'June' },
    { value: 6, label: 'July' }, { value: 7, label: 'August' },
    { value: 8, label: 'September' }, { value: 9, label: 'October' },
    { value: 10, label: 'November' }, { value: 11, label: 'December' },
];
    const MOCK_YEAR = 2025;
    const today = new Date().getMonth()
  
    const [selectedMonth, setSelectedMonth] = useState(today);
    


    const handleFetch = useCallback(()=>{
        setLoading(true); 
        const monthForAPI = selectedMonth !== undefined && selectedMonth !== null
            ? selectedMonth + 1
            : undefined; 
    
    
        fetchProductWithMonthlyTransactions(id, monthForAPI, MOCK_YEAR).then((res)=>{
           
            setProduct(res.data)
           
        })
        .catch((error)=>{
            // 2. CATCH ERRORS AND HANDLE THEM
                console.error("Failed to fetch products:", error.message);
                // Optionally show an error message to the user here
                setProduct(); // Clear list on error
        })
        .finally(()=>{
            setLoading(false)
        })
    },[fetchProductWithMonthlyTransactions, setLoading, selectedMonth])

    useEffect(()=>{
        handleFetch()
    },[selectedMonth])
    

    if(isLoading || !product){
        return(
            <main className="w-full flex flex-col space-y-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-6 md:p-12">   
                <div>
                    <button
                    onClick={()=>{navigate(-1)}}
                    className="cursor-pointer flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                        Back
                    </button>
                   
                </div>
                 <LoadingSpinner/>
            </main>
        )
    }
    return(
      <main className="w-full flex flex-col space-y-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-6 md:p-12">   
        <div>
            <button
            onClick={()=>{navigate(-1)}}
            className="cursor-pointer flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                Back
            </button>
        </div>
      
        {readOnly?
        <ProductDetail product={product} editFunction={()=>{
            setReadOnly(false)
        }}/>:
        <ProductForm
            title='Update Product'
            initialData={{id:product.id, name:product.name, SKU:product.SKU, unit_price:product.unit_price, reorder_point:product.reorder_point}}
            submitLabel='Save Update'
            submitFunc={updateProduct}
            />}
        <TransactionForm product={product} />

      
        <div className="flex  items-center mb-8 space-x-4">
            <label htmlFor="month-select" className="text-gray-600 font-medium whitespace-nowrap">
                Data Month ({MOCK_YEAR}):
            </label>
            <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-48 transition duration-150"
            >
                {MONTHS.map(month => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                ))}
            </select>
        </div>
        <div className='flex flex-col'>

        
         <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3  gap-6  ">
      
            <TransactionHistory product={product}/>
           <TransactionsLineChart product={product} month={selectedMonth}/>
        
         </div>
         </div>

     
        </main>
    )
}
export default ProductDetailPage