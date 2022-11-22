import React, { useState, useEffect, useRef } from "react";
import "./PomodoroFocus.css";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

import { useDispatch } from "react-redux";
import {setNotification} from "../../Features/logedUserData.js";

import Button from "@mui/material/Button";

export default function PomodoroFocus() {
  const dispatch = useDispatch();

  let [pomodoroTimer, setpomodoroTimer] = useState({
    running: false,
    now: "",
    status: "over",
    focusTimer: 1500,
    breakTimer: 300,
    rounds: 1,
  });

  console.log(pomodoroTimer)

  const stopRef = useRef(pomodoroTimer.running);

  const formatMins = (time, elapsed) => { //formats number into secs
    return Math.floor((time - elapsed) / 60) === 0
      ? "00"
      : Math.floor((time - elapsed) / 60);
  };

  const formatSecs = (time, elapsed) => { //formats number into mins
    return (time - elapsed) % 60 < 10
      ? `0${(time - elapsed) % 60}`
      : (time - elapsed) % 60;
  };

  useEffect(() => {
    let dateNow = Date.now(); //current date
    let interval; //variable to hold setinterval

    if (stopRef.current && pomodoroTimer.status !== "over") {
      interval = setInterval(() => {
        let timed = Date.now(); //updated date at every interval
        let elapsed = Math.floor(Math.abs((Date.now() - dateNow) / 1000)); //the ammount of time thats passed since timer started

        if (timed >= pomodoroTimer.now || !stopRef.current) { //if the timer is stoped or the current time exceeds the predetermined end time
          clearInterval(interval); //clear interval

          cancelTimer(); //stop timer function

          dispatch( //send notification that timer has ended
            setNotification({
              type: "pomodoro",
              data: { name: "Timer Ended", in: "now" },
            })
          );

          stopRef.current = false;

          //console.log("should stop here")
        } else { //while timer is not being stopped
          if (pomodoroTimer.status === "focus") { //if the timer is in the focus phase
            let focusMins = formatMins(pomodoroTimer.focusTimer, elapsed); //format elapsed time to min
            let focusSecs = formatSecs(pomodoroTimer.focusTimer, elapsed); //format elapsed time to sec
            document.querySelector(
              ".focusText"
            ).textContent = `${focusMins}:${focusSecs}`; //update the timer focus html element with a formated min:secs
          }

          if (pomodoroTimer.status === "break") { //if the timer is in the break phase
            let breakMins = formatMins(pomodoroTimer.breakTimer, elapsed); //format elapsed time to min
            let breakSecs = formatSecs(pomodoroTimer.breakTimer, elapsed); //format elapsed time to sec
            document.querySelector(
              ".breakText"
            ).textContent = `${breakMins}:${breakSecs}`; //update the timer break html element with a formated min:secs
          }

          ////////

          if ( //when the ammount of time needed to focus has been reached
            elapsed >= pomodoroTimer.focusTimer &&
            pomodoroTimer.status === "focus"
          ) {
            clearInterval(interval); //clear interval
            console.log("focus over:", elapsed);
            setpomodoroTimer((prev) => { //set the pomdoro state to the break phase

              return {
                ...prev,
                status: "break",
              };

            });

          } else if ( //when the ammount of break time has been reached
            elapsed >= pomodoroTimer.breakTimer &&
            pomodoroTimer.status === "break"
          ) {
            clearInterval(interval); //clear interval
            console.log("break over:", elapsed);

            setpomodoroTimer((prev) => { //set the pomdoro state to the focus phase and start the next round

              return {
                ...prev,
                status: "focus",
                rounds: prev.rounds - 1, //decrement the ammount of rounds by 1
              };

            });

          } else {

            return;

          }

        }

      }, 1000); //run the contained code every 1000ms/ 1sec

    } else { //if the timer is canceled or stoped
      clearInterval(interval);
    }

    if (pomodoroTimer.status === "focus") { //sends notification whenever timer phase is switched to focus
      dispatch(

        setNotification({
          type: "pomodoro",
          data: {
            name: "Focus For",
            in: `${formatMins(pomodoroTimer.focusTimer, 0)}:${formatSecs(
              pomodoroTimer.focusTimer,
              0
            )}`,
          },
        })

      );

    } else if (pomodoroTimer.status === "break") { //sends notification whenever timer phase is switched to break
      
      dispatch(

        setNotification({
          type: "pomodoro",
          data: {
            name: "Break For",
            in: `${formatMins(pomodoroTimer.breakTimer, 0)}:${formatSecs(
              pomodoroTimer.breakTimer,
              0
            )}`,
          },
        })

      );

    }

  }, [stopRef.current, pomodoroTimer.status]);


  //console.log("RERENDER")



  function startTimer() { //function to start the pomdoro timer
    if (
      pomodoroTimer.focusTimer === 0 ||
      pomodoroTimer.breakTimer === 0 ||
      pomodoroTimer.running
    )
      return; // if theres no focus/break time inputed or the timer is already running disalble the button/function 

    setpomodoroTimer((prev) => { //sets the timer starting conditions
      return {
        ...prev,
        now:
          Date.now() +
          (pomodoroTimer.focusTimer + pomodoroTimer.breakTimer) *
            pomodoroTimer.rounds *
            1000,
        running: true,
        status: "focus",
      };
    });

    stopRef.current = true; //allows timer to start
  }

  function cancelTimer() { //stop the timer and reset to defaults
    if (!pomodoroTimer.running) return; //if the timer isnt running disable the button

    setpomodoroTimer((prev) => {//reset timer state to defaults
      return {
        ...prev,
        now: Date.now(),
        running: false,
        status: "over",
        focusTimer: 1500,
        breakTimer: 300,
        rounds: 1,
      };
    });
    stopRef.current = false; //stops the timer
  }

  function handleAddFocus(e) { //add focus time on click
    if (pomodoroTimer.focusTimer === 6000) return;
    if (!pomodoroTimer.running) {
      setpomodoroTimer((prev) => {
        return {
          ...prev,
          focusTimer: prev.focusTimer + 60,
        };
      });
    }
  }

  function handleAddBreak(e) { //add break time on click
    if (pomodoroTimer.breakTimer === 900) return;
    if (!pomodoroTimer.running) {
      setpomodoroTimer((prev) => {
        return {
          ...prev,
          breakTimer: prev.breakTimer + 60,
        };
      });
    }
  }

  function handleAddRound(e) { //add rounds on click
    if (pomodoroTimer.rounds === 20) return;
    if (!pomodoroTimer.running) {
      setpomodoroTimer((prev) => {
        return {
          ...prev,
          rounds: prev.rounds + 1,
        };
      });
    }
  }

  function handleSubFocus(e) { //removes focus time onclick
    if (pomodoroTimer.focusTimer === 0) return;
    if (!pomodoroTimer.running) {
      setpomodoroTimer((prev) => {
        return {
          ...prev,
          focusTimer: prev.focusTimer - 60,
        };
      });
    }
  }

  function handleSubBreak(e) { //removes break time onclick
    if (pomodoroTimer.breakTimer === 0) return;
    if (!pomodoroTimer.running) {
      setpomodoroTimer((prev) => {
        return {
          ...prev,
          breakTimer: prev.breakTimer - 60,
        };
      });
    }
  }

  function handleSubRound(e) { //removes a round onclick
    if (pomodoroTimer.rounds === 1) return;
    if (!pomodoroTimer.running) {
      setpomodoroTimer((prev) => {
        return {
          ...prev,
          rounds: prev.rounds - 1,
        };
      });
    }
  }

  let getTotalTime = (time) => { //function that formats the total time into a min:sec format
    let total = (time * pomodoroTimer.rounds) / 60;
    return total >= 60
      ? `${Math.floor(total / 60)}:${
          total % 60 >= 10 ? total % 60 : `0${total % 60}`
        }:00`
      : `${total >= 10 ? total : `0${total}`}:00`;
  };

  let total = pomodoroTimer.focusTimer + pomodoroTimer.breakTimer;
  let totalTime = getTotalTime(total);

  let totalFocus = getTotalTime(pomodoroTimer.focusTimer);
  let totalBreak = getTotalTime(pomodoroTimer.breakTimer);

  let endTime = //gets the time when the timer will stop
    new Date(pomodoroTimer.now).toLocaleTimeString() === "Invalid Date"
      ? ""
      : new Date(pomodoroTimer.now).toLocaleTimeString(); //time when timer will stop / when pomodoro is over

  let containerBackground;

  if (pomodoroTimer.status === "focus") { //sets the background color of the pomodoro component depending on its phase
    containerBackground =
      "linear-gradient(to right, #205072 , #56C596, #CFF4D2) ";
  } else if (pomodoroTimer.status === "break") {
    containerBackground = "linear-gradient(to left, #EB3349 , #F45C43) ";
    //"rgba(250, 128, 114,1)"
  } else {
    containerBackground = "";
  }

  //console.log("Pomodoro")

  return (
    <div
      key={"pomodoro-Timer"}
      className="pomodoro-container"
      style={{ backgroundImage: `${containerBackground}` }}
    >
      <div className="pomodoro-main">
        <div className="pomodoro-main-summary">
          <p>{`${totalFocus} FOCUS`}</p>
          <p>{`${totalBreak} BREAK`}</p>
          <p>{`${totalTime} TOTAL`}</p>
          <p>{`${endTime} END`}</p>
        </div>

        <div className="pomodoro-main-timers">
          <div className={`pomodoro-main-timers-btns focusBtn`}>
            <div className="pomodoro-main-timers-name">
              <p>FOCUS</p>
            </div>
            <div className="pomodoro-main-timers-time">
              <p className="focusText">{pomodoroTimer.focusTimer / 60}</p>
            </div>
            <div className="pomodoro-main-timers-timeBtns">
              <IconButton
                sx={{ backgroundColor: "black" }}
                onClick={handleAddFocus}
              >
                <AddIcon sx={{ fontSize: "1.75vw", color:"white" }}></AddIcon>
              </IconButton>
              <IconButton
                sx={{ backgroundColor: "black" }}
                onClick={handleSubFocus}
              >
                <RemoveIcon sx={{ fontSize: "1.75vw", color:"white" }}></RemoveIcon>
              </IconButton>
            </div>
          </div>

          <div className={`pomodoro-main-timers-btns breakBtn`}>
            <div className="pomodoro-main-timers-name">
              <p>BREAK</p>
            </div>
            <div className="pomodoro-main-timers-time">
              <p className="breakText">{pomodoroTimer.breakTimer / 60}</p>
            </div>
            <div className="pomodoro-main-timers-timeBtns">
              <IconButton
                sx={{ backgroundColor: "black" }}
                onClick={handleAddBreak}
              >
                <AddIcon sx={{ fontSize: "1.75vw", color:"white" }}></AddIcon>
              </IconButton>
              <IconButton
                sx={{ backgroundColor: "black" }}
                onClick={handleSubBreak}
              >
                <RemoveIcon sx={{ fontSize: "1.75vw", color:"white" }}></RemoveIcon>
              </IconButton>
            </div>
          </div>

          <div className={`pomodoro-main-timers-btns roundBtn`}>
            <div className="pomodoro-main-timers-name">
              <p>ROUNDS</p>
            </div>
            <div className="pomodoro-main-timers-time">
              <p>{pomodoroTimer.rounds}</p>
            </div>
            <div className="pomodoro-main-timers-timeBtns">
              <IconButton
                sx={{ backgroundColor: "black" }}
                onClick={handleAddRound}
              >
                <AddIcon sx={{ fontSize: "1.75vw", color:"white" }}></AddIcon>
              </IconButton>
              <IconButton
                sx={{ backgroundColor: "black" }}
                onClick={handleSubRound}
              >
                <RemoveIcon sx={{ fontSize: "1.75vw", color:"white" }}></RemoveIcon>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div className={`pomodoro-control`}>
        <Button
          sx={{
            backgroundColor: "#B4FF9F",
            borderRadius: "1rem",
            height: "2.6vw",
            width: "7vw",
            color: "black",
          }}
          onClick={startTimer}
        >
          START
        </Button>

        <Button
          sx={{
            backgroundColor: "#FFA1A1",
            borderRadius: "1rem",
            height: "2.6vw",
            width: "7vw",
            color: "black",
          }}
          onClick={cancelTimer}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
}
