import DynamicForm from "./DynamicForm"
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router";


const LoginForm = () =>{
    const {loginUser} = useContext(AuthContext)
    let navigate = useNavigate()

    const handleSubmit = async (data)=>{
        
        let res = await loginUser(data)
        if(res.status === 201){
            navigate('/main')
        }
    }

    const loginSchema = [
        {name:'email', label:'E-MAIL', type:'email', placeholder:'example@email.com',required:true},
        {name:'password', label:'Password', type:'password',placeholder:'password',required:true}
    ]
    return(
        
        
        <DynamicForm 
            formTitle={'Login'}
            schema={loginSchema}
            initialData={{}}
            onSubmit={(data)=> handleSubmit(data)}
            submitLabel="Login"
        />
     

    )
}
export default LoginForm;