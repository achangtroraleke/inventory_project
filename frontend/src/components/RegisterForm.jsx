import DynamicForm from "./DynamicForm";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const RegisterForm = () =>{
    const {registerUser} = useContext(AuthContext);

    const registerSchema = [
        {name:'username', label:'Username', type:'text', placeholder:'new username',required:true},
        {name:'email', label:'E-MAIL', type:'email', placeholder:'example@email.com',required:true},
        {name:'password', label:'Password', type:'password',placeholder:'password',required:true}
    ]
    return(
        <DynamicForm
        formTitle={"Register"}
        schema={registerSchema}
        initialData={{}}
        onSubmit={registerUser}
        submitLabel="Register"
        />
    )
}
export default RegisterForm;