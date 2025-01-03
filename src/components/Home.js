import React,{useContext, useEffect} from 'react'
import profileContext from "../context/profile/ProfileContext";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { user, getUserProfile, getAllPosts } = useContext(profileContext);
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
    <div className="container mx-auto my-6">
      {user?.name || " "}
    </div>
  )
}

export default Home
