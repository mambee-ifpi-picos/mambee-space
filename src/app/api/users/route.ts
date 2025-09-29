// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Sample data – in real apps you’d fetch from a DB
  const users = [
    { name: "Alice Smith", email: "alice@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
    { name: "Carol Davis", email: "carol@example.com" },
  ];

  return NextResponse.json(users);
}
