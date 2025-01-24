---
title: JavaScript - Apuntes sobre performance y HTML Canvas
description: Apuntes sobre performance utilizando HTML Canvas
date: 2024-02-07T12:35:13.760Z
preview: ""
draft: false
tags:
  - HTML
  - Canvas
  - Performance
  - JavaScript
categories: [destacado]
slug: apuntes-sobre-performance-html-canvas
---

Actualmente estoy trabajando en una aplicación que utiliza HTML Canvas para realizar modificaciones a imágenes. Dejo aquí algunos apuntes sobre problemas de performance con los que me he ido encontrando y posibles soluciones.

Para procesar las imágenes es mejor **utilizar un OffscreenCanvas** que un Canvas, luego para mostrarlas se hace la conversión.

**El renderizado de figuras es mejor que el procesado de cada pixel de un ImageData.** Por ejemplo, para agregar un borde a una imagen, se podría realizar modificando el ImageData del siguiente modo:

```javascript
function imgAddBorder(
    imageData: ImageData,
    options?: ProcessOptionsType
  ): ImageData {
    let borderSize = 0,
      borderHeight = 0,
      borderWidth = 0;

    let borderColor = "#ffffff";

    if (options?.BorderPixels && parseInt(options?.BorderPixels) > 0) {
      borderSize = parseInt(options.BorderPixels) * 2;
      borderWidth = borderSize;
      borderHeight = borderSize;
    } else {
      if (options?.BorderPercent) {
        borderSize = parseInt(options.BorderPercent);
        borderWidth = (imageData.width * borderSize) / 100;
        borderHeight = (imageData.height * borderSize) / 100;
      }
    }

    if (options?.BorderColor) {
      borderColor = options.BorderColor;
    }

    const canvasTemp = new OffscreenCanvas(
      imageData.width + borderWidth,
      imageData.height + borderHeight
    );
    const ctxTemp = canvasTemp.getContext("2d", {
      willreadFrequently: true,
    }) as OffscreenCanvasRenderingContext2D;

    canvasTemp.width = imageData.width + borderWidth;
    canvasTemp.height = imageData.height + borderHeight;


    const backgroundImageData = ctxTemp?.createImageData(
      imageData.width + borderWidth || 0,
      imageData.height + borderHeight || 0
    );

    const { red, green, blue } = hexToRgb(borderColor);

    if (backgroundImageData) {
      for (let i = 0; i < backgroundImageData.data.length; i += 4) {
        backgroundImageData.data[i] = red;
        backgroundImageData.data[i + 1] = green;
        backgroundImageData.data[i + 2] = blue;
        backgroundImageData.data[i + 3] = 255;
      }

      ctxTemp?.putImageData(backgroundImageData, 0, 0);
      ctxTemp?.putImageData(imageData, borderWidth / 2, borderHeight / 2);

    const resultImageData = ctxTemp?.getImageData(
      0,
      0,
      imageData.width + borderWidth,
      imageData.height + borderHeight
    ) as ImageData;

    return resultImageData;
  }
```

Pero es mejor hacerlo de la siguiente manera, utilizando un rectángulo:

```javascript
function imgAddBorder(
    imageData: ImageData,
    options?: ProcessOptionsType
  ): ImageData {
    let borderSize = 0,
      borderHeight = 0,
      borderWidth = 0;

    let borderColor = "#ffffff";

    if (options?.BorderPixels && parseInt(options?.BorderPixels) > 0) {
      borderSize = parseInt(options.BorderPixels) * 2;
      borderWidth = borderSize;
      borderHeight = borderSize;
    } else {
      if (options?.BorderPercent) {
        borderSize = parseInt(options.BorderPercent);
        borderWidth = (imageData.width * borderSize) / 100;
        borderHeight = (imageData.height * borderSize) / 100;
      }
    }

    if (options?.BorderColor) {
      borderColor = options.BorderColor;
    }

    const canvasTemp = new OffscreenCanvas(
      imageData.width + borderWidth,
      imageData.height + borderHeight
    );
    const ctxTemp = canvasTemp.getContext("2d", {
      willreadFrequently: true,
    }) as OffscreenCanvasRenderingContext2D;

    canvasTemp.width = imageData.width + borderWidth;
    canvasTemp.height = imageData.height + borderHeight;

    ctxTemp.fillStyle = borderColor;
    ctxTemp.fillRect(0, 0, canvasTemp.width, canvasTemp.height);
    ctxTemp.putImageData(imageData, borderWidth / 2, borderHeight / 2);

    const resultImageData = ctxTemp?.getImageData(
      0,
      0,
      imageData.width + borderWidth,
      imageData.height + borderHeight
    ) as ImageData;

    return resultImageData;
  }
```

En los casos en los que se va a utilizar ImageData y se va a recorrer cada pixel de la imagen, hay que **tener cuidado con el llamado repetitivo a funciones**. Por ejemplo, la siguiente función converte un color hexadecimal a RGB:

```javascript
function hexToRgb(hexColor: string): {
  red: number,
  green: number,
  blue: number,
} {
  // Elimina el "#" si está presente
  let color = hexColor.charAt(0) === "#" ? hexColor.substring(1, 7) : hexColor;

  // Convierte el color hexadecimal a RGB
  let red = parseInt(color.substring(0, 2), 16);
  let green = parseInt(color.substring(2, 4), 16);
  let blue = parseInt(color.substring(4, 6), 16);

  return { red, green, blue };
}
```

Hay que hacer la conversión a RGB antes de recorrer el ImageData de esta forma:

```javascript
const { red, green, blue } = hexToRgb(borderColor);

for (let i = 0; i < backgroundImageData.data.length; i += 4) {
  backgroundImageData.data[i] = red;
  backgroundImageData.data[i + 1] = green;
  backgroundImageData.data[i + 2] = blue;
  backgroundImageData.data[i + 3] = 255;
}
```

No así:

```javascript
const { red, green, blue } = hexToRgb(borderColor);

for (let i = 0; i < backgroundImageData.data.length; i += 4) {
  backgroundImageData.data[i] = hexToRgb(borderColor).red;
  backgroundImageData.data[i + 1] = hexToRgb(borderColor).green;
  backgroundImageData.data[i + 2] = hexToRgb(borderColor).blue;
  backgroundImageData.data[i + 3] = 255;
}
```

Ya que si se lo hace dentro del bucle, llamando a la función `hexToRgb` por cada pixel de la imagen, es notorio el impacto en la performance.
