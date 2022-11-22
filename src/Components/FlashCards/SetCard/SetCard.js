import React from "react"
import "./SetCard.css"

import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {toggleflashCardNav, setActiveSet} from "../../Features/logedUserData.js"

export default function SetCard(props){

    //console.log(props)

    const dispatch = useDispatch()
    const flashCardNav = useSelector((state) => state.userData.value.flashCards.navigation)

    function handleOpenSet(e){ //shows learnset component
        dispatch(toggleflashCardNav({
            ...flashCardNav,
            learnSet:true,
        }))
        const data = {name:props.setName, data:props.data} //gets set card data such as questions/answers from props and saves them to an object
        dispatch(setActiveSet(data)) //send that data to redux setActiveSet reducer
    }

    return(
        <div className="setCard-container" onClick={handleOpenSet}>
            <p className="setCard-name">
                {props.setName}
            </p>

            <div className="setCard-overview">
                <p className="setCard-overview-totalQuestions">
                    {props.totalQuestions} Questions
                </p>
            </div>

            <p className="setCard-lastScore">
                
            </p>
        </div>
    )
}