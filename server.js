// As environment files will be loaded first so we are doing the import at first or else we have to
// redundantly import it wherever required.
// If you want to reduce the dotenv messages, you can configure it silently:
// javascript// In your server.js, change:
// import dotenv from 'dotenv';
// dotenv.config();

// To:
// import dotenv from 'dotenv';
// dotenv.config({ silent: true });
// // dotenv.config({ quiet: true });
import dotenv from "dotenv";
dotenv.config({ silent: true });

//1. To import express
import express from "express";
import swagger from "swagger-ui-express";

// in place of router we use *
import cors from "cors";
import productRouter from "./src/features/product/controllers/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
/*import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";*/
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartitems/cartitems.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
// Here we were defining the swagger.json file as if it was a jav ascript Module but to say
//  that it is a JSON file we need to use the "assert" keyword.
import apiDocs from "./swagger.json" with { type: "json" };
// import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import logMiddleware from "./src/middlewares/winston.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import connectToMongoDB from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
//2.create server
const server = express();
// load all the enviroment variables in the application.
dotenv.config();
// CORS policy configuration.
var corsOPtions = {
  origin: "http://127.0.0.1:5500",
  allowedHeaders: "*",
};
server.use(cors(corsOPtions));
// server.use((req,res,next) =>{
//   res.header('Access-Control-Allow-Origin','http://127.0.0.1:5500');
//   res.header('Access-Control-Allow-Headers','*');//'Content-Type,Authorization
//   res.header('Access-Control-Allow-Methods','*');
//   //return ok for pre-flight request.
//   if(req.method=='OPTIONS'){
//     return res.sendStatus(200);
//   }
//   next();
// });
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/uploads", express.static("uploads"));
// .serve --> will help to create the UI and all.
// .setup --> will help to link up the swagger UI with json file.
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
// server.use(loggerMiddleware);
server.use(logMiddleware);
server.use("/api/order", jwtAuth, orderRouter);
// for all request relatyed to products , redirect to product routes.
// /api here is used as a good practice as we are making a API
server.use("/api/products", /* basicAuthorizer*/ jwtAuth, productRouter);
server.use("/api/cart", logMiddleware, jwtAuth, cartRouter);
server.use("/api/users", userRouter);
server.use("/api/likes", jwtAuth, likeRouter);

//3.Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});
//Error handler middleware.
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  // 500 status code is used for server error
  return res.status(500).send("Something went wrong,try again later");
});
//4. Configure a Middleware to handle 404 requests.(always keep it at the end of the code for paths)
server.use((req, res) => {
  res.status(404).send("API not found.");
});
//5.specify port number
server.listen(3200, () => {
  console.log("Server is listening on port number 3200");
  // connectToMongoDB();
  connectUsingMongoose();
});
