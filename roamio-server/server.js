const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const mysqlPROMISE = require('mysql2/promise');
const app = express();
app.use(cors());
//app.options('*', cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'B3i0JZ1R35',
    database: 'roamio',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database ' + err.stack);
        return;
    }
    console.log('Connected to database');

    db.query('SELECT * FROM `test`', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return;
        }
        console.log('Query results:', results);
        // Close the database connection after querying
        db.end();
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Server listening to port');
    });
});

app.get('/', (req, res) => {
    res.send('Hello world');
})
// Define the route inside the database connection callback
app.get('/test', (req, res) => {
    db.query('SELECT * FROM `test`', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Error querying database');
            return;
        }
        res.json(results);
    });
});


app.post('/login', (req, res) => {
    console.log("login axios");
    const { email, password } = req.body;
    // Query the user table for the provided email and password
    const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        // Check if any rows were returned
        if (results.length === 0) {
            // No user found with the provided credentials
            res.status(401).json({ message: 'Invalid email or password' });
        } else {
            // User found with the provided credentials
            res.status(200).json({ message: 'Success' });
        }
    });
});
