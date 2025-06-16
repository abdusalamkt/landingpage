import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache', // ✅ Forces fresh fetch on each request (even during static generation)
    },
  },
});

export default client;
