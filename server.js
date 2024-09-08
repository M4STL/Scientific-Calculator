const express = require('express');
//const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Set up middleware
//app.use(bodyParser.json());
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public'))); // Serve static files from the 'public' directory

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'scientificcaldb',
    port: 3307 
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Create history table if it does not exist
db.query(`CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calculation VARCHAR(255) NOT NULL,
    result VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err, result) => {
    if (err) throw err;
    console.log('History table created or already exists');
});

// Endpoint to add history
app.post('/addHistory', (req, res) => {
    const { calculation, result } = req.body;
   
    const sql = 'INSERT INTO history (calculation, result) VALUES (?, ?)';
    db.query(sql, [calculation, result], (err, result) => {
        if (err) throw err;
        res.send('History added');
    });
});

// Endpoint to get history
app.get('/getHistory', (req, res) => {
    db.query('SELECT * FROM history ORDER BY timestamp DESC', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
      
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
