require("dotenv").config();
require("express-async-errors");

const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const productsRouter = require("./routes/products");
//async errors

const express = require("express");

const app = express();

//middleware
app.use(express.json());

// routes
app.use("/api/v1/products", productsRouter);

// product route
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
