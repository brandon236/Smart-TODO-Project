/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const apiSearch = require('../lib/apiSearch');

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM list`;
    console.log(query);
    db.query(query)
      .then(data => {
        const list = data.rows;
        res.json({ list });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  router.post("/", (req, res) => {
    apiSearch(db, req.body.text);
    res.redirect("/");
  });

 return router;

//   router.post("/", (req, res) => {

//     let query = `INSERT INTO list (task_description) VALUES ($1)`;
//     db.query(query, [req.body.text])
//       .then(() => {})
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//  return router;

};
