import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL;
console.log("URL:" + url);
let client;
const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("MongoDB is connected");
      createCounter(client.db());
      createIndexes(client.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClient = () => {
  return client;
};

export const getDB = () => {
  if (!client) {
    throw new Error(
      "Database connection not established. Make sure MongoDB is connected before making requests."
    );
  }

  // Additional check to ensure client is actually connected
  try {
    return client.db();
  } catch (error) {
    throw new Error(
      "Database client exists but connection failed: " + error.message
    );
  }
};

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });
  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  }
};
// Indexing is done below: 1->Ascending order & -1 -> Descending order
// The difference:

// createIndex() - Creates one index, accepts a single index specification object.
// createIndexes() - Creates multiple indexes, expects an array of index specification objects.
const createIndexes = async (db) => {
  try {
    //Single index: For only one property i.e. price.
    await db.collection("products").createIndex({ price: 1 });
    //Compound Index: For more than one property i.e. name,category.
    await db.collection("products").createIndex({ name: 1, category: -1 });
    //Text Index: For the text i.e. description a.k.a desc.
    await db.collection("products").createIndex({ desc: "text" });
  } catch (err) {
    console.log(err);
  }
  console.log("Indexes are created");
};

export default connectToMongoDB;
