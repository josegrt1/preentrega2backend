export const validateCartOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado"
      });
    }

    if (!req.user.cart) {
      return res.status(403).json({
        status: "error",
        message: "El usuario no tiene carrito asociado"
      });
    }

    const userCartId = req.user.cart.toString();
    const requestedCartId = req.params.cid;

    if (userCartId !== requestedCartId) {
      return res.status(403).json({
        status: "error",
        message: "No puedes operar sobre un carrito que no te pertenece"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error validando propietario del carrito"
    });
  }
};