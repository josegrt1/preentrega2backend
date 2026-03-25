# Backend Entrega Final

Proyecto final de backend desarrollado con Node.js, Express y MongoDB, aplicando arquitectura por capas, patrón Repository, autenticación con JWT, autorización por roles, recuperación de contraseña por correo y lógica de compra con ticket.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- Passport
- Bcrypt
- Nodemailer
- Cookie-parser
- Dotenv
- Socket.io

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Autenticación con JWT
- Ruta `/current` protegida
- Middleware de autorización por roles
- Gestión de productos
- Gestión de carritos
- Validación de carrito propio
- Recuperación de contraseña por correo con expiración de 1 hora
- Prevención de reutilización de contraseña anterior
- Compra de carrito con generación de ticket
- Descuento de stock automático al comprar
- Arquitectura por capas:
  - Routers
  - Controllers
  - Services
  - Repositories
  - DAO
  - DTO
  - Middlewares

## Estructura general del proyecto

```bash
src/
  config/
  controllers/
  dao/
  dto/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/
  app.js
  
Instalación
Clonar el repositorio:
git clone https://github.com/josegrt1/preentrega2backend.git

Entrar a la carpeta del proyecto:
cd preentrega2backend

Instalar dependencias:
npm install
Variables de entorno

Crear un archivo .env en la raíz del proyecto con una estructura como esta:
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_COOKIE_NAME=authToken
MAIL_USER=your_email
MAIL_PASS=your_app_password

Importante: el repositorio no incluye credenciales reales ni datos sensibles.

Scripts
npm run dev
npm start
Endpoints principales

Sessions
POST /api/sessions/register
POST /api/sessions/login
GET /api/sessions/current
POST /api/sessions/forgot-password
POST /api/sessions/reset-password

Products
GET /api/products
GET /api/products/:pid
POST /api/products
PUT /api/products/:pid
DELETE /api/products/:pid

Carts
POST /api/carts
GET /api/carts
GET /api/carts/:cid
POST /api/carts/:cid/products/:pid
DELETE /api/carts/:cid/products/:pid
DELETE /api/carts/:cid
POST /api/carts/:cid/purchase

Seguridad y permisos
Solo el administrador puede crear, actualizar y eliminar productos.
Solo el usuario dueño del carrito puede consultarlo, modificarlo o finalizar la compra.
La ruta /current está protegida con estrategia JWT.
El restablecimiento de contraseña usa token con expiración.

Flujo de recuperación de contraseña
El usuario solicita recuperación de contraseña.
El sistema envía un correo con enlace de recuperación.
El token expira luego de 1 hora.
La nueva contraseña no puede ser igual a la anterior.
Luego el usuario puede iniciar sesión con la nueva contraseña.

Flujo de compra
El usuario autenticado ejecuta POST /api/carts/:cid/purchase.
Se valida que el carrito pertenezca al usuario.
Se verifica el stock de los productos.
Se descuenta stock de los productos disponibles.
Se genera un ticket con código, monto y comprador.
El carrito se actualiza dejando solo productos no procesados.

Autor

José Gregorio Rodriguez Tabares

GitHub: josegrt1

Nota

Proyecto desarrollado como entrega final del curso de Backend.
