require('dotenv').config();

const fs = require('fs');
const express = require('express')
const mysql = require('mysql2')
const myconn = require('express-myconnection')

const userRoutes = require('./routes/userRoutes');

const app = express()
app.set('port', process.env.PORT || 9000)

const dbOptions = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    ssl: {
        rejectUnauthorized: false
    }
}

// middlewares -------------------------------------
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())

// routes -------------------------------------------
app.get('/', (req, res)=>{
    res.send('Welcome to my API')
})
app.use('/api/users', userRoutes);

// server running -----------------------------------
app.listen(app.get('port'), ()=>{
    console.log('server running on port', app.get('port'))
})
