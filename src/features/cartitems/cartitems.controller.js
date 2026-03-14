import CartItemModel from "./cartitems.model.js";
import CartItemsRepository from "./cartitems.repository.js";
export default class CartItemController {
  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }
  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      // Remeber to always recieve the userID or things we can easily retrieve from the Token. (As,it's a good practise)
      const userID = req.userID;
      //the above is taken from the payload which contains the userID
      const cartItem = await this.cartItemsRepository.add(
        productID,
        userID,
        quantity
      );
      res.status(201).send("Cart is updated", cartItem);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async getCartItem(req, res) {
    try {
      const userID = req.userID;
      const items = await this.cartItemsRepository.getCartItem(userID);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async delete(req, res) {
    try {
      const userID = req.userID;
      const cartItemID = req.params.id;
      const isDeleted = await this.cartItemsRepository.delete(
        userID,
        cartItemID
      );
      if (!isDeleted) {
        res.status(404).send("Item not found");
      } else {
        return res.status(200).send("Cart item is removed");
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
