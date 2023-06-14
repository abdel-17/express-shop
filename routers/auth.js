const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const { Client } = require("../database/schema");

const authRouter = express.Router();

// Middlware for authenticating requests using request cookies.
const authentication = async (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    const ssn = jwt.verify(token, process.env.JWT_SECRET);
    req.ssn = ssn;
    // Execute the next middleware.
    next();
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
};

authRouter.get("/login", async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
});

authRouter.post("/login", async (req, res) => {
  const client = await Client.findByPk(req.body.ssn, {
    attributes: ["ssn"]
  });

  if (!client) {
    res.status(403).send("Incorrect SSN");
    return;
  }

  // Authenticate using a JWT token.
  const token = jwt.sign(client.ssn, process.env.JWT_SECRET, {
    algorithm: "HS256"
  });
  // Store the token on the client using a cookie.
  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    })
    .redirect("/");
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("access_token").redirect("/login");
});

module.exports = {
  authRouter,
  authentication
};
