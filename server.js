const express = require('express');
//const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;


app.use(express.json());

app.use(express.static(path.join(__dirname,'public'))); 


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'scientificcaldb',
    port: 3307 
});


db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});


db.query(`CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calculation VARCHAR(255) NOT NULL,
    result VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err, result) => {
    if (err) throw err;
    console.log('History table created or already exists');
});


app.post('/addHistory', (req, res) => {
    const { calculation, result } = req.body;
   
    const sql = 'INSERT INTO history (calculation, result) VALUES (?, ?)';
    db.query(sql, [calculation, result], (err, result) => {
        if (err) throw err;
        res.send('History added');
    });
});


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
