"use client";
import { useRouter } from "next/navigation";

export default function TagSearch({ searchParams }) {
  const router = useRouter();
  router.push("/tags/" + searchParams.tagInput);
}
