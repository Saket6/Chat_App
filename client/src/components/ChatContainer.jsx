import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const ChatContainer = ({ currContact, currUser, socket }) => {
  const [dispEmoji, setDispEmoji] = useState(false);
  const [msg, setMsg] = useState("");
  const scrollRef = useRef();
  const [AllMessages, setAllMessages] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState(null);
  const [file,setFile]=useState();
  const handleEmoji = (emoji, e) => {
    console.log("entered");
    setMsg((prev) => prev + emoji.emoji);
    console.log(msg);
  };

  const handleSubmit = async () => {
    try {




    //   const formData = new FormData();
    // formData.append('file', file); // Append the selected file

    // // Send the file to the server along with the message
    // const fileUploadResponse = await axios.post(
    //   "http://localhost:5000/upload",
    //   formData,
    //   {
    //     withCredentials: true,
    //     headers: {
    //       'Content-Type': 'multipart/form-data', // Important: Set the content type
    //     },
    //   }
    // );

    // // Retrieve the uploaded file URL from the server response
    // const uploadedFileUrl = fileUploadResponse.data.fileUrl;




      const res = await axios.post(
        "http://localhost:5000/postmessage",
        {
          from: currUser._id,
          to: currContact._id,
          message: msg,
          // fileUrl: uploadedFileUrl
        },
        { withCredentials: true,
        }
      );

      socket.current.emit("send", {
        to: currContact._id,
        from: currUser._id,
        msg: msg,
        // fileUrl: uploadedFileUrl,
      });

      const msgs = [...AllMessages];
      msgs.push({ self: true, message: msg });
      setAllMessages(msgs);

      console.log("messege sent");
      if (res.status !== 200) {
        throw new Error("msg could not be saved");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllMsg = async () => {
    try {
      if (currContact) {
        const res = await axios.post(
          "http://localhost:5000/getmessage",
          {
            self: currUser._id,
            other: currContact._id,
          },
          { withCredentials: true }
        );
        if (res.status !== 200) {
          throw new Error("msg could not be saved");
        }
        console.log(res.data);
        setAllMessages(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handleFile=(e)=>
  // {
  //   console.log(e.target.files);
  //   setFile(e.target.files[0]);
  // }


  useEffect(() => {
    console.log("useeffect called");
    // console.log(AllMessages.length);
    getAllMsg();
  }, [currContact]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-recieve", (msg) => {
        setArrivalMsg({ self: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    if(arrivalMsg)
       setAllMessages((prev) => [...prev, arrivalMsg]);
    // arrivalMsg && setAllMessages((prev)=>[...prev,arrivalMsg]);
  }, [arrivalMsg]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [AllMessages]);

  return (
    <>
      <div className="chatheader">
        <img
          src={`data:image/svg+xml;base64,${currContact.AvatarImg}`}
          alt="img"
          className="avatarImg"
        />
        <span className="span">{currContact.name}</span>
      </div>
      <div className="chatbody">
        {
          AllMessages.length>0?
          AllMessages.map((message, index) => {
          return (
            <>
            <div
            ref={scrollRef}
              key={uuidv4()}
              className={` chatDiv ${message.self ? "sent" : "received"}`}
            >
              <div className="chat_message">{message.message}</div>
            </div>
             {message.fileUrl && (
              <img src={message.fileUrl} alt="File" className="file-image" />
            )}
            </>
          );
        }):"No messages yet"}
      </div>
      <div className="emojipicker" style={{ height: "0", width: "0" }}>
        {dispEmoji ? (
          <EmojiPicker
            theme="dark"
            height="50vh"
            width="20vw"
            onEmojiClick={handleEmoji}
          />
        ) : (
          ""
        )}
      </div>

      <div className="inputdiv">
        <BsEmojiSmileFill
          color="yellow"
          className="emoji"
          onClick={() => {
            dispEmoji === false ? setDispEmoji(true) : setDispEmoji(false);
          }}
        />
        <input
          type="text"
          className="messageinput"
          value={msg}
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
        />
        <MdSend className="sendbtn" onClick={handleSubmit} />

        {/* <input type="file" onChange={handleFile} /> */}
      </div>
    </>
  );
};
