
const Pool = require('pg').Pool;
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import Helper from './controllers/Helper';

import db from './db';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: 'admin',
  port: 5432,
})

const getUsers = async (request, response) => {
  try {
    const results = await db.query('SELECT * FROM users ORDER BY id ASC', []);
    return response.status(200).json(results.rows);
  } catch (error) {
    return response.status(400).send(error);
  }
}


const getUserById = async (request, response) => {
  const id = parseInt(request.params.id)

  try {
    const results = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return response.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).send(error);
  }
}

const createUser = async (request, response) => {
  const { name, email } = request.body;

  try {
    const results = await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    return response.status(201).send(`User added with ID: ${results.insertId}`)
  } catch (error) {
    return res.status(400).send(error);
  }
}

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body;

  try {
    const results = await db.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    return response.status(200).send(`User modified with ID: ${id}`)
  } catch (error) {
    return res.status(400).send(error);
  }
}

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id)

  try {
    const results = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return response.status(200).send(`User deleted with ID: ${id}`)
  } catch (error) {
    return res.status(400).send(error);
  }
}



const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ 'message': 'Some values are missing' });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  const hashPassword = Helper.hashPassword(req.body.password);

  const createQuery = `INSERT INTO
    users(id, email, password, created_date, modified_date)
    VALUES($1, $2, $3, $4, $5)
    returning *`;
  const values = [
    uuidv4(),
    req.body.email,
    hashPassword,
    moment(new Date()),
    moment(new Date())
  ];

  try {
    const { rows } = await db.query(createQuery, values);
    const token = Helper.generateToken(rows[0].id);
    return res.status(201).send({ token });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
    }
    return res.status(400).send(error);
  }
}

const login = async (request, response) => {
  const id = parseInt(request.params.id)

  try {
    const results = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return response.status(200).send(`User deleted with ID: ${id}`)
  } catch (error) {
    return res.status(400).send(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
}