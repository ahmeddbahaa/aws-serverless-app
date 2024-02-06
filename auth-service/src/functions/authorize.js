// authorizer.js
const jwt = require('jsonwebtoken');

module.exports.handler = async (event, context) => {
  const token = event.headers.Authorization.replace('Bearer ', '');
  if (!token) {
    return generatePolicy('user', 'Deny', event.methodArn);
  }
  const cognitoIssuer = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GjZJ3CA8I'; // Replace with your Cognito User Pool Issuer

  try {
    const decodedToken = jwt.decode(token);
    // Check if the token is valid and contains the necessary claims
    // You may want to perform additional checks based on your requirements
    if (decodedToken.iss !== cognitoIssuer) {
      console.error('Invalid issuer:', decodedToken.iss);
      return generatePolicy('user', 'Deny', event.methodArn);
    }
    console.log('Valid token:', decodedToken);
    return generatePolicy(decodedToken.sub, event.methodArn);
  } catch (error) {
    console.error('Token verification failed:', error);
    return generatePolicy('user', 'Deny', event.methodArn);
  }
};

const generatePolicy = (principalId, methodArn) => {
  const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};


  return authResponse;
};
