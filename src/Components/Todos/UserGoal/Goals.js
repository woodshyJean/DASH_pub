import React, {useEffect, useState} from "react";

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UserGoal from "./UserGoal";

import {useSelector} from "react-redux";

import "./Goals.css"

export default function Goals(){

    const todoData = useSelector((state) => state.userData.value)

    let [shownGoal, setShownGoal] = useState(0)

    let goals =  Object.values(todoData.goals).map((el) => { //create usergoal components
        
        try {
            //if(el === undefined) return
            return [
                <UserGoal
                    key = {el.goal}
                    goal = {el.goal}
                    goalDueDate = {el.goalDueDate}
                    goalPurpose = {el.goalPurpose}
                    goalFail1 = {el.goalFail1}
                    goalFail2 = {el.goalFail2}
                    goalFail3 = {el.goalFail3}
                    relatedTodos = {el.relatedTodos}
                />
            ]
        } catch (error) {
            
        }
    })
    .filter((el) => el)

    //console.log(goals)

    function handlePrev(e){//show prev goal
        if(goals.length === 0) return 
        
        if(shownGoal === 0){ //if showing the first goal
            setShownGoal((prev) => prev = goals.length - 1) //show the last goal
        }
        else{
            setShownGoal((prev) => prev - 1) //decrement the shown goal index
        }
    }

    function handleNext(e){ //show next goal
        if(goals.length === 0) return 

        if(shownGoal === goals.length - 1){ //if showing the last goal
            setShownGoal(0) //show the first goal
        }
        else{
            setShownGoal((prev) => prev + 1) //increment the shown goal index
        }
    }

    return (
        <>
        <div className={`todos-goals-summary-container`} >
                <KeyboardArrowUpIcon
                    sx={{transform:"rotate(-90deg) scale(1.5,1.5)", color:"black", fontSize:"2rem"}}
                    onClick={handlePrev}
                />
                {goals[shownGoal]}
                <KeyboardArrowUpIcon
                    sx={{transform:"rotate(90deg) scale(1.5,1.5)", color:"black", fontSize:"2rem"}}
                    onClick={handleNext}
                />
        </div>
        </>
    )
}