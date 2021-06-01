// import mongoose
const mongoose = require('mongoose')

// define match schema
const matchSchema = new mongoose.Schema({
  // profileOne
  profileOne: {
    // ref to User
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // accepted (boolean)
    accepted: {
      type: Boolean
    }
  },
  // profileTwo
  profileTwo: {
    // ref to User
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // accepted (boolean)
    accepted: {
      type: Boolean
    }
  },
  // isMatch (boolean default false)
  isMatch: {
    type: Boolean,
    default: false
  }
}, { // timestamps
  timestamps: true
})

// export mongoose model from match schema
module.exports = mongoose.model('Match', matchSchema)
