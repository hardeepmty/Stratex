const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, callback);
  },
  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], callback);
  }
};

module.exports = User;
