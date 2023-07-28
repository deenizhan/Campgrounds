module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    } next()
}

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER', req.user) prints user info thanks to passport
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed-in!')
        return res.redirect('/login');
    }
    next();
}