import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { theme } = await request.json();

  const response = NextResponse.json({ success: true });
  response.cookies.set("data-theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 30 });

  return response;
}