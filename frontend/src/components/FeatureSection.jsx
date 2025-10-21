import FeatureCard from "./FeatureCard";

const FeatureSection = () =>{
    return(
        <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900">Everything You Need to Run Your Warehouse</h2>
            <p className="mt-4 text-lg text-gray-600">From real-time tracking to automated suggestions, we cover it all.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Real-Time Stock Control"
              description="Instantly log all inflow, outflow, and adjustments. Know your exact inventory level across all locations, all the time."
            />
            <FeatureCard
              title="AI-Powered Forecasting"
              description="Utilize our proprietary Holt-Winters model to predict future demand and reduce stockouts by up to 40%."
            />
            <FeatureCard
              title="Secure, Multi-User API"
              description="Built on Django REST Framework, ensuring secure, fast, and object-level permissions so users only access their data."
            />
          </div>
        </div>
      </section>
    )
}
export default FeatureSection;