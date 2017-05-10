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
	//need to convert parameter to string!!!!!!!!!!!
	var itemParams = {
    	Item: {
        	'Name':  {S: user_name},
        	'data':  {S: file_url}
    	},
    	ReturnConsumedCapacity: 'TOTAL'
	};

	table.putItem(itemParams, function(err, data) {
    	if (err) console.log(err, err.stack); // an error occurred
    	else     console.log(data.Item);           // successful response
	});
	
}


//first step: if user exists, get photo url. if not, create new user in dynamo and return default pic url
module.exports.getUserIdPhoto = function(user_name, callback) {
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
	
	var params = {
		Key: {
			"Name": {S: user_name}
		}	
	}
	table.getItem(params, function(err, data){
		if (err) {
		}
		else {
			if(data.Item != null)
				callback(data.Item.file_url.S);
			else {
				newUser(user_name);
				callback("https://pbs.twimg.com/profile_images/2633978789/80508321d8ce3ba8aa264380bb7eba33_400x400.png");
			}
		}
	})

}
//input new user with only username
newUser = function(user_name) {
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
	var itemParams = {
    	Item: {
        	'Name':  {S: user_name}
    	},
    	ReturnConsumedCapacity: 'TOTAL'
	};
	table.putItem(itemParams, function(err, data) {});
}

module.exports.getPics = function(user_name, callback) {
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
	var params = {
		Key: {
			"Name": {S: user_name}
		}	
	}
	table.getItem(params, function(err, data){
		if (err) {}
		else {
			callback({pic1: data.Item.file_url.S, pic2: data.Item.compare_url.S});
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
