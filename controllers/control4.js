const db = require("../db/conn");
const jwt = require("jsonwebtoken");
const parser = require("cookie-parser");
const currentorder = (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  const q = `select * from ordertable where status=? and vname =?`;
  db.query(q, ["uncompleted", verify.name], (err, data) => {
    console.log(data);
    res.render("vendor_history", { data: data });
  });
};

const pastorder = (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const q = `select * from ordertable where status=? and vname=?`;

  db.query(q, ["completed", verify.name], (err, data) => {
    if (err)
      res
        .status(500)
        .json({ success: false, message: "data canot be fetched" });

    res.render("vendor_history", { data: data });
  });
};
const addfruit = (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const q = `insert into fruit (piece,qty,fname,type,quality,vname,offer,offertag)values(?,?,?,?,?,?,?,?)`;
  db.query(
    q,
    [
      req.body.piece,
      req.body.qty,
      req.body.fname,
      req.body.type,
      req.body.quality,
      verify.name,

      req.body.offer,

      req.body.offertag,
    ],
    (err, data) => {
      if (err)
        res
          .status(500)
          .json({ success: false, message: "data canot be fetched" });
      console.log(data);
      res.status(200).json(data); //move to home page
    }
  );
};

module.exports = {
  pastorder,
  currentorder,
  addfruit,
};
