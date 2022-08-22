const express = require('express')
const router = express.Router({mergeParams: true})
const AsyncWrapper = require('../utils/AsyncWrapper')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')


// Joi validation
const {reviewSchema} = require('../joiSchemas')
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// ROUTES
router.post('/', validateReview, AsyncWrapper(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${id}`)
}))

// Delete a review
router.delete('/:reviewID', AsyncWrapper(async (req, res) => {
    const {id, reviewID} = req.params
    // find the campground > pull from campground > pull the review from the reviewID
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}})
    await Review.findByIdAndDelete(req.params.reviewID)
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router