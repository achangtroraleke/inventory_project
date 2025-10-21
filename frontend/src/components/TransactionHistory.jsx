import { useContext } from "react";
import AppContext from "../context/AppContext";
import LoadingSpinner from "./LoadingSpinner";


const TransactionHistory = ({ product }) =>{
    const {isLoading} = useContext(AppContext)
 
    const getTypeClasses = (type) => {
        switch (type) {
            case 'IN':
                return 'bg-green-100 text-green-800';
            case 'OUT':
                return 'bg-red-100 text-red-800';
            case 'ADJ':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!product || product.transaction_history.length === 0) {
        return (
            <div className="text-center text-gray-500 bg-gray-50 rounded-xl  col-span-1 shadow-2xl bg-white rounded-xl p-6 md:p-8">
                <p className="font-semibold">No transaction history found for this product.</p>
                <p className="text-sm">Log an 'IN' or 'OUT' movement to start tracking.</p>
            </div>
        );
    }
    return (
        <div className=" bg-white shadow-2xl rounded-xl p-6 md:p-6 col-span-1 ">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3 text-indigo-600">
                Transaction History for: {product.name}
            </h2>
            {isLoading ?
                <div className="min-h-[200px] flex items-center justify-center">
                    <LoadingSpinner />
                </div>
                :
                <>
               
                    {/* Scrollable Wrapper with max height and overflow */}
                    <div className=" max-h-[21rem] overflow-y-auto rounded-lg border border-gray-200 ">
                        
                        <table className="min-w-full divide-y divide-gray-200 table-auto">
                            <thead className="bg-gray-50">
                                {/* Sticky Header */}
                                <tr className="sticky top-0 bg-gray-100 z-10 shadow-sm ">
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Change
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    {/* Add more columns here if needed (e.g., User, Price) */}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {product.transaction_history.map((t, index) => (
                                    <tr key={t.id || index} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getTypeClasses(t.type)}`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${t.quantity_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.quantity_change > 0 ? `+${t.quantity_change}` : t.quantity_change}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(t.timestamp).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    );

}

export default TransactionHistory;