import mongoose from "mongoose";
export const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  inStock: Number,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});
