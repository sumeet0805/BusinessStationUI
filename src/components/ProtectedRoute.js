import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { currentUser, getAllUsers } from "../apicalls/users";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers, setUser,setAllChats } from "../redux/userSlice";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { GetAllChats } from "../apicalls/chats";
 
function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      window.location.href="/login"
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await currentUser();
      const repsonseall=await getAllUsers();
      const responseChats=await GetAllChats();

      dispatch(HideLoader());
      if(response.message==='jwt expired'){
        localStorage.removeItem('token');
        window.location.href="/login"
      }
      if (response.success) {
        dispatch(setUser(response.data));
        if(repsonseall.success){
            dispatch(setAllUsers(repsonseall.data))
            dispatch(setAllChats(responseChats.data))
            console.log(repsonseall.data)
        }
      } else {
        toast.error("Invalid Token");
        window.location.href="/login"
      }
    } catch (err) {
      dispatch(HideLoader());
      toast.error("Invalid Token");
      window.location.href="/login"
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-300 p-1">
      {/* {header} */}
      <div className="flex justify-between p-5 bg-blue-950">
        <div className="flex items-center gap-1">
        <i className="ri-message-3-line text-xl text-white"></i>
        <h1 className="text-primary text-xl font-bold text-white">Business Station</h1>
        </div>
        <div className="flex items-center gap-1 text-sm">
        <i className="ri-map-pin-user-line text-white"></i>
        <h1 className="underline font-bold text-white">{user?.name.toUpperCase()}</h1>
        <i className="ri-logout-circle-r-line cursor-pointer text-white"
        onClick={()=>{
            localStorage.removeItem('token');
            navigate('/login')
        }}></i>
        </div>
      </div>
      {/* content {pages} */}
      <div className="p-5">{children}</div>
    </div>
  );
}

export default ProtectedRoute;
