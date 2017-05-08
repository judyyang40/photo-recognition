var express = require('express');
var app = express();
var port = process.env.PORT || 8060;
var options = {root: __dirname + '/views/'};

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

//routes for API
var router = express.Router();
router.get('/', function(req, res) {
	res.sendFile('index.html', options);
})

router.get('/home', function(req, res) {
	res.sendFile('home.html', options);
 }) 

router.post('/uploadIDPhoto', function(req, res){
	//adding file upload implementation
	
	var user_name = req.body.userName;
	res.send('Successfully uploaded ' + user_name);
})

//register routes
 app.use('/', router);
//start server
var server = app.listen(port, function() {
	console.log('Magic happens on port ' + port); 
});
  