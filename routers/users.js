const express = require("express")
const User    = require("../models/users")
const bcrypt  = require("bcryptjs")
const jwt     = require('jsonwebtoken')
const keys    = require("../config/keys")
const router  = express.Router();

router.post('/login',(req,res)=>{
    const { email, password } = req.body;
    let errors = [];
    if (!email || !password) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
      }
      if (errors.length > 0) {
        res.json({
          errors:errors,
          success: false,
          message: errors,
         });  
      } else {
        User.findOne({ email: email }).then(user => {
          if (user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    let token = jwt.sign({user},
                        keys.tokenKey,
                        { expiresIn: '24h' // expires in 24 hours
                        }
                    );
                    res.json({
                        errors:null,
                        success: true,
                        message: 'Authentication successful!',
                        token: token
                    });
                } else {
                    errors.push({ msg: 'Password incorrect' });
                    res.json({
                        errors:true,
                        success: false,
                        message: errors
                    });
                }
              });
          }else{
                    errors.push({ msg: 'Email incorrect' });
                    res.json({
                        errors:true,
                        success: false,
                        message: errors
                    });    
          }
      })
    }   
})
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
      res.send({
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.send( {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                    res.json({
                        errors:false,
                        success: true,
                        message:"User Register SuccessFully"
                    });    
                })
                .catch(err => {
                  res.json({
                    errors:true,
                    success: false,
                    message:"Something Went Wrong"
                });  
                });
            });
          });
        }
      });
    }
  });
  

module.exports = router