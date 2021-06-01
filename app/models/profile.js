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
  isABand: {
    type: Boolean,
    required: true
  },
  // title (String)
  title: {
    type: String,
    required: true
  },
  // description (String)
  description: {
    type: String,
    required: true
  }
}, { // timestamps
  timestamps: true
})

// export mongoose model from profile schema
module.exports = mongoose.model('Profile', profileSchema)
