// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();
// const app = express();
// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
// // View engine
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');
// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));
// // User model
// const UserSchema = new mongoose.Schema({
//     username: String,
//     password: String
// });
// const User = mongoose.model('User', UserSchema);
// // Routes
// app.get('/login', (req, res) => {
//     res.render('login');
// });
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (user && bcrypt.compareSync(password, user.password)) {
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ success: true, token });
//     } else {
//         res.json({ success: false, message: 'Invalid credentials' });
//     }
// });
// app.get('/signup', (req, res) => {
//     res.render('signup');
// });
// app.post('/signup', async (req, res) => {
//     const { username, password } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     const newUser = new User({
//         username,
//         password: hashedPassword
//     });
//     await newUser.save();
//     res.json({ success: true, message: 'User created successfully' });
// });
// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
// });