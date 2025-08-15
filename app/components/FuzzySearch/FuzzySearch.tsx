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
import CSS from "./FuzzySearch.module.css";
/* import { LuColumns2, LuRows2 } from "react-icons/lu";
 */
// snippetSize = 0 para mostrar todo el contenido
// snippetSize > 0 para mostrar fragmento de X caracteres
const snippetSize = 0;
const snippetSizeBefore = 100; // Caracteres antes de la primera coincidencia
const snippetSizeAfter = 300; // Caracteres después de la primera coincidencia

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
  query: string;
  setQuery: (query: string) => void;
}

export default function FuzzySearch({
  posts,
  isActive,
  setQuery,
  query,
}: FuzzySearchProps) {
  /* const [query, setQuery] = useState(initQuery || ""); */
  const [processedResults, setProcessedResults] = useState<
    Array<
      Post & {
        highlightedSnippet?: string;
      }
    >
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enfocar el input cuando el modal se abre
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Atajo de teclado para abrir el input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Ctrl+K (Windows/Linux) or Cmd+K (Mac) to focus the search input
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key.at(0) === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Función para extraer fragmento relevante y resaltar coincidencias
  function getFirstSnippet(
    text: string,
    matches: Array<{ indices?: readonly [number, number][] }>
  ) {
    if (!matches || matches.length === 0) {
      return (
        text.slice(0, snippetSize) + (text.length > snippetSize ? "..." : "")
      );
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
      return (
        text.slice(0, snippetSize) + (text.length > snippetSize ? "..." : "")
      );
    }

    // Encontrar el primer índice de coincidencia
    const firstMatch = Math.min(...allIndices);

    // Definir el inicio del fragmento (100 caracteres antes de la primera coincidencia)
    const fragmentStart = Math.max(0, firstMatch - snippetSizeBefore);
    const fragmentEnd = Math.min(text.length, fragmentStart + snippetSizeAfter);

    let fragment = text.slice(fragmentStart, fragmentEnd);

    // Agregar "..." al inicio y final si es necesario
    if (fragmentStart > 0) fragment = "..." + fragment;
    if (fragmentEnd < text.length) fragment = fragment + "...";

    return fragment;
  }

  // Función para resaltar las coincidencias en un texto HTML de forma segura
  function addHighlighting(html: string, searchQuery: string) {
    if (!searchQuery.trim()) return html;

    // Método alternativo sin cheerio: usar DOMParser del navegador
    if (typeof window !== "undefined") {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
        const container = doc.body.firstChild as HTMLElement;

        const words = searchQuery
          .trim()
          .split(" ")
          .filter((word) => word.length > 0);
        const regex = new RegExp(`(${words.join("|")})`, "gi");

        // Función recursiva para resaltar solo en nodos de texto
        function highlightTextNodes(node: Node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent || "";
            if (regex.test(textContent)) {
              const highlightedText = textContent.replace(
                regex,
                '<mark style="background-color: #ffeb3b; padding: 0 2px;">$1</mark>'
              );
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = highlightedText;

              // Reemplazar el nodo de texto con los nuevos nodos
              const parent = node.parentNode;
              if (parent) {
                while (tempDiv.firstChild) {
                  parent.insertBefore(tempDiv.firstChild, node);
                }
                parent.removeChild(node);
              }
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Procesar hijos (creamos una copia del array porque puede cambiar)
            const children = Array.from(node.childNodes);
            children.forEach((child) => highlightTextNodes(child));
          }
        }

        highlightTextNodes(container);
        return container.innerHTML;
      } catch (error) {
        console.error("Error al procesar HTML con DOMParser:", error);
      }
    }

    // Fallback: método simple pero menos seguro
    const regex = new RegExp(
      `(${searchQuery.trim().split(" ").join("|")})`,
      "gi"
    );
    return html.replace(
      regex,
      '<mark style="background-color: #ffeb3b; padding: 0 2px;">$1</mark>'
    );
  }

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

  const searchResults: Array<Post & { snippet?: string }> = useMemo(() => {
    if (!query || query.trim().length < 2) return [];

    const allResults = fuse.search(query);

    // Filtrar resultados con score demasiado alto (peores coincidencias)
    const bestResults = allResults.filter((result) => (result.score || 0) <= 1);

    const bestResultsWithSnippets = bestResults.map((post) => {
      let postSnippet = "";
      const content = post.item.content || "";

      // para mostrar fragmento
      // Encontrar matches del contenido para extraer fragmento relevante
      const contentMatches =
        post.matches?.filter((match) => match.key === "content") || [];

      if (snippetSize > 0) {
        if (content && contentMatches.length > 0) {
          // Solo extraer el fragmento, sin aplicar resaltado aún
          postSnippet = getFirstSnippet(content, contentMatches);
        } else if (content) {
          // Si no hay matches en contenido pero sí contenido, mostrar inicio
          postSnippet =
            content.slice(0, snippetSize) +
            (content.length > snippetSize ? "..." : "");
        }
      } else {
        // para mostrar todo el contenido
        postSnippet = content;
      }

      return {
        ...post.item,
        snippet: postSnippet,
      };
    });
    return bestResultsWithSnippets;
  }, [query, fuse]);

  // Procesar los fragmentos de markdown a HTML y aplicar resaltado
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const highlightedResults = await Promise.all(
        searchResults.map(async (post) => {
          let highlightedHtmlSnippet = "";

          if (post.snippet) {
            // Primero procesar el markdown a HTML
            const htmlSnippet = await remark()
              .use(remarkParse)
              .use(remarkBreaks)
              .use(remarkRehype)
              .use(rehypeSlug)
              .use(rehypePrism)
              .use(rehypeStringify)
              .process(post.snippet);

            // Luego aplicar resaltado a las coincidencias en el HTML resultante
            const stringifiedHtmlSnippet = htmlSnippet.toString();
            highlightedHtmlSnippet = addHighlighting(
              stringifiedHtmlSnippet,
              query
            );
          }

          return {
            ...post,
            highlightedSnippet: highlightedHtmlSnippet,
          };
        })
      );
      if (isMounted) {
        setProcessedResults(highlightedResults);
        if (highlightedResults.length > 0) setSelectedPostIndex(0);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [searchResults, query]);

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

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "max-content 1fr",
        height: "100%",
        maxWidth: "var(--global-max-width)",
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "1rem 0rem 2rem 0rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "800px" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "1rem 1rem 1rem 1.6rem",
              width: "100%",
              border: "2px solid transparent",
              outline: "2px solid var(--border-color)",
              caretColor: "var(--border-color)", // Cambia el color del cursor
              boxShadow: "0px 0px 11px 3px var(--shadow-color)",
              borderRadius: "10vh",
              fontSize: "1.2rem",
            }}
          />

         
        </div>
      </div>
      <div className={CSS.resultsGrid}>
        {processedResults?.length > 0 && (
          <PostsList
            postsList={processedResults}
            selectedPostIndex={selectedPostIndex}
            setSelectedPostIndex={setSelectedPostIndex}
          />
        )}

        {selectedPostIndex !== null && (
          <PostPreview
            postContent={
              processedResults[selectedPostIndex]?.highlightedSnippet
            }
            postTitle={processedResults[selectedPostIndex]?.title}
          />
        )}
      </div>
    </div>
  );
}

