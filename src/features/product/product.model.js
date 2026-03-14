import UserModel from "../user/user.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
export default class ProductModel {
  constructor(name, desc, price, imageUrl, categories, sizes, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price; // price should be a number
    this.imageUrl = imageUrl; // imageUrl should be filename
    this.categories = categories; // categories should be array
    this.sizes = sizes;
  }
  static get(id) {
    const product = products.find((i) => i.id == id);
    return product;
  }
  static add(product) {
    const newProduct = new ProductModel(
      product.name,
      product.desc,
      product.imageUrl,
      product.category,
      product.price,
      product.sizes,
      products.length + 1
    );
    products.push(newProduct);
    return newProduct;
  }
  static getAll() {
    return products;
  }

  static filter(minPrice, maxPrice, category) {
    const result = products.filter((product) => {
      return (
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category == category)
      );
    });
    return result;
  }

  static rateProduct(userID, productID, rating) {
    console.log("=== RATING DEBUG ===");
    console.log("Received userID:", userID);
    console.log("Received productID:", productID);
    console.log("Received rating:", rating);

    //1. Validatre users.
    const user = UserModel.getAll().find((u) => u.id == userID);
    if (!user) {
      throw new ApplicationError("User not found", 404);
    }
    // Validate products.
    const product = products.find((p) => p.id == productID);
    if (!product) {
      throw new ApplicationError("Product not found", 400);
    }

    //2.Check if there are any ratings and if not then add ratings array.
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({
        userID: userID,
        rating: rating,
      });
      return;
    } else {
      //Check if user rating is already available
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userID == userID
      );
      if (existingRatingIndex >= 0) {
        product.ratings[existingRatingIndex] = {
          userID: userID,
          rating: rating,
        };
      } else {
        //if no existing rating , then add new rating.
        product.ratings.push({
          userID: userID,
          rating: rating,
        });
      }
    }
  }
}

var products = [
  new ProductModel(
    1,
    "Wireless Bluetooth Headphones",
    "High-quality noise-cancelling headphones with 30-hour battery life",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    "Electronics",
    89.99
  ),

  new ProductModel(
    2,
    "Cotton Casual T-Shirt",
    "Comfortable 100% cotton t-shirt perfect for everyday wear",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    "Clothing",
    24.99,
    ["S", "M", "L", "XL", "XXL"]
  ),

  new ProductModel(
    3,
    "Chanel No. 5 Eau de Parfum",
    "Classic and timeless fragrance with floral and woody notes",
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
    "Perfume",
    129.99,
    ["30ml", "50ml", "100ml"]
  ),

  new ProductModel(
    4,
    "Stainless Steel Chef's Knife",
    "Professional 8-inch chef's knife with ergonomic handle",
    "https://images.unsplash.com/photo-1594736797933-d0b22ee3f7d5?w=500",
    "Kitchen Utensils",
    49.99
  ),

  new ProductModel(
    5,
    "Leather Crossbody Bag",
    "Stylish genuine leather crossbody bag with adjustable strap",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    "Accessories",
    79.99,
    ["Small", "Medium", "Large"]
  ),

  new ProductModel(
    6,
    "Organic Green Tea",
    "Premium loose leaf green tea with antioxidants and natural flavor",
    "https://images.unsplash.com/photo-1594631661960-9edb84ff6629?w=500",
    "Food & Beverages",
    16.99,
    ["100g", "250g", "500g"]
  ),

  new ProductModel(
    7,
    "Dior Sauvage Cologne",
    "Fresh and spicy men's fragrance with bergamot and pepper notes",
    "https://images.unsplash.com/photo-1585154419682-f8cf0d8c8c12?w=500",
    "Perfume",
    94.99,
    ["60ml", "100ml", "200ml"]
  ),

  new ProductModel(
    8,
    "Non-Stick Frying Pan Set",
    "3-piece non-stick frying pan set with heat-resistant handles",
    "https://images.unsplash.com/photo-1584990347449-8f832c7e2b11?w=500",
    "Kitchen Utensils",
    39.99,
    ["8-inch", "10-inch", "12-inch"]
  ),

  new ProductModel(
    9,
    "Yoga Mat",
    "Eco-friendly yoga mat with non-slip surface and carrying strap",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
    "Sports & Fitness",
    32.99,
    ["4mm", "6mm", "8mm"]
  ),

  new ProductModel(
    10,
    "Ceramic Coffee Mug",
    "Handcrafted ceramic coffee mug with comfortable grip handle",
    "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500",
    "Home & Kitchen",
    14.99,
    ["250ml", "350ml", "500ml"]
  ),
];
