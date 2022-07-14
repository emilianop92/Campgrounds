const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')

const Campground = require('./models/campground')

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
app.set('./views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))

// Home Page
app.get('/', (req, res) => {
    res.render('homepage')
})

// Show all Campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

// Make a Campground
app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    res.send(req.body)
})

// Show single Campground
app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/showSingle', {campground})
})




app.listen(3000)