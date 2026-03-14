//To manage routes/paths to ProductController.
//1.Import express here
import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../../middlewares/fileupload.middleware.js";

//2.Get router
const productRouter = express.Router();
const productController = new ProductController();
//we can now specify all the paths to controller methods.
productRouter.post("/rate", (req, res, next) => {
  productController.rateProduct(req, res, next);
});
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post(
  "/",
  //we can also use array() function in place of single function to get the number of files we can upload and also add multiple files here.
  upload.single("imageUrl"),
  (req, res) => {
    productController.addProduct(req, res);
  }
);
//we are going to use Query parameters instead of req.params or req.body
//our url will look like
// URL - localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Electronics
productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});

productRouter.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res);
});

productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
