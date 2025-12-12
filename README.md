# Preentrega 2 – Backend I

Proyecto realizado para la preentrega 2 del curso **Backend I (Coderhouse)**.

El proyecto consiste en un servidor hecho con **Node.js y Express**, que permite manejar productos y carritos, utilizando **Handlebars** para las vistas y **Socket.io** para la actualización en tiempo real.

---

## Tecnologías usadas

- Node.js
- Express
- Express-Handlebars
- Socket.io
- Nodemon (para desarrollo)

---

## Cómo ejecutar el proyecto

1. Instalar las dependencias:

```bash
npm install

Levantar el servidor:
npm start

El servidor corre en:
http://localhost:8080

Vistas:
- /
 Muestra el listado de productos renderizado con Handlebars.

- /realtimeproducts
 Permite crear y eliminar productos y ver los cambios en tiempo real.

 API:
- Productos
*GET /api/products
*GET /api/products/:pid
*POST /api/products
*PUT /api/products/:pid
DELETE /api/products/:pid
- Carritos
*POST /api/carts
*GET /api/carts/:cid
*POST /api/carts/:cid/product/:pid

Persistencia
Los datos se guardan en archivos JSON:
-src/data/products.json
-src/data/carts.json

