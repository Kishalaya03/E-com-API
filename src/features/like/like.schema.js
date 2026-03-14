import mongoose from "mongoose";
export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    //refPath:used when we use multiple refernces i.e. here product and category
    refPath: "types",
  },
  types: {
    type: String,
    enum: ["product", "Category"],
  },
})
  .pre("save", (next) => {
    console.log("New Like Comming In");
    next();
  })
  .post("save", (doc) => {
    console.log("Like Is Saved");
    console.log(doc);
  })
  .pre("find", (next) => {
    console.log("Retrieving Likes");
    next();
  })
  .post("find", (doc) => {
    console.log("Find is completed");
    console.log(doc);
  });
//pre is before save
//post is after save
