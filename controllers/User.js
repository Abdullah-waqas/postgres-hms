import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import Helper from './Helper';
import { signupSchema } from '../validation-schema/auth-schema';

const User = {
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} reflection object 
     */
    async create(req, res) {
        console.log(req.body)
        const { error } = signupSchema(req.body);

        if (error) return res.status(400).send({ 'message': error.details[0].message });

        const hashPassword = Helper.hashPassword(req.body.password);
        let createQuery = '';
        if(req.body.type === 'doctor') {
            createQuery = `INSERT INTO
            doctors(id, email, password, created_date, modified_date, first_name, last_name, address, cell_no)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning *`;
        } else if (req.body.type === 'patient') {
            createQuery = `INSERT INTO
            patients(id, email, password, created_date, modified_date, first_name, last_name, address, cell_no)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning *`;
        }
        
        const values = [
            uuidv4(),
            req.body.email,
            hashPassword,
            moment(new Date()),
            moment(new Date()),
            req.body.first_name,
            req.body.last_name,
            req.body.address,
            req.body.cell_no,
        ];

        try {
            const { rows } = await db.query(createQuery, values);
            const token = Helper.generateToken(rows[0].id);
            console.log('token________', token)
            return res.status(201).send({ token });
        } catch (error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
            }
            return res.status(400).send(error);
        }
    },
    /**
     * Login
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object 
     */
    async login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ 'message': 'Some values are missing' });
        }
        if (!Helper.isValidEmail(req.body.email)) {
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
        }
        const text = 'SELECT * FROM users WHERE email = $1';
        try {
            const { rows } = await db.query(text, [req.body.email]);
            if (!rows[0]) {
                return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
            }
            if (!Helper.comparePassword(rows[0].password, req.body.password)) {
                return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
            }
            const token = Helper.generateToken(rows[0].id);
            return res.status(200).send({ token });
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    /**
     * Delete A User
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return status code 204 
     */
    async delete(req, res) {
        const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
        try {
            const { rows } = await db.query(deleteQuery, [req.user.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'user not found' });
            }
            return res.status(204).send({ 'message': 'deleted' });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export default User;