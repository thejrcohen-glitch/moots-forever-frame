CREATE TABLE `event_rsvps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`eventTitle` varchar(256) NOT NULL,
	`eventDate` varchar(32) NOT NULL,
	`territory` enum('TX','OK','AR') NOT NULL,
	`riderName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_rsvps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `community_photos` MODIFY COLUMN `approved` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending';