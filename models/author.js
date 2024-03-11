const mongoose = require('mongoose');
const Schema=mongoose.Schema

const authorSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type:String,
    required:true
},
books:[{
  type : Schema.Types.ObjectId,
  ref:'Book',
}]

});

module.exports = mongoose.model('Author', authorSchema)
