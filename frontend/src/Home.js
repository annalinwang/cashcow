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
import { Filters } from '../actions'


const Home = () => {
    
    const [post, setPost] = useState('')
    const [money, setMoney] = useState('')
    const [sendTo, setSendTo] = useState('')
    const [author, setAuthor] = useState('')
    const [modalActive, setModalActive] = useState(false)
    const [modalUserActive, setModalUserActive] = useState(false)
    const [postsList, setPostsList] = useState([])
    const [users, setUsers] = useState([])
    const [filterForMe, setFilterForMe] = useState(Filters.SHOW_ALL)
    const history = useHistory()


    useEffect(() => {
      const intervalID = setInterval(() => {
        getPosts()
        getUsers()
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

    const getUsers = async () => {
        await axios({
          method: 'get',
          url: '/account/users',
        }).then(response => {
          setUsers(response.data)
        })
      }
    
    const addPost = async (task, amount, sendFrom, sendTo) => {
        try {
            await axios.post('/api/posts/add', { task, amount, sendFrom, sendTo })
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
          setModalUserActive(false)
          goHome()
      }
      catch (err) {
        window.alert(`error occured while logging out: ${err.response.data}`)
      }
    }

    const getFilteredPosts = (posts, filter) => {
        switch (filter) {
          case Filters.SHOW_ALL:
            return posts
          case Filters.SHOW_COMPLETED:
            return posts.filter(p => p.completed === 'yes' && p.sendTo == author)
          case Filters.SHOW_INCOMPLETE:
            return posts.filter(p => p.completed === 'no' && p.sendTo == author)
          case Filters.SHOW_SENT:
            return posts.filter(p => p.sendFrom == author)
          default:
            throw new Error(`Unknown filter: ${filter}`)
        }
      }
    
      const FilterButton = ({ active, children, onClick }) => (
        <button type="button" className="btn btn-light"
          onClick={onClick}
          disabled={active}
          style={{ marginLeft: '5px' }}>
          {children}
        </button>
      )

    if (author !== '') {
        return (
            <>
            <div className="container">
                <br></br>
                <center><h1> <b>CashCow </b></h1>
                Welcome <b>{author}</b>!
                <br></br>
                <button type="button" className="btn btn-link" onClick={logout}>Logout</button>
                <br></br>
                {!modalUserActive
                && (
                    <button type="button" style={{ marginLeft: '5px'}} className="btn btn-link" onClick={() => setModalUserActive(true)}>Show Users</button>
                )}
                {modalUserActive
                && (
                    <div>
                        <button type="button" style={{ marginLeft: '5px'}} className="btn btn-link" onClick={() => setModalUserActive(false)}>Hide Users</button>
                        <div>
                            { users.map(u => (
                                <p className="mb-0">{u.username}</p>
                            ))}
                        </div>
                    </div>
                )}
                <br></br>
                <button type="button" className="btn btn-info" onClick={modalAppear}>Make Request</button>
                <br></br>
                </center>
            </div>

            {modalActive
                && (
                <center>
                    <div className="container">
                        <br></br>
                        <center>
                        <div className="card" style={{ width: '15rem' }}> 
                            <div class="card-body">
                                <div className="post-title" style={{ size: '30pt', color: 'black', fontWeight: 'bold' }}>
                                    Request User
                                </div>
                                <input className="form-control" onChange={e => setSendTo(e.target.value)} placeholder="User"></input>
                                
                                <input className="form-control" onChange={e => setPost(e.target.value)} placeholder="What's it for?"></input>
                                <input className="form-control" onChange={e => setMoney(e.target.value)} placeholder="$0"></input>
                                <br></br>
                                <button type="button" style={{ marginLeft: '5px'}} className="btn btn-info" 
                                    disabled={post.trim().length === 0 || money.trim().length === 0 || sendTo.trim().length === 0 || sendTo.trim() === author || isNaN(money.trim())} 
                                    onClick={() => addPost(post, money, author, sendTo)}>Submit</button>
                                <button type="button" style={{ marginLeft: '5px'}} className="btn btn-warning" onClick={() => setModalActive(false)}>Cancel</button>
                                <br/>
                            </div>
                        </div>
                        </center>   
                    </div>
                </center>
            )}

            <div>
                <br></br>
                <center>
                    <b>Payments Feed</b>
                    <div className="filters">
                        <FilterButton filter={Filters.SHOW_ALL} onClick={() => setFilterForMe(Filters.SHOW_ALL)}>
                        All
                        </FilterButton>
                        <FilterButton filter={Filters.SHOW_INCOMPLETE} onClick={() => setFilterForMe(Filters.SHOW_INCOMPLETE)}>
                        Incomplete
                        </FilterButton>
                        <FilterButton filter={Filters.SHOW_COMPLETED} onClick={() => setFilterForMe(Filters.SHOW_COMPLETED)}>
                        Completed
                        </FilterButton>
                        <FilterButton filter={Filters.SHOW_SENT} onClick={() => setFilterForMe(Filters.SHOW_SENT)}>
                        Sent
                        </FilterButton>
                    </div>
                </center>
            </div>

            <div>
                <br></br>
                {
                (getFilteredPosts(postsList, filterForMe)).map(q => (
                    <center>
                        {q.completed === 'yes' && (
                            <div className="card border-success mb-3" style={{ width: '18rem'}}>
                                <center>
                                <br></br>
                                <b>{q.sendTo}</b> paid <b>{q.sendFrom}</b>
                                <div className="body">
                                <b>${q.amount}</b>: {q.task}
                                </div>
                                <br></br>
                                </center> 
                             </div>
                        )}
                        {q.completed === 'no' && (
                             <div className="card border-danger mb-3" style={{ width: '18rem'}}>
                                <center>
                                <br></br>
                                <b>{q.sendFrom}</b> requested <b>{q.sendTo}</b>
                                <div className="body">
                                <b>${q.amount}</b>: {q.task}
                                </div>
                                {q.sendTo === author && (
                                    <div>
                                        <button type="button" className="btn btn-link" onClick={() => completePost(q._id, author)}>
                                        Complete
                                        </button>
                                        <br></br>
                                    </div>
                                )}
                                <br></br>
                                </center>  
                             </div>
                        )}

                        
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
                <center><h1> <b>CashCow</b></h1>
                Welcome! <Link to="/login">Log in </Link>to view payments feed.
                <br></br>
                <br></br>
                Who else is using CashCow?
                <br></br>
                {!modalUserActive
                && (
                    <button type="button" style={{ marginLeft: '5px'}} className="btn btn-link" onClick={() => setModalUserActive(true)}>Show Users</button>
                )}
                {modalUserActive
                && (
                    <div>
                        <button type="button" style={{ marginLeft: '5px'}} className="btn btn-link" onClick={() => setModalUserActive(false)}>Hide Users</button>
                        <div>
                            { users.map(u => (
                                <p className="mb-0">{u.username}</p>
                            ))}
                        </div>
                    </div>
                )}
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