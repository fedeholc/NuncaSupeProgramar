import Image from "next/image";
import Link from "next/link";
import Date from "../../components/date";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import prism from "remark-prism";
import { getAllPostIds, getPostData } from "../../lib/posts";

export default async function Post({ params }) {
  const postData = await getPostData(params.id);

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

      <div className="post__tags">Tags: {tags}</div>
    </section>
  );
}
