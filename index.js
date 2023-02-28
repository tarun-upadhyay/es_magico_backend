const express = require("express");
const app = express();
var cors = require("cors");
const cookieParser = require("cookie-parser");
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/user.Route");
require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ msg: "Welcome to our application this our home route" });
});

app.use("/user/api", userRouter)

 app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB Successfully");
  } catch (err) {
    console.log("Error connecting to DB");
    console.log(err);
  }
  console.log(`Listening on Port ${process.env.PORT}`)
});
