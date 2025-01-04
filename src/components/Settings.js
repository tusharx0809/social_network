import React, {useContext} from 'react'
import profileContext from "../context/profile/ProfileContext";
const Settings = () => {
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
      <div className="container mx-auto my-10 p-4 max-w-4xl">
      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 my-6">
          <div className="box-border h-auto w-auto p-4 border-2 rounded-3xl border-gray-500">
          <h5 className="mb-2 text-3xl font-light text-gray-900 dark:text-white my-3">
            User Information Settings
          </h5>
          </div>
          <p className="mb-2 text-xl font-light text-gray-900 dark:text-white my-6">
              <strong>Profession:</strong> {user.profession}
          </p>
          <p className="mb-2 text-xl font-light text-gray-900 dark:text-white my-6">
              <strong>Location:</strong> {user.location}
          </p>
          <p className="mb-2 text-xl font-light text-gray-900 dark:text-white my-6">
              <strong>Phone:</strong> {user.phone}
          </p>
  
          
          
        </div>

        <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="box-border h-auto w-auto p-4 border-2 rounded-3xl border-gray-500">
          <h5 className="mb-2 text-3xl font-light text-gray-900 dark:text-white my-3">
            Account Settings
          </h5>
          </div>
          <p className="mb-2 text-xl font-light text-gray-900 dark:text-white my-6">
              <strong>Profession:</strong> {user.profession}
          </p>
          <p className="mb-2 text-xl font-light text-gray-900 dark:text-white my-6">
              <strong>Location:</strong> {user.location}
          </p>
          <p className="mb-2 text-xl font-light text-gray-900 dark:text-white my-6">
              <strong>Phone:</strong> {user.phone}
          </p>
  
          
          
        </div>
        
      </div>
      </>
      </div>
      )
}

export default Settings
