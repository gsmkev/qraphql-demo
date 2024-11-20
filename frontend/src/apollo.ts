// Import necessary modules from Apollo Client
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create an instance of ApolloClient
export const client = new ApolloClient({
    uri: 'http://localhost:4000', // URL of the GraphQL backend
    cache: new InMemoryCache(), // Initialize cache
});
