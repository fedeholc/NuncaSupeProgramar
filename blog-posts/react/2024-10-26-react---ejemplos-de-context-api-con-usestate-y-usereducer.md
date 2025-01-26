---
title: React - Ejemplos de Context API con useState y useReducer
description: React - Ejemplos de Context API con useState y useReducer
date: 2024-10-26T09:55:59.178Z
preview: ""
draft: false
tags:
  - Context API
  - JavaScript
  - React
categories: []
---

He aquí algunos ejemplos de cómo usar `useContext` con `useState` y `useReducer` en React, con pequeñas variaciones.

Se puede encontrar el código completo en [este repositorio](https://github.com/fedeholc/apuntes/tree/main/react-context).

El primero es un ejemplo simple de un contador con un estado. Los siguientes tres ejemplifican como podría manejarse el theme de una app utilizando useState y useReducer, pero creando componentes para proveer el contexto, y utilizando o no un hook en el medio.

## Ejemplo simple - contador con useState

Es el ejemplo más sencillo. Creamos y exportamos el contexto en `Contexts.ts`.

```ts
// Contexts.ts
import { createContext, Dispatch, SetStateAction } from "react";

export const CountContext = createContext<{
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}>({ count: 0, setCount: () => {} });
```

En `App.tsx` creamos el estado y lo pasamos como valor al proveedor del contexto.

```tsx
// App.tsx
import { useState } from "react";
import { CountContext } from "./Contexts";
import Counter from "./Counter";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CountContext.Provider value={{ count, setCount }}>
        <Counter />
      </CountContext.Provider>
    </>
  );
}

export default App;
```

El componente `Counter` recibe el contexto con `useContext` y muestra el valor del contador y un botón para incrementarlo.

```tsx
// Counter.tsx
import { useContext } from "react";
import { CountContext } from "./Contexts";

export default function Counter() {
  const { count, setCount } = useContext(CountContext);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>increase</button>
    </div>
  );
}
```

## Ejemplos Themes 1, 2 y 3

Dado que los tres ejemplos son similares, voy a explicarlos conjuntamente.

En `Contexts.ts` se crean y exportan los contextos. La diferencia entre el primero y el segundo es que el primero se inicializa con un valor por defecto y el segundo con `null`. Como el segundo ejemplo va a utilizar un hook para obtener el contexto, se lo puede inicializar null y manejar allí si el contexto existe o no. Hacer eso sin un hook de por medio requiere de escribir más código ya que deberían declararse las variables y luego ver si existe el contexto para asignarselo o de lo contrario asignarle un valor por defecto. El tercer ejemplo va a utilizar `useReducer` en lugar de `useState`.

Actualización: la creación de los contextos que se hace en `Contexts.ts` la podría haber hecho en `ThemeProvider.tsx`.

```ts
// Context.ts
import { createContext, Dispatch, SetStateAction } from "react";

export const ThemeContext1 = createContext<{
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
}>({ theme: "Light", setTheme: () => {} });

export const ThemeContext2 = createContext<{
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
} | null>(null);

export const ThemeContext3 = createContext<{
  theme: string;
  dispatchTheme: Dispatch<string>;
} | null>(null);
```

En lugar de manejar el estado en `App.tsx` y pasarlo como valor al proveedor del contexto, lo llevamos a componentes particulares `ThemeProvider1`, `ThemeProvider2` y `ThemeProvider3` para que desde ahí se proven los valor de los estados.
Luego esos valores van a ser consumidos y modificado desde los componentes `ThemeSelector1`, `ThemeSelector2`, `ThemeSelector3`.

En `App.tsx`tenemos:

```tsx
// App.tsx
import { ThemeSelector1 } from "./ThemeSelector";
import { ThemeProvider1 } from "./ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider1>
        <h1>Theme Example 1</h1>
        <ThemeSelector1 />
      </ThemeProvider1>
      <ThemeProvider2>
        <h1>Theme Example 2</h1>
        <ThemeSelector2 />
      </ThemeProvider2>
      <ThemeProvider3>
        <h1>Theme Example 3</h1>
        <ThemeSelector3 />
      </ThemeProvider3>
    </>
  );
}
export default App;
```

En el componente provider vamos a manejar el estado haciendo que cuando se monte, se busque en el localStorage si hay un tema guardado y si no, se setea el tema por defecto. Además se guarda el tema en el localStorage cada vez que cambia.
Aquí no hay diferencia entre el primer ejemplo y el segundo, pero en el tercero se utiliza `useReducer` en lugar de `useState`.

```tsx
// ThemeProvider.tsx
import { ThemeContext1, ThemeContext2, ThemeContext3 } from "./Contexts";
import { useState, useEffect, useReducer } from "react";

export function ThemeProvider1({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext1.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext1.Provider>
  );
}

export function ThemeProvider2({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext2.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext2.Provider>
  );
}

export function ThemeProvider3({ children }: { children: React.ReactNode }) {
  function themeReducer(state: string, action: string) {
    switch (action) {
      case "Light":
        return "Light";
      case "Dark":
        return "Dark";
      default:
        return state;
    }
  }

  const savedTheme = localStorage.getItem("theme") || "light";

  const [theme, dispatchTheme] = useReducer(themeReducer, savedTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext3.Provider value={{ theme, dispatchTheme }}>
      {children}
    </ThemeContext3.Provider>
  );
}
```

En los componentes `ThemeSelector` se recibe el contexto y se muestra el valor del tema y un botón para cambiarlo.
Entre el primer ejemplo y el segundo la diferencia es que el primero trae el contexto con `useContext` y el segundo con un hook que se encarga de manejar si el contexto existe o no. El tercero utiliza también un hook junto con `useReducer`.

```tsx
// ThemeSelector.tsx
import { ThemeContext1 } from "./Contexts";
import { useContext } from "react";
import { useThemeContext2, useThemeContext3 } from "./useThemeContext";

export function ThemeSelector1() {
  const { theme, setTheme } = useContext(ThemeContext1);

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("Light")}>Light</button>
      <button onClick={() => setTheme("Dark")}>Dark</button>
    </div>
  );
}

export function ThemeSelector2() {
  const { theme, setTheme } = useThemeContext2();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("Light")}>Light</button>
      <button onClick={() => setTheme("Dark")}>Dark</button>
    </div>
  );
}

export function ThemeSelector3() {
  const { theme, dispatchTheme } = useThemeContext3();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => dispatchTheme("Light")}>Light</button>
      <button onClick={() => dispatchTheme("Dark")}>Dark</button>
    </div>
  );
}
```

Los hooks para obtener el contexto en el segundo y tercer ejemplo son los siguientes:

```tsx
// useThemeContext.ts
import { ThemeContext2, ThemeContext3 } from "./Contexts";
import { useContext } from "react";

export function useThemeContext2() {
  const myThemeContext2 = useContext(ThemeContext2);
  if (!myThemeContext2) {
    return {
      theme: "Light",
      setTheme: () => {},
    };
  }
  return myThemeContext2;
}

export function useThemeContext3() {
  const myThemeContext3 = useContext(ThemeContext3);
  if (!myThemeContext3) {
    return {
      theme: "Light",
      dispatchTheme: () => {},
    };
  }
  return myThemeContext3;
}
```
