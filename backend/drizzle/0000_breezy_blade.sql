CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"youtube_id" varchar(64) NOT NULL,
	"channel_id" varchar(64) NOT NULL,
	"original_title" text NOT NULL,
	"new_title" text NOT NULL,
	"reason" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
