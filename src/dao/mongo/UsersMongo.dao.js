import { UserModel } from "../../models/user.model.js";

export class UsersMongoDAO {
  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }
  async create(userData) {
    return await UserModel.create(userData);
  }
}
