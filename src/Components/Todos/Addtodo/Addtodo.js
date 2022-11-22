import React, {useState} from "react";

import "./Addtodo.css"

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import TextField from '@mui/material/TextField';
import Select /*{ SelectChangeEvent }*/ from '@mui/material/Select';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";

import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import { toggleIsOpen } from "../../Features/AddTodoState";
import { setTodos, setRelatedTodo, setGoal } from "../../Features/logedUserData";
import {navStateAll} from "../../Features/NavState"

import BackpackIcon from '@mui/icons-material/Backpack';
import AddLinkIcon from '@mui/icons-material/AddLink';
import UserLink from "./Link/UserLink";


export default function AddTodos(){

    const dispatch = useDispatch()

    let todoState = useSelector((state) => state.addTodoState.value)
    let userData = useSelector((state) => state.userData.value)
    let navData = useSelector((state) => state.Nav.value)

    let relatedGoals = Object.values(userData.goals).map( el => { //creates menu items for mui select element out of goals
      try {
        return [
          <MenuItem value={el.goal}>{el.goal}</MenuItem>
       ]
      } catch (error) {
        
      }
    })

    let [todoData , setTodoData] = useState({
      todo:"",
      dueDate:"",
      difficulty:"",
      priority:"",
      relatedGoal:"",
      reminder:"",
      links:[],
      hasBag:false,
      active: true,
      note:""

    })

    let [links, setLinks] = useState({
      linkName:"",
      link:"",
    })

    //console.log(todoData)

    let [goalData , setGoalData] = useState({
      goal:"",
      goalDueDate:"",
      goalPurpose:"",
      goalFail1:"",
      goalFail2:"",
      goalFail3:"",
      relatedTodos: {
        
      },
      active: true,

    })

    const handleTodoForm = (e) => { //handles form inputs
      //console.log(e.target.value)
      setTodoData((prev) => {
        return {
          ...prev,
        [e.target.name]: e.target.value
        }
      })
    }

    const handleGoalForm = (e) => { //handles form inputs
      //console.log(e.target.value)
      setGoalData((prev) => {
        return {
          ...prev,
        [e.target.name]: e.target.value
        }
      })
    }

    let newTodo = []
    let newGoal = []

    const [value, setValue] = React.useState(
      new Date(),
    );

    const handleChange = (newValue) => { //handles mui date 
      try {
        if(newValue._isValid){
          setValue(newValue);
          setTodoData((prev) => {
           return {
            ...prev, 
            dueDate: newValue._d.toString(),
           }
          })
  
          setGoalData((prev) => {
            return {
              ...prev,
              goalDueDate: newValue._d.toString(),
            }
          })
  
        }
        else{
          setValue(new Date());
        }
      } catch (error) {
        console.log(error)
      }
      }


    const handleSubmitTodo = (e) => {
      dispatch(toggleIsOpen({
        ...todoState,
        isOpen: !todoState.isOpen
      }))


      newTodo.push(todoData)

      dispatch(setTodos(todoData))

      if(!todoData.relatedGoal) return 
      
      console.log(todoData)
      dispatch(setRelatedTodo(todoData))    

      }
    

    const handleSubmitGoal = (e) => {
      dispatch(toggleIsOpen({
        ...todoState,
        isOpen: !todoState.isOpen
      }))

      newGoal.push(goalData)


      dispatch(setGoal(goalData))
    }

    const handleCancel = (e) => {
        dispatch(toggleIsOpen({
          ...todoState,
          isOpen: !todoState.isOpen
        }))

        handleReset()
    }

    const handleReset = (e) => {
      setTodoData({
        todo:"",
        dueDate:"",
        difficulty:"",
        priority:"",
        relatedGoal:"",
        reminder:"",
        links:[],
        hasBag:false,
        active: true,
        note:""
      })

      setGoalData({
        goal:"",
        goalDueDate:"",
        goalPurpose:"",
        goalFail1:"",
        goalFail2:"",
        goalFail3:"",
        relatedTodos: {

        },
        active: true,
      })
    }


    const goToGoals = (e) => {
      dispatch(navStateAll({
        ...navData,
        navModals: {
          ...navData.navModals,
          todos: {
            ...navData.navModals.todos,
            todoModals: {
              ...navData.navModals.todos.todoModals,
              goals: !navData.navModals.todos.todoModals.goals
            }
          }
        }
      }))
      
    }

    const CreateNewLink = (e) => {
      setLinks((prev) => {
        return {
          ...prev,
        [e.target.name]: e.target.value
        }
      })
    }

    const addLink = (e) => {

      if(!links.linkName || !links.link) return

      const newLink = {
        name:links.linkName,
        link: links.link,
      }
    
      todoData.links.push(newLink)

      setLinks(({
        linkName:"",
        link:"",
      }))


    }

    const addedLinks = todoData.links.map((el) => {
      return (
          <UserLink
          link = {el.link}
          name = {el.name}
      />
      )
    })

    console.log(todoData)

    let addGoal = navData.navModals.todos.todoModals.goals

    return(
        <div className="addtodo-container">
          <form className="addTodo-form-container"  autoComplete="off">
              {addGoal ?
              <>
              <div className="addTodo-Goal-btn" onClick={goToGoals}>
                <ArrowForwardIcon
                  sx={{transform: "rotate(180deg)"}}
                />
                <p>Todo</p>
              </div>

            <div className="addTodo-goal-form">
                <div style={{display:"flex", gap:"1rem"}}>I will 
                  <TextField onChange={handleGoalForm} 
                  variant="standard" 
                  name="goal" 
                  placeholder="Main goal"  
                  sx={{width:"500px", input: { color: "white", fontSize:"1.5rem"},  
                  '& .MuiInput-underline:before': { borderBottomColor: 'white' }, 
                  '& .MuiInput-underline:after': { borderBottomColor: 'white' }}}
                  />
                </div>

                <div>by this date <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      value={value}
                      name="goalDueDate"
                      onChange={handleChange}
                      renderInput={(params) => <TextField
                        variant="standard"
                        sx={{svg: { color: '#fff' }, 
                        input: { color: "white", fontSize:"1.5rem",  userSelect:"none"}, 
                        width:"300px",  '& .MuiInput-underline:before': { borderBottomColor: 'white' }, 
                        '& .MuiInput-underline:after': { borderBottomColor: 'white'}}}
                       {...params}
                        />}
                    />
                  </LocalizationProvider>
                </div>

                <div style={{display:"flex", gap:"1rem"}}>
                  in order to 
                  <TextField
                  onChange={handleGoalForm} 
                  variant="standard" 
                  name="goalPurpose" 
                  placeholder="Purpose of completeing this goal" 
                  sx={{width:"500px", input: { color: "white", fontSize:"1.5rem"},  
                  '& .MuiInput-underline:before': { borderBottomColor: 'white' }, 
                  '& .MuiInput-underline:after': { borderBottomColor: 'white' }}}
                  />
                </div>

                <div style={{display:"flex", gap:"1rem"}}>
                  or else 
                  <TextField 
                  onChange={handleGoalForm} 
                  variant="standard" 
                  name="goalFail1" 
                  placeholder="Consequences of not completeting this goal" 
                  sx={{width:"500px", input: { color: "white", fontSize:"1.5rem"},  
                  '& .MuiInput-underline:before': { borderBottomColor: 'white' }, 
                  '& .MuiInput-underline:after': { borderBottomColor: 'white' }}}
                  />
                </div>

                <div>
                 {/**/}
                </div>

                <div className="goals-btns">
                <Button 
                  onClick={handleReset} 
                  sx={{height:"56px", width:"30%",
                  borderRadius:"30px",
                  backgroundColor:"rgba(255, 255, 255, .35)"}}
                  className="addTodo-submitBtn" variant="contained">
                  Reset
                </Button>

                <Button onClick={handleSubmitGoal} sx={{height:"56px", width:"30%", borderRadius:"30px",  backgroundColor:"rgba(0, 255, 0, .8)"}} className="addTodo-submitBtn" variant="contained">Add</Button>

                <Button onClick={handleCancel} sx={{height:"56px", width:"30%", borderRadius:"30px", backgroundColor:"rgba(255, 0, 4, .8)"}} className="addTodo-submitBtn" variant="contained">Cancel</Button>
                </div>

            </div>

            </>
              
              
              :
              
              

              <div className="AddTodo-todo-container">

                <div className="addToodo-todo-main">
                    

                <div className="addTodo-todo-btn" onClick={goToGoals}>
                <p>Goal</p>
                <ArrowForwardIcon/>
                </div>

              <TextField 
                variant="standard" 
                type="text" 
                placeholder="Todo" 
                name="todo" 
                value={todoData.todo} 
                onChange={handleTodoForm}
                sx={{width:"80%" , input: { color: "white", fontSize:"2.5rem"},
                "label": {color: "white"},
                '& .MuiInput-underline:before': {
                borderBottomColor: 'white'}}}
              
              />

              <div className="addTodo-todo-form-options">

              <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                value={value}
                name="dueDate"
                onChange={handleChange}
                renderInput={(params) => <TextField
                    sx={{svg: { color: '#fff' } ,width:"49%", userSelect:"none" ,
                    input: { color: "white",  fontSize:"1.5rem" },
                    "label": {color: "white"} , borderRadius:"30px",
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                      borderWidth:"3px",
                      borderRadius:"20px", 
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'yellow',
                    }
                    }}}
                 {...params}
                  />}
              />
              </LocalizationProvider>

              <FormControl sx={{ svg: { color: '#fff' } , width:"20%" ,
                input: { color: "white",  fontSize:"1.5rem" },
                "label": {color: "white"} , borderRadius:"30px",
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                  borderWidth:"3px",
                  borderRadius:"20px", 
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'yellow',
                },
                }}}>
                  <InputLabel id="todo-priority"></InputLabel>
                  <Select
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={handleTodoForm}
                    name="priority"
                    labelId="todo-priority"
                    value={todoData.priority}
                    sx={{color:"white",borderRadius:"30px"}}
                  >
                    <MenuItem value="">
                      <p>priority</p>
                    </MenuItem>
                    <MenuItem value={"high"}>High</MenuItem>
                    <MenuItem value={"medium"}>Medium</MenuItem>
                    <MenuItem value={"low"}>Low</MenuItem>
                  </Select>  
              </FormControl> 


              <FormControl 
                sx={{ svg: { color: '#fff' } , width:"20%" , 
                input: { color: "white",  fontSize:"1.5rem" }, 
                "label": {color: "white"} , borderRadius:"30px",
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                  borderWidth:"3px",
                  borderRadius:"20px", 
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'yellow',
                },
                }}}>
                  <InputLabel id="todo-difficulty"></InputLabel>
                  <Select
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={handleTodoForm}
                    name="difficulty"
                    labelId="todo-difficulty"
                    value={todoData.difficulty}
                    sx={{color:"white",borderRadius:"30px"}}
                  >
                      <MenuItem value="">
                        <p>difficulty</p>
                      </MenuItem>
                      <MenuItem value={"0"}>0</MenuItem>
                      <MenuItem value={"1"}>1</MenuItem>
                      <MenuItem value={"2"}>2</MenuItem>
                      <MenuItem value={"3"}>3</MenuItem>
                      <MenuItem value={"4"}>4</MenuItem>
                      <MenuItem value={"5"}>5</MenuItem>
                  </Select>  
              </FormControl> 

              </div>
              
              <div className="addTodo-todo-form-options">

              <FormControl sx={{ svg: { color: '#fff' } , width:"75%",
                input: { color: "white",  fontSize:"1.5rem" },
                "label": {color: "white"} , borderRadius:"30px",
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                  borderWidth:"3px",
                  borderRadius:"20px", 
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'yellow',
                },
                }}}>
                  <InputLabel id="todo-relatedGoal"></InputLabel>
                  <Select
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={handleTodoForm}
                    name="relatedGoal"
                    labelId="todo-relatedGoal"
                    value={todoData.relatedGoal}
                    sx={{color:"white",borderRadius:"30px", height:"70px"}}
                  >
                    <MenuItem value="">
                      <p>Related Goal</p>
                    </MenuItem>
                    {relatedGoals}
                  </Select>  
              </FormControl>

              <TextField 
                  type="number"
                  name="reminder"
                  className="input"
                  placeholder="Reminder"
                  value={todoData.reminder}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0, max: 120 }}
                  onChange={handleTodoForm}
                  variant="outlined"
                  sx={{width:"20%", float:"right", '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                      borderWidth:"3px",
                      borderRadius:"20px", 
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'yellow',
                    }}}}
              />


              </div>

              <div className="addTodo-todo-form-controlBtns">

              <Button onClick={handleReset} sx={{height:"56px", width:"30%", borderRadius:"30px", backgroundColor:"rgba(255, 255, 255, .35)"}} className="addTodo-submitBtn" variant="contained">Reset</Button>

              <Button onClick={handleSubmitTodo} sx={{height:"56px", width:"30%", borderRadius:"30px",  backgroundColor:"rgba(0, 255, 0, .8)"}} className="addTodo-submitBtn" variant="contained">Add</Button>

              <Button onClick={handleCancel} sx={{height:"56px", width:"30%", borderRadius:"30px", backgroundColor:"rgba(255, 0, 4, .8)"}} className="addTodo-submitBtn" variant="contained">Cancel</Button>

              </div>
    



                </div>

                <div className="addToodo-todo-bag">
                  <div className="backpack-icon">
                    <BackpackIcon
                      sx={{fontSize:30, color:"white"}}
                    />
                  </div>

                  <div className="backpack-links-container">
                    <p className="backpack-label">Links</p>
                    <div className="backpack-links">
                      <TextField 
                        type="text"
                        name="linkName"
                        placeholder="Name"
                        value={links.linkName}
                        onChange={CreateNewLink}
                        variant="standard"
                        sx={{width:"25%", input: {fontSize:"1rem", height:"10px"}}}
                      />
                      <TextField 
                        type="text"
                        name="link"
                        placeholder="Paste Link Here"
                        value={links.link}
                        onChange={CreateNewLink}
                        variant="standard"
                        sx={{width:"60%", input: {fontSize:"1rem", height:"10px"}}}
                      />
                      <AddLinkIcon
                        sx={{transform:"rotate(-45deg)"}}
                        onClick={addLink}
                      />
                    </div>

                    <div className="backpack-addedLinks">
                        {addedLinks}
                    </div>

                  </div>

                  <div className="backpack-notes">
                    <p>Notes</p>
                    <TextField 
                        type="text"
                        name="note"
                        placeholder="Write your notes here"
                        multiline
                        rows={7}
                        onChange={handleTodoForm}
                        variant="standard"
                        sx={{width:"100%" ,input: {fontSize:"1rem"}}}
                      />
                  </div>

                </div>
                
              </div>
              
              }

          </form>
        
        </div>

    )
}
