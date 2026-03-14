import express from "express";
import OrderController from "./order.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

//2.Get router
const orderRouter = express.Router();
const orderController = new OrderController();

orderRouter.post("/", (req, res, next) => {
  orderController.placeOrder(req, res, next);
});

export default orderRouter;
