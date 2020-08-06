const express = require('express')
const router = express.Router()
const passport = require('passport')
// Auth with Google
//Route GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile']}));


// Google Auth Callback
// route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

// @desc Logout user 
// @route /auth/logout
router.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router