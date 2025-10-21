import { MdOutlineTrendingUp } from "react-icons/md";
import { Link } from "react-router";
const HeroSection = () =>{

    return(
        <section className="bg-gray-50 pt-16 pb-24 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Stop Guessing, <span className="text-indigo-600">Start Predicting.</span>
            </h1>
            <p className="text-xl text-gray-600 mt-4 mb-8">
              Inventory Pro is the smart stock management system powered by demand forecasting, 
              ensuring you always have the right products at the right time.
            </p>
            <div className="space-x-4">
              <button 

                className="cursor-pointer bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <Link to={'/register'}>
                  Get Started for Free
                </Link>
              
              </button>
            
            </div>
          </div>
          
          {/* Mock Visualization */}
          <div className="mt-16 bg-white p-8 rounded-2xl shadow-2xl border border-indigo-100">
              <div className="flex justify-center items-center mb-6">
                <div className="bg-indigo-600 p-8 rounded-full flex item-center space-x-2">
                    <MdOutlineTrendingUp className="bg-transparent text-white w-10 h-10" />
                    
                  
                  
                </div>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Demand Forecast Over Next 30 Days</p>
              <div className="h-64 w-full bg-indigo-50 rounded-lg flex items-end justify-between p-4 opacity-75">

                  
                  {/* Mock Chart Bars */}
                  {[...Array(15)].map((_, i) => (
                    <div key={`hist-${i}`} className="w-1/12 bg-gray-300 rounded-t-lg transition duration-500" style={{height: `${Math.random() * 60 + 20}%`}}></div>
                  ))}
                   {[...Array(10)].map((_, i) => (
                    <div key={`pred-${i}`} className="w-1/12 bg-indigo-400 rounded-t-lg transition duration-500" style={{height: `${Math.random() * 80 + 30}%`}}></div>
                  ))}
              </div>
              <p className="mt-4 text-sm text-gray-500">Predicted Reorder Point: 15 units. Current Stock: 8 units. Action: Order 7 units.</p>
          </div>
        </div>
      </section>
    )
}
export default HeroSection;