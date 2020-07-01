const requestPromise = require('request-promise');

// This function search through APIs and categorize the input task

const apiSearch = (db, input) => {
  let category_id = null;
  let query = `INSERT INTO list (task_description, category_id) VALUES ($1, ${category_id})`;

  // Movie API Website
  const website = {
   movie: `http://www.omdbapi.com/?i=tt3896198&apikey=235a0fce&t=${input}`
  };

  //We can use a loop to account for different website
  requestPromise(website.movie)
  .then(function (response) {
    const data = JSON.parse(response);
    if (data.Title.toLowerCase() === input.toLowerCase()) {
      category_id = 1;
    }

    query = `INSERT INTO list (task_description, category_id) VALUES ($1, ${category_id})`;
    db.query(query, [input])
      .then(() => {
        console.log("query", query)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })

};
  module.exports = apiSearch;

