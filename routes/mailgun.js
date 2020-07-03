const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {


    console.log(" process.env.MAILGUN_API_KEY",  process.env.MAILGUN_API_KEY)

    const api_key = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
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




      const data = {
        from: 'SMART-TODO <pet.ghanbari@gmail.com>',
        to: email,
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
