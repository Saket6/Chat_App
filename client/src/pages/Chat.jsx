import React, { useEffect, useRef, useState } from 'react'
import '../css/chat.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { ChatContainer } from '../components/ChatContainer';
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client'
import { MdLogout} from "react-icons/md";
import LoadingScreen from 'react-loading-screen';
import loadinganimation from './loadinganimation.gif'
export const Chat = () => {

    //socket

    const socket=useRef();


    const [currUser, setCurrUser] = useState(undefined);
    const [contacts, setContacts] = useState(undefined);
    const [selected,setSelected]=useState(undefined);
    const [isLoading, setLoading] = useState(true);
    const Navigate=useNavigate();


    const options={
        position: "top-right",
        autoClose: 5000,
        pauseOnHover: true,
        theme: "colorful",
    }

    const getCurrUser = async () => {


        try {
            const res = await axios.get('http://localhost:5000/getCurrUser', { withCredentials: true });
            console.log(res.data);
            setCurrUser(res.data)
            
        }
        catch(err)
        {
            if(axios.isAxiosError(err))
            {
                toast.error(err.response.data.error,options)
                Navigate('/login');
            }
        }
     

    }


    const getContacts=async ()=>
    {
        try{
            const res=await axios.get('http://localhost:5000/getContacts',{ withCredentials: true })
            console.log(res.data);
            setContacts(res.data);
            setLoading(false);
        }
        catch(err)
        {
            console.log(err);
        }
    }


    const handleLogout=async ()=>
    {
        try{
            const res=await axios.get('http://localhost:5000/logout',{ withCredentials: true })
            console.log(res.data);  
            setCurrUser(undefined);
            setContacts(undefined);
            toast.success("Logged out",options);
            // setLoading(true);
            Navigate('/login');
        }
        catch(err)
        {
            console.log(err);
        }
    }

    useEffect(() => {
        getCurrUser();
    }, [])

    useEffect(()=>
    {
        getContacts();
    },[currUser]);

    useEffect(()=>{
        if(currUser)
        {
            socket.current=io("http://localhost:5000");
            socket.current.emit("addUser", currUser._id);
        }
    },[currUser]);


    return (

        <div className="newcontainer">
            {
                isLoading ? ( <LoadingScreen
                    loading={true}
                    spinnerColor='#9ee5f8'
                    textColor='#676767'
                    bgColor='black'
                    logoSrc={loadinganimation}
                   
                 / > ) : (<div className='maincontainer'>
                    <div className="contacts">
                        <div className="Userdiv">
                            <img className="avatarImg" src={`data:image/svg+xml;base64,${currUser.AvatarImg}`} alt="img" />
                            <span className='span' >{currUser.name}</span>
                            <MdLogout className='logoutbtn' onClick={handleLogout} />
                        </div>
                        {
                            contacts.map((contact,index)=>
                            {
                                return(
                                    <div className={`contactdiv  ${selected===index? "selectedcont":"" }  `} key={index} onClick={()=>setSelected(index)} >
                                        <img src={`data:image/svg+xml;base64,${contact.AvatarImg}`} alt="img" className="avatarImg" />
                                        <span className='span' >{contact.name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="chatcontainer">
                        {
                            selected!==undefined?(<ChatContainer  currContact={contacts[selected]} currUser={currUser} socket={socket} />):("Start Messaging...")
                        }
                    </div>
                </div>)}
            <ToastContainer/>
        </div>



    )
}
