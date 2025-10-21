import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router";

const LoginPage = () =>{

    return(
        <main className="w-full flex flex-col space-y-8 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8  p-6 md:p-12 ">
            <div className=" shadow-2xl bg-white rounded-xl p-6 md:p-8">
                <LoginForm/>
            
          
            
            <div className="mt-6 text-center">
                <Link to={'/register'} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150">
                Don't have an account? Register here.
                </Link>
            </div>
            </div>
        
        </main>
    )

}
export default LoginPage;