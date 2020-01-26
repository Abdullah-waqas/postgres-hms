import jwt, { decode } from 'jsonwebtoken';
import db from '../db';
const fs = require('fs');
const publicKey = fs.readFileSync('./public.key', 'utf8');

const Auth = {
    /**
     * Verify Token
     * @param {object} req 
     * @param {object} res 
     * @param {object} next
     * @returns {object|void} response object 
     */
    async verifyToken(req, res, next) {
        // console.log(req.headers)
        const token = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return res.status(400).send({ 'message': 'Token is not provided' });
        }
        try {
            console.log('TOKEN++++++', token);
            const decoded = await jwt.verify(token, 'My test secret file');
            console.log(decoded);
            const text = 'SELECT * FROM doctors WHERE id = $1';
            const { rows } = await db.query(text, [decoded.userId]);
            console.log(rows);
            if (!rows[0]) {
                return res.status(400).send({ 'message': 'The token you provided is invalid' });
            }
            req.user = { id: decoded.userId };
            // console.log('Validate...//////')
            next();
        } catch (error) {
            console.log('ERROR___');
            return res.status(400).send(error);
        }
    }
}

export default Auth;