import Link from "next/link";
import Date from "./components/date";
import { getSortedPostsData } from "./lib/posts";
import TagSearch from "./components/tagsearch";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  //set remueve los duplicados
  /*   const allTags = new Set(allPostsData.map(({tags}) => tags).flat());
   */

  return (
    <section>
      {/*  <h2 className="apuntes__titulo">tags:</h2>
      <div>{`Tags: `} 
        {[...allTags].map((tag) => (`${tag}, `))}
      </div> */}

      <h2 className="apuntes__titulo">Apuntes destacados:</h2>
      <ul>
        {allPostsData
          .filter(({ categories }) => categories?.includes("destacado"))
          .filter(({ draft }) => draft === false)
          .map(({ id, date, title, draft }) => (
            <li className="apuntes__item" key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small>
                <Date dateString={date} />
              </small>
            </li>
          ))}
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
