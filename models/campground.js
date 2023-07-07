const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    url: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);