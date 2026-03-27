import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 🔴 KHỞI TẠO BẰNG QUYỀN ADMIN (BYPASS RLS)
// Dùng chìa khóa Service Role để không bị RLS chặn
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email } = await req.json();
    const cleanEmail = email.toLowerCase().trim();

    // 1. Tìm Profile bằng quyền Admin (Đi xuyên qua RLS)
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('spins_available')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (profileErr) {
      console.error("🚨 Lỗi tìm Profile:", profileErr);
    }

    if (!profile || profile.spins_available <= 0) {
      return NextResponse.json({ error: 'Hết lượt quay!' }, { status: 400 });
    }

    // 2. Lấy kho quà bằng quyền Admin (Xuyên qua RLS bảng prizes)
    const { data: allPrizes, error: prizeErr } = await supabaseAdmin
      .from('prizes')
      .select('*')
      .eq('is_active', true);
    
    if (!allPrizes || allPrizes.length === 0) {
      return NextResponse.json({ error: 'Hệ thống quà tặng chưa sẵn sàng!' }, { status: 500 });
    }

    // 3. Phân loại quà
    const spotify = allPrizes.find(p => p.name.toLowerCase().includes('spotify'));
    const noPrizePool = allPrizes.filter(p => p.type === 'NO_PRIZE');

    let winnerPrize = null;
    const randomNumber = Math.random() * 100;

    // 4. Logic trúng thưởng 1%
    if (randomNumber <= 1 && spotify && spotify.stock > 0) {
      winnerPrize = spotify;
      await supabaseAdmin.from('prizes').update({ stock: spotify.stock - 1 }).eq('id', spotify.id);
    } else {
      if (noPrizePool.length > 0) {
        winnerPrize = noPrizePool[Math.floor(Math.random() * noPrizePool.length)];
      } else {
        winnerPrize = allPrizes[0];
      }
    }

    // 5. Trừ lượt quay bằng quyền Admin (Xuyên qua RLS)
    const newSpins = profile.spins_available - 1;
    await supabaseAdmin.from('profiles').update({ spins_available: newSpins }).ilike('email', cleanEmail);

    // 6. Ghi log lịch sử bằng quyền Admin (Xuyên qua RLS)
    await supabaseAdmin.from('spin_history').insert([{
      user_email: cleanEmail,
      prize_name: winnerPrize.name,
      won_code: winnerPrize.type === 'REAL' ? 'WAITING_ADMIN' : 'NO_GIFT'
    }]);

    return NextResponse.json({
      prizeName: winnerPrize.name,
      type: winnerPrize.type,
      spinsLeft: newSpins
    });

  } catch (err) {
    console.error("FATAL ERROR:", err);
    return NextResponse.json({ error: 'Lỗi xử lý hệ thống!' }, { status: 500 });
  }
}