import { Metadata } from 'next'
import { Montserrat } from "next/font/google";
import './globals.css'
import AppLayout from '@/components/Layout/AppLayout';


const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});


export const metadata: Metadata = {
  title: "Hematology System",
  description: "Built with Next.js",
  icons: {
    icon: "public/favicon.ico",
  },
};

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <AppLayout>{children}</AppLayout>
//       </body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body >{children}
      </body>
    </html>
  )
}
