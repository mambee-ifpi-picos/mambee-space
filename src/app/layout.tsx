import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  icons: {
    icon: "/logo-mambee.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthGuard>
          <ClientLayout>{children}</ClientLayout>
        </AuthGuard>
      </body>
    </html>
  );
}
