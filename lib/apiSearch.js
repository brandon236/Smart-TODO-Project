const requestPromise = require('request-promise');

// This function will search through the APIs and categorize the input task

const apiSearch = (db, input) => {
  let category_id = 5;
  let query = `INSERT INTO list (task_description, category_id) VALUES ($1, ${category_id})`;

  const notIncluded = ["bread", "chicken", "fruit", "grapes", "bananas", "oranges", 
  "vegetables", "onions", "cookies", "eggs", "salt", "pepper", "sugar", "celery", 
  "ice", "carrots", "milk", "flour", "beef", "pork", "rice", "potatoes", "tomatoes", 
  "broccoli", "bell peppers", "lettuce", "cucumbers", "corn", "garlic", "mushrooms", 
  "cabbage", "sweet potatoes", "cauliflower", "asparagus", "apples", "strawberries",
  "watermelon", "lemons", "peaches", "blueberries", "pineapple", "cantaloupe", 
  "cherries", "pears", "mangoes", "raspberries", "blackberries", "plums", "cheese", 
  "chips", "chocolate", "hot dogs", "sushi", "soda", "beer", "frozen dinners", 
  "cereal", "cigarettes", "bacon", "maple syrup", "oatmeal", "waffles", "honey", 
  "hot sauce", "jam", "ketchup", "relish", "mayonnaise", "mustard", "olive oil", 
  "peanut butter", "pickles", "salsa", "butter", "yogurt", "chicken broth", 
  "chicken soup", "tomato soup", "ravioli", "tortellini", "apple juice", 
  "coffee", "lemonade", "orange juice", "potato chips", "crackers", "popcorn", 
  "pretzels", "tortilla chips", "chocolate chips", "chocolate ice cream", 
  "vanilla ice cream", "chocolate chip cookies"];

  const moviesExcluded = ["the catcher in the rye", "console wars"]

  // Movie API Website
  const website = {
   movie: {
    uri: `http://www.omdbapi.com/?i=tt3896198&apikey=235a0fce&t=${input}`,
    json: true // Automatically parses the JSON string in the response
    },
   eat: {
    uri: `http://opentable.herokuapp.com/api/restaurants?name=${input}`,
    json: true
    },
   read: {
    uri: `https://www.googleapis.com/books/v1/volumes?q=${input}`,
    json: true
    },
   buy: {
    uri: `https://datagram-products-v1.p.rapidapi.com/storeproduct/search/?q=${input}`,
    headers: {
      "x-rapidapi-host": "datagram-products-v1.p.rapidapi.com",
      "x-rapidapi-key": process.env.API_KEY,
      "useQueryString": true
    },
    json: true
    },
  };


  requestPromise(website.movie)
  .then(function (data) {
    if (data.Response === 'True') {
      if ((data.Title.toLowerCase() === input.toLowerCase()) && notIncluded.indexOf(input.toLowerCase()) <= -1 && moviesExcluded.indexOf(input.toLowerCase()) <= -1) {
        return 1;
      }
    }
    return requestPromise(website.eat)
    .then(function (data) {
      if (data.restaurants.length > 0) {
        if (data.restaurants[0].name.toLowerCase() === input.toLowerCase()){
          return 2;
        }
      }
      return requestPromise(website.read)
      .then(function (data) {
        if (data.totalItems > 0) {
          if ((data.items[0].volumeInfo.title.toLowerCase() === input.toLowerCase()) && notIncluded.indexOf(input.toLowerCase()) <= -1){
            return 3;
          }
        }
        return requestPromise(website.buy)
        .then(function (data) {
          if (data.length > 0) {
            return 4;
          }
          return 5;
        })
      })
    })
  })
  .then(function (category_id) {
    query = `INSERT INTO list (task_description, category_id) VALUES ($1, ${category_id})`;
    db.query(query, [input])
      .then(() => {
        console.log("query", query)
      })
      .catch(err => {
          err.status(500)
          .json({ error: err.message });
      });
  })
};
  module.exports = apiSearch;

