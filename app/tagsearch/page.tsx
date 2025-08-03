"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TagSearch({
  searchParams,
}: {
  searchParams: Promise<{ tagInput: string }>;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const params = await searchParams;
      router.push("/tags/" + params.tagInput);
    };
    handleRedirect();
  }, [router, searchParams]);

  return null; // or a loading spinner
}
