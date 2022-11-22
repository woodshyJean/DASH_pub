import React, {useEffect} from 'react';

import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";

import QuickInfo from './Components/QuickInfo/QuickInfo';

import Navbar from './Components/Navbar/Navbar';
import UserModal from './Components/UserModal/UserModal';
import Todos from './Components/Todos/Todos';
import Notification from './Components/Notification/Notification';
import UserSettings from './Components/UserSettings/UserSettings';
import FlashCards from './Components/FlashCards/FlashCards';

import './App.css';


function App() {

  const user = useSelector((state) => state.userData.value);
  const navstate = useSelector((state) => state.Nav.value);

  const navigate = useNavigate()


  useEffect(() => {
    const pageAccessedByReload = (
      (window.performance.navigation && window.performance.navigation.type === 1) ||
        window.performance
          .getEntriesByType('navigation')
          .map((nav) => nav.type)
          .includes('reload')
    ); 
    
    if (pageAccessedByReload) navigate("/login")

    if(!user.online){
      document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login")
    }

    if(user.online){
      document.onvisibilitychange = () => { //sends beacon that contains data whenever user leaves tab or reloads page
        let data = {data:user.todos, user:user.personal.name, goals:user.goals}
        const blob = new Blob([JSON.stringify(data)], {type : 'application/json'})
        if (document.visibilityState === 'hidden') {
          navigator.sendBeacon('http://localhost:5000/todos', blob)
        }
        else if(document.visibilityState === 'visible'){
          return
        }
      };
    }

    window.addEventListener("load", () => {
      navigate("/login")
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.online, user.todos, user.personal.name, user.goals])


  let modalBackground = navstate.navModals.user.open || navstate.navModals.todos.open || navstate.navModals.flashCards.open ?  {backgroundColor:""} : {background:""}

  return (
    <div className='App' style={modalBackground} >

      <div className='app-nav'>
        <Navbar/>
      </div>

      <div className='app-modals'>

        <div className='app-notification'>
          <Notification/>
        </div>

        {navstate.navModals.user.open || navstate.navModals.todos.open || navstate.navModals.flashCards.open ? "": ""}

        {navstate.navModals.user.open ? <UserModal/> : ''}

        {navstate.navModals.todos.open ? <Todos/> : ''}

        {navstate.navModals.flashCards.open ? <FlashCards/> : ''}

        {!navstate.navModals.user.open && !navstate.navModals.todos.open && !navstate.navModals.flashCards.open ? 
        <>

          <div className='app-quickInfo'>
            <QuickInfo/>
        </div>

        </>
      : ""}

      </div>
      
    </div>
  );
}

export default App;
