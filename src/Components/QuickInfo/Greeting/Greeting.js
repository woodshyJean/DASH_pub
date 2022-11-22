import React from "react";

import {useSelector} from "react-redux"

import "./Greeting.css"

export default function Greeting(){

    let userData = useSelector((state) => state.userData.value.personal)

    let firstName = userData.name.split(" ")[0]

    return(
        <div className="greeting-container">
            <p className="greeting">
                <p>Hello!</p>
                <p className="greeting-name">{firstName}</p>
            </p>
        </div>
    )
}