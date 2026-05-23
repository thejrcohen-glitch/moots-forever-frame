-- Add status, popUpCity, popUpVenue columns to bookings.
-- Existing rows backfill to status='pending' (default). City/venue are nullable.
ALTER TABLE `bookings` ADD COLUMN `popUpCity` varchar(128);
ALTER TABLE `bookings` ADD COLUMN `popUpVenue` varchar(256);
ALTER TABLE `bookings` ADD COLUMN `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending';
