import React, { useState, useEffect } from "react";
import ProfileContext from "./ProfileContext";

const ProfileState = (props) => {
  const host = "http://localhost:5000";
  

  

  const [alert, setAlert] = useState(); // Add alert state
  const showAlert = (message, type) => {
    setAlert({message, type});
    setTimeout(() => setAlert(null), 3000); // Alert disappears after 3 seconds
  };


  const [user, setUser] = useState(null);
  const getUserProfile = async () => {
    const response = await fetch(`${host}/api/auth/getuser/`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json) {
      setUser(json);
    } else {
      console.error("Error fetching user data!");
    }
  };



  const [posts, setPosts] = useState([]);
  const createPost = async (description) => {
    const response = await fetch(`${host}/api/posts/createpost/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ description }),
    });
    const json = await response.json();
    if (json) {
      setPosts([...posts, json]);
      showAlert("Post Added!","success");
    } else {
      console.error("Error creating post!");
    }
  };
  const getAllPosts = async () => {
    const response = await fetch(`${host}/api/posts/fetchallposts/`);
    const json = await response.json();
    if (json) {
      setPosts(json);
      json.forEach((post) => {
        getLikes(post._id);
      });
    } else {
      console.error("Error fetching posts!");
    }
  };


  const [likes, setLikes] = useState({}); // Key: postID, value: likes
  const getLikes = async (postId) => {
    const response = await fetch(`${host}/api/comments/get-likes/${postId}`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (json) {
      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: json.likes,
      }));
    } else {
      console.error("Error fetching likes!");
    }
  };
 



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile();
      // eslint-disable-next-line
      getAllPosts();
    }
  }, []);
  return (
    <ProfileContext.Provider
      value={{
        getUserProfile,
        user,
        setUser,
        posts,
        createPost,
        getAllPosts,
        getLikes,
        likes,
        alert,
        showAlert
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  );
};
export default ProfileState;
