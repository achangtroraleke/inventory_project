import { Link } from "react-router";

const CTAFooter = () =>{

    return(
           <footer className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white">
                Ready to optimize your inventory?
            </h2>
            <p className="mt-4 text-indigo-200 text-lg">
                Join the future of inventory management today.
            </p>
            <button 
                className="cursor-pointer mt-8 bg-white text-indigo-700 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-white"
            >
                <Link to={'/register'}>
                 Register Now
                </Link>
               
            </button>
        </div>
      </footer>
    )
}
export default CTAFooter;