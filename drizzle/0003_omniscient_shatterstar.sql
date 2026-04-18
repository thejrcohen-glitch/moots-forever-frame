CREATE TABLE `configurator_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`territory` enum('TX','OK','AR') NOT NULL,
	`useCase` varchar(64) NOT NULL,
	`terrain` varchar(64) NOT NULL,
	`budget` varchar(32) NOT NULL,
	`recommendedModel` varchar(128) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `configurator_leads_id` PRIMARY KEY(`id`)
);
