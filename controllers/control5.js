const db = require("../db/conn");
const jwt = require("jsonwebtoken");
const parser = require("cookie-parser");

const customerlogin = (req, res) => {
  const q = `select count(name) from customer where name=? and password=?`;
  db.query(q, [req.body.cusername, req.body.cpassword], (err, data) => {
    if (err && data) {
    } else {
      const token = jwt.sign(
        { name: req.body.cusername, type: "customer" },
        process.env.JWT_SECRET
      );
      console.log(token);
      var expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      res.cookie("fruitzz", token, {
        secure: false,
        httponly: false,
        expires: expiryDate,
      });

      res.render("welcome_customer", { username: req.body.cusername });
    }
  });
};

const vendorlogin = (req, res) => {
  const q = `select count(name) from vendor where name=? and password=?`;
  db.query(q, [req.body.vusername, req.body.vpassword], (err, data) => {
    if (err && data == 1) {
    } else {
      const token = jwt.sign(
        { name: req.body.vusername, type: "vendor" },
        process.env.JWT_SECRET
      );
      console.log(token);
      var expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      res.cookie("fruitzz", token, {
        secure: false,
        httponly: false,
        expires: expiryDate,
      });

      res.render("welcome_vendor", { vendorname: req.body.vusername });
    }
  });
};
module.exports = {
  customerlogin,
  vendorlogin,
};
