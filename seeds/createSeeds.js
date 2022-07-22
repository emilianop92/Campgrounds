const mongoose = require('mongoose')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

// Module for creating a campground object with a method for saving to mongodb
const Campground = require('../models/campground')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/campgrounds')
    .then(()=>{
        console.log("Connection Open")
    })
    .catch(()=>{
        console.log("ERROR")
        console.log(err)
    })


const randArrayVal = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i =0; i<50; i++) {
        const rand1000 = Math.floor(Math.random()*1000)
        const price = Math.ceil(Math.random()*6)*5
        const c = new Campground({
            title: `${randArrayVal(descriptors)} ${randArrayVal(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            image: 'https://picsum.photos/500/400',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: price
        })
        await c.save()
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})