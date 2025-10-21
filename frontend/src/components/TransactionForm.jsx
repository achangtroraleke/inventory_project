import DynamicForm from "./DynamicForm"
import LoadingSpinner from "./LoadingSpinner";
import { useState, useContext } from "react";
import AppContext from "../context/AppContext";
const TransactionForm = ({product}) =>{
 
    const {newTransaction, isLoading} =useContext(AppContext)

 

    const initialTransactionData = {
        product: !product?'':product.id,
        type: 'IN', // Default to IN
        quantity_change: '',
        notes: '',
    };
    const transactionSchema = [
            { name: 'product', label: 'Product ID', type: 'number', placeholder: '101', required: true, min: 1 },
            { 
                name: 'type', 
                label: 'Transaction Type', 
                type: 'select', 
                options: [
                    { value: 'IN', label: 'IN - Increase Stock (e.g., Receipt)' },
                    { value: 'OUT', label: 'OUT - Decrease Stock (e.g., Sale/Issue)' },
                    { value: 'ADJ', label: 'ADJ - Adjustment (e.g., Count Correction)' }
                ], 
                required: true 
            },
            { name: 'quantity_change', label: 'Quantity Change', type: 'number', placeholder: '10', min: 1, required: true },
        ];
    return(
        <div className=" shadow-2xl bg-white rounded-xl p-6 md:p-8">

        {isLoading || !product?
            <div className="min-h-[200px] flex items-center justify-center">
                <LoadingSpinner />
            </div>
            :
            <DynamicForm
            submitLabel="Make Transaction"
            schema={transactionSchema}
            initialData={initialTransactionData}
            onSubmit={(data)=>newTransaction(data)}
            formTitle="Make Transaction"
            formDescription="Use this form to add stock (IN), remove stock (OUT), or perform inventory adjustments (ADJ). This action will automatically update the product's quantity on hand."
            />}
        </div>
    )
}

export default TransactionForm;