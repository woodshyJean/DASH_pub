import React from "react";
import GetQuote from "./Quote/Quote";
import Greeting from "./Greeting/Greeting";
import Weather from "./Weather/Weather";
import CurrentDate from "./CurrentDate/CurrentDate";
import {useSelector} from "react-redux"
import "./QuickInfo.css"

export default function QuickInfo(){
    let navModalState = useSelector((state) => state.Nav.value.navModals)
    //console.log("QuickInfo")

    return(
        <div className="quickinfo-container">
            {navModalState.user.open || navModalState.flashCards.open || navModalState.todos.open ? "" :   //if any of the modals are open we hide the main time
                <>
                    <Weather/>
                    <div className="quickinfo-right">
                        <Greeting/>
                        <GetQuote/>
                        {/*<CurrentDate/>*/}
                    </div>
                </>
            }
        </div>
    )
}
