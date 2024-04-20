---
title: Promises - Ejemplos de creación y uso
description: Ejemplos de creación y uso de promises en javascript.
date: 2024-04-20T12:48:32.085Z
preview: ""
draft: false
tags:
  - JavaScript
  - Promises
categories: []
type: default
---

Aquí veremos un ejemplo de creación y uso de promises en javascript.

Cuando utilizamos `fetch` esta solo devuelve una promesa como rechazada si hay un error de red, pero si la respuesta del servidor es un status code 404 o 500 `fetch` no lo considera un error de red y la promesa se resuelve correctamente con esos status en la propiedad `response.status` y con `response.ok` como `false`. Por el contrario, si `response.status` tiene valores entre 200 y 299, `response.ok` será `true`.

Pemos utilizar promises para crear una función `customFetch` que devuelva una promesa rechazada si el status code de la respuesta no está entre 200 y 299 del siguiente modo:

```javascript
function customFetch(url) {
  return new Promise(async (resolve, reject) => {
    let fetchPromise = fetch(url);
    fetchPromise
      .then((response) => {
        if (response.ok) {
          resolve(response);
        } else {
          reject(
            new Error(
              `Unexpected status code: ${response.status} ${response.statusText}`
            )
          );
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
```

Vamos a tener también una función `delay` que utiliza una promise para generar un retraso en la ejecución y poder visualizar los pasos en la consola.

```javascript
function delay(time = 1000) {
  return new Promise((resolve) => {
    console.log("Delaying...");
    setTimeout(() => {
      resolve();
    }, time || 1000);
  });
}
```

Y a continuación el código para probar nuestra función `customFetch`:

```javascript
console.log("*** Loading...");
await delay();

//con error
let promise = customFetch("https://southparkquotes.onrender.com/v1x/quotes");

//sin error
//let promise = customFetch("https://southparkquotes.onrender.com/v1/quotes");

promise
  .then((response) => {
    console.log("Response: ", response);
  })
  .finally(() => {
    console.log("*** Loaded.");
  })
  .catch((error) => {
    console.error("Catched Error : ", error.message);
  });
```

Se puede probar cambiar la url de la API para ver cómo se comporta la promesa en cada caso.

Para una explicación detallada de cómo funcionan las promises, recomiendo el libro: [Understanding JavaScript Promises ](https://leanpub.com/understanding-javascript-promises) de Nicholas C. Zakas
