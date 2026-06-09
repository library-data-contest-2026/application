-- ============================================================
-- 게시물 통합 검색 RPC
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

CREATE OR REPLACE FUNCTION search_posts(q TEXT)
RETURNS TABLE (
  id            UUID,
  category_id   TEXT,
  book_title    TEXT,
  book_author   TEXT,
  book_year     INT,
  cover_color   TEXT,
  content       TEXT,
  tags          TEXT[],
  like_count    INT,
  comment_count INT,
  created_at    TIMESTAMPTZ,
  categories    JSONB
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    p.id,
    p.category_id,
    p.book_title,
    p.book_author,
    p.book_year,
    p.cover_color,
    p.content,
    p.tags,
    p.like_count,
    p.comment_count,
    p.created_at,
    jsonb_build_object(
      'id',          c.id,
      'name',        c.name,
      'avatar',      c.avatar,
      'description', c.description
    ) AS categories
  FROM posts p
  JOIN categories c ON p.category_id = c.id
  WHERE
    p.book_title  ILIKE '%' || q || '%' OR
    p.book_author ILIKE '%' || q || '%' OR
    p.content     ILIKE '%' || q || '%' OR
    c.name        ILIKE '%' || q || '%' OR
    array_to_string(p.tags, ' ') ILIKE '%' || q || '%'
  ORDER BY p.like_count DESC
  LIMIT 20;
$$;
