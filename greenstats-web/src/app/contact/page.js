"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Search, User, Menu } from 'lucide-react';
import Link from 'next/link';

// 🌿 LINK VIDEO NỀN CẦN GIỜ
const VIDEO_URL = "https://sjv1f6z76labxq2f.public.blob.vercel-storage.com/Flycam%20r%E1%BB%ABng%20s%C3%A1c%20C%E1%BA%A7n%20Gi%E1%BB%9D.mp4";

export default function ContactPage() {
  const lecturer = {
    name: "Hoàng Thị Vân",
    degree: "Tiến sĩ",
    major: "Du Lịch",
    faculty: "Khoa KHXH&NV",
    image: "https://i.postimg.cc/v8qYRnh0/z7661811618532_0687e82571b6710f1c40396407821101.jpg" 
  };

  const students = [
    { id: 1, name: "Đỗ Thị Thúy Hằng", faculty: "Khoa KHXH&NV", major: "Quản lí du lịch", phone: "0362 944 056", image: "https://i.postimg.cc/gkxYG0Bk/z7661811616236_12b84b1ec0343d237e4270fd12187ba3.jpg" },
    { id: 2, name: "Đàm Đan Tuyên", faculty: "Khoa KHXH&NV", major: "Quản lí du lịch", phone: "0342 772 795", image: "https://i.postimg.cc/W3wnyTP7/z7661806506519_1169bce869f0aa575503da48039bcc03.jpg" },
    { id: 3, name: "Mai Khánh Huyền", faculty: "Khoa KHXH&NV", major: "Quản lí du lịch", phone: "", image: "https://i.postimg.cc/3JkK3wbT/z7661811613243_6647788579461965629eb0c9aabb1ad2.jpg" },
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  return (
    <main className="relative w-full font-sans text-white bg-black min-h-screen flex flex-col overflow-x-hidden">
      
      {/* --- Video Background --- */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video 
          src={VIDEO_URL}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
      </div>

      {/* --- Header (Navbar tích hợp) --- */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16 bg-black/10">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative p-1.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <path d="M48 40C45 38 40 38 35 43C32 46 32 50 35 55C38 60 45 65 52 65C60 65 65 60 68 55C70 52 70 48 68 45" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
              <path d="M48 40L40 25M68 45L75 30" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
              <path d="M20 50C20 30 35 15 50 15C65 15 80 30 80 50C80 70 65 85 50 85C35 85 20 70 20 50Z" stroke="#4ade80" strokeWidth="4" strokeDasharray="15 5" />
              <path d="M50 15C60 15 75 25 80 40M80 60C75 75 60 85 50 85M20 50C20 65 35 85 50 85M50 15C35 15 20 35 20 50" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center">
            <span className="text-[16px] font-black uppercase tracking-tight text-white">Green</span>
            <span className="text-[16px] font-extrabold uppercase tracking-tight text-emerald-500">Stats</span>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-8 text-[9px] font-semibold tracking-[0.2em] uppercase opacity-70">
          <li><Link href="/" className="hover:text-emerald-400 transition-colors">Giới thiệu</Link></li>
          <li><Link href="/destinations" className="hover:text-emerald-400 transition-colors">Điểm đến</Link></li>
          <li><Link href="/spin" className="hover:text-emerald-400 transition-colors">Vòng quay</Link></li>
          <li className="text-emerald-400 border-b border-emerald-500 pb-1 cursor-default">Liên hệ</li>
        </ul>

        <div className="flex items-center gap-5">
          <Search size={16} className="hover:text-emerald-400 cursor-pointer" />
          <User size={16} className="hover:text-emerald-400 cursor-pointer" />
          <Menu size={18} className="lg:hidden" />
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in">
          
          {/* Nút Đóng (Góc trên phải) */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          {/* Danh sách Links */}
          <ul className="flex flex-col items-center gap-10 text-xl font-bold tracking-[0.2em] uppercase font-poppins">
            <li>
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-white/70 hover:text-emerald-400 transition-colors"
              >
                Giới thiệu
              </Link>
            </li>
            
            {/* TRANG HIỆN TẠI: ĐIỂM ĐẾN (CÓ GẠCH CHÂN) */}
            <li>
              <Link 
                href="/destinations" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-white/70 hover:text-emerald-400 transition-colors"
              >
                ĐIỂM ĐẾN
              </Link>
            </li>
            
            <li>
              <Link 
                href="/spin" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-white/70 hover:text-emerald-400 transition-colors"
              >
                Vòng quay
              </Link>
            </li>
            
            
            
            {/* Nút Khảo sát */}
          </ul>
        </div>
      )}
      {/* --- Nội dung chính --- */}
      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12 md:flex-1 flex flex-col items-center justify-center gap-8 md:gap-12"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Phần Giảng Viên */}
        <motion.section className="w-full max-w-3xl" variants={itemVariants}>
          <h2 className="text-center text-[#10b981] tracking-[0.3em] uppercase text-[10px] font-black mb-6 drop-shadow-md">
            Giảng Viên Hướng Dẫn
          </h2>
          <motion.div 
            className="group bg-white/[0.04] border border-white/10 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:bg-white/[0.08] hover:border-[#10b981]/50 rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-xl rounded-bl-xl"
            whileHover={{ y: -4 }}
          >
            <div className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden border-2 border-[#10b981]/40 shadow-lg">
              <img src={lecturer.image} alt={lecturer.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center sm:text-left w-full">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">{lecturer.name}</h3>
              <div className="space-y-1 text-gray-300 text-sm">
                <p><span className="text-[#10b981] font-medium mr-2">Học vị:</span> {lecturer.degree}</p>
                <p><span className="text-[#10b981] font-medium mr-2">Chuyên ngành:</span> {lecturer.major}</p>
                <div className="h-[1px] w-full bg-white/10 my-3"></div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#10b981] font-bold">{lecturer.faculty}</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Phần Sinh Viên */}
        <motion.section className="w-full" variants={itemVariants}>
          <h2 className="text-center text-[#10b981] tracking-[0.3em] uppercase text-[10px] font-black mb-6 drop-shadow-md">
            Sinh Viên Thực Hiện
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {students.map((student) => (
              <motion.div 
                key={student.id} 
                className="group bg-white/[0.04] border border-white/10 p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden transition-all duration-300 hover:bg-white/[0.08] hover:border-[#10b981]/50 rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-xl rounded-br-xl"
                variants={itemVariants}
                whileHover={{ y: -6 }}
              >
                <div className="relative w-28 h-28 rounded-full bg-black/30 mb-5 overflow-hidden border-2 border-transparent group-hover:border-[#10b981]/50 transition-all duration-300 shadow-inner">
                   <img src={student.image} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col flex-grow w-full">
                  <h4 className="text-xl font-bold text-white mb-2">{student.name}</h4>
                  <div className="space-y-1 text-xs text-gray-400 mb-5 flex-grow">
                    <p>{student.faculty}</p>
                    <p>Ngành: <span className="text-white font-medium">{student.major}</span></p>
                  </div>
                  <div className="mt-auto flex justify-center">
                    <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#10b981] text-[10px] font-bold group-hover:bg-[#10b981] group-hover:text-black transition-all duration-300 uppercase tracking-wider">
                      Liên hệ: {student.phone}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}