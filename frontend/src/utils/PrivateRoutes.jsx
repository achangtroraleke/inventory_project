import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

const PrivateRoutes = () =>{
    let {authToken} = useContext(AuthContext)
    
    return(authToken? <Outlet/>: <Navigate to={'/'}/>)
    
}
export default PrivateRoutes;