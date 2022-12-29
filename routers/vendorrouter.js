const {
  pastorder,
  currentorder,
  addfruit,
} = require("../controllers/control4");

const express = require("express");
const vendorrouter = express.Router();
vendorrouter.get("/vendor/pastorder", pastorder);
vendorrouter.get("/vendor/currentorder", currentorder);
vendorrouter.post("/vendor/addfruit", addfruit);

module.exports = {
  vendorrouter,
};
