import matter from "gray-matter";
import fs from "fs/promises";
import path from "path";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeComponents from "../rehype-components";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import { h, s } from "hastscript";

import rehypePrism from "rehype-prism-plus";

const postsDirectory = path.join(process.cwd(), "blog-posts");

async function getAllFiles(directoryPath) {
  let filesList = [];

  try {
    const files = await fs.readdir(directoryPath, { withFileTypes: true }); // Lee el contenido del directorio
    for (const file of files) {
      const filePath = path.join(directoryPath, file.name); // Construye la ruta completa

      if (file.isDirectory()) {
        // Si es un directorio, llama a la función recursivamente
        const subDirectoryFiles = await getAllFiles(filePath);
        filesList = filesList.concat(subDirectoryFiles); // Añade los archivos de los subdirectorios
      } else {
        filesList.push(filePath); // Si es un archivo, lo añade a la lista
      }
    }
  } catch (error) {
    console.error("Error al leer el directorio:", error);
    throw error;
  }

  return filesList;
}

export async function getSortedPostsData() {
  const fileNames = await getAllFiles(postsDirectory);

  const filteredFileNames = fileNames.filter((fileName) => {
    return path.extname(fileName) === ".md";
  });

  const allPostsData = await Promise.all(
    filteredFileNames.map(async (fileName) => {
      //remove path from fileName

      const file = path.basename(fileName);

      const id = file.replace(/\.md$/, "");

      const fileContents = await fs.readFile(fileName, "utf8");

      const matterResult = JSON.parse(JSON.stringify(matter(fileContents)));

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    })
  );

  // Sort posts by date
  let sortedPostsData = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  //console.log("sortedPostsData", sortedPostsData);
  return sortedPostsData;
}

export async function getAllPostIds() {
  const fileNames = await fs.readdir(postsDirectory);

  return fileNames
    .filter((fileName) => {
      return path.extname(fileName) === ".md";
    })
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ""),
        },
      };
    });
}

export async function getPostIds() {
  const fileNames = await fs.readdir(postsDirectory);

  return fileNames
    .filter((fileName) => {
      return path.extname(fileName) === ".md";
    })
    .map((fileName) => {
      return fileName.replace(/\.md$/, "");
    });
}

export async function getPostData(id) {
  //Antes cuando no se podían usar subdirectorios para guardar los posts, con el id ya se podía construir el path porque eran todos iguales ej 'blog-posts/2021-08-01-una-prueba.md' es decir directorio+id+'.md', pero ahora hay que buscar el archivo que tenga el id en el nombre entre los subdirectorios y obtener el path completo.

  const fileNames = await getAllFiles(postsDirectory);
  const filteredFileNames = fileNames.filter((fileName) => {
    return path.extname(fileName) === ".md";
  });

  let fullPath = "";

  filteredFileNames.forEach((fileName) => {
    const file = path.basename(fileName);
    const idFile = file.replace(/\.md$/, "");

    if (idFile === decodeURI(id)) {
      fullPath = fileName;
    }
  });

  const fileContents = await fs.readFile(fullPath, "utf8");
  const matterResult = JSON.parse(JSON.stringify(matter(fileContents)));

  /* esto era para transformar las imágenes del markdown (que se pasan como
   img en html), en Image de next, pero no funcionó. */

  const Images = (properties) => {
    return h("Image", {
      src: `${properties.src.slice(7)}`, //remueve "public/" de la ruta de la imagen
      alt: properties.alt,
      //height: 100,
      //width: "100%", //ver si en lugar de ponerlo acá lo puse en el css
    });
  };

  const processed2 = await remark()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypeComponents, {
      components: {
        img: Images,
      },
    })
    .use(rehypeSlug)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(matterResult.content);

  const contentHtml = processed2.value;

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
