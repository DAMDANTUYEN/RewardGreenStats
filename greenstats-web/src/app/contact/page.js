"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';

// 🌿 LINK VIDEO NỀN CẦN GIỜ
const VIDEO_URL = "https://sjv1f6z76labxq2f.public.blob.vercel-storage.com/Flycam%20r%E1%BB%ABng%20s%C3%A1c%20C%E1%BA%A7n%20Gi%E1%BB%9D.mp4";

export default function ContactPage() {
  // KHAI BÁO STATE BỊ THIẾU
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <main className="relative w-full text-white bg-black min-h-screen flex flex-col overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* --- Video Background --- */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <video 
          src={VIDEO_URL}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1] scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
      </div>

      {/* --- Navbar Đồng Bộ Gốc --- */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 md:px-16 bg-black/50 backdrop-blur-md border-b border-white/5 sticky top-0">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative p-1.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-500 group-hover:border-emerald-500/50 group-hover:scale-110 flex items-center justify-center shadow-xl">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-500">
                <path d="M48 40C45 38 40 38 35 43C32 46 32 50 35 55C38 60 45 65 52 65C60 65 65 60 68 55C70 52 70 48 68 45" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                <path d="M48 40L40 25M68 45L75 30" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                <path d="M20 50C20 30 35 15 50 15C65 15 80 30 80 50C80 70 65 85 50 85C35 85 20 70 20 50Z" stroke="#4ade80" strokeWidth="4" strokeDasharray="15 5" />
                <path d="M50 15C60 15 75 25 80 40M80 60C75 75 60 85 50 85M20 50C20 65 35 85 50 85M50 15C35 15 20 35 20 50" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                <path d="M85 45C85 35 75 25 65 25" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
                <path d="M15 55C15 65 25 75 35 75" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" />
                <circle cx="39" cy="48" r="1.5" fill="#34d399" />
              </svg>
            </div>
          </div>
          <div className="flex items-center transition-all duration-500 group-hover:tracking-wider">
            <span className="text-[16px] font-black uppercase tracking-tight text-white drop-shadow-md">Green</span>
            <span className="text-[16px] font-extrabold uppercase tracking-tight text-emerald-500 drop-shadow-md">Stats</span>
          </div>
        </div>

        <ul className="hidden lg:flex items-center gap-8 text-[9px] font-semibold tracking-[0.2em] uppercase opacity-70 font-poppins">
          <li>
            <Link href="/" className="hover:text-emerald-400 cursor-pointer transition-colors italic">Giới thiệu</Link>
          </li>
          <li>
            <Link href="/destinations" className="hover:text-emerald-400 cursor-pointer transition-colors italic">Điểm đến</Link>
          </li>
          <li>
            <Link href="/spin" className="hover:text-emerald-400 cursor-pointer transition-colors italic">Vòng quay</Link>
          </li>
          {/* Highlight trang hiện tại */}
          <li className="text-emerald-400 border-b-2 border-emerald-500 pb-1 cursor-default italic drop-shadow-md">
            Liên hệ
          </li>
        </ul>

        <div className="flex items-center gap-5">
          <Search size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
          <User size={16} className="hover:text-emerald-400 cursor-pointer transition-colors" />
          <Menu 
            size={18} 
            className="lg:hidden text-white cursor-pointer hover:text-emerald-400 transition-colors" 
            onClick={() => setIsMobileMenuOpen(true)} 
          />
        </div>
      </nav>

      {/* --- Mobile Menu Overlay Trong Suốt --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-3 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <ul className="flex flex-col items-center gap-10 text-xl font-bold tracking-[0.2em] uppercase font-poppins">
            <li>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-emerald-400 transition-colors">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-emerald-400 transition-colors">
                ĐIỂM ĐẾN
              </Link>
            </li>
            <li>
              <Link href="/spin" onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-emerald-400 transition-colors">
                Vòng quay
              </Link>
            </li>
            {/* Highlight trang Liên hệ trên Mobile */}
            <li>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-400 border-b-2 border-emerald-500 pb-2 drop-shadow-md">
                LIÊN HỆ
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* --- Nội dung chính --- */}
      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12 md:flex-1 flex flex-col items-center justify-center gap-12 md:gap-16 pt-20"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Phần Giảng Viên */}
        <motion.section className="w-full max-w-3xl" variants={itemVariants}>
          <h2 className="text-center text-emerald-500 tracking-[0.4em] uppercase text-[12px] font-black mb-8 drop-shadow-md italic">
            Giảng Viên Hướng Dẫn
          </h2>
          <motion.div 
            className="group bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 md:p-10 flex flex-col sm:flex-row items-center gap-8 shadow-2xl relative overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-emerald-500/40 rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-xl rounded-bl-xl"
            whileHover={{ y: -4 }}
          >
            <div className="relative w-36 h-36 shrink-0 rounded-full overflow-hidden border-[3px] border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <img src={lecturer.image} alt={lecturer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="text-center sm:text-left w-full">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight italic">{lecturer.name}</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <p><span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] mr-2">Học vị:</span> <span className="italic">{lecturer.degree}</span></p>
                <p><span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] mr-2">Chuyên ngành:</span> <span className="italic">{lecturer.major}</span></p>
                <div className="h-[1px] w-full bg-white/10 my-4"></div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-500 font-black">{lecturer.faculty}</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Phần Sinh Viên */}
        <motion.section className="w-full" variants={itemVariants}>
          <h2 className="text-center text-emerald-500 tracking-[0.4em] uppercase text-[12px] font-black mb-8 drop-shadow-md italic">
            Sinh Viên Thực Hiện
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {students.map((student) => (
              <motion.div 
                key={student.id} 
                className="group bg-white/[0.03] backdrop-blur-md border border-white/10 p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-emerald-500/40 rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-xl rounded-br-xl"
                variants={itemVariants}
                whileHover={{ y: -6 }}
              >
                <div className="relative w-32 h-32 rounded-full bg-black/30 mb-6 overflow-hidden border-2 border-transparent group-hover:border-emerald-500/50 transition-all duration-500 shadow-inner">
                   <img src={student.image} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex flex-col flex-grow w-full">
                  <h4 className="text-2xl font-black text-white mb-3 italic">{student.name}</h4>
                  <div className="space-y-1.5 text-[13px] text-white/50 mb-6 flex-grow italic">
                    <p>{student.faculty}</p>
                    <p>Ngành: <span className="text-white/80 font-bold">{student.major}</span></p>
                  </div>
                  <div className="mt-auto flex justify-center">
                    <div className="flex items-center justify-center min-w-[140px] px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-bold group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 uppercase tracking-[0.15em] font-poppins">
                      {student.phone ? `LH: ${student.phone}` : "Đang cập nhật"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>

      {/* Global CSS Forcing TNR & Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
        * { font-family: 'Times New Roman', Times, serif !important; }
        .font-poppins { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </main>
  );
}