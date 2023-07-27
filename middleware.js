module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER', req.user) prints user info thanks to passport
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed-in!')
        return res.redirect('/login');
    }
    next();
}