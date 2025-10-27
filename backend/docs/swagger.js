const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Artisan des Saveurs",
      version: "1.0.0",
      description: "Documentation de l'API (Auth + Produits)",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthRegister: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "mypassword123",
            },
          },
        },
        AuthLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "mypassword123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
          },
        },
        MeResponse: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "will",
            },
            email: {
              type: "string",
              example: "will@example.com",
            },
          },
        },
        ProductData:{
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Chipolatas"
            },
            description: {
              type: "string",
              example: "Fine saucisse de porc idéale pour le barbecue."
            },
            price: {
              type: "number",
              example: 523.88
            },
            category: {
              type: "string",
              example: "saucisses-et-variantes"
            },
            origin: {
              type: "string",
              example: "France"
            },
            preparation: {
              type: "string",
              example: "Griller 10–12 min à feu moyen sans percer, jusqu’à belle coloration uniforme."
            },
            recette: {
              type: "string",
              example: "Porc, Sel, Sucre, Epices"
            },
            is_available: {
              type: "boolean",
              example: true
            },
            stock_quantity: {
              type: "integer",
              example: 20
            },
            unit: {
              type: "string",
              example: "pièce"
            },
            is_featured: {
              type: "boolean",
              example: false
            },
            file: {
              type: "string",
              format: "binary",
              description: "Image du produit à uploader"
            }
          },
        }
      }
    },
  },
  apis: ["./backend/routes/*.js"], // Doc scannée dans les routes
};

module.exports = swaggerJsdoc(options);

