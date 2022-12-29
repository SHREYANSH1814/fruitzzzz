const { customerlogin, vendorlogin } = require("../controllers/control5");
const express = require("express");
const loginrouter = express.Router();
loginrouter.post("/customer_form", customerlogin);
loginrouter.post("/vendor_form", vendorlogin);
module.exports = { loginrouter };
