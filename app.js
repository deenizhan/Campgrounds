const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds.js')
const reviews = require('./routes/reviews.js')

// npm i ejs-mate
const ejsMate = require('ejs-mate')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', err => {
    console.log(err);
})
db.once('open', () => {
    console.log('Database Connected!!');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
})

// app.get('/makecampground', catchAsync(async (req, res) => {
//     const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' })
//     await camp.save();
//     res.send(camp)
// }))

app.all('*', (req, res, next) => {
    // res.send('404!!!')
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err })
    // res.send('oh no there is an error!');
})

app.listen(3000, (req, res) => {
    console.log('Serving on port 3000');
})


