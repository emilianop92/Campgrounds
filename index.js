const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/campgrounds')
    .then(()=>{
        console.log("Connection Open")
    })
    .catch(()=>{
        console.log("ERROR")
        console.log(err)
    })

// Express Middleware
app.set('view engine', 'ejs')
app.use('views', path.join(__dirname, 'views'))

// Home Page
app.get('/', (req, res) => {
    res.render('homepage')
})



app.listen(3000)