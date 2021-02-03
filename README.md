## AWS DiningWithoutRisks Demo App

AWS DiningWithoutRisks Demo App is a full-stack sample web application that creates a restaurant ordering application (and backend) for customers to order food safely. The entire application can be created with a CloudFormation templates. 

You can browse and search for menu items, manage your cart, checkout, view your current/past orders, and more.  Get started with building your own below!
&nbsp;

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.

&nbsp;

## Outline

- [Overview](#overview)
- [Instructions](#instructions)
  - [Getting started](#getting-started)
  - [Cleaning up](#cleaning-up)
- [Architecture](#architecture)
- [Implementation details](#implementation-details)
  - [Amazon DynamoDB](#amazon-dynamodb)
  - [Amazon API Gateway](#amazon-api-gateway)
  - [AWS Lambda](#aws-lambda)
  - [AWS IAM](#aws-iam)
  - [Amazon Cognito](#amazon-cognito)
  - [Amazon Cloudfront and Amazon S3](#amazon-cloudfront-and-amazon-s3)
  - [Amazon VPC](#amazon-vpc)
  - [Amazon Cloudwatch](#amazon-cloudwatch)
  - [AWS CodeCommit, AWS CodePipeline, AWS CodeBuild](#aws-codecommit-aws-codepipeline-aws-codebuild)
- [Considerations for demo purposes](#considerations-for-demo-purposes)
- [Known limitations](#known-limitations)
- [Additions, forks, and contributions](#additions-forks-and-contributions)
- [Questions and contact](#questions-and-contact)

&nbsp;

## Overview

The goal of the AWS DiningWithoutRisks Demo App is to provide a fully-functional web application that utilizes multiple purpose-built AWS databases and native AWS components like Amazon API Gateway and AWS CodePipeline. Increasingly, modern web apps are built using a multitude of different databases. Developers break their large applications into individual components and select the best database for each job. Let's consider the AWS DiningWithoutRisks Demo App as an example. This application focuses on DynamoDB.

The provided CloudFormation template automates the entire creation and deployment of the AWS DiningWithoutRisks Demo App.  The template includes the following components:

**Database components**

* restaurant menu/shopping cart - Amazon DynamoDB offers fast, predictable performance for the key-value lookups needed in the restaurant menu, as well as the shopping cart and order history.  In this implementation, we have unique identifiers, titles, descriptions, quantities, locations, and price.

**Application components**

* Serverless service backend – Amazon API Gateway powers the interface layer between the frontend and backend, and invokes serverless compute with AWS Lambda.  
* Web application blueprint – We include a React web application pre-integrated out-of-the-box with tools such as React Bootstrap, Redux, React Router, internationalization, and more.

**Infrastructure components**

* Continuous deployment code pipeline – AWS CodePipeline and AWS CodeBuild help you build, test, and release your application code. 
* Serverless web application – Amazon CloudFront and Amazon S3 provide a globally-distributed application. 

&nbsp;

---

&nbsp;

## Instructions

***IMPORTANT NOTE**: Creating this demo application in your AWS account will create and consume AWS resources, which **will cost money**.  We estimate that running this demo application will cost ~**$0.45/hour** with light usage.  Be sure to shut down/remove all resources once you are finished to avoid ongoing charges to your AWS account (see instructions on cleaning up/tear down below).*

&nbsp;

### Getting started

To get the AWS DiningWithoutRisks Demo App up and running in your own AWS account, follow these steps (if you do not have an AWS account, please see [How do I create and activate a new Amazon Web Services account?](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)):
This app is not completely automated.  Several scripts are needed.  The scripts share a common set of environment variables and run with cloudformation.

###  Initial Steps
1. Log into the [AWS console](https://console.aws.amazon.com/) if you are not already
2. Get this github repository 
```bash
git clone https://github.com/jphaugla/diningWithoutRisks.git
cd diningWithoutRisks/template
```

###  Run the scripts to create the application

#### Set environment variables by editing and running environment script
```bash
cd template
. ./setEnvironment.sh
```
#### Create S3 bucket to stage git code
```bash
./cfns3deploy.sh
```
#### Deploy first set of objects.  Watch in cloudformation for successful completion.
```bash
./cfnpackage.sh
./cfndeploy.sh
```
#### Upload the menu items json file
```bash
 aws s3 cp ../data/menuitems.json s3://$S3_BUCKET
 ```
#### Execute the program to load the database table from the menuitem.json
* Go to Lambda functions https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions
* Find the UploadMenuItems function and execute the function.  
  * Click Test and create new event with any name 
  * Click Test again to execute

#### Create the code commit and build pipelines
This is creating the code commit and cloud front pieces needed for the web application.
```bash
./cfnwebassetsdeploy.sh
```
Check the outputs from the {project-name}-distribution stack for important URLS
#### Create codecommit and git repository for the application code and check in the code.  

* This will be a separate repository from the current git repository that is backed by AWS code commit instead of git. 
* Start by getting back to the main directory for git repositories.
* Get the repository git repository by going to code commit, finding the webAssets Dining repository and click on the HTTPS copy button. ![code commit](readmeImages/codeCommitURL.jpg)  
* Use this copied string to clone the repository.
```bash
cd ../..
git clone <paste string here>
#  this is example of string git clone https://git-codecommit.us-east-1.amazonaws.com/v1/repos/webAssetsDining
# this will reply that repository is empty.  We will fix that in a subsequent step
cd webAssetsDining
```

#### Copy webassets code to newly created repository 
```bash
cp -rp ../diningWithoutRisks/webAssets/package-lock.json ../diningWithoutRisks/webAssets/package.json ../diningWithoutRisks/webAssets/public ../diningWithoutRisks/webAssets/readmeImages ../diningWithoutRisks/webAssets/src ../diningWithoutRisks/webAssets/tsconfig.json .
git add --all
git commit -m "initial check-in"
git push origin
```
#### Modify two files that must be changed for the new environment: src/config.ts and src/config.js
* must change config.ts to have the correct values.  Need to look up the correct values for apiGateway and Cognito 
  * Can find Api URL by going to Amazon API service
  * Click on the {project-name}-DiningMenu API
  * ON left-most tab, click on Dashboard
  * Find the API URL in the header for this page ![API URL](readmeImages/APIURL.jpg)
  * this API_URL is needed in both config.ts and config.js  
  * Find the Cognito parameters going to the Amazon Cognito Service
  * Click on Manage User Pools
  * Click on the {project-name]user-pool
  * Use the "Pool ID" on General settings for config.ts and config.js "USER_POOL_ID"
  * On the left side, click on Sample code.  Use the highlighted "Identity Pool ID" for config.ts and config.js "IDENTITY_POOL_ID"  
  * On the left most side clid and "App Clients" and use the "App client id" for the config.ts and config.js "APP_CLIENT_ID"
  *  make sure to add these files with git add and to commit and push the change
#### modify the buildspec file  
* need to update the changed variables in this file src/buildspecs/build-with-cache.yml
  * change the s3 artifacts bucket name for this environment using the ArtifactsBucket output from the {project-name}-distribution template
    * be careful not to use the s3 prefix and the trailing /
  * use the correct cloudfront distribution id as well.   
```bash
git add src/config.ts src/config.js buildspecs/build-with-cache.yml
git commit -m "fix config files"
git push origin
```     
#### Kick off a build on the committed code
Need to change the build script fo the application.
* Go to Code Commit service
* ON left tab open the Build, under "Build Project" select {project-name}-distribution 
* it probably is already started, but if not, click "Start build"
* wait for the build to finish  (10 minutes?)

### Sign into the application 
    1. The output of the CloudFormation stack creation will provide a CloudFront URL (in the *Outputs* section of your stack details page).  Copy and paste the CloudFront URL into your browser.
    2. You can sign into your application by registering an email address and a password.  Choose **Sign up to explore the demo** to register.  The registration/login experience is run in your AWS account, and the supplied credentials are stored in Amazon Cognito.  *Note: given that this is a demo application, we highly suggest that you do not use an email and password combination that you use for other purposes (such as an AWS account, email, or e-commerce site).*
    3. Once you provide your credentials, you will receive a verification code at the email address you provided. Upon entering this verification code, you will be signed into the application.

&nbsp;

### Cleaning up

To tear down your application and remove all resources associated with the AWS DiningWithoutRisks Demo App, follow these steps:

1. Log into the AWS CloudFormation Console and find the stacks you created for the demo app
2. Delete the stack
    1. Double-check that the S3 buckets created for the stack were successfully removed.

Remember to shut down/remove all related resources once you are finished to avoid ongoing charges to your AWS account.

&nbsp;

---

&nbsp;

## Architecture

**Summary diagram**

![Summary Diagram](readmeImages/SummaryDiagram.png)

&nbsp;

**High-level, end-to-end diagram**

![High-level Architectural Diagram](readmeImages/ArchDiagram.png)

&nbsp;

**Frontend**

Build artifacts are stored in a S3 bucket where web application assets are maintained (like book cover photos, web graphics, etc.). Amazon CloudFront caches the frontend content from S3, presenting the application to the user via a CloudFront distribution.  The frontend interacts with Amazon Cognito and Amazon API Gateway only.  Amazon Cognito is used for all authentication requests, whereas API Gateway (and Lambda) is used for all API calls interacting across DynamoDB, 

**Backend**

The core of the backend infrastructure consists of Amazon Cognito, Amazon DynamoDB, AWS Lambda, and Amazon API Gateway. The application leverages Amazon Cognito for user authentication, and Amazon DynamoDB to store all of the data for menu items, orders, and the checkout cart. 

![Backend Diagram](readmeImages/BackendDiagram.png)

&nbsp;

**Developer Tools**

The code is hosted in AWS CodeCommit. AWS CodePipeline builds the web application using AWS CodeBuild. After successfully building, CodeBuild copies the build artifacts into a S3 bucket where the web application assets are maintained (like book cover photos, web graphics, etc.). Along with uploading to Amazon S3, CodeBuild invalidates the cache so users always see the latest experience when accessing the storefront through the Amazon CloudFront distribution.  AWS CodeCommit. AWS CodePipeline, and AWS CodeBuild are used in the deployment and update processes only, not while the application is in a steady-state of use.

![Developer Tools Diagram](readmeImages/DeveloperTools.png)

&nbsp;

---

&nbsp;


### Amazon DynamoDB

The backend of the AWS DiningWithoutRisks Demo App leverages Amazon DynamoDB to enable dynamic scaling and the ability to add features as we rapidly improve our e-commerce application. The application create three tables in DynamoDB: Books, Orders, and Cart.  DynamoDB's primary key consists of a partition (hash) key and an optional sort (range) key. The primary key (partition and sort key together) must be unique.

** Menu Table:**

```js
MenuTable {
  id: string (primary partition key)
  category: string (index, GSI)
  fullImage: string (url to s3 file)
  name: string 
  menuName: string 
  menuId: string (primary partition key)
  price: number
  rating: number
}
```

The table's partition key is the ID attribute of a book. The partition key allows you to look up a book with just the ID. Additionally, there is a global secondary index (GSI) on the category attribute. The GSI allows you to run a query on the category attribute and build the books by category experience. 

For future updates to the application, we plan to return the results of a search/filter by category via ElasticSearch.  Additionally, there is no “description” attribute, as this sample application does not feature pages for individual books.  This may be something users wish to add.

&nbsp;

**Orders Table:**

```js
OrdersTable {
    customerId: string (primary partition key)
    orderId: string (uuid, primary sort key)
    books: bookDetail[]
    orderDate: date 
}
```

```js
bookDetail {
    bookId: string
    customerId: string
    quantity: number
    price: number
}
```

The order table's partition key is the customer ID. This allows us to look up all orders of the customer with just their ID. 

&nbsp;

**Cart Table:**

```js
CartTable {
    customerId: string (primary partition key)
    bookId: string (uuid, primary sort key)
    price: number
    quantity: number
}
```

The cart table stores information about a customer's saved cart.

&nbsp;

### Amazon API Gateway

Amazon API Gateway acts as the interface layer between the frontend (Amazon CloudFront, Amazon S3) and AWS Lambda, which calls the backend (databases, etc.). Below are the different APIs the application uses:

**Books (DynamoDB)**

GET /books (ListBooks)  
GET /books/{:id} (GetBook)

**Cart (DynamoDB)**

GET /cart (ListItemsInCart)  
POST /cart (AddToCart)  
PUT /cart (UpdateCart)  
DELETE /cart (RemoveFromCart)  
GET /cart/{:bookId} (GetCartItem)

**Orders (DynamoDB)**

GET /orders (ListOrders)  
POST /orders (Checkout)  

**Best Sellers (ElastiCache)**

GET /bestsellers (GetBestSellers)

**Recommendations (Neptune)**

GET /recommendations (GetRecommendations)  
GET /recommendations/{bookId} (GetRecommendationsByBook)

**Search (ElasticSearch)**

GET /search (SearchES)

&nbsp;

### AWS Lambda

AWS Lambda is used in a few different places to run the application, as shown in the architecture diagram.  The important Lambda functions that are deployed as part of the template are shown below, and available in the [functions](/functions) folder.  In the cases where the response fields are blank, the application will return a statusCode 200 or 500 for success or failure, respectively.

&nbsp;

**ListBooks**
Lambda function that lists the books in the specified product category

```js
ListBooksRequest {
    category?: string (optional parameter)  
}
```

```js
ListBooksResponse {
    books: book[]
}
```

```js
book {
    id: string
    category: string
    name: string 
    author: string
    description: string
    rating: number
    price: number
    cover: string
}
```

&nbsp;

**GetBook**
Lambda function that will return the properties of a book.

```js
GetBookRequest {
  bookId: string
}
```

```js
GetBookResponse {
    id: string
    category: string
    name: string 
    author: string
    description: string
    rating: number
    price: number
    cover: string
}
```

&nbsp;

**ListItemsInCart**
Lambda function that lists the orders a user has placed.

```js
ListItemsInCartRequest {

}
```

```js
ListItemsInCartResponse {
    orders[]
}
```

```js
order {
    customerId: string
    bookId: string
    quantity: number
    price: number
}
```

&nbsp;

**AddToCart**
Lambda function that adds a specified book to the user's cart.  Price is included in this function's request so that the price is passed into the cart table in DynamoDB.  This could reflect that the price in the cart may be different than the price in the catalog (i.e. books table) perhaps due to discounts or coupons.

```js
AddToCartRequest {
    bookId: string
    quantity: number
    price: number
}
```

```js
AddToCartResponse {

}
```

&nbsp;

**RemoveFromCart**
Lambda function that removes a given book from the user's cart.  

```js
RemoveFromCartRequest {
    bookId: string
}
```

```js
RemoveFromCartResponse {

}
```

&nbsp;

**GetCartItem**
Lambda function that returns the details of a given item the user's cart.

```js
GetCartItemRequest {
    bookId: string
}
```

```js
GetCartItemResponse {
    customerId: string
    bookId: string
    quantity: number
    price: number
}
```

&nbsp;

**UpdateCart**
Lambda function that updates the user's cart with a new quantity of a given book.

```js
UpdateCartRequest {
    bookId: string
    quantity: number
}
```

```js
UpdateCartResponse {
    
}
```

&nbsp;

**ListOrders**
Lambda function that lists the orders for a user.

```js
ListOrdersRequest {

}
```

```js
ListOrdersResponse {
    customerId: string 
    orderId: string
    orderDate: date
    books: bookDetail[]
}
```

```js
bookDetail {
    bookId: string
    price: number
    quantity: number
}
```

&nbsp;

**Checkout**
Lambda function that moves the contents of a user's cart (the books) into the checkout flow, where you can then integrate with payment, etc.

```js
CheckoutRequest {
    books: bookDetail[]
}
```

```js
bookDetail {
    bookId: string
    price: number
    quantity: number
}
```

```js
CheckoutResponse {

}
```

In addition to the above, the *Checkout* Lambda function acts as a sort of mini-workflow with the following tasks:
1. Add all books from the Cart table to the Orders table
2. Remove all entries from the Cart table for the requested customer ID

&nbsp;

**GetBestSellers**
Lambda function that returns a list of the best-sellers.

```js
GetBestSellersRequest {

}
```

```js
GetBestSellersResponse {
    bookIds: string[]
}
```

&nbsp;

**GetRecommendations**
Lambda function that returns a list of recommended books based on the purchase history of a user's friends.

```js
GetRecommendationsRequest {

}
```

```js
GetRecommendationsResponse {
    recommendations: recommendation[]
}
```

```js
recommendation {
    bookId: string
    friendsPurchased: customerId[]
    purchases: number
}
```

```js
customerId: string
```

&nbsp;

**GetRecommendationsByBook**
Lambda function that returns a list of friends who have purchased this book as well as the total number of times it was purchased by those friends.

```js
GetRecommendationsByBookRequest {
    bookId: string
}
```

```js
GetRecommendationsByBookResponse {
    friendsPurchased: customerId[]
    purchased: number
}
```

```js
customerId: string
```

&nbsp;

&nbsp;

### AWS IAM

**ListBooksLambda**
AWSLambdaBasicExecutionRole  
dynamodb:Scan - table/Books/index/category-index  
dynamodb:Query - table/Books

**GetBookLambda**
AWSLambdaBasicExecutionRole  
dynamodb:GetItem - table/Books

**ListItemsInCartLambda**
AWSLambdaBasicExecutionRole  
dynamodb:Query - table/Cart

**AddToCartLambda**
AWSLambdaBasicExecutionRole  
dynamodb:PutItem - table/Cart

**UpdateCartLambda**
AWSLambdaBasicExecutionRole  
dynamodb:UpdateItem - table/Cart

**ListOrdersLambda**
AWSLambdaBasicExecutionRole  
dynamodb:Query - table/Orders

**CheckoutLambda**
AWSLambdaBasicExecutionRole  
dynamodb:PutItem - table/Orders  
dynamoDB:DeleteItem - table/Cart

&nbsp;

### Amazon Cognito

Amazon Cognito handles user account creation and login for the bookstore application.  For the purposes of the demo, the bookstore is only available to browse after login, which could represent the architecture of different types of web apps.  Users can also choose to separate the architecture, where portions of the web app are publicly available and others are available upon login.

User Authentication
* Email address

Amazon Cognito passes the CognitoIdentityID (which AWS DiningWithoutRisks Demo app uses as the Customer ID) for every user along with every request from Amazon API Gateway to Lambda, which helps the services authenticate against which user is doing what.

&nbsp;

### Amazon CloudFront and Amazon S3

Amazon CloudFront hosts the web application frontend that users interface with.  This includes web assets like pages and images.  For demo purposes, CloudFormation pulls these resources from S3.

&nbsp;

### Amazon VPC

Amazon VPC (Virtual Private Cloud) is used with Amazon Elasticsearch Service, Amazon ElastiCache for Redis, and Amazon Neptune.

&nbsp;

### Amazon CloudWatch

The capabilities provided by CloudWatch are not exposed to the end users of the web app, rather the developer/administrator can use CloudWatch logs, alarms, and graphs to track the usage and performance of their web application.

&nbsp;

### AWS CodeCommit, AWS CodePipeline, AWS CodeBuild

Similar to CloudWatch, the capabilities provided by CodeCommit, CodePipeline, and CodeBuild are not exposed to the end users of the web app.  The developer/administrator can use these tools to help stage and deploy the application as it is updated and improved.

&nbsp;

---

&nbsp;

## Considerations for demo purposes

1. In order to make the AWS DiningWithoutRisks Demo App an effective demonstration from the moment it is created, udFormation template kicks off a Lambda function we wrote to pre-load a list of books into the restaurant menu (the Books table in DynamoDB).  In the same way, we used a Lambda function to pre-load sample friends (into Neptune) and manually populated the list of Best Sellers (on the front page only).  This enables you to sign up as a new user and immediately see what the running store would look like, including recommendations based on what friends have purchased and what the best-selling books section does.  

2. You will notice that the Past orders page is empty at first run.  These are updated as soon as an order is placed. 

3. Web assets (pages, images, etc.) are pulled from a the github repo via the CloudFormation template to create the frontend for the AWS DiningWithoutRisks Demo App.  When building your own web application you will likely pull from your own S3 buckets.  If you customize the lambda functions, you will want to store these separately, as well.

4. Checkout is a simplified demo experience that customers can take and implement a real-world payment processing platform.  Similarly, the *View Receipt* button after purchase is non-functional, meant to demonstrate how you can add on to the app.

5. The CloudFormation template referenced in #2 of the [Getting started](#getting-started) section is everything you need to create the full-stack application.  However, when the application is newly created, or hasn't been used in some time, it may take a few extra seconds to run the Lamdba functions, which increases the latency of operations like search and listing books.  If you want to maintain low latency for your app, [this deeplink](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=MyDiningWithoutRisks&templateURL=https://s3.amazonaws.com/aws-bookstore-demo/master-fullstack-with-lambda-triggers.template) creates an identical stack but with additional triggers to keep the Lamdba functions "warm."  Given that these triggers make the Lamdba functions run more frequently (every 10 minutes, on a schedule), this will add a small amount to the overall cost to run the application.  The benefit is a more responsive application even when the Lamdba functions are not being regularly called by user activity.

&nbsp;

---

&nbsp;

## Known limitations

* The application was written for demonstration purposes and not for production use.
* Upon the first use of a Lambda function, cold start times in a VPC can be slow. Once the Lambda function has been warmed up, performance will improve.  See #6 in [Considerations for demo purposes](#considerations-for-demo-purposes) for more information.

&nbsp;

---

&nbsp;

## Additions, forks, and contributions

We are excited that you are interested in using the AWS DiningWithoutRisks Demo App!  This is a great place to start if you are just beginning with AWS and want to get a functional application up and running.  It is equally useful if you are looking for a sample full-stack application to fork off of and build your own custom application.  We encourage developer participation via contributions and suggested additions.  Of course you are welcome to create your own version!

Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

&nbsp;

---

&nbsp;

## Questions and contact

For questions on the AWS DiningWithoutRisks Demo App, or to contact the team, please leave a comment on GitHub.
