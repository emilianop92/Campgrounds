const mongoose = require('mongoose')

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

// Allows the use of the schema when called by another file
module.exports = mongoose.model('Campground', campgroundSchema)