import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, name } = await request.json();
    if (!email) return new Response('Email missing', { status: 400 });

    console.log(`🚀 Đang xử lý Webhook cho: ${email}`);

    
    const { data: user } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (user) {
      // Đã có -> Cộng lượt quay
      await supabaseAdmin
        .from('profiles')
        .update({ spins_available: (user.spins_available || 0) + 1 })
        .eq('email', email);
      console.log("✅ Đã cộng thêm lượt quay.");
    } else {
      // Chưa có -> Tạo mới hoàn toàn
      await supabaseAdmin
        .from('profiles')
        .insert([{ 
          email: email, 
          display_name: name || 'User', 
          spins_available: 1 
        }]);
      console.log("✨ Đã tạo profile mới thành công.");
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("🔥 Error:", error.message);
    return new Response(error.message, { status: 500 });
  }
}