import type { Metadata } from "next";
import "./globals.css";

// Definindo o SEO da página de forma moderna
export const metadata: Metadata = {
  title: "Meu App",
  description: "Criado com Next.js e Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/* Fundo preto, texto branco, fontes antialiased, altura mínima da tela */}
      <body className="font-sans bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}