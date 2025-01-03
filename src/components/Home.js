import React,{useContext, useEffect} from 'react'
import profileContext from "../context/profile/ProfileContext";
import { useNavigate } from "react-router-dom";
import Posts from './Posts';
const Home = () => {
  const { alert, user, getUserProfile, getAllPosts } = useContext(profileContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!localStorage.getItem('token')){
      navigate('/login');
    }else{
      getUserProfile();
      getAllPosts();
    }
  },[])
  
  return (
    <>
    <div>
        {/* Display alert if exists */}
        {alert && alert.message && alert.type && (
          <div className={`p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 ${
            alert.type === "success" 
            ? "dark:text-green-400"
            : alert.type === "danger"
            ? "dark:text-red-400"
            : ""
          }`}
          style={{
            position: "fixed",
            top: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            width: "500px",
            padding: "10px",
            textAlign: "center",
            borderRadius: "20px",
          }}>
          <span className="font-medium">Alert: </span> {alert.message}
        </div>
        )}
      </div>
    <div className="container mx-auto my-10 p-4 max-w-4xl">
      <Posts/>
    </div>
    </>
  )
}

export default Home
