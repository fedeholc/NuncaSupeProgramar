"use client";
import { useRouter } from "next/navigation";

export default function TagSearch({ searchParams }: { searchParams: { tagInput: string } }) {
  const router = useRouter();
  router.push("/tags/" + searchParams.tagInput);
}
