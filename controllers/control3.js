const express = require("express");
const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  if (req.cookies.fruitzz) {
    const token = req.cookies.fruitzz;
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    if (verify.type === "customer") {
      res.render("welcome_customer", { username: verify.name });
    } else {
      res.render("welcome_vendor", { vendorname: verify.name });
    }
  } else {
    res.render("index");

    next();
  }
};
module.exports = authenticate;
