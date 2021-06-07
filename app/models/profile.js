// import mongoose
const mongoose = require('mongoose')

// define profile schema
const profileSchema = new mongoose.Schema({
  // owner (ref to User)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // type (Band or Planner) (String OR isABand - boolean?)
  type: {
    type: String,
    enum: ['band', 'planner'],
    required: true
  },
  // title (String)
  title: {
    type: String,
    required: true
  },
  // text (String)
  text: {
    type: String,
    required: true
  },
  sentMatches: {
    type: Array,
    default: []
  },
  acceptedMatches: {
    type: Array,
    default: []
  }
}, { // timestamps
  timestamps: true
})

// export mongoose model from profile schema
module.exports = mongoose.model('Profile', profileSchema)
