import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).send("New password is required");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const userID = req.userID;

      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is reset");
    } catch (err) {
      console.log(err);
      console.log("Passing error to middleware");
      if (next && !res.headersSent) {
        next(err);
      } else if (!res.headersSent) {
        res.status(500).send("Something went wrong");
      }
    }
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;

      // Validate password BEFORE hashing
      const passwordRegex =
        /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/;
      if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .send(
            "Password must be 8-12 characters long and contain at least one special character."
          );
      }

      // Validate email format
      const emailRegex = /.+\@.+\..+/;
      if (!emailRegex.test(email)) {
        return res.status(400).send("Please enter a valid email");
      }
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).send("User already exists with this email");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (err) {
      console.log(err);
      if (next && !res.headersSent) {
        next(err);
      } else if (!res.headersSent) {
        res.status(500).send("Something went wrong");
      }
    }
  }

  async signIn(req, res, next) {
    try {
      // 1. Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        // 2. Compare password with hashed password.
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // 3. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          // 4. Send token.
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      console.log("SignIn error:", err);
      if (next && !res.headersSent) {
        next(err);
      } else if (!res.headersSent) {
        res.status(500).send("Something went wrong");
      }
    }
  }
}
