"use strict";

var AWS = require("aws-sdk");
try {
  var AWSXRay = require('aws-xray-sdk');
  AWS = AWSXRay.captureAWS(require('aws-sdk'));
} catch(e) {
    console.error("XRay library not available");
}
const dynamoDb = new AWS.DynamoDB.DocumentClient();
console.log ("before exports handler in UpdateTable");
// Update table - add table for a customer
exports.handler = (event, context, callback) => {
  
  // Return immediately if being called by warmer  
  if (event.source === "warmer") {
    return callback(null, "Lambda is warm");
  }

  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLE_NAME, // [ProjectName]-Cart
    // 'Item' contains the attributes of the item to be created
    // - 'customerId': user identities are federated through the
    //                 Cognito Identity Pool, we will use the identity id
    //                 as the user id of the authenticated user
    // - 'bookId': a unique identifier for the book (uuid)
    // - 'quantity': the number of 
    // - 'price': price of the 
    Item: {
      customerId: event.requestContext.identity.cognitoIdentityId,
      tableId: data.tableId,

    }
  };

  dynamoDb.put(params, (error, data) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials" : true
    };
    console.log ("after dynamoDB call before exports handler in UpdateTable error=" + error + " data =" + data);
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

    // Return status code 200 on success
    const response = {
      statusCode: 200,
      headers: headers
    };
    callback(null, response);
  });
}
