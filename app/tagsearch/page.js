"use client";
import { useRouter } from "next/navigation";

export default function TagSearch({ searchParams }) {
  const router = useRouter();

  console.log(searchParams);

  router.push("/tags/" + searchParams.tagInput);
}
