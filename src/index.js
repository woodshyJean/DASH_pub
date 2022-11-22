import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import logedUserData from './Components/Features/logedUserData.js';
import AddTodoState from './Components/Features/AddTodoState';
import NavState from './Components/Features/NavState';


import { BrowserRouter } from 'react-router-dom'; 


const store = configureStore({
  reducer: {
    userData:logedUserData,
    addTodoState: AddTodoState,
    Nav: NavState,
  }
})



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

