"use client";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import FuzzySearch, { Post } from "./FuzzySearch";

 
interface HomeClientProps {
  posts: Post[];
}

const HomeClient: React.FC<HomeClientProps> = ({ posts }) => {
  const [isModalOpen, setModalOpen] = useState(false);

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
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <FuzzySearch posts={posts} isActive={isModalOpen} />
      </Modal>
    </>
  );
};

export default HomeClient;
