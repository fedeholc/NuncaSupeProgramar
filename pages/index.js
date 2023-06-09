// TODO: poner una searchbar
// TODO: hacer que no muestre los post que estan como borradores
// TODO: implementar categoría de destacados.
// TODO: colores logo

import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import Link from "next/link";
import Date from "../components/date";
import { getSortedPostsData } from "../lib/posts";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <section>
        <h2 className="apuntes__titulo">Apuntes:</h2>
        <ul>
          {allPostsData.map(({ id, date, title }) => (
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
    </Layout>
  );
}
