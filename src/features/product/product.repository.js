import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { reviewSchema } from "./review.schema.js";
import { productSchema } from "./product.schema.js";
import { categorySchema } from "./category.schema.js";
const ProductModel = mongoose.model("product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);
class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  // Fixed add method in ProductRepository
  async add(productData) {
    try {
      console.log("Repository received:", productData);

      // Handle categories with proper null/undefined checking
      let categories = productData.categories;

      // If categories is undefined or null, initialize as empty array
      if (!categories) {
        categories = [];
      }
      // If categories is a string (comma-separated), convert to array
      else if (typeof categories === "string") {
        categories = categories.split(",").map((e) => e.trim());
      }
      // If categories is not an array, make it one
      else if (!Array.isArray(categories)) {
        categories = [categories];
      }

      // Create the product data for Mongoose
      const productForDB = {
        name: productData.name,
        description: productData.desc, // Note: schema uses 'description', not 'desc'
        price: productData.price,
        inStock: 0, // Default value
        categories: categories,
        sizes: productData.sizes,
      };

      // Only add imageUrl if it exists
      if (productData.imageUrl) {
        productForDB.imageUrl = productData.imageUrl;
      }

      console.log("Data for DB:", productForDB);

      // Create and save the product
      const newProduct = new ProductModel(productForDB);
      const savedProduct = await newProduct.save();

      // Update the categories to include this product
      if (categories && categories.length > 0) {
        await CategoryModel.updateMany(
          { _id: { $in: categories } },
          {
            $push: { products: savedProduct._id },
          }
        );
      }

      return savedProduct;
    } catch (err) {
      console.log("Repository Error:", err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async getAll() {
    try {
      //1.Get the db.
      const db = getDB();
      const collection = db.collection(this.collection);
      const products = await collection.find().toArray();
      console.log(products);
      return products;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(id) {
    try {
      //1.Get the db.
      const db = getDB();
      const collection = db.collection(this.collection);
      //ObjectID is taken from the mongodb to get the id i.e in the form of object in the databases.
      // (or else you will get an error)
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      //1.Get the db.
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }
      // projection operator is used to update the database as per our choice
      //Hence, we use project function & the value 1 denotes inclusion of these attributes which
      //will we want to be be shown.Whereas, the value 0 denotes the attributes which will not be shown i.e.
      // exclusion of attributes in the MongoDB databases.
      //slice is used to get first or last Value of the attributes along with the attribute.
      //1 is for first and -1 is for last
      //similarly 2 for first two and -2 for last two.
      return await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0, ratings: { $slice: -1 } })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  // See the below codes also it's important : here we use the concepts of operators
  // //Product should have specified minPrice and category using MongoDB Operators
  // async filter(minPrice, category) {
  //   try {
  //     //1.Get the db.
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     let filterExpression = {};
  //     if (minPrice) {
  //       filterExpression.price = { $gte: parseFloat(minPrice) };
  //     }
  //     // //['cat1','cat2']
  //     // categories = JSON.parse(catergories.replace(/'/g,""));
  //     // console.log(categories);
  //     // if (categories){
  //     //   filterExpression = { $or: [{ category: {$in: categories }, filterExpression] };
  //     // }
  //     if (category) {
  //       // filterExpression = { $and: [{ category: category }, filterExpression] };
  //       filterExpression = { $or: [{ category: category }, filterExpression] };
  //       // filterExpression.category = category;
  //     }
  //     return await collection.find(filterExpression).toArray();
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  // async rateProduct(userID, productID, rating) {
  //   try {
  //     //1.Get the db.
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     //1.Find the product
  //     const product = await collection.findOne({
  //       _id: new ObjectId(productID),
  //     });
  //     //2.Find the rating
  //     const userRating = product?.ratings?.find((r) => r.userID == userID);
  //     if (userRating) {
  //       //3.update the rating
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productID),
  //           "ratings.userID": new ObjectId(userID),
  //         },
  //         {
  //           $set: {
  //             "ratings.$.rating": rating,
  //           },
  //         }
  //       );
  //     } else {
  //       const result = await collection.updateOne(
  //         { _id: new ObjectId(productID) },
  //         {
  //           $push: {
  //             ratings: { userID: new ObjectId(userID), rating },
  //           },
  //         }
  //       );
  //       if (result.matchedCount === 0) {
  //         throw new ApplicationError("Product not found", 404);
  //       }

  //       return result;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  //This is the more simpler approach than any other.
  async rate(userID, productID, rating) {
    try {
      //1. Check if product exists.
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product not found");
      }
      //2. Get existing reviews.
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        //3.Create a review.
        const newReview = await ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        await newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
    // //1.Get the db.
    // const db = getDB();
    // const collection = db.collection(this.collection);
    // //1.Removes existing entry.
    // await collection.updateOne(
    //   {
    //     _id: new ObjectId(productID),
    //   },
    //   {
    //     $pull: { ratings: { userID: new ObjectId(userID) } },
    //   }
    // );
    // //2.Pushing the new entry.
    // const result = await collection.updateOne(
    //   { _id: new ObjectId(productID) },
    //   {
    //     $push: {
    //       ratings: { userID: new ObjectId(userID), rating },
    //     },
    //   }
    // );
    // if (result.matchedCount === 0) {
    //   throw new ApplicationError("Product not found", 404);

    //   return result;
    // }
    // } catch (err) {
    //   console.log(err);
    //   throw new ApplicationError("Something went wrong with database", 500);
    // }
  }

  async averageProductPricePerCategory() {
    try {
      //1.Get the db.
      const db = getDB();
      const result = await db
        .collection(this.collection)
        .aggregate([
          {
            //Stage 1 of the Aggregation pipeline:Get the average price per category.
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
      return result;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
