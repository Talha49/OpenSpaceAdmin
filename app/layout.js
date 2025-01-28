import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header/Header";
import LayoutWrapper from "./_components/LayoutWrapper";
import ClientProvider from "./_components/ClientProvider/ClientProvider";
import { ThemeProvider } from "./_components/ThemeProvider/page";
import { ToastProvider } from "@/lib/toastContext";
import SessionWrapper from "./_components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin | SIJM",
  description: "Admin | SIJM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClientProvider>
        <body className={`${inter.className} flex flex-col h-screen`}>
          <SessionWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ToastProvider>
                {/* Header */}
                <Header />
                <LayoutWrapper>{children}</LayoutWrapper>
              </ToastProvider>
            </ThemeProvider>
          </SessionWrapper>
        </body>
      </ClientProvider>
    </html>
  );
}