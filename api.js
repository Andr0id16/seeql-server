import express from "express";
import { findUser } from "./login.js";
import logger from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { getConnection } from "./query.js";
const app = express();
const PORT = 3000;
const HOST = "localhost";
var dbConnection = null;
//logging
app.use(cors());
app.use(logger("dev"));

//parse JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// post request on login
app.post("/usercheck", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const database = req.body.database;
  console.log("username: ", username);
  //promise based user authentication
  findUser(username, password, database)
    .then(() => {
      console.log("User found");
      res.status(200).json({ loginSuccessful: true });
    })
    .catch((error) => {
      console.log("User not found");
      res.status(401).json({ loginSuccessful: false, error: error });
    });
});
app.use(async (req, res, next) => {
  if (dbConnection == null) dbConnection = await getConnection();
  next();
});
app.get("/query/:query", async (req, res) => {
  console.log(dbConnection);
  const query = req.params.query;
  console.log("QUERY:  ", query);
  const [results, metaData] = await dbConnection.query(query);
  console.log("RESULTS :  ", results);
  // let processedresults = await Promise.all(
  //   results.map((tablename) => Object.values(tablename))
  // );
  // res.json(JSON.stringify(processedresults));
  res.json(JSON.stringify(results));
});

app.listen(PORT, (error) => {
  if (error) console.error(error);
  console.log(`seeql-server listening on port ${PORT}`);
});
