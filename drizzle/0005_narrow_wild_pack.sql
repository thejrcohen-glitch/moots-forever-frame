CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailNotifications` tinyint NOT NULL DEFAULT 1,
	`inAppNotifications` tinyint NOT NULL DEFAULT 1,
	`territory` enum('TX','OK','AR','ALL') NOT NULL DEFAULT 'ALL',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('rsvp','booking','community_upload','lead','admin_message','event_reminder','dealer_announcement') NOT NULL,
	`title` varchar(256) NOT NULL,
	`message` text NOT NULL,
	`territory` enum('TX','OK','AR','ALL') NOT NULL DEFAULT 'ALL',
	`relatedId` int,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD CONSTRAINT `notification_preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;