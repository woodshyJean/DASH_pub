import { createSlice } from "@reduxjs/toolkit"

export const NavState = createSlice({
    name:"NavState",
    initialState: { value: {
        isOpen:true,
        navModals: {
            user:{
                open:true,

                userModals: {
                    login: false,
                    signup: false,
                }
            },

            todos:{
                open:false,

                todoModals: {
                    goals: false,
                }
            },

            flashCards:{
                open:false,
            },
        },
    }},
    reducers :{
        navStateAll: ((state, action) => {
            state.value = action.payload
        })
    }
})

export const {navStateAll} = NavState.actions

export default NavState.reducer;