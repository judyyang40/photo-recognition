//adding photo to S3 bucket 'id-photo'
module.exports.addPhoto = function () {
  var files = document.getElementById('photoUpload').files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = file.name;
  var uploadParams = {Bucket: BUCKET, Key: fileName, Body: file};
	
  s3.upload(uploadParams, function(err, data) {
    if (err) {
      return alert('There was an error uploading your photo: ', err.message);
    }
    alert('Successfully uploaded photo.'); 
	console.log(data.location);
	 return data.location;
  });
}


module.exports.addToDB = function (file_url, user_name) {
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
// Write the item to the table
	var itemParams = {
    	Item: {
        	'Name': {S: user_name},
        	'data': {S: file_url}
    	},
    	ReturnConsumedCapacity: 'TOTAL'
	};

	table.putItem(itemParams, function(err, data) {
    	if (err) console.log(err, err.stack); // an error occurred
    	else     console.log(data);           // successful response
	});
	
}
/***
//reading photo url from DynamoDB by user name
function getPhotoUrl(user_name) {
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
	var itemParams = {Key: {'Name': {S: user_name} }};

	table.getItem(itemParams, function(err, data) {
    							if (err) console.log(err, err.stack); // an error occurred
    							else   return data['data']; // successful response
							});// JavaScript Document

}
***/

module.exports.uploadPhoto = function () {
	// Load the SDK for JavaScript
	var AWS = require('aws-sdk');
	// Load credentials and set region from JSON file
	AWS.config.loadFromPath('./config.json');
	
	// Create S3 service object
	var s3 = new AWS.S3({apiVersion: '2006-03-01'});
	var BUCKET = 'id-photo';
	
	var photo_url = addPhoto();
	var userName = document.getElementById('userName');
	
	addToDB(photo_url, userName);
	
	docment.getElementById('response').innerHTML= 'sucessfully uploaded!';
	
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
