const {PORT} = require('./config');
const {SECRET_KEY} = require('./config');
const {EXPIRE_TIME} = require('./config')
const {REACT_URL} = require('./config')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('./utils/db');

const app = express();

//middleware for json body
app.use(bodyParser.json());

app.use(cors({
    origin: REACT_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));

app.post('/login', (req, res) =>{
    const {username, password} = req.body;
    db.userExists(username)
        .then(user =>{
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) return res.status(400).json({message: 'Invalid cedential'});
            const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: EXPIRE_TIME});
            return res.status(200).json({token});
        })
        .catch(err=>{
            return res.status(400).json({message:"invalid credential"});
        })
})
app.post('/validate', (req, res) =>{
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({message:'Unauthorized'});

    jwt.verify(token, SECRET_KEY, (err, decoded) =>{
        if (err) return res.status(401).json({message:err});
        db.getUserById(decoded.id)
            .then(username =>{
                return res.status(200).json({message: 'OK', credential: username})
            })
            .catch(err =>{
                return res.status(400).json({message: err});
            })
        
    })
})
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})