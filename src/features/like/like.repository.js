import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";

const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getLikes(type, id) {
    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      return await LikeModel.find({
        likeable: new mongoose.Types.ObjectId(id),
        types: type,
      })
        .populate("user", "name email") // Only populate needed fields
        .populate({ path: "likeable", model: type });
    } catch (err) {
      console.log("Repository Error:", err);
      throw new Error("Failed to fetch likes");
    }
  }

  async checkExistingLike(userId, itemId, type) {
    try {
      return await LikeModel.findOne({
        user: new mongoose.Types.ObjectId(userId),
        likeable: new mongoose.Types.ObjectId(itemId),
        types: type,
      });
    } catch (err) {
      console.log("Repository Error:", err);
      throw new Error("Failed to check existing like");
    }
  }

  async likeProduct(userId, productId) {
    try {
      const newLike = new LikeModel({
        user: new mongoose.Types.ObjectId(userId),
        likeable: new mongoose.Types.ObjectId(productId),
        types: "product",
      });
      return await newLike.save();
    } catch (err) {
      console.log("Repository Error:", err);
      throw new Error("Something went wrong with database");
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      const newLike = new LikeModel({
        user: new mongoose.Types.ObjectId(userId),
        likeable: new mongoose.Types.ObjectId(categoryId),
        types: "Category",
      });
      return await newLike.save();
    } catch (err) {
      console.log("Repository Error:", err);
      throw new Error("Something went wrong with database");
    }
  }

  async unlikeItem(userId, itemId, type) {
    try {
      return await LikeModel.findOneAndDelete({
        user: new mongoose.Types.ObjectId(userId),
        likeable: new mongoose.Types.ObjectId(itemId),
        types: type,
      });
    } catch (err) {
      console.log("Repository Error:", err);
      throw new Error("Failed to unlike item");
    }
  }

  async getUserLikes(userId, type = null) {
    try {
      const query = { user: new mongoose.Types.ObjectId(userId) };
      if (type) {
        query.types = type;
      }

      return await LikeModel.find(query).populate({
        path: "likeable",
        model: "types",
      });
    } catch (err) {
      console.log("Repository Error:", err);
      throw new Error("Failed to fetch user likes");
    }
  }
}

// import mongoose from "mongoose";
// import { likeSchema } from "./like.schema.js";

// const LikeModel = mongoose.model("Like", likeSchema);

// export class LikeRepository {
//   async getLikes(type, id) {
//     try {
//       return await LikeModel.find({
//         likeable: new mongoose.Types.ObjectId(id),
//         types: type,
//       })
//         .populate("user", "name email") // Only populate needed fields
//         .populate({ path: "likeable", model: type });
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new Error("Failed to fetch likes");
//     }
//   }

//   async checkExistingLike(userId, itemId, type) {
//     try {
//       return await LikeModel.findOne({
//         user: new mongoose.Types.ObjectId(userId),
//         likeable: new mongoose.Types.ObjectId(itemId),
//         types: type,
//       });
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new Error("Failed to check existing like");
//     }
//   }

//   async likeProduct(userId, productId) {
//     try {
//       const newLike = new LikeModel({
//         user: new mongoose.Types.ObjectId(userId),
//         likeable: new mongoose.Types.ObjectId(productId),
//         types: "product",
//       });
//       return await newLike.save();
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new Error("Something went wrong with database");
//     }
//   }

//   async likeCategory(userId, categoryId) {
//     try {
//       const newLike = new LikeModel({
//         user: new mongoose.Types.ObjectId(userId),
//         likeable: new mongoose.Types.ObjectId(categoryId),
//         types: "Category",
//       });
//       return await newLike.save();
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new Error("Something went wrong with database");
//     }
//   }

//   async unlikeItem(userId, itemId, type) {
//     try {
//       return await LikeModel.findOneAndDelete({
//         user: new mongoose.Types.ObjectId(userId),
//         likeable: new mongoose.Types.ObjectId(itemId),
//         types: type,
//       });
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new Error("Failed to unlike item");
//     }
//   }

//   async getUserLikes(userId, type = null) {
//     try {
//       const query = { user: new mongoose.Types.ObjectId(userId) };
//       if (type) {
//         query.types = type;
//       }

//       return await LikeModel.find(query).populate({
//         path: "likeable",
//         model: "types",
//       });
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new Error("Failed to fetch user likes");
//     }
//   }
// }

// import mongoose from "mongoose";
// import { likeSchema } from "./like.schema.js";
// const LikeModel = mongoose.model("Like", likeSchema);
// export class LikeRepository {
//   async getLikes(type, id) {
//     return await LikeModel.find({
//       likeable: new mongoose.Types.ObjectId(id),
//       types: type,
//     })
//       .populate("user")
//       .populate({ path: "likeable", model: type });
//   }
//   async likeProduct(userId, productId) {
//     try {
//       const newLike = new LikeModel({
//         user: new mongoose.Types.ObjectId(userId),
//         likeable: new mongoose.Types.ObjectId(productId),
//         types: "product",
//       });
//       await newLike.save();
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new ApplicationError("Something went wrong with database", 500);
//     }
//   }
//   async likeCategory(userId, categoryId) {
//     try {
//       const newLike = new LikeModel({
//         user: new mongoose.Types.ObjectId(userId),
//         likeable: new mongoose.Types.ObjectId(categoryId),
//         types: "Category",
//       });
//       await newLike.save();
//     } catch (err) {
//       console.log("Repository Error:", err);
//       throw new ApplicationError("Something went wrong with database", 500);
//     }
//   }
// }
