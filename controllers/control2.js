const db = require("../db/conn");
const jwt = require("jsonwebtoken");
const parser = require("cookie-parser");
const offerfruits = (req, res) => {
  const q = `select * from fruit  where type=?or offer=?`;
  db.query(q, ["seasonal", 1], (err, data) => {
    if (err) {
      res.status(500).json({ success: false, message: "could not fetch" });
    } else {
      console.log(data);
      res.status(200).json(data);
    }
  });
};
const currentorder = (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  const q = `select * from ordertable where status=? and cname =?`;
  db.query(q, ["uncomplete", verify.name], (err, data) => {
    console.log(data);
    res.status(200).json(data);
  });
};

const pastorder = (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const q = `select * from ordertable where status=? and cname=?`;

  db.query(q, ["complete", verify.name], (err, data) => {
    if (err)
      res
        .status(500)
        .json({ success: false, message: "data canot be fetched" });
    console.log(data);
    res.status(200).json(data);
  });
};
// order placing

// const orderplaced = (req, res) => {
//   const token = req.cookies.fruitzz;
//   const verify = jwt.verify(token, process.env.JWT_SECRET);
//   const q1 = "select vname ,fname from fruit where fruitid=?";
//   let vname2;
//   let fname2;
//   db.query(q1, [req.param.id], (err, data) => {
//     if (err) console.log("canot find fruit"); //server error
//     else {
//       console.log("get fruit");
//       vname2 = data[0].vname;
//       fname2 = data[0].fname;
//     }
//   });
//   const q = `insert into ordertable (amount,qtyordred,fruit,status,cname,vname) Values (?,?,?,?,?,?)`;
//   db.query(
//     q,
//     [
//       req.body.amount,
//       req.body.qtyordered,
//       fname2,
//       "placed",
//       verify.name,
//       vname2,
//     ],
//     (err, data) => {
//       if (err)
//         res
//           .status(500)
//           .json({ success: false, message: "data canot be fetched" });

//       res
//         .status(200)
//         .json({ success: true, message: "order placed successfully" });
//     }
//   );
// };
const orderform = (req, res) => {
  const token = req.cookies.fruitzz;
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const q1 = "select vname ,fname from fruit where fruitid=?";
  let vname2;
  let fname2;
  db.query(q1, [req.param.id], (err, data) => {
    if (err) console.log("canot find fruit"); //server error
    else {
      console.log("get fruit");
      vname2 = data[0].vname;
      fname2 = data[0].fname;
    }
  });
  res.render(orderfom, { vname: vname2, fname: fname2 });
};
const orderplaced = (req, res) => {
  const q = `insert into ordertable (amount,qtyordred,fruit,status,cname,vname) Values (?,?,?,?,?,?)`;
  db.query(
    q,
    [
      req.body.amount,
      req.body.qtyordered,
      req.body.fname,
      "placed",
      verify.name,
      req.body.vname,
    ],
    (err, data) => {
      if (err)
        res
          .status(500)
          .json({ success: false, message: "data canot be fetched" });

      res
        .status(200)
        .json({ success: true, message: "order placed successfully" });
    }
  );
};

module.exports = {
  offerfruits,
  pastorder,
  currentorder,
  orderplaced,
  orderform,
};
