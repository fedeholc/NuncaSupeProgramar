---
title: ¿Cómo hacer un blog como este?
description: Explicación de cómo fui haciendo este blog
date: 2023-04-16T20:40:07.954Z
preview: ""
draft: false
tags:
  - NextJS
  - CSS
  - Fuentes
  - Tipografía
  - Iconos
  - React Icons
  - Fontjoy
  - Google Fonts
  - Metodología BEM
  - CSS Modules
categories: []
---

### NextJS

- La estructura inicial del blog está tomada del tutorial de aprendizaje de la web de [NextJS](https://nextjs.org/learn/foundations/about-nextjs)

### CSS

- Para nombrar y estructurar el CSS intento utilizar (probablemente no muy bien) la [metodología BEM](https://getbem.com/)
- Probé también utilizar la opción de [CSS Modules](https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css) que proporciona NextJS.

### Markdown

- Las entradas del blog se escriben en archivo con formato [Markdown](https://es.wikipedia.org/wiki/Markdown). Estos archivos contienen al comienzo un "front matter" con metadatos de la entrada (Ej: título, descripción, fecha, tags, etc.) en formato [YAML](https://yaml.org/).
- La extensión [Front Matter CMS](https://frontmatter.codes/) para Visual Studio Code facilita el manejo de los archivos Markdown y sus metadatos.
- Aquí [https://learntheweb.courses/topics/Markdown-yaml-cheat-sheet/](https://learntheweb.courses/topics/markdown-yaml-cheat-sheet/) una cheatsheet de Markdown y YAML
- Con la librería [gray-matter](https://www.npmjs.com/package/gray-matter) se leen los metadatos y el contenido en Markdown desde los archivos.
- Con la librería [remark](https://www.npmjs.com/package/remark) se pasa de Markdown a HTML.

### Syntax Highlighting (resaltado de código)
Para darle color a los bloques de código utilicé [PrismJS](https://prismjs.com/) vía [remark-prism](https://www.npmjs.com/package/remark-prism). Para implementarlo seguí este ejemplo: [https://github.com/leerob/nextjs-prism-markdown](https://github.com/leerob/nextjs-prism-markdown)

### Tipografías

- En el blog se utilizan tres tipografías: "Roboto Mono", "Roboto Slab", y "Karma".
- Hay una web que te muestra tipografías que combinan bien juntas. Se le puede indicar una (o dos) y que a partir de esa te ofrezca otra. La web se llama [Fontjoy](https://fontjoy.com/).
- Se pueden descargar gratuitamente desde [Google Fonts](https://fonts.google.com/).

### Iconos

- Para incorporar iconos utilicé [React Icons](https://github.com/react-icons/react-icons)
