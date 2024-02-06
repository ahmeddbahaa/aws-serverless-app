import type { AWS } from '@serverless/typescript';

import { AuctionTable } from 'src/resources/auction-table';
import { createAuction, getAuction, getAuctions, placeBid, processAuctions } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'auction-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AUCTIONS_TABLE_NAME: 'AuctionsTable',
      EMAIL: 'ahmedbahaa0026@gmail.com'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:PutItem',
        ],
        Resource: 'arn:aws:dynamodb:us-east-1:390863015379:table/AuctionsTable',
      },
    ],
  },
  // import the function via paths
  functions: { createAuction, getAuction, getAuctions, placeBid, processAuctions },
  resources: {
    Resources: AuctionTable
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
