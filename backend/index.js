const express = require("express");
const cors = require("cors");
const connection = require("./config/DB");
const employRoute = require("./routes/employ.routes");
const manaerRoute = require("./routes/manager.routes");
const app = express();


app.use(cors());

app.use(express.json());

app.use("/auth", employRoute);
app.use("/manager", manaerRoute);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
  console.log("Server is running");
});
