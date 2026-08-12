CREATE TABLE `coin_research` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coinId` varchar(128) NOT NULL,
	`displayName` varchar(160) NOT NULL,
	`summary` text,
	`assetBacking` text,
	`utilitySummary` text,
	`interestExposure` enum('unknown','none_stated','present') NOT NULL DEFAULT 'unknown',
	`speculationExposure` enum('unknown','low','elevated') NOT NULL DEFAULT 'unknown',
	`transparencyState` enum('unknown','limited','documented') NOT NULL DEFAULT 'unknown',
	`screeningStatus` enum('needs_scholar_review','research_incomplete','higher_risk_flags') NOT NULL DEFAULT 'needs_scholar_review',
	`evidenceNote` text,
	`sourceUrl` varchar(500),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coin_research_id` PRIMARY KEY(`id`),
	CONSTRAINT `coin_research_coinId_unique` UNIQUE(`coinId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
