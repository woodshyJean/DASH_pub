import React, { useState } from "react";
import "./FlashCards.css";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Select /*{ SelectChangeEvent }*/ from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import SetCard from "./SetCard/SetCard";
import MultipleChoiceForm from "./MultipleChoice/MultipleChoice";
import LearnSet from "./LearnSet/LearnSet";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addNewSet, toggleflashCardNav } from "../Features/logedUserData.js";

import axios from "axios";

export default function FlashCards() {
  const flashCardNav = useSelector(
    (state) => state.userData.value.flashCards.navigation
  );

  return (
    <div className="flashCards-container">
      <FlashcardMain/>
      {flashCardNav.learnSet ? <LearnSet /> : ""}
    </div>
  );
}



function FlashcardMain() {
  const dispatch = useDispatch();

  const flashCardNav = useSelector(
    (state) => state.userData.value.flashCards.navigation
  );

  const FlashCardData = useSelector(
    (state) => state.userData.value.flashCards.sets
  );

  let setsData;
  try {
    setsData = Object.values(FlashCardData); //creates array from object values
  } catch (error) {
    //console.log(error)
  }
  //console.log(setsData)

  let userSets;
  try {
    userSets = setsData.map((el) => { //create a set card for every set in the array

      let numQuestions = Object.values(el);

      return (
        <SetCard
          key={el.setName}
          setName={el.setName}
          totalQuestions={numQuestions.length - 1} //ammount of questions in the set
          data={numQuestions} //the questions data
        />
      );

    });
  } catch (error) {
    //console.log(error)
  }

  function handleShowCreateSet() {
    setNewSetName((prev) => {
      return {
        ...prev,
        open: !prev.open,
      };
    });
  }

  const [newSetName, setNewSetName] = useState({
    open: false,
    newSetName: "",
  });

  function handleNewSetName(e) {
    //console.log(e.target.value);
    setNewSetName((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function checkIfSetExist(e) { //checks whether a duplicate set is being created
    if (FlashCardData[newSetName.newSetName.replace(/ /g, "").toLowerCase()]) {
      console.log("set already exists");
      return
    } else {
      dispatch(
        toggleflashCardNav({
          ...flashCardNav,
          showSets: !flashCardNav.showSets,
          createSet: !flashCardNav.createSet,
        })
      );
    }
  }

  return (
    <>
      {flashCardNav.showSets &&
      !flashCardNav.createSet &&
      !flashCardNav.learnSet ? (
        <>
          <div className="flashCards-nav">
            <Button
              sx={{
                minHeight: "55px",
                minWidth:"55px",
                padding:"0px",
                margin:"0px",
                color: "white",
                backgroundColor:"black",
                borderRadius: "100%",
                borderColor:"black",
                "&:hover": {
                  backgroundColor: "#29AB87",
                },
              }}
              variant="outlined"
              onClick={handleShowCreateSet}
            >
              New
            </Button>
          </div>

          {newSetName.open ? (
            <div className="createdSet-name-container">
              <p>ENTER SET NAME</p>
              <TextField
                name="newSetName"
                value={newSetName.newSetName}
                onChange={handleNewSetName}
                sx={{
                  width: "90%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                      borderRadius: "10px",
                    },
                  },
                }}
              />
              <Button
                onClick={checkIfSetExist}
                sx={{
                  backgroundColor: "green",
                  color: "white",
                  padding: ".5rem 1rem",
                }}
              >
                Create
              </Button>
            </div>
          ) : (
            <div className="flashCards-sets">{userSets}</div>
          )}

        </>
      ) : 
      flashCardNav.learnSet ? ("") : (<NewSet newName={newSetName.newSetName}/>)}
    </>
  );
}



function NewSet(props) {
  const dispatch = useDispatch();
  const flashCardNavigation = useSelector( //flashcard nav
    (state) => state.userData.value.flashCards.navigation
  );
  const FlashCardData = useSelector( //flashcard data
    (state) => state.userData.value.flashCards.sets
  );

  //console.log(FlashCardData)

  function handleShowCreateSet() {//sends created set data to backend
    dispatch(
      toggleflashCardNav({
        ...flashCardNavigation,
        showSets: !flashCardNavigation.showSets,
        createSet: !flashCardNavigation.createSet,
      })
    );

    axios({
      //sending flashcard data to backend
      method: "POST",
      url: "http://localhost:5000/flashcards",
      data: { sets: FlashCardData },
      headers: {
        "content-Type": "application/json",
      },
    })
      .then((res) => {
        //console.log(res)
      })
      .catch((err) => {
        //console.log(err.response)
      });
  }


  const [simpleData, setSimpleData] = useState({
    setName: props.newName,
    type: "simple",
    question: "",
    answer: "",
  });

  const [flashCardState, setFlashCardState] = useState({
    type: "open",
    openQ: 0,
    trueFalse: 0,
    multipleC: 0,
    totalQuestions: 0,
  });

  const textFieldStyles1 = {
    width: "45%",
    marginBottom: "5rem",
    input: {
      color: "white",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white",
      borderWidth: "5px",
    },
  };


  const selectStyles1 = {
    width: "10%",
    display: "flex",
    justifySelf: "flex-end",
    border: "2px solid white",
    borderRadius: "30px",
    color: "White",
  };

  function handleAnswerType(e) { //sets questions type
    //console.log(e.target.value)
    setFlashCardState((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleQuestionChange(e) { //handels textfield input
    setSimpleData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  //console.log(simpleData)

  function setTotalQuestions() { //sets the total ammount of questions in a flashcard set
    //console.log(currentLength)
    setFlashCardState((prev) => {
      return {
        ...prev,
        totalQuestions: prev.openQ + prev.multipleC + prev.trueFalse,
      };
    });
  }

  function handleAddQSet(e) {
    if (!simpleData.question || !simpleData.answer || !simpleData.setName) 
      return; //dont allow set to be created if theres no question/answer or set name

    if (flashCardState.type === "open" || flashCardState.type === "t/f") {
      dispatch( //sends question/answer back to redux slice
        addNewSet({
          setName: simpleData.setName,
          data: {
            type: "simple",
            number: flashCardState.totalQuestions,
            question: simpleData.question,
            answer: simpleData.answer,
          },
        })
      );
        if (flashCardState.type === "open") {
          setFlashCardState((prev) => { //increment open questions counter
            return {
              ...prev,
              openQ: prev.openQ++,
            };
          });
        } else if (flashCardState.type === "t/f") {
          setFlashCardState((prev) => {  //increment true/false questions counter
            return {
              ...prev,
              trueFalse: prev.trueFalse++,
            };
          });
        }
        clearField(); //clears question and answer text fields
    }

    setTotalQuestions(); //get the total ammount of questions
  }

  function incrementMultipleC() { //increments the multiple choice questions counter
    setFlashCardState((prev) => {
      return {
        ...prev,
        multipleC: prev.multipleC++,
      };
    });
  }

  function clearField() { //clears text feilds by setting te value to an empty string
    setSimpleData((prev) => {
      return {
        ...prev,
        question: "",
        answer: "",
      };
    });
  }

  return (
    <>
      <div className="newSet-info-container">
        <div className="newSet-info">
          <p>{flashCardState.openQ} Open Ended</p>
          <p>{flashCardState.trueFalse} True / False</p>
          <p>{flashCardState.multipleC} Multiple Choice</p>
          <p>{flashCardState.totalQuestions} Total Questions</p>
        </div>

        <TextField
          variant="outlined"
          name="setName"
          id="flashcard-setName"
          placeholder="Name New Set"
          value={simpleData.setName}
          sx={{
            width: "30%",
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
                borderWidth: "3px",
                borderRadius: "20px",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          }}
        />
      </div>

      <div className="newSet-answerType">
        <Select
          sx={selectStyles1}
          name="type"
          value={flashCardState.type}
          onChange={handleAnswerType}
        >
          <MenuItem value={"open"}>Open</MenuItem>
          <MenuItem value={"t/f"}>T / F</MenuItem>
          <MenuItem value={"multipleChoice"}>Multiple Choice</MenuItem>
        </Select>
      </div>

      <div className="newSet-userInputs-container">
        <div className="newSet-userInputs">
          <TextField
            variant="standard"
            name="question"
            value={simpleData.question}
            id="flashCard-question-input"
            placeholder="Question"
            onChange={handleQuestionChange}
            sx={textFieldStyles1}
          />
          :
          {flashCardState.type === "open" || flashCardState.type === "t/f" ? (
            <div className="newSet-simple-container">
              <TextField
                variant="standard"
                name="answer"
                value={simpleData.answer}
                placeholder="Answer"
                onChange={handleQuestionChange}
                sx={{
                  width: "100%",
                  input: { color: "white" },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white",
                    borderWidth: "5px",
                  },
                }}
              />
              <Stack spacing={3}>
                <Button
                  sx={{ width: "25%", alignSelf: "flex-end" }}
                  variant="outlined"
                  onClick={handleAddQSet}
                >
                  Add Question Set
                </Button>
                <Button
                  sx={{ width: "25%", alignSelf: "flex-end" }}
                  variant="outlined"
                  onClick={handleShowCreateSet}
                >
                  Complete
                </Button>
              </Stack>
            </div>
          ) : (
            <MultipleChoiceForm //component that handles multiple choice questions seperately
              Question={simpleData.question}
              setName={simpleData.setName}
              totalQuestions={flashCardState.totalQuestions}
              setTotal={setTotalQuestions} //send total questions to mc component through props
              completeSet={handleShowCreateSet}
              incrementMultipleC={incrementMultipleC}//send multiple choice counter incrementer function to component
              clearField={clearField}//send clear field function to componenet
            />
          )}
        </div>
      </div>
    </>
  );
}