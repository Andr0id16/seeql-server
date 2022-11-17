import { Sequelize } from "sequelize";
const DATABASE_HOST = "localhost";
const DATABASE_USERNAME = "aragorn";
const DATABASE_PASSWORD = "Aragorn@125626";
const DATABASE_NAME = "supplychain";
export function getConnection() {
  return new Promise((resolve, reject) => {
    const dbConnection = new Sequelize(
      DATABASE_NAME,
      DATABASE_USERNAME,
      DATABASE_PASSWORD,
      {
        host: DATABASE_HOST,
        dialect: "mysql",
      }
    );

    //authenticate user credentials
    dbConnection
      .authenticate()
      .then(() => {
        console.log("Connection established successfully");
        resolve(dbConnection);
      })
      .catch((error) => {
        console.error("Unable to establish connection", error);
        reject(error);
      });
  });
}
