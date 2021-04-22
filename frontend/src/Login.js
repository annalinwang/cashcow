import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import axios from 'axios'
import Signup from './Signup'


const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()

    const goHome = () => {
        history.push('/')
    }

    const login = async () => {
        try {
            await axios.post('/account/login', { username, password })
            goHome()
            console.log("successfully logged in")

        } catch {
            console.log("couldn't log in")

            window.alert('could not log in')
        }
    }

    return (

        
        <div>
            <div className="container">
                <br></br>
                <center><h1> <b>Campuswire Lite </b></h1>
                <div className="card" style={{ width: '20rem' }}>
                    <div class="card-body">
                        <form id="myForm" method="post">
                            <div className="post-title" style={{ size: '30pt', color: 'black', fontWeight: 'bold' }}>
                                Login
                            </div>
                            <label>Username</label>
                            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username"></input>
                            <br/>
                            <label>Password</label>
                            <input className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"></input>    
                            <br/>        
                            <button type="button" class="btn btn-primary" onClick={() => login(username, password)}> Login </button>
                            <br></br>
                            <br/>
                            Don't have an account?<Link to="/signup"> Sign up Here </Link>
                        </form>
                    </div>
                </div>
                </center>
            </div>        
        <Switch>
            <Route path="/signup">
                <Signup />
            </Route>
        </Switch>
        </div>
    )
  }

export default Login