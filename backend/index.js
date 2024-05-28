const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const multer = require('multer');
const csvtojson = require('csvtojson');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'hardeep';
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/marketplace', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());

// Models
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String // 'seller' or 'buyer'
});

const TextSchema = new mongoose.Schema({
  content: mongoose.Schema.Types.Mixed,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', UserSchema);
const Text = mongoose.model('Text', TextSchema);

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

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Register
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });
  await newUser.save();
  res.send('User registered!');
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);
    res.json({ token });
  } else {
    res.send('Username or password incorrect');
  }
});

// Routes for Texts with authorization middleware
app.get('/texts', authenticateJWT, async (req, res) => {
  try {
    const texts = await Text.find().populate('createdBy', 'username');
    res.json(texts);
  } catch (error) {
    console.error('Failed to fetch texts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/texts', authenticateJWT, authorize(['seller']), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', req.file); // Debugging line
    const csvData = req.file.buffer.toString('utf-8');
    const jsonData = await csvtojson().fromString(csvData);

    const newText = new Text({ content: jsonData, createdBy: req.user.id });
    await newText.save();
    res.send('CSV file uploaded and content saved as JSON!');
  } catch (error) {
    console.error('Failed to upload CSV file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/texts/:id', authenticateJWT, authorize(['seller']), async (req, res) => {
  const text = await Text.findById(req.params.id);
  if (!text) return res.sendStatus(404); // Not Found
  if (text.createdBy.toString() !== req.user.id) return res.sendStatus(403); // Forbidden
  text.content = req.body.content;
  await text.save();
  res.send('Text updated!');
});

app.delete('/texts/:id', authenticateJWT, authorize(['seller']), async (req, res) => {
  const text = await Text.findById(req.params.id);
  if (!text) return res.sendStatus(404); // Not Found
  if (text.createdBy.toString() !== req.user.id) return res.sendStatus(403); // Forbidden
  await text.remove();
  res.send('Text deleted!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
