import { useState } from 'react';
import { useCountry } from './hooks';

const Country = ({ country, found }) => {
  if (!found) {
    return <p>Country not found...</p>;
  }

  if (!country) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3>{country.name.common}</h3>
      <div>Capital: {country.capital[0]}</div>
      <div>Population: {country.population}</div>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} width="100" />
    </div>
  );
};

const App = () => {
  const [countryName, setCountryName] = useState('');
  const [search, setSearch] = useState('');
  const { country, found } = useCountry(search);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(countryName);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          placeholder="Enter country name"
        />
        <button type="submit">Find</button>
      </form>

      <Country country={country} found={found} />
    </div>
  );
};

export default App;
