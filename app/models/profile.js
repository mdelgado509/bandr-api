// import mongoose
const mongoose = require('mongoose')

// define profile schema
const profileSchema = new mongoose.Schema({
  // owner (ref to User)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // type (Band or Planner) (String OR isABand - boolean?)
  band: {
    type: Boolean,
    required: true
  },
  // title (String)
  title: {
    type: String,
    required: true
  },
  // description (String)
  text: {
    type: String,
    required: true
  }
}, { // timestamps
  timestamps: true
})

// export mongoose model from profile schema
module.exports = mongoose.model('Profile', profileSchema)
