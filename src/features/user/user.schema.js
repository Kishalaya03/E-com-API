import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
  name: String,
  //unique is not a valodator but an option
  // match is an validator
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        // Skip validation if password is already hashed (starts with $2b$)
        if (value.startsWith("$2b$")) {
          return true;
        }
        // Validate only original passwords
        return /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,12}$/.test(
          value
        );
      },
      message:
        "Password must be 8-12 characters long and contain at least one special character.",
    },
  },
  typeofuser: {
    type: String,
    enum: ["customer", "seller"],
  },
});
