const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const textRoutes = require('./routes/textRoutes');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/texts', textRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
