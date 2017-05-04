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
Jing:
1. Front End of Web App
2. Project Documentation
Wei:
1. Web App Architecture
2. Application Deployment and Integration


Our Scenarios:1.Upload ID photos to S3a.Select path/file_name in local hard disk for uploadingb.Add file to S3 photo albumc.Add file S3 URL to DynamoDBd.Display “Success uploading and number of items in DB”2.Input User Namea.Invoke a lambda function to check if there is an item in DynamoDBi.Yes: return URL where file stored in S3 ii.No: show “user not found” alert 
b.Display the retrieved ID photo on screen3.Press “Capture” Buttona.Invoke camera to capture a live imagei.Ask for confirm or retake photoii.Display the newly taken image on screen
b.Invoke a lambda function to call AWS rekognition API for face comparisonc.Display similarity result