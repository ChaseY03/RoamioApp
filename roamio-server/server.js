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
/*
    db.query('SELECT * FROM `test`', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return;
        }
        console.log('Query results:', results);
        // Close the database connection after querying
        //db.end();
    });
*/
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Server listening to port');
    });
});

let loggedIn = false;

app.post('/login', (req, res) => {
    //console.log("login axios");
    const { email, password } = req.body;
    console.log(email,password)
    // Query the user table for the provided email and password
    const sql = 'SELECT userID FROM user WHERE userEmail = ? AND userPassword = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        // Check if any rows were returned
        if (results.length === 0) {
           // console.log("not found")
            // No user found with the provided credentials
            res.status(200).json({ status: "Fail" , message: 'Invalid email or password' });
        } else {
            // User found with the provided credentials
            //console.log("found")
            loggedIn = true;
            const userID = results[0].userID;
            //console.log("axios login status", loggedIn)
            res.status(200).json({ status: "Success", userID: userID, message: 'Login successful'});
        }
    });
});

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    // Check if the email or password is missing
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    // Check if the user already exists in the database
    const sql = 'SELECT * FROM user WHERE userEmail = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
             res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
             res.status(200).json({ status: "Exists" , message: 'User already exists' });
        }
        // If the user doesn't exist, insert the new user into the database
        const insertSql = 'INSERT INTO user (userEmail, userPassword) VALUES (?, ?)';
        db.query(insertSql, [email, password], (err, results) => {
            if (err) {
                console.error('Error inserting into database:', err);
                 res.status(500).json({ message: 'Internal server error' });
            }

            loggedIn = true;
             //res.status(201).json({ status: "Success" , message: 'User registered successfully' });
            const userID = results.insertId; // Get the userID of the newly inserted user
            res.status(201).json({ status: "Success", userID: userID, message: 'User registered successfully' });
        });
    });
});

app.get('/checkLoginStatus', (req, res) => {
    res.status(200).json({ loggedIn: loggedIn });
   // console.log("checked login status:",loggedIn)
});

app.get('/logout', (req, res) => {

    //res.status(200).json({ loggedIn: loggedIn });
    try {
        // Perform logout logic here
        // For example, clearing any session data, etc.

        // Assuming logout was successful
        loggedIn = false;
        res.json({ loggedOut: true });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
   // console.log("logged out status:",loggedIn)
});


app.post('/savelocation', (req, res) => {
    // Extract route data from the request body
    const { userID, locationName, origin, destination, directions, distance, duration, note } = req.body;
    // Insert the route data into the database
    db.query('INSERT INTO usersavedlocation (savedlocationUserID, savedlocationName, savedlocationOrigin, savedlocationDestination, savedlocationDirections, savedlocationDistance, savedlocationDuration, savedlocationNote) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [userID, locationName, origin.toString(), destination.toString(), JSON.stringify(directions), distance, duration, note], (error, results) => {
        if (error) {
            console.error('Error saving route:', error);
            res.status(500).json({ error: 'Failed to save route' });
        } else {
            res.status(200).json({ message: 'Route saved successfully' });
            console.log("Saved location to user profile")
        }
    });

});

app.get('/savedlocations', async (req, res) => {
    const { userID } = req.query;

    try {
        //console.log("fetching saved locations for user with ID:", userID);
        db.query('SELECT * FROM usersavedlocation WHERE savedlocationUserID = ?', [userID], async (error, results) => {
            if (error) {
                console.error('Error loading locations:', error);
                res.status(500).json({ error: 'Failed' });
            } else {
                //console.log("Loaded saved locations");
                const locations = results.map(row => {
                    const directions = JSON.parse(row.savedlocationDirections);
                    return {
                        savedlocationID: row.savedlocationID,
                        savedlocationUserID: row.savedlocationUserID,
                        savedlocationName: row.savedlocationName,
                        savedlocationOrigin: row.savedlocationOrigin,
                        savedlocationDestination: row.savedlocationDestination,
                        savedlocationDirections: row.savedlocationDirections,
                        savedlocationDistance: row.savedlocationDistance,
                        savedlocationDuration: row.savedlocationDuration,
                        savedlocationNote: row.savedlocationNote,
                    };
                });
                //console.log("locations:", locations);
                res.status(200).json({ message: 'Success', savedLocations: locations });
            }
        });
    } catch (error) {
        console.error('Error fetching saved locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


