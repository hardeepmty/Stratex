const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = 'hardeep';

const saltRounds = 10;

const register = async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = { username, password: hashedPassword, role };
  User.create(user, (err, result) => {
    if (err) throw err;
    res.send('User registered!');
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
        res.json({ token });
      } else {
        res.send('Username or password incorrect');
      }
    } else {
      res.send('Username or password incorrect');
    }
  });
};

module.exports = { register, login };
