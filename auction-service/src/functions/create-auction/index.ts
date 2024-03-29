import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        cors: true,
        path: 'auction',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
