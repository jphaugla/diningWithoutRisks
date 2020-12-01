"use strict";

var AWS = require("aws-sdk");
try {
  var AWSXRay = require('aws-xray-sdk');
  AWS = AWSXRay.captureAWS(require('aws-sdk'));
} catch(e) {
    console.error("XRay library not available");
}
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const AmazonDaxClient = require('amazon-dax-client');
// var dax = new AmazonDaxClient({endpoints: process.env.DAXENDPOINT, region: process.env.REGION});
// var daxClient = new AWS.DynamoDB.DocumentClient({service: dax });

// UpdateCart - Update quantity of a book in a customer's cart
exports.handler = (event, context, callback) => {
  
  // Return immediately if being called by warmer 
  if (event.source === "warmer") {
    return callback(null, "Lambda is warm");
  }
  
  // Request body is passed in as a JSON encoded string in 'event.body'
  // const data = JSON.parse(event.queryStringParameters);
  const data = JSON.parse(event.body);
  console.log("in updateOrderState with CustomerId:" + data.customerId);
  console.log("orderstatus:" + data.orderStatus);
  console.log("orderId:" + event.pathParameters.id);
  const dateColumnName = "order" + data.orderStatus; 
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Key' defines the partition and sort keys of the item to be updated
    // - 'customerId': Identity Pool identity id of the authenticated user
    // - 'bookId': id for the book being updated
    Key: {
      customerId: data.customerId,
      orderId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    // - ':quantity': defines 'quantity' to be the quantity parsed from the request body
    UpdateExpression: "SET orderStatus = :orderStatus, #dateColumn = :currentDate",
    ExpressionAttributeNames: {"#dateColumn" : dateColumnName},
    ExpressionAttributeValues: {
      ":orderStatus" : data.orderStatus,
      ":currentDate" : Date.now(),
    },
    ReturnValues: "ALL_NEW"
  };
  console.log("params are:" + params);
  dynamoDb.update(params, (error, data) => {
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

