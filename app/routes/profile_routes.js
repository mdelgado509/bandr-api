// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for profiles
const Profile = require('../models/profile')

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
// const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// CREATE
// POST /profiles
router.post('/profiles', requireToken, (req, res, next) => {
  // set owner of new profile in request body to be current user
  req.body.profile.owner = req.user.id

  // create a new profile using request body
  Profile.create(req.body.profile)
    // respond to succesful `create` with status 201 and JSON of new "profile"
    .then(profile => {
      res.status(201).json({ profile: profile.toObject() })
    })
    // if an error occurs, pass to error handler
    .catch(next)
})

// DESTROY
// DELETE /profiles/60b67f2ad27b9da0c07e7008
router.delete('/profiles/:id', requireToken, (req, res, next) => {
  // Find by id
  Profile.findById(req.params.id)
    // handle404 if not found
    .then(handle404)
    // if found
    .then(profile => {
      // throw error if current user doesn't own the `profile`
      requireOwnership(req, profile)
      // delete `profile` if error didn't throw
      profile.deleteOne()
    })
    // send back 204 no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if error occurs, pass it to the handler
    .catch(next)
})

// export router
module.exports = router
