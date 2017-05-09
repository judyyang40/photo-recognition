//adding photo to S3 bucket 'id-photo'
module.exports.addToS3 = function (files) {
  //var files = document.getElementById('photoUpload').files;
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


module.exports.addToDynamoDB = function (file_url, user_name) {
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


module.exports.searchUser = function(user_name) {
	var table = new AWS.DynamoDB({apiVersion: '2012-08-10', params: {TableName: 'IdPhoto'}});
	
	try: 
		response = table.get_item(
			Key={'Name':user_name}
		)
	except ClientError as e:
		return '';
	else: 
		item = response['item']
		return item['data']
	
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
