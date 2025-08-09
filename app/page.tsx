import Link from "next/link";
import Date from "./components/date";
import { getAllPostsContentForFuzzy, getSortedPostsData } from "./lib/posts";
import SearchClient from "./components/FuzzySearch/SearchClient";
import TagList from "./components/taglist";

export default async function Home() {
  const allPostsData = await getSortedPostsData();
  const allPostContent = await getAllPostsContentForFuzzy();

  return (
    <div style={{ padding: "0.5rem" }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <div
          style={{
            maxWidth: "800px",
            padding: "0 0 2rem 0rem",
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <SearchClient
            posts={allPostContent.filter(({ draft }) => draft === false)}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto",
        }}
      >
        <section className="layout__main">
          <div className="scrollable">
            <h2 className="apuntes__titulo">Últimos apuntes:</h2>
            <ul>
              {allPostsData
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
          </div>
        </section>
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
        <div style={{ padding: "1rem 0", gridColumn: "1 / span 2" }}>
          <TagList></TagList>
        </div>
      </div>
    </div>
  );
}
