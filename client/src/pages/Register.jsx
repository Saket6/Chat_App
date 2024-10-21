import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Register.css";
import { ToastContainer, toast } from "react-toastify";
import axios, { isCancel, AxiosError } from "axios";
import "react-toastify/dist/ReactToastify.css";
export const Register = () => {
  const Navigate = useNavigate();
  const [det, setDet] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      try {
        const res = await axios.post("http://localhost:5000/register", {
          det,
        });
        if (res.status === 200) {
         
        //   await new Promise((resolve) => setTimeout(resolve, 3000));
          const res = await axios.post(
            "http://localhost:5000/login",
            {
              logdet:{
                email:det.email,
                password: det.password,
              },
            },
            { withCredentials: true }
          );
          if(res.status === 200) {
            toast.success("Successfully Registered and Logged in");
            Navigate("/avatar");
        //   Navigate("/login");
        }}
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response.data.error, options);
        }
      }
    }
  };
  const handleInputs = (e) => {
    setDet((old) => {
      return {
        ...old,
        [e.target.name]: e.target.value,
      };
    });
  };

  const options = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "colorful",
  };
  const validation = () => {
    if (det.password !== det.c_password) {
      toast.error("Password and confirm password must be same!", options);
      return false;
    }
    if (det.name.length < 3) {
      toast.error("User name must have atleast 3 characters!", options);
      return false;
    }
    return true;
  };

  return (
    <>
      {" "}
      <ToastContainer />
      <div className="main">
        <form method="post" onSubmit={handleSubmit}>
          <input
            type="name"
            name="name"
            id="name"
            placeholder="User Name"
            onChange={handleInputs}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            onChange={handleInputs}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            onChange={handleInputs}
          />
          <input
            type="password"
            name="c_password"
            id="c_password"
            placeholder="Confirm Password"
            onChange={handleInputs}
          />
          <div className="buttons">
            <button type="Submit" className="submit_button">
              Sign up
            </button>
            <span className="reg_span">
              Already have an Account?{" "}
              <NavLink to="/login" className="link">
                LOGIN
              </NavLink>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};
