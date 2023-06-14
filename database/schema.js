const { DataTypes, UUIDV4 } = require("sequelize");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("store", "root", "", {
  dialect: "mysql",
  host: "localhost"
});

const Client = sequelize.define("Clients", {
  ssn: {
    type: DataTypes.CHAR(9),
    primaryKey: true,
    validate: {
      len: [9, 9]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 13
    }
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
});

const Product = sequelize.define("Products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
});

const Order = sequelize.define("Orders", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  amountPaid: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
});

Product.hasOne(Order, {
  foreignKey: "productId"
});
Order.belongsTo(Product, {
  foreignKey: "productId"
});

Client.hasOne(Order, {
  foreignKey: "clientSsn"
});
Order.belongsTo(Client, {
  foreignKey: "clientSsn"
});

module.exports = { sequelize, Client, Product, Order };
