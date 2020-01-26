// db.js
const { Pool } = require('pg');
// const dotenv = require('dotenv');

// dotenv.config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password: 'admin',
    port: 5432,
})

pool.on('connect', () => {
    console.log('connected to the db');
});

/**
 * Create Reflection Table
 */
const createReflectionTable = () => {
    const queryText =
        `CREATE TABLE IF NOT EXISTS
      reflections(
        id UUID PRIMARY KEY,
        success TEXT NOT NULL,
        low_point TEXT NOT NULL,
        take_away TEXT NOT NULL,
        owner_id UUID NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}

/**
 * Create User Table
 */
const createUserTable = () => {
    const queryText =
        `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}

/**
 * Drop Reflection Table
 */
const dropReflectionTable = () => {
    const queryText = 'DROP TABLE IF EXISTS reflections returning *';
    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}
/**
 * Drop User Table
 */
const dropUserTable = () => {
    const queryText = 'DROP TABLE IF EXISTS users returning *';
    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
}
/**
 * Create All Tables
 */
const createAllTables = () => {
    createUserTable();
    createReflectionTable();
}
/**
 * Drop All Tables
 */
const dropAllTables = () => {
    dropUserTable();
    dropReflectionTable();
}

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});


module.exports = {
    createReflectionTable,
    createUserTable,
    createAllTables,
    dropUserTable,
    dropReflectionTable,
    dropAllTables
};

require('make-runnable');



// --CREATE TABLE IF NOT EXISTS
// --      doctors(
// --        id UUID PRIMARY KEY,
// --        first_name VARCHAR(128) NOT NULL,
// --        last_name VARCHAR(128) NOT NULL,
// --        password VARCHAR(128) NOT NULL,
// --        email VARCHAR(128) NOT NULL,
// --        created_date TIMESTAMP,
// --        modified_date TIMESTAMP,
// --        address TEXT NOT null,
// --        cell_no TEXT NOT null
// --      )
      
      
// --CREATE TABLE IF NOT EXISTS
// --      status(
// --        id int primary KEY,
// --        type VARCHAR(128) NOT NULL
// --      )      

// --CREATE TABLE IF NOT EXISTS
// --      patients(
// --        id UUID PRIMARY KEY,
// --        first_name VARCHAR(128) NOT NULL,
// --        last_name VARCHAR(128) NOT NULL,
// --        password VARCHAR(128) NOT NULL,
// --        email VARCHAR(128) NOT NULL,
// --        created_date TIMESTAMP,
// --        modified_date TIMESTAMP,
// --        address TEXT NOT null,
// --        cell_no TEXT NOT null,
// --        status_id int not null,
// --        FOREIGN KEY (status_id) REFERENCES status (id)
// --      )

// --CREATE TABLE IF NOT EXISTS
// --      bill(
// --      	bill_id UUID PRIMARY KEY,
// --        amount float(25) NULL,
// --        patient_id UUID NOT NULL,
// --        FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
// --      )



// --CREATE TABLE IF NOT EXISTS
// --      patient_diagnosis(
// --      	diagnosis_no UUID PRIMARY KEY,
// --        diag_details TEXT NULL,
// --        remarks TEXT NULL,
// --        diag_date TIMESTAMP,
// --        patient_id UUID NOT NULL,
// --        doctor_id UUID NOT NULL,
// --        FOREIGN KEY (patient_id) REFERENCES patients (id),
// --        FOREIGN KEY (doctor_id) REFERENCES doctors (id)
// --      )







