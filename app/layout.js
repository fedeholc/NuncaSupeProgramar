/* cspell:disable */

import "./globals.css";
import "./prism-material-dark.css";
import "./prism-line-numbers.css";  
import NavBar from "./components/navbar";
import TagList from "./components/taglist";
import {
  Montserrat,
  Karma,
  Raleway,
  Roboto_Mono,
  Roboto_Slab,
} from "next/font/google";


export const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});
export const karma = Karma({
  weight: ["300","400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-karma",
});

export const raleway = Raleway({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const robotoMono = Roboto_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const robotoSlab = Roboto_Slab({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata = {
  title: "<NuncaSupeProgramar/> v0.2",
  description: "Blog de apuntes para aprender desarrollo web",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${karma.variable} ${robotoSlab.variable} ${robotoMono.variable} ${raleway.variable}`}
    >
      <meta charSet="utf-8" />

      <body>
        <div className="layout__wrapper">
          <div className="layout__container">
            <header className="">
              <NavBar></NavBar>
              <TagList></TagList>
            </header>
            <main className="layout__main">{children}</main>
            <footer>Federico Holc ⚡️ 2023</footer>
          </div>
        </div>
      </body>
    </html>
  );
}
