const express = require('express')
const path = require('path')
const app = express()
const ejsMate = require('ejs-mate')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const AsyncWrapper = require('./utils/AsyncWrapper')
const ExpressError = require('./utils/ExpressError')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

// Connect to MongoDB
const mongoose = require('mongoose')
const { request } = require('http')
mongoose.connect('mongodb://localhost:27017/campgrounds')
    .then(() => {
        console.log("Connection Open")
    })
    .catch(() => {
        console.log("ERROR CONNECTING MONGOOSE")
        console.log(err)
    })

// Configure Express
app.set('view engine', 'ejs')                           // selects ejs as the templating engine
app.engine('ejs', ejsMate)                              // specifies that ejsMate should For EJS files
app.set('views', path.join(__dirname, 'views'))         // looks for html/ejs files in the views directory
app.use(express.urlencoded({ extended: true }))         // allows for rich objects and arrays to be encoded into the URL-encoded format
app.use(methodOverride('_method'))                      // allows for put/patch/delete requests
app.use(express.static(path.join(__dirname, 'public'))) // serves static files

// Creating sessions and cookies
const sessionConfig = {
    secret: 'password',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        HttpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use( (req, res, next) => {
    res.locals.success = req.flash('success')   // if a request has a flash "success" label, it will be passed to the response
    res.locals.error = req.flash('error')       // if a request has a flash "error" label, it will be passed to the response
    next()
})


// ROUTER
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