const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Trip = require('../models/Trip')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      trips,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    User trips
// @route   GET /trips/user/:userId
router.get('/map', ensureAuth, async(req, res) => {
  /*try{
    const trips = await Trip.find({
      user: req.params.userId,
      status: 'public'
    }).populate('user').lean()
    res.render('trips/map',{
      trips
    })
  }
  catch(error){
    console.error(err)
    return res.render('error/500')
  }*/
  res.render('trips/map')
})
module.exports = router