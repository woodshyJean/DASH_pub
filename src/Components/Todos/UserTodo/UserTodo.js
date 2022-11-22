import React,  {useEffect, useState} from "react";

import "./userTodo.css"

import {useDispatch} from "react-redux";
import { toggleActiveTodo, setNotification } from "../../Features/logedUserData";

import BackpackIcon from '@mui/icons-material/Backpack';

import UserLink from '../Addtodo/Link/UserLink.js'
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';



export default function UserTodo(props){  
    let today = new Date() //todays date
    const due = +( new Date(props.dueDate)) //date of when todo is due
    let todoColor; //variable to hold the todo color

    //console.log(props)

    const dispatch = useDispatch()

    if(today > due){ //set color to red if the todo is late
        todoColor = "#FAA0A0"
    }
    else if (today < due){ //set color to green if the todo is not late
        todoColor = "#b8d8be"
    }
    else{
        todoColor = "#3c3b3c"; //invalid date
    }

    function handleSetActive(){ //toggles whether todo is active or not
        dispatch((toggleActiveTodo({todo:props.todo, goal:props.relatedGoal})))
    }

    useEffect(() => {  //x minute reminder before a todo is due
        if(today > due || today === due || !props.active || !props.dueDate || !props.reminder) return //if the todo is late, completed, has invalid date or doesnt have reminder set return

        const now = Date.now(); //current date
        const later = new Date(props.dueDate); //date when todo is due
        let secondsBefore = +props.reminder * 60 //the ammount of seconds before a todo is due to remind
        const reminder = Math.floor(((later - now) / 1000)) - secondsBefore //the ammount of time before the anticipated reminder
        //console.log(reminder)
        if(reminder < 0) return //if the ammount of time before reminder is less than zero return

        let timeout = setTimeout(() => { //run the code to start the notification once the reminder ammount of time has passed
            dispatch(setNotification({type:"todo", data:{name:props.todo, in:props.reminder}})) //sends todo reminder data to redux reducer
            return clearTimeout(timeout) //clear timeout
        }, reminder * 1000)

        return () => clearTimeout(timeout) //clear the timeout
    },[due])


    let links;
    if(props.hasBag){ //creates link components for the links listed for the todo
        try {
            links = props.links.map((el) => {
                return (
                    <UserLink
                        key={el.name}
                        link = {el.link}
                        name = {el.name}
                    />
                )
            })
        } catch (error) {
            
        }
    }
    
    let [bag, setBag] = useState({
        show:false,
    })

    function showBag(e){// toggles whether if the bag is shown or not
        setBag((prev) => {
            return{
                ...prev,
                show: !prev.show,
            }
        })
    }

    return(
        <div key={props.todo} className="userTodo-container" >

            {props.type !== "simple" ?  !props.active ? <CircleIcon sx={{fontSize:"2.25vw"}} onClick={handleSetActive}/> : <CircleOutlinedIcon sx={{fontSize:"2.25vw"}} onClick={handleSetActive}/>
            : ""}

            <p className="todo-name-text" style={bag.show ? {display:"none"} : {display:""}}>{props.todo}</p> 
            
            <div className="todoBag" style={bag.show ? {display:"flex"} : {display:"none"}}>
                <div className="todoBag-links">
                    {links}
                </div>

                <div className="todoBag-notes">
                    <p>{props.note}</p>
                </div>
            </div>

            <div className="todo-date" style={bag.show ? {display:"none"} : {display:""}}>
                <p className="todo-date-text todo-date" style={{backgroundColor:todoColor}}  >{ new Date(props.dueDate).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>

            <div className="todo-difficulty" style={bag.show ? {display:"none"} : {display:""}}>
                <p className="todo-text-label">difficulty</p>
                <p className="todo-difficulty-text">{`${props.difficulty}/5`}</p>
            </div>

            <div className="todo-priority" style={bag.show ? {display:"none"} : {display:""}}>
                <p className="todo-text-label">priority</p>
                <p className="todo-priorty-text">{props.priority}</p>
            </div>


           {props.type !== "simple" ? props.hasBag ? 
                    <div className="todoBag-icon" style={bag.show ? {color:"#4568dc"} : {display:""}}>
                        <BackpackIcon
                            sx={{display:"flex", fontSize:"1.5vw"}}
                            onClick={showBag}
                        />
                    </div>
                 : 
                 <BackpackIcon
                 sx={{opacity:".5", fontSize:"1.5vw"}}

              />
            : 
            ""}
        </div>
    )
}

