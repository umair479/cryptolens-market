CREATE TABLE `user_watchlist_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coinId` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_watchlist_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_watchlist_coin_unique` UNIQUE(`userId`,`coinId`)
);
