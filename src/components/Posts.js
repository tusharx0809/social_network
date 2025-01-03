import React, { useContext } from "react";
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
      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Latest Posts
        </h5>
        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
          Stay up to date with latest feed
        </p>
        <div className="flex-auto">
          <div className="box-border h-auto w-auto p-4 border-2 rounded-3xl">
            <div class="flex flex-col justify-between p-4 leading-normal">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Noteworthy technology acquisitions 2021
              </h5>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Here are the biggest enterprise technology acquisitions of 2021
                so far, in reverse chronological order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
