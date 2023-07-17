const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;

db.on('error', err => {
    console.log(err);
})
db.once('open', () => {
    console.log('Database Connected!!');
})


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({}); // deletes everything
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collections/483251',
            description: 'Lorem ipsum dolor sit amet. Aut iusto commodi ea facilis consectetur et officia distinctio qui quia aperiam sed animi maiores eos molestiae quis et ipsam sint. Est enim amet ut suscipit impedit ea voluptas doloremque non dolorem dolore et molestiae blanditiis.',
            price: price
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})  