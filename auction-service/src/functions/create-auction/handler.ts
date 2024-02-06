import { v4 as uuid } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { HttpStatusCode } from '@libs/utils';

const dynamoDB = new DynamoDB.DocumentClient();

const createAuction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { title } = event.body;
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);
    const email = process.env.EMAIL;
    
    const auction = {
      id: uuid(),
      title,
      status: 'OPEN',
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
      },
      seller: email,
    };
    await dynamoDB.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise();
    return formatJSONResponse(HttpStatusCode.Created, auction);
  } catch (error) {
    console.error(error)
    return formatJSONResponse(HttpStatusCode.InternalServerError, { message: 'Internal Server Error', error });
  }
};

export const main = middyfy(createAuction);
