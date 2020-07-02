const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post("/", (req, res) => {

    // this part grab the item name
    let item = Object.keys(req.body)[0];
    item = item.slice(0, item.length - 2);

    const userName = req.session.user_id;
    const queryString = `DELETE FROM list WHERE task_description = '${item}' AND user_id = (SELECT id FROM users WHERE username = '${userName}');`;

    db.query(queryString)
    .then(s => {
      res.redirect('/');
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

  });

 return router;

};
