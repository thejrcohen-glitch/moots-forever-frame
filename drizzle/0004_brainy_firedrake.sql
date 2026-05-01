CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`riderName` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`territory` enum('TX','OK','AR') NOT NULL,
	`popUpDate` varchar(32) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
