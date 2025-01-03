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
    <div className="flex items-center justify-center min-h-screen bg-gray-500">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={createUser}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Sign Up to Social Mate
          </h5>
          <div>
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Full Name
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              type="text"
              placeholder="Enter name..."
              onChange={onChange}
              id="name"
              name="name"
              required
            />
          </div>
          <div>
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              type="email"
              placeholder="Enter email..."
              onChange={onChange}
              id="Email"
              name="email"
              required
            />
          </div>
          <div>
            <label
              for="username"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              type="type"
              placeholder="Enter username..."
              onChange={onChange}
              id="username"
              name="username"
            />
          </div>
          <div>
            <label
              for="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              type="password"
              placeholder="Enter Password..."
              onChange={onChange}
              name="password"
              id="password"
            />
          </div>
          <div>
            <label
              for="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              type="password"
              placeholder="Confirm Password"
              onChange={onChange}
              name="cpassword"
              id="cpassword"
            />
          </div>
          
          <div>
            <label
              for="dob"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Date of birth
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              type="date"
              onChange={onChange}
              name="dob"
              id="dob"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Account
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Signup;
