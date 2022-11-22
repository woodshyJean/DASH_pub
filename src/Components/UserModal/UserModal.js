import React, {useState} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

import axios from "axios"
import { Routes, Route, Link} from "react-router-dom";

import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import {useNavigate } from "react-router-dom";
import {changeOnline} from "../Features/logedUserData.js"
import {navStateAll} from "../Features/NavState.js"

import "./UserModal.css"

export default function UserModal(){


    const navigate = useNavigate()

    axios.defaults.withCredentials = true

    let [Form, setFormData] = useState({
        email: "",
        password: "",
        age: "",
        name: "",
        todos:{},
        goals:{},
    })
    

    let navState = useSelector((state) => state.Nav.value)

    let userData = useSelector((state) => state.userData.value)


    const dispatch = useDispatch()

    const handleForm = (e) => {
        //console.log(e.target.value)
        setFormData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }


    function loginReq(){
        axios({
            method:'POST',
            url:"http://localhost:5000/login",
            data:{Form},
            headers: {
                "content-Type": "application/json",
            }
        }).then(res => { 
            //console.log(res)
            let todos = res.data.todos
            let goals = res.data.goals
            let sets = res.data.sets
            //console.log(sets)

            dispatch(changeOnline({
                ...userData,
                personal:{
                    name: res.data.name,
                    age: res.data.age,
                },
                online:true,
                todos: todos,
                goals: goals,
                flashCards:{
                    ...userData.flashCards,
                    sets:sets,
                }
            }))

            dispatch(navStateAll({
                ...navState,
                navModals: {
                    ...navState.navModals,
                    user:{
                        ...navState.navModals.user,
                        open: false,
                        UserModals: {
                            ...navState.navModals.user.UserModals,
                            signup: false,
                        }
                    }
                }
            }))

            navigate("/")
        }) 
        .catch((err) => { //if login credentials dont exist
            console.log(err.response)
        })

    }

    function signUpReq(){
        axios({ //sending form data to backend
            method:'POST',
            url:"http://localhost:5000/signup",
            data:{Form},
            headers: {
                "content-Type": "application/json"
            }
        }).then(res => {
            //console.log(res)
        })
        .catch((err) => {
            console.log(`unreachable email: ${err.response}`)
        })
    }

    function resetForm(){ //reset form inputs when submit button is clicked
        setFormData({
            email: "",
            password: "",
            age: "",
            name: ""
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()

        if(e.target.id === "logIn-btn"){ //when login button is clicked
            if( // soft checking if password and email entered is valid
                !/[a-z]/g.test(Form.password) ||
                !/[A-Z]/g.test(Form.password) ||
                !/[0-9]/g.test(Form.password) ||
                !Form.password.length >= 8 ||
                !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Form.email) //gotta figure this one out
            ){ //if not reset form and return
                resetForm()
                return
            }

            //if email and password entered are valid start the login function
            loginReq()
        }
        else if (e.target.id === "signUp-btn"){ //if signup button is clicked
            if( //soft checking if entered credentials are valid
                !/[a-z]/g.test(Form.password) ||
                !/[A-Z]/g.test(Form.password) ||
                !/[0-9]/g.test(Form.password) ||
                !Form.password.length >= 8 ||
                !Form.age >= 3 ||
                !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Form.email) //gotta figure this one out
            ){ // if not we reset the form and return 
                resetForm()
                return
            }
            // if the entered credentials are valid we start the signup function
            signUpReq()
        }

        //we reset the form when login / signup is succesfull
        resetForm()

    }

    function handleLogout(){
        console.log("start logout function")
        
        axios({ //sending form data to backend
            method:'POST',
            url:"http://localhost:5000/logout",
            data:{data:userData.todos, user:userData.personal.name, goals:userData.goals, sets:userData.flashCards.sets},
            headers: {
                "content-Type": "application/json"
            }
          }).then(res => {
              //console.log(res)
          })
          .catch((err) => {
              console.log(err.response)
          })

        dispatch(changeOnline({
            ...userData,
            online:false,
            personal:{
                name:"",
                age:"",
            },
            todos: {},
            goals: {},
            flashCards:{
                ...userData.flashCards,
                sets:{},
                activeSet:[],
            }
        }))

        navigate("/login")
    }


    return(
        <Routes>
            <>
            <Route path="/login" element={<Login form={Form} navState={navState} userData={userData} handleForm={handleForm} handleFormSubmit={handleFormSubmit} />}> </Route>
            <Route path="/signup" element={<Signup form={Form} navState={navState} userData={userData} handleForm={handleForm} handleFormSubmit={handleFormSubmit}  />}> </Route>
            <Route path="/userProf" element={<UserProf logout={handleLogout} userData={userData}/>}> </Route>
            </>
        </Routes>
    )
}







