require("dotenv").config();
const express = require("express");
const db = require("./models");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const cors = require("cors");

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", userRoutes);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("DB CONNECTED");
    console.log(`listening at: http://localhost:${port}`);
  });
});
