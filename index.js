import 'babel-polyfill';
import Auth from './middleware/Auth';
import User from './controllers/User';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// Signup
app.post('/signup', User.create)

// Login
app.post('/login', Auth.verifyToken, User.login)

// Get Users
app.get('/users', Auth.verifyToken, db.getUsers)
// app.get('/users/:id', Auth.verifyToken, db.getUserById)
// app.post('/users', Auth.verifyToken, db.createUser)
// app.put('/users/:id', Auth.verifyToken, db.updateUser)
// app.delete('/users/:id', Auth.verifyToken, db.deleteUser)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
