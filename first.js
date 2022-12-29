const path = require("path");
const pathenv = path.join(__dirname, "/.env");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: pathenv });
const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(express.static("public"));

const { regrouter } = require("./routers/registrouter");
const { cusrouter } = require("./routers/custrouter");
const { loginrouter } = require("./routers/loginrouter");
const { vendorrouter } = require("./routers/vendorrouter");
const authenticate = require("./controllers/control3");
const db = require("./db/conn");

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.get("/", authenticate);
app.get("/customer_form", (req, res) => {
  res.render("cust_login");
});

app.get("/vendor_form", (req, res) => {
  res.render("vendor_login");
});

app.get("/vendor_registration", (req, res) => {
  res.render("vendor_registration");
});
app.get("/customer_registration", (req, res) => {
  res.render("cust_registeration");
});

app.use(regrouter);
app.use(cusrouter);
app.use(loginrouter);
app.use(vendorrouter);
app.post("/order", (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const cusname = verify.name;
  const q = `Select * from fruit ,vendor  where fruit.vname=vendor.name and fname=? and qty >= ? Order by rating DESC`;
  db.query(q, [req.body.fname, req.body.qty], (err, data) => {
    if (err) {
      console.log(err);
      res.status(404).send("<h1>somthing went wrong</h1>");
    }
    console.log(data);
    if (data.length == 0) {
      console.log("empty");
      res.render("order_failed");
    } else {
      const q1 = `Update fruit set qty=? where fruitid=?`;
      db.query(
        q1,
        [data[0].qty - req.body.qty, parseFloat(data[0].fruitid).toFixed(2)],
        (err, data2) => {
          if (err) {
            console.log(err);
            res.status(404).send("<h1>somthing went wrong</h1>");
          } else {
            const q2 = `insert into ordertable (amount,qtyordered,status,cname,vname,name) Values(?,?,?,?,?,?)`;
            db.query(
              q2,
              [
                req.body.qty * data[0].price,
                req.body.qty,
                "uncompleted",
                cusname,
                data[0].vname,
                req.body.fname,
              ],
              (err, data2) => {
                if (err) {
                  console.log(err);
                  res.status(404).send("<h1>somthing went wrong</h1>");
                }
                res.render("order_success");
              }
            );
          }
        }
      );
    }
  });
});
app.get("/customer_history", (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const cusname = verify.name;
  const q = `select amount, status,vname,name  from ordertable where cname=?`;
  db.query(q, [cusname], (err, data) => {
    if (err) {
      res.send("<h1>Spmething went wrong</h1>");
    } else {
      console.log(data);
      res.render("cust_history", { data: data });
    }
  });
});
app.get("/logout", (req, res) => {
  res.clearCookie("fruitzz");
  res.render("index");
});
app.get("/fruitform", (req, res) => {
  res.render("fruit_entry");
});
app.post("/registerfruit", (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const cusname = verify.name;
  const q = `insert into fruit (qty,fname,type,quality,vname) values (?,?,?,?,?)`;
  db.query(
    q,
    [
      req.body.fruit_qty,
      req.body.fruit_name,
      req.body.fruit_type,
      req.body.fruit_qlt,
      cusname,
    ],
    (err, data) => {
      if (err) {
        console.log(err);
        res.send("<h1>the fruit can not be registered</h1>");
      } else {
        res.redirect("/");
      }
    }
  );
});
app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log(`port is running on ${process.env.PORT}`);
});
