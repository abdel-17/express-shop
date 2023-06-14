const { sequelize } = require("./schema.js");

// Sync the database schema with the sequelize schema.
sequelize.sync();
