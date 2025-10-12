export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({
          status: "error",
          message: "No autenticado. Por favor, inicie sesión.",
        });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          status: "error",
          message: "No tiene permiso para realizar esta acción.",
        });
    }
    next();
  };
};
