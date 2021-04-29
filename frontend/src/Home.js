import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import axios from 'axios'
import Login from './Login'


const Home = () => {
    
    const [post, setPost] = useState('')
    const [author, setAuthor] = useState('')
    const [modalActive, setModalActive] = useState(false)
    const [postsList, setPostsList] = useState([])
    const history = useHistory()


    useEffect(() => {
      const intervalID = setInterval(() => {
        getPosts()
      }, 2000)
      const controller = new AbortController()
      controller.abort()
      // return a clean-up function so that the repetition can be stopped
      // when the component is unmounted
      return () => clearInterval(intervalID)
    }, [])
    
    axios({
        method: 'post', url: '/account/',
      }).then(response => {
        setAuthor(String(response.data))
    })
    
    const getPosts = async () => {
        await axios({
            method: 'get',
            url: '/api/posts',
          })
        .then(response => {
            setPostsList(response.data)
        });
    }
    
    const addPost = async (postText, sendTo) => {
        try {
            await axios.post('/api/posts/add', { postText, author, sendTo })
            setModalActive(false)
        } catch (err) {
            window.alert(`error occured while adding post: ${err.response.data}`)
        }
      }

    const completePost = async (_id, author) => {
        try {
            await axios.post('/api/posts/complete', { _id, author })
        } catch (err) {
            window.alert(`error occured while completing post: ${err.response.data}`)
        }
    }
      
    const modalAppear = () => {
        setModalActive(true)
        setPost('')
    }

    const goHome = () => {
        history.push('/')
    }

    const logout = async () => {
      try {
          await axios.post('/account/logout', { username: author })
          goHome()
      }
      catch (err) {
        window.alert(`error occured while logging out: ${err.response.data}`)
      }
    }

    if (author !== '') {
        return (
            <>
            <div className="container">
                <br></br>
                <center><h1> <b>Roommate Task Organizer </b></h1>
                <br></br>
                Welcome {author}!
                <br></br>
                <br></br>
                <button type="button" className="btn btn-primary" onClick={modalAppear}>Add new task</button>
                <br></br>
                <br></br>
                <button type="button" className="btn btn-primary" onClick={logout}>Logout</button>
                <br></br>
                </center>
            </div>

            {modalActive
                && (
                <center>
                <div className="card" style={{ width: '25rem' }}>
                <center>
                    <br></br>
                    <h5>Add Task</h5>
                    <input onChange={e => setPost(e.target.value)} placeholder="Write task here..." />
                    <br />
                    <button type="button" className="btn btn-primary" onClick={() => addPost(post, post)}>Submit Task</button>
                    <button type="button" className="btn btn-warning" onClick={() => setModalActive(false)}>Cancel</button>
                    <br></br>
                    </center>
                    <br></br>
                </div>
                </center>
                )}
            <div>
                <br></br>
                {
                postsList.map(q => (
                <center>
                <div className="card" style={{ width: '18rem' }}>
                    <center>
                    <div className="post-title" style={{ size: '16pt', color: 'black', fontWeight: 'bold' }}>
                    Task: {q.postText}
                    </div>
                    <div className="body">
                    Author: {q.sendFrom}
                    </div>
                    <div className="assigned to">
                    Assigned to: {q.sendTo}
                    </div>
                    <div className="completed">
                    Completed: {q.completed}
                    </div>
                <button type="button" className="btn btn-primary" onClick={() => completePost(q._id, author)}>
                    Complete Task
                </button>
                    </center>
                </div>
                <br></br>
                </center>
                ))
            }
            </div>
            </>
        )    
    }

    return (
        <>
            <div className="container">
                <br></br>
                <center><h1> <b>Roommate Task Organizer </b></h1>
                <br></br>
                Welcome Roomie! <Link to="/login">Log in </Link>to view tasks.
                <br></br>
                <br></br>
                
                <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                </Switch>
                </center>
            </div>
        </>
      )


  }

export default Home