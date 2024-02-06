export const AuctionTable = {
  AuctionTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "AuctionsTable",
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "status",
          AttributeType: "S",
        },
        {
          AttributeName: "endingAt",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "statusAndEndDate",
          KeySchema: [
            {
              AttributeName: "status",
              KeyType: "HASH",
            },
            {
              AttributeName: "endingAt",
              KeyType: "RANGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
        },
      ],
    },
  },
};
