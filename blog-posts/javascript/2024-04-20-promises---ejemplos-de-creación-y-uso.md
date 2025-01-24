---
title: "JavaScript / Promises - Ejemplo de creación, uso, y testing"
description: Ejemplo de creación y uso de promises en javascript, junto con el testing correspondiente.
date: 2024-04-20T12:48:32.085Z
preview: ""
draft: false
tags:
  - JavaScript
  - Promises
  - Testing
  - Mock Service Worker
  - Vitest
  - Fetch
categories: [destacado]
type: default
---

Aquí veremos un ejemplo de creación y uso de promises en javascript, y luego cómo testearlo.

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

Se puede probar cambiar la url de la API para ver cómo se comporta la promesa en cada caso (con y sin error).

Para una explicación detallada de cómo funcionan las promises, recomiendo el libro: [Understanding JavaScript Promises ](https://leanpub.com/understanding-javascript-promises) de Nicholas C. Zakas

## Testing de customFetch

Para hacer el testing de la función `customFetch` utilicé `vitest` junto con la librería [mock service worker](https://mswjs.io/) que permite simular el servidor capturando las llamadas a `fetch`.

Para utilizar `mock service worker` necesitamos tener un archiv con los handlers de las rutas que vamos a simular, en este caso `handlers.js`:

```javascript
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://ok.com", () => {
    return HttpResponse.json({
      rta: "todo ok",
    });
  }),
  http.get("https://devolverErrorDeRed.com", () => {
    return HttpResponse.error();
  }),

  http.get("https://devolver401.com", () => {
    return new HttpResponse(null, { status: 401 });
  }),
];
```

Y la configuración del servidor en `mockserver.js`:

```javascript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
export const mockServer = setupServer(...handlers);
```

Luego nuestro test queda del siguiente modo:

```javascript
import { expect, test, beforeAll, afterAll, afterEach } from "vitest";
import { customFetch } from "./customFetch"; // acá va la ruta de tu archivo customFetch.js
import { mockServer } from "./mockserver.js";

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

test("customFetch arroja Error cuando la respuesta de fetch es un código que no es 200-299", async () => {
  let rtaError = "";
  try {
    const rta = await customFetch("https://devolver401.com");
  } catch (error) {
    rtaError = error.message;
  }
  expect(rtaError).toBe("Error inesperado: 401 Unauthorized");
});

test("customFetch arroja Error cuando la respuesta de fetch es error de red", async () => {
  let rta = "";
  try {
    rta = await customFetch("https://devolverErrorDeRed.com");
  } catch (error) {
    rta = error;
  }
  expect(rta).toBe("Error de red: Failed to fetch");
});

test("customFetch envía correctamente la respuesta", async () => {
  let rta = await customFetch("https://ok.com");
  let rtaOk = await rta.json();
  expect(rtaOk.rta).toBe("todo ok");
});
```
