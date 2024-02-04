import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import { CreateNewChat } from "../../../apicalls/chats";
import store from "../../../redux/store"
import ChatArea from "./chatArea"

function UserList({ searchKey,socket }) {
  const { allUsers, allChats, user, selectedChat } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();

  const getData = () => {
    return allUsers.filter(
      (userObj) =>
        (searchKey &&
          userObj.name.toLowerCase().includes(searchKey.toLowerCase())) ||
        allChats.some((chats) =>
          chats?.members?.map((mem) => mem._id).includes(userObj._id)
        )
    );
  };

  const createNewChat = async (receipentUserId) => {
    try {
      dispatch(ShowLoader());
      const responsedata = await CreateNewChat([user._id, receipentUserId]);
      dispatch(HideLoader());
      if (responsedata.success) {
        toast.success(responsedata.message);
        const newchat = responsedata.data;
        const updateList = [...allChats, newchat];
        dispatch(setAllChats(updateList));
        dispatch(setSelectedChat(newchat));
      } else {
        toast.error(responsedata.message);
      }
    } catch (err) {
      dispatch(HideLoader());
      toast.error(err.message);
    }
  };

  const openChat = (receipientuserid) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((mem) => mem._id).includes(user._id) &&
        chat.members.map((mem) => mem._id).includes(receipientuserid)
    );
    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  const getIsSelectedChatOrNot = (user) => {
    if (selectedChat) {
      return selectedChat.members.map((mem) => mem._id).includes(user._id);
    }
    return false;
  };

  const getLastMsg = (userObj) => {
    const chat = allChats.find((chat) =>
      chat?.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const lastMsgPerson =
        chat?.lastMessage?.sender === user._id ? "You : " : "";
      return `${lastMsgPerson} ${chat?.lastMessage?.text}`;
    }
  };

  const getUnreadMessageCount = (userObj) => {
    const chat = allChats.find((chat) =>
      chat?.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (
      !chat ||
      (chat?.unreadMessages && chat.lastMessage?.sender !== user._id)
    ) {
      return (
        <div className="bg-blue-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
          {chat?.unreadMessages}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {getData().map((userObj) => {
        return (
          <div
            className={`shadow-sm border p-1 rounded-xl cursor-pointer bg-white justify-between items-center flex
                ${getIsSelectedChatOrNot(userObj) && `border-primary border-2`})
              `}
            key={userObj._id}
            onClick={() => openChat(userObj._id)}
          >
            <div className="flex gap-5 items-center">
              {userObj.profilePic && (
                <img
                  src={userObj.profilePic}
                  alt="profile pic"
                  className="w-4 h-4 rounded-full"
                />
              )}
              {!userObj.profilePic && (
                <div className="bg-gray-500 text-white rounded-full h-5 w-5 flex items-center justify-center cursor-pointer">
                  <h1 className="uppercase text-small font-semibold">
                    {userObj.name[0]}
                  </h1>
                </div>
              )}
              <div className="flex flex-col text-xs font-bold">
                <div className="flex flex-row gap-1 w-full justify-between">
                  <h1 className="font-bold text-sm">{userObj.name}</h1>
                  {getUnreadMessageCount(userObj)}
                </div>
                <h1 className="text-blue-700">{getLastMsg(userObj)}</h1>
              </div>
            </div>
            <div onClick={() => createNewChat(userObj._id)}>
              {!allChats.find((chat) =>
                chat?.members.map((mem) => mem._id).includes(userObj._id)
              ) && (
                <button className="border-primary border text-primary bg-white p-0 rounded text-xs">
                  Create
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserList;
