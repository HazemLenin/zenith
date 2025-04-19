require('dotenv').config();
const host = process.env.HOST;
const dbUser = process.env.DB_USER;
const dbPw = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
 dbName,
 dbUser,
 dbPw,
  {
    host: host,
    dialect: 'mysql'
  }
);

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

exports.sequelize = sequelize;
