const sqlite3 = require('sqlite3').verbose();
const {DATABASE_PATH} = require('../config');
let db = new sqlite3.Database(DATABASE_PATH, (err)=>{
    if (err) console.error('Could not connect to database:', err.message);
    else console.log('Connected to SQLite database');
});

function userExists(username){
    return new Promise((resolve, reject) =>{
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user)=>{
            if (err || !user) reject(err)
            resolve(user)
        })
    })
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT username FROM users WHERE id = ?`, [id], (err, username) =>{
            if(err || !username) reject(err);
            resolve(username);
        })
    })
}

module.exports = {
    db,
    userExists,
    getUserById
};