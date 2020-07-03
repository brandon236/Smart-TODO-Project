const express = require('express');
const router  = express.Router();
const apiSearch = require('../lib/apiSearch');

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM list`;
    db.query(query)
      .then(data => {
        const list = data.rows;
        res.json({ list });
        res.redirect('/');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    apiSearch(db, req.body.text, req.session.user_id)
    .then(() => {
      res.redirect("/");
    })

  })

 return router;

};
