-- 003_fix_data.sql
-- Fix category colors to match new design palette
-- Fix is_featured for homepage showcase products

-- Update category colors
UPDATE categories SET color = '#01D2D6' WHERE slug = 'audio-video-oprema';
UPDATE categories SET color = '#FF6B6B' WHERE slug = 'oprema-za-evente';
UPDATE categories SET color = '#FF8E6C' WHERE slug = 'rostilj-kuhanje';
UPDATE categories SET color = '#6EE7B7' WHERE slug = 'kamp-outdoor';
UPDATE categories SET color = '#FFD166' WHERE slug = 'alati-ciscenje';
UPDATE categories SET color = '#BCA7F0' WHERE slug = 'ostalo';

-- Set 8 diverse products as featured for homepage showcase
UPDATE products SET is_featured = true, sort_order = 1 WHERE slug = 'plinska-pec-za-pizzu-ooni-16';
UPDATE products SET is_featured = true, sort_order = 2 WHERE slug = 'ledomat';
UPDATE products SET is_featured = true, sort_order = 3 WHERE slug = 'akcijska-kamera-gopro-hero-10';
UPDATE products SET is_featured = true, sort_order = 4 WHERE slug = 'projektor-sa-platnom';
UPDATE products SET is_featured = true, sort_order = 5 WHERE slug = 'cornhole';
UPDATE products SET is_featured = true, sort_order = 6 WHERE slug = 'firepit-bonfire-20';
UPDATE products SET is_featured = true, sort_order = 7 WHERE slug = 'prenosivi-razanj-s-motorom';
UPDATE products SET is_featured = true, sort_order = 8 WHERE slug = 'tocionik-za-pivo-6l';
