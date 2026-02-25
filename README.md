# Entrega Final - Backend Ecommerce

Backend de e-commerce desarrollado con **Node.js + Express**, persistencia con **MongoDB/Mongoose**, vistas con **Handlebars** y actualización en tiempo real con **Socket.IO**.

## ✅ Tecnologías
- Node.js
- Express
- MongoDB + Mongoose
- express-handlebars
- mongoose-paginate-v2
- Socket.IO
- dotenv

🌐 Rutas (Views)
/products → Listado de productos con paginación

/realtimeproducts → Alta y baja de productos en tiempo real (Socket.IO)

/carts/:cid → Vista del carrito con total

🔌 Rutas (API)
Productos
GET /api/products (paginación + filtros + sort)

Query params: limit, page, sort=asc|desc, query

GET /api/products/:pid

POST /api/products

PUT /api/products/:pid

DELETE /api/products/:pid

Carritos
GET /api/carts

GET /api/carts/:cid

(y las rutas de agregar/eliminar productos al carrito según implementación)

📌 Notas
.env está ignorado por seguridad (.gitignore).

node_modules no se versiona.

yaml
Copiar código
