const db = require("../db/conn");
const jwt = require("jsonwebtoken");
const parser = require("cookie-parser");
const customregistration = (req, res) => {
  const q = `insert into customer (name,password,num,house,street,landmark,city) values (?,?,?,?,?,?,?) ;`;
  db.query(
    q,
    [
      req.body.cust_name,
      req.body.cust_password,
      req.body.cust_num,
      Number(req.body.house),
      req.body.street,
      req.body.landmark,
      req.body.city,
    ],
    (err, data) => {
      if (err)
        res.send(
          "<h1>already a customer of this name please try different user name</h1>"
        );
      else {
        console.log("insertion successfully");
        const token = jwt.sign(
          { name: req.body.cust_name, type: "customer" },
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
        res.render("welcome_customer", { username: req.body.cust_name });
      }
    }
  );
};

const vendorregistration = (req, res) => {
  const q = `insert into vendor (name,password,address,city,rating,email,upiid) values (?,?,?,?,?,?,?) ;`;
  db.query(
    q,
    [
      req.body.vend_name,
      req.body.vend_password,
      req.body.vend_address,
      req.body.vend_city,
      req.body.vend_rating,
      req.body.vend_email,
      req.body.upiid,
    ],
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(300).send("<h1>already a vendor of this name</h1>");
      } else {
        console.log("insertion successfully");
        const token = jwt.sign(
          { name: req.body.vend_name, type: "vendor" },
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
        res.render("welcome_vendor", { vendorname: req.body.vend_name });
      }
    }
  );
};

module.exports = {
  customregistration,
  vendorregistration,
};
//  name:req.body.cust_name,
//      password:req.body.cust_password,
//      num:req.body.cust_num,
//      house:req.body.house,
//      street:req.body.street,
//      landmark:req.body.landmark,
//      city:req.body.city
