"use strict";
const https = require("https");
const url = require("url");
var AWS = require("aws-sdk"),
documentClient = new AWS.DynamoDB.DocumentClient(),
s3Client = new AWS.S3;

var localBucket = process.env.S3_BUCKET;
var localKey = process.env.MENU_KEY;
// path to files
// var fullPath = "../../images/menuItems/"
var fullPath = "/"
console.log("before event handler in uploadMenuItem");
exports.handler = (event, context, callback) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials" : true
    };
getMenuData().then(function(data) {
       var menuItemString = data.Body.toString("utf-8");
       var menuItemList = JSON.parse(menuItemString);
       console.log("test the json type " + menuItemList.array.type)
       var categories = [];
       var menu_items = [];
       categories = menuItemList.array.categorys;
       var i;
       var j;
       var k;
       var sub_items = [];
       var menuId;
       var menuName;
       var menuDescription;
       var menuImage;
       for (i = 0; i < categories.length; i++) { 
             var category_name = categories[i].name;
             var category_id = categories[i].id;
             console.log("idx[" + i + "] name=" + category_name + " id=" + category_id);
             menu_items = categories[i] ["menu-items"];
             // uploadMenuItemData(menu_items,category_name);
             for (j = 0; j < menu_items.length; j++) {
              //   console.log("menu items idx[" + j + "] name=" + menu_items[j].name + " id=" + menu_items[j].id);
                 menuId=menu_items[j].id;
                 menuName =  menu_items[j].name;
                 menuDescription =  menu_items[j].description;
                 menuImage= menu_items[j].images;
                 sub_items = menu_items[j] ["sub-items"];
                 for (k = 0; k < sub_items.length; k++) {
                 //  console.log("sub items idx[" + k + "] name=" + sub_items[k].name + " id=" + sub_items[k].id);
                   uploadMenuItemData(sub_items,category_name,menuId,menuName,menuDescription,menuImage);
                 }
               
              }
       }
       
       // 
       console.log("after uploadMenuItemData");
     }).catch(function(err) {
       console.log(err);
       var responseData = { Error: "Upload menu items failed" };
       console.log(responseData.Error);
     });
     console.log('Leaving getMenuData');
       // Return status code 200 on success
     const response = {
      statusCode: 200,
      headers: headers
     };
     callback(null, response);
     return;
}
     
     // Retrieve sample menuItems from  S3 Bucket
function getMenuData() {
  var params = {
    Bucket: localBucket, // s3 bucket name
    Key: localKey // data/books.json
 };
 console.log("before s3Client call in getMenuData with bucket=" + localBucket + " and key=" + localKey);
 return s3Client.getObject(params).promise();
}


function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

function uploadMenuItemData(menu_items,category_name,menuId,menuName,menuDescription,menuImage) {
  var items_array = [];
  console.log("Entering uploadMenuItemData");
  for (var i in menu_items) {
    var menu = menu_items[i];
//    console.log("image is:" + menuImage);
    var fullImage = fullPath + menuImage;
    var category_short;
    var menuPrice = (Number.parseFloat(menu.price)*.07).toFixed(2);
//    console.log(menu);
    menu.category_name=category_name;
    menu.fullImage=fullImage;
    menu.menuId=menuId;
    menu.menuName=menuName;
    menu.description=menuDescription;
    menu.usPrice=menuPrice.toString();
    // console.log("price is " + menu.price + " and menuPrice is " + menu.usPrice);
    menu.rating=between(1,5);
//   console.log("category name is:" + category_name);
    if (menu.category_name === 'Appeteasers') {
        category_short = 'appeteasers';
    } else if (menu.category_name === "Fino sides") {
        category_short = 'finoSides';
    } else if (menu.category_name === "Sharing platters") {
        category_short = 'sharing';
    } else if (menu.category_name === "Peri-peri chicken") {
        category_short = 'periperichicken';   
    } else if (menu.category_name === "Dessert") {
        category_short = 'dessert'; 
    } else if (menu.category_name === "Sides") {
        category_short = 'sides'; 
    } else if (menu.category_name === "Salads") {
        category_short = 'salads'; 
    } else if (menu.category_name === "Try someting new") {
        category_short = 'newItem'; 
    } else if (menu.category_name === "Burgers, pitas, wraps") {
        category_short = 'burgers';     
    }
    console.log("category short is:" + category_short);
    menu.category=category_short;
    var item = {
      PutRequest: {
       Item: menu
      }
    };
    items_array.push(item);
  }
// Batch items into arrays of 25 for BatchWriteItem limit
  var split_arrays = [], size = 25;
    while (items_array.length > 0) {
        split_arrays.push(items_array.splice(0, size));
    }

  split_arrays.forEach( function(item_data) {
    putItem(item_data)
  });
}

// Batch write menuItems to DynamoDB
function putItem(items_array) {
  var tableName = "jphmenu-Menu"; // [ProjectName]-Books
  var params = {
    RequestItems: {
      [tableName]: items_array
    }
  };
  var batchWritePromise = documentClient.batchWrite(params).promise();
  batchWritePromise.then(function(data) {
    console.log("Menu items imported");
  }).catch(function(err) {
    console.log(err);
  });
}
