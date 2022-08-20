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

// Validation Functions
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
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

//#region CAMPGROUND ROUTES
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
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Show single Campground
app.get('/campgrounds/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    await campground.populate('reviews')
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
    res.redirect(`/campgrounds/${id}`)
}))

// Delete Campgrounds
app.delete('/campgrounds/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))
//#endregion



//#region REVIEW ROUTES
// Create a review
app.post('/campgrounds/:id/reviews', validateReview, AsyncWrapper(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${id}`)
}))

// Delete a review
app.delete('/campgrounds/:id/reviews/:reviewID', AsyncWrapper(async (req, res) => {
    const {id, reviewID} = req.params
    // find the campground > pull from campground > pull the review from the reviewID
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}})
    await Review.findByIdAndDelete(req.params.reviewID)
    res.redirect(`/campgrounds/${id}`)
}))
//#endregion



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