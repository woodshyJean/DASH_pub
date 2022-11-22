import React, {useState} from "react"
import "./SetSlider.css"

import SetCard from "../SetCard/SetCard";

import {useSelector} from "react-redux"

export default function SetSlider(){
    /*
        a componet that would allow sets to be cycled through rather than be displayed one after the other
    */
    const FlashCardData = useSelector((state) => state.userData.value.flashCards.sets);

    let setsData;
    try {
        setsData = Object.values(FlashCardData) //creates array from flashcard data object values
    } catch (error) {
    }

    let userSets;
    try {
        userSets = setsData.map((el) => {
            let numQuestions = Object.values(el)
            //console.log(numQuestions)
            return(
                <SetCard
                    setName={el.setName}
                    totalQuestions={numQuestions.length - 1}
                    data={numQuestions}
                />
            )
        })
    } catch (error) {
        //console.log(error)
    }

    console.log(userSets)

    const [userSetNums, setUserSetNums] = useState({
        set0:Math.floor(((userSets.length - 1) / 2) - 2),
        set1:Math.floor(((userSets.length - 1) / 2) - 1),
        set2:Math.floor(((userSets.length - 1) / 2)),
        set3:Math.floor(((userSets.length -1) / 2) + 1),
        set4:Math.floor(((userSets.length -1)/ 2) + 2),
    })

    console.log(userSetNums)

    function handleMoveSliderRight(e){
        if(userSetNums.set4 === userSets.length - 1) return
        setUserSetNums(prev => {
            return{
                ...prev,
                set0: prev.set0 + 1,
                set1:prev.set1 + 1,
                set2: prev.set2 + 1,
                set3: prev.set3 + 1,
                set4: prev.set4 + 1
            }
        })
    }

    function handleMoveSliderLeft(e){
        if(userSetNums.set0 === 0){

            setUserSetNums(prev => {
                return{
                    ...prev,
                    set0: (userSets.length - 1) - 0,
                    set1:(userSets.length - 1) - 1,
                    set2: (userSets.length - 1) - 2,
                    set3: (userSets.length - 1) - 3,
                    set4: (userSets.length - 1) - 4,
                }
            })

        }
        if(userSetNums.set1 <= 0 || userSetNums.set2 <= 0 || userSetNums.set3 <= 0 || userSetNums.set4 <= 0){
            setUserSetNums(prev => {
                return{
                    ...prev,
                    set1: userSets.indexOf(userSets[prev.set1], 0),
                    set2: userSets.indexOf(userSets[prev.set2], 0),
                    set3: userSets.indexOf(userSets[prev.set3], 0),
                    set4: userSets.indexOf(userSets[prev.set4], 0),
                }
            })
        }
        setUserSetNums(prev => {
            return{
                ...prev,
                set0: prev.set0 - 1,
                set1:prev.set1 - 1,
                set2: prev.set2 - 1,
                set3: prev.set3 - 1,
                set4: prev.set4 - 1
            }
        })
    }

    return (
        <div className="setSlider-container">
            <div className="setSlider-leftBtn" onClick={handleMoveSliderLeft}>

            </div>

            <div className="setSlider-set0">
                {userSets[userSetNums.set0]}      
            </div>

            <div className="setSlider-set1">
                {userSets[userSetNums.set1]} 
            </div>

            <div className="setSlider-set2">
                {userSets[userSetNums.set2]} 
            </div>

            <div className="setSlider-set3">
                {userSets[userSetNums.set3]} 
            </div>

            <div className="setSlider-set4">
                {userSets[userSetNums.set4]} 
            </div>

            <div className="setSlider-rightBtn" onClick={handleMoveSliderRight}>

            </div>
        </div>
    )
}