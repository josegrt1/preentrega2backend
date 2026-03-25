import ProductsDAO from "../dao/mongo/products.dao.js";

const productsDAO = new ProductsDAO();

export default class ProductsRepository {
  async paginateProducts(filter, options) {
    return await productsDAO.paginate(filter, options);
  }

  async getProductById(id) {
    return await productsDAO.getById(id);
  }

  async getAllProductsLean() {
    return await productsDAO.getAllLean();
  }

  async createProduct(productData) {
    return await productsDAO.create(productData);
  }

  async updateProduct(id, updateData) {
    return await productsDAO.update(id, updateData);
  }

  async deleteProduct(id) {
    return await productsDAO.delete(id);
  }
}