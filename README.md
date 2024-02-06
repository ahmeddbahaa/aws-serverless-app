
# AWS SERVERLESS AUCTION

## Overview

This microservices application is composed of three distinct services, each serving a specific purpose in the overall functionality of the system. The services include:

1. **Auction Service**
   - Responsible for CRUD (Create, Read, Update, Delete) operations related to auctions.
   - Utilizes the Serverless Framework, AWS Lambda functions, and Amazon API Gateway for serverless architecture.
   - Mainly focused on managing auction-related data using DynamoDB.

2. **Notification Service**
   - Manages notifications and communication within the system.
   - Utilizes Amazon SQS (Simple Queue Service) for handling messages and triggering processes.
   - Key functionality includes sending emails based on system events.

3. **Auth Service**
   - Handles user authentication and authorization.
   - Utilizes AWS Cognito for user pool management.
   - Ensures secure and authenticated access to the microservices.




**Technology Stack:**
  - Serverless Framework
  - AWS Lambda Functions
  - Amazon API Gateway
  - AWS DynamoDB (for data storage)
  - Amazon SQS
  - Nodejs

## Run Locally 
- **Note Update ARN and Environment Variables in serverless.ts file:**
* Auction Service
```bash
  cd auction-service
  npm install
  serverless deploy
```

* Notification Service
```bash
  cd notification-service
  npm install
  serverless deploy
```

* Auth Service
```bash
  cd auth-service
  npm install
  serverless deploy
```

## TODO
- Add Diagrams
- Use S3 bucket to upload images
- Make Autherization Levels
