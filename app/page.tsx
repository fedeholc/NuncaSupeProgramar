import Link from "next/link";
import Date from "./components/date";
import { getAllPostsContentForFuzzy, getSortedPostsData } from "./lib/posts";
import FuzzySearch from "./components/FuzzySearch";

export default async function Home() {
  const allPostsData = await getSortedPostsData();
  const allPostContent = await getAllPostsContentForFuzzy();

  //set remueve los duplicados
  /*   const allTags = new Set(allPostsData.map(({tags}) => tags).flat());
   */

  return (
    <div>
      <h2 className="apuntes__titulo">Buscar apuntes:</h2>
      <FuzzySearch
        posts={allPostContent.filter(({ draft }) => draft === false)}
      />
      <section className="layout__main">
        {/*  <h2 className="apuntes__titulo">tags:</h2>
        <div>{`Tags: `}
          {[...allTags].map((tag) => (`${tag}, `))}
        </div> */}
        <br />
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
