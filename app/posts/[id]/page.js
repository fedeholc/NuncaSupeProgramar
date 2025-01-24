import Date from "../../components/date";
import { getPostData, getPostIds } from "../../lib/posts";
import Link from "next/link";

// TODO: ver que se pueden generar las páginas de tags con generateStaticParams
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params
export async function generateStaticParams() {
  const postsIds = getPostIds();

  let ids = postsIds.map((post) => ({
    id: post,
  }));
  return ids;
}

export default async function Post({ params }) {
  const { id } = await params;

  const postData = await getPostData(id);

  let tags = "";
  postData.tags.forEach((tag, index) => {
    tags = tags + tag + ", ";
  });
  tags = tags.slice(0, tags.length - 2); // le quita la coma y el espacio a la última */
  return (
    <section className="post__container">
      <div className="post__fecha">
        <Date dateString={postData.date} />
      </div>
      <h1 className="post__titulo">{postData.title}</h1>
      <div
        className="post__content"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
      {/*       TODO: falta css para las tags links
       */}{" "}
      <div className="post__tags">
        Tags:&nbsp;
        {tags &&
          postData.tags.map((e) => {
            return (
              <div key={e}>
                <Link href={`/tags/${e.toLowerCase()}`} key={e}>
                  {e}
                </Link>
                <span></span>
                &nbsp;
              </div>
            );
          })}
      </div>
    </section>
  );
}
