// import { Sidebar } from "./Sidebar";
import { Sidebar } from "./sidebar/Sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow p-6 bg-gray-50">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
