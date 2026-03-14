import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();

const url = process.env.DB_URL;
console.log("URL:" + url);

export const connectUsingMongoose = async () => {
  // Remove these deprecated options:
  // useNewUrlParser: true
  // useUnifiedTopology: true

  // Modern connection (these options are now default):
  try {
    // method 1
    // await mongoose.connect(url);
    // console.log("MongoDB using Mongoose is connected");
    //method 2
    mongoose
      .connect(url)
      .then(() => {
        console.log("MongoDB using Mongoose is connected");
        addCategories();
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

async function addCategories() {
  const CategoryModel = mongoose.model("Category", categorySchema);
  const categories = await CategoryModel.find();
  if (!categories || categories.length == 0) {
    await CategoryModel.insertMany([
      { name: "Books" },
      { name: "Clothing" },
      { name: "Electronics" },
    ]);
  }
  console.log("Categories are added");
}
