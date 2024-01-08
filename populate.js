require("dotenv").config();

const connectDB = require("./db/connect");
const product = require("./models/product");

const productJson = require("./products.json");

const start = async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URI);
    product.deleteMany();
    product.create(productJson);
    console.log("Success !!!!!!!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
