const mongoose = require('mongoose')

const Schema=mongoose.Schema

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  genres:  [{ 
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  }],
});

module.exports = mongoose.model('Book', bookSchema)