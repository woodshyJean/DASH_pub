import React, {useState} from "react";
import "./Quote.css"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from "axios"

//import {useSelector} from "react-redux"

export default function GetQuote(){

    let [quoteState, setQuoteState] = useState({
        queries:"",
        quote:"",
        quoteAuthor:"",
    })

    async function getAQuote(){
        /*
            api call returns an array of multiple quotes, a better way to handle this function
            while also making the least ammount of api calls is to save the data received to state and only allow api 
            calls when a different tag is used from the previous call
        */
        let userQueries = quoteState.queries.split(","); //seperate tags inputed at the comma
        if(quoteState.queries === "") return
        axios({
            method:'POST',
            url:"http://localhost:5000/quote",
            data:{queries:userQueries}, //tags
            headers: {
                "content-Type": "application/json",
        }}).then(res => {
            try {
                let data = res.data.data.results //received data
                if(data.length <= 0) return; //if theres no data in the arr return
                console.log(data)
                let randomQuoteIndex = Math.floor(Math.random() * ( data.length - 1)); //random number
                let displayedQuote = data[randomQuoteIndex] //get a random quote using the random number as an array index
                setQuoteState(prev => { //set react state with the chosen quote data
                    return{
                        ...prev,
                        quote:displayedQuote.content,
                        quoteAuthor:displayedQuote.author,
                    }
                })
            } catch (error) {
                console.log(error)
            }
        })
            .catch(err => console.log(err))
    }

    //console.log(quoteState)

    function handleQuoteTags(e){ //function that reads textfield input
        //console.log(e.target.value)
        setQuoteState(prev => {
            return{
                [e.target.name]: e.target.value
            }
        })
    }

    //console.log(quoteState)

    return(
        <div className="quote-container">
            <div className="quote-text">
                {quoteState.queries === "" || quoteState.queries === ''? <p>Add a tag to get a random quote</p> : <><p className="quote-text-content">{quoteState.quote}</p>
                <p className="quote-text-author">—{quoteState.quoteAuthor}</p></>}
            </div>
            <div className="quote-controls">
                <TextField name='queries' 
                    sx={{input: { color: "black"},
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'black',
                          borderRadius:"5px", 
                        },
                }}} placeholder="seperate tags with ," onChange={handleQuoteTags}/>
                <Button onClick={getAQuote} 
                    sx={{backgroundColor:"red", height:"6vh"}}
                >get</Button>
            </div>
        </div>
    )
}