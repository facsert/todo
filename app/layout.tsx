import type { Fragment } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-screen h-screen flex flex-row justify-center items-center dark">
        <>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </>
      </body>
    </html>
  );
}
