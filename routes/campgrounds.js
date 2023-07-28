const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError')
const passport = require('passport');
const { campgroundSchema, reviewSchema } = require('../schemas.js')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground))

module.exports = router;