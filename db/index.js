import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password: 'admin',
    port: 5432,
})

export default {
    /**
     * DB Query
     * @param {string} text
     * @param {Array} params
     * @returns {object} object
     */
    query(text, params) {
        return new Promise((resolve, reject) => {
            pool.query(text, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }
}
