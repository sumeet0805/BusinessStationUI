import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";

function Login() {
  const dispatch=useDispatch();
  
  const navigate=useNavigate();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  useEffect(()=>{
    if(localStorage.getItem("token")){
      window.location.href="/"
    }
  })

  const login = async () => {
    try {
      dispatch(ShowLoader());
      const response = await LoginUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token",response.data);
        window.location.href="/"
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      dispatch(HideLoader());
      toast.error(err.message);
    }
  };
  return (
    <div className="h-screen bg-primary flex items-center justify-center">
      <div className="bg-white shadow-md p-5 flex flex-col gap-4 w-96">
        <h1 className="text-xl uppercase font-semibold text-primary">
          Tinder Chat Login
        </h1>
        <hr />
        <input
          type="email"
          value={user.email}
          placeholder="Enter Your email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          value={user.password}
          placeholder="Enter Your password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button className="contained-btn" onClick={login}>
          Login
        </button>
        <Link to={"/register"} className="underline">
          Dont't have an account?Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
