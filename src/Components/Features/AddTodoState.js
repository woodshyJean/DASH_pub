import { createSlice } from "@reduxjs/toolkit"

export const AddTodoState = createSlice({
    name:"login",
    initialState: { value: {
        isOpen:false,
    }},
    reducers :{
        toggleIsOpen: ((state, action) => {
            state.value = action.payload
        })
    }
})

export const {toggleIsOpen} = AddTodoState.actions

export default AddTodoState.reducer;