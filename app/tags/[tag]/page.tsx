import Date from "../../components/date";
import { getSortedPostsData } from "../../lib/posts";
import Link from "next/link";

export default async function Tags({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  //TODO: esto es muy ineficiente, debería traer solo los posts con el tag que se está buscando, e incluso solo la info necesaria para mostrar en la lista
  const allPostsData = await getSortedPostsData();

  //decodeURI resuelve el problema de las tildes en los tags
  const { tag } = await params;

  return (
    <section>
      <h2 className="apuntes__titulo">Apuntes con tag {decodeURI(tag)}:</h2>
      <ul>
        {allPostsData
          .filter(({ tags }) =>
            tags
              .map((e: string) => e.toLowerCase())
              .includes(decodeURI(tag).toLowerCase())
          )
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
  );
}
