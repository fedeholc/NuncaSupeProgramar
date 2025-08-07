import Link from "next/link";
import Date from "./components/date";
import { getAllPostsContentForFuzzy, getSortedPostsData } from "./lib/posts";
import SearchClient from "./components/HomeClient";
import TagList from "./components/taglist";

export default async function Home() {
  const allPostsData = await getSortedPostsData();
  const allPostContent = await getAllPostsContentForFuzzy();

  return (
    <div style={{ padding: "0.5rem" }}>
      <SearchClient
        posts={allPostContent.filter(({ draft }) => draft === false)}
      />

      <div style={{ padding: "1rem 0" }}>
        <TagList></TagList>
      </div>
      <section className="layout__main">
        
        <h2 className="apuntes__titulo">Apuntes destacados:</h2>
        <ul>
          {allPostsData
            .filter(({ categories }) => categories?.includes("destacado"))
            .filter(({ draft }) => draft === false)
            .map(({ id, date, title }) => (
              <li className="apuntes__item" key={id}>
                <Link href={`/posts/${id}`}>{title}</Link>
                <br />
                <small>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
