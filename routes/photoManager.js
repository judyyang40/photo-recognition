// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');	


//adding photo to S3 bucket 'id-photo'
module.exports.addToS3 = function (file) {
	// Create S3 service object
	var s3 = new AWS.S3({apiVersion: '2006-03-01'});
	
  	if (!file.data) {
    return alert('Please choose a file to upload first.');
  		}
  	var fileName = file.name;
	console.log(fileName);
  	var uploadParams = {Bucket: 'id-photo', Key: fileName, Body: file.data, ACL:'public-read'};
	
  	s3.upload(uploadParams, function(err, data) {
    	if (err) {
      		return console.log('There was an error uploading your photo: '+ err.message);
    	}
    	console.log('Successfully uploaded photo.'); 
			console.log(data.Location);
		return data.Location;
  	});
}


module.exports.addToDynamoDB = function (file_url, user_name) {
	
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
// Write the item to the table
	data = String(file_url);
	name = String(user_name);
	var itemParams = {
    	Item: {
        	'Name': {S: name},
        	'data': {S: data}
    	},
    	ReturnConsumedCapacity: 'TOTAL'
	};

	table.putItem(itemParams, function(err, data) {
    	if (err) console.log(err, err.stack); // an error occurred
    	else     console.log(data);           // successful response
	});
	
}


module.exports.searchUser = function(user_name) {
	
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
	
	var params = {
		Key: {
			"Name": {S: user_name}
		}	
	}
	table.getItem(params, function(err, data){
		if (err) return false;
		else {
			return true;
		}
	})
	
}



/***
//upload photo file from local disk to S3
var uploadParams = {Bucket: BUCKET, Key: '', Body: ''};
file = process.argv[2];

var fs = require('fs');
var fileStream = fs.createReadStream(file);
fileStream.on('error', function(err) {
  console.log('File Error', err);
});
uploadParams.Body = fileStream;

var path = require('path');
uploadParams.Key = path.basename(file);

// call S3 to retrieve upload file to specified bucket
s3.upload (uploadParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload Success", data.Location);
  }
});
***/
