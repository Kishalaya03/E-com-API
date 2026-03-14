import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
export default class UserModel {
  constructor(name, email, password, typeofuser, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.typeofuser = typeofuser;
    //we use only id if there is no db connection but use _id when there is connection to mongodb
    this._id = id;
  }
  static getAll() {
    return users;
  }
}

let users = [
  {
    name: "Seller User",
    email: "seller@ecom.com",
    password: "Password1",
    typeofuser: "seller",
    id: "1",
  },
  {
    name: "Customer User",
    email: "customer@ecom.com",
    password: "Password1",
    typeofuser: "customer",
    id: "2",
  },
];
