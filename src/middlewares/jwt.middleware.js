import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
  //1.Read the token
  console.log(req.headers);
  const token = req.headers["authorization"];
  //2.if no token then return the error
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  console.log(token);
  //3.Check if token is valid or not
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = payload.userID;
    console.log(payload);
  } catch (err) {
    //4.return error
    console.log(err);
    return res.status(401).send("Unauthorized");
  }
  //4.call next middleware
  next();
};

export default jwtAuth;
