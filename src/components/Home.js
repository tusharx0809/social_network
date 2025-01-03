import React,{useContext, useEffect} from 'react'
import profileContext from "../context/profile/ProfileContext";
import { useNavigate } from "react-router-dom";
import Posts from './Posts';
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
    <div className="container mx-auto my-10 p-4 max-w-4xl">
      <Posts/>
    </div>
  )
}

export default Home
