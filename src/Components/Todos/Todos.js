import React, {useEffect, useState} /*, {useEffect}*/ from "react";
import "./Todos.css"

import AddTodos from "./Addtodo/Addtodo";
import Goals from "./UserGoal/Goals";
import PomodoroFocus from "./Pomodoro/PomodoroFocus";
import TodoComponent from "./UserTodo/TodoComponent";

import {useSelector} from "react-redux";

export default function Todos(){

    let todoState = useSelector((state) => state.addTodoState.value)

    return(
        <div className={`todos-modal-container`}>
            {todoState.isOpen? <AddTodos/> :""}
            <Goals/>
            <div className="todos-right-container">
                <TodoComponent/>    
                <div className={`todos-pomodoro-container`} >
                    <div className="todos-pomodoro-settings">
                        <PomodoroFocus/>
                    </div>
                </div>
            </div>
        </div>
    )
}
