import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name";

export const useCountry = (countryName) => {
  const [country, setCountry] = useState(null);
  const [found, setFound] = useState(false);

  useEffect(() => {
    if (!countryName) return;

    const fetchCountry = async () => {
      try {
        const response = await axios.get(`${baseUrl}/${countryName}`);
        setCountry(response.data);
        setFound(true);
      } catch (error) {
        console.error("Error fetching country details:", error);
        setFound(false);
      }
    };

    fetchCountry();
  }, [countryName]); 

  return { country, found };
};
