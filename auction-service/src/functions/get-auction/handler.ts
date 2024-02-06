import { DynamoDB } from 'aws-sdk';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { HttpStatusCode } from '@libs/utils';

const dynamoDB = new DynamoDB.DocumentClient();

export async function getAuctionById(id: string) {
  let auction;

  try {
    const result = await dynamoDB.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch (error) {
    throw new Error('Error getting auction')
  }

  if (!auction) {
    throw new Error('Error auction Not Found !')
  }

  return auction;
}
const getAuction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters;
  try{
  const auction = await getAuctionById(id);
    
  return formatJSONResponse(HttpStatusCode.OK, auction);
  } catch (error) {
    return formatJSONResponse(HttpStatusCode.NotFound, { message: 'Auction Not Found', error });
  }
};

export const main = middyfy(getAuction);
