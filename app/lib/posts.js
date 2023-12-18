import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeComponents from "../rehype-components";
import rehypeSlug from "rehype-slug";
import { h, s } from "hastscript";

import rehypePrism from "rehype-prism-plus";

const postsDirectory = path.join(process.cwd(), "blog-posts");

export async function getSortedPostsData() {
  // Get file names  under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
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

  return fileNames.map((fileName) => {
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

  /* esto es para transformar las imágenes del markdown (que se pasan como
   img en html), en Image de next, pero no sirve porque si bien aparecen
   como Image next las está optimizando, no sé por qué. 
   TODO: Con lo cual lo podría sacar,
   o dejar solo para cambiar el tamaño, o agregar alguna clase (habría que probar
    cómo hacer esto, sino hay otros plugins para rehype que lo hacen */

  const Images = (properties) => {
    return h(`Image`, {
      src: `${properties.src}`,
      alt: "",
      //height: 100,
      width: "100%",
    });
  };

  const processed2 = await remark()
    .use(remarkParse)
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
