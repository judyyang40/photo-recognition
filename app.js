var express = require('express');
var app = express();
var port = process.env.PORT || 8060;
var options = {root: __dirname + '/views/'};


//using AWS SDK and settings
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

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



//Amazon AWS sample code below
//writing items to DynamoDB
var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'MY_TABLE'}});
var key = 'UNIQUE_KEY_ID';
// Write the item to the table
var itemParams = {
    Item: {
        'id': {S: key},
        'data': {S: 'data'}
    },
    ReturnConsumedCapacity: 'TOTAL'
};

table.putItem(itemParams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});

//reading items from DynamoDB
var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'MY_TABLE'}});
var key = 'UNIQUE_KEY_ID';
// Note that the params are different for getItem().
var itemParams = {Key: {'id': {S: key} }};

table.getItem(itemParams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});