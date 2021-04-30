import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import Login from './Login'



const Signup = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()

    const goHome = () => {
        history.push('/')
    }

    const signup = async () => {
        try {
            await axios.post('/account/signup', { username, password })
            goHome()
        } catch {
            window.alert('could not sign up')
        }
    }
      
    return (
        <div>
            <div className="container">
                <br></br>
                <center><h1> <b>CashCow </b></h1>
                <div className="card" style={{ width: '20rem' }}>
                    <div class="card-body">
                        <div className="post-title" style={{ size: '30pt', color: 'black', fontWeight: 'bold' }}>
                            Signup
                        </div>
                        <label>Username</label>
                            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username"></input>
                            <br/>
                        <label>Password</label>
                        <input className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"></input>    
                        <br/>        
                        <button type="button" class="btn btn-primary" onClick={() => signup(username, password)}> Sign up </button>
                        <br></br>
                        <br/>
                        Already have an account?<Link to="/login"> Login Here </Link>
                    </div>
                </div>
                </center>   
            </div>
        <Switch>
            <Route path="/login">
                <Login />
            </Route>
        </Switch>
        </div>
    )
}

export default Signup