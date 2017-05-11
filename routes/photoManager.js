// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');	

AWS.config.apiVersions = {rekognition: '2016-06-27'};


//adding photo to S3 bucket 'id-photo'
module.exports.addToS3 = function (file, callback) {
	// Create S3 service object
	var s3 = new AWS.S3({apiVersion: '2006-03-01'});
	
  	if (!file.data) {
    return alert('Please choose a file to upload first.');
  		}

  	var uploadParams = {Bucket: 'id-photo', Key: file.name, Body: file.data, ACL:'public-read'};
  	var promise = s3.upload(uploadParams).promise();
	
	promise.then(function(data) {
		console.log(data.Location);
		callback(data.Location);
	}).catch(function(err){
		console.log(err);		
	});
	
}



module.exports.addToDynamoDB = function (file_url, user_name, file_name) {
	
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
	// Write the item to the table
	//need to convert parameter to string!!!!!!!!!!!
	var itemParams = {
    	Item: {
        	'Name':  {S: user_name},
        	'data':  {S: file_url},
			'file_name':{S: file_name }
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
		if (err) {}
		else {
			if(data.Item != null)
				callback({file_name: data.Item.file_name.S, url: data.Item.data.S});
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

module.exports.uploadSnapshot = function(data, callback) {
	var s3 = new AWS.S3({apiVersion: '2006-03-01'});
	  s3.putObject(data, function(err, data){
      if (err) { 
        console.log(err);
        console.log('Error uploading data: ', data); 
      } else {
        console.log('succesfully uploaded the image!');
		callback();
      }
  });

}


module.exports.compareFace = function (idPhoto_name, liveImage_name, callback){
	var BUCKET = "id-photo";
	var rekognition = new AWS.Rekognition();

	var params = {
		"SimilarityThreshold": 0,
		"SourceImage": {
			"S3Object": {
				"Bucket":BUCKET,
				"Name": idPhoto_name
			}
		},
		"TargetImage": {
			"S3Object": {
				"Bucket":BUCKET,
				"Name": liveImage_name
			}
	
		}
	}

	var promise = rekognition.compareFaces(params).promise();
	
	promise.then(function(data) {
		//console.log(data.FaceMatches);
		callback(data.FaceMatches);
	}).catch(function(err){
		console.log(err);		
	});
	

}

