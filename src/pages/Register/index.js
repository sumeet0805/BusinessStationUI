import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterUser } from '../../apicalls/users'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { HideLoader, ShowLoader } from '../../redux/loaderSlice';

function Register() {
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const[user,setUser]=React.useState({
        name:'',
        email:'',
        password:'',
    })

    useEffect(()=>{
        if(localStorage.getItem("token")){
            window.location.href="/"
        }
      })

const register=async()=>{
    try{
        dispatch(ShowLoader());
        const response=await RegisterUser(user);
        dispatch(HideLoader());
        if(response.success){
            toast.success(response.message);
        }else{
            toast.error(response.message);
        }
    }catch(err){
        toast.error(err.message);
        dispatch(HideLoader());
    }
}
  return (
    <div className='h-screen bg-primary flex items-center justify-center'>
        <div className='bg-white shadow-md p-5 flex flex-col gap-4 w-96'>
            <h1 className='text-xl uppercase font-semibold text-primary'>
                Tinder Chat Register
            </h1>
            <hr/>
            <input type='text'
            value={user.name}
            placeholder='Enter Your Name'
            onChange={(e)=>setUser({...user,name:e.target.value})}/>
             <input type='email'
            value={user.email}
            placeholder='Enter Your email'
            onChange={(e)=>setUser({...user,email:e.target.value})}/>
             <input type='password'
            value={user.password}
            placeholder='Enter Your password'
            onChange={(e)=>setUser({...user,password:e.target.value})}/>
            <button className='contained-btn' onClick={register}>Register</button>
            <Link to={'/login'} className="underline">Already have an account?Login</Link>
        </div>
    </div>
  )
}

export default Register