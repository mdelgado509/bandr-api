// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for profiles
const Profile = require('../models/profile')
// pull in Mongoose model for user
const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX (owner = !user)
// GET /profiles
router.get('/match/:type', requireToken, (req, res, next) => {
  // set `id` variable to req user id
  const type = req.params.type
  const oppositeType = type.toLowerCase() === 'band' ? 'planner' : 'band'
  // find all profiles that aren't the current users profile
  Profile.find({ type: oppositeType })
    // populate owner
    .populate('owner')
    .then(profiles => {
      // `profiles` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return profiles.map(profile => profile.toObject())
    })
    // respond with status 200 and JSON on the profiles
    .then(profiles => res.status(200).json({ profiles: profiles }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX (owner = user)
// GET /profile
router.get('/profile', requireToken, (req, res, next) => {
  // set `id` variable to req user id
  const id = req.user.id
  // find profile that belongs to current user
  Profile.find({ owner: id })
    // populate owner
    .populate('owner')
    .then(profiles => {
      // `profiles` will be an array of Mongoose documents
      // of length one containing the user profile
      return profiles[0]
    })
    // respond with status 200 and JSON on the profiles
    .then(profile => res.status(200).json({ profile: profile }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /profiles/60b685ef66b2ada322933563
router.get('/profiles/:id', requireToken, (req, res, next) => {
  // req params id will be based on the `:id` in the route
  Profile.findById(req.params.id)
    // handle 404 if not found
    .then(handle404)
    // populate owner
    .populate('owner')
    // if `findById` succeeds, respond with 200 ok and `profile` JSON
    .then(profile => res.status(200).json({ profile: profile.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// UPDATE
// PATCH /profile/update
router.patch('/profile/update', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.profile.owner
  // if the client attempts to change the `type` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.profile.type
  // set `id` variable to req user id
  const id = req.user.id
  // find current users profile
  Profile.find({ owner: id })
    .then(profiles => {
      // note profile is an array of length 1
      const profile = profiles[0]
      // pass the result of Mongoose's `.update` to the next `.then`
      return profile.update(req.body.profile)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /profiles
router.post('/profile/create', requireToken, (req, res, next) => {
  // set owner of new profile in request body to be current user
  req.body.profile.owner = req.user.id

  // create a new profile using request body
  Profile.create(req.body.profile)
    // respond to succesful `create` with status 201 and JSON of new "profile"
    .then(profile => {
      // update the user model with the profile id
      User.update({ _id: profile.owner }, {
        profileId: profile._id
      })
        .then(() => console.log('success'))
        .catch(() => console.log('fail'))
      res.status(201).json({ profile: profile.toObject() })
    })
    // if an error occurs, pass to error handler
    .catch(next)
})

// DESTROY
// DELETE /profile/delete
router.delete('/profile/destroy', requireToken, (req, res, next) => {
  // Find by id
  Profile.find({ owner: req.user.id })
    // if found
    .then(profiles => {
      // returns array of length 1 containing user profile
      const profile = profiles[0]
      // throw error if current user doesn't own the `profile`
      requireOwnership(req, profile)
      // update the user model with the profile id
      User.update({ _id: profile.owner }, {
        profileId: null
      })
        .then(() => console.log('success'))
        .catch(() => console.log('fail'))
      // delete `profile` if error didn't throw
      profile.delete()
      // update user ***
    })
    // send back 204 no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if error occurs, pass it to the handler
    .catch(next)
})

// export router
module.exports = router
