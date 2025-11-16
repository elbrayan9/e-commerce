import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de API E-commerce",
      version: "1.0.0",
      description:
        "API para el proyecto de E-commerce, documentada con Swagger.",
    },
  },
  apis: ["./src/routes/sessions.router.js"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