function Login(props){

    return(
        <div className="userModal-container">

            {!props.userData.online && props.navState.navModals.user.open? <>
            <div className="userModal-info-container">
                <p>
                    DASH
                </p>
            </div>
            <div className="userModal-form-container">
                <div className="responsive-form">
                    <div className="userModal-greeting">
                        <h1>DASH</h1>
                        <p>Welcome back</p>
                    </div>
                    <form className="userModal-form">
                        <TextField  id="logIn-email" label="Email" name="email" variant="outlined" type="email" value={props.form.email} onChange={props.handleForm}
                            sx={{width:"20vw", fontSize:"1vw"}}
                        />
                        <TextField  id="logIn-password"  label="Password"  name="password" variant="outlined" value={props.form.password} type="password" onChange={props.handleForm} 
                            sx={{width:"20vw", fontSize:"1vw"}}
                        />
                        <Button id="logIn-btn" 
                            onClick={props.handleFormSubmit}
                            sx={{width:"15vw", fontSize:"1vw"}}
                        >Log in</Button>
                        <Button  
                            sx={{width:"15vw", fontSize:"1vw"}}
                        >Log in with Google</Button>
                    </form>
                    <div >
                        <p>Dont have an account? <Link to="/signup" >Sign up</Link></p>
                    </div>
                </div>
            </div>
            </> : ""}
        </div>
    )
}

function Signup(props){
    //console.log(props)

    return(
        <div className="userModal-container">

            {!props.userData.online && props.navState.navModals.user.open? <>
            <div className="userModal-info-container">
                
            </div>
            <div className="userModal-form-container">
                <div className="userModal-signup-greeting">
                    <h1>DASH</h1>
                    <p>Welcome back</p>
                </div>
                <form className="userModal-form">
                    <div className="signUp-nameAndAge">
                        <TextField 
                            id="signUp-name" 
                            label="Full Name" 
                            variant="outlined"
                            className="textfield-name input"
                            value={props.form.name}
                            type="text"
                            name="name"
                            sx={{width:"16vw", fontSize:"1vw"}}
                            onChange={props.handleForm}
                        />
                        <TextField 
                            id="signUp-age" 
                            type="number"
                            label="Age" 
                            name="age"
                            value={props.form.age}
                            className="input"
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                            variant="outlined"
                            onChange={props.handleForm}
                            sx={{width:"4vw", fontSize:"1vw", float:"right"}}
                        />
                    </div>
                    <TextField value={props.form.email}  id={`signUp-email`} className={`input`} 
                        label="Email" type="email" name="email" 
                        variant="outlined" onChange={props.handleForm} 
                        sx={{width:"20vw", fontSize:"1vw", '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: ""}}}}/>
                    <TextField value={props.form.password} id="signUp-password"  className="input" label="Password" name="password" variant="outlined" type="password" onChange={props.handleForm} sx={{width:"20vw", fontSize:"1vw"}}/>
                    <Button id="signUp-btn" onClick={props.handleFormSubmit} sx={{width:"15vw", fontSize:"1vw"}} >Sign Up</Button>
                    <Button sx={{width:"15vw", fontSize:"1vw"}}>Sign Up With Google</Button>
                    <div className="userModal-sign-form-link">
                        <p>Already have an account? <Link to="/login">Log In</Link></p>
                    </div>
                </form>
            </div>
            </> : ""}
        </div>
    )
}

function UserProf(props){
    //console.log(props.auth)
    return(
        <div className="userModal-container">
            {props.userData.online ? 
            <>
            <div className="userProf-container">
                <div className="user-card">
                    {/*<div className="user-picture">
                    </div>*/}
                    <div className="user-info">
                        <p>{props.userData.personal.name}</p>
                    </div>
                </div>
                <div className="user-logout-btn">
                <LogoutIcon
                    sx={{color:"black", fontSize:"3.5vw"}}
                    onClick={props.logout}
                />
                </div>
            </div>
            </>
            
            : console.log("test2")}
        </div>
    )
}
