import { getSortedPostsData } from "../lib/posts";
import { redirect } from "next/navigation";
import TagSearch from "./tagsearch";
import Link from "next/link";
export default async function TagList() {
  const allPostsData = await getSortedPostsData();

  //set remueve los duplicados
  const allTags = new Set(
    allPostsData
      .map(({ tags }) => tags)
      .flat()
      //.map((tag) => tag.toLowerCase())
      //.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)) //poner en mayúscula la primera letra
      .sort()
  );

  const allTagsArray = [...allTags];

  const allTagsToCount = allPostsData
    .map(({ tags }) => tags)
    .flat()
    //.map((tag) => tag.toLowerCase())
    //.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1));

  function countTags(tag) {
    let count = 0;
    allTagsToCount.map((postTag) => {
      if (postTag == tag) {
        count++;
      }
    });
    return count;
  }

  const allTagsToShow = allTagsArray.map((tag) => {
    return {
      tag: tag,
      count: countTags(tag),
    };
  });

  async function rutear(data) {
    "use server";

    if (data.get("tagInput") != "") {
      let ruta = encodeURI(`/tags/${data.get("tagInput")}`);
      redirect(ruta);
    }
  }

  return (
    <div>
      <details className="tag_list__details">
        <summary className="tag_list__summary">lista de etiquetas</summary>
        <div className="tag_list">
          {allTagsToShow.map((tagCount) => {
            return (
              <div className="tag_list__item" key={tagCount.tag}>
                <Link href={`/tags/${tagCount.tag}`}>{`${tagCount.tag}`}</Link>
                <span className="tag_list__count"> ({tagCount.count})</span>
              </div>
            );
          })}
        </div>
        <TagSearch></TagSearch>
      </details>
    </div>
  );
}
