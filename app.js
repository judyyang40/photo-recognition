var express = require('express');
var app = express();
var port = process.env.PORT || 8060;
var options = {root: __dirname + '/views/'};
//parse input text
var bodyParser = require("body-parser");
var session = require('express-session');

app.set('trust proxy', 1);
app.use(session({
	secret: 'photo',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false}
}))
app.use(bodyParser.urlencoded({extended:false}));

//file uploader
var fileUpload = require('express-fileupload');
app.use(fileUpload());

var fs = require('fs');

//import photoManager module
var photoManager = require('./routes/photoManager.js');
var face = require('./routes/face.js');

//routes for API
var router = express.Router();

router.get('/', function(req, res) {
	res.sendFile('index.html', options);
})

router.post('/submitInfo', function(req, res) {
	req.session.user = req.body.username;
	photoManager.getUserIdPhoto(req.body.username, sendData);
	function sendData(data) {
		res.json({imgsrc: data});
	}
})

router.get('/getPics', function(req, res) {
	photoManager.getPics(req.session['user'], sendPicsBack);
	function sendPicsBack(data) {
		face.getFaceId(data.pic1).then(function(result){
			console.log("result for pic2");
			console.log(result);
			face.getFaceId(data.pic2).then(function(result2){
				console.log(result2);
				face.compareFace("id1", "id2").then(function(result){
					//get result of comparison
					//data.match = '';
					//res.json(data);
				})
			}, function(err) {
				console.log(err);
			});
		}, function(err) {
			console.log(err);
		});
		res.json(data);
	}
})
/*router.post('/picUpload', function(req, res) {
	console.log(req);
	//photoManager.addToS3(req.body.file);
})*/


router.post('/uploadIDPhoto', function(req, res){
	//get user_name input
	//user_name = req.body.userName;
	//check for user_name in DyanomoDB
	/*var hasName = photoManager.getUserIdPhoto(user_name);
	if (hasName){
		res.send('User Name already exist!');
	}*/	
	//get image upload
	console.log(req);
	image = req.files.upload;
	
	//add file to S3, then S3 URL to DyanamoDB
	var photo_url = photoManager.addToS3(image);
	
	
	//need to pass in string format???????????????
	//photoManager.addToDynamoDB(photo_url, user_name);
	
	res.send('Successfully uploaded ');
})

router.get('/test', function(req, res) {
	res.sendFile('index2.html', options);
})

//register routes
app.use('/', router);
app.use(express.static('public'));
//start server
var server = app.listen(port, function() {
	console.log('Magic happens on port ' + port); 
});
  