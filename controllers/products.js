const product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await product.find({});
  res.status(200).json({
    status: "success",
    statusCode: 200,
    data: products,
    total: products.length,
  });
};
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;

  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  var results = product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    results.sort(sortList);
  } else {
    results.sort("createdAt");
  }
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    results.select(fieldsList);
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((element) => {
      const [field, operator, value] = element.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  results = results.skip(skip).limit(limit);
  const products = await results;
  res.status(200).json({
    status: "success",
    statusCode: 200,
    data: products,
    total: products.length,
  });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
