import React, { useState, useRef } from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { client } from './apollo';
import { FaSun, FaMoon } from 'react-icons/fa'; // Importa los iconos de sol y luna

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
    const [darkMode, setDarkMode] = useState(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    const handleClearSelection = () => {
        setSelectedCountry(null);
        if (selectRef.current) {
            selectRef.current.value = "";
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const { data: countryData, loading: loadingCountry, error: errorCountry } = useQuery(GET_COUNTRY, {
        variables: { name: selectedCountry },
        skip: !selectedCountry,
    });

    if (loadingCountries) return <p className="text-center text-gray-500">Loading countries...</p>;
    if (errorCountries) return <p className="text-center text-red-500">Error fetching countries: {errorCountries.message}</p>;

    return (
        <ApolloProvider client={client}>
            <div className={`p-8 ${darkMode ? 'dark' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Country Browser</h1>
                    <button onClick={toggleDarkMode} className="bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded p-2">
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>

                <div className="mb-4">
                    <label htmlFor="country-select" className="mr-2">Search for a country:</label>
                    <select
                        id="country-select"
                        onChange={handleCountryChange}
                        defaultValue=""
                        ref={selectRef}
                        className="border border-gray-300 rounded p-2"
                    >
                        <option value="" disabled>Select a country</option>
                        {countriesData.countries.map((country: any) => (
                            <option key={country.name} value={country.name}>{country.name}</option>
                        ))}
                    </select>
                    <button onClick={handleClearSelection} className="ml-2 bg-blue-500 text-white rounded p-2">Clear</button>
                </div>

                {selectedCountry ? (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-2">Country Details</h2>
                        {loadingCountry && <p className="text-center text-gray-500">Loading details...</p>}
                        {errorCountry && <p className="text-center text-red-500">Error fetching details: {errorCountry.message}</p>}
                        {countryData && (
                            <div className="border border-gray-300 rounded p-4">
                                <h3 className="text-xl font-bold mb-2">{countryData.country.name}</h3>
                                <img src={countryData.country.flags.png} alt={`${countryData.country.name} flag`} className="w-40 h-auto rounded mb-2" />
                                <p><strong>Capital:</strong> {countryData.country.capital?.join(', ') || 'N/A'}</p>
                                <p><strong>Population:</strong> {countryData.country.population.toLocaleString()}</p>
                                <p><strong>Region:</strong> {countryData.country.region}</p>
                                <p><strong>Subregion:</strong> {countryData.country.subregion}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold mb-2">All Countries</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {countriesData.countries.map((country: any) => (
                                <div key={country.name} className="border border-gray-300 rounded p-4 text-center">
                                    <img src={country.flags.png} alt={`${country.name} flag`} className="w-full h-auto rounded mb-2" />
                                    <h3 className="text-lg font-bold">{country.name}</h3>
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