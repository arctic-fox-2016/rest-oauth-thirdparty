let bcrypt = require('bcryptjs')
let Users = require('../models/user.js')

let hashPassword = function(password, callback){
  bcrypt.genSalt(10, function(err,salt){
    bcrypt.hash(password, salt, function(err, hash){
      callback(hash)
    })
  })
}

let comparePassword = function(password, correctpassword, callback){
  bcrypt.compare(password, correctpassword, function(err, isMatch){
    if(err){
      console.log(err)
    } else {
      callback(null, isMatch)
    }
  })
}

module.exports = {hashPassword, comparePassword}
