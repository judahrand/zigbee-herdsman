CREATE TABLE `device` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`ieee_address` text NOT NULL,
	`network_address` integer NOT NULL,
	`manufacturer_id` integer,
	`manufacturer_name` text,
	`power_source` text,
	`model_id` text,
	`endpoint_ids` blob NOT NULL,
	`endpoints` blob NOT NULL,
	`application_version` integer,
	`stack_version` integer,
	`hardware_version` integer,
	`date_code` text,
	`software_build_id` text,
	`zcl_version` integer,
	`interview_completed` integer NOT NULL,
	`metadata` blob DEFAULT '{}' NOT NULL,
	`last_seen` integer,
	`checkin_interval` integer
);
--> statement-breakpoint
CREATE TABLE `group` (
	`id` integer PRIMARY KEY NOT NULL,
	`group_id` integer NOT NULL,
	`members` blob DEFAULT '[]' NOT NULL,
	`metadata` blob DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `type_idx` ON `device` (`type`);--> statement-breakpoint
CREATE INDEX `ieeeAddr_idx` ON `device` (`ieee_address`);--> statement-breakpoint
CREATE UNIQUE INDEX `group_group_id_unique` ON `group` (`group_id`);