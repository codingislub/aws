// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory user database (replace with real database in production)
const users = {
    'aryan': {
        password: 'Abcd@1234',
        email: 'aryan@example.com',
        otp: null
    }
};


// app.post('/home.html', (req, res) => {
//     const { username, password } = req.body;
    
//     const user = users[username];

//     if (user && user.password === password) {
//         res.json({ success: true, email: user.email });
//     } else {
//         res.json({ success: false });
//     }
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
