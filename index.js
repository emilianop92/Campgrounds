const express = require('express')
const path = require('path')
const app = express()
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Joi = require('joi')

const AsyncWrapper = require('./utils/AsyncWrapper')
const ExpressError = require('./utils/ExpressError')

const Campground = require('./models/campground')

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

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0)
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Home Page
app.get('/', (req, res) => {
    res.render('homepage')
})

// Show all Campgrounds
app.get('/campgrounds', AsyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

// Make a Campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, AsyncWrapper(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`campgrounds/${campground._id}`)
}))

// Show single Campground
app.get('/campgrounds/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/showSingle', { campground })
}))

// Edit Campground info
app.get('/campgrounds/:id/edit', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, AsyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`${id}`)
}))

// Delete Campgrounds
app.delete('/campgrounds/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.send(`${id} Deleted`)
}))


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