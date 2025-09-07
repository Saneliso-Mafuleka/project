
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Update these credentials as needed
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Andile@21',
  database: 'STEM',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database STEM.');

  // --- GENERAL DASHBOARD RECORDS ENDPOINT ---
  // Create a general table for dashboard records if it doesn't exist
  db.query(`
    CREATE TABLE IF NOT EXISTS dashboard_records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      dashboard VARCHAR(50),
      data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `, (err) => {
    if (err) {
      console.error('Error creating dashboard_records table:', err.message);
    } else {
      console.log('dashboard_records table checked/created successfully.');
    }
  });

  // Ensure users table supports all student fields
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      studentId VARCHAR(100),
      gradeLevel INT,
      mathLevel VARCHAR(100),
      placementTestScore INT
    );
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table checked/created successfully.');
    }
  });

  // Create posts table if not exists
  db.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      content TEXT
    );
  `, (err) => {
    if (err) console.error('Error creating posts table:', err.message);
  });

  // Create products table if not exists
  db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      price DECIMAL(10,2)
    );
  `, (err) => {
    if (err) console.error('Error creating products table:', err.message);
  });

  // Create pdfs table if not exists
  db.query(`
    CREATE TABLE IF NOT EXISTS pdfs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      url VARCHAR(255)
    );
  `, (err) => {
    if (err) console.error('Error creating pdfs table:', err.message);
  });
});

// General endpoint to collect data from any dashboard
app.post('/api/records', (req, res) => {
  const { dashboard, data } = req.body;
  if (!dashboard || !data) {
    return res.status(400).json({ error: 'dashboard and data are required.' });
  }
  db.query(
    'INSERT INTO dashboard_records (dashboard, data) VALUES (?, ?)',
    [dashboard, JSON.stringify(data)],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, dashboard, data });
    }
  );
});

app.get('/', (req, res) => {
  res.send('Backend is running and connected to STEM database.');
});

// Example endpoint to test DB connection
app.get('/api/test', (req, res) => {
  db.query('SHOW TABLES', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- USERS ENDPOINTS ---
// Ensure users table supports all student fields
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    studentId VARCHAR(100),
    gradeLevel INT,
    mathLevel VARCHAR(100),
    placementTestScore INT
  );
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err.message);
  } else {
    console.log('Users table checked/created successfully.');
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// --- POSTS ENDPOINTS ---

// Create posts table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT
  );
`, (err) => {
  if (err) console.error('Error creating posts table:', err.message);
});

// Add a post
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  db.query(
    'INSERT INTO posts (title, content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, content });
    }
  );
});

// Get all posts
app.get('/api/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- PRODUCTS ENDPOINTS ---

// Create products table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2)
  );
`, (err) => {
  if (err) console.error('Error creating products table:', err.message);
});

// Add a product
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  db.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, price });
    }
  );
});

// Get all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- PDFS ENDPOINTS ---

// Create pdfs table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS pdfs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    url VARCHAR(255)
  );
`, (err) => {
  if (err) console.error('Error creating pdfs table:', err.message);
});

// Add a pdf (save title and URL)
app.post('/api/pdfs', (req, res) => {
  const { title, url } = req.body;
  db.query(
    'INSERT INTO pdfs (title, url) VALUES (?, ?)',
    [title, url],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, url });
    }
  );
});

// Get all pdfs
app.get('/api/pdfs', (req, res) => {
  db.query('SELECT * FROM pdfs', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

