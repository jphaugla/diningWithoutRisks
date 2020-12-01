"use strict";

var AWS = require("aws-sdk");
try {
  var AWSXRay = require('aws-xray-sdk');
  AWS = AWSXRay.captureAWS(require('aws-sdk'));
} catch(e) {
    console.error("XRay library not available");
}
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// ListOrders - List orders for a given customer
exports.handler = (event, context, callback) => {
  
  // Return immediately if being called by warmer 
  if (event.source === "warmer") {
    return callback(null, "Lambda is warm");
  }

  const params = {
      TableName: process.env.TABLE_NAME, // [ProjectName]-Orders
      // 'KeyConditionExpression' defines the condition for the query
      // - 'customerId = :customerId': only return items with matching 'customerId'
      //                               partition key
      // 'ExpressionAttributeValues' defines the value in the condition
      // - ':customerId': defines 'customerId' to be Identity Pool identity id
      //                  of the authenticated user
      Key: {
        customerId: event.requestContext.identity.cognitoIdentityId
      }
  };
  dynamoDb.get(params, (error, data) => {
      // Set response headers to enable CORS (Cross-Origin Resource Sharing)
      const headers = {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Credentials" : true
      };

      // Return status code 500 on error
      if (error) {
        const response = {
           statusCode: 500,
           headers: headers,
           body: error
        };
        callback(null, response);
        return;
      }

      // Return status code 200 at the retrieved items on success
      const theBody = JSON.stringify(data.Item);
      const response = {
         statusCode: 200,
         headers: headers,
         body: theBody
      };
      console.log("returning from getTable body:" + theBody);
      callback(null, response);
  });
}