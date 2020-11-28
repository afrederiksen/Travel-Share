const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Trip = require('../models/Trip')

// @desc    Show add page
// @route   GET /trips/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('trips/add')
})

// @desc    Process add form
// @route   POST /trips
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Trip.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all trips
// @route   GET /trips
router.get('/', ensureAuth, async (req, res) => {
  try {
    const trips = await Trip.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('trips/index', {
      trips,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})
// @desc    Show single trip
// @route   GET /trips/:id
router.get('/:id', ensureAuth, async (req, res) => {
 try{
   let trip = await Trip.findById(req.params.id)
   .populate('user').lean()

   if(!trip){
     return res.render('error/404')
   }

   res.render('trips/show',{
    trip
   })
 }
 catch(err){
    console.error(err)
    res.render('error/404')
 }
})

// @desc    Show edit page
// @route   GET /trips/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
    }).lean()

    if (!trip) {
      return res.render('error/404')
    }

    if (trip.user != req.user.id) {
      res.redirect('/trips')
    } else {
      res.render('trips/edit', {
        trip,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update trip
// @route   PUT /trips/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try{
    let trip = await Trip.findById(req.params.id).lean()

  if(!trip){
    return res.render('error/404')
  }
  else{
    trip = await Trip.findOneAndUpdate({_id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    })
    res.redirect('/dashboard')
  }
}
catch(err){
  console.error(err)
  return res.render('error/500')
}
}

)

// @desc    Delete trip
// @route   DELETE /trips/:id
router.delete('/:id', ensureAuth, async(req, res) => {
  try{
    await Trip.remove({_id: req.params.id})
    res.redirect('/dashboard')
  }
  catch(err){
    console.error(err)
    return res.render('error/500')
  }
})


// @desc    User trips
// @route   GET /trips/user/:userId
router.get('/user/:userId', ensureAuth, async(req, res) => {
  try{
    const trips = await Trip.find({
      user: req.params.userId,
      status: 'public'
    }).populate('user').lean()

    res.render('trips/index',{
      trips
    })
  }
  catch(error){
    console.error(err)
    return res.render('error/500')
  }
})


module.exports = router