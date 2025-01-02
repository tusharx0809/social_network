import React, { useState, useContext } from "react";
import profileContext from "../context/profile/ProfileContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const { user, getUserProfile, getAllPosts } = useContext(profileContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // to not reload page
    const response = await fetch("http://localhost:5000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();

    if (json.success) {
      localStorage.setItem("token", json.authToken);
      await getUserProfile(); // Fetch user profile
      await getAllPosts();
      navigate("/");
      alert("Logged in successfully");
    } else {
      alert("Invalid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg">
        <form
          className="h-auto w-full bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username or Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username or email..."
              value={credentials.email || ""}
              onChange={onChange}
              id="Email"
              name="email"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Password..."
              value={credentials.password || ""}
              onChange={onChange}
              name="password"
              id="password"
            />
            
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <Link to="/signup"><button
              className="bg-green-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
            </Link>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">Social Mate</p>
      </div>
    </div>
  );
};

export default Login;
