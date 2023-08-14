if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');
// const helmet = require('helmet');

const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const usersRoutes = require('./routes/user')
const campgroundRoutes = require('./routes/campgrounds.js')
const reviewRoutes = require('./routes/reviews.js')
const MongoStore = require('connect-mongo');

// npm i ejs-mate
// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

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
app.use(express.static(path.join(__dirname, 'public')));
// app.use(helmet({ contentSecurityPolicy: false }));

const secret = process.end.SECRET || 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // lazy update
    crypto: {
        secret
    }
})

store.on('error', function (e) {
    console.log('session store ERROR');
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser()); // 
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success'); // take whatever under the name success and save it in locals.success
    res.locals.error = req.flash('error');
    next()
})

app.use('/', usersRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);



app.get('/', (req, res) => {
    res.render('home');
})

// app.get('/makecampground', catchAsync(async (req, res) => {
//     const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' })
//     await camp.save();
//     res.send(camp)
// }))

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'denizhan@123.com', username: 'denden' })
    const newUser = await User.register(user, 'chicken') //takes entire model and takes password 
    res.send(newUser)
})

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


