import { useState, useContext, useCallback, useEffect } from "react"
import AppContext from "../context/AppContext"
import StatCard from "./StatCard";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router";

const Dashboard = () =>{
    const [products, setProducts] = useState([])
    const {fetchAllProducts, isLoading, setLoading} =useContext(AppContext)
    
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

    
    const getAlertClasses = (alert) => {
        switch (alert) {
            case 'LOW':
                return 'bg-red-100 text-red-800 ring-red-500/10';
            case 'OK':
                return 'bg-green-100 text-green-800 ring-green-500/10';
            default:
                return 'bg-gray-100 text-gray-800 ring-gray-500/10';
        }
    };
    const lowStockCount = products.filter(p => p.low_stock_alert === 'LOW').length;
    const totalQuantity = products.reduce((sum, p) => sum + p.current_stock, 0);
    const totalProducts = products.length;
 
    let navigate = useNavigate()
    return (
        <div className="w-full flex flex-col space-y-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  p-6 md:p-12">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2 border-b pb-3">
                <span className='text-indigo-600'>Inventory</span> Dashboard
            </h2>

            {/* --- 1. Dashboard Summary (GRID Layout) --- */}
            {/* Uses a responsive grid: 1 column on mobile, 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Products" 
                    value={totalProducts} 
                    colorClass="text-blue-700"
                />
                <StatCard 
                    title="Items in Stock" 
                    value={totalQuantity.toLocaleString()} 
                    colorClass="text-green-700"
                />
                <StatCard 
                    title="Low Stock Alerts" 
                    value={lowStockCount} 
                    colorClass="text-red-700"
                />
            </div>

            {/* --- 2. Product List (FLEX Layout) --- */}
            <div className="flex flex-col bg-white shadow-2xl rounded-2xl border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3 text-indigo-600">
            Product List
      </h2>
                {isLoading ? (
                    <div className="min-h-[300px] flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No products found. Start by adding new inventory items.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">QTY</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reorder Point</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr 
                                        key={product.id} 
                                        className="hover:bg-indigo-50 cursor-pointer transition duration-150"
                                        onClick={() => navigate(`/products/${product.id}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.SKU}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                            {product.current_stock? product.current_stock:'0'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.reorder_point}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getAlertClasses(product.low_stock_alert)}`}>
                                                {product.low_stock_alert}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Dashboard