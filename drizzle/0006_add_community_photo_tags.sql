-- Additive migration: add `tags` column to community_photos.
-- Stores a JSON-encoded array of tag slugs (e.g. '["gravel","coffee"]').
-- Nullable so existing rows continue to work without backfill.
ALTER TABLE `community_photos` ADD `tags` text;
