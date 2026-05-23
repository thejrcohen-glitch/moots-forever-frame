CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`personName` varchar(128) NOT NULL,
	`organization` varchar(256) NOT NULL,
	`territory` enum('TX','OK','AR','CH') NOT NULL,
	`quote` text NOT NULL,
	`imageUrl` text,
	`imageKey` text,
	`status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`verifiedAt` timestamp,
	`verifiedBy` varchar(64),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
