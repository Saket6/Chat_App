import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import { Avatar } from "./pages/Avatar";
import { Chat } from "./pages/Chat";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* <Route exact path="/" element={<Home/>} /> */}
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/avatar" element={<Avatar/>} />
        <Route exact path="/" element={<Chat/>} />
      </Routes>
    </>
  );
}

export default App;
