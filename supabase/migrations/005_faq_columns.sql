-- Add FAQ JSONB columns to products and blog_posts
-- FAQ structure: [{ "question": "...", "answer": "..." }]

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN products.faq IS 'Array of FAQ items: [{question, answer}]. Used for FAQPage JSON-LD and AI discovery.';
COMMENT ON COLUMN blog_posts.faq IS 'Array of FAQ items: [{question, answer}]. Used for FAQPage JSON-LD and AI discovery.';
