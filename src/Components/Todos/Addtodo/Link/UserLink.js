import React from "react";
import "./UserLink.css"

import InsertLinkIcon from '@mui/icons-material/InsertLink';

export default function userLink(props){
    //console.log(typeof props.link)
    return (
        <div className="userLink-container">
            <a href={props.link} className="userLink-link" target="_blank" rel='noreferrer'>
                <InsertLinkIcon/>
                <p>
                    {props.name}
                </p>
            </a>
        </div>
    )
}