"use strict";

var AWS = require("aws-sdk");
try {
  var AWSXRay = require('aws-xray-sdk');
  AWS = AWSXRay.captureAWS(require('aws-sdk'));
} catch(e) {
    console.error("XRay library not available");
}
console.log("entering listOrders ");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const AmazonDaxClient = require('amazon-dax-client');
// var dax = new AmazonDaxClient({endpoints: process.env.DAXENDPOINT, region: process.env.REGION});
// var daxClient = new AWS.DynamoDB.DocumentClient({service: dax });

// ListOrders - List orders for a given customer
exports.handler = (event, context, callback) => {
  console.log("event parameters" + event.queryStringParameters.orderStatus);
  // Return immediately if being called by warmer 
  if (event.source === "warmer") {
    return callback(null, "Lambda is warm");
  }
  var params;
  if(event.queryStringParameters.seeAll) {
    // top part is a global request based on the order status GSI for the order table
    params = {
    TableName: process.env.TABLE_NAME, // [ProjectName]-Orders
    // 'KeyConditionExpression' defines the condition for the query
    // - 'customerId = :customerId': only return items with matching 'customerId'
    //                               partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':customerId': defines 'customerId' to be Identity Pool identity id
    //                  of the authenticated user
    KeyConditionExpression: "orderStatus = :theStatus",
    IndexName: "orderStatus-orderId-index",
    ExpressionAttributeValues: {
 
      ":theStatus": event.queryStringParameters.orderStatus
    }

  };
  } else {
  params = {
    TableName: process.env.TABLE_NAME, // [ProjectName]-Orders
    // 'KeyConditionExpression' defines the condition for the query
    // - 'customerId = :customerId': only return items with matching 'customerId'
    //                               partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':customerId': defines 'customerId' to be Identity Pool identity id
    //                  of the authenticated user
    KeyConditionExpression: "customerId = :customerId AND orderStatus = :theStatus",
    IndexName: "customerId-orderStatus-index",
    // FilterExpression:  "orderStatus = :theStatus",
    ExpressionAttributeValues: {
      ":customerId": event.requestContext.identity.cognitoIdentityId,
      ":theStatus": event.queryStringParameters.orderStatus
    }

  };
  }
  
  dynamoDb.query(params, (error, data) => {
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
      const response = {
         statusCode: 200,
         headers: headers,
         body: JSON.stringify(data.Items)
      };
      callback(null, response);
  });
}
