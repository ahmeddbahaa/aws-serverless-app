import { DynamoDB } from 'aws-sdk';
import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { HttpStatusCode } from '@libs/utils';

const dynamoDB = new DynamoDB.DocumentClient();

const getAuctions: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { status } = event.queryStringParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };
  try {
    const result = await dynamoDB.query(params).promise();
    
    return formatJSONResponse(HttpStatusCode.OK, result.Items);
  } catch (error) {
    return formatJSONResponse(HttpStatusCode.InternalServerError, { message: 'Internal Server Error', error });
  }
};

export const main = middyfy(getAuctions);
