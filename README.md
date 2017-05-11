Team Members
Chu-Yuan Yang 011435944
Jing Lu 010827271
Tao Geng 011414390
Wei Yao 011090612

Project Overview
Functions:
1. Image Uploading
2. Real Image Taking
3. Image Comparison (uploaded and taken)

Task Distribution
Chu-Yuan & Tao: 
1. Three Functioin Implementation
2. Application Integration

Jing:
1. Front End of Web App (Abandoned version stored in index.html)
2. Front End Image Taking and Upload(Web & Phone)
3. Project Documentation

Wei:
1. Web App Architecture and Implementation 
2. Application Deployment 


Our Scenarios:

1.Input User Name and Birthday
a.Check if there is an image item matched with the user in DynamoDB
i.Yes: return URL where file stored in S3 and display on page 2.
ii.No: go to step 2.


2.Upload ID photos to S3
a.Select path/file_name in local hard disk for uploading
b.Add file to S3 photo album
c.Add file S3 URL to DynamoDB
d.Display “Success uploading and number of items in DB”


3.Press “Take Snapshot” Button
a.Invoke camera to capture a live image
i.Ask for confirm or retake photo
ii.Display the newly taken image on screen
b.Press "Analyze" to call Amazon Rekognition API for face comparison

4.Display similarity result
