const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
  "d1dk4ovkp479cn",
  "vplyxiipiajbjw",
  "270240c80b1f2d3f86443745fca65fa6ecd07d82155efa0c407fbf87ecb658e8",
  {
    host: "ec2-3-226-163-72.compute-1.amazonaws.com",
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = connectDB;
