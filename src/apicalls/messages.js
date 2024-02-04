import { axiosInstance } from "./index"


export const SendMessage=async(message)=>{
    try{
        const response= await axiosInstance.post("http://localhost:5000/api/messages/new-message",
        message
        );
        return response.data
    }catch(err){
        throw err; 
    }
}

export const GetMessages=async(chatId)=>{
    try{
        const response=await axiosInstance.get(`http://localhost:5000/api/messages/get-all-messages/${chatId}`);
        return response.data
    }catch(err){
        return err
    }
}