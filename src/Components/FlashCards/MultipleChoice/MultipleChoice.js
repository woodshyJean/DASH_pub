import React, {useEffect, useState } from "react";
import "./MultipleChoice.css"

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import {useDispatch} from "react-redux";
import {addNewSet} from "../../Features/logedUserData.js"

export default function MultipleChoiceForm(props){

    console.log(props)

    const dispatch = useDispatch()

    //console.log(props)
    const mcStackStyles = {
        width:"45%",
        maxHeight:"400px",
    }

    const mcTextFieldStyles = {
        minHeight:"100%",
        input:{color:"white"},
        '& .MuiInput-underline:before': {
            borderBottomColor: 'white',
            borderWidth:"5px"
        }
    }

    const answerLetters = ["A", "B", "C", "D", "E", "F", "G" ,"H", "I", "J"]

    const [multipleChoiceState, setMultipleChoiceState] = useState({
        numGenAnswers:1,
        setName:"",
        type:"multipleChoice",
        question:"",
        correctAnswers:{

        },
        wrongAnswers:{

        }
    })


    useEffect(() => {
        let questionInput = document.querySelector("#flashCard-question-input")
        let setName = document.querySelector("#flashcard-setName")
        setMultipleChoiceState((prev) => {
            return{
                ...prev,
                setName:setName.value, //gets name of the set from the input field
                question:questionInput.value, // gets the question from the input field
            }
        })
    }, [props.Question, props.setName])

    const createdTextFields = [] //array to hold created multiple choice answer text fields

    for(let i = 1; i < multipleChoiceState.numGenAnswers; i++){ //creates i ammount of textfields that a user can input an answer to
        let newTextField = <TextField
                                variant="standard"
                                sx={mcTextFieldStyles}
                                name={answerLetters[i]}
                                key={answerLetters[i]}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <p style={{color:"white"}}>{answerLetters[i]}</p>
                                      </InputAdornment>
                                    ),
                                    endAdornment:(
                                        <InputAdornment position="end">
                                            <div className="newSet-answerIndicator" name={answerLetters[i]} onClick={handleWrongAnswer}></div>
                                        </InputAdornment>
                                    )
                                  }}
                            />
        createdTextFields.push(newTextField)//pushing the Textfield element into the array
    }

    function handleChange(e){// handle onChange event of the textfield/ input
        setMultipleChoiceState((prev) => {
            return{
                ...prev,
                correctAnswers:{
                    ...prev.correctAnswers,
                    [e.target.name]: e.target.value
                },
            }
        })
    }

    function addNewAnswer(){// increments the ammount of answer text fields available
        setMultipleChoiceState((prev) => {
            return{
                ...prev,
                numGenAnswers: prev.numGenAnswers += 1,
            }
        })
        //console.log(createdTextFields)
    }

    function handleWrongAnswer(e){ //when run the function will add styles to correct and wrong answers/ change color
        ///console.log(e.target.classList)
        if(e.target.classList.contains("newSet-answerIndicator-active")){
            e.target.classList.remove("newSet-answerIndicator-active")
        }
        else{
            e.target.classList.add("newSet-answerIndicator-active")
        }
        setMultipleChoiceState((prev) => {
            return{
                ...prev,
                wrongAnswers:{
                    ...prev.wrongAnswers,
                    [e.target.attributes[1].value]: false
                }
            }
        })
    }


    function submitSet(){ //adding a new Q/A block
        if(!multipleChoiceState.setName || !multipleChoiceState.question || 
            Object.keys(multipleChoiceState.correctAnswers).length === 0 || 
            Object.keys(multipleChoiceState.wrongAnswers).length === 0) return
            //if theres not setname, question, chosen answer stop running

        dispatch(addNewSet({ //send the Q/A block to the backend
            setName:multipleChoiceState.setName,
            data:{
                number:props.totalQuestions,
                type:multipleChoiceState.type,
                question:multipleChoiceState.question,
                answers:multipleChoiceState.correctAnswers,
                wrongAnswers:multipleChoiceState.wrongAnswers
            }
        }))

        props.incrementMultipleC()//increment the number of mc questions

        setMultipleChoiceState((prev) => { //reset the state of the component
            return{
                ...prev,
                numGenAnswers:1,
                question:"",
                correctAnswers:{

                },
                wrongAnswers:{
        
                }
            }
        })

        props.setTotal()
    }

    //console.log(multipleChoiceState)

    return (
        <>
            <Stack
                sx={mcStackStyles}
                spacing={3}
            >
                <TextField
                    variant="standard"
                    name="A"
                    sx={mcTextFieldStyles}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <p style={{color:"white"}}>A</p>
                          </InputAdornment>
                        ),
                        endAdornment:(
                            <InputAdornment position="end">
                                <div className="newSet-answerIndicator" name="A" onClick={handleWrongAnswer}></div>
                            </InputAdornment>
                        )
                      }}
                />
                {createdTextFields}
                <Stack direction="row" sx={{display:"flex", justifyContent:"space-between"}}>
                    <Button 
                        sx={{width:"25%",/* backgroundColor: "RED",
                        '&:hover': {
                        backgroundColor: "RED",
                        }*/}} 
                        variant="outlined" 
                        onClick={addNewAnswer}
                    >Add Answer
                    </Button>
                    <Button sx={{width:"25%"}} variant="outlined" onClick={submitSet}>Add Question Set</Button>
                </Stack>
                <Stack sx={{display:"flex", alignItems:"end"}}>
                    <Button sx={{width:"25%"}} variant="outlined" onClick={props.completeSet}>Complete</Button>
                </Stack>
            </Stack>
        </>
    )
}
