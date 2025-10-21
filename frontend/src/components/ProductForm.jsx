
import DynamicForm from "./DynamicForm"

const ProductForm = ({title='',initialData={}, submitFunc, submitLabel=''}) =>{
 
  const productSchema = [
    { 
      name: 'name', 
      label: 'Product Name', 
      type: 'text', 
      placeholder: 'Carrots', 
      required: true 
    },
    { 
      name: 'SKU', 
      label: 'SKU Number', 
      type: 'text', 
      placeholder: 'CRT-1234', 
      required: true 
    },

    { 
      name: 'unit_price', 
      label: 'Unit Price ($)', 
      type: 'number', 
      placeholder: '49.99', 
      min: 0.01, 
      step: 0.01, // Critical for decimal fields
      required: true 
    },
    { 
      name: 'reorder_point', 
      label: 'Reorder Point (Units)', 
      type: 'number', 
      placeholder: '15', 
      min: 0, 
      required: true 
    }
  ];


    return(
      <div className=" shadow-2xl bg-white rounded-xl p-6 md:p-8">


            <DynamicForm 
            formTitle={title}
            schema={productSchema}
            initialData={initialData}
            onSubmit={(data)=> submitFunc(data)}
            submitLabel={submitLabel}
            
        />
      </div>
    )
}
export default ProductForm;