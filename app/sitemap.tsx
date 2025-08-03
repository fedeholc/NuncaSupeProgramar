import { getSortedPostsData } from "./lib/posts";

export default async function sitemap() {
  const allPostsData = await getSortedPostsData();

  const sitemap = allPostsData
    .filter(({ draft }) => draft === false)
    .map(({ id, date, /* title, categories */ }) => {
      return {
        url: `https://nsp.fedeholc.ar/posts/${id}`,
        lastModified: date,
        changeFrequency: "weekly",
        priority: 1,
      };
    });
  return sitemap;

  /*  return [
    {
      url: "https://acme.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://acme.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]; */
}
