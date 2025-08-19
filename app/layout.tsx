/* cspell:disable */
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import {
  Montserrat,
  Roboto,
  Recursive,
  Open_Sans,
  JetBrains_Mono,
} from "next/font/google";

import NavBar from "./components/navbar";
/* import TagSearch from "./components/tagsearch";
 */ /* import TagList from "./components/taglist"; */
import "./globals.css";
import "./prism-line-numbers.css";
import "./prism-material-dark.css";
import { ThemeProvider } from "./components/themeToggler";
import { cookies } from "next/headers";

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

const jetBrainsMono = JetBrains_Mono({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: ">> err0r << v0.3",
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
      className={`${montserrat.variable} ${open.variable} ${roboto.variable} ${recursive.variable} ${jetBrainsMono.variable}`}
    >
      <meta charSet="utf-8" />

      <body data-theme={mode} className="background">
        {/*           <Canvas />
         */}{" "}
        <div className="layout__wrapper">
          <div className="layout__container">
            <ThemeProvider>
              <header style={{ display: "flex", width: "100%" }}>
                <NavBar metadata={metadata}></NavBar>
                <br />
              </header>
              <main
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {children}
              </main>
            </ThemeProvider>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "3rem 0rem 0rem 0rem",
              }}
            >
              <footer
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  width: "fit-content",
                  padding: "0.1rem 2rem",
                  borderRadius: "0.5rem",
                  border: "1px dashed var(--border-color-secondary)",
                }}
              >
                Federico Holc{" "}
                <span
                  style={{
                    color: "#ff00ff",
                    fontSize: "1.2rem",
                  }}
                >
                  ⚡
                </span>{" "}
                2025
              </footer>
            </div>
          </div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
