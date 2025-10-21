import TransactionForm from "../components/TransactionForm"

const TransactionPage = () =>{
    return(
      <main className="w-full flex flex-col space-y-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  p-6 md:p-12">
            <TransactionForm/>
          
        </main>
    )
}
export default TransactionPage;