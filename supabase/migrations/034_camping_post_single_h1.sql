-- The camping checklist post carried its own <h1> inside the content, while
-- the blog page already renders the post title as the H1, so the page had two.
-- The page H1 stays; the one inside the content goes.

UPDATE blog_posts SET
  content = regexp_replace(content, '<h1>[^<]*</h1>\s*', '')
WHERE slug = 'sto-ponijeti-na-kampiranje'
  AND content LIKE '%<h1>%';
