import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const path = require('path');
const fs = require('fs');
const privateKey = fs.readFileSync('./private.key', 'utf8');
const publicKey = fs.readFileSync('./public.key', 'utf8');

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(id) {
    var signOptions = {
      issuer: 'test software',
      subject: 'hel@gmail.com',
      audience: 'http://abc.com',
      expiresIn: '24h',
      algorithm: 'RS256'
    }
    console.log('ID', id)
    const token = jwt.sign({
      userId: id
    },
    "My test secret file"
      // privateKey,
      // signOptions
    );
    // try {
    //   const decoded = await jwt.verify(token, privateKey);
    //   console.log('Decoded....', decoded)
    // } catch (e) {
    //   console.log(e);
    // }
    // const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    // console.log(token);
    return token;
  }
}

export default Helper;
