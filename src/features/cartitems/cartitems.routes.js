import express from "express";
import CartItemController from "./cartitems.controller.js";

//2.Get router
const cartRouter = express.Router();
const cartController = new CartItemController();

cartRouter.post("/", (req, res) => {
  cartController.add(req, res);
});
cartRouter.get("/", (req, res) => {
  cartController.getCartItem(req, res);
});
cartRouter.delete("/:id", (req, res) => {
  cartController.delete(req, res);
});
export default cartRouter;
