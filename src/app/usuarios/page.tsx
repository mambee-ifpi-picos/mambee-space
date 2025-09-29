"use client";

import { useEffect, useState } from "react";
import UsersTable from "@/components/UsersTable";

type User = { name: string; email: string };

export default function SobrePage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Usuários</h2>
      <UsersTable users={users} />
    </section>
  );
}
