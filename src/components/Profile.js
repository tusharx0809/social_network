import React, { useContext, useState } from "react";
import profileContext from "../context/profile/ProfileContext";

const Profile = () => {


  const { alert, user, showAlert, getUserProfile } = useContext(profileContext);

  //Handling FriendsRequests
  const [isFriendsModal, setIsFriendsModal] = useState(false);
  const removeFriend = async (friendID) => {
    const id = user._id;
    const url = `http://localhost:5000/api/friends/remove-friend/${friendID}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const json = await response.json();
    if (json.message === "Friend Removed") {
      showAlert("Friend removed from Friend List", "success");
      getUserProfile();
    } else {
      alert("No Such friend Exists");
    }
  };
  const acceptRequest = async (friendID) => {
    const id = user._id;
    const url = `http://localhost:5000/api/friends/accept-request/${friendID}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const json = await response.json();
    if (json.message === "Friend request accepted") {
      showAlert("Friend Added", "success");
      getUserProfile();
    } else {
      showAlert("Not Added", "danger");
    }
  };
  const rejectRequest = async (friendID) => {
    const id = user._id;
    const url = `http://localhost:5000/api/friends/reject-request/${friendID}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const json = await response.json();
    if (json.message === "Friend Request Rejected") {
      showAlert("Friend Request Rejected", "success");
      getUserProfile();
    } else {
      showAlert("Something went wrong, Please Reload!", "danger");
    }
  };
  return (
    <div>
      <>
        <div>
          {/* Display alert if exists */}
          {alert && alert.message && alert.type && (
            <div
              className={`p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 ${
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
              }}
            >
              <span className="font-medium">Alert: </span> {alert.message}
            </div>
          )}
        </div>
        <div className="container mx-auto my-10 p-4 max-w-4xl">
          <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 my-6">
            <h5 className="mb-4 text-3xl font-light text-gray-900 dark:text-white">
              Friends
            </h5>
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flow-root">
                  <ul role="list" className="list-inside space-y-3 text-center">
                    {user &&
                      user.friends &&
                      user.friends.map((friend, index) => (
                        <li key={friend._id || index}>
                          <div className="flex flex-row items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {friend.name}&nbsp;
                            </p>
                            <button
                              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-3"
                              onClick={() => removeFriend(friend._id)}
                            >
                              Remove
                            </button>
                          </div>
                          
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 my-6">
            <h5 className="mb-4 text-3xl font-light text-gray-900 dark:text-white">
              Friend Requests
            </h5>
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flow-root">
                  <ul role="list" className="list-inside space-y-3 text-center">
                    {user &&
                    user.friendsRequests &&
                    user.friendsRequests.length > 0 ? (
                      user.friendsRequests.map((friend, index) => (
                        <li key={friend._id || index}>
                          <div className="flex flex-row items-center">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {friend.name}&nbsp;
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user && user.friendsRequests
                          ? "No friend requests found."
                          : "Loading..."}
                      </p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Profile;
