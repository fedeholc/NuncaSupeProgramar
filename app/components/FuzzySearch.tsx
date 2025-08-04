"use client";
import Fuse from "fuse.js";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export type Post = {
  id: string;
  date: string;
  title: string;
  content?: string;
  tags?: string[];
  categories?: string[];
};

interface FuzzySearchProps {
  posts: Post[];
  isActive?: boolean;
}

export default function FuzzySearch({ posts, isActive }: FuzzySearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Enfocar el input cuando el modal se abre
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Función para extraer fragmento relevante y resaltar coincidencias
  const getHighlightedFragment = (
    text: string,
    matches: Array<{ indices?: readonly [number, number][] }>
  ) => {
    if (!matches || matches.length === 0) {
      return text.slice(0, 200) + (text.length > 200 ? "..." : "");
    }

    // Encontrar todas las posiciones de coincidencias
    const allIndices: number[] = [];
    matches.forEach((match) => {
      if (match.indices) {
        match.indices.forEach(([start, end]: [number, number]) => {
          for (let i = start; i <= end; i++) {
            allIndices.push(i);
          }
        });
      }
    });

    if (allIndices.length === 0) {
      return text.slice(0, 200) + (text.length > 200 ? "..." : "");
    }

    // Encontrar el primer índice de coincidencia
    const firstMatch = Math.min(...allIndices);

    // Definir el inicio del fragmento (100 caracteres antes de la primera coincidencia)
    const fragmentStart = Math.max(0, firstMatch - 100);
    const fragmentEnd = Math.min(text.length, fragmentStart + 300);

    let fragment = text.slice(fragmentStart, fragmentEnd);

    // Agregar "..." al inicio y final si es necesario
    if (fragmentStart > 0) fragment = "..." + fragment;
    if (fragmentEnd < text.length) fragment = fragment + "...";

    return fragment;
  };

  // Función para resaltar las coincidencias en un texto
  const highlightMatches = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(
      `(${searchQuery.trim().split(" ").join("|")})`,
      "gi"
    );
    return text.replace(
      regex,
      '<mark style="background-color: #ffeb3b; padding: 0 2px;">$1</mark>'
    );
  };

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 0.3 },
          { name: "tags", weight: 0.2 },
          { name: "categories", weight: 0.2 },
          { name: "content", weight: 0.3 },
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true,
        findAllMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
      }),
    [posts]
  );

  const results: Array<Post & { highlightedFragment?: string }> =
    useMemo(() => {
      if (!query || query.trim().length < 2) return [];

      const searchResults = fuse.search(query);

      // Filtrar resultados con score demasiado alto (peores coincidencias)
      const filteredResults = searchResults.filter(
        (result) => (result.score || 0) <= 1
      );

      // Log para depuración
      console.log(`Búsqueda: "${query}"`);
      console.log(`Total resultados sin filtrar: ${searchResults.length}`);
      console.log(`Total resultados filtrados: ${filteredResults.length}`);
      filteredResults.forEach((result, index) => {
        console.log(`Resultado ${index + 1}:`, {
          title: result.item.title,
          score: result.score,
          matches: result.matches?.map((match) => ({
            key: match.key,
            value: match.value,
            indices: match.indices,
          })),
        });
      });

      return filteredResults.map((r) => {
        // Encontrar matches del contenido para extraer fragmento relevante
        const contentMatches =
          r.matches?.filter((match) => match.key === "content") || [];
        const content = r.item.content || "";

        let highlightedFragment = "";
        if (content && contentMatches.length > 0) {
          // Solo extraer el fragmento, sin aplicar resaltado aún
          highlightedFragment = getHighlightedFragment(content, contentMatches);
        } else if (content) {
          // Si no hay matches en contenido pero sí contenido, mostrar inicio
          highlightedFragment =
            content.slice(0, 200) + (content.length > 200 ? "..." : "");
        }

        return {
          ...r.item,
          highlightedFragment,
        };
      });
    }, [query, fuse]);

  const [processedResults, setProcessedResults] = useState<
    Array<
      Post & {
        highlightedFragment?: string;
      }
    >
  >([]);

  // Procesar los fragmentos de markdown a HTML y aplicar resaltado
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const processed = await Promise.all(
        results.map(async (post) => {
          let highlightedFragment = "";

          if (post.highlightedFragment) {
            // Primero procesar el markdown a HTML
            const processedContent = await remark()
              .use(remarkParse)
              .use(remarkBreaks)
              .use(remarkRehype)
              .use(rehypeSlug)
              .use(rehypePrism)
              .use(rehypeStringify)
              .process(post.highlightedFragment);

            // Luego aplicar resaltado a las coincidencias en el HTML resultante
            const htmlContent = processedContent.toString();
            highlightedFragment = highlightMatches(htmlContent, query);
          }

          return {
            ...post,
            highlightedFragment,
          };
        })
      );
      if (isMounted) {
        setProcessedResults(processed);
        if (processed.length > 0) setSelectedPostIndex(0);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [results, query]);

  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(
    null
  );
  // Shortcut Arrow navigation and Enter
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (
          selectedPostIndex !== null &&
          selectedPostIndex < processedResults.length - 1
        ) {
          setSelectedPostIndex(selectedPostIndex + 1);
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedPostIndex !== null && selectedPostIndex > 0) {
          setSelectedPostIndex(selectedPostIndex - 1);
        }
      }
      if (e.key === "Enter" && selectedPostIndex !== null) {
        const post = processedResults[selectedPostIndex];
        if (post) {
          window.location.href = `/posts/${post.id}`;
        }
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [selectedPostIndex, processedResults]);

  console.log(posts);

  return (
    /* TODO: arreglar el ancho en la grid principal, hay que ponerle width a la columna */
    <div
      style={{ display: "grid", gridTemplateRows: "max-content 70vh", height: "100%" }}
    >
      <div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar apuntes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "1rem",
            width: "100%",
            marginBottom: "1rem",
            border: "3px solid transparent",
            outline: "3px solid var(--border-color)",
            borderRadius: "12px",
            fontSize: "1.2rem",
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr",
          gap: "1rem",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            outline: "3px solid var(--border-color)",
            borderRadius: "12px",
            padding: "1rem",
            height: "100%",
            overflow: "auto",
          }}
        >
          {processedResults.map(
            ({ id, /* date, */ title /* highlightedFragment */ }, index) => (
              <div
                key={id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    border: `1px solid ${
                      selectedPostIndex === index
                        ? "var(--search-selected)"
                        : "transparent"
                    }`,
                    backgroundColor: `${
                      selectedPostIndex === index
                        ? "var(--search-selected)"
                        : "var(--background-color)"
                    }`,
                    padding: "0.2rem 0.5rem",
                    color: "var(--text-color)",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedPostIndex(index)}
                  onMouseEnter={() => setSelectedPostIndex(index)}
                >
                  <Link href={`/posts/${id}`}>
                    <span
                      style={{
                        color: "var(--text-color)",
                        fontWeight: "600",
                      }}
                    >
                      {title}
                    </span>
                  </Link>
                </div>
                {/*  {highlightedFragment && (
                  <div
                    style={{
                      border: "1px solid var(--text-color)",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{ color: "#666", fontSize: "0.95em" }}
                      dangerouslySetInnerHTML={{ __html: highlightedFragment }}
                    />
                  </div>
                )} */}
                {/*    <br />
              <small>
                <Date dateString={date} />
              </small> */}
              </div>
            )
          )}
        </div>
        {/*     <div>Selected post: {selectedPostIndex}</div> */}
        {selectedPostIndex !== null &&
          processedResults[selectedPostIndex]?.highlightedFragment && (
            <div
              style={{
                border: "2px dashed var(--border-color-secondary)",
                padding: "1rem",
                marginTop: "1rem",
                borderRadius: "12px",
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                height: "100%",
                overflow: "auto",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    processedResults[selectedPostIndex]?.highlightedFragment,
                }}
              />
            </div>
          )}
      </div>
    </div>
  );
}
