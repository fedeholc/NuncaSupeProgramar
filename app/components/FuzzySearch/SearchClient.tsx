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
      if (e.key.at(0) === "/" && !isModalOpen) {
        e.preventDefault();
        setModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

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
      <div style={{ padding: "0rem", width: "100%", position: "relative" }}>
        <input
          value={initialQuery}
          type="text"
          placeholder="Buscar..."
          style={{
            padding: "1rem 1rem 1rem 1.6rem",
            width: "100%",
            border: "1px solid transparent",
            outline: "1px solid var(--border-color)",
            caretColor: "var(--border-color)", // Cambia el color del cursor

            boxShadow: "0px 0px 11px 3px var(--shadow-color)",
            borderRadius: "0vh",
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
        {/* Shortcut badge */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "32px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "var(--background-color)",
            color: "var(--text-color)",

            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",

            userSelect: "none",
          }}
        >
          <span style={{ opacity: 0.7, fontWeight: 600, border: "0px dashed white", borderRadius: "0.3rem",padding: "0rem 0.5rem"}}>/ o Ctrl+K</span>
        </div>
      </div>
    </>
  );
}

export default SearchClient;
