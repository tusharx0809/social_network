import React, { useContext, useState, useRef, useEffect } from "react";
import profileContext from "../context/profile/ProfileContext";

const Posts = () => {
  const {
    createPost,
    posts,
    getAllPosts,
    getLikes,
    likes,
    user,
    alert,
    showAlert,
  } = useContext(profileContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  //Handling Comments
  const [commentText, setCommentText] = useState({});
  const handleCommentChange = (e, postId) => {
    setCommentText({
      ...commentText,
      [postId]: e.target.value,
    });
  };
  const handleCommentSubmit = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) {
      showAlert("Please enter a comment!", "danger");
      return;
    }
    try {
      const url = `http://localhost:5000/api/comments/add-comment/${postId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ text }), // Send just the text
      });
      const json = await response.json();
      if (json.success === true) {
        // Match your backend response
        showAlert("Comment added successfully", "success");
        getAllPosts(); // Refresh posts to include new comment
        setCommentText({ ...commentText, [postId]: "" }); // Clear the input
      } else {
        showAlert("Failed to add comment", "danger");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment. Please try again.");
    }
  };

  //Handling Posts(adding, editing and delete)
  const [editPostDescription, setEditPostDescription] = useState("");
  const [postIdToEdit, setPostIdToEdit] = useState(null);
  const [postDescription, setPostDescription] = useState("");
  const [iseditModalOpen, setIsEditModalOpen] = useState(false);
  const handlePostChange = (e) => {
    setPostDescription(e.target.value);
  };
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (postDescription.trim()) {
      await createPost(postDescription);
      setPostDescription(""); // Clear the input after submitting
      await getAllPosts();
    } else {
      showAlert("Please enter a post description!", "danger");
    }
  };
  const handleDelete = async (postId) => {
    const url = `http://localhost:5000/api/posts/deletepost/${postId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json === "Post Deleted Successfully") {
      showAlert("Post deleted successfully", "success");
      getAllPosts(); // Refresh the posts list after deletion
    } else {
      showAlert("Failed to delete post", "danger");
    }
  };
  const handleEdit = (postId, description) => {
    setPostIdToEdit(postId);
    setEditPostDescription(description);
    setIsEditModalOpen(true);
  };
  const handlePostUpdate = async () => {
    const url = `http://localhost:5000/api/posts/updatepost/${postIdToEdit}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ description: editPostDescription }),
    });
    const json = await response.json();
    if (json === "Post Updated Successfully") {
      showAlert("Post updated successfully", "success");
      getAllPosts(); // Refresh the posts after update
      setIsEditModalOpen(false); // Close the modal
    } else {
      showAlert("Failed to update post", "danger");
    }
  };

  //Handling Likes
  const addLike = async (postId) => {
    if (!postId) {
      showAlert("Invalid post ID", "danger");
      return;
    }
    const url = `http://localhost:5000/api/comments/add-like/${postId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json.success === true) {
      showAlert("Like added successfully", "success");
      getAllPosts();
    } else {
      // Handle the case when the like wasn't added successfully
      showAlert("Failed to add like", "danger");
    }
  };
  const removeLike = async (postId) => {
    if (!postId) {
      showAlert("Invalid post ID", "danger");
      return;
    }
    const url = `http://localhost:5000/api/comments/remove-like/${postId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json.success === true) {
      showAlert("Like removed successfully", "success");
      getAllPosts();
    } else {
      // Handle the case when the like wasn't added successfully
      showAlert("Failed to remove like", "danger");
    }
  };

  //Fetching usernames for comments and posts
  const [usernames, setUsernames] = useState({});
  const getUsername = async (id) => {
    const url = `http://localhost:5000/api/posts/getusername/${id}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.name; // Assume the response contains the username
  };
  useEffect(() => {
    const fetchUsernames = async () => {
      const newUsernames = {};
      // Collect all unique user IDs from both posts and comments
      const userIds = new Set();
      posts.forEach((post) => {
        // Add post author
        userIds.add(post.user);
        // Add comment authors if post has comments
        if (post.comments && post.comments.length > 0) {
          post.comments.forEach((comment) => {
            userIds.add(comment.user);
          });
        }
      });
      // Convert Set to array and fetch all usernames
      const usernamesPromises = Array.from(userIds).map(async (userId) => {
        const username = await getUsername(userId);
        newUsernames[userId] = username;
      });
      await Promise.all(usernamesPromises);
      setUsernames(newUsernames);
    };
    if (posts.length > 0) {
      fetchUsernames();
    }
  }, [posts]);

  //Handling search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isUserModal, setIsUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchRef = useRef(null);
  useEffect(() => {
    getAllPosts();
    getLikes();
  }, []);

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

  

  return (
    <div>
      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-3xl font-light text-gray-900 dark:text-white">
          Latest Posts
        </h5>
        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
          Stay up to date with latest feed
        </p>

        <form onSubmit={handlePostSubmit}>
          <textarea
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-6"
            placeholder="What's on your mind?"
            id="postDescription"
            value={postDescription}
            onChange={handlePostChange}
            rows="3"
          ></textarea>
          <div className="flex justify-start mb-6">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Share Post
            </button>
          </div>
        </form>
        <div
          className="posts-container"
          style={{
            maxHeight: "450px", // Adjust this height as per your design
            overflowY: "scroll",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "10px",
          }}
        >
          {sortedPosts.length === 0 || user?.friends.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "20px", color: "#888" }}
            >
              <h5>No posts available</h5>
            </div>
          ) : (
            sortedPosts
              .filter(
                (post) =>
                  user &&
                  (user.friends.some((friend) => friend._id === post.user) ||
                    post.user === user._id)
              )
              .map((post, index) => (
                <div className="flex-auto">
                  <div className="box-border h-auto w-auto p-4 border-2 rounded-3xl border-gray-500 my-6">
                    <div className="flex flex-col p-4 leading-normal">
                      <div className="flex items-center">
                        <h5 className="mb-2 font-sans text-2xl tracking-tight text-gray-900 text-left dark:text-white mr-6">
                          {usernames[post.user]}
                        </h5>
                        {user && user._id === post.user && (
                          <>
                            <div>
                              <button
                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                style={{ width: "auto" }}
                                onClick={() => handleDelete(post._id)} // Handle the delete functionality
                              >
                                Delete <i className="fa-solid fa-trash fa-lg" />
                              </button>
                              <button
                                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                style={{ width: "auto" }}
                                onClick={() =>
                                  handleEdit(post._id, post.description)
                                }
                              >
                                Edit <i className="fa-solid fa-pen fa-lg" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      <p className="mb-3 font-serif text-gray-400 text-lg text-left">
                        {post.description}
                      </p>
                      <p className="font-serif text-gray-600 text-md text-left">
                        {formatDate(post.date)}
                      </p>
                      {post.comments && post.comments.length > 0 && (
                        <div className="my-5">
                          <>
                            <div className="box-borderborder-gray-500">
                              {post.comments.map((comment, index) => (
                                <div
                                  key={index}
                                  className="flex items-start mb-3"
                                >
                                  <p className="text-left text-white font-light">
                                    <strong>{usernames[comment.user]}:</strong>
                                    &nbsp;
                                  </p>
                                  <div className="flex-1 text-left">
                                    <p className="text-gray-300 font-mono">
                                      {comment.text}
                                    </p>
                                  </div>
                                  <small className="text-muted text-white">
                                    <i className="fa-solid fa-stopwatch fa-sm" />{" "}
                                    {new Date(comment.date).toLocaleString()}
                                  </small>
                                </div>
                              ))}
                            </div>
                          </>
                        </div>
                      )}
                    </div>
                    <textarea
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-6"
                      rows="1"
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) => handleCommentChange(e, post._id)}
                    ></textarea>
                    <button
                      className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      onClick={() => handleCommentSubmit(post._id)}
                    >
                      Comment <i className="fa-solid fa-comment fa-lg" />
                    </button>

                    {user &&
                    post.likes &&
                    post.likes.likedBy &&
                    post.likes.likedBy.includes(user._id) ? (
                      <>
                        <button
                          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          onClick={() => removeLike(post._id)}
                        >
                          Unlike <i className="fa-solid fa-heart-crack fa-lg" />
                        </button>
                        <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                          {likes[post._id] || 0}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          onClick={() => addLike(post._id)}
                        >
                          Like <i className="fa-solid fa-heart fa-lg" />
                        </button>
                        <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                          {likes[post._id]}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      {iseditModalOpen && (
        <>
          <div
            id="default-modal "
            tabindex="-1"
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-6">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Post
                  </h3>
                </div>

                <textarea
                  id="message"
                  rows="10"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 my-4"
                  placeholder="Enter text here to update post..."
                  value={editPostDescription}
                  onChange={(e) => setEditPostDescription(e.target.value)}
                  
                ></textarea>

                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    data-modal-hide="default-modal"
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handlePostUpdate}
                  >
                    Update
                  </button>
                  <button
                    data-modal-hide="default-modal"
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Posts;
