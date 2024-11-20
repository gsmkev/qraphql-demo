import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema'; // Import schema definitions
import { resolvers } from './resolvers'; // Import resolvers

const server = new ApolloServer({
    typeDefs, // Define the GraphQL schema
    resolvers, // Define the resolvers for the schema
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`); // Log the server URL
});
