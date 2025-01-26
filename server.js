const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Your MySQL connection
const path = require('path');
const bcrypt = require('bcryptjs'); 
//const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

const app = express();
const port = 4000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the login page (index.html)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the register page (register.html)
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle register form submission
app.post('/register', (req, res) => {
    const { firstname, lastname, username, password, mobile_no, email } = req.body;

    // Hash the password before storing
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send('Error hashing password');
            return;
        }

        const query = 'INSERT INTO users (firstname, lastname, username, password, mobile_no, email) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(query, [firstname, lastname, username, hashedPassword, mobile_no, email], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(409).send('Username or email already exists');
                } else {
                    res.status(500).send('Error: ' + err.message);
                }
                return;
            }
            res.send('Registration successful!');
        });
    });
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);  // Log the error
            res.status(500).send('Server Error');  // Send an error response
            return;
        }

        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                res.status(500).send('Error comparing passwords');
                return;
            }

            if (!isMatch) {
                res.status(401).send('Invalid credentials');
                return;
            }

            res.send('Login successful');
        });
    });
});
//         // Check password here, assuming you use bcrypt or another hashing method
//         if (user.password === password) {
//             res.send('Login successful');
//         } else {
//             res.status(401).send('Invalid credentials');
//         }
//     });
// });

    
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
