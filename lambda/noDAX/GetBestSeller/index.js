"use strict";
console.log("entering GetBestSellers");
var AWS = require("aws-sdk");
try {
  var AWSXRay = require('aws-xray-sdk');
  AWS = AWSXRay.captureAWS(require('aws-sdk'));
} catch(e) {
    console.error("XRay library not available");
}

console.log("before dynamoDb call");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const AmazonDaxClient = require('amazon-dax-client');
// var dax = new AmazonDaxClient({endpoints: process.env.DAXENDPOINT, region: process.env.REGION});
// var daxClient = new AWS.DynamoDB.DocumentClient({service: dax });

// getBestSellers - Get the Best Sellers
exports.handler = (event, context, callback) => {
  console.log("after exports handlder");
  
  // Return immediately if being called by warmer 
  if (event.source === "warmer") {
    return callback(null, "Lambda is warm");
  }

  // Set response headers to enable CORS (Cross-Origin Resource Sharing)
  const headers = {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Credentials":true,
    'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH',
    'Content-Type':'application/json'
  };

  const params = {
      TableName: process.env.TABLE_NAME, // [ProjectName]-Menu
      IndexName: "featured-id-index",
      // 'KeyConditionExpression' defines the condition for the query
      // - 'category = :category': only return items with matching 'category' index
      // 'ExpressionAttributeValues' defines the value in the condition
      // - ':category': defines 'category' to be the query string parameter
      KeyConditionExpression: "featured = :flag",
      ExpressionAttributeValues: {
        ":flag": "Y"
      }
  };
  dynamoDb.query(params, (error, data) => {
      // Return status code 500 on error
      console.log("after dynamoDB query with error:" + error);
      if (error) {
        const response = {
           statusCode: 500,
           headers: headers,
           body: error
        };
        callback(null, response);
        return;
      }

      // Return status code 200 and the retrieved items on success
      const response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(data.Items)
      };
      callback(null, response);
  });
}

