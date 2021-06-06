// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for matches
const Match = require('../models/match')
// pull in Mongoose model for profiles
const Profile = require('../models/profile')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
// const requireOwnership = customErrors.requireOwnership

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
// POST /profiles/:id/match
router.post('/profiles/:id/match/create', requireToken, (req, res, next) => {
  // set up request body POJO
  req.body.match = {
    // set profileOne.owner to req users profileId and profileOne.accepted to true
    profileOne: {
      owner: req.user.profileId,
      accepted: true
    },
    profileTwo: {
      // set profileTwo.owner to req params id and profileOne.accepted to false
      owner: req.params.id,
      accepted: false
    }
  }

  // create a match using request body
  Match.create(req.body.match)
    // respond to succesful `create` with status 201 and JSON of new "match"
    .then(match => {
      res.status(201).json({ match: match.toObject() })
    })
    // if an error occurs, pass to error handler
    .catch(next)
})

// UPDATE (2nd user match)
// PATCH /profiles/:id/match
router.patch('/profiles/:id/match', requireToken, (req, res, next) => {
  // find the match with profileOne id = req params id
  Match.find({ 'profileOne.owner': req.params.id }, { 'profileTwo.owner': req.user.profileId })
    .populate('profileOne.owner')
    .populate('profileTwo.owner')
    // if found update profileTwo.accepted = true and isMatch = true
    .then(matches => {
      // note that matches is an array of length 1
      const match = matches[0]
      // set profileTwo.accepted to true
      match.profileTwo.accepted = true
      // set isMatch to true
      match.isMatch = true
      // pass the result of Mongoose's `.update` to the next `.then`
      return match.save()
    })
    // if that succeeded, return 200 and JSON of the `match`
    // ***** what's the best return code here???? *******
    .then(match => res.status(200).json({ match: match.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(() => {
      // set up request body POJO
      req.body.match = {
        // set profileOne.owner to req users profileId and profileOne.accepted to true
        profileOne: {
          owner: req.user.profileId,
          accepted: true
        },
        profileTwo: {
          // set profileTwo.owner to req params id and profileOne.accepted to false
          owner: req.params.id,
          accepted: false
        }
      }

      // create a match using request body
      Match.create(req.body.match)
        // respond to succesful `create` with status 201 and JSON of new "match"
        .then(match => {
          // find profile by profileOne.owner
          Profile.findById(match.profileOne.owner)
            .then(handle404)
            .then(profile => {
              const profileArr = profile.sentMatches
              profileArr.push(match.profileTwo.owner)
              profile.sentMatches = profileArr
              profile.save()
            })
          res.status(201).json({ match: match.toObject() })
        })
        // if an error occurs, pass to error handler
        .catch(next)
    })
})

// INDEX (isMatch is true)
// GET /profile/matches
router.get('/profile/matches', requireToken, (req, res, next) => {
  // set `profileId` variable to req user profileId
  Match.find({ $and: [
    { isMatch: true },
    { $or: [
      { 'profileOne.owner': req.user.profileId },
      { 'profileTwo.owner': req.user.profileId }
    ] }
  ] })
    .populate('profileOne.owner')
    .populate('profileTwo.owner')
    .then(matches => {
    // `matches` will be an array of Mongoose documents
    // we want to convert each one to a POJO, so we use `.map` to
    // apply `.toObject` to each one
      return matches.map(match => match.toObject())
    })
    // respond with status 200 and JSON of the matches
    .then(matches => res.status(200).json({ matches: matches }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /profile/matches/:id
// show match not working with requireToken
router.get('/profile/matches/:id', requireToken, (req, res, next) => {
  // req params id will be based on the `:id` in the route
  Match.findById(req.params.id)
    // populate profileOne owner
    .populate('profileOne.owner')
    // populate profileTwo owner
    .populate('profileTwo.owner')
    // handle 404 if not found
    .then(handle404)
    // if `findById` succeeds, respond with 200 ok and `match` JSON
    .then(match => {
      // if it is a match
      if (match.isMatch) {
        res.status(200).json({ match: match.toObject() })
      } else {
        // throw error if not a match
        throw customErrors.DocumentNotFoundError
      }
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

// UPDATE (isMatch = false)
// PATCH /profile/match/:id/update
router.patch('/profile/matches/:id/update', requireToken, (req, res, next) => {
  // req params id will be based on the `:id` in the route
  Match.findById(req.params.id)
    // handle 404 if not found
    .then(handle404)
    // if found
    .then(match => {
      // turn isMatch to false and save match
      match.isMatch = true
      // pass the result of Mongoose's `.update` to the next `.then`
      return match.save()
    })
    // if that succeeded, return 204 and no content
    .then(match => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// // DESTROY
// // DELETE /profile/matches/:id/destroy
// // unable to include requireToken passport for user.profileId
// // unable to verify ownership with custom error logic
// router.delete('/matches/:id', requireToken, (req, res, next) => {
//   // req params id will be based on the `:id` in the route
//   Match.findById(req.params.id)
//     // handle 404 if not found
//     .then(handle404)
//     // if found
//     .then(match => {
//       console.log('this is the params id', req.params.id)
//       console.log('this is the match', match)
//       console.log('this is req.user', req.user)
//       console.log('this is match.profileOne', match.profileOne)
//       console.log('this is match.profileTwo', match.profileTwo)
//       // ensure user profile is owner of profileOne or profileTwo
//       // (profileOne.owner === req.user.profileId)
//       if (match.profileOne.owner !== req.user.profileId) {
//         // throw OwnershipError if not
//         throw customErrors.OwnershipError
//       } else if (match.profileTwo.owner !== req.user.profileId) {
//         // throw OwnershipError if not
//         throw customErrors.OwnershipError
//       } else {
//         // delete `match` if error didn't throw
//         match.delete()
//       }
//     })
//     // send back 204 no content if the deletion succeeded
//     .then(() => res.sendStatus(204))
//     // if error occurs, pass it to the handler
//     .catch(next)
// })

// export router
module.exports = router
