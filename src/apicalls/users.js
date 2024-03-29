import { axiosInstance } from ".";


export const LoginUser = async (user) => {
  try {
    const response = await axiosInstance.post(
      "https://businessstationservice.onrender.com/api/users/login",
      user
    );
    return response.data;
  } catch (err) {
    return err;
  }
}; 

export const RegisterUser = async (user) => {
  try {
    const response=await axiosInstance.post("https://businessstationservice.onrender.com/api/users/register",user);
    return response.data;

  } catch (err) {
    return err;
  }
};

export const currentUser = async () => {
  try{
    const response= await axiosInstance.get("https://businessstationservice.onrender.com/api/users/currentuser");
    return response.data;
  }catch(error){
    return error.response.data;
  }
}

export const getAllUsers = async () =>{
  try{
    const response= await axiosInstance.get("https://businessstationservice.onrender.com/api/users/get-all-users");
    return response.data;
  }catch(err){
    return err.response.data;
  }
}
