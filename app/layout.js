import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header/Header";
import Sidebar from "./_components/SideBar/SideBar";
import ClientProvider from "./_components/ClientProvider/ClientProvider";
import ThemeWrapper from "./_components/ThemeWrapper/ThemeWrapper";
import { ThemeProvider } from "./_components/ThemeProvider/page";
import { ToastProvider } from "@/lib/toastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OpenSpace - Admin",
  description: "OpenSpace - Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClientProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <Header />

              <div className="flex gap-4">
                <Sidebar />
                <main className="w-full ml-14 dark:bg-neutral-950">
                  {children}
                </main>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </body>
      </ClientProvider>
    </html>
  );
}
