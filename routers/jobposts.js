const express = require("express")
const Post    = require("../models/jobposts")
const User    = require("../models/users");
let middleware = require('../config/auth');
const router  = express.Router();


router.delete('/post/remove',middleware.checkToken,(req,res)=>{
    errors = [];
    Post.deleteMany()
        .then(result=>{
            res.json({
                errors:null,
                success: true,
                message: 'Posts Delete Successfully',
            });
        })
        .catch(err=>{
            errors.push('Error in Delete Post')
            res.json({
                errors:errors,
                success: false,
                message: 'Something went wrong',
            });
        })
})
router.put("/post/:id",middleware.checkToken,(req,res)=>{
    errors = [];
    id = req.params.id;
    createdBy    = req.decoded.user._id;
    let { title, description } = req.body;
    
    if(id.length == 24){
        Post.find({_id:id})
        .then(post=>{
            if(post){
                Post.update({_id:id},{$set: { title: (title == "" || title == undefined) ? post[0].title : title,
                                              description:(description =="" || description==undefined)?post[0].description:description,
                                              createdBy:(createdBy == "" || createdBy == undefined)?post[0].createdBy:createdBy }},
                           {upsert: true})
                    .then(update=>{
                        Post.find({})
                        .then(posts => {
                            res.json({
                                errors:null,
                                success: true,
                                message: 'Post Updated Successfully',
                                posts:posts
                            });
                        }).catch(err => {
                            errors.push({ msg: 'Fetch Posts  Issuse' });
                                res.json({
                                    errors:errors,
                                    success: false,
                                    message: 'Fetch Posts  Issuse!',
                                });
                    });
                    })
                    .catch(err=>{
                        errors.push("Post Does not Updated!")
                        res.json({
                            errors:errors,
                            success: false,
                            message: "Post Found But Not Updated!"
                        }); 
                    })
            }else{
                errors.push("Post Not Found!")
                res.json({
                    errors:errors,
                    success: false,
                    message: "Post Not Found!"
                }); 
            }
        })
        .catch(err=>{
            errors.push("Post Not Found!")
            res.json({
                errors:errors,
                success: false,
                message: "Post Not Found!"
            }); 
        })
    }else{
        errors.push("Please Enter Id")
        res.json({
          errors:errors,
          success: false,
          message: 'Please Enter Id'
        });  
    }
})    
router.delete("/post/:id",middleware.checkToken,(req,res)=>{
    errors = [];
    id = req.params.id;
    if(id.length == 24){
         Post.find({_id:id})
            .then(post=>{
                if(post){
                    Post.remove({_id:id})
                        .then(delsuccess=>{
                            Post.find({})
                            .then(posts => {
                                res.json({
                                    errors:null,
                                    success: true,
                                    message: 'Post Delete Successfully',
                                    posts:posts
                                });
                            }).catch(err => {
                                errors.push({ msg: 'Fetch Posts  Issuse' });
                                    res.json({
                                        errors:errors,
                                        success: false,
                                        message: 'Fetch Posts  Issuse!',
                                    });
                        });
                        })
                        .catch(err=>{
                            errors.push("Post Found But Not Removed!")
                            res.json({
                                errors:errors,
                                success: false,
                                message: "Post Found But Not Removed!"
                            }); 
                        })
                }else{
                    errors.push("Post Not Found!")
                    res.json({
                        errors:errors,
                        success: false,
                        message: "Post Not Found!"
                    }); 
                }
            })
            .catch(err=>{
                errors.push("Post Not Found!")
                res.json({
                    errors:errors,
                    success: false,
                    message: "Post Not Found!"
                }); 
            })
    }else{
      errors.push("Please Enter Id")
      res.json({
        errors:errors,
        success: false,
        message: 'Please Enter Id'
      });
    }
   
})
router.get("/viewpost/:id",middleware.checkToken,(req,res)=>{
    errors = []
    id = req.params.id;
    if(id.length == 24){
    Post.findOne({_id:id})
        .then(posts => {
            res.json({
                errors:null,
                success: true,
                message: 'Post Fetch Successfully',
                posts:posts
            });
        }).catch(err => {
            errors.push({ msg: 'Fetch Posts  Issuse' });
                res.json({
                    errors:errors,
                    success: false,
                    message: 'Fetch Posts  Issuse!',
                });
    });
    }else{
        errors.push({ msg: 'Please Enter Id' });
        res.json({
            errors:errors,
            success: false,
            message: 'Please Enter Id!',
        });
    }
})
router.get("/viewpost",middleware.checkToken,(req,res)=>{
                Post.find({})
                    .then(posts => {
                        res.json({
                            errors:null,
                            success: true,
                            message: 'Post Fetch Successfully',
                            posts:posts
                        });
                    }).catch(err => {
                        errors.push({ msg: 'Fetch Posts  Issuse' });
                            res.json({
                                errors:errors,
                                success: false,
                                message: 'Fetch Posts  Issuse!',
                            });
                });
})
router.post('/createpost',middleware.checkToken, (req, res) => {
    createdBy    = req.decoded.user._id;
    const { title, description } = req.body;
    let errors = [];
  
    if (!title || !description) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
      res.send({
        errors,
        title,
        description,
      });
    } else {
      User.findOne({ _id:createdBy}).then(user => {
          const newPost = new Post({
            title,
            createdBy,
            description
          });
          newPost
                .save()
                .then(post => {
                    Post.find({})
                    .then(posts => {
                        res.json({
                            errors:null,
                            success: true,
                            message: 'Post Created Successfully',
                            posts:posts
                        });
                    }).catch(err => {
                        errors.push({ msg: 'Fetch Posts  Issuse' });
                            res.json({
                                errors:errors,
                                success: false,
                                message: 'Fetch Posts  Issuse!',
                            });
                    });    
                })
                .catch(err => {
                    res.json({
                        errors:err,
                        success: false,
                        message: 'Post not Created!',
                    });
                });
      });
    }
  });
  

module.exports = router