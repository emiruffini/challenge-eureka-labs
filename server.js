const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const router = require("./routes/routes");
require("./config/cnx-db");

const app = express();

const port = process.env.PORT;
const host = process.env.HOST || "0.0.0.0";

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Avengers API",
      description: "API realizada para el challenge de EUREKA LABS",
      contact: {
        name: "Emiliano Ruffini",
      },
      servers: ["http://localhost:4000"],
      componets: {
        securitySchemes: {
          Bearer: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  },
  // ['.routes/*.js']
  apis: ["./routes/routes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(port, host, () => console.log("Listening on PORT " + port));
