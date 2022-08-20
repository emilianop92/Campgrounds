const mongoose = require('mongoose')
const Review = require('./review')

const campgroundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true},
    location: {
        type: String,
        required: true},
    image: {
        type: String,
        required: true},
    description: {
        type: String,
        required: true},
    price: {
        type: Number,
        required: true},
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

// after findOneAndDelete > perform the async function here
campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// Allows the use of the schema when called by another file
module.exports = mongoose.model('Campground', campgroundSchema)