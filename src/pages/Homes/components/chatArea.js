import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendMessage } from "../../../apicalls/messages";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import { GetMessages } from "../../../apicalls/messages";
import moment from "moment";
import { setAllChats } from "../../../redux/userSlice";
import { clearChatMessages } from "../../../apicalls/chats";
import store from "../../../redux/store"
import userReducer from "../../../redux/userSlice"
function ChatArea({ socket }) {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = React.useState("");
  const { selectedChat, user, allChats } = useSelector((state) => state.userReducer);
  const [messages = [], setMessages] = React.useState([]);
  const receipientUser = selectedChat.members.find(
    (mem) => mem._id !== user._id
  );

  const clearUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-message",{
        chat:selectedChat._id,
        members:selectedChat.members.map((mem)=>mem._id),
      })

      dispatch(ShowLoader());
      const response = await clearChatMessages(selectedChat._id);
      dispatch(HideLoader());
      if (response.success) {
        dispatch(setAllChats(response.data));
      }
    } catch (err) {
      dispatch(HideLoader());
      toast.error(err.message);
    }
  }

  const getMessages = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetMessages(selectedChat._id);
      dispatch(HideLoader());
      if (response.success) {
        setMessages(response.data);
      }
    } catch (err) {
      dispatch(HideLoader());
      toast.error(err.message);
    }
  };

  useEffect(() => {
    socket.emit("clear-unread-message",{
      chat:selectedChat._id,
      members:selectedChat.members.map((mem)=>mem._id),
      sender:user._id,
    })

    socket.off("receive-message").on("receive-message", (message) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (selectedChat._id === message.chat) {
        console.log("Message Received", message)
        setMessages((prev) => [...prev, message]);
      }

      const tempSelectedChat = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;

      if (tempSelectedChat?._id !== message.chat) {
        const updatedAllchats = allChats.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              unreadMessages: (chat?.unreadMessages || 0) + 1,
              lastMessage: message,
            }
          }
          return chat;
        })
        dispatch(setAllChats(updatedAllchats));
      }
      if(tempSelectedChat._id === message.chat && message.sender !== user._id){
        clearUnreadMessages();
      }
    })

    socket.off("unread-messages-cleared").on("unread-messages-cleared",(data)=>{
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if(tempSelectedChat._id===data.chat && data.sender!==user._id){
        setMessages(prevMessages=>{
          return prevMessages.map(message=>{
            return{
              ...message,
              read:true,
            }
          })
        })
      }
    })

    clearUnreadMessages();
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    //always Scroll to bottom for messages id
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  const sendNewMessage = async () => {
    try {
      const message = {
        chat: selectedChat._id,
        sender: user._id,
        text: newMessage,
        read: false,
      };

      //send message to server to save in db
      const response = await SendMessage(message);

      if (response.success) {
        setNewMessage("");
        socket.emit("send-message", {
          ...message,
          members: selectedChat.members.map((mem) => mem._id),
          createdAt: moment(),
          userId: user._id,
          read: false,
        });
      }
    } catch (err) {

      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white h-[81vh] border rounded-xl w-full flex flex-col justify-between p-3 gap-1">
      <div>
        <div className="flex gap-5 items-center mb-2">
          {receipientUser.profilePic && (
            <img
              src={receipientUser.profilePic}
              alt="profile pic"
              className="w-4 h-4 rounded-full"
            />
          )}
          {!receipientUser.profilePic && (
            <div className="bg-gray-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
              <h1 className="uppercase text-small font-semibold">
                {receipientUser.name[0]}
              </h1>
            </div>
          )}
          <h1 className="uppercase">{receipientUser.name}</h1>
        </div>
        <hr />
      </div>
      {/*  All chats */}
      <div className="h-[65vh] overflow-y-scroll p-5 bg-slate-950"
        id="messages">
        <div className="flex flex-col gap-2 text-purple-200">
          {messages.map((message) => {
            const isCurrentUserSender = message.sender === user._id;
            return (
              <div className={`flex ${isCurrentUserSender && "justify-end text-blue-500"}`}>
                <div className="flex flex-col justify-between content-center">
                  <div
                    className={`text-sm rounded-b-none font-bold `}
                  >
                    {message.text}
                  </div>
                  <p className="text-xs">{moment(message.createdAt).format("hh:mm A")}</p>
                </div>
                {isCurrentUserSender && <i class={`ri-check-double-line ${message.read ? "text-green-500" : "text-gray-500"}`}></i>}
              </div>
            );
          })}
        </div>
      </div>
      {/* Input Chat Area */}
      <div>
        <div className="h-10 rounded-sm border-gray-300 shadow flex justify-between content-center">
          <input
            type="text"
            placeholder="Type a message"
            className="w-[90%] border-0 focus:border-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={sendNewMessage}
            className="bg-primary text-white p-2 rounded py-1 px-5 m-1"
          >
            <div class="ri-send-plane-line"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default ChatArea;
