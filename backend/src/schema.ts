// Import the gql function from Apollo Server
import { gql } from 'apollo-server';

// Define the GraphQL schema using the gql template literal
export const typeDefs = gql`
     # Root Query
     type Query {
        # Fetch details of a country by its name
        country(name: String!): Country
    
        # Fetch a list of all countries
        countries: [Country!]!
     }
    
     # Country Information
     type Country {
        name: String # The common name of the country
        capital: [String] # List of capital cities
        population: Int # Population of the country
        region: String # The geographic region (e.g., Europe, Africa)
        subregion: String # The subregion (e.g., Southern Europe)
        flags: Flag # Flag images
     }
    
     # Flag Information
     type Flag {
        png: String # URL for the PNG flag image
        svg: String # URL for the SVG flag image
     }`;
