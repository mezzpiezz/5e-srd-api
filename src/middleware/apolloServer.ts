import { ApolloServer } from 'apollo-server-express';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import schema from '../graphql/schema';

const createApolloMiddleware = async () => {
  const server = new ApolloServer({
    schema,
    plugins: [responseCachePlugin()],
    cacheControl: {
      defaultMaxAge: 3600, // 1 hour
    },
  });
  return server;
};

export { createApolloMiddleware };
