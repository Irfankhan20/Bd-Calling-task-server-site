const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());

//-------------------------------------------------

// MongoDB Connection URI

//-------------------------------------------------

app.get("/", (req, res) => {
  res.send("custom form application server is running");
});

app.listen(port, () => {
  console.log(`custom form application server is running on port ${port}`);
});
