"use strict";

var AWS = require("aws-sdk");
try {
  var AWSXRay = require('aws-xray-sdk');
  AWS = AWSXRay.captureAWS(require('aws-sdk'));
} catch(e) {
    console.error("XRay library not available");
}
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// uncomment for DAX
// const AmazonDaxClient = require('amazon-dax-client');
// var dax = new AmazonDaxClient({endpoints: process.env.DAXENDPOINT, region: process.env.REGION});
// var daxClient = new AWS.DynamoDB.DocumentClient({service: dax });

// AddToCart - add books to a customer's cart
exports.handler = (event, context, callback) => {
  
  // Return immediately if being called by warmer  
  if (event.source === "warmer") {
    return callback(null, "Lambda is warm");
  }

  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  console.log("addToCart with event:" + event.body);
  console.log("addToCart with data.tableId:" + data.tableId);
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
      bookId: data.bookId,
      quantity: data.quantity,
      price: data.price,
      tableId: data.tableId,
    }
  };

  // daxClient.put(params, (error, data) => {
  dynamoDb.put(params, (error, data) => {
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

    // Return status code 200 on success
    const response = {
      statusCode: 200,
      headers: headers
    };
    callback(null, response);
  });
}
