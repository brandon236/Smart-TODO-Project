/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userName = req.session.user_id;
    let query = `
    SELECT * FROM list
    JOIN categories  ON  list.category_id = categories.id
    JOIN users ON users.id = list.user_id
    WHERE list.user_id = (SELECT id FROM users WHERE username = $1)`;

    db.query(query, [userName])
      .then(data => {
        const join = data.rows;
        res.json({ join });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
