var express = require('express');
var app = express();
var port = process.env.PORT || 8060;
var options = {root: __dirname + '/views/'};

//routes for API
var router = express.Router();
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
})

router.get('/home', function(req, res) {
	res.sendFile('index.html', options);
}) 

//register routes
app.use('/', router);
//start server
app.listen(port);
console.log('Magic happens on port ' + port);