import React from "react";
import axios from "axios";
export default function Login(){
    const [user,setUser] = React.useState("");
    const [pwd,setPwd] = React.useState("");
    const [success,setSuccess] = React.useState(false);
    function handleSubmit(event){
        event.preventDefault()
        try{
            const data = {
                user: user,
                pwd: pwd
            }
            axios.post('http://localhost:3500/login', data)
                .then(res => {
                    localStorage.setItem('accessToken',(res.data.accessToken));
                    localStorage.setItem('user',user);
                    localStorage.setItem('refreshToken',(res.data.refreshToken))
                    console.log(res.data.refreshToken)
                })
            setSuccess(true);
        }
        catch(err){
            console.log(err);
        }
        
    }
    return success?<a href="http://localhost:3000/chess">chess</a>:(
        <div>
            <form className="form" onSubmit={handleSubmit}>
                <input 
                    onChange =  {(e) => setUser(e.target.value)}
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
                <button 
                    className="form--submit"
                    
                >Login
                </button>
                <a href="http://localhost:3000/SignUp">register</a>
            </form>
        </div>
    )
}