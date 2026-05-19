CREATE TABLE `bike_models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`modelId` varchar(50) NOT NULL,
	`name` varchar(256) NOT NULL,
	`category` enum('gravel','adventure','legacy') NOT NULL,
	`description` text,
	`useCase` varchar(256),
	`terrainFocus` varchar(256),
	`keyFeatures` text,
	`priceUsd` varchar(32),
	`imageUrl` text,
	`imageKey` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bike_models_id` PRIMARY KEY(`id`),
	CONSTRAINT `bike_models_modelId_unique` UNIQUE(`modelId`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`territory` enum('TX','OK','AR','CH','ALL') NOT NULL DEFAULT 'ALL',
	`subscribed` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `photo_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photoId` int NOT NULL,
	`tagName` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photo_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`routeId` varchar(50) NOT NULL,
	`name` varchar(256) NOT NULL,
	`territory` enum('TX','OK','AR','CH') NOT NULL,
	`region` varchar(256) NOT NULL,
	`distanceKm` varchar(32),
	`elevationGainM` varchar(32),
	`terrainType` varchar(256),
	`gpxSourceUrl` text,
	`description` text,
	`mootsInsiderTip` text,
	`verificationStatus` enum('unverified','verified','disputed') NOT NULL DEFAULT 'unverified',
	`verifiedBy` varchar(128),
	`verifiedAt` timestamp,
	`verificationNotes` text,
	`sourceUrl` text,
	`sourceAttribution` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `routes_id` PRIMARY KEY(`id`),
	CONSTRAINT `routes_routeId_unique` UNIQUE(`routeId`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dealerName` varchar(256) NOT NULL,
	`company` varchar(256),
	`territory` enum('TX','OK','AR','CH') NOT NULL,
	`quote` text NOT NULL,
	`imageUrl` text,
	`imageKey` text,
	`featured` tinyint NOT NULL DEFAULT 0,
	`displayOrder` varchar(32) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `territory` enum('TX','OK','AR','CH') NOT NULL;--> statement-breakpoint
ALTER TABLE `community_photos` MODIFY COLUMN `territory` enum('TX','OK','AR','CH') NOT NULL;--> statement-breakpoint
ALTER TABLE `configurator_leads` MODIFY COLUMN `territory` enum('TX','OK','AR','CH') NOT NULL;--> statement-breakpoint
ALTER TABLE `event_rsvps` MODIFY COLUMN `territory` enum('TX','OK','AR','CH') NOT NULL;--> statement-breakpoint
ALTER TABLE `photo_tags` ADD CONSTRAINT `photo_tags_photoId_community_photos_id_fk` FOREIGN KEY (`photoId`) REFERENCES `community_photos`(`id`) ON DELETE cascade ON UPDATE no action;