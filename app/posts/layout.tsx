import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="volver">
        <Link href="/">⬅ Volver</Link>
      </div>
    </>
  );
}
