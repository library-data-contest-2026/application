-- ============================================================
-- LibFeed Schema
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILES (auth.users 확장)
-- ------------------------------------------------------------
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. CATEGORIES (분야별 채널)
-- ------------------------------------------------------------
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,  -- 'korean-classic', 'science' 등
  name        TEXT NOT NULL,
  description TEXT,
  avatar      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. POSTS (책 포스트)
-- ------------------------------------------------------------
CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   TEXT REFERENCES categories(id) ON DELETE SET NULL,
  book_title    TEXT NOT NULL,
  book_author   TEXT NOT NULL,
  book_year     INT,
  cover_color   TEXT,
  content       TEXT,
  tags          TEXT[],
  like_count    INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. LIKES
-- ------------------------------------------------------------
CREATE TABLE likes (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- 좋아요 수 자동 동기화 트리거
CREATE OR REPLACE FUNCTION sync_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_like_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION sync_like_count();

-- ------------------------------------------------------------
-- 5. COMMENTS
-- ------------------------------------------------------------
CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 댓글 수 자동 동기화 트리거
CREATE OR REPLACE FUNCTION sync_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION sync_comment_count();

-- ------------------------------------------------------------
-- 6. CATEGORY FOLLOWS (채널 팔로우)
-- ------------------------------------------------------------
CREATE TABLE category_follows (
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, category_id)
);

-- ------------------------------------------------------------
-- 7. FRIENDSHIPS
-- ------------------------------------------------------------
CREATE TABLE friendships (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status       TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (requester_id, addressee_id)
);

-- ------------------------------------------------------------
-- 8. TROPHIES (트로피 정의)
-- ------------------------------------------------------------
CREATE TABLE trophies (
  id          TEXT PRIMARY KEY,  -- 'quiz_master', 'bookworm' 등
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,              -- 이모지 또는 이미지 URL
  rarity      TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common'
);

-- ------------------------------------------------------------
-- 9. USER TROPHIES (유저가 획득한 트로피)
-- ------------------------------------------------------------
CREATE TABLE user_trophies (
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trophy_id  TEXT REFERENCES trophies(id) ON DELETE CASCADE,
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, trophy_id)
);

-- ------------------------------------------------------------
-- 10. QUIZZES (미니퀴즈)
-- ------------------------------------------------------------
CREATE TABLE quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  post_id     UUID REFERENCES posts(id) ON DELETE SET NULL,  -- 특정 책 포스트와 연결 가능
  difficulty  TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 11. QUIZ QUESTIONS
-- ------------------------------------------------------------
CREATE TABLE quiz_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  options       JSONB NOT NULL,   -- ["보기1", "보기2", "보기3", "보기4"]
  correct_index INT NOT NULL,     -- 0-based
  explanation   TEXT,
  order_index   INT DEFAULT 0
);

-- ------------------------------------------------------------
-- 12. QUIZ ATTEMPTS (퀴즈 시도 기록)
-- ------------------------------------------------------------
CREATE TABLE quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id         UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score           INT DEFAULT 0,
  total_questions INT NOT NULL,
  completed_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
CREATE INDEX idx_posts_category   ON posts(category_id);
CREATE INDEX idx_likes_post       ON likes(post_id);
CREATE INDEX idx_comments_post    ON comments(post_id);
CREATE INDEX idx_friendships_req  ON friendships(requester_id);
CREATE INDEX idx_friendships_addr ON friendships(addressee_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trophies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts  ENABLE ROW LEVEL SECURITY;

-- profiles: 누구나 읽기 가능, 본인만 수정
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- likes: 본인 것만 insert/delete, 누구나 읽기
CREATE POLICY "likes_select" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete" ON likes FOR DELETE USING (auth.uid() = user_id);

-- comments: 누구나 읽기, 본인만 작성/삭제
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (auth.uid() = user_id);

-- category_follows: 본인 것만
CREATE POLICY "category_follows_select" ON category_follows FOR SELECT USING (true);
CREATE POLICY "category_follows_insert" ON category_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "category_follows_delete" ON category_follows FOR DELETE USING (auth.uid() = user_id);

-- friendships: 본인이 포함된 것만 읽기/수정
CREATE POLICY "friendships_select" ON friendships FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "friendships_insert" ON friendships FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "friendships_update" ON friendships FOR UPDATE USING (auth.uid() = addressee_id);
CREATE POLICY "friendships_delete" ON friendships FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- user_trophies: 누구나 읽기
CREATE POLICY "user_trophies_select" ON user_trophies FOR SELECT USING (true);

-- quiz_attempts: 본인 것만
CREATE POLICY "quiz_attempts_select" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_attempts_insert" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
