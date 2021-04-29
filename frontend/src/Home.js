import React, { useState, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import axios from 'axios'


const Home = () => {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [author, setAuthor] = useState('')
    const [modalActive, setModalActive] = useState(false)
    const [questionsList, setQuestionsList] = useState([])
    const history = useHistory()


    useEffect(() => {
      const intervalID = setInterval(() => {
        getQuestions()
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
    
    const getQuestions = async () => {
        await axios({
            method: 'get',
            url: '/api/posts',
          })
        .then(response => {
            setQuestionsList(response.data)
        });
    }


    const addQuestion = async (questionText, author) => {
        try {
            await axios.post('/api/posts/add', { questionText, author })
            setModalActive(false)
        } catch (err) {
            window.alert(`error occured while adding question: ${err.response.data}`)
        }
      }

    const answerQuestion = async (_id, answer, author) => {
        try {
            await axios.post('/api/posts/answer', { _id, answer, author })
            setAnswer('')
        } catch (err) {
            window.alert(`error occured while answering question: ${err.response.data}`)
        }
    }
      
    const modalAppear = () => {
        setModalActive(true)
        setQuestion('')
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

    return (
        <>
        <div className="container">
            <br></br>
            <center><h1> <b>Campuswire Lite </b></h1>
            <br></br>
            Welcome {author}!
            <br></br>
            <br></br>
            <button type="button" className="btn btn-primary" onClick={modalAppear}>Add new question</button>
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
                <h5>Add Question</h5>
                <input onChange={e => setQuestion(e.target.value)} placeholder="Write question here..." />
                <br />
                <button type="button" className="btn btn-primary" onClick={() => addQuestion(question, author)}>Submit Question</button>
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
            questionsList.map(q => (
            <center>
            <div className="card" style={{ width: '18rem' }}>
                <center>
                <div className="post-title" style={{ size: '16pt', color: 'black', fontWeight: 'bold' }}>
                Question: {q.questionText}
                </div>
                <div className="body">
                Author: {q.author}
                </div>
                <div className="answer">
                Answer: {q.answer}
                </div>
            <input
                onChange={e => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
            />
            <br></br>
            <button type="button" className="btn btn-primary" onClick={() => answerQuestion(q._id, answer, author)}>
                Submit Answer
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

export default Home