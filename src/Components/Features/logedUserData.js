import { createSlice } from "@reduxjs/toolkit"

export const logedUserData = createSlice({
    name:"userData",
    initialState: { value: {
        online:false,
        personal:{
            name:"",
            age:"",
        },
        todos:{},
        goals:{},
        flashCards:{
            navigation:{
                showSets:true,
                learnSet:false,
                createSet:false,
            },
            sets:{

            },
            activeSet:[]
        },
        notifications:[]
    }},
    reducers :{
        setPersonal: ((state, action) => {
            state.value.personal = action.payload
        }),

        addNewSet: ((state, action) => {
            const setName = action.payload.setName //save received data to variable
            //number the questions here rather than passing them all down
            if(action.payload.data.type === "simple"){
                state.value.flashCards.sets[setName.replace(/ /g, "").toLowerCase()] = { //use a condensed version of setname to as object key
                    ...state.value.flashCards.sets[setName.replace(/ /g, "").toLowerCase()], //spread current data in the object
                    setName: setName, //raw set name
                    [action.payload.data.number]: {question:action.payload.data.question ,answer:action.payload.data.answer, type:action.payload.data.type}
                }
            }
            else{//similar process to the if but for multiple choice type
                state.value.flashCards.sets[setName.replace(/ /g, "").toLowerCase()] = {
                    ...state.value.flashCards.sets[setName.replace(/ /g, "").toLowerCase()],
                    setName: setName,
                    [action.payload.data.number]: {question:action.payload.data.question , answers:action.payload.data.answers, type:action.payload.data.type, wrongAnswers:action.payload.data.wrongAnswers}
                }
            }
        }),

        setActiveSet:((state, action) => {
            let data = action.payload; //save received data to variable
            //console.log(data)
            state.value.flashCards.activeSet.push([{setName:data.name},data]) // add the received set to activeset array
        }),

        removeActiveSet:((state, action) => {
            state.value.flashCards.activeSet.pop() //remove the current set listed in the aciveset array
        }),

        toggleflashCardNav:((state, action) => {
            state.value.flashCards.navigation = action.payload
        }),

        changeOnline:((state, action) => {
            state.value = action.payload
        }),

        setTodos: ((state, action) => {
            //state.value = action.payload
            let userTodo = action.payload //save received data to variable
            if(userTodo.note || userTodo.links.length > 0){ //sets received todo bag to true if theres links or a note
                userTodo.hasBag = true
            }
            state.value.todos[action.payload.todo.replace(/ /g, "").toLowerCase()] = userTodo //saves the received todo to the todo obj
        }),

        setGoal:((state, action) => {
            let userGoal = action.payload //save received data to variable
            state.value.goals[action.payload.goal.replace(/ /g, "").toLowerCase()] = userGoal //saves the received goal to the goals obj
        }),

        setRelatedTodo: ((state, action) => {
            let newTodo = action.payload //save received data to variable

            let foundGoal = state.value.goals[(newTodo.relatedGoal).replace(/ /g, "").toLowerCase()] //find the related goal in the goals obj

            if (foundGoal){ //add the todo to the related goal obj of the found goal obj
                //console.log(foundGoal)
                foundGoal.relatedTodos[(newTodo.todo).replace(/ /g, "").toLowerCase()] = newTodo //adds the received todo to the found goals related goal obj
            }
            else{
                console.log("something went wrong")
            }
            
        }),

        toggleActiveTodo: ((state, action) => {
            
            let data = action.payload //save received data to variable

            let foundTodo = state.value.todos[data.todo.replace(/ /g, "").toLowerCase()] //find the recieved todo in the todos obj

            let foundGoalRelatedTodo = state.value.goals[data.goal.replace(/ /g, "").toLowerCase()] //find the recieved todos related goal 

            //console.log(foundGoalRelatedTodo)

            if (foundTodo){
                foundTodo.active = !foundTodo.active //toggling active
                if(!foundGoalRelatedTodo) return  //if no goal with the related todo is found return
                foundGoalRelatedTodo.relatedTodos[data.todo.replace(/ /g, "").toLowerCase()].active = !foundGoalRelatedTodo.relatedTodos[data.todo.replace(/ /g, "").toLowerCase()].active //toggle the active of the found todo in the goals
            }
            else{
                //console.log("something wrong")
            }

        }),

        deleteCompletedTodo: ((state, action) => {

            let deleted = [] //array that will hold the todos that need to be deleted
            Object.values(state.value.todos).forEach((el) => { //creates array from todos obj   
                //console.log(el.active)
                if(!el.active){ //if the todo is completed
                    deleted.push({todo:el.todo, goal:el.relatedGoal})//add the deleted todo to the array
                    delete state.value.todos[el.todo.replace(/ /g, "").toLowerCase()] //delete the todo from the todos array
                }
            })

            //console.log(deleted)
            try {
                for(let i = 0; i < deleted.length; i++){ //deleted completed todos from a goals related todo obj
                    let test = state.value.goals[deleted[i].goal.replace(/ /g, "").toLowerCase()]
                                .relatedTodos[deleted[i].todo.replace(/ /g, "").toLowerCase()]

                    delete state.value.goals[deleted[i].goal.replace(/ /g, "").toLowerCase()]
                            .relatedTodos[deleted[i].todo.replace(/ /g, "").toLowerCase()]
                            
                    console.log("test",test)
                }
            } catch (error) {
                console.log(error)
            }

        }),

        deleteGoal:((state, action) => {
            let deleteGoal = action.payload
            delete state.value.goals[deleteGoal.replace(/ /g, "").toLowerCase()]
        }),

        setNotification:((state, action) => {
            //console.log(action.payload)
            state.value.notifications.push(action.payload)
        }),

        clearNotification: ((state, action) => {
            state.value.notifications.pop()
        }),
    }
})

export const {setPersonal, changeOnline, setTodos, setRelatedTodo, toggleActiveTodo, 
    deleteCompletedTodo, setNotification, clearNotification, setGoal, deleteGoal, addNewSet, toggleflashCardNav, setActiveSet, removeActiveSet} = logedUserData.actions

export default logedUserData.reducer;