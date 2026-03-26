import { Poppins } from "next/font/google";
import "./globals.css";

// Khởi tạo font Poppins chuẩn Next.js
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "GreenStats - Chiến lược Marketing Xanh",
  description: "Khảo sát du lịch sinh xanh bền vững tại Việt Nam, hướng đến giải pháp phát triển du lịch thân thiện môi trường.",
  icons: {
    icon: "/logo.svg", 
    apple: "/logo.svg",
  },
  openGraph: {
    title: "GreenStats",
    description: "Nghiên cứu du lịch xanh bền vững tại Việt Nam",
    images: ["/og-image.jpg"], 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}