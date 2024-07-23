const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manikandasamy@10',
  database: 'user_managementss'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
  db.query(query, [username, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('User registered successfully');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT password_hash FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(400).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, results[0].password_hash);
    if (isMatch) {
      res.send('Login successful');
    } else {
      res.status(400).send('Invalid credentials');
    }
  });
});

app.listen(port, () => {
  console.log('Server started on http://localhost:${port}');
});