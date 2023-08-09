import Link from "next/link";
import Date from "./components/date";
import { getSortedPostsData } from "./lib/posts";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <section>
      <h2 className="apuntes__titulo">Destacados:</h2>
      <ul>
        {allPostsData
          .filter(({ categories }) => categories.includes("destacado"))
          .map(
            ({ id, date, title, draft }) =>
              !draft && (
                <li className="apuntes__item" key={id}>
                  <Link href={`/posts/${id}`}>{title}</Link>
                  <br />
                  <small>
                    <Date dateString={date} />
                  </small>
                </li>
              )
          )}
      </ul>
      <br />
      <h2 className="apuntes__titulo">Todos los apuntes:</h2>
      <ul>
        {allPostsData
          .filter(({ draft }) => draft === false)
          .map(({ id, date, title, categories }) => (
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
  );
}
