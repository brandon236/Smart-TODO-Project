const duplicateCheck = (db, taskDescription) => {


  const queryString = `
  SELECT id FROM list WHERE task_description = $1;
  `;
  return db.query(queryString, [taskDescription])
  .then((data) => {
    return data;
  })
  .catch(err => {
    err.status(500)
    .json({ error: err.message });
  });

}

module.exports = duplicateCheck;
