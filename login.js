import { Sequelize } from "sequelize";

// const DATABASE_NAME = "mysql";
const DATABASE_HOST = "localhost";

// promise based authentication
export function findUser(username, password, database) {
  console.log("Authenticating User");
  return new Promise((resolve, reject) => {
    const dbConnection = new Sequelize(database, username, password, {
      host: DATABASE_HOST,
      dialect: "mysql",
    });

    //authenticate user credentials
    dbConnection
      .authenticate()
      .then(() => {
        console.log("User authenticated successfully");
        resolve();
      })
      .catch((error) => {
        console.error("Unable to authenticate user\n", error);
        reject(error);
      });
  });
}
