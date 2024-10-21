import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import axios, {isCancel, AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
export const Login = () => {
  const Navigate=useNavigate();
  const [logdet,setLogDet]=useState({
    email:'',
    password: ''
  })

  const options={
    position: "top-right",
    autoClose: 2000,
    pauseOnHover: true,
    theme: "colorful",
}

  const handleInputs=(e)=>
  {
    setLogDet((old)=>
    {
      return{
        ...old,[e.target.name]:e.target.value
      }
    })
  }

  const handleSubmit=async (e)=>
  {
    e.preventDefault();
    try{
      const res=await axios.post('http://localhost:5000/login',{
        logdet
      },
      {withCredentials:true})

      if(res.status===200)
      {
        // alert(res.data.message);
        toast.success(res.data.message,options);
        setTimeout(() => {
          console.log(document.cookie);
          Navigate("/");
        }, 2000); 
        console.log(document.cookie)
      }
    }catch(err)
    {
      if(axios.isAxiosError(err))
      {
        toast.error(err.response.data.error,options)
      }
    }
  }

  return (
    <div className='main'>
        <form method="post" onSubmit={handleSubmit} >
            <input type="email" name="email" id="email" placeholder='Enter your email' onChange={handleInputs} />
            <input type="password" name="password" id="password" placeholder='Enter your password' onChange={handleInputs} />
            <div className="buttons">
                <button type='Submit' className='submit_button'>Sign in</button>
                <span className='reg_span' >No accounts yet?   <NavLink to="/register" className='link' > REGISTER </NavLink></span>
            </div>
        </form>
        <ToastContainer/>
    </div>
  )
}
