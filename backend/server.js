const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const multer = require('multer');
const csvtojson = require('csvtojson');

const app = express();
const PORT = 8000;
const SECRET_KEY = 'hardeep';
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Raj4@sql',
  database: 'marketplace'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Middleware
app.use(bodyParser.json());

const saltRounds = 10;

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Middleware for authorization
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
};

// Register
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = { username, password: hashedPassword, role };
  const sql = 'INSERT INTO users SET ?';
  db.query(sql, user, (err, result) => {
    if (err) throw err;
    res.send('User registered!');
  });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
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
});

// Setup multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes for Texts with authorization middleware
app.post('/texts', authenticateJWT, authorize(['seller']), upload.single('file'), async (req, res) => {
  try {
    const jsonArray = await csvtojson().fromString(req.file.buffer.toString());
    const content = JSON.stringify(jsonArray);
    const text = { content, createdBy: req.user.id };
    const sql = 'INSERT INTO texts SET ?';
    db.query(sql, text, (err, result) => {
      if (err) throw err;
      res.send('Text created!');
    });
  } catch (error) {
    console.error('Failed to process CSV file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/texts', authenticateJWT, (req, res) => {
  const sql = 'SELECT texts.id, texts.content, users.username AS createdBy FROM texts JOIN users ON texts.createdBy = users.id';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.put('/texts/:id', authenticateJWT, authorize(['seller']), (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const sql = 'SELECT * FROM texts WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const text = results[0];
      if (text.createdBy !== req.user.id) {
        return res.sendStatus(403); // Forbidden
      }
      const updateSql = 'UPDATE texts SET content = ? WHERE id = ?';
      db.query(updateSql, [content, id], (err, result) => {
        if (err) throw err;
        res.send('Text updated!');
      });
    } else {
      res.sendStatus(404); // Not Found
    }
  });
});

app.delete('/texts/:id', authenticateJWT, authorize(['seller']), (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM texts WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const text = results[0];
      if (text.createdBy !== req.user.id) {
        return res.sendStatus(403); // Forbidden
      }
      const deleteSql = 'DELETE FROM texts WHERE id = ?';
      db.query(deleteSql, [id], (err, result) => {
        if (err) throw err;
        res.send('Text deleted!');
      });
    } else {
      res.sendStatus(404); // Not Found
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
