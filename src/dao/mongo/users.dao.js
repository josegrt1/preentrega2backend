import { UserModel } from "../../models/user.model.js";

export default class UsersDAO {
  async getByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async getById(id) {
    return await UserModel.findById(id);
  }

  async create(userData) {
    return await UserModel.create(userData);
  }

  async updatePassword(id, hashedPassword) {
    return await UserModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  }
}