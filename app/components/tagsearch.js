import { getSortedPostsData } from "../lib/posts";
import { redirect } from "next/navigation";

export default async function TagSearch() {
  const allPostsData = await getSortedPostsData();

  //set remueve los duplicados
  const allTags = new Set(
    allPostsData
      .map(({ tags }) => tags)
      .flat()
      .map((tag) => tag.toLowerCase())
      .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)) //poner en mayúscula la primera letra
      .sort()
  );

  const allTagsArray = [...allTags];

  async function rutear(data) {
    "use server";

    if (data.get("tagInput") != "") {
      let ruta = encodeURI(`/tags/${data.get("tagInput")}`);
      redirect(ruta);
    }
  }

  return (
    <div className="tag_search">
      <form action={rutear}>
        {/* <label htmlFor="tagInput">Choose a flavor:</label> */}
        <input
          list="tags"
          id="tagInput"
          name="tagInput"
          placeholder="Tags..."
        />
        <datalist id="tags">
          {allTagsArray.map((tag) => {
            return <option value={tag} key={tag}></option>;
          })}
        </datalist>
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
}
