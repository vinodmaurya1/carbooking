import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Sign up",
  description: "signup Car booking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
