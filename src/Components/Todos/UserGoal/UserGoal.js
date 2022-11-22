import React from "react";
import "./UserGoal.css"

import UserTodo from "../UserTodo/UserTodo";
import {useDispatch} from "react-redux";
import { deleteGoal } from "../../Features/logedUserData";

export default function UserGoal(props){  

    let dispatch = useDispatch()

    //console.log(props)
    if(!props.relatedTodos) return

    let todos = Object.values(props.relatedTodos).map((el) => { //creates a simple version of userTodo component
        //console.log("todos active:", el.active)
        return [
            <UserTodo
                key = {el.todo}
                type = {"simple"}
                todo = {el.todo}
                dueDate = {el.dueDate}
                priority = {el.priority}
                difficulty = {el.difficulty}
                relatedGoal = {el.relatedGoal}
                active = {el.active}
            />
        ]
    })

    const relatedTodosNum = (Object.keys(props.relatedTodos).length) //ammount of related todos

    let date = new Date(props.goalDueDate).toLocaleString()

    function deleteThisGoal(){ //delete a goal
        dispatch(deleteGoal(props.goal))
    }


    return(
        <div className="userGoal-container">
            <div className="userGoal-statement">
                <p className="userGoal-statement-text" >I will {props.goal} by {date} in order to {props.goalPurpose} or else {props.goalFail1}</p>
                <p className="userGoal-delete" onClick={deleteThisGoal}>DELETE</p>
            </div>

            <div className="userGoal-seperator">
                <hr></hr>
                <p>Related Todos {`${relatedTodosNum}`}</p>
                <hr></hr>
            </div>

            <div className="userGoal-relatedTodos">
                {todos}
            </div>
        </div>
    )
}
