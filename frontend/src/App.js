import './App.css';
import SignUp from "./components/SignUp"
import Login from "./components/Login"
import React from 'react';
import Chat from './components/Chat'
import Chesss from './components/Chess'
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
    <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path="SignUp" element={<SignUp/>}/>
        <Route path="chat" element={<Chat/>}/>
        <Route path="chess" element={<Chesss/>}/>
    </Routes>
  );
}

export default App;
