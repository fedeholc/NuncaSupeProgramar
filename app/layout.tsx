/* cspell:disable */
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Montserrat, Roboto, Recursive, Open_Sans } from "next/font/google";
import NavBar from "./components/navbar";
/* import TagSearch from "./components/tagsearch";
 */ import TagList from "./components/taglist";
import "./globals.css";
import "./prism-line-numbers.css";
import "./prism-material-dark.css";
import { ThemeProvider } from "./components/themeToggler";
import { cookies } from "next/headers";

//TODO: poner un toggle para activar animación
/* import { Canvas } from "./components/canvas";
 */
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const open = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open",
});
const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const recursive = Recursive({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-recursive",
});

export const metadata = {
  title: ">> err0r << v0.2",
  description: "Blog de apuntes para aprender a programar",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const mode = cookieStore.get("data-theme")?.value || "light";

  return (
    <html
      data-theme={mode}
      lang="es"
      className={`${montserrat.variable} ${open.variable} ${roboto.variable} ${recursive.variable}`}
    >
      <meta charSet="utf-8" />

      <body data-theme={mode} className="background">
        {/*           <Canvas />
         */}{" "}
        <div className="layout__wrapper">
          <div className="layout__container">
            <ThemeProvider>
              <header className="">
                 <NavBar metadata={metadata}></NavBar>
                <br />
                <TagList></TagList>
              </header>
              <main>{children}</main>
            </ThemeProvider>
            <footer>Federico Holc ⚡️ 2025</footer>
          </div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
