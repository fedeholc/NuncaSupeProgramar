import Logo from "./logo";
import navbar from "./navbar.module.css";
import { FaGithub, FaLinkedin, FaMail } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <div className={navbar.navbar}>
        <div className={navbar.navbar__links}>
          <Link href="/">
            <div className={navbar.navbar__links__fede}>Inicio</div>
          </Link>{" "}
          |
          <a href="https://github.com/fedeholc" target="_blank">
            <FaGithub></FaGithub>
          </a>
          <a href="https://www.linkedin.com/in/federicoholc/" target="_blank">
            <FaLinkedin></FaLinkedin>
          </a>
          <a href="mailto:dev@fedeholc.ar">
            <MdEmail></MdEmail>
          </a>
        </div>
        <div className={navbar.navbar__logo}>
          <Logo></Logo>
        </div>
      </div>
    </>
  );
}
