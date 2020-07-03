const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.post("/", (req, res) => {
    req.session.user_id = null;
    console.log(`logout user is ${req.session.user_id}`);
    res.redirect("/");
  });
  return router;
};
