---
title: React - Custom Hook para carga de datos separada de la vista
description: ""
date: 2024-12-13T13:12:26.810Z
preview: ""
draft: false
tags:
  - Custom Hooks
  - Data Fetching
  - JavaScript
  - React
categories: []
slug: react-custom-hook-para-carga-de-datos-separada-de-la-vista
---

[Aquí](https://github.com/fedeholc/apuntes/tree/main/react-custom-hook-data-fetching) el repositorio con el código completo.

El problema a resolver es el siguiente. Supongamos que creamos un componente que necesita cargar datos de una API y mostrarlos en pantalla. Queremos separar la lógica de carga de datos de la vista del componente para mantenerlo más limpio y reutilizable. Para ello, podemos crear un custom hook que se encargue de la carga de datos y devuelva los resultados al componente.

Si hiciera falta, el código que está en el componente `App` podría pasarse a un componente contenedor (Ej. `CountriesContainer`), e importarlo donde queramos usarlo.

```tsx
import { useState, useEffect } from "react";

import "./App.css";

interface Country {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
}
export default function App() {
  const { data, isLoading, error } = useFetchCountries();
  return (
    <>
      <div>Countries</div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <CountriesList countries={data} />}
    </>
  );
}

function CountriesList({ countries }: { countries: Country[] }) {
  return (
    <ul>
      {countries &&
        countries.map((country) => (
          <li key={country.name.common}>{country.name.common}</li>
        ))}
    </ul>
  );
}

function useFetchCountries(): {
  data: Country[];
  isLoading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
          return;
        }
        const data = await response.json();
        if (!data) {
          setError("No data received");
          return;
        }
        setData(data);
      } catch (error) {
        if (error instanceof Error) {
          // Log the error to an external service
          console.error("Error caught:", error);
          // Set a user-friendly error message
          setError(`An unexpected error occurred: ${error.message}`);
        } else {
          // Handle non-Error objects
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, isLoading, error };
}
```
