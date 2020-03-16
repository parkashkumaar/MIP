# MIP

TESTING

cd MIP_PROJECT

npm install

Signup api

POST:localhost:3000/register
{
	"name":"Parkash",
	"email":"parkash@gmail.com",
	"password":"1234567", 
	"password2":"1234567"
}

POST: localhost:3000/login
{
	"email":"parkash@gmail.com",
	"password":"1234567"
}

Individual user can create job post.

POST: localhost:3000/createpost


With Authorization Header
{
	"title":"POst 6", 
	"description":"Post descirption 6"
}

Individual user can view all job post created by him/her.


GET: localhost:3000/viewpost
With Authorization Header


Individual user can view single job post created by him/her.


GET: localhost:3000/viewpost/5e6e74d0aa5add1a5850b28c
With Authorization Header

Individual user can update single job post created by him/her.


PUT: localhost:3000/post/5e6f82c0f62f590af0c96f16
With Authorization Header
{
  "description":"udpate desc v1"
}

Individual user can delete single job post created by him/her


DELETE: localhost:3000/post/5e6e6efb3a771715484aedde
With Authorization Header

Individual user can delete all job post created by him/her


With Authorization Header
DELETE: localhost:3000/post/remove






