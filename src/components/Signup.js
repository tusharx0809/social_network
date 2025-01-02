import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import profileContext from "../context/profile/ProfileContext";
const Signup = () => {
  const host = "http://localhost:5000";
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    username: "",
    dob: "",
  });
  const navigate = useNavigate();
  const context = useContext(profileContext);
  const { getUserProfile } = context;
  const createUser = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword, username, dob } = credentials;
    if (password !== cpassword) {
      alert("Passwords msut be same!", "danger");
      return;
    }
    const response = await fetch(`${host}/api/auth/createuser/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, username, dob }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      navigate("/");
      alert("Account created successfully!", "success");
      getUserProfile();
    } else {
      alert(json.error, "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Set max date to ensure users are at least 18 years old
    const dobInput = document.getElementById("dob");
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];
    dobInput.setAttribute("max", eighteenYearsAgo);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg">
        <form
          className="h-auto w-full bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4"
          onSubmit={createUser}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter name..."
              onChange={onChange}
              id="name"
              name="name"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Enter email..."
              onChange={onChange}
              id="Email"
              name="email"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter username..."
              onChange={onChange}
              id="username"
              name="username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Enter password..."
              onChange={onChange}
              id="password"
              name="password"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Confirm password"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Confirm Password..."
              onChange={onChange}
              name="cpassword"
              id="cpassword"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              onChange={onChange}
              name="dob"
              id="dob"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4">
            <button
              className="bg-green-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">Social Mate</p>
      </div>
    </div>
  );
};

export default Signup;
