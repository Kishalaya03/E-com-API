import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userID;

      // Validate required fields
      if (!id || !type || !userId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: id, type",
        });
      }

      // Validate type (case sensitive to match schema)
      if (type !== "product" && type !== "Category") {
        return res.status(400).json({
          success: false,
          message: "Invalid Type. Must be 'product' or 'Category'",
        });
      }

      // Check if user already liked this item
      const existingLike = await this.likeRepository.checkExistingLike(
        userId,
        id,
        type
      );
      if (existingLike) {
        return res.status(409).json({
          success: false,
          message: "Item already liked by user",
        });
      }

      if (type === "product") {
        await this.likeRepository.likeProduct(userId, id);
      } else {
        await this.likeRepository.likeCategory(userId, id);
      }

      return res.status(201).json({
        success: true,
        message: "Item liked successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async getLikes(req, res, next) {
    try {
      // DEBUG: Log everything to see what's happening
      console.log("=== DEBUG INFO ===");
      console.log("req.query:", req.query);
      console.log("req.params:", req.params);
      console.log("req.body:", req.body);
      console.log("req.url:", req.url);
      console.log("==================");

      const { id, type } = req.query;

      console.log("Extracted id:", id);
      console.log("Extracted type:", type);
      console.log("typeof id:", typeof id);
      console.log("typeof type:", typeof type);

      // Validate required fields
      if (!id || !type) {
        console.log("Validation failed - missing parameters");
        return res.status(400).json({
          success: false,
          message: "Missing required query parameters: id, type",
          debug: {
            receivedQuery: req.query,
            id: id,
            type: type,
          },
        });
      }

      // Validate type
      if (type !== "product" && type !== "Category") {
        console.log("Type validation failed:", type);
        return res.status(400).json({
          success: false,
          message: "Invalid Type. Must be 'product' or 'Category'",
          debug: {
            receivedType: type,
          },
        });
      }

      console.log("About to call repository with:", { type, id });
      const likes = await this.likeRepository.getLikes(type, id);
      console.log("Repository returned:", likes);

      return res.status(200).json({
        success: true,
        data: likes,
        count: likes.length,
      });
    } catch (err) {
      console.log("Error in getLikes:", err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: err.message,
      });
    }
  }

  async unlikeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userId = req.userID;

      if (!id || !type || !userId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: id, type",
        });
      }

      if (type !== "product" && type !== "Category") {
        return res.status(400).json({
          success: false,
          message: "Invalid Type. Must be 'product' or 'Category'",
        });
      }

      const result = await this.likeRepository.unlikeItem(userId, id, type);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Like not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item unliked successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}

// import { LikeRepository } from "./like.repository.js";

// export class LikeController {
//   constructor() {
//     this.likeRepository = new LikeRepository();
//   }

//   async likeItem(req, res, next) {
//     try {
//       const { id, type } = req.body;
//       const userId = req.userID;

//       // Validate required fields
//       if (!id || !type || !userId) {
//         return res.status(400).json({
//           success: false,
//           message: "Missing required fields: id, type",
//         });
//       }

//       // Validate type (case sensitive to match schema)
//       if (type !== "product" && type !== "Category") {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid Type. Must be 'product' or 'Category'",
//         });
//       }

//       // Check if user already liked this item
//       const existingLike = await this.likeRepository.checkExistingLike(
//         userId,
//         id,
//         type
//       );
//       if (existingLike) {
//         return res.status(409).json({
//           success: false,
//           message: "Item already liked by user",
//         });
//       }

//       if (type === "product") {
//         await this.likeRepository.likeProduct(userId, id);
//       } else {
//         await this.likeRepository.likeCategory(userId, id);
//       }

//       return res.status(201).json({
//         success: true,
//         message: "Item liked successfully",
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({
//         success: false,
//         message: "Something went wrong",
//       });
//     }
//   }

//   async getLikes(req, res, next) {
//     try {
//       const { id, type } = req.query;

//       // Validate required fields
//       if (!id || !type) {
//         return res.status(400).json({
//           success: false,
//           message: "Missing required query parameters: id, type",
//         });
//       }

//       // Validate type
//       if (type !== "product" && type !== "Category") {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid Type. Must be 'product' or 'Category'",
//         });
//       }

//       const likes = await this.likeRepository.getLikes(type, id);

//       return res.status(200).json({
//         success: true,
//         data: likes,
//         count: likes.length,
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({
//         success: false,
//         message: "Something went wrong",
//       });
//     }
//   }

//   async unlikeItem(req, res, next) {
//     try {
//       const { id, type } = req.body;
//       const userId = req.userID;

//       if (!id || !type || !userId) {
//         return res.status(400).json({
//           success: false,
//           message: "Missing required fields: id, type",
//         });
//       }

//       if (type !== "product" && type !== "Category") {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid Type. Must be 'product' or 'Category'",
//         });
//       }

//       const result = await this.likeRepository.unlikeItem(userId, id, type);

//       if (!result) {
//         return res.status(404).json({
//           success: false,
//           message: "Like not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Item unliked successfully",
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({
//         success: false,
//         message: "Something went wrong",
//       });
//     }
//   }
// }
// // import { LikeRepository } from "./like.repository.js";

// // export class LikeController {
// //   constructor() {
// //     this.likeRepository = new LikeRepository();
// //   }
// //   async likeItem(req, res, next) {
// //     try {
// //       const { id, type } = req.body;
// //       const userId = req.userID;
// //       if (type != "product" && type != "Category") {
// //         return res.status(400).send("Invalid Type");
// //       }
// //       if (type == "product") {
// //         await this.likeRepository.likeProduct(userId, id);
// //       } else {
// //         await this.likeRepository.likeCategory(userId, id);
// //       }
// //       return res.status(200).send();
// //     } catch (err) {
// //       console.log(err);
// //       return res.status(200).send("Something went wrong");
// //     }
// //   }

// //   async getLikes(req, res, next) {
// //     try {
// //       const { id, type } = req.query;
// //       const likes = await this.likeRepository.getLikes(type, id);
// //       return res.status(200).send(likes);
// //     } catch (err) {
// //       console.log(err);
// //       return res.status(200).send("Something went wrong");
// //     }
// //   }
// // }
