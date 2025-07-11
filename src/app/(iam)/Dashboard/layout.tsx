// import { Metadata } from 'next'
// import { Montserrat } from "next/font/google";
// import './globals.css'
// import { AuthProvider } from '@/context/AuthContext';
// import Sidebar from '@/components/Layout/Sidebar';
// import Navbar from '@/components/Layout/Navbar';
// import Footer from '@/components/Layout/Footer';


// const montserrat = Montserrat({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-montserrat",
// });


// export const metadata: Metadata = {
//   title: "Hematology System",
//   description: "Built with Next.js",
//   icons: {
//     icon: "public/favicon.ico",
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className="h-screen flex flex-col">
//         <AuthProvider>
//           <div className="flex flex-1">
//             <Sidebar />
//             <main className="flex-1 flex flex-col">
//               <Navbar />
//               <div className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</div>
//               <Footer />
//             </main>
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }
