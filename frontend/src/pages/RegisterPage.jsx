import { useState } from "react";
import { Link } from "react-router";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () =>{
   
    return(
        <main className="w-full flex flex-col space-y-8 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8  p-6 md:p-12">
            <div className=" shadow-2xl bg-white rounded-xl p-6 md:p-8">
                <RegisterForm/>
                            <div className="mt-6 text-center">
                <Link to={'/login'} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150">
                Already have an account? Login here.
                </Link>
            </div>
            </div>
          
            
          
        
        </main>
    )

}
export default RegisterPage;