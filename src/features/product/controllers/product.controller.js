import ProductModel from "../product.model.js";
import ProductRepository from "../product.repository.js";
//function
export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }
  //Methods
  async getAllProducts(req, res) {
    try {
      //here we are only sending data to the client.
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  // async addProduct(req, res) {
  //   try {
  //     const { name, desc, price, sizes, categories } = req.body;
  //     const newProduct = new ProductModel(
  //       name, // name
  //       desc, // desc
  //       parseFloat(price), // price
  //       req?.file?.filename, // imageUrl
  //       categories, // category (this should be categories array)
  //       sizes?.split(",") // sizes
  //     );
  //     const createdRecord = await this.productRepository.add(newProduct);
  //     res.status(201).send(createdRecord);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(200).send("Something went wrong");
  //   }
  // }
  // Fixed addProduct method in ProductController
  async addProduct(req, res) {
    try {
      const { name, desc, price, sizes, categories } = req.body;

      console.log("Request body:", req.body); // Debug log
      console.log("Categories received:", categories); // Debug log
      console.log("Sizes received:", sizes); // Debug log

      // Validate required fields
      if (!name || !desc || !price) {
        return res
          .status(400)
          .send("Missing required fields: name, desc, price");
      }

      // Handle sizes - check if it exists before splitting
      let processedSizes = null;
      if (sizes && typeof sizes === "string") {
        processedSizes = sizes.split(",").map((s) => s.trim());
      } else if (Array.isArray(sizes)) {
        processedSizes = sizes;
      }

      // Create new product with correct parameter order
      const newProduct = new ProductModel(
        name, // name
        desc, // desc
        parseFloat(price), // price
        req?.file?.filename, // imageUrl
        categories || [], // categories (ensure it's not undefined)
        processedSizes // sizes
      );

      console.log("Created ProductModel:", newProduct); // Debug log

      const createdRecord = await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
    } catch (err) {
      console.log("Controller Error:", err);
      return res.status(500).send("Something went wrong");
    }
  }
  async rateProduct(req, res) {
    try {
      console.log(req.query);
      //previously we used rq.query.userID whereas it will be hassle to do it multiple times
      //so i have used req.userID because i have taken this in jwt.middleware.js
      const userID = req.userID;
      // const productID = req.query.productID;
      // const rating = req.query.rating;
      const productID = req.body.productID;
      const rating = req.body.rating;
      // const error = ProductModel.rateProduct(userID, productID, rating);
      // console.log(error);
      // if (error) {
      //   res.status(400).send(error);
      // } else {
      //   res.status(200).send("Rating has been added");
      // }

      await this.productRepository.rate(userID, productID, rating);
      return res.status(200).send("Rating has been added");
    } catch (err) {
      console.log(err);
      console.log("Passing error to middleware");
      next(err);
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("Product not Found");
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      // const categories = req.query.categories;
      const result = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
        // categories
      );
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
