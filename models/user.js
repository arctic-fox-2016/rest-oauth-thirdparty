let mongoose = require('mongoose')
mongoose.connect('localhost:27017/yuktest')

let userSchema = new mongoose.Schema({
  email: String,
  password: String
})

let Users = mongoose.model('users', userSchema)

module.exports = Users
