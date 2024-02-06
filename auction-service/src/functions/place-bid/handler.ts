import { DynamoDB } from 'aws-sdk';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { HttpStatusCode } from '@libs/utils';
import { getAuctionById } from '@functions/get-auction/handler';

const dynamoDB = new DynamoDB.DocumentClient();

const placeBid: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const email  = process.env.EMAIL;
  const auction = await getAuctionById(id);

 // Auction status validation
 if (auction.status !== 'OPEN') {
  return formatJSONResponse(HttpStatusCode.BadRequest, { message: 'You cannot bid on closed auctions' });
}

// Bid amount validation
if (amount <= auction.highestBid.amount) {
  return formatJSONResponse(HttpStatusCode.BadRequest, { message: 'Your bid must be higher than the current highest bid' });
}

const params = {
  TableName: process.env.AUCTIONS_TABLE_NAME,
  Key: { id },
  UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
  ExpressionAttributeValues: {
    ':amount': amount,
    ':bidder': email,
  },
  ReturnValues: 'ALL_NEW',
};
  try {
    const result = await dynamoDB.update(params).promise();
    const auction =  result.Attributes;
    return formatJSONResponse(HttpStatusCode.Created, auction);
  } catch (error) {
    console.error(error)
    return formatJSONResponse(HttpStatusCode.InternalServerError, { message: 'Internal Server Error', error });
  }
};

export const main = middyfy(placeBid);
