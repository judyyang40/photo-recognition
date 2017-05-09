var express = require('express');
var app = express();
var port = process.env.PORT || 8060;
var options = {root: __dirname + '/views/'};

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');	
// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var BUCKET = 'id-photo';
//import photoManager module
var photoManager = require('./routes/photoManger.s');

//routes for API
var router = express.Router();
router.get('/', function(req, res) {
	res.sendFile('index.html', options);
})

router.get('/home', function(req, res) {
	res.sendFile('home.html', options);
 }) 

router.post('/uploadIDPhoto', function(req, res){
	//get submitted data
	files = req.body.photoUpload;
	user_name = req.body.userName;
	
	//search for user_name in DyanomoDB
	var idPhoto_url = photoManager.searchUser(user_name);
	if (!idPhoto_url){
		res.send('User Name already exist!');
	}	
	
	//add file to S3, then S3 URL to DyanamoDB
	var photo_url = photoManager.addToS3(files);
	photoManager.addToDynamoDB(photo_url, user_name);
	
	res.send('Successfully uploaded ' + user_name);
})

//register routes
app.use('/', router);
//start server
var server = app.listen(port, function() {
	console.log('Magic happens on port ' + port); 
});
  