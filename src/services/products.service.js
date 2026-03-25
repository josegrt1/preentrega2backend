import ProductsRepository from "../repositories/products.repository.js";

const productsRepository = new ProductsRepository();

export default class ProductsService {
  async getProducts(queryParams, req) {
    const limit = Number(queryParams.limit) || 10;
    const page = Number(queryParams.page) || 1;

    let sort = undefined;
    if (queryParams.sort === "asc") sort = { price: 1 };
    if (queryParams.sort === "desc") sort = { price: -1 };

    let filter = {};
    if (queryParams.query) {
      const q = String(queryParams.query).toLowerCase();

      if (q === "true" || q === "false") {
        filter.status = q === "true";
      } else {
        filter.category = queryParams.query;
      }
    }

    const result = await productsRepository.paginateProducts(filter, {
      limit,
      page,
      sort,
      lean: true
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (queryParams.query) params.set("query", String(queryParams.query));
    if (queryParams.sort) params.set("sort", String(queryParams.sort));

    const prevParams = new URLSearchParams(params);
    prevParams.set("page", String(result.prevPage));

    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(result.nextPage));

    return {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}?${prevParams.toString()}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?${nextParams.toString()}` : null
    };
  }

  async getProductById(pid) {
    const product = await productsRepository.getProductById(pid);

    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return {
      status: "success",
      payload: product
    };
  }

  async createProduct(productData) {
    const { title, description, price, category, code, stock } = productData || {};

    if (
      !title ||
      !description ||
      price === undefined ||
      !category ||
      !code ||
      stock === undefined
    ) {
      const error = new Error(
        "Faltan campos obligatorios: title, description, price, category, code, stock"
      );
      error.statusCode = 400;
      throw error;
    }

    const created = await productsRepository.createProduct(productData);

    return {
      status: "success",
      message: "Producto creado correctamente",
      payload: created
    };
  }

  async updateProduct(pid, updateData) {
    const updated = await productsRepository.updateProduct(pid, updateData);

    if (!updated) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return {
      status: "success",
      message: "Producto actualizado",
      payload: updated
    };
  }

  async deleteProduct(pid) {
    const deleted = await productsRepository.deleteProduct(pid);

    if (!deleted) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return {
      status: "success",
      message: "Producto eliminado",
      payload: deleted
    };
  }

  async emitUpdatedProducts(req) {
    const io = req.app.get("io");
    if (!io) return;

    const products = await productsRepository.getAllProductsLean();
    io.emit("updatedProducts", products);
  }
}