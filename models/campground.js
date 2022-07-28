const mongoose = require('mongoose')

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
        required: true}
})

// Allows the use of the schema when called by another file
module.exports = mongoose.model('Campground', campgroundSchema)