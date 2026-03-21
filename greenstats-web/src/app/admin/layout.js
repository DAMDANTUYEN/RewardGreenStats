"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

const ADMIN_EMAILS = ['nguyentrannhatan2812@gmail.com']; // Email của bạn

export default function AdminLayout({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      try {
        // 1. Lấy thông tin user từ Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          console.log("Chưa đăng nhập");
          setAuthorized(false);
        } else if (ADMIN_EMAILS.includes(user.email)) {
          // 2. Nếu đúng email admin thì cho qua
          setAuthorized(true);
        } else {
          // 3. Email không hợp lệ
          setAuthorized(false);
        }
      } catch (err) {
        console.error("Lỗi xác thực:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  // Nếu đang kiểm tra quyền
  if (loading) {
    return (
      <div className="min-h-screen bg-[#010804] flex flex-col items-center justify-center text-emerald-400 font-mono">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="tracking-widest animate-pulse">SYSTEM: VERIFYING ADMIN PRIVILEGES...</p>
      </div>
    );
  }

  // Nếu không phải Admin
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#010804] flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-red-500/50 bg-red-500/5 p-8 rounded-lg text-center backdrop-blur-xl">
          <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
          <h1 className="text-2xl font-black text-red-500 mb-2 uppercase italic">Truy cập bị chặn</h1>
          <p className="text-slate-400 text-sm mb-6">Tài khoản của bạn không có quyền truy cập vào khu vực quản trị này.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
          >
            QUAY LẠI TRANG CHỦ
          </button>
        </div>
      </div>
    );
  }

  // Nếu là Admin xịn
  return <>{children}</>;
}