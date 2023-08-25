---
title: Apuntes de Node / Express (estructuras básicas)
description: "Apuntes de Node / Express (estructuras básicas)"
date: 2023-04-30T12:33:23.615Z
preview: ""
draft: false
tags: [Node, Express, Apuntes]
categories: [destacado]
---

- [Estructura básica de un servidor en Node](#estructura-básica-de-un-servidor-en-node)
- [Estructura básica de un servidor en Express](#estructura-básica-de-un-servidor-en-express)
- [Servidor en Express con middleware](#servidor-en-express-con-middleware)
- [Servidor de archivos estáticos en Express](#servidor-de-archivos-estáticos-en-express)
- [Routing con redireccionamiento en Express](#routing-con-redireccionamiento-en-express)
- [Utilizar las views / templates de Express](#utilizar-las-views--templates-de-express)
- [Manejo de errores en Express](#manejo-de-errores-en-express)

## Estructura básica de un servidor en Node

Ejemplo de estructura básica de un servidor en Node: se crea el servidor y se le pasa una callback function (requestHandler en este caso) que va a manejar los pedidos y respuestas del servidor. Se le va a pasar un objeto request (req) en el que llega la información del pedido, y otro response (res) en el que va la respuesta. En este ejemplo además se procesa la request para hacer un routing.

```js showLineNumbers
import { createServer } from "http";
function requestHandler(req, res) {
  console.log("In comes a request to: ", req.url);

  if (req.url === "/") {
    res.end("Welcome to the homepage!");
  } else if (req.url === "/about") {
    res.end("Welcome to the about page!");
  } else {
    res.end("Error! File not found.");
  }
}
const server = createServer(requestHandler);
server.listen(3000);
```

## Estructura básica de un servidor en Express

Ejemplo básico de servidor en Express (con routing).

```js
import express from "express";
import { createServer } from "http";
const app = express();

app.get("/", function (request, response) {
  response.end("Welcome to my homepage!");
});
app.get("/about", function (request, response) {
  response.end("Welcome to the about page!");
});
app.get("/weather", function (request, response) {
  response.end("The current weather is NICE.");
});

app.use(function (request, response) {
  response.statusCode = 404;
  response.end("404!");
});

createServer(app).listen(3000);
```

## Servidor en Express con middleware

Podría procesarse todo en una sola función como en ejemplo básico de (vanilla) Node, pero Express permite procesar todo mediante un array de funciones intermediarias para estructurar mejor el código. En este ejemplo se divide la respuesta de una función que se ocupa del logging.

```js showLineNumbers
import express from "express";
import { createServer } from "http";

const app = express();

// middleware para logging
app.use(function (request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});

//respuesta
app.use(function (request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello, world!");
});
createServer(app).listen(3000);
```

## Servidor de archivos estáticos en Express

Para responder a la request con archivos estáticos como HTML, se utiliza el middleware static al que se le pasa como parámetro la carpeta en la que van a estar los archivos. Si se especifica el archivo en la url (ej. localhost:3000/ejemplo.html) va a buscar directamente ese, sino busca index.

```js
import express from "express";
import { static as staticPath } from "express";
// tuve que cambiarle el nombre para evitar el error 'static' is a reserved word in strict mode. Modules are automatically in stric mode.
import { createServer } from "http";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

var app = express();
var publicPath = resolve(__dirname, "public");
app.use(staticPath(publicPath));
app.use(function (request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Looks like you didn't find a static file.");
});
createServer(app).listen(3000);
```

## Routing con redireccionamiento en Express

La respuesta tiene que ser así:

```js
response.redirect("/hello/world");
response.redirect("http://expressjs.com");
```

## Utilizar las views / templates de Express

Primero hay que instalar alguna de las view engines disponibles. En este caso EJS (Embedded JavaScript):
`npm install ejs --save `

El código de la app:

```js
import express from "express";
import { createServer } from "http";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("views", resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (request, response) {
  response.render("index", {
    message: "Hey everyone! This is my webpage.",
  });
});

createServer(app).listen(3001);
```

Hay que crear una carpeta views y allí un archivo ejs con el template (index.ejs en este caso):

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello, world!</title>
  </head>
  <body>
    <%= message %>
  </body>
</html>
```

## Manejo de errores en Express

En Express se pueden crear funciones de middleware que se ocupen del manejo de errores. En general se colocan al final de lista de funciones. Cuando otra función llama a next con un argumento: `next(err);` se interrumpe el proceso de las funciones y salta a la función que se ocupa del manejo de los errores, que se define por tener cuatro parámetros en lugar de tres `(err, req, res, next)`.

Por ejemplo, este código llama a next con el objeto del error:

```js
app.use(function (req, res, next) {
  res.sendFile(filePath, function (err) {
    if (err) {
      next(new Error("Error sending file!"));
    }
  });
});
```

Luego puede haber debajo una middleware que haga un log del error (y además vuelve a invocar a la siguiente función de manejo de errores pasandole el objeto):

```js
app.use(function (err, req, res, next) {
  console.error(err);
  next(err);
});
```

La siguiente podría ser la que muestre el error y termine el proceso:

```js
pp.use(function (err, req, res, next) {
  res.status(500);
  res.send("Internal server error.");
});
```
