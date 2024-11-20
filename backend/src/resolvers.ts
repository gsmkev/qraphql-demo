import axios from 'axios';

export const resolvers = {
    Query: {
        // Query to get a country by name
        country: async (_: unknown, { name }: { name: string }) => {
            if (!name) {
                throw new Error("The 'name' argument is required.");
            }

            try {
                const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
                if (!response.data || response.data.length === 0) {
                    return new Error(`No data found for country: ${name}`);
                }

                const country = response.data[0];
                return {
                    name: country.name.common,
                    capital: country.capital || [],
                    population: country.population || 0,
                    region: country.region || "Unknown",
                    subregion: country.subregion || "Unknown",
                    flags: country.flags || { png: "", svg: "" },
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.message);
                    throw new Error(`Failed to fetch data from RESTCountries API: ${error.message}`);
                } else {
                    console.error("Unexpected error:", error);
                    throw new Error('An unexpected error occurred.');
                }
            }
        },

        // Query to get all countries
        countries: async () => {
            try {
                const response = await axios.get(`https://restcountries.com/v3.1/all`);
                if (!response.data || response.data.length === 0) {
                    return new Error("No countries found.");
                }

                return response.data.map((country: any) => ({
                    name: country.name.common,
                    capital: country.capital || [],
                    population: country.population || 0,
                    region: country.region || "Unknown",
                    subregion: country.subregion || "Unknown",
                    flags: country.flags || { png: "", svg: "" },
                }));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.message);
                    throw new Error(`Failed to fetch countries data from RESTCountries API: ${error.message}`);
                } else {
                    console.error("Unexpected error:", error);
                    throw new Error('An unexpected error occurred.');
                }
            }
        },
    },
};
