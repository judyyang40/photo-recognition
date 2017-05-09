var express = require('express');
var app = express();
var port = process.env.PORT || 8060;
var options = {root: __dirname + '/views/'};
//parse input text
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

//file uploader
var fileUpload = require('express-fileupload');
app.use(fileUpload());

var fs = require('fs');

//import photoManager module
var photoManager = require('./routes/photoManager.js');

//routes for API
var router = express.Router();
router.get('/', function(req, res) {
	res.sendFile('index.html', options);
})

router.get('/home', function(req, res) {
	res.sendFile('home.html', options);
 }) 

router.post('/uploadIDPhoto', function(req, res){
	//get user_name input
	user_name = req.body.userName;
	//check for user_name in DyanomoDB
	var hasName = photoManager.searchUser(user_name);
	if (hasName){
		res.send('User Name already exist!');
	}	
	//get image upload
	image = req.files.upload;
	
	//add file to S3, then S3 URL to DyanamoDB
	var photo_url = photoManager.addToS3(image);
	photoManager.addToDynamoDB(photo_url, user_name);
	
	res.send('Successfully uploaded ' + user_name);
})

//register routes
app.use('/', router);
//start server
var server = app.listen(port, function() {
	console.log('Magic happens on port ' + port); 
});
  