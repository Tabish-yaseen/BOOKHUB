const mongoose = require('mongoose');
const Schema=mongoose.Schema

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  author:{
    type:Schema.Types.ObjectId
  }
});

module.exports = mongoose.model('Genre', genreSchema);