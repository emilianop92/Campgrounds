const mongoose = require('mongoose')

const campgroundSchema = new mongoose.Schema({
    title: String,
    location: String,
    image: String,
    description: String,
    price: Number
})

// Allows the use of the schema when called by another file
module.exports = mongoose.model('Campground', campgroundSchema)