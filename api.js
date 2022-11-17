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
  // Grid.js does not work with Uppercase Keys in JSON data
  console.log("Metadata: ", metaData.info);
  if (query.startsWith("select")) res.json(lowerJSONKeys(results));
  else if (metaData.info) res.json([{ result: metaData.info }]);
  else res.json([{ query: "successful" }]);
});

app.listen(PORT, (error) => {
  if (error) console.error(error);
  console.log(`seeql-server listening on port ${PORT}`);
});

function lowerJSONKeys(results) {
  // code to convert keys of JSON to lowercase
  // https://stackoverflow.com/a/12540603
  var key;
  var keys = Object.keys(results);
  var n = keys.length;
  var newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = results[key];
  }

  console.log("RESULTS: ", Object.values(newobj));
  return Object.values(newobj);
}
