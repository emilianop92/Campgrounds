const express = require('express')
const path = require('path')
const app = express()
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Joi = require('joi')
const {campgroundSchema, reviewSchema} = require('./joiSchemas')

const AsyncWrapper = require('./utils/AsyncWrapper')
const ExpressError = require('./utils/ExpressError')

const Campground = require('./models/campground')
const Review = require('./models/review')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/campgrounds')
    .then(() => {
        console.log("Connection Open")
    })
    .catch(() => {
        console.log("ERROR")
        console.log(err)
    })

// Configure Express
app.engine('ejs', ejsMate)  // For EJS files, use the ejsMate engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// ROUTES
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

// Home Page
app.get('/', (req, res) => {
    res.render('homepage')
})

// Error Handling
app.all('*', (req, res, next) => {   // This only runs if all other redirrects are missed
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong!'
    console.log(err.message)
    res.status(statusCode).render('error', { err })
})


app.listen(3000)