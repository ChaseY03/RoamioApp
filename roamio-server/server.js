const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.options('*', cors());
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