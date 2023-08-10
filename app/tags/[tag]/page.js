import Date from "../../components/date";
import { getPostData, getSortedPostsData } from "../../lib/posts";
import Link from "next/link";

export default async function Tags({ params }) {
  const allPostsData = await getSortedPostsData();

  //decodeURI resuelve el problema de las tildes en los tags

  return (
    <section>
      <h2 className="apuntes__titulo">
        Apuntes con tag {decodeURI(params.tag)}:
      </h2>
      <ul>
        {allPostsData
          .filter(({ tags }) =>
            tags
              .map((e) => e.toLowerCase())
              .includes(decodeURI(params.tag).toLowerCase())
          )
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
    </section>
  );
}
