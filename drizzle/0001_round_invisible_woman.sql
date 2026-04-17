CREATE TABLE `community_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`riderName` varchar(128) NOT NULL,
	`territory` enum('TX','OK','AR') NOT NULL,
	`location` varchar(256) NOT NULL,
	`venue` varchar(256),
	`mootsModel` varchar(128),
	`caption` text,
	`imageUrl` text NOT NULL,
	`imageKey` text NOT NULL,
	`approved` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_photos_id` PRIMARY KEY(`id`)
);
