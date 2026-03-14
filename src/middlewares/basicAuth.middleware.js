import UserModel from "../features/user/user.model.js";
const basicAuthorizer = (req, res, next) => {
  //1.Check if data has been send to the authorization Header.
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No Authorization Details");
  }
  console.log(authHeader);
  //2.Extract the Credentials and check if the credentials are correct or not.(base 64 encodign Technique)
  // like this [Basic 45hwufgjdgvfudgfjgfqwuofwpsadvhj]
  const base64Credentials = authHeader.replace("Basic", "");
  console.log(base64Credentials);
  //3.Decode the Credeentials.
  const decodedCreds = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  // format -->  [username:password]
  console.log(decodedCreds);
  const creds = decodedCreds.split(":");

  const user = UserModel.getAll().find(
    (u) => u.email == creds[0] && u.password == creds[1]
  );
  if (user) {
    next();
  } else {
    return res.status(401).send("Incorrect Credentials");
  }
};

export default basicAuthorizer;
