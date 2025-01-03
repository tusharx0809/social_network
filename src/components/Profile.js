import React,{useContext, } from 'react'
import profileContext from "../context/profile/ProfileContext";

const Profile = () => {
    const { alert, user, showAlert, getUserProfile } = useContext(profileContext);
  return (
    <div>
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
    
    </>
    </div>
  )
}

export default Profile
