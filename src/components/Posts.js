import React, {useContext} from "react";
import profileContext from "../context/profile/ProfileContext";

const Posts = () => {
  const { user, getUserProfile, getAllPosts } = useContext(profileContext);
  return <div>
    {user?.name || ""}
  </div>;
};

export default Posts;
