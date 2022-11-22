import React, {useState} from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';

import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";

import { toggleIsOpen } from "../../Features/AddTodoState";
import { deleteCompletedTodo } from "../../Features/logedUserData";

import UserTodo from "./UserTodo";

import "./TodoComponent.css"

export default function TodoComponent(){
    
    const dispatch  = useDispatch()

    const todoState = useSelector((state) => state.addTodoState.value)
    const todoData = useSelector((state) => state.userData.value)

    //let [filter, setFilter] = useState("none")
    let [filter, setFilter] = useState({
        none:true,
        completed:false,
        expired:false,
        active:false
    })
  
    let todos = Object.values(todoData.todos).filter((el) => { //filter todos
        if(filter.none){//if theres no filter return all the todos
            return el
        }
        else if(filter.completed){ //return only completed todos
            return !el.active
        }
        else if(filter.expired){ //return expired todos
            let today = new Date()
            let dueDate = new Date(el.dueDate)
            return (dueDate < today)
        }
        else if(filter.active){ //return todos that are still in progress
            let today = new Date()
            let dueDate = new Date(el.dueDate)
            return (dueDate > today && el.active)
        }
        else{
            return el
        }
    })
    .map((el) => { //create components out of the filtered todo data

        return [
            <UserTodo
                key = {el.todo}
                todo = {el.todo}
                dueDate = {el.dueDate}
                priority = {el.priority}
                difficulty = {el.difficulty}
                relatedGoal = {el.relatedGoal}
                active = {el.active}
                reminder = {el.reminder}
                hasBag = {el.hasBag}
                links = {el.links}
                note = {el.note}
            />
        ]

    })


    function handleTodoOpen(e){
        dispatch(toggleIsOpen({
            ...todoState,
            isOpen: !todoState.isOpen
        }))

        //console.log(todoState)
    }


    function clearCompleted(e){ //delete completed todos
        dispatch(deleteCompletedTodo())
    }

    function filterCompletd(){ //run completed filter
        setFilter((prev) => {
            return{
                none:false,
                completed:true,
                expired:false,
                active:false
            }
        })
    }

    function filterAll(){ //filter none
        setFilter((prev) => {
            return{
                none:true,
                completed:false,
                expired:false,
                active:false
            }
        })
    }

    function filterExpired(){ //filter for expired todos
        setFilter((prev) => {
            return{
                none:false,
                completed:false,
                expired:true,
                active:false
            }
        })
    }

    function filterActive(){ //filter for in progress todos
        setFilter((prev) => {
            return{
                none:false,
                completed:false,
                expired:false,
                active:true
            }
        })
    }

    return (
        <>
        <div className={`todos-standalone-container`}>
            {/*<div className="bag">

    </div>*/}
            <div className={`todos-standalone-todos `} >
                {todos}
            </div>
            <div className={`todos-standalone-filter`}>
                <p className={`${filter.none ? "active-filter-btn" : ""}`} onClick={filterAll}>All</p>
                <p className={`${filter.active ? "active-filter-btn" : ""}`} onClick={filterActive}>Active</p>
                <p className={`${filter.expired ? "active-filter-btn" : ""}`} onClick={filterExpired}>Expired</p>
                <AddCircleIcon onClick={handleTodoOpen} sx={{fontSize:"2vw"}} />
                <p className={`${filter.completed ? "active-filter-btn" : ""}`} onClick={filterCompletd}>Completed</p>
                <p onClick={clearCompleted}>Clear Completed</p>
            </div>
        </div>
        </>
    )
}