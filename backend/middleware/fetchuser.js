const jwt = require("jsonwebtoken");
const JWT_SECRET = "scam1992@1234567890";

const fetchuser = (req, res, next) => {
  //get the user from jwt token and add id to req object
  const token = req.header("auth-token");
  //console.log(token);
  if (!token) {
    res
      .status(401)
      .send({
        error: "No token found",
      });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    //console.log(data);
    req.user = data.user;
    next();
  } catch (error) {
    res
      .status(401) 
      .send({
        error: "Access Denied! Please authenticate using a valid token!",
      });
  }
  //async in routes will run after fetchuser wherever used.
};

module.exports = fetchuser;
