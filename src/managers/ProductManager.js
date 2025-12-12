import { promises as fs } from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }


  async getProducts() {
    return await this.#readFile();
  }


  async getProductById(id) {
    const products = await this.#readFile();
    return products.find((p) => String(p.id) === String(id)) || null;
  }


  async addProduct(productData) {
    const products = await this.#readFile();

    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = productData;

    if (
      !title ||
      !description ||
      !code ||
      price == null ||
      stock == null ||
      !category
    ) {
      throw new Error("Faltan campos obligatorios para crear el producto.");
    }

    const newId =
      products.length === 0 ? 1 : products[products.length - 1].id + 1;

    const newProduct = {
      id: newId,
      title,
      description,
      code,
      price: Number(price),
      status,
      stock: Number(stock),
      category,
      thumbnails,
    };

    products.push(newProduct);
    await this.#writeFile(products);

    return newProduct;
  }


  async updateProduct(id, updates) {
    const products = await this.#readFile();
    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) throw new Error("Producto no encontrado.");

    const existingProduct = products[index];

    const updatedProduct = {
      ...existingProduct,
      ...updates,
      id: existingProduct.id, 
    };

    products[index] = updatedProduct;
    await this.#writeFile(products);

    return updatedProduct;
  }


  async deleteProduct(id) {
    const products = await this.#readFile();
    const productId = String(id);

    const index = products.findIndex((p) => String(p.id) === productId);

    if (index === -1) {

      return null;
    }

    const [deleted] = products.splice(index, 1);
    await this.#writeFile(products);
    return deleted; 
  }


  async deleteProductById(id) {
    const deleted = await this.deleteProduct(id);
    if (!deleted) {
      throw new Error("Producto no encontrado.");
    }

    return await this.#readFile();
  }
}
