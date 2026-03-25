# Documentación de endpoints

## Sessions

### POST /api/sessions/register
Registra un nuevo usuario.

### POST /api/sessions/login
Inicia sesión y genera autenticación para el usuario.

### GET /api/sessions/current
Obtiene la información del usuario autenticado sin exponer datos sensibles.

### POST /api/sessions/forgot-password
Envía correo de recuperación de contraseña con token de expiración.

### POST /api/sessions/reset-password
Permite restablecer la contraseña validando el token y evitando reutilizar la contraseña anterior.

## Products

### GET /api/products
Obtiene el listado de productos.

### GET /api/products/:pid
Obtiene un producto por su ID.

### POST /api/products
Crea un producto. Requiere rol admin.

### PUT /api/products/:pid
Actualiza un producto. Requiere rol admin.

### DELETE /api/products/:pid
Elimina un producto. Requiere rol admin.

## Carts

### POST /api/carts
Crea un nuevo carrito.

### GET /api/carts
Obtiene los carritos.

### GET /api/carts/:cid
Obtiene un carrito por ID.

### POST /api/carts/:cid/products/:pid
Agrega un producto al carrito indicado.

### DELETE /api/carts/:cid/products/:pid
Elimina un producto específico del carrito.

### DELETE /api/carts/:cid
Vacía o elimina los productos del carrito.

### POST /api/carts/:cid/purchase
Finaliza la compra del carrito, genera ticket y descuenta stock.

## Nota

