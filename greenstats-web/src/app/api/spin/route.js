import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  );

  try {
    const { email } = await req.json();
    const cleanEmail = email.toLowerCase().trim();

    // 1. Kiểm tra Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('spins_available')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (!profile || profile.spins_available <= 0) {
      return NextResponse.json({ error: 'Hết lượt quay!' }, { status: 400 });
    }

    // 2. Lấy danh sách giải thưởng
    const { data: allPrizes, error: prizeErr } = await supabase
      .from('prizes')
      .select('*')
      .eq('is_active', true);

    // --- LOG KIỂM TRA QUÀ ---
    console.log("DEBUG: Số lượng giải thưởng tìm thấy trong DB:", allPrizes?.length || 0);
    
    if (!allPrizes || allPrizes.length === 0) {
      console.error("LỖI: Bảng prizes trống hoặc RLS đang chặn truy cập!");
      return NextResponse.json({ error: 'Hệ thống quà tặng chưa sẵn sàng (Kiểm tra RLS bảng prizes)!' }, { status: 500 });
    }

    // 3. Phân loại quà
    // Tìm Spotify (không phân biệt hoa thường)
    const spotify = allPrizes.find(p => p.name.toLowerCase().includes('spotify'));
    // Lấy danh sách các ô slogan (trượt)
    const noPrizePool = allPrizes.filter(p => p.type === 'NO_PRIZE');

    console.log("DEBUG: Có Spotify không?:", !!spotify, "| Số ô trượt:", noPrizePool.length);

    let winnerPrize = null;
    const randomNumber = Math.random() * 100;

    // 4. Logic trúng thưởng 1%
    if (randomNumber <= 1 && spotify && spotify.stock > 0) {
      winnerPrize = spotify;
      await supabase.from('prizes').update({ stock: spotify.stock - 1 }).eq('id', spotify.id);
    } else {
      // Nếu trượt hoặc hết Spotify: Bốc ngẫu nhiên từ danh sách slogan
      if (noPrizePool.length > 0) {
        winnerPrize = noPrizePool[Math.floor(Math.random() * noPrizePool.length)];
      } else {
        // Chốt chặn cuối: Nếu DB không có ô NO_PRIZE nào, lấy đại ô đầu tiên để ko sập web
        winnerPrize = allPrizes[0];
      }
    }

    // 5. Cập nhật lượt quay
    const newSpins = profile.spins_available - 1;
    await supabase.from('profiles').update({ spins_available: newSpins }).ilike('email', cleanEmail);

    // 6. Ghi log lịch sử
    await supabase.from('spin_history').insert([{
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