import React , {useState} from "react";
import "./LearnSet.css"

import {useSelector} from "react-redux"
import {useDispatch} from "react-redux";
import {toggleflashCardNav, removeActiveSet} from "../../Features/logedUserData.js"

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function LearnSet(){

    const  dispatch = useDispatch()
    const flashCardNav = useSelector((state) => state.userData.value.flashCards.navigation)
    const activeSet = useSelector((state) => state.userData.value.flashCards.activeSet)

    function handleCloseSet(){ //function that closes active set
        dispatch(removeActiveSet()) //run remove active set reducer
        dispatch(toggleflashCardNav({ //hide the learnset component
            ...flashCardNav,
            learnSet:false,
        }))
    }

    const [learnSetState, setLearnSetState] = useState({
        flashcard:true,
        learn:false,
        test:false,
    })

    function setFlashcard(){ //activates flashcard option
        setLearnSetState((prev) => {
            return{
                ...prev,
                flashcard: true,
                learn:false,
                test:false,
            }
        })
    }

    function setLearn(){ //activates learn option
        setLearnSetState((prev) => {
            return{
                ...prev,
                learn: true,
                flashcard:false,
                test:false,
            }
        })
    }

    function setTest(){ //activates test option
        setLearnSetState((prev) => {
            return{
                ...prev,
                learn: false,
                flashcard:false,
                test:true,
            }
        })
    }

    let mode;
    if(learnSetState.flashcard){ // renders flashcard/ learn / test settings dependent on if theyre state value is true
        mode = <LearnFlashCard/>
    }
    else if(learnSetState.learn){
        mode = <LearnOption/>
    
    }
    else if(learnSetState.test){ //test option not completed yet
        mode = ""
        /*<TestOption/>*/
    }

    return (
        <div className="learnSet-container">
            <div className="learnSet-options-container">
                <div className="learnSet-options">
                    <Button className={`learnSet-Options-btn`} sx={{backgroundColor:`${learnSetState.flashcard ? "" : ""}`, fontSize:"1rem" , fontFamily:'Roboto Mono, monospace', color:"black" }} onClick={setFlashcard}>
                        Flash
                    </Button>
                    <Button className={`learnSet-Options-btn`} sx={{backgroundColor:`${learnSetState.learn ? "" : ""}`, fontSize:"1rem" , fontFamily:'Roboto Mono, monospace', color:"black"}}  onClick={setLearn}>
                        Learn
                    </Button>
                    <Button className={`learnSet-Options-btn`} sx={{fontSize:"1rem" , fontFamily:'Roboto Mono, monospace', color:"black" }} onClick={setTest}>
                        Test
                    </Button>
                </div>
                <div className="learnSet-options-name-container">
                    <div className="learnSet-options-name">
                        <p>{activeSet[0][0].setName != undefined ? activeSet[0][0].setName : ""}</p>
                        <CloseOutlinedIcon className="learnSet-options-closeBtn" onClick={handleCloseSet}>
                        </CloseOutlinedIcon>
                    </div>
                </div>
            </div>

            <div className="learnSet-main">
                {mode}
            </div>
        </div>
    )
}

//rgb(79, 255, 176)

