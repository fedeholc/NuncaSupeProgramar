"use client";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import FuzzySearch, { Post } from "./FuzzySearch";

interface SearchClientProps {
  posts: Post[];
}

function SearchClient({ posts }: SearchClientProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setInitialQuery("");
        }}
      >
        <FuzzySearch
          posts={posts}
          isActive={isModalOpen}
          query={initialQuery}
          setQuery={setInitialQuery}
        />
      </Modal>
      <div style={{ padding: "0rem", width: "100%" }}>
        <input
          value={initialQuery}
          type="text"
          placeholder="Buscar..."
          style={{
            padding: "1rem",
            width: "100%",
            border: "2px solid transparent",
            outline: "2px solid var(--border-color)",
            caretColor: "var(--border-color)", // Cambia el color del cursor

            boxShadow: "0px 0px 11px 3px var(--shadow-color)",

            borderRadius: "10vh",
            fontSize: "1.2rem",
            /*             backgroundColor: "var(--search-selected)",
             */
          }}
          onChange={(e) => {
            setInitialQuery(e.target.value);
            const query = e.target.value;
            if (query.trim() === "") {
              setModalOpen(false);
            } else {
              setModalOpen(true);
            }
          }}
        />
      </div>
    </>
  );
}

export default SearchClient;
