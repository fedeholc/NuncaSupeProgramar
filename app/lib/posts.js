import matter from "gray-matter";
import fs from "fs";
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

export async function getSortedPostsData() {
  // Get file names  under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  //el filter evita que si hay otro tipo de archivo tire error
  const allPostsData = fileNames
    .filter((fileName) => {
      return path.extname(fileName) === ".md";
    })
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "");

      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = JSON.parse(JSON.stringify(matter(fileContents)));

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

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

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${decodeURI(id)}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
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