function LearnFlashCard(){

    const activeSet = useSelector((state) => state.userData.value.flashCards.activeSet)

    const [iterate, setIterate] = useState({ //an iterator thats used to cycle through flashcard questions / answers
        question:0,
    })


    const [flashcards, setFlashCards] = useState({
        flip:false, //used to show question or answer of a flashcard
    })


    function handleFlip(){ //function that toggles between question / answer side of a flashcard
        setFlashCards((prev) => {
            return{
                ...prev,
                flip: !prev.flip,
            }
        })
    }

    let cardColor;
    if(flashcards.flip){//adds color styling dependent on whether a question or an answer is shown
        cardColor = "learnSet-Answer"
    }
    else{
        cardColor = "learnSet-Question"
    }

    function handleNext(){ /**function that shows the next answer/question set*/
        //console.log(activeSet[0].length - 1)
        if( iterate.question >= activeSet[0][1].data.length - 1){ //returns the question/answer iterator back to 0 once its reached the end of the array
            setIterate((prev) => {
                return{
                    ...prev,
                    question:0,
                }
            })
        }
        else{// if the question/answer iterator isnt at the end of the ray, the function will add to the iterator everytime its called
            setIterate((prev) => {
                return{
                    ...prev,
                    question: prev.question++,
                }
            })
        }
    }

    function handlePrev(){ //function that shows the previous question/answer set in the array
        if( iterate.question <= 0){ //if the function is ran and the iterator is at zero, then set iterator to the last question/answer
            setIterate((prev) => {
                return{
                    ...prev,
                    question:activeSet[0][1].data.length - 1,
                }
            })
        }
        else{// if the iterator is not at 0 continue to decrement it
            setIterate((prev) => {
                return{
                    ...prev,
                    question: prev.question--,
                }
            })
        }
    }

    let currentQuestion;
    if(activeSet[0][1].data[iterate.question].type === "simple"){//if the question type is simple / open
        if(!flashcards.flip){ //show the question
            currentQuestion = activeSet[0][1].data[iterate.question].question
        }
        else{ //show the answer
            currentQuestion = activeSet[0][1].data[iterate.question].answer
        }
    }
    else if(activeSet[0][1].data[iterate.question].type === "multipleChoice"){ //if the type of question is multiple choice
        if(!flashcards.flip){//show the question
            let question = activeSet[0][1].data[iterate.question].question //variable to hold the question
            let answerChoice = Object.keys(activeSet[0][1].data[iterate.question].answers) //variable to hold the answer letters (A,B,C,D,etc)
            let answerValue = Object.values(activeSet[0][1].data[iterate.question].answers) //variable to hold the answer values
            let format = answerChoice.map((el, index) => { //for every answer letter create a <p> element that displays the letter and its corresponding value
                return ( // el is the letters, and answerValue[index] is the corresponding answer
                    <p>
                        {el}: {answerValue[index]} 
                    </p>
                )
            })
            currentQuestion = ( // a html block of elements that hold the question and the formated multiple choice answers
                <>
                    <p>{question}</p>
                    {format}
                </>
            )
        }
        else{ //reveal the correct multiple choice answers
            let correctAnswers = Object.keys(activeSet[0][1].data[iterate.question].wrongAnswers) //variable to hold the correct answers
            currentQuestion = []
            correctAnswers.map((el) => { // for every answer create an html element that has the question letter and answer formated
                return currentQuestion.push(
                    <p>
                     {el}: {activeSet[0][1].data[iterate.question].answers[el]}
                    </p>
                    )
            })
        }
    }

    return (
        <>
        <div className="learnSet-flashcard-container">
            <div className={`learnSet-flashcard-main ${cardColor}`} onClick={handleFlip}>
                {currentQuestion}
            </div>
            <div className="learnSet-flashcard-btn-container">
                <div className="learnSet-flashcard-prevBtn" onClick={handlePrev}>PREV</div>
                <div className="learnSet-flashcard-nextBtn" onClick={handleNext}>NEXT</div>
            </div>
            <p className="learnSet-flashcard-questionNumber"> {iterate.question} / {activeSet[0][1].data.length - 1}</p>
        </div>


        {/*<div className="learnSet-flashcard-prevBtn" onClick={handlePrev}>PREV</div>
        <div className={`learnSet-flashcard-main ${cardColor}`} onClick={handleFlip}>
            {currentQuestion}
        </div>
    <div className="learnSet-flashcard-nextBtn" onClick={handleNext}>NEXT</div>*/}
        </>
    )
}