function PostsList({
  postsList,
  selectedPostIndex,
  setSelectedPostIndex,
}: {
  postsList: Array<Post & { highlightedSnippet?: string }>;
  selectedPostIndex: number | null;
  setSelectedPostIndex: (index: number | null) => void;
}) {
  // Crear refs para cada elemento
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (selectedPostIndex !== null && itemRefs.current[selectedPostIndex]) {
      itemRefs.current[selectedPostIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedPostIndex]);

  return (
    <div className={CSS.postListLayout}>
      <div style={{ overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingRight: "0.5rem",
          }}
        >
          {postsList.map(
            ({ id, /* date, */ title /* highlightedFragment */ }, index) => (
              <PostListItem
                key={id}
                id={id}
                title={title}
                isSelected={selectedPostIndex === index}
                onClick={() => {
                  setSelectedPostIndex(index);
                }}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Permitir ref en PostListItem
import React from "react";

const PostListItem = React.forwardRef<
  HTMLDivElement,
  {
    isSelected: boolean;
    title: string;
    onClick: () => void;
    id: string;
  }
>(function PostListItem({ isSelected, title, onClick, id }, ref) {
  return (
    <div
      ref={ref}
      style={{
        border: `1px solid ${
          isSelected ? "var(--search-selected)" : "transparent"
        }`,
        backgroundColor: `${
          isSelected ? "var(--search-selected)" : "var(--background-color)"
        }`,
        padding: "0.2rem 0.5rem",
        color: "var(--text-color)",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {isSelected && (
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
      )}
      {!isSelected && (
        <span
          style={{
            color: "var(--text-color)",
            fontWeight: "600",
          }}
        >
          {title}
        </span>
      )}
    </div>
  );
});

function PostPreview({
  postContent,
  postTitle,
}: {
  postContent: string | undefined;
  postTitle: string | undefined;
}) {
  if (!postContent) return null;
  return (
    <div
      style={{
        border: "2px dashed var(--border-color-secondary)",
        padding: "1rem",
        /* marginTop: "1rem", */
        borderRadius: "12px",
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        height: "100%",
        minHeight: 0,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          backgroundColor: "var(--border-color-secondary)",
          color: "var(--background-color)",
          padding: "0.5rem",
          borderRadius: "4px",
          fontSize: "1.2rem",
        }}
      >
        {postTitle}
      </div>
      <div
        style={{ height: "100%", minHeight: 0, overflow: "auto" }}
        dangerouslySetInnerHTML={{
          __html: postContent,
        }}
      />
    </div>
  );
}

/* export function SearchBox({
  query,
  setQuery,
  ref
}: {
  query: string;
  setQuery: (query: string) => void;
  ref: React.Ref<HTMLInputElement>;
}) {
  return (
    <input
      type="text"
      ref={ref}
      placeholder="Buscar apuntes..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      style={{
        padding: "1rem",
        width: "100%",
        border: "2px solid transparent",
        outline: "2px solid var(--border-color)",
        borderRadius: "8px",
        fontSize: "1.2rem",
      }}
    />
  );
}
 */
