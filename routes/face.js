// The exported functions in this module makes a call to Microsoft Face API.
// For more info, check out the API reference:
// https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a
var request = require('request');

var GET_FACE_ID_URL = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true',
    FACE_VERIFY_URL = 'https://westus.api.cognitive.microsoft.com/face/v1.0/verify',
    API_KEY = process.env.API_KEY;

/**
 * Gets a faceid for the given picture
 * Return Promise with corrected faceid if succeeded, error otherwise.
 */
module.exports.getFaceId = function (url) {
    //console.log(url);
    return new Promise(
        function (resolve, reject) {
                var requestData = {
                    url: GET_FACE_ID_URL,
                    headers: {
                        "Ocp-Apim-Subscription-Key": "84f0628ab42544e887665b5cf4d160e8"
                    },
                    form: {
                        'url': url
                    },
                    json: true
                }

                request.post(requestData, function (error, response, body) {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode != 200) {
                        reject(body);
                    }
                    else {
                        resolve(body['faceId']);
                    }

                });
        }
    );
}

/**
 * Compares two pictures with the given faceids
 * Returns Promise with confidence if succeeded, error otherwise.
 */
module.exports.compareFace = function (faceId1, faceId2) {
    return new Promise (
        function (resolve, reject) {
                var requestData = {
                    url: FACE_VERIFY_URL,
                    headers: {
                        "Ocp-Apim-Subscription-Key": "84f0628ab42544e887665b5cf4d160e8"
                    },
                    form: {
                        'faceId1': faceId1,
                        'faceId2': faceId2,
                    },
                    json: true
                }

                request.post(requestData, function (error, response, body) {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode != 200) {
                        reject(body);
                    }
                    else {
                        resolve(body);
                        similarity = body['confidence'];
                        return similarity;
                    }

                });
        }
    );
}
