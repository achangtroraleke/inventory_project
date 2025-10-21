import { LuCircleCheckBig } from "react-icons/lu";

const FeatureCard = ({ title, description }) =>{
    return(
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] border border-gray-100">
     
      <LuCircleCheckBig className="text-indigo-500 w-6 h-6"/>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
    )
}
export default FeatureCard;