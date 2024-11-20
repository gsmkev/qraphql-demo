import React, { useState, useRef } from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { client } from './apollo';

// Query to get all countries
const GET_COUNTRIES = gql`
query GetCountries {
    countries {
        name
        population
        flags {
            png
        }
    }
}
`;

// Query to get a specific country by name
const GET_COUNTRY = gql`
query GetCountry($name: String!) {
    country(name: $name) {
        name
        capital
        population
        region
        subregion
        flags {
            png
        }
    }
}
`;

const App = () => {
    const { data: countriesData, loading: loadingCountries, error: errorCountries } = useQuery(GET_COUNTRIES);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    // Handle country selection from the dropdown
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    // Handle click on the "Clear" button
    const handleClearSelection = () => {
        setSelectedCountry(null);
        if (selectRef.current) {
            selectRef.current.value = "";
        }
    };

    // Fetch the selected country
    const { data: countryData, loading: loadingCountry, error: errorCountry } = useQuery(GET_COUNTRY, {
        variables: { name: selectedCountry },
        skip: !selectedCountry, // Only execute the query if a country is selected
    });

    if (loadingCountries) return <p>Loading countries...</p>;
    if (errorCountries) return <p>Error fetching countries: {errorCountries.message}</p>;

    return (
        <ApolloProvider client={client}>
            <div style={{ padding: '20px' }}>
                <h1>Country Browser</h1>

                {/* Dropdown of countries and "Clear" button" */}
                <div>
                    <label htmlFor="country-select">Search for a country:</label>
                    <select
                        id="country-select"
                        onChange={handleCountryChange}
                        defaultValue=""
                        ref={selectRef}
                        style={{ marginLeft: '10px', padding: '5px' }}
                    >
                        <option value="" disabled>
                            Select a country
                        </option>
                        {countriesData.countries.map((country: any) => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleClearSelection} style={{ marginLeft: '10px', padding: '5px' }}>
                        Clear
                    </button>
                </div>

                {/* Show details of the selected country */}
                {selectedCountry ? (
                    <div style={{ marginTop: '20px' }}>
                        <h2>Country Details</h2>
                        {loadingCountry && <p>Loading details...</p>}
                        {errorCountry && <p>Error fetching details: {errorCountry.message}</p>}
                        {countryData && (
                            <div>
                                <h3>{countryData.country.name}</h3>
                                <img
                                    src={countryData.country.flags.png}
                                    alt={`${countryData.country.name} flag`}
                                    style={{ width: '150px', borderRadius: '5px' }}
                                />
                                <p>
                                    <strong>Capital:</strong> {countryData.country.capital?.join(', ') || 'N/A'}
                                </p>
                                <p>
                                    <strong>Population:</strong> {countryData.country.population.toLocaleString()}
                                </p>
                                <p>
                                    <strong>Region:</strong> {countryData.country.region}
                                </p>
                                <p>
                                    <strong>Subregion:</strong> {countryData.country.subregion}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Show all countries
                    <div style={{ marginTop: '20px' }}>
                        <h2>All Countries</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            {countriesData.countries.map((country: any) => (
                                <div
                                    key={country.name}
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        width: '200px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <img
                                        src={country.flags.png}
                                        alt={`${country.name} flag`}
                                        style={{ width: '100%', borderRadius: '5px' }}
                                    />
                                    <h3>{country.name}</h3>
                                    <p>Population: {country.population.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ApolloProvider>
    );
};

export default App;
