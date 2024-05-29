const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = 'hardeep';

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, role };

    User.create(user, (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.send('User registered!');
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, async (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
        res.json({ token });
      } else {
        res.status(401).send('Username or password incorrect');
      }
    } else {
      res.status(401).send('Username or password incorrect');
    }
  });
};
