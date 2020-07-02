const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post("/", (req, res) => {

    // this part grab the item name
    const category = Object.keys(req.body)[0];
    let taskDescription = req.body[category].toLowerCase();
    taskDescription = taskDescription.slice(1, taskDescription.length -1);

    db.query(`
    SELECT id FROM categories WHERE type = '${category}';
    `)
    .then(res => {
      const categoryID = res.rows[0].id;
      return categoryID;
    })
    .then(categoryID => {

      const queryString = `
      UPDATE list SET category_id  = ${categoryID} WHERE task_description = '${taskDescription}';`;

      db.query(queryString)
      .then(res => res);
    })
    .catch(err => err);

    res.redirect('/');

  });

 return router;

};