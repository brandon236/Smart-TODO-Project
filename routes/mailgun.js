const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {

    const api_key = 'bcf67d56056771e3292c59e9a220a25d-913a5827-cc1166db';
    const domain = 'sandboxf5630c4b044e4047b0e62cad213a53e7.mailgun.org';
    const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    const userName = req.session.user_id;
    const queryString = `
    SELECT list.task_description AS task,
    categories.type  FROM list
    JOIN categories  ON  list.category_id = categories.id
    JOIN users ON users.id = list.user_id
    WHERE list.user_id = (SELECT id FROM users WHERE username = $1);
    `;

    let htmlArray = [];
    db.query(queryString, [userName])
    .then((data) => {

      for (let row of data.rows) {
        const index = htmlArray.indexOf(`<h1>${row.type.toUpperCase()}</h1>`);

        if (index < 0) {
          htmlArray.push(`<h1>${row.type.toUpperCase()}</h1>`);
          htmlArray.push(`<h2 style="color:#008080">${row.task.toUpperCase()}</h2>`);
        } else {
          htmlArray.splice(index + 1, 0 , `<h2 style="color:#008080">${row.task.toUpperCase()}</h2>`);
        }
      }

    })
    .then(() => {
      let email = "";
      return db.query(`
      SELECT email FROM users WHERE username = '${userName}';
      `)
      .then((data) => {
        email = data.rows[0].email;
        return email;
      });

    })
    .then((email) => {


      console.log("email", email)

      const data = {
        from: 'SMART-TODO <ghanbari@ualberta.ca>',
        to: 'ghanbari@ualberta.ca',
        subject: 'YOUR TASKS',
        html: htmlArray.join(' ')
      };

      mailgun.messages().send(data, function (error, body) {
        console.log(body);
      })

    })
    .then(() => res.redirect("/"));

  });

 return router;
};
