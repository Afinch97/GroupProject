import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import {Link, useNavigate} from "react-router-dom";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./homeStyle.css";


const Register = ()=>{
    const [user, setUser] = useState({username:"",email:"" ,password:""});
    const [error, setError] = useState("");
    let navigate = useNavigate();
    const Submit = e => {
        e.preventDefault();
        console.log(JSON.stringify(user))
        fetch('/register', { method: 'POST', headers:{'Content-Type':'application/json'} ,body: JSON.stringify(user) })
            .then(res => res.json())
            .then(json => {
                 console.log(json)
                var key = Object.keys(json)
                console.log(key[0])
                if(key[0]==="success"){
                    navigate("/");
                }
                else if(key[0]==="error"){
                    setError(Object.values(json))
                }
            });
    }

        return (
            <div className="inner">
            <form onSubmit={Submit}>
            <h3>Sign Up</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="form-group">
                <label htmlFor="user">Username: </label>
                <input type="text" className="form-control" id="user" placeholder="Username" onChange={e =>setUser({...user, username: e.target.value})} value={user.username}/>
            </div>
            <div className="form-group">
                <label htmlFor="user">Email: </label>
                <input type="text" className="form-control" id="email" placeholder="Email" onChange={e =>setUser({...user, email: e.target.value})} value={user.email}/>
            </div>
            <div className="form-group">
                <label htmlFor="user">Password: </label>
                <input type="password" className="form-control" placeholder="Password"  id="password" onChange={e =>setUser({...user, password: e.target.value})} value={user.password} />  
            </div>
            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            </form>
            <br/>
            <p>
                Aleady have an account? <br />
                <Link className="btn btn-secondary btn-sm" role="button" to={"/"}>Log In</Link>
            </p>
            </div>
        )

}
export default Register