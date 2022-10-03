import {useState} from "react";
import axios from "axios";
export default function SignUp(){
    const [user,setUser] = useState("");
    const [pwd,setPwd] = useState("");
    const [confirmPwd,setConfirmPwd] = useState("");
    const [success,setSuccess] = useState(false);
   
    function handleSubmit(event){
        event.preventDefault()
        const data = {
            user: user,
            pwd: pwd
        }
        try{
            axios.post('http://localhost:3500/register', data);
            setSuccess(true);
        }
        catch(err){
            console.log(err);
        }
    }
    return success?(<a href="http://localhost:3000/login">login</a>):(
         
        <div>
            <h1>{confirmPwd!==pwd?"Passwords do not match":""}</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input 
                    onChange = {(e) => setUser(e.target.value)}
                    type="text"
                    placeholder="Username"
                    name="Username"
                    value={user}
                />
                <input 
                    onChange = {(e) => setPwd(e.target.value)}
                    type="password"
                    placeholder="Password"
                    name="Password"
                    value={pwd}
                />
                <input 
                    onChange = {(e) => setConfirmPwd(e.target.value)}
                    type="password"
                    placeholder="ConfirmPassword"
                    name="ConfirmPassword"
                    value={confirmPwd}
                />
                <button 
                    className="form--submit"
                >Sign up
                </button>
            </form>
        </div>
        
    )
}