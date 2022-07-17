const express = require('express')
const path = require('path')
const app = express()
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

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

// Configure Express
app.engine('ejs', ejsMate)  // For EJS files, use the ejsMate engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Express Middleware
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

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
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`campgrounds/${campground._id}`)
})

// Show single Campground
app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/showSingle', {campground})
})

// Edit Campground info
app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`${id}`)
})

// Delete Campgrounds
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.send(`${id} Deleted`)
})


app.listen(3000)