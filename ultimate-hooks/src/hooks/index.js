import { useState, useEffect } from "react";
import axios from "axios";

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const response = await axios.get(baseUrl);
      setResources(response.data);
    };

    fetchAll();
  }, [baseUrl]);

  const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject);
    setResources(resources.concat(response.data));
  };

  return [
    resources,
    {
      create,
    },
  ];
};
export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  
  return {
    type,
    value,
    onChange,
    
  };
};
