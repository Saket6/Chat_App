import React, { useEffect, useState } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/avatar.css'
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';
export const Avatar = () => {

    const Navigate=useNavigate();
    const [AvatarArr, setAvatarArr] = useState([]);
    const [selected,setSelected]=useState("");
    const getAvatars = async () => {
        const Arr = [];

        for (let i = 0; i < 2; i++) {
            const res = await axios.get(`https://api.multiavatar.com/${Math.round(Math.random() * 10000)}`)
            // console.log(res.data);
            const buffer = new Buffer(res.data);
            Arr.push(
                buffer.toString("base64")
            )
        }
        // console.log(Arr);

        setAvatarArr(Arr);
    }

    const setImage=(index)=>
    {
        setSelected(index);
    }


    const options={
        position: "top-right",
        autoClose: 5000,
        pauseOnHover: true,
        theme: "colorful",
    }

    const handleSubmit = async (e)=>
    {
        e.preventDefault();
        try{
            const res=await axios.post('http://localhost:5000/avatar',{
            avatar: AvatarArr[selected]
        },{withCredentials:true})

        // console.log(res);
        toast.success(res.data.message,options);

        setTimeout(()=>
        {
            Navigate('/');
        },2000)
        
        }
       catch(err){
        if(axios.isAxiosError(err))
        {
            toast.error(err.data.response.error,options);
        }
       }
        
    }

    useEffect(() => {
        getAvatars();
    }, [])

    return (
        <div className='container'>
            <h1>Select an Avatar</h1>
            <div className="contents">
            {
                AvatarArr.map((avImg, index) => {
                    return (

                        
                            <span className="avatars" key={index} ><img   src={`data:image/svg+xml;base64,${avImg}`} className={`img ${selected===index? "selected":""  }`} alt="" onClick={()=>setImage(index)} /></span>
                        

                    )
                })
                
            }
            </div>
            <div>  <button className="submit" onClick={handleSubmit}>Use this Avatar</button></div>
            <ToastContainer/>
          
        </div>
    )
}
