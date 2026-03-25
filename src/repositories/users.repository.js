import UsersDAO from "../dao/mongo/users.dao.js";

const usersDAO = new UsersDAO();

export default class UsersRepository {
  async getUserByEmail(email) {
    return await usersDAO.getByEmail(email);
  }

  async getUserById(id) {
    return await usersDAO.getById(id);
  }

  async createUser(userData) {
    return await usersDAO.create(userData);
  }

  async updateUserPassword(id, hashedPassword) {
    return await usersDAO.updatePassword(id, hashedPassword);
  }
}