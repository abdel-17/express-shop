const express = require("express");
const { Order, Product, sequelize } = require("../database/schema");
const { authentication } = require("./auth");

const ordersRouter = express.Router();

ordersRouter.get("/orders", authentication, async (req, res) => {
  const orders = await Order.findAll({
    attributes: ["amountPaid", "createdAt"],
    include: {
      // Join the orders table with the products table.
      model: Product,
      attributes: ["name"]
    },
    where: {
      clientSsn: req.ssn
    },
    order: [["createdAt", "desc"]]
  });
  res.render("orders", { orders });
});

ordersRouter.post("/orders", authentication, async (req, res) => {
  const { productId } = req.body;
  const ssn = req.ssn;
  try {
    await sequelize.transaction(async (transaction) => {
      const { price } = await Product.findByPk(productId, {
        attributes: ["price"],
        transaction
      });

      await sequelize.query(
        "UPDATE Clients SET balance = balance - :price WHERE ssn = :ssn",
        {
          replacements: {
            ssn,
            price
          },
          transaction
        }
      );

      await Product.decrement("quantity", {
        where: { id: productId },
        transaction
      });

      await Order.create(
        {
          clientSsn: ssn,
          productId: productId,
          amountPaid: price
        },
        { transaction }
      );
    });
    res.redirect("/");
  } catch (error) {
    console.error("Failed to create order:", error);
    res.sendStatus(500);
  }
});

module.exports = { ordersRouter };
