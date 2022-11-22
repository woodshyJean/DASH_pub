import React from "react";

import "./CurrentDate.css"


export default function CurrentDate(){

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    let getDay = days[new Date().getDay()]
    let getDate = new Date().getDate()
    let getMonth = months[new Date().getMonth()]
    let year = new Date().getFullYear()

    //console.log(getDay, getDate, getMonth, year)

    console.log("CurrentDate")

    return (
        <div className="date-container">
            <p className="date">{`${getDay} ${getDate}`}</p>
            <p className="date">{`${getMonth} ${year}`}</p>
        </div>
    )
}