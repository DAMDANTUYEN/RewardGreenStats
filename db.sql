-- 1. Bảng Profiles (Lưu User và lượt quay)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  spins_available INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Bảng Prizes (Danh sách ô trên vòng quay)
CREATE TABLE prizes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ACCOUNT', 'GIFT_CARD', 'NO_PRIZE')),
  color TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0 -- Thứ tự xuất hiện trên vòng quay
);

-- 3. Bảng Inventory (Kho chứa code thật)
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  prize_id INTEGER REFERENCES prizes(id) ON DELETE CASCADE,
  credential_code TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  won_by_email TEXT
);

-- 4. Bảng Spin History (Lịch sử đối soát)
CREATE TABLE spin_history (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  prize_name TEXT NOT NULL,
  won_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Kích hoạt Realtime cho bảng profiles (để cập nhật lượt quay tức thì)
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sửa cột id để nó tự động sinh UUID khi có row mới
ALTER TABLE profiles 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();