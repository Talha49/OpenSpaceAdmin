import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header/Header";
import Sidebar from "./_components/SideBar/SideBar";
import ClientProvider from "./_components/ClientProvider/ClientProvider";
import ThemeWrapper from "./_components/ThemeWrapper/ThemeWrapper";

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
          <Header />

          <div className="flex gap-4  ">
            <Sidebar />
            <main className="w-full ml-20">{children}</main>
          </div>
        </body>
      </ClientProvider>
    </html>
  );
}
