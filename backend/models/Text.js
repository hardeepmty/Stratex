const db = require('../config/db');

const Text = {
  create: (text, callback) => {
    const sql = 'INSERT INTO texts SET ?';
    db.query(sql, text, callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT texts.id, texts.content, users.username AS createdBy FROM texts JOIN users ON texts.createdBy = users.id';
    db.query(sql, callback);
  },
  findById: (id, callback) => {
    const sql = 'SELECT * FROM texts WHERE id = ?';
    db.query(sql, [id], callback);
  },
  update: (id, content, callback) => {
    const sql = 'UPDATE texts SET content = ? WHERE id = ?';
    db.query(sql, [content, id], callback);
  },
  delete: (id, callback) => {
    const sql = 'DELETE FROM texts WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Text;
