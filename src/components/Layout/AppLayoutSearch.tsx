"use client";
import { Sidebar } from "./sidebar/Sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SearchBar } from "../Search/SearchBar";

export default function AppLayoutSearch({ children }: { children: React.ReactNode }) {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Optional: add logic to propagate search state or filter global content
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen flex flex-col">
        <Navbar />

        {/* ↓ Added margin-top for spacing and aligned to left */}
        <div className="mt-4 px-6 w-full flex justify-start">
          <div className="w-full max-w-md">
            <SearchBar placeholder="Search anything..." onSearch={handleSearch} />
          </div>
        </div>

        <div className="flex-grow px-6 pb-6 bg-gray-50">{children}</div>

        <Footer />
      </main>
    </div>
  );
}