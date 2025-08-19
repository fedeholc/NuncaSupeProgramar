"use client";

import Logo from "./logo";
import navbar from "./navbar.module.css";
import { FaGithub, FaLinkedin, FaPalette } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa6";
import Link from "next/link";
import { useRef, useState } from "react";
import { ThemeToggler } from "./themeToggler";

export default function NavBar({
  metadata,
}: {
  metadata: { title: string; description: string };
}) {
  const [isOpenThemeToggler, setIsOpenThemeToggler] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className={navbar.navbar}>
      <div className={navbar.navbar__links}>
        <Link href="/">
          <div className={navbar.navbar__links__fede}>Inicio</div>
        </Link>
        <div>|</div>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => setIsOpenThemeToggler(!isOpenThemeToggler)}
        >
          <FaPalette></FaPalette>
        </div>
        <div>|</div>
        <a href="https://github.com/fedeholc" target="_blank">
          <FaGithub></FaGithub>
        </a>
        <a href="https://www.linkedin.com/in/federicoholc/" target="_blank">
          <FaLinkedin></FaLinkedin>
        </a>
        <a href="mailto: federicoholc@gmail.com">
          <FaEnvelope></FaEnvelope>
        </a>
      </div>
      {isOpenThemeToggler && (
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: "0.5rem 0rem",
          }}
          onMouseLeave={() => {
            timerRef.current = setTimeout(() => {
              setIsOpenThemeToggler(false);
            }, 2000);
          }}
          onMouseEnter={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
          }}
        >
          <ThemeToggler />
        </div>
      )}
      <div className={navbar.navbar__logo}>
        <Logo metadata={metadata}></Logo>
      </div>
    </div>
  );
}
