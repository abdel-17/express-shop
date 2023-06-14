const { faker } = require("@faker-js/faker");
const { RandomSSN } = require("ssn");
const { Client, Product } = require("./schema.js");

function createFakeCustomer() {
  Client.create({
    ssn: new RandomSSN().value().toString(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 30 }),
    balance: faker.number.float({ min: 0, max: 200 })
  }).catch((error) => {
    console.error(error);
  });
}

function createFakeProduct() {
  Product.create({
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 5, max: 50, dec: 2 }),
    quantity: faker.number.int({ min: 0, max: 10 })
  }).catch((error) => {
    console.error(error);
  });
}

for (let i = 0; i < 5; i++) {
  createFakeCustomer();
}

for (let i = 0; i < 12; i++) {
  createFakeProduct();
}
