import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'notification-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { sendMail:{
    handler:'src/functions/sendEmail.handler',
    events:[
      {
        sqs:{
          arn:'',
          batchSize :1,
        }
      }
    ]
  }
   },
  resources:{
    Resources: {
      MailQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'your-mail-queue-name',
        },
      },
    },
    Outputs: {
      MailQueueArn: {
        Value: { 'Fn::GetAtt': ['MailQueue', 'Arn'] },
        Export: {
          Name: 'your-mail-queue-name-Arn',
        },
      },
      MailQueueUrl: {
        Value: { Ref: 'MailQueue' },
        Export: {
          Name: 'your-mail-queue-name-Url',
        },
      },
    },
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
