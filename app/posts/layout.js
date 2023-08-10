import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <div className="volver">
        <Link href="/">← Volver</Link>
      </div>
    </>
  );
}
