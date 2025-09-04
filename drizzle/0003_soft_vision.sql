ALTER TABLE "contacts" RENAME COLUMN "amount_owed_by_me" TO "amount_borrowed";--> statement-breakpoint
ALTER TABLE "contacts" RENAME COLUMN "amount_owed_to_me" TO "amount_lent";