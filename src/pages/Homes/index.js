import React, { useState } from 'react'
import UserSearch from './components/userSearch'
import ChatArea from './components/chatArea'
import UserList from './components/userList';
import { useSelector } from 'react-redux';
import {io} from "socket.io-client";
import { useEffect } from 'react';
const socket=io("https://businessstationservice.onrender.com"); 

function Home() {
 
  const [searchKey,setSearchKey]=useState("");
  const {selectedChat,user}=useSelector((state)=>state.userReducer);

  useEffect(()=>{
    if(user){
    console.log("Join room",user._id);
    socket.emit("join-room",user._id);
    }
  },[user])
  return (
    <div className='flex gap-5'>
      {/* User search and all chats area */}
      <div className='w-50'>
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey}
        value={searchKey}
        onChange={(e)=>setSearchKey(e.target.value)}/>
        <UserList socket={socket}
        searchKey={searchKey}/>
      </div>
      {/* chat area for chatting */}
      <div className='w-full'>
          {selectedChat && <ChatArea socket={socket}/>}
      </div>  
    </div>
  )
}

export default Home
