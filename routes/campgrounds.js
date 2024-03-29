const express = require('express')
const router = express.Router()
const AsyncWrapper = require('../utils/AsyncWrapper')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')


// Joi validation
const {campgroundSchema} = require('../joiSchemas')
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Show all Campgrounds
router.get('/', AsyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

// Make a Campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, AsyncWrapper(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    // if everything goes well, add a successful flash with the message below
    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Show single Campground
router.get('/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    await campground.populate('reviews')
    if (!campground){
        req.flash('error', 'Cannot find that campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/showSingle', { campground })
}))

// Edit Campground info
router.get('/:id/edit', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, AsyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${id}`)
}))

// Delete Campgrounds
router.delete('/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds')
}))

module.exports = router