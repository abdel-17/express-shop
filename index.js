const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routers/auth");
const { productsRouter } = require("./routers/products");
const { ordersRouter } = require("./routers/orders");

// Load the environment variables.
dotenv.config();

const app = express();

// Use ejs to render html.
app.set("view engine", "ejs");

// Middlewares for parsing request body and cookies.
app.use(express.json(), express.urlencoded(), cookieParser());

app.use(authRouter);
app.use(productsRouter);
app.use(ordersRouter);

app.listen(3000, async () => {
  console.log("Running on port 3000");
});
