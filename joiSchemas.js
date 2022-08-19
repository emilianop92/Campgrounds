// Joi validation of schemas
const Joi = require('joi')

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0)
    }).required()
})

const reviewSchema = Joi.object({
    // Review submit form gives back a single object with a rating (review[rating]) and body (review[body])
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})


module.exports = {
    campgroundSchema,
    reviewSchema
}