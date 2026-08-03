import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
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
      <body
        className={`${beVietnamPro.className} ${beVietnamPro.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
