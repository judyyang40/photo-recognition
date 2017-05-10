// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');	// JavaScript Document
AWS.config.apiVersions = {rekognition: '2016-06-27'};


module.exports.compareFace = function (idPhoto_name, liveImage_name){
	var BUCKET = "id-photo";
	var rekognition = new AWS.Rekognition();

	var params = {
		"SimilarityThreshold": 50,
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
		return data.FaceMatches;
	}).catch(function(err){
		console.log(err);		
	});
	

}
