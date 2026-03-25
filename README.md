# Backend Entrega Final

Proyecto final de backend desarrollado con **Node.js**, **Express** y **MongoDB**, aplicando **arquitectura por capas**, **patrón Repository**, **autenticación con JWT**, **autorización por roles**, **recuperación de contraseña por correo** y **lógica de compra con ticket**.

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Autenticación con JWT en cookies
- Ruta `/current` con DTO para no exponer datos sensibles
- Middleware de autorización por roles
- CRUD de productos
- Gestión de carritos
- Validación de carrito propio por usuario
- Recuperación de contraseña con token de expiración
- Validación para impedir reutilizar la contraseña anterior
- Compra de carrito con generación de ticket
- Descuento de stock automático en la compra
- Documentación básica de endpoints para pruebas con Thunder Client

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport
- JWT
- Bcrypt
- Nodemailer
- Handlebars
- Cookie Parser
- Socket.io

## Estructura del proyecto

```bash
preentrega2backend/
├── docs/
│   └── thunder-client-endpoints.md
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   │   └── mongo/
│   ├── dto/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── views/
│   ├── public/
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md

Instalación y ejecución
Clonar el repositorio
git clone https://github.com/josegrt1/preentrega2backend.git

Entrar en la carpeta del proyecto
cd preentrega2backend

Instalar dependencias
npm install
Crear el archivo .env tomando como base .env.example

Variables de entorno
Ejemplo de configuración:

MONGO_URL=
PORT=8080
JWT_SECRET=
JWT_COOKIE_NAME=authToken
MAIL_USER=
MAIL_PASS=

Scripts
npm run dev
npm start

Endpoints principales

Sessions
POST /api/sessions/register → registra un usuario
POST /api/sessions/login → inicia sesión
GET /api/sessions/current → obtiene el usuario autenticado sin datos sensibles
POST /api/sessions/forgot-password → envía correo de recuperación
POST /api/sessions/reset-password → restablece contraseña con token válido

Products
GET /api/products → lista productos
GET /api/products/:pid → obtiene un producto por ID
POST /api/products → crea producto (solo admin)
PUT /api/products/:pid → actualiza producto (solo admin)
DELETE /api/products/:pid → elimina producto (solo admin)

Carts
GET /api/carts/:cid → obtiene un carrito por ID
POST /api/carts → crea un carrito
POST /api/carts/:cid/products/:pid → agrega producto al carrito
DELETE /api/carts/:cid/products/:pid → elimina un producto del carrito
DELETE /api/carts/:cid → vacía el carrito
POST /api/carts/:cid/purchase → finaliza compra y genera ticket

Documentación de endpoints
La documentación de prueba para Thunder Client se encuentra en:
docs/thunder-client-endpoints.md

Autor

José Rodríguez
GitHub: josegrt1
