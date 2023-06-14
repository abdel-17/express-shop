const express = require("express");
const { Product, Client } = require("../database/schema");
const { authentication } = require("./auth");

const productsRouter = express.Router();

productsRouter.get("/", (req, res) => {
  res.redirect("/products");
});

productsRouter.get("/products", authentication, async (req, res) => {
  const [products, customer] = await Promise.all([
    Product.findAll(),
    Client.findByPk(req.ssn, {
      attributes: ["name", "balance"]
    })
  ]);

  if (!customer) {
    res.sendStatus(403);
    return;
  }

  res.render("products", { products, customer });
});

module.exports = { productsRouter };
