import logo from "./logo.module.css";
import Link from "next/link";
export default function Logo({metadata}: {metadata: {title: string, description: string}}) {
  return (
    <>
      <div className={logo.logo__container}>
        <div className={logo.logo__titulo}>
          <Link href="/">
            <span className={logo.logo__colorRosa}>{">> "}</span>
            <span>err0r</span>
            <span className={logo.logo__colorCeleste}>{""}</span>
            <span className={logo.logo__colorRosa}>{" <<"}</span>
          </Link>
        </div>
        <div className={logo.logo__descripcion}>{metadata.description} 🐈‍⬛</div>
      </div>
    </>
  );
  
}
