const duplicateCheck = (db, taskDescription, userName) => {

  const queryString = `
  SELECT id FROM list WHERE task_description = $1 AND
  user_id = (SELECT id FROM users WHERE username =$2);
  `;


  return db.query(queryString, [taskDescription, userName])
  .then((data) => {
    return data;
  })
  .catch(err => {
    err.status(500)
    .json({ error: err.message });
  })

}

module.exports = duplicateCheck;