function LearnOption(){

    const activeSet = useSelector((state) => state.userData.value.flashCards.activeSet)

    const randomInt = (max, min) => Math.round(Math.random() * (max - min)) + min; //function that generates a random number in a range

    let [currentQuestion, setCurrentQuestion] = useState({ //extracting data from active set
        question:activeSet[0][1].data[0].question, //question
        questionType:activeSet[0][1].data[0].type, //question type
        answer:activeSet[0][1].data[0].answer,  //open answer
        multipleChoice:activeSet[0][1].data[0].answers, //multiple choice answers
        correctMcAnswers:activeSet[0][1].data[0].wrongAnswers, //correct answers
        userAnswer:"Type Answer Here",
        showCorrect:""
    })

    function handleNextQuestion(){ //retreives another question / answer set
        let questionNumber = randomInt(activeSet[0][1].data.length - 1, 0) //generates a random question
        setCurrentQuestion((prev) => { //changes state to show data on the generated question number
            return {
                ...prev, 
                question:activeSet[0][1].data[questionNumber].question,
                answer:activeSet[0][1].data[questionNumber].answer,
                multipleChoice:activeSet[0][1].data[questionNumber].answers,
                correctMcAnswers:activeSet[0][1].data[questionNumber].wrongAnswers,
                questionType:activeSet[0][1].data[questionNumber].type,
                userAnswer:"",
                showCorrect:"",
            }
        })
    }

    function handleChosenAnswer(e){ //highlights user chosen mc answer
        if(e.target.classList.contains("userChosen-Answer")){
            e.target.classList.remove("userChosen-Answer")
            delete currentQuestion.userMultipleChoiceAnswer[e.target.attributes[1].value]
        }
        else{
            e.target.classList.add("userChosen-Answer")
        }
    }

    let multipleChoiceAnswers;
    let showCorrectAnswers = []
    let simpleAnswer;
    if(currentQuestion.questionType === "multipleChoice"){ //creates an array of all possible anwers for mc qustion
        let answersKeys = Object.keys(currentQuestion.multipleChoice) //answer letters
        let answerValue = Object.values(currentQuestion.multipleChoice) //answer values
        let correctAnswers = (currentQuestion.correctMcAnswers) //correct answers
        multipleChoiceAnswers = answersKeys.map((el, index) => { //for every answer key format it into the form of (letter: answer)
            //if the letter is in the correct answer object add the correct styling to it if not do nothing
            let htmlElement = ( <div className={`learnOption-multipleChoice-answer ${correctAnswers[el] === false ? currentQuestion.showCorrect : ""}`} value={el} onClick={handleChosenAnswer}>
                                    <p>{el}: {answerValue[index]}</p>
                                </div>)
            if(correctAnswers[el] === false){ //pushes correct answers to the show correct answers array
                showCorrectAnswers.push(htmlElement)
            }
            return htmlElement
        
        })
    }
    else if(currentQuestion.questionType === "simple"){
        simpleAnswer = currentQuestion.answer
    }
    //console.log(showCorrectAnswers)

    function handleCheckAnswer(){ //checks whether user answer is match state answer
        if(currentQuestion.questionType === "simple"){
            let correctAnswer = currentQuestion.answer
            let userAnswer = currentQuestion.userAnswer
            if(correctAnswer.replace(/ /g, "").toLowerCase() === userAnswer.replace(/ /g, "").toLowerCase()){
                setCurrentQuestion((prev) => {
                    return{
                        ...prev,
                        showCorrect:"userChosen-Answer-correct"
                    }
                })
            }
            else{
                //console.log("userChosen-Answer-wrong")
                setCurrentQuestion((prev) => {
                    return{
                        ...prev,
                        showCorrect:"userChosen-Answer-wrong"
                    }
                })
            }
        }
        else{
            setCurrentQuestion((prev) => {
                return{
                    ...prev,
                    showCorrect:"userChosen-Answer-correct"
                }
            })
        }
    }

    function handleChange(e){ //handles textfield input
        //console.log(e.target.value)
        setCurrentQuestion((prev) => {
            return{
                ...prev, 
                userAnswer: e.target.value,
            }
        })
    }

    return (
        <div className="learnOption-container">
            <div className="learnOption-question-container">
                {currentQuestion.question}
            </div>
            <div className="learnOption-answer-container">
                {currentQuestion.questionType === "simple" ? <><TextField
                    className={currentQuestion.showCorrect}
                    placeholder="Type Answer Here"
                    sx={{width:"80%", alignSelf:"center"}}
                    value={currentQuestion.userAnswer}
                    onChange={handleChange}
                    variant="standard"
                />
                {currentQuestion.showCorrect === "userChosen-Answer-wrong" ? <p className="learnOption-simpleAnswer">
                    {simpleAnswer}
                </p> : ""}
                </>
                : multipleChoiceAnswers}
                <div className="learnOption-btn-container">
                    <Button className="learnOption-nextBtn" sx={{backgroundColor:"orange", color:"white"}} onClick={handleCheckAnswer}>
                        Check
                    </Button>
                    <Button className="learnOption-nextBtn" sx={{backgroundColor:"blue", color:"white"}} onClick={handleNextQuestion}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

///////////////////////////////////////////////////
function TestOption(){ //not complete

    const activeSet = useSelector((state) => state.userData.value.flashCards.activeSet)

    const [testState, setTestState] = useState({
        questionNumber:0,
        correctCounter:0,
        wrongCounter:0,
    })

    let [currentQuestion, setCurrentQuestion] = useState({
        question:activeSet[0][1].data[0].question,
        questionType:activeSet[0][1].data[0].type,
        answer:activeSet[0][1].data[0].answer,
        multipleChoice:activeSet[0][1].data[0].answers,
        correctMcAnswers:activeSet[0][1].data[0].wrongAnswers,
        //userMultipleChoiceAnswer:{},
        userAnswer:"",
        showCorrect:""
    })

    let userMCAnswers = {}
    function handleChosenAnswer(e){ //highlights user chosen mc answer and adds it to state
        //console.log(e.target.classList)
        if(e.target.classList.contains("userChosen-Answer")){
            e.target.classList.remove("userChosen-Answer")
            //console.log(e.target.attributes[1].value)
            delete userMCAnswers[e.target.attributes[1].value]
            delete currentQuestion.userMultipleChoiceAnswer[e.target.attributes[1].value]
        }
        else{
            e.target.classList.add("userChosen-Answer")
            userMCAnswers[e.target.attributes[1].value] = true
        }
    }


    let multipleChoiceAnswers;
    let showCorrectAnswers = []
    if(currentQuestion.questionType === "multipleChoice"){ //creates an array of all possible anwers for mc qustion
        let answersKeys = Object.keys(currentQuestion.multipleChoice)
        let answerValue = Object.values(currentQuestion.multipleChoice)
        let correctAnswers = (currentQuestion.correctMcAnswers)
        //console.log(correctAnswers)
        multipleChoiceAnswers = answersKeys.map((el, index) => {
            let htmlElement = ( <div className={`learnOption-multipleChoice-answer ${correctAnswers[el] === false ? currentQuestion.showCorrect : ""}`} value={el} onClick={handleChosenAnswer}>
                                    <p>{el}: {answerValue[index]}</p>
                                </div>)
            if(correctAnswers[el] === false){
                showCorrectAnswers.push(el)
            }
            return htmlElement
        
        })
    }

    //console.log(showCorrectAnswers)
    
    function handleNext(e){
        handleCheckAnswer()
        //console.log("CLICK")
        setTestState(prev => {
            return{
                ...prev,
                questionNumber: prev.questionNumber + 1,
            }
        })

        if(testState.questionNumber === activeSet[0][1].data.length - 1){
            console.log("test ended")
            setTestState(prev => {
                return{
                    ...prev,
                    questionNumber: 0,
                }
            })
        }
        
        setCurrentQuestion((prev) => {
            return{
                ...prev,
                question:activeSet[0][1].data[testState.questionNumber].question,
                questionType:activeSet[0][1].data[testState.questionNumber].type,
                answer:activeSet[0][1].data[testState.questionNumber].answer,
                multipleChoice:activeSet[0][1].data[testState.questionNumber].answers,
                correctMcAnswers:activeSet[0][1].data[testState.questionNumber].wrongAnswers,
                //userMultipleChoiceAnswer:{},
                userAnswer:"",
                showCorrect:""
            }
        })
    }

    console.log(testState.questionNumber)

    function handleCheckAnswer(e){
        if(activeSet[0][1].data[testState.questionNumber].type === "simple"){
            if(activeSet[0][1].data[testState.questionNumber].answer.replace(/ /g, "").toLowerCase() === currentQuestion.userAnswer.replace(/ /g, "").toLowerCase()){
                setTestState(prev => {
                    return{
                        ...prev,
                        correctCounter: prev.correctCounter + 1,
                    }
                })
            }
            else{
                setTestState(prev => {
                    return{
                        ...prev,
                        wrongCounter: prev.wrongCounter + 1,
                    }
                })
            }
        }
        else if(activeSet[0][1].data[testState.questionNumber].type === "multipleChoice"){
            console.log("MC")
            console.log(currentQuestion)
        }
        else{

        }
    }

    function handleUserAnswer(e){
        //console.log(e.target.value)
        setCurrentQuestion(prev => {
            return{
                ...prev,
                [e.target.name]: e.target.value,
            }
        })
    }

    
    console.log(testState)
    console.log(currentQuestion.question)

    return(
        <div className="learnOption-container">
            <div className="learnOption-question-container">
                {currentQuestion.question}
            </div>
            <div className="learnOption-answer-container">
                {currentQuestion.questionType === "simple" ?
                <TextField
                    className={currentQuestion.showCorrect}
                    placeholder="Type Answer Here"
                    sx={{width:"80%", alignSelf:"center"}}
                    name="userAnswer"
                    onChange={handleUserAnswer}
                    value={currentQuestion.userAnswer}
                    variant="standard"
                />
                : multipleChoiceAnswers}
                <div className="learnOption-btn-container">
                    <Button className="learnOption-nextBtn" onClick={handleNext}>
                        Next
                    </Button>

                    <Button className="learnOption-nextBtn">
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}