import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import profileContext from "../context/profile/ProfileContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { alert, showAlert, user, setUser } = useContext(profileContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  //Handling search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isUserModal, setIsUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.length) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/search-query/search?name=${encodeURIComponent(
            term
          )}`
        );
        if (response.ok) {
          let data = await response.json();
          data = data.filter((u) => u._id !== user._id);
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };
  const goToProfile = (userId) => {
    const userSelected = searchResults.find((u) => u._id === userId);
    if (userSelected) {
      setSelectedUser(userSelected);
      setIsUserModal(true);
    }
  };

  //Handling Friend Requests
  const addFriend = async (id) => {
    const host = "http://localhost:5000";
    const response = await fetch(`${host}/api/friends/send-request/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user._id }),
    });
    const json = await response.json();
    if (json.message === "Friend request sent") {
      showAlert("Friend request sent!", "success");
    } else {
      showAlert(json.message, "danger");
    }
  };
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
    } else {
      showAlert("No Such friend Exists", "danger");
    }
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex flex-1 items-center justify-between sm:items-stretch">
              <div className="flex items-center">
                <p className="font-sans text-xl text-white">
                  SocialMate {user?.name ? `-${user.name}` : ""}{" "}
                </p>
              </div>
              {/* Desktop Links */}
              {user && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                  <form className="flex items-center max-w-sm mx-auto">
                    <div className="relative w-full">
                      <input
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        placeholder="Search for users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ zIndex: 2 }}
                        ref={searchRef}
                      />
                      {searchResults.length > 0 && (
                        <div
                          className="searchedresults"
                          style={{
                            position: "absolute",
                            backgroundColor: "#15161a",
                            right: "5px",
                            left: "5px",
                            padding: "5px",
                            width: "auto",
                            zIndex: 1000,
                            borderRadius: "15px",
                          }}
                        >
                          <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                            {searchResults.map((searchedUser) => (
                              <>
                                <li
                                  className="pb-3 sm:pb-4 m-3"
                                  key={searchedUser._id}
                                  onClick={() => goToProfile(searchedUser._id)}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-500 truncate dark:text-white">
                                        {searchedUser.name}
                                      </p>
                                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        {searchedUser.username}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              </>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </form>

                  <Link
                    to="/"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Home
                  </Link>
                  <Link
                    to="/friends"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Friends
                  </Link>
                  <Link
                    to="/settings"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={menuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {menuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Links */}
          {menuOpen && user && (
            <div className="sm:hidden" id="mobile-menu">
              <div className="space-y-1 px-2 pt-2 pb-3">
                <form className="flex items-center max-w-sm mx-auto">
                  <div className="relative w-full">
                    <input
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      placeholder="Search for users..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{ zIndex: 2 }}
                      ref={searchRef}
                    />
                    {searchResults.length > 0 && (
                      <div
                        className="searchedresults"
                        style={{
                          position: "absolute",
                          backgroundColor: "gray",
                          right: "5px",
                          left: "5px",
                          padding: "5px",
                          width: "auto",
                          zIndex: 1000,
                          borderRadius: "15px",
                        }}
                      >
                        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                          {searchResults.map((searchedUser) => (
                            <>
                              <li
                                className="pb-3 sm:pb-4 m-3"
                                key={searchedUser._id}
                                onClick={() => goToProfile(searchedUser._id)}
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-500 truncate dark:text-white">
                                      {searchedUser.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                      {searchedUser.username}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            </>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </form>
                <Link
                  to="/"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Home
                </Link>
                <Link
                  to="/friends"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Friends
                </Link>
                <Link
                  to="/settings"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-red-700 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {isUserModal && (
        <div
          id="default-modal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-6">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Profile
                </h3>
              </div>
              <section className="modal-card-body">
                <div className="columns is-vcentered">
                  <div className="column">
                    <div className="is-size-4 my-2">
                      <strong>Name:</strong> {selectedUser.name}
                    </div>
                    <div className="is-size-4">
                      <strong>Username:</strong> {selectedUser.username}
                    </div>
                    <div className="is-size-4 my-2">
                      <strong>Profession:</strong> {selectedUser.profession}
                    </div>
                    <div className="is-size-4">
                      <strong>Location:</strong> {selectedUser.location}
                    </div>
                    <div className="is-size-4 my-2">
                      <strong>Phone:</strong> {selectedUser.phone}
                    </div>
                    {user.friends.some(
                      (friend) => friend.name === selectedUser.name
                    ) ? (
                      <button
                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                        onClick={() => removeFriend(selectedUser._id)}
                      >
                        Remove Friend
                      </button>
                    ) : selectedUser.friendRequests.some(
                        (request) => request === user._id
                      ) ? (
                      <button
                        className="py-2.5 px-5 mt-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        disabled
                      >
                        Friend Request Sent
                      </button>
                    ) : (
                      <button
                        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                        onClick={() => addFriend(selectedUser._id)}
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              </section>
              <footer className="modal-card-foot">
                <div className="flex items-center">
                  <button
                    className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => setIsUserModal(false)}
                  >
                    Close
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
