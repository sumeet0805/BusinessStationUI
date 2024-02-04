import {axiosInstance} from "./index";

export const GetAllChats = async() => {
    try{
        const response= await axiosInstance.get("https://businessstationservice.onrender.com/api/chats/get-all-chats");
        return response.data;
      }catch(error){
        return error.response.data;
    }
}

export const CreateNewChat = async(members) => {
    try{
        const response= await axiosInstance.post("https://businessstationservice.onrender.com/api/chats/create-new-chat",
        {
            members,
        });
        return response.data;
      }catch(error){
        return error.response.data;
      }
}

export const clearChatMessages = async(chatId) =>{
  try{
    const response = await axiosInstance.post("https://businessstationservice.onrender.com/api/chats/clear-unread-messages",
    {
      chatId,
    })
    return response.data;
  }catch(err){
    throw err;
  }
}
