import React, { useState } from "react";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PersonIcon from '@mui/icons-material/Person';
import LayersIcon from '@mui/icons-material/Layers';
//import MusicNoteIcon from '@mui/icons-material/MusicNote';

import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import {navStateAll} from "../Features/NavState.js"
import {useNavigate } from "react-router-dom";

import "./Navbar.css"

export default function Navbar(){

    const navigate = useNavigate()

    const navState = useSelector((state) => state.Nav.value);
    const user = useSelector((state) => state.userData.value);
    let modals = navState.navModals

    let [navAnimations, setNavAnimations] = useState({
        from:"",
        t0:"",
        highLight:"",
    })

    const dispatch = useDispatch()

    function handleCollapse(){ //state changes when nav button is closed
        dispatch(navStateAll({
            ...navState,
            isOpen : !navState.isOpen,
            navModals: {
                ...navState.navModals,
                user:{
                    ...navState.navModals.user,
                    open: false,
                },
                flashCards:{
                    ...navState.navModals.flashCards,
                    open: false,
                },
                todos:{
                    ...navState.navModals.todos,
                    open: false,
                }
            }

        }))

    }



    function handleOpenUser(){ //state changes when user button is clicked
        dispatch(navStateAll({
            ...navState,
            navModals: {
                ...navState.navModals,
                user:{
                    ...navState.navModals.user,
                    open: !navState.navModals.user.open,
                },
                flashCards:{
                    ...navState.navModals.flashCards,
                    open: false,
                },
                todos:{
                    ...navState.navModals.todos,
                    open: false,
                }
            }

        }))

        if(user.online){} navigate("/userProf")
        if(!user.online) navigate("/login")
    }

    function handleOpenTodos(e){ //state changes when todo button is clicked

        dispatch(navStateAll({
            ...navState,
            navModals: {
                ...navState.navModals,
                user:{
                    ...navState.navModals.user,
                    open: false,
                },
                flashCards:{
                    ...navState.navModals.flashCards,
                    open: false,
                },
                todos:{
                    ...navState.navModals.todos,
                    open: !navState.navModals.todos.open,
                }
            }
        }))

        navigate("/todos")
    }
    
    function handleOpenflashCards(){ //state changes when settings button is clicked
        dispatch(navStateAll({
            ...navState,
            navModals: {
                ...navState.navModals,
                user:{
                    ...navState.navModals.user,
                    open: false,
                },
                flashCards:{
                    ...navState.navModals.flashCards,
                    open: !navState.navModals.flashCards.open,
                },
                todos:{
                    ...navState.navModals.todos,
                    open: false,
                }
            },
        }))

        navigate("/flashCards")
    }

    let toggle;
    if(user.online){
        toggle = navState.isOpen? 160 : 16;
    }
    else{
        toggle = navState.isOpen? 60: 16;
    }
    let navIndicator = navState.isOpen? 0: -180;

    return(
        <div className="navbar-container">
                <div className="search-container" onClick={handleCollapse} style={{transform:`rotate(${navIndicator}deg)`}}>
                    <KeyboardArrowDownIcon
                        className="search-arrow-down"
                        sx={{ fontSize: "2.55vw", color:"black", backgroundColor:"rgba(238, 238, 238, .9)", borderRadius:"30px 30px", border: ".75px solid rgba(255,255,255,.3)"}}
                    />
                </div>

            <div className={`search-container-collapseable ${toggle}`} style={{height:`${toggle}px`}} >

                {/*navState.isOpen ? 
                <div className="nav-highlight" style={{transform:`translate(0rem, ${navAnimations.highLight}rem)`, backgroundColor:`${modals.settings.open||modals.user.open||modals.todos.open ? "white" : "rgba(18, 18, 18, 1)" }`, 
                    display:`${modals.settings.open||modals.user.open||modals.todos.open ? "inherit" : "none"}`}}>

    </div> : ""*/}
                
                <div className="search-container-icons">
                    <div className="search-container-collapseable-items">
                        <PersonIcon
                            sx={{color:`${modals.user.open? "rgba(255, 94, 14, 1)" : "black"}`, fontSize:"1.3vw"}}
                            className={"test"}
                            onClick={handleOpenUser}
                        >
                        </PersonIcon>
                    </div>

                    {user.online ? <><div className="search-container-collapseable-items">
                        <FormatListBulletedIcon
                            sx={{color:`${modals.todos.open? "rgba(255, 94, 14, 1)" : "black"}`, fontSize:"1.3vw"}}
                            onClick={handleOpenTodos}
                        />
                    </div></> : ""}

                    {/*<div className="search-container-collapseable-items"> 
                    <MusicNoteIcon
                        sx={{color:`${modals.todos.open? "black" : "#f3f3f3"}`, fontSize:24}}
                        onClick={handleOpenMusic}
                    />
                    </div>*/}

                    {user.online ? <><div className="search-container-collapseable-items">
                        <LayersIcon
                            sx={{color:`${modals.flashCards.open? "rgba(255, 94, 14, 1)" : "black"}`, fontSize:"1.3vw"}}
                            onClick={handleOpenflashCards}
                        />
                    </div> </> : ""}

                </div>
            
            </div>
            
        </div>
    )
}


